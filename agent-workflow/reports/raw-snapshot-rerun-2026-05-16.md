---
date: 2026-05-16
type: automation_closeout
status: completed
owner: Workflow / Automation Agent
---

# Raw 快照与 2026-05-16 自动化重跑记录

## 本轮目标

按用户确认的新口径执行：Raw 保存正文或快照，Pool 只做候选索引；重新跑 2026-05-16 监测链路，并用更厚的 Raw 证据重新生成今日观察、变化卡、案例卡和观点卡材料。

## 已完成

- 更新 `run-v2-daily-pipeline.mjs`：新增 Raw 正文快照抓取、正文清洗、关键摘录、content hash、snapshot status；重跑时按日期清空 generated originals，避免新旧 Raw 混读。
- 更新自动化提示词：`daily-monitor-router`、`asset-card-generator`、`daily-observation-writer`、`case-signal-researcher` 均加入 Raw 快照和 Pool 边界规则。
- 更新 Codex 自动化任务本体：`daily-monitor-router`、`asset-card-generator`、`daily-observation-writer`、`case-signal-researcher`。
- 重跑 2026-05-16 source-router：生成 100 条 Raw、30 条 Pool、变化簇候选、观点候选和 source-router log。
- 重新生成 2026-05-16 今日观察：`01-SiteV2/content/03-daily-observation/2026-05-16--daily-observation--ai-enters-professional-work-billing-and-control-show-up.md`
- 更新精选变化卡：`01-SiteV2/content/04-business-signals/2026-05-16-selected-change-cards.md`
- 更新 L2 案例研究：`01-SiteV2/content/05-case-research/2026-05-16--case-research--case-signal-researcher-l2-update.md`
- 新增 4 张案例卡：PwC × Anthropic、OpenAI Codex Windows sandbox、Google Genkit middleware、Ramp AI Index。
- 新增 3 张前沿观点卡：Aaron Levie、Peter Steinberger、Dan Shipper。
- 同步网站数据：`01-SiteV2/site/data/site-content.json`

## 运行结果

- Raw 数量：100。
- Pool 数量：30。
- 本地 Raw 原文档案：100 个文件。
- 快照状态分布：`summary-only-high-volatility-source=39; fetched-clean-text=28; fetch-failed-summary-only=25; http-403-fallback-text=6; http-404-fallback-text=1; http-429-fallback-text=1`。
- 失败源：GDELT 多个查询被 429 / invalid JSON 限制；已写入 `agent-workflow/reports/2026-05-16-v2-daily-source-router-log.md`。

## 质量检查

- `node --check agent-workflow/tools/run-v2-daily-pipeline.mjs`：passed。
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs v2content`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs style`：第一次失败，修正文案后 passed。

## 仍需注意

- HN / X / AI HOT 仍只能作为讨论热度和发现渠道。进入前台事实判断时，必须补官方公告、产品文档、A 级媒体、客户案例或可靠转述。
- Copilot usage-based billing 当前前台只用 HN 讨论表达“成本焦虑”，不把它写成已由官方证实的计费事实。
- OpenAI 部分官网抓取返回 403，已保存可用摘要；后续深度报告前应通过浏览器或官方文档二次核对。
- GDELT 需要限速或分批查询，否则会继续 429。
