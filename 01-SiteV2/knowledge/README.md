---
title: WaveSight Knowledge
date: 2026-07-30
status: current
type: obsidian-knowledge-root
encoding: UTF-8
---

# WaveSight Knowledge｜观澜 AI 判断资产主库

本目录是观澜 AI 的长期判断资产库，服务 Obsidian / 本地知识库使用。

它不是 Data Center 事实表，也不是网站发布目录。原始快照、结构化事实与前台页面数据分别写入 `01-SiteV2/content/` 和 `01-SiteV2/site/data/`；本目录只保留可复用、可追溯、可复核、可关联的长期知识卡。

## 当前结构

| 目录 | 用途 | 保留标准 |
|---|---|---|
| `02-Opinion-Timelines/` | First-Line Viewpoints Obsidian 时间线 | 按人物 / 日期同步，必须可幂等重跑 |
| `04-Funding-Insights/` | 融资透视 Obsidian 研究档案 | 仅同步自动发布门禁通过的融资卡片，保留研究来源和 exact-quote 证据 |

## 不进入 knowledge 的内容

- 每日 Raw 全量。
- Pool 候选。
- 自动生成的过程文件。
- 没有关联资产的社群线索。
- 只有标题、摘要或“暂无公开信息”的卡片。
- 重复日期版本。
- 调试、过程、临时、低质量或无效文件。

原始证据保留在 `content/01-raw/originals/`；旧候选汇总和其他不具备长期价值的过程 Markdown 直接删除，不迁入 `knowledge/`。

## First-Line Viewpoints

观点资产记录“谁在何时何处说了什么”。它不是公司事实主证据，只作为前沿判断资产、判断触发器和行业预期信号。观点中的公司动作、客户采用、融资、收入或市场规模必须另有事实来源支撑。

## 清理规则

- 空目录直接删除。
- 过期索引直接删除。
- 同名或同事件跨日重复卡只保留质量最高的一张。
- 无关联、无身份、无上下文、无原文的观点卡降级或删除。
- 无效内容不搬家，直接清理。

## 与 content / site 的关系

```text
content/ Data Center 事实资产与 Application Center 发布归档
knowledge/ Application Center 的观点时间线与已发布研究
site/ 前台展示
```

`knowledge/` 只沉淀判断资产，不承担发布页面和每日生产过程。
