# WSD-20260508-06 V2 标签体系沿用与全页面体现

## 任务背景

用户要求查看 tag 体系是否沿用 V1 网站版本，并确认 V2 网站中每个页面都有体现。

## 判断

- V1 旧站已经有 tags / taxonomy 数据和 tags 页面样式。
- 项目长期规范 `agent-workflow/product/tag-taxonomy.md` 已把标签定义为 9 类判断资产：`track / function / scenario / customer / evidence / stage / region / source / point`。
- V2 此前只在少数页面显示 chip，且部分 chip 是阶段、评分或泛词，不等于正式 tag 体系。

## 执行目标

- V2 沿用 `tag-taxonomy.md` 的正式标签字典和分组口径。
- V2 不恢复 V1 的 tags 一级导航；标签只作为搜索、筛选、关系网络和详情辅助信息。
- Signal / Point / Trend / Opportunity 在 generated data 中都带规范 tags。
- V2 每个前台页面都展示标签，且不出现内部 tag_id。

## 验收标准

- `site-content.json` 包含 `tagTaxonomy`。
- `signals / points / trends / opportunities` 均包含 `tags`。
- Signal 至少有 `track / evidence`。
- Opportunity 至少有 `track / function / scenario`。
- Trend 至少有 `track / stage`。
- Point 至少有 `point / track / source`。
- 主页、今日要点、关键信号、机会解码、商业内参、Signal 详情、Daily 详情、Opportunity 详情均出现标签。
- 桌面 / 移动无横向溢出。
- 不执行 Netlify 上传。
