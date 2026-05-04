# 2026-05-03 UI / Signal Source 小修报告

## 背景

用户指出两个前台小错误：

1. Daily Brief 详情页顶部标注框在桌面端换成两行，信息密度偏松。
2. Signals 栏目详情页“要闻”区没有展示原始新闻来源跳转链接。

## 处理

- UI / UE Agent 视角：将 Daily Brief 详情页顶部标注框升级为判断摘要栏，最终保留 3 个字段：`变化类型`、`证据强度`、`趋势状态`，去掉 `The Point`、`下一步验证`、`优先机会` 和重复标题的 `今日主线`，避免顶部过度拥挤。
- Dev Agent 视角：为 Signals 详情页新增来源链接渲染逻辑，从 `signal.urls` 与 `signal.source` 中提取原始链接，显示在“要闻”正文下方。
- Dev Agent 视角：清理 Signals “要闻”正文里的历史内联来源链接与带来源链接的 `补充/来源` 尾段，避免正文和来源跳转重复。
- Copy / Data 边界：链接文案使用“原始来源”，保持前台克制表达；未改动原始 Markdown 字段与标签体系。

## 文件

- `04-Site/js/app.js`
- `04-Site/css/styles.css`

## 验证

- `node --check 04-Site/js/app.js` 通过。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0。

## 自动化影响

本轮只调整前台渲染与样式，不改变 Markdown 结构、同步脚本输入字段、自动化生成规则或三段式同步边界，因此不需要更新 `ai-the-point`、`ai-2`、`ai-3` 三个自动化任务。
