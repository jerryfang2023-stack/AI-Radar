---
title: WaveSight 01-SiteV2
date: 2026-07-30
status: current
encoding: UTF-8
---

# WaveSight 01-SiteV2

本目录是 SITE-V4.3 站点、事实数据、下游应用与本地 Obsidian 资产的统一入口。

## Data Center / 数据中心

| 需要查看 | 位置 |
|---|---|
| V4 事实数据库索引 | `content/11-databases/data-center-v4/Data Center V4 Index.md` |
| 每日 Raw 快照 | `content/01-raw/originals/<date>/` |
| Enterprise AI / FDE | `content/09-fde/Enterprise AI FDE Index.md` |
| AI Hardware | `content/10-ai-hardware/AI Hardware Index.md` |

## Application Center / 应用中心

| 需要查看 | 位置 |
|---|---|
| V4 网站 | `site/` |
| Community Intelligence | `content/07-community-intelligence/` |
| First-Line Viewpoints 发布归档 | `content/07-points/` |
| 周报与月报 | `content/08-report/` |
| Funding Insights 等应用数据 | `content/12-applications/` |
| First-Line Viewpoints | `knowledge/02-Opinion-Timelines/` |
| Funding Insights 研究档案 | `knowledge/04-Funding-Insights/` |

## 数据边界

- RawDocument 保存来源材料；Claim 保存可核验原文片段；CanonicalEvent 保存通过 V4 合同的商业事实。
- FDE 与 AI Hardware 是证据约束下的事实投影，归数据中心；报告、趋势、机会、融资透视、观点和社群栏目归应用中心。
- V1/V2/V3 页面方案、Raw 候选汇总、Card、desk、旧 graph、legacy mappings 与 `compatibility_cards` 不保存在当前工作树。
- 趋势、机会、融资透视和报告是 V4 下游应用，不得回流 V4 事实表。
- `01-SiteV2` 是沿用的稳定仓库路径，不代表当前产品版本；为了避免破坏证据引用与自动化路径，本轮不做目录名迁移。

当前规则入口是项目根目录 `AGENTS.md`、`context/12-data-center-v4.md` 与 `context/frontstage-page-contracts.md`。
