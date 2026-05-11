# WSD-20260508-05 V2 判断资产关系网页面补齐

## 任务背景

用户指出：Signals、Point、Trends、Opportunities 不是彼此孤立的栏目，而是互相交融的判断资产。只要有相关联系，就要在对应页面体现出来，并要求检查所有页面。

## 目标

- 在 V2 站点生成数据中保留 Signal / Point / Trend / Opportunity 的关系标记。
- 在主页、今日要点、关键信号、机会解码、商业内参和详情页展示相关资产。
- 页面展示只使用前台语言，不暴露内部处理口径。
- 本地完成桌面和移动端浏览器检查，不上传 Netlify。

## 范围

- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`
- `01-SiteV2/site/index.html`
- `01-SiteV2/site/daily.html`
- `01-SiteV2/site/signals.html`
- `01-SiteV2/site/opportunities.html`
- `01-SiteV2/site/brief.html`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`

## 验收标准

- 生成数据可解析并保留 `relations`。
- Signal 页面能看到相关 Point / Trend / Opportunity。
- Point 所在商业内参页能看到相关 Signal / Trend / Opportunity。
- Trend 所在商业内参页能进入关联判断网。
- Opportunity 页面和详情页能看到相关 Signal / Point / Trend。
- 今日要点页和详情页展示当天判断资产之间的连接。
- 桌面和移动页面无横向溢出。
- `v2content` 与 `syntax` Quality Gates 通过。
- 不执行 Netlify 上传。
