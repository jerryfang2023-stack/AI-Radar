---
task: V2-HISTORY-DATE-INDEX-FIX
date: 2026-05-08
status: completed
owner: dev / data / workflow
encoding: UTF-8
---

# V2 History Date Index Fix Closeout

## 目标

修复 V2 站点历史内容已经进入 `history-refined/` 与 `site-content.json`，但前台 `contentIndex.dates` 仍只展示 `2026-05-07 / 2026-05-06 / 2026-05-05` 的问题。

## 完成事项

- `01-SiteV2/site/scripts/sync-v2-site-data.mjs` 已修复历史精修资产日期口径。
- 历史精修 Signal / Point / Trend / Opportunity 优先使用 `original_date` 作为资产日期。
- 生成器新增 `dateRefs`，从 `source_paths` 中解析所有来源日期，用于跨日期历史资产的时间索引归属。
- `contentIndex.dates` 已改为从 Signals / Points / Trends / Opportunities 的实际日期汇总，不再只依赖 `04-selected-signals/*-front-signals.md`。
- 已重新生成：
  - `01-SiteV2/site/data/site-content.json`
  - `01-SiteV2/site/data/site-content.js`

## 修复后结果

`contentIndex.dates` 已扩展为 10 个日期：

- `2026-05-07`
- `2026-05-06`
- `2026-05-05`
- `2026-05-04`
- `2026-05-03`
- `2026-05-02`
- `2026-05-01`
- `2026-04-30`
- `2026-04-29`
- `2026-04-28`

当前 generated data 规模：

- Signals：15
- Points：14
- Trends：17
- Opportunities：8

## 验证

- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`：通过。
- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node --check 01-SiteV2/site/data/site-content.js`：通过。
- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-07`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07`：通过。
  - 报告：`agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-185404.md`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-185404.md`

## 边界

- 未改页面布局和样式。
- 未恢复旧 `04-Site`。
- 未处理 `09-ai-news-radar`。
- 未做 Netlify deploy。
- 未新增前台栏目。

## 自动化影响

- 影响 V2 site data generator。
- 后续 V2 每日内容更新自动化再次运行生成器时，会沿用新的历史日期索引口径。
- 不影响已停止的 V1 旧自动化。
