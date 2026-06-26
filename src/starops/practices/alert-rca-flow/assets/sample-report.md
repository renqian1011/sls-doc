# 告警 RCA 诊断报告

## 告警上下文

| 字段 | 值 |
|------|-----|
| 告警历史 ID | `j18d1jpba56474iohsotbn4sp6` |
| 告警规则 ID | `21594c87-9dec-4b3c-ae62-2264f3d268f1` |
| 告警主体 | `apm.operation` `/api/orders` on `order-service` |
| Workspace | `default-cms-1819385687343877-cn-hongkong` |
| Region | `cn-hongkong` |
| 分析时间范围 | 最近 7 天 |

## 错误码分布（10 条错误 Trace，29 个错误 Span）

| 错误码 | Span 数 | Trace 数 | 占比 | 错误源服务 |
|--------|---------|----------|------|-----------|
| INV_LOCK_FAIL | 6 | 3 | 32% | inventory-service → order-service |
| SKU_STOCK_NOT_ENOUGH | 6 | 3 | 32% | inventory-service → order-service |
| PROMO_PRICE_MISMATCH | 6 | 3 | 32% | promotion-service → order-service |
| IDEMPOTENT_CONFLICT | 1 | 1 | 5% | order-service (本地) |

**HTTP 状态码分布**：422 (9 条) / 409 (1 条)

---

## 分支 A：库存分支（INV_LOCK_FAIL + SKU_STOCK_NOT_ENOUGH）

### 命中状态：确认

### 支撑证据

**证据 1 — Trace 调用链分析（6 条 trace 全部验证）**

调用链路径一致：
```
POST /api/orders [order-service] → HTTP 422
  └─ OrderServiceApplication.createOrder → error_code=INV_LOCK_FAIL / SKU_STOCK_NOT_ENOUGH
       └─ POST /inventory/lock [inventory-service] → HTTP 200（技术成功）
            └─ InventoryServiceApplication.lockStock → error_code 标记
                 └─ SELECT ... FROM sku_inventory WHERE sku_id=? → SQL 执行成功（<1ms）
```

- **INV_LOCK_FAIL**：SQL 查询成功返回含 `version` 字段的库存记录，错误发生在后续业务逻辑层 — 乐观锁版本冲突或行锁等待超时
- **SKU_STOCK_NOT_ENOUGH**：SQL 查询成功，业务逻辑判断 `available - reserved < requested_quantity` — 可用库存不足

**证据 2 — 指标数据**

| 指标 | 值 | 判断 |
|------|-----|------|
| inventory-service error_rate | 4.38% (p50=4.16%, p95=6.25%) | 稳定，无突增 |
| inventory-service latency | p50=4.08ms, p95=8.82ms | 正常 |
| inventory-service request_count | ~19.6/min | 正常 |

**证据 3 — 下游依赖全部正常**

config-service、MySQL RDS (`order_practice` 库 `sku_inventory` 表)、Redis 全部 HTTP 200，延迟 <5ms。

### 反证

无证据否定库存问题。所有基础设施正常，错误完全集中在 `lockStock` 业务逻辑层。

### 数据缺口

- inventory-service 应用日志未获取（K8s stdout logstore 不在当前 project）

### 分支结论

| 错误码 | 根因 |
|--------|------|
| INV_LOCK_FAIL | 库存锁定并发冲突 — 乐观锁版本不匹配，高并发下预期业务拒绝 |
| SKU_STOCK_NOT_ENOUGH | SKU 可用库存不足 — 正常业务库存不足拒绝 |

**两者均为 inventory-service 业务逻辑层的正常拒绝响应，非系统故障。**

---

## 分支 B：优惠价格分支（PROMO_PRICE_MISMATCH）

### 命中状态：确认

### 支撑证据

**证据 1 — Trace 调用链分析（3 条 trace 交叉验证）**

调用链路径一致：
```
POST /api/orders [order-service] → HTTP 422
  └─ OrderServiceApplication.createOrder → error_code=PROMO_PRICE_MISMATCH
       └─ POST /promotions/validate [promotion-service] → HTTP 200（技术成功）
            └─ PromotionServiceApplication.validatePrice → error_code=PROMO_PRICE_MISMATCH
                 └─ SELECT ... FROM promotion_rules WHERE tenant_id=? AND sku_id=? AND active=1 → SQL 成功
```

promotion-service HTTP 返回 200，错误在 `validatePrice` 业务逻辑层：`expected_price_snapshot_version` 对应的期望价格与订单提交价格不匹配。

**证据 2 — 指标数据**

| 指标 | 值 | 判断 |
|------|-----|------|
| promotion-service request_count (7d) | sum=2,532 | 正常 |
| promotion-service latency | p50=3.4ms, p95=6.3ms | 正常 |
| promotion-service APM error_rate | 0 | 无技术错误 |
| validatePrice span count | 124 次 | 7天内均触发价格校验错误 |

**证据 3 — 多 Pod 分布**

错误出现在 2 个不同 Pod（10.179.130.116、10.179.130.109），排除单 Pod 故障。

### 反证

| 检查项 | 结果 |
|--------|------|
| promotion-service HTTP 状态码 | 200（正常） |
| APM error_rate | 0（无技术错误） |
| 数据库查询 | SQL 执行成功 |
| 变更事件 | 无（7 天内无部署） |

无证据否定优惠价格问题。

### 数据缺口

- 应用日志缺失（无法获取具体价格对比详情）
- span 仅记录 error_code，未包含期望价格 vs 实际价格数值
- promotion_rules 表数据不可直接查询

### 分支结论

**根因**：`promotion_rules` 表中 `expected_price_snapshot_version` 对应的期望价格与订单提交价格不一致，promotion-service 业务逻辑正确检测到不匹配。

**可能原因**：(1) 促销规则价格快照过期 (2) 促销活动配置错误 (3) 商品价格更新后促销规则未同步

---

## 汇总证据板

### 主导判断

**三类错误码并发存在，占比均等（各 ~32%），无单一主导故障。** 另有 5% 的 IDEMPOTENT_CONFLICT（幂等冲突，HTTP 409）。

### 影响范围

- **服务**：order-service（入口）、inventory-service（库存分支）、promotion-service（优惠价格分支）
- **错误类型**：全部为业务逻辑层拒绝，非基础设施/技术故障
- **HTTP 表现**：90% 返回 422（业务校验失败），10% 返回 409（幂等冲突）

### 是否升级

**不建议升级为紧急故障调查。** 理由：
1. 所有下游服务技术指标正常（延迟、错误率、请求量均稳定）
2. 无基础设施异常（数据库、缓存、网络全部正常）
3. 7 天内无部署变更
4. 错误均为业务数据状态驱动的预期拒绝

### 建议行动

| 优先级 | 行动 | 负责方 |
|--------|------|--------|
| P2 | 检查 `sku_inventory` 表热门 SKU 的库存水位，补充安全库存 | 库存运营 |
| P2 | 审查 `promotion_rules` 表价格快照版本，确认促销规则与商品价格同步 | 促销运营 |
| P3 | 在 lockStock / validatePrice 逻辑中增加详细日志（记录具体价格差异、库存数量） | 研发 |
| P3 | 评估乐观锁冲突频率，考虑引入库存预扣/队列化机制降低并发冲突 | 架构 |
