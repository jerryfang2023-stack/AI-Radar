---
date: 2026-05-17
status: completed
owner: intelligence-data-agent / workflow-agent
---

# Keyword Monitoring Upgrade｜四类信号覆盖

## 背景

用户要求基于旧 `关键词列表.md` 重新优化当前可执行关键词表，明确覆盖：

- 成熟信号：大企业、大融资、并购、平台发布
- 早期信号：pre-seed、seed、angel、grant、YC、spinout
- 技术迭代信号：成本、能力、部署、协议、工具链
- 开发者生态信号：开源、SDK、框架、插件市场、GitHub 采用

同时要求覆盖核心赛道词以及 P0 / P1 词。

## 已完成

- 重写 `01-SiteV2/content/09-databases/keyword-monitoring-v2.json` 为 `v2-keyword-monitoring-1.1`。
- 新增 `p0_core_tracks`，覆盖：
  - AI Agent / 企业工作流
  - 销售 / 客服 / 营销
  - AI 编程 / 开发者工具
  - 企业知识库 / RAG / AI Memory
  - AI 基础设施 / 模型路由
  - 模型能力 / 端侧 AI / 小模型
  - AI 安全 / 治理 / 合规
  - 机器人 / AI Native 公司
- 新增 `p1_evidence_terms`，按成熟、早期、技术迭代、开发者生态分层。
- 将 `theme_groups` 调整为 4 个可执行监测层：
  - `mature-commercial-signal`
  - `early-direction-signal`
  - `technical-iteration-signal`
  - `developer-ecosystem-signal`
- 每个监测层均配置 `keyword_search`、`hn`、`gdelt`、`builder_proxy` 查询组合。
- 更新 `agent-workflow/tools/run-v2-daily-pipeline.mjs` 的正式标签映射，避免新监测层全部回落到默认 Agent 标签。
- 更新 `daily-monitor-router` 要求：4 类信号必须覆盖，Raw 每类常规不少于 8 条，Pool 每类常规不少于 3 条。
- 更新 `source-intelligence.md`，明确 4 类是当前日常监测入口硬覆盖，P0/P1 赛道通过查询组合嵌入。

## 当前关键词规模

- 成熟信号：34 个关键词，9 条 keyword_search 查询
- 早期信号：37 个关键词，10 条 keyword_search 查询
- 技术迭代信号：40 个关键词，12 条 keyword_search 查询
- 开发者生态信号：29 个关键词，11 条 keyword_search 查询

## 风险与下一步

当前 `keyword_search` 仍由脚本使用 HN Algolia 执行，不是真正的广域网页搜索。关键词表已经补齐，但搜索执行层仍需后续升级到多源搜索，至少覆盖官方页面、A 级媒体、融资 / VC、GitHub / npm / PyPI / Hugging Face、垂直行业媒体和采购 / marketplace。

## 验证

- `keyword-monitoring-v2.json` JSON parse：passed
- `node --check agent-workflow/tools/run-v2-daily-pipeline.mjs`：passed
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed
