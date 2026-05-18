# WaveSight Site Navigation Sync - 2026-05-14

## 背景

用户确认新版前台导航采用：

```text
今日观察 / 商业信号 / 趋势追踪 / 商业内参
```

`机会解码` 不再作为一级栏目，降级为趋势追踪和商业内参中的 `机会判断` 段落。

## 本轮同步范围

已同步前台可见文案、页面标题、导航、CTA、账户 / 会员页和后台内容类型显示：

- `01-SiteV2/site/index.html`
- `01-SiteV2/site/daily.html`
- `01-SiteV2/site/daily-detail.html`
- `01-SiteV2/site/signals.html`
- `01-SiteV2/site/opportunities.html`
- `01-SiteV2/site/opportunity-detail.html`
- `01-SiteV2/site/pricing.html`
- `01-SiteV2/site/login.html`
- `01-SiteV2/site/account.html`
- `01-SiteV2/site/admin.html`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/data/site-content.js`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/assets/brand/home-hero-intelligence.svg`

## 同步策略

- 保留现有文件名和路由，例如 `daily.html`、`signals.html`、`opportunities.html`，避免本轮牵动路由、同步脚本和历史链接。
- 前台用户可见名称统一为 `今日观察 / 商业信号 / 趋势追踪 / 商业内参`。
- `opportunities.html` 暂作为趋势追踪页面承载旧机会报告数据。
- `机会` 作为普通商业概念仍可出现，但 `机会解码` 不再作为栏目名出现。

## 验证

本地服务：

```text
http://127.0.0.1:4173
```

页面响应检查通过：

- `index.html`
- `daily.html`
- `signals.html`
- `opportunities.html`
- `brief.html`
- `pricing.html`
- `login.html`
- `account.html`

旧栏目词扫描无命中：

```text
今日要点 / 今日简报 / 关键信号 / 机会解码 / 可试机会 / 机会池 / 机会观察 / 历史机会报告 / 机会拆解
```

质量检查通过：

- `node --check 01-SiteV2/site/assets/app.js`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`
- `node agent-workflow/tools/run-quality-gates.mjs style`

## 后续建议

下一轮再评估是否做路由级重命名：

- `daily.html` -> `daily-observation.html`
- `signals.html` -> `business-signals.html`
- `opportunities.html` -> `trend-tracking.html`

本轮不建议改路由，避免影响现有数据同步、历史链接和详情页入口。
