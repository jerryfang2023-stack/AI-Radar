---
title: V2 HomeTemplate 首页母版调整记录
date: 2026-05-10
status: completed
owner: UI / UE Agent / Dev Agent
encoding: UTF-8
---

# V2 HomeTemplate 首页母版调整记录

## 范围

本轮只处理首页母版，不处理栏目页、详情页、归档页和会员内参页。

## 问题

- 首页由多轮补丁叠加形成，Hero、Brief、Signals、Opportunity、Related、Timeline 使用不同阶段的布局规则。
- 首页运行时注入 `decision-path`，造成首屏按钮区和左侧排版被横线干扰。
- `Opportunity`、`Related` 与 `Signals` 混用通用 `.card-inner` / `.relation-row`，导致比例不统一、局部窄列和错位。
- 首页没有独立作用域，通用栏目样式会反向影响首页。

## 已调整

- `index.html`：为首页主容器增加 `home-template` 作用域。
- `app.js`：移除首页 `decision-path` 动态注入。
- `styles.css`：新增 `HomeTemplate v1` 样式层。
- Hero 固定为左右双栏叙事，移动端降为单列。
- `home-briefing` 固定为 `Daily Brief + Signals` 双栏。
- `Signals` 使用首页专属紧凑卡片，不再继承栏目页大列表比例。
- `home-secondary` 固定为 `Opportunity + Related` 双栏，避免机会卡窄列断字。
- `Timeline` 使用首页专属三列卡片，移动端降单列。

## 验收截图

- `agent-workflow/reports/v2-template-home-2026-05-10/home-template-desktop.png`
- `agent-workflow/reports/v2-template-home-2026-05-10/home-template-desktop-fullpage.png`
- `agent-workflow/reports/v2-template-home-2026-05-10/home-template-mobile.png`

## Full-page 复查备注

桌面 full-page 截图已补做。首屏结构已稳定，但完整首页仍暴露两处需进入下一轮 HomeTemplate polish 的问题：

- `机会解码 / 相关观察` 标题锚点不够统一，左右两个模块的标题位置仍显得像不同系统拼接。
- `近期归档` 左侧标题占位偏重，归档网格起点与标题区之间的比例还需要进一步收敛。

## 8 项质检与修复

用户要求按 8 项清单自查当前首页，并逐项修复。本轮已完成 HomeTemplate QA polish。

| 检查项 | 发现问题 | 处理结果 |
|---|---|---|
| 字号是否混乱 | 第二屏以下标题锚点与层级仍不够统一 | 收敛 `机会解码 / 相关观察 / 近期归档` 标题字号和左上锚点 |
| 模块间距是否忽大忽小 | `Opportunity + Related` 与 `Archive` 间节奏不够稳 | 收紧 `home-secondary`、`home-timeline` padding 和 gap |
| 卡片样式是否不统一 | 机会卡、相关观察卡、归档卡表面质感略有差异 | 统一边框透明度、背景、圆角和阴影策略 |
| 首屏是否缺乏视觉重心 | 首屏已稳定，主标题 + 主图形成明确焦点 | 保留现有 Hero 结构 |
| 按钮是否没有主次 | CTA 主次已清晰，但继续加固 | 主按钮深海蓝，次按钮浅底，文本按钮弱化 |
| 移动端是否拥挤 | 归档区曾在移动端被桌面三列规则覆盖，出现竖排文字 | 强制移动端归档单列，禁止横向溢出 |
| 是否有廉价感 | 下方仍有旧分隔线和局部边框偏多 | 移除 HomeTemplate 内部无语义分隔线，保留轻卡片边界 |
| 是否符合 Apple / Linear / Stripe | 首页已从拼贴转为单一母版，但仍以 WaveSight VI 为主 | 保持克制留白、清晰层级、轻表面和商业叙事 |

## QA 验收截图

- `agent-workflow/reports/v2-template-home-2026-05-10/home-template-qa-desktop-fullpage-final.png`
- `agent-workflow/reports/v2-template-home-2026-05-10/home-template-qa-mobile-fullpage-final.png`

## 检查

- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。

## 后续模板顺序建议

1. `ColumnTemplate`：今日要点 / 关键信号 / 机会解码一级栏目页。
2. `DetailTemplate`：Signal / Daily / Opportunity 详情页。
3. `ArchiveTemplate`：时间线与历史归档。
4. `MemberBriefTemplate`：商业内参和会员内容页。

## HomeTemplate V2 重构补充

用户在本轮明确要求先设计 HomeTemplate 页面结构，再实现代码；并给出最终 VI 级 tokens。已按“AI 商业决策内参平台”定位重构首页，而不是延续旧新闻流或后台卡片拼接。

### 页面结构

1. Header：Logo + `AI商业决策内参` slogan；导航为：首页 / 今日要点 / 关键信号 / 机会解码 / 商业内参；右侧为搜索、会员入口、登录头像。
2. Hero：主标题 `观AI之澜，识商业之势`，副标题说明“看懂变化、判断影响、找到行动起点”，主次 CTA 分离；右侧沿用现有首页主视觉图片。
3. 今日要点：左侧今日核心判断，右侧 3 条精选要点卡，字段包含标题、一句话判断、影响对象、重要等级、阅读时间。
4. 关键信号：3 列信号卡，字段包含信号类型、标题、来源/时间、为什么重要、影响行业、趋势标签。
5. 机会解码：左侧今日重点机会，右侧更多机会方向列表，字段包含适合人群、前置条件、潜在价值、风险提醒、进入方式。
6. 商业内参：深海蓝高级卡片，呈现最新一期内参、摘要、核心问题、适合阅读人群、会员标签、查看详情按钮。
7. 底部 CTA：`让AI变化，变成你的商业判断力`，按钮为加入内测 / 订阅内参。

### 最终设计 Tokens

- 页面最大宽度：`1560px`；桌面左右安全边距 `64-128px`；移动端 `calc(100% - 24px)`。
- 背景色：`#fffdf8` / `#f7f4ef`，暖白到雾灰的极轻背景。
- 主文字：`#071827`。
- 辅助文字：`rgba(7, 24, 39, 0.62-0.76)`。
- 主色：`#071827`。
- 点缀色：`#c8a766`，仅用于编号、少量强调。
- 卡片背景：`rgba(255, 253, 248, 0.68)`。
- 卡片圆角：`8px`。
- 卡片 padding：桌面 `22-44px`；紧凑卡片 `22-24px`；移动端 `18-22px`。
- 模块间距：重大章节切换 `48-64px`。
- 卡片边框：`1px solid rgba(7, 24, 39, 0.07)`。
- 阴影：`0 22px 70px -62px rgba(7, 24, 39, 0.42)`，极轻。
- 字体层级：H1 `52-76px` / 移动端 `36px`；H2 `32-40px`；H3 `18-32px`；正文 `14-18px`；辅助说明 `12-13px`。

### 变更文件

- `01-SiteV2/site/index.html`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`

### 截图与检查

- 桌面 full-page：`agent-workflow/reports/v2-template-home-2026-05-10/home-template-v2-vi-desktop-full.png`
- Hero 背景融合：`agent-workflow/reports/v2-template-home-2026-05-10/home-template-v2-hero-background-blend-desktop-full.png`
- 商业内参封面并排：`agent-workflow/reports/v2-template-home-2026-05-10/home-template-v2-brief-cover-row-desktop-full.png`
- 容器检查：主容器 `1552px`，Header `1552px`，符合 1680px 视口下 `calc(100% - 128px)`。
- 卡片检查：圆角 `8px`，padding `44px` / 紧凑卡片 `22px 24px`，边框 `rgba(7, 24, 39, 0.07)`。
- 溢出检查：桌面端未发现横向溢出。
- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过；脚本报告中部分子检查因当前环境 `spawn EPERM` 降级跳过，需保留浏览器截图作为补充视觉验收。

### 2026-05-10 18:40 调整

- Hero 右侧图片恢复为原图，并作为背景融合层处理，不再是孤立图片块。
- 商业内参封面卡恢复到商业内参 Section，与深色内参卡并排一行。
- Header 导航样式提升为全站标准导航栏，不再只作用于首页。
- 搜索从文字入口改为标准搜索框，提交到 `signals.html?q=...`，为后续真实检索接入预留结构。

### 2026-05-10 18:50 封面规范补充

- 商业内参封面抬头改为 `WAVESIGHT AI INSIGHT`。
- 保留 `Issue 05`、`AI商业决策内参`、`本期主题：AI Agent 重构企业工作流`。
- 增加显式关键词行：`Agent / Workflow / Decision / Growth`。
- 封面继续使用暖白纸张质感、深海蓝标题、香槟金短线、细网格、坐标轴、趋势线和数据点。
- 桌面截图：`agent-workflow/reports/v2-template-home-2026-05-10/home-template-v2-cover-wavesight-desktop-full.png`。

### 2026-05-10 19:28 商业内参预览卡补充

- 深色商业内参卡更新为 `今日商业内参预览`。
- 卡片包含：内参编号、日期、今日核心判断、三个关键信号、一个机会解码、一个风险提示。
- 保留同栏右侧目录、摘要、核心问题、适合阅读人群和 `查看内参` 按钮。
- 截图：`agent-workflow/reports/v2-template-home-2026-05-10/home-template-v2-brief-preview-card-desktop-full.png`。
- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过；脚本报告仍提示部分子检查因 `spawn EPERM` 降级跳过。

### 2026-05-10 19:45 栏目压缩与机会三条

- 信号卡精简为三项关键指标：影响等级、观察窗口、相关行业，并压缩“为什么重要”正文。
- 机会解码右侧列表从 4 条收为 3 条。
- 机会大卡将重复字段压成三条短批注，减少左侧拥挤。
- 机会栏目高度由约 `922px` 降为约 `713px`。
- 截图：`agent-workflow/reports/v2-template-home-2026-05-10/home-template-v2-opportunity-three-desktop-full.png`。

### 2026-05-10 20:20 商业内参 Preview Card 排版修复

- 深色商业内参卡按“封面 + 目录预览”重新收敛：左侧为 `INSIGHT BRIEF Preview.001`、香槟金短线、两行主标题、摘要与三段核心信息；右侧为 `CONTENTS` 目录、5 条内参结构和弱化 CTA。
- 修复桌面并排状态下内部网格挤压导致的文字重叠：取消右侧目录硬最小宽度，标题字号上限降为更适合并排卡片的 `50px`，左右栏改为弹性比例。
- CTA 控制为 `300px × 52px`，不再铺满右栏；目录行高控制在 `76-80px`，分割线保持低对比。
- 桌面验收：暗卡 `982px × 680px`，标题两行宽度均为 `495px`，未发现暗卡横向溢出。
- 移动验收：暗卡宽度 `366px`，标题 `36px`，暗卡未发现横向溢出。
- 截图：`agent-workflow/reports/v2-template-home-2026-05-10/home-template-v2-brief-card-report-layout-desktop-full.png`。
- 移动截图：`agent-workflow/reports/v2-template-home-2026-05-10/home-template-v2-brief-card-report-layout-mobile-full.png`。
- `node --check 01-SiteV2/site/assets/app.js`：通过。

### 2026-05-10 20:28 商业内参背景线降噪与整页复核

- 将深色内参卡背景网格从可见装饰线降为极淡坐标层：网格透明度 `0.035`，坐标轴透明度 `0.045`，网格间距调整为 `56px`。
- 目录自身的细分割线保留，避免背景线与目录线叠加造成杂乱。
- 首页整页复核：Hero `550px`；今日要点 `546px`；关键信号 `653px`；机会解码 `713px`；商业内参 `680px`；底部 CTA `313px`。
- 模块间距复核：相邻模块均约 `56px`，符合重大章节切换 `48-64px` 的 VI 规范。
- 横向溢出复核：桌面端未发现横向溢出。
- 截图：`agent-workflow/reports/v2-template-home-2026-05-10/home-template-v2-brief-card-grid-muted-desktop-full.png`。
- 整页截图：`agent-workflow/reports/v2-template-home-2026-05-10/home-template-v2-next-step-desktop-full.png`。
