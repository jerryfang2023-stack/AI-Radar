---
title: V2 页面模块间距收敛记录
date: 2026-05-10
status: completed
owner: UI / UE Agent / Dev Agent
encoding: UTF-8
---

# V2 页面模块间距收敛记录

## 问题

用户截图指出：`今日要点` 页面中，首个要点模块与 `关键信号` 栏目之间空白过大，阅读路径被打断。

## 原因

- 页面历史 CSS 多轮叠加，`section`、`section.compact`、首页专用模块和卡片组件都各自拥有较大的 padding / gap。
- `section.compact` 后紧接普通 `section` 时，上一个模块的 bottom padding 与下一个模块的 top padding 同时生效，形成双倍栏目间距。
- 双栏模块中，左侧重点卡和右侧列表高度不同，下一栏会按整个双栏容器高度排列，视觉上容易出现空白断层。
- “高级留白”此前被实现为通用大 padding，而不是按页面语义区分 hero、相邻栏目、异质内容组和重大章节切换。

## 已处理

- 在 `01-SiteV2/site/assets/styles.css` 增加 `--ws-section-space-adjacent`，用于相邻栏目节奏。
- 收敛 `section.compact + section` 的顶部距离，避免上下 padding 双倍叠加。
- 针对非首页 `page-hero + section.compact` 的场景降低 compact 模块底部距离。
- 在 `agent-workflow/reports/WSD-20260510-02-v2-design-spec-reconciliation-conflicts.md` 增加 `C18` 和 `2.9 页面模块间距规范`。

## 二次收敛

用户继续指出几乎所有页面栏目间距偏大，并且文字贴着边框。已追加全站覆盖层：

- 收紧全站 `section`、`section.compact`、相邻 section、page hero 的垂直节奏。
- 增加 `--ws-content-inset` 与 `--ws-content-inset-compact`，统一卡片、split band、brief cover、member panel、relation card 的安全内距。
- 移动端将 split band 内部竖线分隔改为顶部横线，避免正文被分隔线挤压。
- 同步收紧 `2.9 页面模块间距规范` 的桌面和移动端数值，并增加“正文不得贴边”的验收项。

## 三次收敛

用户继续指出页面存在无用横线、栏目内排版疏松、栏目间距仍大、首页文字压边和首屏左侧排版异常。已追加视觉噪音清理层：

- 移除 section、page hero、section head、footer、decision path、time index、relation list 等全站横向分隔线。
- 隐藏首页 `decision-path`，避免横线穿过按钮区和首屏左侧排版。
- 收紧全站 section token、grid gap、卡片内距和信号列表行高。
- 将信号卡片三列布局改为更紧凑的 `kicker / title / summary` 信息密度。
- 首页首屏重新限定 `main-shell` 安全边距、左侧 copy 宽度、H1 上限、CTA 换行与主图位置。
- 保留必要卡片边框，不再用大面积横线区隔栏目。

## 验收截图

- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/daily-desktop-spacing-after-2.png`
- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/daily-mobile-spacing-after-2.png`
- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/home-desktop-spacing-after.png`
- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/daily-desktop-spacing-inset-final.png`
- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/daily-mobile-spacing-inset-final-2.png`
- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/signals-desktop-spacing-inset-final.png`
- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/opportunities-desktop-spacing-inset-final.png`
- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/home-desktop-noise-density-final.png`
- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/home-mobile-noise-density-final.png`
- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/daily-desktop-noise-density-final.png`
- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/daily-mobile-noise-density-final.png`
- `agent-workflow/reports/v2-design-qa-fix-2026-05-10/signals-desktop-noise-density-final.png`

## 检查

- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
