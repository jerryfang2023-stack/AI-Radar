---
title: WaveSight Content
date: 2026-07-17
status: active-v4-data-pipeline
type: v4-factual-data-pipeline
encoding: UTF-8
---

# WaveSight V4 数据与内容目录

当前主线是 SITE-V4.1 事实数据体系。`context/12-data-center-v4.md` 是事实层规则源；V3 Raw / Pool / Card 规则只服务内部兼容链路。

## 当前结构

| 目录 | 用途 | 状态 |
|---|---|---|
| `01-raw/originals/` | 每日来源快照 | V4 输入 |
| `02-pool/` | V3 证据筛选兼容资产 | 内部兼容 |
| `04-business-signals/` | 旧 Card 页面与索引兼容资产 | 内部兼容 |
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

## 兼容资产

`knowledge/01-Signal-Cards/` 中的旧 Markdown Card 保留用于历史追踪和下游兼容，不再作为当前网站或 V4 事实层的来源。逐条关系见 `11-databases/data-center-v4/legacy-card-event-mappings.json`。
