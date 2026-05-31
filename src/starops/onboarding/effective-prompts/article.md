---
pageClass: sls-starops-article
status: published
journey: 入门起步
id: effective-prompts
title: 与 STAROps 有效对话
---

<div class="sls-starops-article-crumb">
  <a href="/doc/starops/">STAROps</a> <span class="sep">/</span> <span>入门起步</span>
</div>

# 与 STAROps 有效对话

<div class="sls-starops-article-meta">
  <span>分类 · 入门起步</span>
</div>

在 STAROps 里，prompt 决定 Agent 取哪些数据、调用哪些 Skill、关联到哪些 UModel 实体。把实体名、时间窗和期望结论写清楚，单轮问答就能拿到可用判断；像"系统慢"这种笼统问法，Agent 只能在过宽的数据范围里反复试探，结果也难复用。

下面 6 条原则覆盖了在 STAROps 里写 prompt 的常见取舍，每条配「反例 → 正例」对照。

## 原则一：显式指定实体

让 Agent 跳过"猜对象"这一步。服务名、实例 ID、应用名、时间范围都是 UModel 可解析的实体，写明白即可。

- ❌ 反例：`帮我看下系统最近怎么样`
- ✅ 正例：`@应用-checkout 看最近 1h 的核心业务指标（QPS / 成功率 / P99 延迟）是否偏离前 7 天基线`

实体不明确时 Agent 的搜索面过大，结果会被稀释，且容易选错切入点。

## 原则二：用业务意图，不用查询语法

直接用业务意图描述目标即可，PromQL、SQL、过滤表达式这些 Agent 会在内部自行处理。

- ❌ 反例：`sum(rate(http_requests_total{service="checkout",status=~"5.."}[5m])) by (instance)`
- ✅ 正例：`@应用-checkout 最近 1h 各实例的 5xx 错误率，标出哪些超过 1%`

用业务意图表达后，Agent 会自动完成选指标、聚合、判定的工作。

## 原则三：在同一 thread 内累积上下文

每个 thread 是 Agent 的一段记忆。多轮对话共享同一上下文，Agent 自动复用前轮结论。新开 thread 等于从零开始。

- ❌ 反例：在新 thread 提问 `刚才那个慢查询继续看下应用层`（Agent 看不到"刚才"）
- ✅ 正例：在原 thread 续问 `基于上面的慢查询结论，关联最近 1h 的应用层错误率与实例 CPU，定位哪些应用受影响`

涉及多步深入分析（如业务可靠性守护的 5 Phase）时，建议保持在同一 thread 内串起来；新开 thread 后每个 Phase 都需要重新提供前序结果。

## 原则四：给出可验收的输出形态

在 prompt 末尾写清"期望产出什么"，让 Agent 直接给可执行结论，而不是泛泛分析。

- ❌ 反例：`分析下这个服务的健康状况`
- ✅ 正例：`分析 @应用-checkout 最近 1h 的健康状况，输出：① 总体状态表（指标 / 当前值 / 基线 / 是否偏离）；② 偏离指标按严重程度排序；③ 是否需要立即介入的判定（是/否，附理由）`

明确产出形态能避免 Agent 输出大段叙述、用户还要二次摘录的情况。

## 原则五：缺失数据用 prompt 兜底

如果某类数据源没接入或采样不全（如 trace 采样率低、告警未接入），把已知信息直接补在 prompt 末尾，Agent 会优先采用。

- ❌ 反例：在 trace 不全的环境直接问 `给我画出 checkout 的依赖拓扑`（Agent 会画出残缺图但不会主动提示残缺）
- ✅ 正例：`画出 @应用-checkout 的依赖拓扑。已知依赖：checkout → payment、checkout → inventory、frontend → checkout。如在 trace 中发现额外依赖请合并`

显式兜底比让 Agent 在残缺数据里推断更可靠，结果也更可复现。

## 原则六：调用 Skill 用 "/" 显式触发

业务 Skill（如 RDS 巡检、k8s 巡检）建议用 `/` 显式调用。

- ❌ 反例：`帮我巡检下 RDS`（Agent 可能走通用排查路径，或反复要求补上下文）
- ✅ 正例：`使用 /aliyun rds 巡检 skill 对 region=cn-beijing project=my-project metricstore=rds-monitoring 执行健康巡检`

`/` 调用会直接进入 Skill 既定流程，参数走 Skill 已声明的 schema，执行更稳定、输出更结构化。

## prompt 模板

落到具体场景，下面三个模板可直接套用：

**单服务健康检查**

```
@应用-<服务名> 看最近 <时间范围> 的 <指标列表> 是否偏离 <基线>，
偏离的指标按严重程度排序，并给出是否需要立即介入的判定。
```

**跨服务影响分析**（同 thread 内续问）

```
基于上面的 <前序结论>，关联 <下一层数据范围>，
定位哪些 <实体类型> 异常可能影响 <业务指标>。
```

**调用既定 Skill**

```
使用 /<skill 名称> 对 <参数1>=<值> <参数2>=<值> 执行 <动作>。
要求：<输出格式 / 分级 / 附加字段>。
```

## 常见问题

### prompt 是越长越好吗

不是。prompt 长度匹配任务复杂度即可：单一查询一句话足够，多步骤分析才需要写明产出形态和兜底信息。冗长的 prompt 反而会让 Agent 在无关条件上过度匹配。

### 不知道准确的服务名怎么办

先在 STAROps 控制台的"应用列表 / 实例列表"里查一遍，把准确名字带入 prompt。如果只能给出业务名（如"支付服务"），Agent 会尝试用 UModel 模糊匹配，但准确性不如直接指明服务名。

### `@` 提及和直接写服务名有什么区别

`@应用-<服务名>` 是 STAROps 的实体提及语法，会直接绑定到 UModel 中的对应实体，Agent 后续所有指标查询都默认在这个实体范围内。直接写服务名 Agent 也能解析，但作用范围弱一些，多个同名服务时容易选错。

### 该让 Agent 自由探索，还是人显式分 Phase

按需选择。简单场景（"看下 checkout 是否正常"）让 Agent 自由发挥即可；复杂场景（业务可靠性守护、告警 RCA）建议人显式分 Phase，每个 Phase 输入输出明确，便于复盘和归档。

### 输出和预期不一致怎么办

直接在同 thread 内追问"调整为以下形态：…"。Agent 会基于已有上下文重新组织输出，不会丢失前序分析，比新开 thread 重提一遍更省力。

## 相关入口

- [返回 STAROps 最佳实践首页](/starops/)
- [打开 STAROps Playground](/playground/staropsdemo.html)
- [进入 STAROps 控制台](https://starops.console.aliyun.com)
