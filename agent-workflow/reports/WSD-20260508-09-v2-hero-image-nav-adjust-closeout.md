# WSD-20260508-09 V2 首页首屏图与导航边距收口

## 任务

按用户反馈继续校准 V2 首页：

- Logo 在导航栏中继续向左靠。
- 首页首屏右侧图不再使用 SVG 硬绘，也不再放真实栏目组件。
- 使用 gpt-image2 方向生成一张 PNG 首屏视觉，表达“洞察 AI、把握商业大势”。

## 改动范围

- `01-SiteV2/site/index.html`
- `01-SiteV2/site/assets/styles.css`
- `01-SiteV2/site/assets/brand/home-hero-intelligence.png`

## 完成内容

- 首页右侧视觉切换为 PNG：`assets/brand/home-hero-intelligence.png`。
- 首页图像方向调整为：山水远势、AI 信号流、商业判断焦点、克制金蓝配色、左侧留白可承接首屏标题。
- 移除首页对原 SVG 视觉资产的引用。
- 导航 logo 左侧内边距收至 `0`，实测 2048px 桌面下 logo 与 header 左边界对齐。
- Header 与 main 外沿保持同一左右边界，避免导航条和下方主体错位。

## 验证

- `node --check 01-SiteV2/site/assets/app.js`：passed
- `node --check 01-SiteV2/site/dev-server.mjs`：passed
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed
- 最新语法门禁报告：`agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-200159.md`

## 截图与浏览器检查

目录：`agent-workflow/reports/v2-hero-image-nav-adjust-2026-05-08/`

- `desktop-home-final.png`
- `desktop-home-1440-final.png`
- `mobile-home-final.png`
- `final-hero-nav-qa.json`

关键结果：

- 2048px 桌面：header 左右 `84px / 84px`，main 左右 `84px / 84px`，logo inset `0px`。
- 1440px 桌面：header 左右 `34px / 34px`，main 左右 `34px / 34px`，logo inset `0px`。
- 390px 移动端：无横向溢出。

## 未做

- 未部署 Netlify。
- 未提交 Git。
