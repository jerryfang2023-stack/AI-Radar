---
title: WaveSight 01-SiteV2
date: 2026-06-04
status: current
encoding: UTF-8
---

# 观澜AI｜WaveSight 01-SiteV2

本目录是 V3 数据观察台、运营后台、内容生产线和长期判断资产库的当前入口。

当前整体栏目版本号：`观澜内容中心 v1.0`（`Guanlan Content Center V1.0` / `GCC-V1.0`）。该版本号用于标记当前统一内容中心整体基线，子栏目仍分别沿用 `SITE-V3.3.8.3`、`BSIG`、`IMAP`、`EAI`、`OPS` 等版本体系。

## 目录职责

- `site/`：V3 数据观察台与运营后台工程。当前前台入口是 `v3-data-observation.html`，运营后台保留 `operations-console.html`、`pipeline-dashboard.html` 和 `admin.html`。
- `content/`：每日生产过程层，保存 Raw 原文、Pool 候选、每日信号索引、观点索引、趋势报告和发布索引。
- `knowledge/`：Obsidian 长期判断资产库，保存正式商业信号卡、观点卡、变化 / 场景 / 趋势候选和模板。

## Obsidian 使用入口

| 需要查看 | 进入目录 |
|---|---|
| 当日原始材料 | `content/01-raw/originals/<date>/` |
| 当日 Pool 候选 | `content/02-pool/` |
| 当日商业信号索引 | `content/04-business-signals/signals/` |
| 当日观点索引 | `content/05-frontier-opinions/` |
| 正式案例 / 融资 / 产品 Card | `knowledge/01-Signal-Cards/` |
| 正式观点卡 | `knowledge/02-Opinion-Cards/` |
| 变化 / 场景 / 趋势候选 | `knowledge/03-Asset-Candidates/` |

## 使用规则

- 网站和后台代码只进入 `site/`。
- 每日生产文件只进入 `content/`。
- 长期判断资产只进入 `knowledge/`。
- Raw / Pool / Card / 观点 / 趋势资产必须保留，不移动到临时目录。
- V2 前台页面只允许作为本地存档存在，不再作为当前执行依据。
- 新窗口启动仍以项目根目录 `AGENTS.md` 和 `context/` 为入口。
