---
title: WaveSight Content
date: 2026-07-30
status: active-v4-data-pipeline
type: v4-factual-data-pipeline
encoding: UTF-8
---

# WaveSight V4 数据与内容目录

当前主线是 SITE-V4.3 事实数据体系。`context/12-data-center-v4.md` 是事实层规则源；V1/V2/V3 旧页面、Raw 候选汇总与 Raw / Pool / Card 兼容链已退役并删除。

## Data Center / 数据中心

| 目录 | 用途 | 状态 |
|---|---|---|
| `01-raw/source-index.jsonl` | 来源元数据、哈希与 `evidence://` 定位符 | V4 公开输入 |
| `09-fde/` | V4 FDERecord 的 Obsidian 事实投影 | 当前 |
| `10-ai-hardware/` | V4 HardwareRecord 的 Obsidian 事实投影 | 当前 |
| `11-databases/data-center-v4/` | V4 SourceArtifact、RawDocument、Claim、Entity、CanonicalEvent 与 QA | 当前事实库 |

## Application Center / 应用中心

| 目录 | 用途 | 状态 |
|---|---|---|
| `07-community-intelligence/` | Community Intelligence 的可读归档与索引 | 独立应用栏目 |
| `07-points/` | First-Line Viewpoints 发布归档 | 独立应用栏目 |
| `08-report/` | 周报与月报源文件 | 报告应用 |
| `12-applications/` | Funding Insights 等下游应用数据 | 应用数据 |

这些目录保持现有稳定路径，以免破坏自动化、页面链接和已存证据引用；归属以本表为准，不以数字前缀推断。

## V4 事实链

```text
Private evidence object
  → SourceArtifact / RawDocument
  → exact-span Claim
  → Entity / CanonicalEvent
  → FDERecord / HardwareRecord / TagAssertion
  → V4 frontstage
```

缺失字段必须显式保留；重要性、价值、机会、建议、趋势成熟度等判断不得进入 V4 正式表。

V1/V2/V3 退役资产不保存在当前工作树；需要历史核查时使用显式 Git ref 创建隔离工作树。
