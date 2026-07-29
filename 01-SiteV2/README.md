---
title: WaveSight 01-SiteV2
date: 2026-07-29
status: current
encoding: UTF-8
---

# WaveSight 01-SiteV2

本目录是 SITE-V4.3 站点、事实数据与本地 Obsidian 资产的统一入口。

## 当前入口

| 需要查看 | 位置 |
|---|---|
| V4 网站 | `site/` |
| V4 事实数据库索引 | `content/11-databases/data-center-v4/Data Center V4 Index.md` |
| 每日 Raw 快照 | `content/01-raw/originals/<date>/` |
| Enterprise AI / FDE | `content/09-fde/Enterprise AI FDE Index.md` |
| AI Hardware | `content/10-ai-hardware/AI Hardware Index.md` |
| First-Line Viewpoints | `knowledge/02-Opinion-Timelines/` |

## 数据边界

- RawDocument 保存来源材料；Claim 保存可核验原文片段；CanonicalEvent 保存通过 V4 合同的商业事实。
- V3 Card、desk、旧 graph、legacy mappings 与 `compatibility_cards` 已从当前目录、schema 和生产流程中删除。
- 趋势、机会、融资透视和报告是 V4 下游应用，不得回流 V4 事实表。

当前规则入口是项目根目录 `AGENTS.md`、`context/12-data-center-v4.md` 与 `context/frontstage-page-contracts.md`。
