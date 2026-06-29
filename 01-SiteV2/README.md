---
title: WaveSight 01-SiteV2
date: 2026-06-29
status: current
encoding: UTF-8
---

# 观澜AI｜WaveSight 01-SiteV2

本目录是当前站点工程、内容生产过程和长期判断资产库的入口。

## 目录职责

- `site/`：前台页面、运营后台和站点数据。
- `content/`：每日生产过程层，保存 Raw、Pool、商业信号索引、栏目数据、周度雷达内容和配置。
- `knowledge/`：Obsidian 长期判断资产库，保存正式商业信号卡、观点资产、后台候选和当前模板。

## Obsidian 使用入口

| 需要查看 | 进入目录 |
|---|---|
| 当日原始材料 | `content/01-raw/originals/<date>/` |
| 当日 Pool 候选 | `content/02-pool/` |
| 当日商业信号索引 | `content/04-business-signals/signals/` |
| 正式案例 / 融资 / 产品 Card | `knowledge/01-Signal-Cards/` |
| First-Line Viewpoints 时间线 | `knowledge/02-Opinion-Timelines/` |
| 变化 / 场景 / 趋势候选 | `knowledge/03-Asset-Candidates/` |

## 使用规则

- 网站和后台代码只进入 `site/`。
- 每日生产文件只进入 `content/`。
- 长期判断资产只进入 `knowledge/`。
- Raw / Pool / Card / 栏目数据必须保留可追溯来源。
- 旧站点页面和旧内容路线只允许作为历史档案存在，不再作为当前执行依据。
- 新窗口启动仍以项目根目录 `AGENTS.md` 和 `context/` 为入口。
