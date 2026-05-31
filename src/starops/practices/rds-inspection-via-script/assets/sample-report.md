# RDS 数据库实例健康巡检报告

> **巡检时间**: 2026-05-26 14:00 (Asia/Shanghai)
> **巡检范围**: 最近 1 小时 (last_1h)
> **实例数量**: 14 个 RDS MySQL 实例
> **巡检维度**: 核心指标、性能、安全

## 健康状态总览

| 状态 | 数量 | 说明 |
|------|------|------|
| 🟢 正常 | 14 | 各项指标正常，未发现异常 |
| 🟡 警告 | 0 | 存在 P3/P4 事件 |
| 🔴 严重 | 0 | 存在 P1/P2 事件 |

**整体健康度**: 🟢 **正常** — 本次巡检覆盖 19 项检查（核心指标 7 项、性能 6 项、安全 6 项），均未发现 P1/P2/P3/P4 级别异常。

## 异常项汇总

本次巡检**未发现任何异常项**，所有巡检项均通过。

### P1 紧急
> 无异常

### P2 错误
> 无异常

### P3 警告
> 无异常

## 分维度详情

### 核心指标

| 巡检项 | 状态 | 异常实例数 | 说明 |
|--------|------|-----------|------|
| CPU 使用率 (>80%) | ✅ 通过 | 0 | 未发现 CPU 使用率超过 80% 的实例 |
| 内存使用率 (>85%) | ✅ 通过 | 0 | 未发现内存使用率超过 85% 的实例 |
| 磁盘使用率 (>80%) | ✅ 通过 | 0 | 未发现磁盘使用率超过 80% 的实例 |
| IOPS 使用率 (>80%) | ✅ 通过 | 0 | 未发现 IOPS 使用率超过 80% 的实例 |
| 连接数使用率 (>80%) | ✅ 通过 | 0 | 未发现连接数使用率超过 80% 的实例 |
| 实例状态 | ✅ 通过 | 0 | 所有实例状态正常 (Running) |
| 复制延迟 (>10s) | ✅ 通过 | 0 | 未发现只读实例复制延迟超过 10 秒 |

### 性能

| 巡检项 | 状态 | 异常实例数 | 说明 |
|--------|------|-----------|------|
| 慢查询 (5min>10次) | ✅ 通过 | 0 | 未发现慢查询数量过多的实例 |
| 锁等待 (>5) | ✅ 通过 | 0 | 未发现锁等待过多的实例 |
| 缓冲池命中率 (<95%) | ✅ 通过 | 0 | 未发现缓冲池命中率过低的实例 |
| 临时表使用率 (>20%) | ✅ 通过 | 0 | 未发现临时表使用率过高的实例 |
| QPS 突增 (>1000) | ✅ 通过 | 0 | 未发现 QPS 突增的实例 |
| 响应延迟 (>100ms) | ✅ 通过 | 0 | 未发现响应延迟过高的实例 |

### 安全

| 巡检项 | 状态 | 异常实例数 | 说明 |
|--------|------|-----------|------|
| SSL 连接 | ✅ 通过 | 0 | 未发现 SSL 连接未启用的实例 |
| 公网访问 | ✅ 通过 | 0 | 未发现存在公网访问风险的实例 |
| 备份状态 | ✅ 通过 | 0 | 未发现备份失败的实例 |
| 备份保留天数 (<7天) | ✅ 通过 | 0 | 未发现备份保留天数不足的实例 |
| 审计日志 | ✅ 通过 | 0 | 未发现审计日志未启用的实例 |
| 高权限账号 | ✅ 通过 | 0 | 未发现高权限账号风险的实例 |

## 巡检统计

| 维度 | 巡检项数 | 通过 | 异常 | 无数据 | 错误 |
|------|---------|------|------|--------|------|
| 核心指标 | 7 | 7 | 0 | 0 | 0 |
| 性能 | 6 | 6 | 0 | 0 | 0 |
| 安全 | 6 | 6 | 0 | 0 | 0 |
| **合计** | **19** | **19** | **0** | **0** | **0** |

## 覆盖实例清单

| 实例 ID | 实例名称 | 规格 | 引擎 |
|---------|---------|------|------|
| rm-j6c32m8qh2up7jq1j | o11y-integration-cn-hongkong | 8GB | MySQL |
| rm-j6cq30r96ye8na6u0 | otel-demo-rds-cn-hongkong | 8GB | MySQL |
| rm-j6c6pi84zwu2vd56h | (无名称) | 2GB | MySQL |
| rm-j6c46o8y4euju9j55 | o11y-aiops-demo-cn-hongkong | 1GB | MySQL |
| rm-j6c3l32c730ti37ur | otel_demo | 8GB | MySQL |
| rm-j6c22np805ya348q1 | cms-demo-rds-cn-hongkong | 16GB | MySQL |
| rm-j6cv0403p0vfz6vz2 | u4-demo-cn-hongkong | 8GB | MySQL |
| rm-j6cpw11czx942j35f | qs-mysql-chaos | 1GB | MySQL |
| rm-j6c59e2854923nh9m | (无名称) | 8GB | MySQL |
| rm-j6ck72m594ab7fc35 | u4-test-demo-cn-hongkong | 8GB | MySQL |
| rm-j6c5tn23305nkv72q | o11y-demo-cn-hongkong-default_vip | 8GB | MySQL |
| rm-j6cro90eaqh1rch5h | o11y-demo-cn-hongkong-default | 16GB | MySQL |
| rm-j6cyiek1t5t7p01m5 | siyi-demo-rds-cn-hongkong | 8GB | MySQL |
| rm-j6c545mj6glzl96hy | u4-agent-demo-cn-hongkong | 8GB | MySQL |

## 附录

### 巡检环境

- **Workspace**: default-cms-1819385687343877-cn-hongkong
- **地域**: cn-hongkong
- **SLS Project**: workspace-default-cms-1819385687343877-cn-hongkong
- **MetricStore**: aliyun-prom-rw-530b7df049fbb81cc8b5134be1e9
- **时间范围**: last_1h

### 巡检脚本

- 核心指标巡检：`rds-core-inspection.py`（7 项）
- 性能巡检：`rds-performance-inspection.py`（6 项）
- 安全巡检：`rds-security-inspection.py`（6 项）
