# WSD-20260508-13 V2 首页首屏图融合与左延展收口

## 任务

修复首页首屏图片与页面背景融合不自然、交界处有图片边界，以及右侧图片整体偏右导致左侧空白过多的问题。

## 范围

- `01-SiteV2/site/assets/styles.css`

## 已完成

- 首屏图片起点从 `33%` 左移到 `26%`，让画面向左延展，减少标题与视觉之间的空白。
- 移除原先用白色覆盖层制造融合的方式，避免覆盖层与背景不一致形成分割线。
- 为图片添加横向与纵向渐隐遮罩，让左侧、顶部和底部边缘自然融入页面背景。
- 将首页首屏图改为右侧锚定铺展，保持右侧主体可见，同时让山水和信号流更充分进入首屏。

## 验收

- 桌面 2048px：图片与背景自然融合，右侧无隐藏，无横向溢出。
- 桌面 1440px：图片向左延展，左侧交界无明显矩形边界，无横向溢出。
- 移动 390px：无横向溢出。

## Quality Gates

- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node --check 01-SiteV2/site/dev-server.mjs`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。

## 截图与记录

- QA 截图目录：`agent-workflow/reports/v2-hero-image-blend-extend-2026-05-08/`
- Quality Gates 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-08-20260508-054238.md`

## 未做事项

- 未重新生成图片资产。
- 未调整首屏文字、按钮、导航和后续栏目。
- 未部署 Netlify。
