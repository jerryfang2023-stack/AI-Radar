# 2026-05-14 完整 Schema 迁移收口

状态：accepted / local-verified

## 本轮目标

将旧 `opportunity / opportunities` 生产 schema 迁移为 `trendReport / trendReports`，避免“机会解码”旧栏目、旧路径和旧数据键继续影响 V2 当前链路。

## 已完成

- 同步生成器已输出 `contentIndex.trendReports` 和顶层 `trendReport`。
- 前台挂载点已迁移为 `data-trend-report-*`。
- 趋势追踪列表页和详情页继续使用：
  - `trend-tracking.html`
  - `trend-detail.html`
- Admin 内容类型从 `opportunities` 改为 `trendReports`。
- 关系字段已迁移为 `relatedTrendReports` / `hasTrendReport`。
- 站点 generated data 已重新生成：
  - `01-SiteV2/site/data/site-content.json`
  - `01-SiteV2/site/data/site-content.js`
- 旧位图资产已更名为：
  - `trend-report-cover-imagegen.png`
  - `trend-report-framework-path-imagegen.png`
- 当前入口规范已更新：
  - `AGENTS.md`
  - `docs/agent-handoff.md`
  - `agent-workflow/governance/current-context.md`
  - `agent-workflow/product/COPY.md`
  - `agent-workflow/product/column-architecture.md`
  - `agent-workflow/product/signal-system.md`
  - `agent-workflow/product/intelligence-data-model.md`
  - `agent-workflow/product/product-strategy.md`
  - `agent-workflow/product/strategy-single-source.md`

## 残留边界

- 旧 closeout、旧 daily-run-log 和历史报告里的 `Opportunity` 记录保留为审计轨迹，不作为当前生产规范。
- VI 历史资产目录如仍保留旧英文文件名，只作为设计资产库历史命名，不作为数据 schema。

## 验证

- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-14`：通过。
- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`：通过。
- `node --check agent-workflow/tools/v2-content-gate.mjs`：通过。
- `node --check agent-workflow/tools/unified-site-sync.mjs`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs style`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-14`：passed。
- `node agent-workflow/tools/v2-source-quality-gate.mjs --date=2026-05-14`：passed。
- HTTP 检查：
  - `trend-tracking.html`：200
  - `trend-detail.html`：200
  - `opportunities.html`：404
  - `opportunity-detail.html`：404

## 结论

当前生产 schema 已完成迁移。后续新增页面、同步脚本、自动化任务和文档不得再使用 `opportunity / opportunities` 作为当前 V2 数据键。
