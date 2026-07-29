---
title: WaveSight Content
date: 2026-07-17
status: active-v4-data-pipeline
type: v4-factual-data-pipeline
encoding: UTF-8
---

# WaveSight V4 数据与内容目录

当前主线是 SITE-V4.3 事实数据体系。`context/12-data-center-v4.md` 是事实层规则源；V3 Raw / Pool / Card 兼容链已退役并删除。

## 当前结构

| 目录 | 用途 | 状态 |
|---|---|---|
| `01-raw/originals/` | 每日来源快照 | V4 输入 |
| `07-points/` | First-Line Viewpoints | 独立栏目 |
| `08-report/` | 周报内容 | 下游报告 |
| `09-fde/` | V4 FDERecord 的 Obsidian 投影 | 当前 |
| `10-ai-hardware/` | V4 HardwareRecord 的 Obsidian 投影 | 当前 |
| `11-databases/data-center-v4/` | V4 SourceArtifact、RawDocument、Claim、Entity、CanonicalEvent 与 QA | 当前事实库 |

## V4 事实链

```text
Raw snapshot
  → SourceArtifact / RawDocument
  → exact-span Claim
  → Entity / CanonicalEvent
  → FDERecord / HardwareRecord / TagAssertion
  → V4 frontstage
```

缺失字段必须显式保留；重要性、价值、机会、建议、趋势成熟度等判断不得进入 V4 正式表。

V3 兼容资产不保存在当前工作树；需要历史核查时使用显式 Git ref 创建隔离工作树。
