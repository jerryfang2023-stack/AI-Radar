# WSD-20260508-06 V2 标签体系沿用与全页面体现收口

## 结论

- 状态：`completed / v2-tag-taxonomy-ready / netlify-paused`
- V2 已沿用项目正式标签体系 `agent-workflow/product/tag-taxonomy.md`，即 V1 沉淀后的 9 类标签分层。
- V2 未恢复 V1 `tags.html` 作为一级栏目，符合“Tags 暂不作为一线栏目”的 V2 产品口径。
- 本轮未上传 Netlify。

## 完成范围

- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
  - 新增 `tagTaxonomy`，共 61 个正式标签。
  - 生成器为 Signal / Point / Trend / Opportunity 产出规范 `tags` 对象。
  - 标签对象保留 `id / name / group / aliases`，前台只展示 `name / group`，不展示内部 `tag_id`。
- `01-SiteV2/site/assets/app.js`
  - 新增统一标签渲染。
  - 卡片显示少量前台标签。
  - Signal / Opportunity 详情侧栏按标签组展示。
- `01-SiteV2/site/assets/styles.css`
  - 新增分组标签视觉样式。
- `index.html`、`opportunities.html`
  - 清理非正式泛 chip，替换为正式标签口径。
- `01-SiteV2/site/data/site-content.json` / `.js`
  - 已重新生成。

## 数据覆盖

- `tagTaxonomy`：61 个正式标签。
- Signals：9 条，均有 tags，且均覆盖 `track / evidence`。
- Points：6 条，均有 tags，且均覆盖 `point / track / source`。
- Trends：10 条，均有 tags，且均覆盖 `track / stage`。
- Opportunities：3 条，均有 tags，且均覆盖 `track / function / scenario`。

## 页面检查

浏览器检查保存到：

- `agent-workflow/reports/v2-tag-system-check-2026-05-08/browser-check.json`

桌面 / 移动共 16 项检查全部 200，每个页面均有 `.tag` 和分组 tag class，无横向溢出。

## 验证

- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-07` 通过。
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs` 通过。
- `node --check 01-SiteV2/site/assets/app.js` 通过。
- `node --check 01-SiteV2/site/data/site-content.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07` 通过，报告：`agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-174906.md`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告：`agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-174906.md`。
- 公开页面 / app / generated data 内部词扫描通过。

## 未执行

- 未上传 Netlify。
- 未恢复 V1 tags 一级页面。
- 未处理旧 `04-Site` 或 `09-ai-news-radar`。
