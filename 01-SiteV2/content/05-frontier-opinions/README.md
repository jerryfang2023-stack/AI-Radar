---
title: Frontier Opinions Stream
status: current
encoding: UTF-8
---

# 05-frontier-opinions｜前沿观点流

本目录保存前台观点流索引和发布组织材料，不替代 `knowledge/02-Opinion-Cards/` 的长期观点资产。

进入本目录的观点必须保留：

- 人物 / 机构和当时身份。
- 发布时间、平台和原文链接。
- 原文或原文摘录。
- 中文翻译；翻译用于辅助阅读，不替代原文。
- capture_scope 或快照说明。
- 观澜解读和事实主张边界。

观点只能证明“谁在何时何处说了什么”。观点中的公司动作、客户采用、融资、收入、市场规模等事实主张，必须另有 S/A/B 或 eligible `core_pool` 补证。

## 四档评级

进入本目录的前台观点索引只能来自已评级观点卡。

| opinion_tier | display_lane | publish_status | 前台用途 |
|---|---|---|---|
| `feature` | `daily_feature` | `frontstage_feature` | 今日观察主推观点 |
| `sidebar` | `signal_sidebar` | `frontstage_sidebar` | 商业信号页观点模块 |
| `archive` | `archive_only` | `internal_archive` | 仅知识库归档，不展示 |
| `discard` | `hidden` | `hidden` | 隐藏或后续清理 |

`archive` 和 `discard` 不得因为存在旧索引、旧候选或 `frontend` 字段而被同步到前台。

观点材料先入 `opinion_intake`，再由 `govern-opinion-card-ratings.mjs` 统一评级并生成本目录索引。前台页面只展示已通过门禁、完成中文翻译的 `feature` / `sidebar` 观点卡。
