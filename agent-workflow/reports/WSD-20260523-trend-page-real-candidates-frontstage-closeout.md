---
task_id: WSD-20260523-trend-page-real-candidates-frontstage
title: 趋势页面真实候选前台同步 closeout
date: 2026-05-23
status: completed
owner: Codex / Build & Release
harness: page-copy-typography
encoding: UTF-8
---

# WSD-20260523 趋势页面真实候选前台同步 Closeout

## 1. 执行结论

本任务属于 `页面 / 文案 / Typography Harness`。

已完成两条真实趋势候选进入前台数据层和趋势追踪页主列表：

- `TRC-20260521-01`：企业 Agent 的预算和工作流信号开始积累。
- `TRC-20260522-01`：企业 Agent 部署问题转向流程上下文和治理。

本次没有生成正式 Trend Report，没有把 `trend_evidence_gate: threshold_pending` 解释成已形成趋势，也没有新增一级导航。

## 2. 读取范围

固定读取已覆盖：

- `AGENTS.md`：由任务启动上下文提供。
- `context/00-current-state.md`
- `context/01-product-map.md`
- `context/02-vi-style.md`
- `context/03-copy-style.md`
- `context/06-execution-harness.md`
- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/tag-taxonomy.md`
- `agent-workflow/reports/WSD-20260522-trend-tracking-page-redesign-build-closeout.md`
- 本派发单。

按派发单读取了两条真实候选资产：

- `01-SiteV2/content/06-asset-candidates/trend/2026-05-21--trend-candidate--enterprise-agent-budget-and-workflow-signals-are-accumulating.md`
- `01-SiteV2/content/06-asset-candidates/trend/2026-05-22--trend-candidate--enterprise-agent-deployment-shifts-to-workflow-context-and-governance.md`

未额外扩大读取范围。

## 3. 文件变更

| 文件 | 变更 |
|---|---|
| `01-SiteV2/site/scripts/sync-v2-site-data.mjs` | 新增 `trend_candidate` markdown 解析；读取 `formal_tags`、关联商业信号、关联观点、关联场景、候选状态、证据门和后续观察；写入 `contentIndex.trends` |
| `01-SiteV2/site/assets/app.js` | 趋势追踪页在有真实候选时优先展示候选；候选显示为“正在形成的趋势”；fallback 观察项不再成为主列表第一项；正式报告区只展示真正正式报告 |
| `01-SiteV2/site/data/site-content.json` | 重新生成，`contentIndex.trends` 已包含两条真实候选 |
| `01-SiteV2/site/data/site-content.js` | 重新生成，与 JSON 同步 |
| `agent-workflow/reports/WSD-20260523-trend-page-real-candidates-frontstage-desktop.png` | 桌面趋势追踪页截图 |
| `agent-workflow/reports/WSD-20260523-trend-page-real-candidates-frontstage-mobile.png` | 移动趋势追踪页基础观察截图 |
| `agent-workflow/reports/WSD-20260523-trend-page-real-candidates-frontstage-closeout.md` | 本收口报告 |

验证命令还更新了质量门报告：

- `agent-workflow/reports/tag-quality-gate-latest.md`
- `agent-workflow/reports/quality-gates-syntax-2026-05-22-20260522-170757.md`

## 4. 数据结果

`contentIndex.trends` 当前包含：

- `TRC-20260522-01`
- `TRC-20260521-01`

两条候选均保留：

- `type: trend_candidate`
- `assetLevel: candidate`
- `trendEvidenceGate: threshold_pending`
- `stage: 正在形成的趋势`
- `score: 材料正在累积`
- `relatedSignalCards`
- `relatedOpinionCards`
- `supportingScenes`
- `formalTags`
- 正式 taxonomy tags。

两条候选的 tags 均来自 `agent-workflow/product/tag-taxonomy.md` 中的正式标签体系，`node agent-workflow/tools/check-tags.mjs` 已通过。

## 5. Fallback 处理

`TRD-WATCH-20260522` 仍作为无正式报告时的数据 fallback 保留在 `contentIndex.trendReports`，但前台趋势追踪页已降级处理：

- 当 `contentIndex.trends` 有真实候选时，主列表只优先展示真实候选。
- `TRD-WATCH-20260522` 不再成为主列表第一项。
- 正式趋势报告区通过正式报告过滤逻辑保持克制空状态，页面显示“暂无正式趋势报告。先看正在累积的方向。”。

因此本任务没有新增正式趋势报告，也没有把 fallback 包装成正式报告。

## 6. 验证

已通过：

```text
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check 01-SiteV2/site/assets/app.js
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node agent-workflow/tools/check-tags.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
```

说明：

- `run-quality-gates.mjs syntax` 总结论为 `passed`。
- 其中子进程语法项因当前环境 `child_process spawn blocked (EPERM)` 被脚本标记为 skipped/passed；派发单要求的两个核心 `node --check` 已单独直接运行并通过。

脚本确认：

- `contentIndex.trends` 包含 `TRC-20260521-01` 与 `TRC-20260522-01`。
- `contentIndex.trendReports` 没有新增正式趋势报告；当前仅有 fallback `TRD-WATCH-20260522`，且正式报告过滤结果为 0。
- 两条趋势候选的 tags 均来自正式 tag 体系。

浏览器确认：

- 桌面趋势追踪页主列表可见两条真实候选。
- 移动宽度趋势追踪页主列表可见两条真实候选。
- 页面文本未出现 `7D / 30D / 90D`、`反证`、`还缺什么`、`主要缺口`、`证据缺口`、`机会判断`。

截图：

- `agent-workflow/reports/WSD-20260523-trend-page-real-candidates-frontstage-desktop.png`
- `agent-workflow/reports/WSD-20260523-trend-page-real-candidates-frontstage-mobile.png`

## 7. 删除、部署与推送

- 未删除文件。
- 未新增正式 tag。
- 未新增一级导航。
- 未修改 GitHub / Netlify / 自动化配置。
- 未部署。
- 未推送。

## 8. 下游使用范围

允许下游基于以下产物继续前台复核或局部微调：

- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`
- 两条 `TRC-20260521-01` / `TRC-20260522-01` 真实趋势候选。

下游不得把两条候选提升为正式趋势报告，不得恢复旧栏目标题区或被禁止的旧前台表达。
