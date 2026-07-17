---
title: WaveSight 01-SiteV2
date: 2026-07-17
status: current
encoding: UTF-8
---

# WaveSight 01-SiteV2

本目录是 SITE-V4.1 站点、事实数据与本地 Obsidian 资产的统一入口。

## 当前入口

| 需要查看 | 位置 |
|---|---|
| V4 网站 | `site/` |
| V4 事实数据库索引 | `content/11-databases/data-center-v4/Data Center V4 Index.md` |
| 每日 Raw 快照 | `content/01-raw/originals/<date>/` |
| Enterprise AI / FDE | `content/09-fde/Enterprise AI FDE Index.md` |
| AI Hardware | `content/10-ai-hardware/AI Hardware Index.md` |
| 旧 Signal Card 兼容档案 | `knowledge/01-Signal-Cards/` |
| First-Line Viewpoints | `knowledge/02-Opinion-Timelines/` |

## 数据边界

- RawDocument 保存来源材料；Claim 保存可核验原文片段；CanonicalEvent 保存通过 V4 合同的商业事实。
- 旧 Markdown Signal Card 不是 CanonicalEvent，只能通过 `legacy-card-event-mappings.json` 判断两者关系。
- `compatibility-cards.json` 是由 V4 CanonicalEvent 一对一生成的页面兼容投影，也不等于旧 Markdown Signal Card。
- V3 Card、趋势、关系图与机会对象只可作为内部兼容或下游应用输入，不得回流 V4 事实表。

当前规则入口是项目根目录 `AGENTS.md`、`context/12-data-center-v4.md` 与 `context/frontstage-page-contracts.md`。
