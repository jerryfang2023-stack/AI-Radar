# WSD-20260508-11 V2 首页首屏图移除人物收口

## 任务

用户要求去掉首页首屏右侧图片中的人物。

## 改动范围

- `01-SiteV2/site/assets/brand/home-hero-intelligence.png`

## 完成内容

- 使用图像生成编辑方式移除右侧人物。
- 保留山水背景、AI 信号流、玻璃分析面板、平台反射和金蓝色调。
- 首页仍引用同一路径：`assets/brand/home-hero-intelligence.png`。

## 验证

- `node --check 01-SiteV2/site/assets/app.js`：passed
- `node --check 01-SiteV2/site/dev-server.mjs`：passed
- 浏览器截图检查：无人物、无横向溢出。

## 截图与检查

- 目录：`agent-workflow/reports/v2-hero-image-remove-person-2026-05-08/`
- 截图：`desktop-home-no-person.png`
- 检查：`qa.json`

## 未做

- 未部署 Netlify。
- 未提交 Git。
