---
task_id: WSD-20260522-card-frontend-field-confirmation
title: 卡片前台显示字段确认
date: 2026-05-22
status: ready
owner: Experience & Editorial / Product Commander
encoding: UTF-8
---

# WSD-20260522 Card Frontend Field Confirmation｜卡片前台显示字段确认

## 1. 任务目标

本任务是网站页面与模块治理阶段 2A 的前置确认任务。

目标不是设计页面，也不是修改代码，而是把当前公开前台所有涉及到“卡片”的位置、卡片类型、当前展示字段、可用数据字段和样例内容完整列出来，交给用户逐项确认：

- 哪些字段允许显示在前台。
- 哪些字段需要改名后显示。
- 哪些字段只允许进入详情页。
- 哪些字段必须禁止前台展示。
- 哪些字段需要先生成新的 `frontend` 展示字段后再进入页面。

用户确认后，才能继续正式阶段 2A 页面结构、Copy-first 和 Typography 规格输出。

## 2. 最小读取

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/01-product-map.md`
4. `context/03-copy-style.md`
5. `context/06-execution-harness.md`
6. `agent-workflow/product/card-asset-copy-governance.md`
7. `agent-workflow/reports/WSD-20260522-site-page-module-layer1-diagnostic-closeout.md`
8. 本派发单：`agent-workflow/execution/WSD-20260522-card-frontend-field-confirmation.md`

## 3. 只允许补读

只允许补读当前前台卡片字段直接相关文件：

- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/index.html`
- `01-SiteV2/site/daily.html`
- `01-SiteV2/site/daily-detail.html`
- `01-SiteV2/site/signals.html`
- `01-SiteV2/site/signal-detail.html`
- `01-SiteV2/site/trend-tracking.html`
- `01-SiteV2/site/trend-detail.html`
- `01-SiteV2/site/brief.html`

不得读取 V1 / V2.0 历史页面方案、旧失败任务、旧同步方案或已删除文档。

## 4. 执行边界

允许：

- 盘点当前前台所有卡片类型和卡片出现位置。
- 从当前 `site-content.json` 抽取字段名和少量样例值。
- 从 `app.js` 识别当前实际渲染字段。
- 标注字段当前是否已经显示、可显示、疑似内部字段、需要用户确认。
- 输出用户确认表。

不允许：

- 修改站点代码。
- 修改 `site-content.json`。
- 修改内容库或知识库资产。
- 自动裁剪字段。
- 自动改名字段。
- 生成新的页面结构。
- 输出 Typography 规格。
- 进入 Build & Release。
- 推送 GitHub 或部署 Netlify。

## 5. 必须覆盖的前台卡片范围

至少覆盖以下位置。执行窗口如果发现其他卡片位置，也必须补入表格：

| 页面 / 位置 | 需要盘点的卡片 |
|---|---|
| 首页 `index.html` | 今日观察主卡、今日观察辅助卡、商业信号主卡、商业信号列表卡、趋势观察卡、商业内参预览卡、CTA 卡 |
| 今日观察 `daily.html` | 今日主线卡、当日商业信号卡、观点参照卡、后续观察卡 |
| 今日观察详情 `daily-detail.html` | 引用信号卡、观点参照卡、相关内容卡、前后判断变化卡 |
| 商业信号 `signals.html` | 今日精选信号卡、信号台账行卡、筛选结果卡、相关观点入口卡 |
| 商业信号详情 `signal-detail.html` | 来源事实卡、商业影响卡、边界与反证卡、后续观察卡、观点参照卡、相关内容卡 |
| 趋势追踪 `trend-tracking.html` | 当前观察方向卡、支撑信号卡、证据缺口卡、观察窗口卡、历史趋势报告卡、内参关联卡 |
| 趋势详情 `trend-detail.html` | 趋势判断卡、支撑变化卡、前沿观点参照卡、风险 / 反证卡、相关内容卡 |
| 商业内参 `brief.html` | 本期内参预览卡、核心判断卡、来源摘要卡、热力变化卡、往期内参卡、订阅 / 访问卡 |
| 全站通用 | 导航入口卡、页尾 CTA 卡、任何由 `contentIndex.signals` / `contentIndex.points` / `contentIndex.trends` / `brief` 派生的卡片 |

补充约束：

- 必须吸收 `agent-workflow/reports/WSD-20260522-opinion-rating-governance-closeout.md` 的最新结论。
- 必须吸收 `agent-workflow/reports/WSD-20260522-opinion-rating-followbuilders-closeout.md` 的 522 follow-builders 权重与前台展示结论。
- 观点卡字段确认表必须列出 `opinionTier` / `displayLane` / `publishStatus` / `ratingScore` / `selectionReason` 这类评级字段。
- 观点卡前台当前只允许盘点 `feature` / `sidebar` 可见数据；`archive` / `discard` 作为禁止前台或内部归档风险项说明，不得建议直接展示。

## 6. 输出表格要求

closeout 必须输出以下表格。

### 6.1 卡片清单总表

| 编号 | 页面 | 卡片名称 | 当前数据来源 | 当前渲染函数 / 代码位置 | 是否当前显示 | 备注 |
|---|---|---|---|---|---|---|

### 6.2 当前展示字段表

| 卡片编号 | 字段路径 | 当前页面标签 / 文案 | 当前样例值 | 当前是否显示 | 显示位置 | 用户确认 |
|---|---|---|---|---|---|---|

`用户确认` 列留空，供用户填写：

```text
保留 / 改名后保留 / 仅详情页 / 禁止前台 / 需要 frontend 字段 / 待讨论
```

### 6.3 可用但未显示字段表

| 卡片编号 | 字段路径 | 样例值 | 未显示原因推测 | 是否可能有前台价值 | 用户确认 |
|---|---|---|---|---|---|

不得替用户做最终判断，只能写“可能有前台价值 / 疑似内部字段 / 需要确认”。

### 6.4 内部字段风险表

| 卡片编号 | 字段路径 | 样例值 | 风险类型 | 当前是否已显示 | 建议交给用户确认的问题 |
|---|---|---|---|---|---|

风险类型包括但不限于：

- 生产路径。
- Raw / Pool / gate / eligible / index_only 等生产语言。
- sourcePath / Generated from / follow-builders。
- candidate / draft / threshold_pending 等候选或状态语言。
- 原始社交标题、URL、口语残片。
- 内部编号、结构字段、关系字段。

### 6.5 按卡片类型的字段确认表

分别输出：

- 今日观察卡片字段确认表。
- 商业信号卡片字段确认表。
- 前沿观点 / 观点参照卡片字段确认表。
- 趋势观察 / 趋势报告卡片字段确认表。
- 商业内参卡片字段确认表。
- 通用 CTA / 相关内容卡片字段确认表。

每张表都必须有 `用户确认` 列。

## 7. 输出位置

执行窗口完成后写 closeout：

```text
agent-workflow/reports/WSD-20260522-card-frontend-field-confirmation-closeout.md
```

## 8. 验证要求

本任务不改代码，因此不运行构建或截图验收。

必须完成：

- 说明已读取哪些文件。
- 说明是否发现其他卡片位置。
- 说明是否有字段无法判断来自哪里。
- 运行 `node -e` 或等价方式解析 `site-content.json`，确认字段抽取来源合法。
- closeout 明确：本任务不允许下游进入 Build，只允许用户确认字段后继续阶段 2A 规格设计。

## 9. 新窗口执行指令

```text
请执行任务：WSD-20260522-card-frontend-field-confirmation

你是 Experience & Editorial + Product Commander 协作执行窗口。本任务是阶段 2A 的前置确认任务，只盘点当前前台所有卡片显示字段，交给用户逐项确认。

只读取：
1. AGENTS.md
2. context/00-current-state.md
3. context/01-product-map.md
4. context/03-copy-style.md
5. context/06-execution-harness.md
6. agent-workflow/product/card-asset-copy-governance.md
7. agent-workflow/reports/WSD-20260522-site-page-module-layer1-diagnostic-closeout.md
8. agent-workflow/execution/WSD-20260522-card-frontend-field-confirmation.md

只允许补读当前前台卡片字段直接相关文件：
- 01-SiteV2/site/data/site-content.json
- 01-SiteV2/site/assets/app.js
- 01-SiteV2/site/index.html
- 01-SiteV2/site/daily.html
- 01-SiteV2/site/daily-detail.html
- 01-SiteV2/site/signals.html
- 01-SiteV2/site/signal-detail.html
- 01-SiteV2/site/trend-tracking.html
- 01-SiteV2/site/trend-detail.html
- 01-SiteV2/site/brief.html

不要改代码。
不要改数据。
不要生成页面。
不要输出 Typography 规格。
不要进入 Build。
不要推送或部署。

请输出所有前台涉及到的卡片、当前渲染字段、可用但未显示字段、内部字段风险和按卡片类型拆分的用户确认表。每张字段表必须保留“用户确认”列，供用户填写：保留 / 改名后保留 / 仅详情页 / 禁止前台 / 需要 frontend 字段 / 待讨论。

完成后写 closeout：
agent-workflow/reports/WSD-20260522-card-frontend-field-confirmation-closeout.md
```
