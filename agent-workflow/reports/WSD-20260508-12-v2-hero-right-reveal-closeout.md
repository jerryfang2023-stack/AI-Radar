# WSD-20260508-12 V2 首页首屏图右侧裁切修复收口

## 任务

修复首页首屏右侧图片被页面外沿隐藏的问题，让图片右侧主体完整显示。

## 范围

- `01-SiteV2/site/assets/styles.css`

## 已完成

- 收回首页首屏右侧视觉区的负向溢出定位，避免图片容器超出页面右边界。
- 将首页首屏图片从裁切式铺满改为完整适配显示，保留右侧山体、玻璃分析面板、平台和信号流画面。
- 保持现有首屏文字、按钮、VI 字体和品牌色不变。

## 验收

- 桌面 2048px：图片右侧完整显示，无横向溢出。
- 桌面 1440px：图片右侧完整显示，无横向溢出。
- 移动 390px：页面无横向溢出。

## Quality Gates

- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node --check 01-SiteV2/site/dev-server.mjs`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。

## 截图与记录

- QA 截图目录：`agent-workflow/reports/v2-hero-image-right-reveal-2026-05-08/`
- Quality Gates 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-08-20260508-051630.md`

## 未做事项

- 未重新生成首屏图片；本次只修复页面展示裁切问题。
- 未部署 Netlify。
