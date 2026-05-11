---
title: V2 字号系统收敛记录
date: 2026-05-10
status: completed
owner: UI / UE Agent
encoding: UTF-8
---

# V2 字号系统收敛记录

## 1. 触发问题

用户反馈当前栏目字体大小混乱。截图显示：

- 关键信号列表页标题、列表标题和摘要比例不稳。
- 信号详情页 H1 过大，英文缩写和中文混排显得突兀。
- 移动端标题出现英文缩写被拆字的问题。

## 2. 原因判断

主要原因是 `01-SiteV2/site/assets/styles.css` 中存在多轮页面补丁叠加：

- `.home-copy h1`、`.page-hero h1`、`.article h1`、`.brief-cover h2` 被多次定义。
- 后段样式使用多个 `clamp(..., 72px/86px/96px)`，让栏目页、详情页和首页的标题上限混在一起。
- 动态渲染的 `h1 / h2 / h3` 由不同上下文选择器接管，导致同一类栏目内容标题吃到不同字号规则。
- 旧规则中的 `overflow-wrap: anywhere` 会把 `CX` 等英文缩写拆开。

## 3. 完成改动

仅修改：

```text
01-SiteV2/site/assets/styles.css
```

新增 `V2 typography convergence` 收口层：

- 首页 H1：保留首屏级别，但收敛到 `52-76px`。
- 栏目页 H1：收敛到 `40-56px`。
- 详情页 H1：收敛到 `38-56px`。
- 首页重点 Brief 标题：收敛到 `34-54px`。
- Section H2：收敛到 `26-36px`。
- 卡片 H3：收敛到 `18-22px`。
- 重点卡片标题：收敛到 `22-30px`。
- 移动端建立单独上限：详情 / 栏目标题约 `30-38px`。
- 覆盖标题 `overflow-wrap:anywhere`，避免英文单词和缩写被硬拆。

## 4. 验证

本地访问：

```text
http://127.0.0.1:4173/signals.html
http://127.0.0.1:4173/signal-detail.html?id=agent-control-plane
```

截图：

```text
agent-workflow/reports/v2-typography-convergence-2026-05-10/signals-desktop.png
agent-workflow/reports/v2-typography-convergence-2026-05-10/signal-detail-desktop.png
agent-workflow/reports/v2-typography-convergence-2026-05-10/signal-detail-mobile.png
agent-workflow/reports/v2-typography-convergence-2026-05-10/signal-detail-mobile-after.png
```

检查：

- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
- 最新报告：`agent-workflow/reports/quality-gates-syntax-2026-05-10-20260510-052351.md`。

说明：

- Playwright 首次使用时缺少内置 Chromium 下载，安装超时；随后改用本机 Chrome channel 完成截图。
- 本轮只做字号系统收敛，没有重做整体页面信息架构。

## 5. 后续建议

下一步如继续高级商业网站方向，应把字号 token 纳入 `DESIGN.md`，并清理 `styles.css` 中历史重复补丁，避免后续再被旧规则覆盖。
