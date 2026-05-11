---
task: V2-PAGE-TIME-DIMENSION
date: 2026-05-08
status: completed
owner: ui-ue / dev / qa / workflow
encoding: UTF-8
---

# V2 Page Time Dimension Closeout

## 目标

把 V2 站点的数据时间维度呈现在每个前台页面上，让用户可以在阅读首页、栏目页和详情页时看到历史变化的连续性。

## 设计口径

- 使用 `frontend-design` 规范。
- 沿用 `DESIGN.md` 的高端商业内参方向，不新增后台式筛选器，不改变一级导航。
- 页面模块命名为 `时间线索`，避免内部化的“日期索引 / 数据索引”表达。
- 组件保持克制：日期、标题、信号 / 趋势 / 观点 / 深度分析数量。

## 完成事项

- `01-SiteV2/site/assets/app.js`
  - 新增 `dateIndexCard()`。
  - 新增 `mountDateIndexes()`。
  - 所有 `[data-date-index]` 容器统一读取 `contentIndex.dates`。
- `01-SiteV2/site/assets/styles.css`
  - 新增 `.time-index`、`.time-card`、`.time-date` 样式。
  - 桌面端双列，移动端单列。
- 8 个前台页面均已加入时间维度：
  - `index.html`
  - `daily.html`
  - `signals.html`
  - `opportunities.html`
  - `brief.html`
  - `daily-detail.html`
  - `signal-detail.html`
  - `opportunity-detail.html`

## 验证

- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node --check 01-SiteV2/site/data/site-content.js`：通过。
- 8 个 HTML 页面均包含 `data-date-index` 容器。
- 本地 HTTP 抽查 8 个页面均返回 200，且均包含时间索引容器。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07`：通过。
  - 报告：`agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-190330.md`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-190330.md`

## 边界

- 未新增独立日期详情页。
- 未改变详情页路由或历史日期筛选逻辑。
- 未改数据 schema，只消费既有 `contentIndex.dates`。
- 未恢复旧 `04-Site`。
- 未处理 `09-ai-news-radar`。
- 未部署 Netlify。

## 自动化影响

- 不改变 V2 内容生产自动化。
- 后续生成器更新 `contentIndex.dates` 后，所有页面的时间线索模块会自动读取新日期。
