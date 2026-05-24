---
task_id: WSD-20260522-trend-tracking-page-redesign-spec
title: 趋势追踪页面规划与重设计规格
date: 2026-05-22
status: ready
owner: Experience & Editorial / Product Commander
encoding: UTF-8
---

# WSD-20260522 Trend Tracking Page Redesign Spec｜趋势追踪页面规划与重设计规格

## 1. 任务目标

本任务是趋势追踪栏目专项规划与重设计规格任务，不是代码实现任务。

目标：基于现在的卡片设计、前台字段治理、今日观察内容定位变化和趋势候选 / 趋势报告的证据边界，重新确定“趋势追踪”栏目应该呈现哪些内容、以什么形式呈现、哪些内容不应该呈现。

旧版 `trend-tracking.html` / `trend-detail.html` 的设计样式、模块结构和报告频道逻辑全部不要，不得在老版面上缝缝补补。可以读取旧页面和 `app.js` 了解当前数据来源与渲染字段，但不得以旧版面作为改造底稿。

## 2. 最小读取

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/01-product-map.md`
4. `context/02-vi-style.md`
5. `context/03-copy-style.md`
6. `context/06-execution-harness.md`
7. `agent-workflow/product/DESIGN.md`
8. `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
9. 本派发单：`agent-workflow/execution/WSD-20260522-trend-tracking-page-redesign-spec.md`

## 3. 必须吸收的当前结论

必须读取并吸收：

- `agent-workflow/reports/WSD-20260522-site-page-module-layer1-diagnostic-closeout.md`
- `agent-workflow/reports/WSD-20260522-business-signals-page-redesign-spec-closeout.md`（如存在）
- `agent-workflow/reports/WSD-20260522-daily-observation-page-redesign-spec-closeout.md`（如存在）
- `agent-workflow/reports/WSD-20260522-opinion-rating-governance-closeout.md`
- `agent-workflow/reports/WSD-20260522-opinion-rating-followbuilders-closeout.md`

如果商业信号或今日观察重设计 closeout 不存在，不得阻塞本任务；执行窗口必须使用对应派发单中的约束，先明确“趋势追踪与今日观察、商业信号的边界”。

## 4. 设计规范与可调用参考

必须优先遵守项目规范：

- `context/02-vi-style.md`
- `agent-workflow/product/DESIGN.md`
- `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
- `docs/brand/wavesight-ai-vi/brand-tokens.css`
- `docs/brand/wavesight-ai-vi/USAGE.md`
- `docs/brand/wavesight-ai-vi/visual-identity-guidelines.md`
- `docs/brand/wavesight-ai-vi/typography-guidelines.md`

可以参考但不得覆盖项目规范：

- `design-taste-frontend`
- `gpt-taste`
- `redesign-existing-projects`
- `high-end-visual-design`
- `awesome-design-md`

执行窗口必须输出“设计方案选择说明”：

| 方案 | 适合点 | 不适合点 | 是否采用 |
|---|---|---|---|

至少比较 2-3 种方向，例如：

- 趋势观察看板型。
- 成熟趋势报告型。
- 信号证据累积 / 趋势雷达型。
- 内参式趋势档案型。

最终方案必须说明为什么适合观澜 AI，不得默认套用旧报告频道、资讯流、标签墙、普通 SaaS dashboard 或趋势榜单。

## 5. 只允许补读的代码 / 数据文件

只允许补读趋势追踪相关前台文件和数据：

- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/trend-tracking.html`
- `01-SiteV2/site/trend-detail.html`
- `01-SiteV2/site/index.html` 中趋势追踪相关模块
- `01-SiteV2/site/assets/styles.css` 中趋势追踪相关样式

按需补读：

- `agent-workflow/product/card-asset-copy-governance.md`
- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/tag-taxonomy.md`

不得读取 V1 / V2.0 历史页面方案、旧失败任务、旧页面截图、旧自动化方案或已删除文档。

## 6. 执行边界

允许：

- 重新定义趋势追踪栏目定位。
- 重新定义趋势追踪栏目页的信息架构。
- 重新定义趋势观察方向、趋势候选、正式趋势报告的前台呈现差异。
- 输出趋势详情页模板。
- 输出趋势与今日观察、商业信号、观点卡、内参之间的关系模型。
- 输出日期 / 时间窗口、tags 分类、关键词检索规格。
- 输出 Copy-first 文案表。
- 输出 Typography 页面位置表。
- 输出桌面端验收清单。

不允许：

- 修改代码。
- 修改 `site-content.json`。
- 生成新页面文件。
- 进入 Build & Release。
- 推送 GitHub。
- 部署 Netlify。
- 新增一级导航。
- 把趋势候选包装成正式趋势。
- 把单条新闻、单个观点或单个公司动作包装成趋势。
- 恢复 V1 / V2.0 页面逻辑。
- 在旧 `trend-tracking.html` / `trend-detail.html` 版面上局部修补。

## 7. 必须解决的问题

### 7.1 重新确定趋势追踪栏目内容

执行窗口必须先回答：

- 今日观察定位变化后，哪些内容应留在今日观察，哪些才属于趋势追踪。
- 商业信号页面重设计后，哪些内容应留在商业信号，哪些才属于趋势追踪。
- 趋势追踪是否更适合做“趋势观察看板”而不是“报告频道”。
- 当前证据不足时，趋势追踪如何呈现观察方向，而不是硬写趋势报告。

必须输出栏目边界表：

| 内容类型 | 今日观察 | 商业信号 | 趋势追踪 | 商业内参 |
|---|---|---|---|---|

### 7.2 趋势内容分层

必须至少区分：

- 观察方向：有若干信号，但趋势尚未成立。
- 趋势候选：已有多个信号 / 场景 / 观点参照，但证据仍需补足。
- 趋势快报：证据较强，可形成短报告。
- 深度趋势报告：证据足够，可形成完整报告。
- 机会判断段落：进入趋势报告或商业内参，不作为单独栏目。

必须输出：

| 层级 | 进入条件 | 前台呈现 | 不得呈现 |
|---|---|---|---|

### 7.3 页面结构

必须输出两类页面规格：

1. 趋势追踪栏目页。
2. 趋势详情页。

趋势详情页必须根据内容成熟度区分：

- 观察方向短详情。
- 正式趋势报告详情。

不得所有趋势内容都套同一套长报告模板。

### 7.4 与新卡片设计的关系

必须基于新的卡片形式和字段特征设计：

- 支撑信号卡。
- 案例 / 融资 / 产品服务卡。
- 已评级观点参照卡。
- 趋势观察卡。
- 趋势报告卡。
- 反证 / 缺口卡。
- 关联内参卡。

必须明确每种卡片在趋势追踪中的用途、字段和跳转目标。

### 7.5 日期 / 时间窗口与 tags 检索

必须支持：

- 按更新时间或观察窗口查看。
- 7D / 30D / 90D 观察窗口。
- tags 分类：行业、流程、岗位 / 部门、技术路线、商业变量、证据状态。
- 关键词检索：趋势标题、观察方向、支撑信号、公司 / 人物、tags、商业变量。
- 空状态：证据不足、无正式趋势、筛选过窄、无相关观察方向。

Tags 不得作为一级栏目，不得做成标签墙主视觉。

### 7.6 关联关系

必须建立卡片之间的关联关系：

- 趋势观察 -> 支撑商业信号。
- 趋势观察 -> 案例 / 融资 / 产品服务卡。
- 趋势观察 -> 观点卡。
- 趋势观察 -> 今日观察文章。
- 趋势观察 -> 商业内参。
- 趋势报告 -> 变化短专题 / 成熟趋势候选。
- tags -> 同类趋势方向聚合。
- 时间窗口 -> 证据增强 / 减弱 / 争议状态。

必须输出关系模型表：

| 关系 | 起点 | 终点 | 前台展示方式 | 数据字段来源 | 不得展示 |
|---|---|---|---|---|---|

## 8. 输出要求

closeout 必须写入：

```text
agent-workflow/reports/WSD-20260522-trend-tracking-page-redesign-spec-closeout.md
```

必须包含以下章节。

### 8.1 设计方案选择说明

至少比较 2-3 个可用方案，并选择最终方案。

### 8.2 趋势追踪栏目边界表

明确趋势追踪和今日观察、商业信号、商业内参的边界。

### 8.3 趋势追踪栏目页信息架构

输出栏目页完整结构表：

| 顺序 | 区块 | 用户任务 | 内容 | 数据来源 | 处理 |
|---|---|---|---|---|---|

### 8.4 趋势内容分层与呈现表

输出观察方向、趋势候选、趋势快报、深度趋势报告、机会判断段落的进入条件与展示形式。

### 8.5 卡片类型与字段表

至少包含：

- 趋势观察卡。
- 趋势报告卡。
- 支撑信号卡。
- 案例 / 融资 / 产品服务卡。
- 观点参照卡。
- 反证 / 缺口卡。
- 关联内参卡。

字段表：

| 卡片类型 | 栏目页字段 | 详情页字段 | 侧栏字段 | 禁止字段 |
|---|---|---|---|---|

### 8.6 趋势详情页模板

必须分别输出：

- 观察方向短详情模板。
- 正式趋势报告详情模板。

表格：

| 顺序 | 模块 | 内容 | 字段来源 | 备注 |
|---|---|---|---|---|

### 8.7 日期 / 时间窗口与 tags 检索规格

输出：

| 功能 | 输入 | 输出 | 空状态 | 交互说明 |
|---|---|---|---|---|

### 8.8 关系模型与关联展示

输出趋势、商业信号、观点卡、今日观察、内参、tags、时间窗口之间的关系模型、关系展示位置和关系交互。

### 8.9 Copy-first 文案表

必须包含：

- 栏目页 H1。
- 栏目说明。
- 趋势观察区标题。
- 证据缺口 / 反证区标题。
- 时间窗口文案。
- tags / 搜索文案。
- 卡片字段标签。
- 空状态。
- 趋势详情页模块标题。

### 8.10 Typography 页面位置表

必须按 `page-typography-position-guidelines.md` 输出趋势追踪栏目页、观察方向短详情页、正式趋势报告详情页的字号 / 行高 / 字重 / 字体族。

### 8.11 桌面端验收清单

必须输出给后续 Build & Release 使用的验收清单。

## 9. 验证要求

本任务不改代码，因此不运行构建和截图。

必须完成：

- 解析 `site-content.json`，确认当前趋势、趋势报告、信号、观点、tags、relations 字段来源。
- 说明是否存在字段缺口。
- 说明哪些设计规格依赖后续数据补齐。
- 说明是否读取并遵守页面 / 文案 / Typography Harness。
- 明确阶段 2B 是否可以启动；如果可以，只能在用户确认本规格后启动。

## 10. 新窗口执行指令

```text
请执行任务：WSD-20260522-trend-tracking-page-redesign-spec

你是 Experience & Editorial + Product Commander 协作执行窗口。本任务是趋势追踪页面规划与重设计规格任务，不是开发任务。

核心要求：
1. 根据现在的卡片设计，重新确定趋势追踪栏目应该有哪些内容呈现。
2. 根据今日观察内容定位变化，重新划清今日观察、商业信号、趋势追踪、商业内参的栏目边界。
3. 明确趋势追踪内容以什么形式呈现：观察方向、趋势候选、趋势快报、深度趋势报告、机会判断段落。
4. 老的设计样式全部不要，不在旧 `trend-tracking.html` / `trend-detail.html` 版面上缝缝补补。
5. 页面必须基于项目设计规范选择最适合观澜 AI 的方案。
6. 必须支持时间窗口 / 日期、tags 归类、关键词检索。
7. 必须建立趋势、信号卡、观点卡、今日观察、内参、tags 之间的关联关系。

只读取派发单指定的最小上下文和允许补读文件。

不要改代码。
不要改数据。
不要生成页面。
不要进入 Build。
不要推送或部署。
不要新增一级导航。
不要把趋势候选包装成正式趋势。

完成后写 closeout：
agent-workflow/reports/WSD-20260522-trend-tracking-page-redesign-spec-closeout.md
```
