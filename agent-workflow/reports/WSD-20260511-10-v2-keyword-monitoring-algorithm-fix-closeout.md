---
title: V2 关键词监测表接入与主题多样性算法修复
date: 2026-05-11
task_id: WSD-20260511-10-v2-keyword-monitoring-algorithm-fix
status: accepted / automation-updated
owner: workflow / data / dev
encoding: UTF-8
---

# V2 关键词监测表接入与主题多样性算法修复

## 1. 问题

2026-05-06 至 2026-05-11 的 Front Signals 连续偏向企业 Agent / MCP / 治理主题。排查发现，`agent-workflow/product/source-intelligence.md` 中已有关键词监测表和查询组合策略，但 `agent-workflow/tools/run-v2-daily-pipeline.mjs` 未读取该表，而是使用脚本内硬编码的 Agent-heavy 查询。

## 2. 修复

- 新增可执行关键词配置：`01-SiteV2/content/10-databases/keyword-monitoring-v2.json`。
- 将关键词主题拆为 7 组：企业 Agent / 治理、模型能力 / 成本、开发者工具 / 开源生态、垂直行业 / 客户采用、融资 / VC / 市场信号、监管 / 风险 / 反证、中国市场 / 本地迁移。
- `run-v2-daily-pipeline.mjs` 已改为读取 `keyword-monitoring-v2.json`，用于 HN、keyword-search、GDELT、follow-builders proxy 查询。
- Raw 候选新增 `theme`、`theme_label`、`keyword_group` 字段。
- source-router log 新增 `keyword_group_distribution`、`theme_distribution`、`theme_concentration_warning`、`front_signal_theme_gate`。
- 新增 Raw 主题分散排序，避免顶部候选被单一主题占满。
- 给外部 `fetch` 请求增加超时，慢源会记录失败并继续执行。
- 更新 `agent-workflow/governance/v2-current-rule-overrides.md` 与 `agent-workflow/product/source-intelligence.md`，明确关键词配置是生产输入。
- 更新 Codex 自动化 `v2-content-site-daily-update`，要求每日 09:00 读取关键词配置并执行主题多样性闸门。

## 3. 新硬闸门

- Raw 单一主题默认不得超过 35%；超过 40% 时必须输出 `theme_concentration_warning`。
- Structured 同一主题默认最多 4 条，除非明确为主题日。
- Front Signal 默认同一主题最多 1 条；只有 `theme_day=true` 且说明原因时最多 2 条。
- 不得再让 3 条 Front Signal 全部落在企业 Agent / MCP / 治理主题，除非当天被明确判定为主题日。

## 4. 验证

- `node --check agent-workflow/tools/run-v2-daily-pipeline.mjs`：通过。
- `keyword-monitoring-v2.json` JSON 解析：通过。
- source-router 小样本 dry-run：通过，输出多主题 `keyword_group_distribution` 与 `theme_distribution`，`theme_concentration_warning: none`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。

## 5. 边界

- 本次没有重跑 2026-05-11 今日内容，也没有改写已发布 Front Signals。
- 本次修复从下一次自动化运行开始生效。
- GDELT 在小样本 dry-run 中部分请求超时，已被记录为失败源；不会阻塞 AI HOT / keyword-search / follow-builders 其他通道继续运行。
