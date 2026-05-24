---
task_id: WSD-20260522-business-signals-page-redesign-spec
title: 商业信号页面重设计规格
date: 2026-05-22
status: ready
owner: Experience & Editorial / Product Commander
encoding: UTF-8
---

# WSD-20260522 Business Signals Page Redesign Spec｜商业信号页面重设计规格

## 1. 任务目标

本任务是商业信号栏目专项重设计规格任务，不是代码实现任务。

目标：基于新的商业信号卡、案例 / 融资 / 产品服务卡、前沿观点卡评级结果和字段特征，重新设计商业信号列表页、商业信号详情页、观点卡详情页、日期查看、关键词 tags 归类 / 检索和卡片关联关系。

必须从新的信息架构和卡片字段出发，旧版 `signals.html` / `signal-detail.html` 的排版和模块组织不得作为改造底稿。可以读取旧页面和 `app.js` 了解当前数据来源与渲染字段，但不得在旧版面上修修补补。

## 2. 最小读取

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/01-product-map.md`
4. `context/02-vi-style.md`
5. `context/03-copy-style.md`
6. `context/06-execution-harness.md`
7. `agent-workflow/product/DESIGN.md`
8. `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
9. 本派发单：`agent-workflow/execution/WSD-20260522-business-signals-page-redesign-spec.md`

## 3. 必须吸收的当前结论

必须读取并吸收：

- `agent-workflow/reports/WSD-20260522-site-page-module-layer1-diagnostic-closeout.md`
- `agent-workflow/reports/WSD-20260522-opinion-rating-governance-closeout.md`
- `agent-workflow/reports/WSD-20260522-opinion-rating-followbuilders-closeout.md`

如存在以下 closeout，也必须读取：

- `agent-workflow/reports/WSD-20260522-card-frontend-field-confirmation-closeout.md`

如果卡片字段确认 closeout 不存在，不得阻塞本任务；执行窗口必须在本任务内先输出“商业信号专项字段确认表”，只覆盖商业信号页面需要的卡片字段。

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

- 情报台账型。
- 信号关系图谱型。
- 商业内参式阅读型。

最终选择必须解释为什么最适合观澜 AI 商业信号，不得默认套用 SaaS dashboard、资讯流、Bento 卡片墙或旧版 layout。

## 5. 只允许补读的代码 / 数据文件

只允许补读商业信号相关前台文件和数据：

- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/signals.html`
- `01-SiteV2/site/signal-detail.html`
- `01-SiteV2/site/index.html` 中商业信号相关模块
- `01-SiteV2/site/assets/styles.css` 中商业信号相关样式

按需补读：

- `agent-workflow/product/card-asset-copy-governance.md`
- `agent-workflow/product/tag-taxonomy.md`

不得读取 V1 / V2.0 历史页面方案、旧失败任务、旧页面截图、旧自动化方案或已删除文档。

## 6. 执行边界

允许：

- 重新定义商业信号列表页的信息架构。
- 重新定义商业信号详情页模板。
- 新增观点卡详情页规格。
- 输出案例 / 融资 / 产品服务等卡片形态规格。
- 输出观点卡片规格。
- 输出日期查看、tags 分类、关键词检索规格。
- 输出卡片之间关联关系模型。
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
- 把前沿观点做成一级栏目。
- 恢复旧 V1 / V2.0 页面逻辑。
- 在旧 `signals.html` 版面上局部修补。

## 7. 必须解决的问题

### 7.1 新卡片与字段

必须基于新字段和新卡片形式重新设计：

- 商业信号卡：产品服务 / 融资 / 案例 / 成熟变化短专题。
- 观点卡：仅展示 `opinionTier=feature|sidebar` 且 `displayLane=daily_feature|signal_sidebar` 的观点。
- 关系卡：信号与观点、案例、趋势、内参、日期、tags 的连接。

必须明确哪些字段进入：

- 列表页卡片。
- 详情页主内容。
- 侧栏 / 关系区。
- 搜索与筛选。
- 隐藏但可用于关系计算。

不得把 `sourcePath`、Raw / Pool / gate / eligible / index_only / candidate / draft / 后台字段直出到前台。

### 7.2 页面结构

必须输出三类页面规格：

1. 商业信号列表页。
2. 商业信号详情页。
3. 观点卡详情页。

观点卡详情页必须按以下结构组织：

```text
人 / 机构
title
观点原文或摘录
时间线
观澜解读
关联信号
边界：这条观点不能证明什么
```

### 7.3 日期查看

必须支持：

- 按日期查看当天商业信号。
- 日期间切换。
- 日期下的信号数量、观点数量、卡片类型分布。
- 日期为空或无达标卡片时的空状态。

### 7.4 关键词 tags 归类和检索

必须支持：

- tag 分类，例如行业、岗位 / 部门、流程、技术路线、公司、商业变量。
- 多 tag 组合筛选。
- 关键词搜索，至少覆盖标题、事件线、公司 / 人物、tags、商业变量。
- 搜索结果状态：有结果、无结果、输入过短、筛选过窄。

Tags 不得作为一级栏目，不得做成标签墙主视觉。

### 7.5 关联关系

必须建立卡片之间的关联关系：

- 商业信号 -> 观点卡。
- 商业信号 -> 案例卡。
- 商业信号 -> 融资 / 产品服务卡。
- 商业信号 -> 趋势观察 / 趋势报告。
- 商业信号 -> 今日观察。
- 观点卡 -> 支撑或校准了哪些信号。
- 日期 -> 当天信号组合。
- tags -> 同类信号聚合。

必须输出关系模型表：

| 关系 | 起点 | 终点 | 前台展示方式 | 数据字段来源 | 不得展示 |
|---|---|---|---|---|---|

## 8. 输出要求

closeout 必须写入：

```text
agent-workflow/reports/WSD-20260522-business-signals-page-redesign-spec-closeout.md
```

必须包含以下章节。

### 8.1 设计方案选择说明

至少比较 2-3 个可用方案，并选择最终方案。

### 8.2 商业信号页面信息架构

输出商业信号列表页的完整结构表：

| 顺序 | 区块 | 用户任务 | 内容 | 数据来源 | 处理 |
|---|---|---|---|---|---|

### 8.3 卡片类型与字段表

至少包含：

- 产品服务卡。
- 融资卡。
- 案例卡。
- 变化短专题卡。
- 观点参照卡。
- 关系卡。

字段表：

| 卡片类型 | 列表页字段 | 详情页字段 | 侧栏字段 | 禁止字段 |
|---|---|---|---|---|

### 8.4 商业信号详情页模板

必须输出：

| 顺序 | 模块 | 内容 | 字段来源 | 备注 |
|---|---|---|---|---|

详情页必须有：

- 事件 + 商业含义标题。
- 一句话判断。
- 发生了什么。
- 为什么值得看。
- 商业影响。
- 来源与事实。
- 边界与反证。
- 后续观察。
- 相关案例 / 融资 / 产品服务。
- 观点参照。
- 相关趋势 / 今日观察 / 内参。

### 8.5 观点卡详情页模板

必须以“人 + title + 观点 + 时间线”组织，输出：

| 顺序 | 模块 | 内容 | 字段来源 | 备注 |
|---|---|---|---|---|

必须明确：

- speaker / 机构如何展示。
- title 如何中文化。
- 原文摘录和长英文如何处理。
- 时间线如何组织。
- 观澜解读放在哪里。
- 与商业信号的关系如何展示。
- 观点不能证明什么。

### 8.6 日期查看和 tags 检索规格

输出：

| 功能 | 输入 | 输出 | 空状态 | 交互说明 |
|---|---|---|---|---|

### 8.7 关系模型与关联展示

输出卡片关系模型、关系展示位置和关系交互。

### 8.8 Copy-first 文案表

必须包含：

- 栏目页 H1。
- 栏目说明。
- 筛选区文案。
- 日期切换文案。
- tags / 搜索文案。
- 卡片字段标签。
- 空状态。
- 详情页模块标题。
- 观点详情页模块标题。

### 8.9 Typography 页面位置表

必须按 `page-typography-position-guidelines.md` 输出商业信号列表页、商业信号详情页、观点卡详情页的字号 / 行高 / 字重 / 字体族。

### 8.10 桌面端验收清单

必须输出给后续 Build & Release 使用的验收清单。

## 9. 验证要求

本任务不改代码，因此不运行构建和截图。

必须完成：

- 解析 `site-content.json`，确认当前信号、观点、tags、relations 字段来源。
- 说明是否存在字段缺口。
- 说明哪些设计规格依赖后续数据补齐。
- 说明是否读取并遵守页面 / 文案 / Typography Harness。
- 明确阶段 2B 是否可以启动；如果可以，只能在用户确认本规格后启动。

## 10. 新窗口执行指令

```text
请执行任务：WSD-20260522-business-signals-page-redesign-spec

你是 Experience & Editorial + Product Commander 协作执行窗口。本任务是商业信号页面重设计规格任务，不是开发任务。

核心要求：
1. 基于新的卡片形式和字段特征重新设计商业信号页面。
2. 老的排版全部不要，不要在当前版面上修修补补。
3. 查看并调用项目设计规范，找到最适合观澜 AI 的方案。
4. 页面必须同时有案例 / 融资 / 产品服务等商业信号卡，也有已评级观点卡。
5. 必须有商业信号详情页。
6. 必须支持日期查看。
7. 必须支持关键词 tags 归类和检索。
8. 观点卡详情页必须按人 + title + 观点 + 时间线组织。
9. 必须建立卡片之间的关联关系。

只读取派发单指定的最小上下文和允许补读文件。

不要改代码。
不要改数据。
不要生成页面。
不要进入 Build。
不要推送或部署。
不要新增一级导航。
不要把前沿观点做成一级栏目。

完成后写 closeout：
agent-workflow/reports/WSD-20260522-business-signals-page-redesign-spec-closeout.md
```
