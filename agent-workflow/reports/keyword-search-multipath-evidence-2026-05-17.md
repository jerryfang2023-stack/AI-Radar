---
date: 2026-05-17
owner: intelligence-data-agent / workflow-agent
status: implemented
---

# Keyword Search 多路搜索规则固化

## 背景

用户确认：keyword-search 不得只依赖 HN / Reddit / X 等社区来源。社区来源只能说明讨论、反馈、痛点和早期热度，不能作为唯一关键词搜索结果，也不能单独支撑事实判断。

## 已更新

- `agent-workflow/tools/run-v2-daily-pipeline.mjs`
  - `collectKeywordSearch()` 从 HN 单一路径改为多路搜索。
  - 每条 keyword-search 结果新增 `search_intent`、`search_path`、`search_path_label`。
  - 搜索路径覆盖：
    - `official_original`
    - `developer_ecosystem`
    - `capital_startup`
    - `industry_landing`
    - `procurement_marketplace`
    - `a_media_gdelt`
    - `community_feedback`
  - 日志新增 `keyword_search_path_distribution`、`keyword_search_intent_distribution`、`keyword_search_non_community_count`。
  - 如果只找到社区结果，会记录失败提醒，后续只能进入 Watchlist / User Feedback Pool。
- `agent-workflow/product/raw-evidence-schema.md`
  - 增加 keyword-search 多路搜索规则。
  - 增加 `search_intent`、`search_path`、`search_path_label` 字段说明。
- `agent-workflow/tools/v2-raw-evidence-gate.mjs`
  - Raw gate 校验新增字段。
- `agent-workflow/automation-prompts/daily-monitor-router.md`
  - 增加多路搜索硬要求、非社区结果门槛和反大厂偏置规则。
- `01-SiteV2/content/09-databases/keyword-monitoring-v2.json`
  - 增加 `keyword_search_mode=multi_path_evidence_search`。
  - 增加七类必搜路径和社区-only 降级规则。
- `01-SiteV2/content/README.md`、`source-intelligence.md`
  - 同步 Raw / Pool 和来源治理口径。

## 规则结果

keyword-search 的目标不再是找最多结果，而是建立证据链：

- 社区反馈说明“有人在讨论”。
- 官方来源验证“事实是否存在”。
- 生态平台观察“开发者是否采用”。
- 融资与创业路径判断“资本是否下注”。
- 行业来源判断“场景是否落地”。
- 采购和 marketplace 判断“企业是否真的买”。
- A 级媒体 / GDELT 判断“事件是否扩散”。

## 验证

- `node --check agent-workflow/tools/run-v2-daily-pipeline.mjs` passed。
- `node --check agent-workflow/tools/v2-raw-evidence-gate.mjs` passed。
- `keyword-monitoring-v2.json` 解析通过，七类搜索路径存在。

## 注意

本轮没有完整重跑 daily-monitor-router。下一次真实运行后，应检查 source-router log 中的 `keyword_search_path_distribution` 和 `keyword_search_non_community_count`，确认 keyword-search 不再被社区路径垄断。
