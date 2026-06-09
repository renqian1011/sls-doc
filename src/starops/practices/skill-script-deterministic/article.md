---
pageClass: sls-starops-article
status: published
journey: 平台沉淀
id: skill-script-deterministic
title: 编写 Skill 确定性脚本
---

<div class="sls-starops-article-crumb">
  <a href="/doc/starops/starops.html">STAROps</a> <span class="sep">/</span> <span>平台沉淀</span>
</div>

# 编写 Skill 确定性脚本

<div class="sls-starops-article-meta">
  <span>分类 · 平台沉淀</span>
</div>

> [查看对话回放内容演示](/playground/skill-script-deterministic-replay.html)

本规范定义 STAROps Skill 中数值计算的确定性脚本写法，保证同输入同输出。

模型推理在两类计算上不可靠：

- **单位换算**：同一会话内两遍可能给出 1024 进制（1.00GB）或 1000 进制（1.07GB）不同答案
- **阈值与持续时间判断**：可能错算持续时间或漏掉 NaN 值

脚本化把这两类计算固化下来，跨次结果可复现、可回放。

## 前提条件

- 已开通 STAROps，账号可创建并运行数字员工 Skill。
- 已具备 Python 3.8+ 与基础脚本编写能力。
- 已识别 Skill 中包含的数值计算（单位换算 / 聚合 / 阈值判断 / Diff），并把它们与模型推理类任务（根因假设排序、跨域关联、经验综合）区分开。
- 已了解 [编写 STAROps 运维 Skill](/starops/practices/skill-authoring/article.html) 中 7 要素中的「计算与脚本」「推理边界」要素。

## 规范要素

| 要素 | 含义 | 是否必须 |
|---|---|---|
| 数据驱动声明 | 业务脚本只声明配置（阈值、单位、比较方向），零计算逻辑 | 必须 |
| 公共引擎 | 所有计算集中在公共模块（查询、解析、评估、格式化） | 必须 |
| 纯函数保证 | 数值计算函数无随机数、无当前时间依赖、无全局状态 | 必须 |
| 结构化输出 | 固定 JSON 结构 + 标准 status 枚举（pass / find_problem / no_problem_found / error） | 必须 |
| CLI 集成 | 标准参数（--region / --project / --time-range）+ 标准退出码 | 必须 |

「数据驱动声明 + 公共引擎」是承载本规范的架构：

- **业务脚本**：只写 `InspectionCase` 配置项（阈值、单位、比较方向），零计算逻辑
- **公共引擎**：承载 PromQL 拼接、阈值评估、持续时间累计、JSON 格式化等全部计算

新增一项巡检 = 新增一个 `InspectionCase` 数据项，无新增计算代码。下文「应用样例」每条都是这个架构下的一个切面。

## 应用样例

### 样例 1：单位换算

| 项 | 内容 |
|---|---|
| 正例 | `format_bytes(1073741824)` 返回 `"1.00GB"`；`format_bytes(536870912)` 返回 `"512.0MB"`。纯函数，无状态。 |
| 反例 | 让模型心算「1073741824 字节约等于多少 GB」。同一会话内问两遍，可能返回 1.07GB（1000 进制）或 1.00GB（1024 进制）。下游若用此值做阈值判断，结果不可复现。 |
| 期望输出 | 始终 1024 进制，精度固定：<br>`format_bytes(0)` → `"0B"`<br>`format_bytes(2048)` → `"2KB"`<br>`format_bytes(1073741824)` → `"1.00GB"` |
| 关键差异 | 正例固化进制与精度，反例依赖模型猜测。 |

参考实现（纯函数 + 标准 CLI）：

::: details 查看脚本

```python
#!/usr/bin/env python3
"""单位换算脚本模板：纯函数、同输入同输出、无副作用。"""

import argparse
import json


def format_bytes(value: float) -> str:
    """字节数 → 可读格式（纯函数）。"""
    if value >= 1073741824:
        return f"{value / 1073741824:.2f}GB"
    elif value >= 1048576:
        return f"{value / 1048576:.1f}MB"
    elif value >= 1024:
        return f"{value / 1024:.0f}KB"
    return f"{value:.0f}B"


def format_percent(value: float) -> str:
    return f"{value:.2f}%"


def format_duration(seconds: float) -> str:
    if seconds >= 3600:
        return f"{seconds / 3600:.1f}h"
    elif seconds >= 60:
        return f"{seconds / 60:.1f}min"
    return f"{seconds:.0f}s"


def format_count(value: float) -> str:
    if value >= 1_000_000:
        return f"{value / 1_000_000:.1f}M"
    elif value >= 1_000:
        return f"{value / 1_000:.1f}K"
    return f"{value:.0f}"


CONVERTERS = {
    "bytes": format_bytes,
    "percent": format_percent,
    "seconds": format_duration,
    "count": format_count,
}


def main():
    parser = argparse.ArgumentParser(description="单位换算脚本")
    parser.add_argument("--value", type=float, required=True)
    parser.add_argument("--unit", choices=CONVERTERS.keys(), required=True)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    formatted = CONVERTERS[args.unit](args.value)
    if args.json:
        print(json.dumps({"raw_value": args.value, "unit": args.unit, "formatted": formatted}, ensure_ascii=False))
    else:
        print(formatted)


if __name__ == "__main__":
    main()
```

:::

### 样例 2：聚合计算

| 项 | 内容 |
|---|---|
| 正例 | PromQL 在数据源层完成聚合：<br>`avg by (instance_id) (rate(rds_cpu_usage_total[3m])) / 100 * 100`<br>脚本侧只取最终值：`value = float(row["value"][1])`。 |
| 反例 | 脚本拉取原始时间序列后自己算 avg。可能用错公式（算术平均 vs 加权平均）、漏掉 NaN 值，或对采样间隔做错误假设，结果与 PromQL 内置 rate 不一致。 |
| 期望输出 | 聚合在 PromQL 完成，脚本输出结构化结果：<br>`{"case_id": "rds_cpu_high", "value": 92.5, "threshold": 80.0, "compare": "gt"}` |
| 关键差异 | 正例聚合下沉到数据源，反例聚合上提到脚本层引入误差。 |

聚合必须留在脚本层时（如离线 batch 处理、数据源不支持百分位），按下面这套纯函数实现，保证可回放：

::: details 查看脚本

```python
#!/usr/bin/env python3
"""聚合计算脚本模板：avg / max / min / P50 / P95 / P99，纯函数。"""

import argparse
import json
import sys
from typing import List, Dict


def calc_avg(values: List[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def calc_max(values: List[float]) -> float:
    return max(values) if values else 0.0


def calc_min(values: List[float]) -> float:
    return min(values) if values else 0.0


def calc_percentile(values: List[float], p: float) -> float:
    """百分位数（纯函数）：线性插值法，与 numpy.percentile 默认行为一致。"""
    if not values:
        return 0.0
    sorted_values = sorted(values)
    k = (len(sorted_values) - 1) * (p / 100.0)
    f = int(k)
    c = f + 1 if f + 1 < len(sorted_values) else f
    return sorted_values[f] + (k - f) * (sorted_values[c] - sorted_values[f])


def aggregate(time_series: List[Dict]) -> Dict:
    values = [point["value"] for point in time_series if "value" in point]
    return {
        "count": len(values),
        "avg": round(calc_avg(values), 2),
        "max": round(calc_max(values), 2),
        "min": round(calc_min(values), 2),
        "p50": round(calc_percentile(values, 50), 2),
        "p95": round(calc_percentile(values, 95), 2),
        "p99": round(calc_percentile(values, 99), 2),
    }


def main():
    parser = argparse.ArgumentParser(description="聚合计算脚本")
    parser.add_argument("--metric", required=True)
    parser.add_argument("--input", help="输入 JSON 文件路径（默认 stdin）")
    args = parser.parse_args()
    data = json.load(open(args.input) if args.input else sys.stdin)
    if args.metric not in data:
        print(json.dumps({"error": f"metric '{args.metric}' not found"}))
        sys.exit(1)
    result = aggregate(data[args.metric])
    result["metric"] = args.metric
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
```

:::

### 样例 3：阈值与持续时间判断

| 项 | 内容 |
|---|---|
| 正例 | 数据声明 + 公共评估函数：<br>`InspectionCase(case_id="rds_cpu_high", threshold=80.0, duration=300, compare=CompareOp.GT, data_format="percent")`<br>评估走 `calc_sustained_seconds(series, threshold=80.0, compare=CompareOp.GT)`，纯函数遍历时间序列。 |
| 反例 | Skill 只写「如果 CPU 使用率超过 80% 且持续 5 分钟，则判定为异常」，让模型从原始数据计算。模型可能错算持续时间（如把采样间隔误读为秒数），或把瞬时尖刺也算成持续超阈值。 |
| 期望输出 | 公共引擎产出单项结果（节选）：<br>`{"case_id": "rds_cpu_high", "status": "find_problem", "duration_seconds": 360, "total_entities": 12, "abnormal_count": 1}` |
| 关键差异 | 正例阈值与持续时间下沉到数据声明，反例让模型做数值判断。 |

`calc_sustained_seconds` 与 `evaluate` 核心实现（纯函数 + 时间戳与采样间隔自动推断）：

::: details 查看脚本

```python
#!/usr/bin/env python3
"""阈值+持续时间判断脚本模板：纯函数。"""

import argparse
import json
import sys
from typing import List, Dict


def calc_sustained_seconds(points: List[Dict], threshold: float, compare: str) -> int:
    """计算连续超阈值的最长持续秒数（纯函数）。"""
    if not points or len(points) == 1:
        return 0

    # 推断时间戳除数（毫秒 vs 秒）
    ts_divisor = 1000 if points[0]["timestamp"] > 1e12 else 1

    # 推断采样间隔
    timestamps = [p["timestamp"] for p in points]
    diffs = sorted([
        timestamps[i] - timestamps[i - 1]
        for i in range(1, len(timestamps))
        if timestamps[i] > timestamps[i - 1]
    ])
    if not diffs:
        return 0
    expected_gap = diffs[len(diffs) // 2]
    gap_tolerance = int(expected_gap * 2.0)

    def is_breach(value: float) -> bool:
        if compare == "gt":  return value > threshold
        if compare == "gte": return value >= threshold
        if compare == "lt":  return value < threshold
        if compare == "lte": return value <= threshold
        return False

    max_sustained = 0
    run_start_ts = points[0]["timestamp"]
    prev_ts = points[0]["timestamp"]

    for point in points[1:]:
        ts, value = point["timestamp"], point["value"]
        if ts - prev_ts > gap_tolerance:
            run_start_ts = ts
            prev_ts = ts
            continue
        if is_breach(value):
            current = (ts - run_start_ts) // ts_divisor
            max_sustained = max(max_sustained, current)
        else:
            run_start_ts = ts
        prev_ts = ts

    return max_sustained


def evaluate(time_series: List[Dict], threshold: float, duration: int, compare: str) -> Dict:
    if not time_series:
        return {"status": "no_data", "message": "无数据"}
    sustained = calc_sustained_seconds(time_series, threshold, compare)
    status = "find_problem" if sustained >= duration else "pass"
    return {
        "status": status,
        "threshold": threshold,
        "duration_required": duration,
        "duration_sustained": sustained,
        "compare": compare,
    }


def main():
    parser = argparse.ArgumentParser(description="阈值+持续时间判断脚本")
    parser.add_argument("--threshold", type=float, required=True)
    parser.add_argument("--duration", type=int, required=True)
    parser.add_argument("--compare", choices=["gt", "gte", "lt", "lte"], default="gt")
    parser.add_argument("--input", help="输入 JSON 文件路径（默认 stdin）")
    args = parser.parse_args()
    time_series = json.load(open(args.input) if args.input else sys.stdin)
    result = evaluate(time_series, args.threshold, args.duration, args.compare)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
```

:::

### 样例 4：变更前后 Diff

| 项 | 内容 |
|---|---|
| 正例 | 脚本计算差值：<br>`python3 diff.py --before before.json --after after.json` |
| 反例 | 让模型对比两份报告，口头说「CPU 使用率有所上升」。跨次回归对比时无法量化波动，告警阈值无法用脚本回放验证。 |
| 期望输出 | 结构化 diff 结果：<br>`{"metric": "rds_cpu_usage", "baseline": 45.0, "current": 57.5, "delta_absolute": 12.5, "delta_percent": 27.8, "direction": "up"}` |
| 关键差异 | 正例 diff 可复跑可回归，反例无法量化。 |

参考实现（聚合结果两两比对，纯函数）：

::: details 查看脚本

```python
#!/usr/bin/env python3
"""Diff 计算脚本模板：两次聚合结果两两比对，纯函数。"""

import argparse
import json
import sys
from typing import Dict


def calc_change(before: float, after: float) -> Dict:
    absolute = after - before
    relative = (absolute / before * 100) if before != 0 else 0.0
    return {
        "before": before,
        "after": after,
        "absolute_change": round(absolute, 2),
        "relative_change_percent": round(relative, 2),
    }


def diff_aggregations(before: Dict, after: Dict) -> Dict:
    keys = set(before.keys()) & set(after.keys())
    keys.discard("metric")
    changes = {}
    for key in keys:
        if isinstance(before[key], (int, float)) and isinstance(after[key], (int, float)):
            changes[key] = calc_change(before[key], after[key])
    return changes


def main():
    parser = argparse.ArgumentParser(description="Diff 计算脚本")
    parser.add_argument("--before", required=True)
    parser.add_argument("--after", required=True)
    parser.add_argument("--metric", required=True)
    args = parser.parse_args()
    before_data = json.load(open(args.before))
    after_data = json.load(open(args.after))
    if args.metric not in before_data or args.metric not in after_data:
        print(json.dumps({"error": f"metric '{args.metric}' not found in both files"}))
        sys.exit(1)
    changes = diff_aggregations(before_data[args.metric], after_data[args.metric])
    print(json.dumps({"metric": args.metric, "changes": changes}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
```

:::

### 样例 5：输出标准化

| 项 | 内容 |
|---|---|
| 正例 | 顶层固定 schema：<br>`{"total_cases": 7, "passed": 5, "find_problem_cases": 1, "no_problem_found": 0, "errors": 1, "has_find_problem": true, "results": [...]}`<br>status 枚举只有 4 个值：`pass / find_problem / no_problem_found / error`。 |
| 反例 | 每次输出格式不同，有时返回 Markdown，有时返回自然语言，字段名跨次漂移。下游解析脚本会因字段缺失或键名漂移直接报错，跨次趋势对比也无法做。 |
| 期望输出 | 单项结果 schema 含必填字段：<br>`{"case_id": "rds_cpu_high", "item": "RDS CPU 使用率过高", "severity": "P1", "status": "find_problem", "duration_seconds": 360, "total_entities": 12, "abnormal_count": 1, "abnormal_resources": [...]}` |
| 关键差异 | 正例结构与字段名跨次稳定，反例结构跨次漂移导致下游解析失败。 |

## 进阶要素

### 架构模式：数据驱动声明 + 公共引擎

以巡检类 Skill 为例，脚本文件的分工：

| 文件 | 职责 | 计算逻辑 |
|---|---|---|
| `{skill}_common.py` | 公共引擎 | 查询、解析、评估、格式化、聚合 |
| `{skill}-core-inspection.py` | 业务声明 | 若干 `InspectionCase` 数据项，零计算逻辑 |
| `{skill}-performance-inspection.py` | 业务声明 | 若干 `InspectionCase` 数据项，零计算逻辑 |
| `{skill}-security-inspection.py` | 业务声明 | 若干 `InspectionCase` 数据项，零计算逻辑 |
| `{skill}-logs-inspection.py` | 业务声明 | 若干 `InspectionCase` 数据项，零计算逻辑（SLS SQL 日志查询） |

新增巡检项 = 新增一个 `InspectionCase` 数据项，不写新的计算代码。

### 确定性验证方式

同参数执行两次，diff 必须无差异：

```bash
python3 core-inspection.py --region <region> --project <project> --metricstore <metricstore> --time-range last_1h > /tmp/run1.json
python3 core-inspection.py --region <region> --project <project> --metricstore <metricstore> --time-range last_1h > /tmp/run2.json
diff /tmp/run1.json /tmp/run2.json
```

任何 diff 输出都意味着脚本未达成纯函数保证，需要排查随机数、当前时间依赖或全局状态。

## 常见问题

### 哪些计算不需要脚本化？

模型推理（根因假设排序、跨域关联、经验综合）不需要脚本化。脚本化只针对数值计算：单位换算、聚合、阈值判断、Diff。

### 公共引擎和业务脚本的分界线在哪？

公共引擎承载「怎么算」（查询、解析、评估、格式化），业务脚本承载「算什么」（巡检项配置、阈值、单位）。判定标准：业务脚本里不出现 `if/else` 数值判断逻辑。

### 纯函数为什么禁用「当前时间依赖」？

`datetime.now()` 等当前时间调用会导致同输入跨次输出不一致，破坏可回放性。需要时间窗口时通过 CLI 参数（如 `--time-range`）显式传入。

### 业务脚本能否调用三方库？

可以，但必须是确定性库（同输入同输出）。避免依赖随机数、机器学习推理类库；调用日志检索或指标查询等远端服务时，参数固定即输出固定的接口可以使用。

## 相关入口

- [返回 STAROps 最佳实践首页](/starops/starops.html)
- [打开 STAROps Playground](/playground/staropsdemo.html)
- [进入 STAROps 控制台](https://starops.console.aliyun.com)
