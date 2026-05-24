---
task_id: WSD-20260522-daily-observation-page-redesign-spec
title: 今日观察栏目页面重设计规格
date: 2026-05-22
status: ready
owner: Experience & Editorial / Product Commander
encoding: UTF-8
---

# WSD-20260522 Daily Observation Page Redesign Spec｜今日观察栏目页面重设计规格

## 1. 任务目标

本任务是今日观察栏目专项重设计规格任务，不是代码实现任务。

目标：基于新的卡片形式、字段特征、前沿观点评级结果和当前今日观察定位，重新设计今日观察栏目页、今日观察文章详情页、与案例 / 融资 / 产品服务等商业信号卡和观点卡的关系、日期查看、关键词 tags 归类 / 检索，以及卡片之间的关联关系。

今日观察栏目整体必须是 newsletter：读者进入页面后，应能一眼看清“一天要点”：今天主判断是什么、文章讲什么、有哪些案例 / 融资 / 产品服务信号、哪些观点值得参照、接下来要观察什么。

必须从新的信息架构和卡片字段出发。旧版 `daily.html` / `daily-detail.html` 的排版和模块组织不得作为改造底稿。可以读取旧页面和 `app.js` 了解当前数据来源与渲染字段，但不得在旧版面上修修补补。

## 2. 最小读取

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/01-product-map.md`
4. `context/02-vi-style.md`
5. `context/03-copy-style.md`
6. `context/06-execution-harness.md`
7. `agent-workflow/product/DESIGN.md`
8. `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
9. 本派发单：`agent-workflow/execution/WSD-20260522-daily-observation-page-redesign-spec.md`

## 3. 必须吸收的当前结论

必须读取并吸收：

- `agent-workflow/reports/WSD-20260522-site-page-module-layer1-diagnostic-closeout.md`
- `agent-workflow/reports/WSD-20260522-opinion-rating-governance-closeout.md`
- `agent-workflow/reports/WSD-20260522-opinion-rating-followbuilders-closeout.md`
- `agent-workflow/reports/WSD-20260522-write-20260520-20260521-daily-observation-closeout.md`
- `agent-workflow/reports/WSD-20260522-daily-observation-skill-consistency-closeout.md`

如存在以下 closeout，也必须读取：

- `agent-workflow/reports/WSD-20260522-card-frontend-field-confirmation-closeout.md`

如果卡片字段确认 closeout 不存在，不得阻塞本任务；执行窗口必须在本任务内先输出“今日观察专项字段确认表”，只覆盖今日观察栏目需要的文章字段、商业信号卡字段和观点卡字段。

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

- Newsletter / 每日内参简报型。
- 编辑精选 / 主编信型。
- 情报摘要 + 关系台账型。

最终方案必须让用户一眼看清一天要点，不得默认套用资讯流、日报工作台、卡片墙、后台 dashboard 或旧版 layout。

## 5. 只允许补读的代码 / 数据文件

只允许补读今日观察相关前台文件和数据：

- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/daily.html`
- `01-SiteV2/site/daily-detail.html`
- `01-SiteV2/site/index.html` 中今日观察相关模块
- `01-SiteV2/site/assets/styles.css` 中今日观察相关样式

按需补读：

- `agent-workflow/product/card-asset-copy-governance.md`
- `agent-workflow/product/tag-taxonomy.md`
- `skills/guanlan-daily-observation-pitch/SKILL.md`
- `skills/guanlan-daily-observation-writer/SKILL.md`
- `skills/guanlan-daily-observation-qc/SKILL.md`

不得读取 V1 / V2.0 历史页面方案、旧失败任务、旧页面截图、旧自动化方案或已删除文档。

## 6. 执行边界

允许：

- 重新定义今日观察栏目页的信息架构。
- 重新定义今日观察文章详情页模板。
- 输出案例 / 融资 / 产品服务等商业信号卡在今日观察中的展示规格。
- 输出已评级观点卡在今日观察中的展示规格。
- 输出文章详情、案例卡详情、观点卡详情之间的跳转关系。
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
- 恢复 V1 / V2.0 页面逻辑。
- 在旧 `daily.html` / `daily-detail.html` 版面上局部修补。

## 7. 必须解决的问题

### 7.1 Newsletter 形态

今日观察栏目整体必须像一份每日 newsletter，而不是资讯流或内部工作台。

栏目页首屏必须回答：

- 今天主判断是什么。
- 今天文章讲什么。
- 今天有哪些 3-5 条要点。
- 哪些案例 / 融资 / 产品服务卡支撑或校准这篇观察。
- 哪些观点卡值得参照。
- 接下来观察什么。

### 7.2 新卡片与字段

必须基于新字段和新卡片形式重新设计：

- 今日观察文章卡。
- 商业信号卡：产品服务 / 融资 / 案例 / 成熟变化短专题。
- 观点卡：仅展示 `opinionTier=feature|sidebar` 且 `displayLane=daily_feature|signal_sidebar` 的观点。
- 关系卡：文章与信号、观点、趋势、内参、日期、tags 的连接。

必须明确哪些字段进入：

- 今日观察栏目页首屏。
- 今日观察文章卡。
- 今日观察详情页主内容。
- 侧栏 / 关系区。
- 搜索与筛选。
- 隐藏但可用于关系计算。

不得把 `sourcePath`、Raw / Pool / gate / eligible / index_only / candidate / draft / 后台字段直出到前台。

### 7.3 页面结构

必须输出三类页面规格：

1. 今日观察栏目页。
2. 今日观察文章详情页。
3. 与今日观察关联的卡片详情跳转规格：
   - 案例 / 融资 / 产品服务卡跳转到商业信号详情页。
   - 观点卡跳转到观点卡详情页。

### 7.4 日期查看

必须支持：

- 按日期查看当天今日观察。
- 日期间切换。
- 日期下的文章状态、信号数量、观点数量、卡片类型分布。
- 日期为空、无文章、无达标卡片时的空状态。

### 7.5 关键词 tags 归类和检索

必须支持：

- tag 分类，例如行业、岗位 / 部门、流程、技术路线、公司 / 人物、商业变量、文章主题。
- 多 tag 组合筛选。
- 关键词搜索，至少覆盖文章标题、导语、要点、信号卡标题、观点卡人物 / title、tags、商业变量。
- 搜索结果状态：有结果、无结果、输入过短、筛选过窄。

Tags 不得作为一级栏目，不得做成标签墙主视觉。

### 7.6 关联关系

必须建立卡片之间的关联关系：

- 今日观察文章 -> 商业信号卡。
- 今日观察文章 -> 案例 / 融资 / 产品服务卡。
- 今日观察文章 -> 观点卡。
- 今日观察文章 -> 趋势观察 / 趋势报告。
- 今日观察文章 -> 商业内参。
- 观点卡 -> 校准了哪篇今日观察、哪些信号。
- 日期 -> 当天文章与卡片组合。
- tags -> 同类文章 / 信号 / 观点聚合。

必须输出关系模型表：

| 关系 | 起点 | 终点 | 前台展示方式 | 数据字段来源 | 不得展示 |
|---|---|---|---|---|---|

## 8. 输出要求

closeout 必须写入：

```text
agent-workflow/reports/WSD-20260522-daily-observation-page-redesign-spec-closeout.md
```

必须包含以下章节。

### 8.1 设计方案选择说明

至少比较 2-3 个可用方案，并选择最终方案。

### 8.2 今日观察栏目页信息架构

输出栏目页完整结构表：

| 顺序 | 区块 | 用户任务 | 内容 | 数据来源 | 处理 |
|---|---|---|---|---|---|

### 8.3 Newsletter 一日要点模块规格

必须输出：

| 模块 | 内容 | 字段来源 | 视觉权重 | 备注 |
|---|---|---|---|---|

至少包含：

- 今日主判断。
- 今日文章。
- 3-5 条要点。
- 当天案例 / 融资 / 产品服务卡。
- 当天观点卡。
- 后续观察。

### 8.4 卡片类型与字段表

至少包含：

- 今日观察文章卡。
- 产品服务卡。
- 融资卡。
- 案例卡。
- 变化短专题卡。
- 观点参照卡。
- 关系卡。

字段表：

| 卡片类型 | 栏目页字段 | 详情页字段 | 侧栏字段 | 禁止字段 |
|---|---|---|---|---|

### 8.5 今日观察文章详情页模板

必须输出：

| 顺序 | 模块 | 内容 | 字段来源 | 备注 |
|---|---|---|---|---|

详情页必须有：

- 标题。
- 日期 / 阅读时长 / 当日判断标签。
- 导语。
- 核心判断。
- 正文。
- 关联案例 / 融资 / 产品服务卡。
- 观点参照。
- 反证与边界。
- 后续观察。
- 相关日期 / 前后判断变化。

### 8.6 关联卡详情跳转规格

必须输出：

| 卡片类型 | 从哪里出现 | 跳转目标 | 目标详情页结构 | 备注 |
|---|---|---|---|---|

其中：

- 案例 / 融资 / 产品服务卡跳转到商业信号详情页。
- 观点卡跳转到观点卡详情页。
- 观点卡详情页按“人 + title + 观点 + 时间线”组织，可引用商业信号页面重设计任务的观点详情规格。

### 8.7 日期查看和 tags 检索规格

输出：

| 功能 | 输入 | 输出 | 空状态 | 交互说明 |
|---|---|---|---|---|

### 8.8 关系模型与关联展示

输出文章、信号卡、观点卡、日期、tags、趋势、内参之间的关系模型、关系展示位置和关系交互。

### 8.9 Copy-first 文案表

必须包含：

- 栏目页 H1。
- 栏目说明。
- Newsletter 主判断标题。
- 日期切换文案。
- tags / 搜索文案。
- 卡片字段标签。
- 空状态。
- 文章详情页模块标题。
- 观点 / 信号关联模块标题。

### 8.10 Typography 页面位置表

必须按 `page-typography-position-guidelines.md` 输出今日观察栏目页、今日观察文章详情页、关联卡片区的字号 / 行高 / 字重 / 字体族。

### 8.11 桌面端验收清单

必须输出给后续 Build & Release 使用的验收清单。

## 9. 验证要求

本任务不改代码，因此不运行构建和截图。

必须完成：

- 解析 `site-content.json`，确认当前今日观察、信号、观点、tags、relations 字段来源。
- 说明是否存在字段缺口。
- 说明哪些设计规格依赖后续数据补齐。
- 说明是否读取并遵守页面 / 文案 / Typography Harness。
- 明确阶段 2B 是否可以启动；如果可以，只能在用户确认本规格后启动。

## 10. 新窗口执行指令

```text
请执行任务：WSD-20260522-daily-observation-page-redesign-spec

你是 Experience & Editorial + Product Commander 协作执行窗口。本任务是今日观察栏目页面重设计规格任务，不是开发任务。

核心要求：
1. 基于新的卡片形式和字段特征重新设计今日观察栏目页面。
2. 老的排版全部不要，不要在当前版面上修修补补。
3. 查看并调用项目设计规范，找到最适合观澜 AI 的方案。
4. 页面必须有当天观察文章，以及案例 / 融资 / 产品服务等商业信号卡，也有已评级观点卡。
5. 文章必须有详情页面；案例卡片 / 观点卡跳转到自己的详情页。
6. 必须支持日期查看。
7. 必须支持关键词 tags 归类和检索。
8. 必须建立卡片之间的关联关系。
9. 今日观察栏目整体上是 newsletter，方便一眼就看清一天要点。

只读取派发单指定的最小上下文和允许补读文件。

不要改代码。
不要改数据。
不要生成页面。
不要进入 Build。
不要推送或部署。
不要新增一级导航。
不要把前沿观点做成一级栏目。

完成后写 closeout：
agent-workflow/reports/WSD-20260522-daily-observation-page-redesign-spec-closeout.md
```
