# 日志模式定时巡检报告（真实样例）

> **来源**：2026-06-03 11:24 在 STAROps 控制台「日志模式洞察」场景卡 1 击建任务后，AI 编排配置 + cron 触发第 2 轮（11:24:00）真实产物，由 Mission 自动写入 `artifacts/2026-06/inspection-report-2026-06-03-11-24.md`，邮件通知同步送达。
>
> **打码说明**：项目哈希 `k8s-log-<project-hash>` 替换原始内部 project 名；其他业务字段（demo-logs / PostgreSQL / OpenFeature / nginx 等）为公开开源中间件 / 测试场景关键词，不打码。
>
> **窗口说明（重要）**：本样例使用 3 min 短窗口（11:21~11:24 当前 vs 11:18~11:21 对比）是因为 demo-logs 刚接入数据，历史不足以做小时 / 天级对比。**真实生产场景应使用 `-1h` / `-1d` 等正常窗口**，详见 article.md「常见问题」段「数据量预检」与「冷启动 / 短窗口验证」。

## 元信息

| 字段 | 值 |
|------|------|
| 触发时刻 | 2026-06-03 11:24:00 |
| 时区 | Asia/Shanghai |
| 日志库 | k8s-log-\<project-hash\> / demo-logs |
| 当前窗口 | 2026-06-03 11:21:00 ~ 2026-06-03 11:24:00 |
| 对比窗口 | 2026-06-03 11:18:00 ~ 2026-06-03 11:21:00 |
| 聚类字段 | content |
| 过滤条件 | (ERROR or WARN) not chaos-daemon |

## 巡检概览

| 指标 | 值 |
|------|------|
| 总模式数 | 64 |
| 总事件数 | 320 |
| Top1 占比 | 11.25% |
| Top5 占比 | 49.39% |
| 是否采样 | 否 |
| 对比模式 | 成功 |

## 日志库巡检详情

### k8s-log-\<project-hash\> / demo-logs

#### 模式对比分析

| 排名 | 模式摘要 | 级别 | 当前事件数 | 当前占比 | 变化状态 | 差异 |
|------|----------|------|-----------|---------|---------|------|
| 1 | `FATAL: could not receive data from WAL stream: ERROR: requested WAL segment <*> has already been removed` | ERROR | 36 | 11.25% | STABLE | 0 |
| 2 | `ERROR: requested WAL segment <*> has already been removed` | ERROR | 36 | 11.25% | STABLE | 0 |
| 3 | `failed to get the environment id` | ERROR | 30 | 9.38% | DECREASED | -2 (-6.25%) |
| 4 | `failed to init the environment` | ERROR | 30 | 9.38% | DECREASED | -2 (-6.25%) |
| 5 | `failed to install the addon` | ERROR | 30 | 9.38% | DECREASED | -2 (-6.25%) |
| 6 | `Unable to correctly evaluate` (OpenFeature) | ERROR | 26 | 8.13% | INCREASED | +2 (+8.33%) |
| 7 | `Failed to detach context` | ERROR | 18 | 5.63% | DECREASED | -2 (-10%) |
| 8 | `Could not parse target name ""` | ERROR | 18 | 5.63% | STABLE | 0 |
| 9 | `Internal Server Error` | ERROR | 12 | 3.75% | DECREASED | -2 (-14.29%) |
| 10 | `open() "<*>" failed (No such file or directory)` | ERROR | 10 | 3.13% | INCREASED | +1 (+11.11%) |

#### 模式变更详情

**新增模式**（当前窗口出现，对比窗口未出现）：
- 无显著新增模式

**消失模式**（对比窗口出现，当前窗口未出现）：
- `env.go:<*>: [WARN]python lib path <*> is not available`（上一轮 654 条，本轮未出现）

**显著变化模式**：

| 模式 | 变化类型 | 变化幅度 | 风险说明 |
|------|---------|---------|---------|
| OpenFeature 评估失败 | INCREASED | +8.33% | 功能开关评估异常增加 |
| nginx 文件不存在错误 | INCREASED | +11.11% | 客户端请求资源缺失 |
| 环境初始化失败系列 | DECREASED | -6.25% | 略有改善，但仍持续 |
| Failed to detach context | DECREASED | -10% | 略有改善 |
| Internal Server Error | DECREASED | -14.29% | 略有改善 |

#### 分析结论

**当前窗口日志特征**：
- 当前窗口（11:21-11:24）共采集到 320 条 ERROR/WARN 日志（已排除 chaos-daemon 噪音）
- 共识别出 64 个日志模式，对比模式执行成功
- 未触发采样，结果可信

**关键风险模式**：

1. **PostgreSQL WAL 段丢失**（排名 1-2，72 条，22.5%）
   - 变化状态：STABLE（与对比窗口持平，各 36 条）
   - 影响：PostgreSQL 流复制持续中断，从库数据不一致风险
   - 建议：立即检查 PostgreSQL WAL 归档配置和磁盘空间

2. **环境初始化失败**（排名 3-5，90 条，28.14%）
   - 变化状态：DECREASED（较对比窗口各减少 2 条）
   - 影响：addon 安装失败，环境绑定冲突
   - 趋势：略有改善，但问题持续存在

3. **OpenFeature 评估失败**（排名 6，26 条，8.13%）
   - 变化状态：INCREASED（较对比窗口增加 2 条，+8.33%）
   - 影响：功能开关评估异常增加
   - 建议：检查 OpenFeature provider 配置和连接状态

4. **Python lib path 警告**（已消失）
   - 上一轮 654 条，本轮未出现
   - 可能为间歇性问题或已修复

#### 单库风险评估

**健康度判断**：存在风险（部分指标改善）

**风险提示**：
1. PostgreSQL WAL 段丢失问题持续稳定出现，需优先处理
2. OpenFeature 评估失败呈上升趋势
3. 环境初始化失败略有改善但仍持续
4. Python lib path 警告本轮未出现，需持续观察是否复发

## 总结与建议

### 各库一句话总结

- **demo-logs**：320 条 ERROR/WARN 日志，PostgreSQL WAL 丢失持续稳定，OpenFeature 错误上升，环境初始化失败略有改善。

### 需关注事项

1. **PostgreSQL WAL 段丢失**：持续稳定出现，流复制中断风险未解除
2. **OpenFeature 评估失败**：呈上升趋势（+8.33%），需关注
3. **Python lib path 警告**：本轮消失，需观察是否复发
4. **nginx 文件不存在错误**：小幅上升（+11.11%），检查资源配置

### 对比分析结论

- 整体错误量从上一轮的 909 条下降到本轮 320 条（过滤条件一致，时间窗口相同）
- 主要改善来自 Python lib path 警告消失（-654 条）
- PostgreSQL WAL 问题和环境初始化问题持续存在，需重点跟进
