---
task_id: WSD-20260522-business-signals-page-redesign-spec
title: 商业信号页面重设计规格 closeout
date: 2026-05-22
status: completed
owner: Codex / Experience & Editorial / Product Commander
encoding: UTF-8
revision: 2026-05-22-user-frontstage-fact-display
---

# WSD-20260522 商业信号页面重设计规格 closeout

## 0. 执行结论

本任务属于 `页面 / 文案 / Typography Harness`，只产出规格，不改代码、不改数据、不生成页面、不进入 Build。

本版按用户最新确认修订：商业信号前台只展示事实、来源、分类和关联，不展示指导式字段；栏目首页不设页头模块，不放栏目 H1 和栏目说明；卡片和详情模板不使用任何指导、警示或推演类字段。

阶段 2B 可以在用户确认本规格后启动。后续 Build & Release 只能按本 closeout 的信息架构、字段表、文案表、Typography 页面位置表和桌面端验收清单实现；不得回到旧版 `signals.html` / `signal-detail.html` 做局部修补。

核心方向：

- 商业信号栏目首页采用“日期工具条 + 筛选检索 + 事实台账 + 观点参照”的结构。
- 栏目首页首屏直接进入内容，不做解释型 hero，不放 H1，不写栏目说明。
- 商业信号卡片只展示事实字段：类型、日期、主体、动作、事实摘要、来源、tags。
- 商业信号详情页把卡片事实展开成可阅读的事实档案：事件、主体、动作、商业变量、来源、相关材料。
- 观点卡详情页按人 / 机构、title、原文摘录、时间线、观澜解读、关联信号组织，但不展示限制类、警示类或指导式模块。
- 前沿观点不成为一级栏目；Tags 只作为筛选、检索和聚合能力。

## 1. 读取与约束

已读取：

| 文件 | 结论 |
|---|---|
| `context/00-current-state.md` | V2.1 生产开发；桌面端优先；页面任务必须 Typography-first 和 Copy-first |
| `context/01-product-map.md` | 前沿观点、Tags、机会判断不作为一级导航；商业信号承接信号流和成熟变化短专题 |
| `context/02-vi-style.md` | 页面采用暖白、深澜蓝、香槟金少量点睛；不做蓝紫科技感和普通 SaaS 模板 |
| `context/03-copy-style.md` | 文案克制、清楚、有判断，不暴露内部生产语言 |
| `context/06-execution-harness.md` | 本任务适用页面 / 文案 / Typography Harness；用户当前指令覆盖其中涉及前台限制类字段的展示要求 |
| `agent-workflow/product/DESIGN.md` | 页面要像商业情报产品，不像资讯流、工具站或 SaaS dashboard |
| `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md` | 详情页 H1 `40px / 56px`，卡片标题默认 `18-20px`；栏目首页本版不使用 H1 |
| `docs/brand/wavesight-ai-vi/brand-tokens.css` | 使用 `--gl-*` 色彩、字体、圆角和字号 token |
| `docs/brand/wavesight-ai-vi/USAGE.md` | 页面必须引用正式 Logo / token / Typography 规范 |
| `docs/brand/wavesight-ai-vi/visual-identity-guidelines.md` | 视觉保持极简澜线型、暖白纸面、深澜蓝和少量香槟金 |
| `docs/brand/wavesight-ai-vi/typography-guidelines.md` | 中文标题衬线，正文黑体，英文标签 Inter，数字 Mono |
| `skills/guanlan-copy-style/SKILL.md` | 文案表按观澜基础文案规范生成 |
| `design-taste-frontend` | 仅作为抗模板化参考；所有冲突均以观澜 VI 和 DESIGN 为准 |

必须吸收的 closeout 状态：

| 指定文件 | 状态 | 处理 |
|---|---|---|
| `agent-workflow/reports/WSD-20260522-site-page-module-layer1-diagnostic-closeout.md` | 不存在 | 读取了同名 execution 派发单，只记录缺口，不继承不存在结论 |
| `agent-workflow/reports/WSD-20260522-opinion-rating-governance-closeout.md` | 不存在 | 记录缺口；以 follow-builders closeout 和当前数据为准 |
| `agent-workflow/reports/WSD-20260522-opinion-rating-followbuilders-closeout.md` | 已读取 | 522 观点卡前台数据为 `feature: 1`、`sidebar: 11`、合计 12 条唯一展示项；`archive` / `discard` 不得前台露出 |
| `agent-workflow/reports/WSD-20260522-card-frontend-field-confirmation-closeout.md` | 不存在 | 按派发单要求，在本任务内输出“商业信号专项字段确认表” |

## 2. 当前数据解析

已解析 `01-SiteV2/site/data/site-content.json`。

| 数据对象 | 当前数量 / 字段 |
|---|---|
| `contentIndex.dates` | 6 个日期对象，含 `date / label / title / dek / signalCount / pointCount / trendCount / hasTrendReport` |
| `contentIndex.signals` | 21 条信号，含 `id / date / signalType / title / event / judgment / businessMeaning / frontend / tags / relations / relationFields / sourcePath / sourceUrl` |
| `signals` | 7 条页面主信号 |
| `contentIndex.points` | 35 条观点，含 `opinionTier / displayLane / publishStatus / ratingScore / selectionReason / speakerLine / originalView / interpretation / usage` |
| `contentIndex.cases` | 0 条，当前案例关系无法直接展示为独立案例卡 |
| `contentIndex.trends` | 4 条趋势候选 |
| `contentIndex.trendReports` | 1 条趋势报告 |
| `tagTaxonomy` | 61 个标签，分组为 `track / function / scenario / customer / evidence / stage / region / source / opinion` |

字段缺口：

- `relations` 当前多数为空，无法支撑强关系图谱，只能先以 `tags / date / signalType / source / structuredRefs / relationFields` 做弱关联。
- `contentIndex.cases` 当前为空，案例卡规格保留，但 Build 阶段应出现自然空状态或等待后续资产补齐。
- 当前没有独立观点详情页数据对象，但 `contentIndex.points` 已有 `speakerLine / title / originalView / interpretation / usage / sourceUrl / rating fields`，足够定义观点详情模板。
- 当前前台代码已有日期切换和单 tag 筛选，本规格要求升级为多 tag 组合筛选和关键词搜索。

## 3. 设计方案选择说明

| 方案 | 适合点 | 不适合点 | 是否采用 |
|---|---|---|---|
| 情报台账型 | 适合日更事实、日期检索、类型筛选、来源扫描；能让用户快速看到发生了什么 | 如果做成后台表格，会失去前台阅读气质 | 采用为主结构 |
| 信号关系图谱型 | 适合表达信号、观点、案例、趋势、内参之间的连接 | 当前显式关系数据不足，强行做大图谱会变成空壳 | 采用为辅助关系区 |
| 商业内参式阅读型 | 适合详情页，把事实字段转成可读档案 | 不适合列表页高频检索，会拖慢扫描效率 | 采用为详情页结构 |

最终方案：`事实台账型列表 + 档案式详情 + 轻关系辅助`。

原因：商业信号不是新闻流、Bento 卡片墙或 SaaS dashboard。用户任务是快速看到外部 AI 商业变化的事实，再进入详情页核对来源、主体、动作、商业变量和相关材料。因此列表页保持台账扫描能力，详情页保持档案阅读能力，关系区只做辅助。

## 4. 商业信号页面信息架构

栏目首页不设页头模块，不输出栏目 H1，不输出栏目说明。页面从日期、筛选和内容开始。

| 顺序 | 区块 | 用户任务 | 内容 | 数据来源 | 处理 |
|---|---|---|---|---|---|
| 1 | 日期与统计工具条 | 切换日期，看到当天规模 | 日期 tabs / dropdown、信号数量、观点数量、类型分布 | `contentIndex.dates`、当天 signals / points | 顶部工具条，不做 hero |
| 2 | 筛选与检索 | 找某类信号 | 多 tag 组合、关键词输入、结果数量、清除筛选 | `tagTaxonomy`、signals.tags、points.tags | Tags 是工具，不做标签墙主视觉 |
| 3 | 今日精选事实 | 快速读当天最重要的几条事实 | 3-5 条精选商业信号，含类型、日期、主体、动作、事实摘要、来源、tags | `contentIndex.signals`、`frontend` | 主卡 + 列表，不放指导式字段 |
| 4 | 观点参照 | 看相关人物或机构说了什么 | 仅展示 `feature / sidebar` 且 `daily_feature / signal_sidebar` 的观点 | `contentIndex.points` | 观点作为参照，不替代事实来源 |
| 5 | 信号台账 | 扫描全量结果 | 按筛选结果列出信号行卡：类型、日期、主体、动作、来源、tags | `contentIndex.signals` | 适度密集，避免卡片墙 |
| 6 | 关系入口 | 发现上下文 | 相关观点、案例、趋势、今日观察、内参入口 | `relations`、`relationFields`、tags、date | 数据不足时保持空态，不补解释 |
| 7 | 空状态 | 明确为什么为空 | 无结果、无达标卡片、输入过短、筛选过窄 | 筛选状态 | 不写情绪化占位文案 |

## 5. 商业信号专项字段确认表

由于 `WSD-20260522-card-frontend-field-confirmation-closeout.md` 不存在，本任务内先确认商业信号页面需要的字段。

| 字段路径 | 前台用途 | 显示位置 | 处理 | 禁止事项 |
|---|---|---|---|---|
| `id` | 稳定编号 | 列表元信息、详情页标签 | 可显示为 `SIG 01` 或短编号 | 不显示原始长路径 |
| `date` | 日期筛选和元信息 | 列表、详情、日期视图 | 显示为 `2026.05.22` | 不暴露生成时间 |
| `signalType` | 卡片类型 | 列表、筛选、详情 quick facts | 转译为 产品服务 / 融资 / 案例 / 变化短专题 | 不显示英文 raw enum |
| `frontend.displayTitle` | 标题 | 列表主卡、详情 H1 | 优先使用 | 不 fallback 到 Raw 摘要 |
| `frontend.eventLine / event` | 事实摘要 | 列表摘要、详情正文 | 优先 frontend，缺失时用 `event` | 不改写证据原文 |
| `frontend.businessMeaning / businessMeaning` | 商业变量说明 | 详情正文；列表可短句显示 | 落到客户、流程、预算、组织、风险或竞争之一 | 不用空话 |
| `frontend.sourceLinks` | 来源与事实 | 详情来源区、列表来源摘要 | 显示域名、来源等级、事实摘要、链接 | 不显示 `sourcePath` |
| `tags[].name / group` | 筛选与关系 | 筛选、卡片标签、关系聚合 | 按行业、岗位 / 部门、流程、技术路线、公司、商业变量分组 | 不做一级栏目 |
| `relations / relationFields` | 关系计算 | 关系区 | 仅内部计算，前台转成对象关系 | 不直出字段名 |
| `sourceUrl` | 主来源链接 | 详情页来源区 | 可显示域名和链接 | 不在列表中塞满链接 |
| `sourcePath` | 内部资产路径 | 不显示 | 仅内部追溯 | 禁止前台展示 |
| `opinionTier / displayLane / publishStatus` | 观点放行判断 | 不显示 | 仅用于过滤 | 禁止前台展示 |
| `ratingScore / selectionReason` | 观点评级依据 | 不显示 | 内部治理字段 | 禁止前台展示 |
## 6. 卡片类型与字段表

所有卡片都只展示事实字段、来源字段、分类字段和对象关系字段，不展示指导、警示或推演类字段。

| 卡片类型 | 列表页字段 | 详情页字段 | 侧栏字段 | 禁止字段 |
|---|---|---|---|---|
| 产品服务卡 | 类型、日期、公司 / 产品、动作、事实摘要、来源、tags | 产品 / 服务动作、主体、发生时间、商业变量、来源与事实、相关观点 | 同类产品服务、相关趋势、今日观察入口 | `sourcePath`、Raw / Pool、gate、candidate、draft |
| 融资卡 | 类型、日期、公司、融资金额、产品方向、来源、tags | 融资事实、资金用途、产品方向、商业变量、来源与事实 | 同类融资、相关观点、趋势报告 | 未证实估值、内部路径、弱来源包装 |
| 案例卡 | 客户 / 场景、AI 角色、流程变化、商业变量、来源 | 行业 / 部门、使用者、任务变化、公开效果描述、来源 | 同类场景、相关信号、趋势候选 | 客户内部 ROI 推断、未公开采购动机 |
| 变化短专题卡 | 变化标题、支撑信号数、涉及对象、来源摘要 | 变化描述、支撑信号、前后对比、商业变量、来源 | 趋势报告、内参、今日观察 | 单条弱事实硬升级趋势 |
| 观点参照卡 | speaker / 机构、中文化 title、短摘录、sourceUrl、tags | 人 / 机构、title、原文摘录、时间线、观澜解读、关联信号 | 关联信号、同一人物观点 | `opinionTier`、`displayLane`、`ratingScore`、`selectionReason`、长英文直塞列表 |
| 关系卡 | 关系类型、关联对象标题、日期、类型 | 关系对象列表、来源字段转义后的对象关系 | 相关信号 / 观点 / 趋势 / 内参 | `relations` 原始 token、内部编号堆叠 |

## 7. 商业信号详情页模板

| 顺序 | 模块 | 内容 | 字段来源 | 备注 |
|---|---|---|---|---|
| 1 | 顶部标签 | 商业信号、类型、日期、编号 | `signalType / date / id` | 类型需中文化 |
| 2 | H1 | 事件 + 商业变量标题 | `frontend.displayTitle` | 详情页 H1，不超过 `40px / 56px` |
| 3 | 事实摘要 | 发生了什么 | `frontend.eventLine / event` | 只讲事实动作 |
| 4 | 快速事实 | 类型、日期、主体、来源 | `signalType / date / title / sourceLinks` | 4 项以内 |
| 5 | 事件经过 | 主体、动作、场景、时间 | `frontend.eventLine / event / title` | 先事实，后解释 |
| 6 | 商业变量 | 影响客户、流程、预算、组织、责任、风险或竞争中的哪一项 | `frontend.businessMeaning / businessMeaning / tags` | 不写行动建议 |
| 7 | 来源与事实 | 来源卡、事实摘录、链接 | `frontend.sourceLinks / sourceUrl` | 不展示 `sourcePath` |
| 8 | 相关案例 / 融资 / 产品服务 | 与本信号同类或支撑关系 | `relations / tags / signalType` | 数据缺失时显示空状态 |
| 9 | 观点参照 | feature / sidebar 观点 | `contentIndex.points` + relation / tags | 观点不替代事实来源 |
| 10 | 相关趋势 / 今日观察 / 内参 | 下游内容入口 | `trendReports / daily / brief / tags / date` | 只展示已发布内容 |

## 8. 观点卡详情页模板

观点卡详情页必须按“人 / 机构 + title + 观点 + 时间线”组织，不作为一级栏目。

| 顺序 | 模块 | 内容 | 字段来源 | 备注 |
|---|---|---|---|---|
| 1 | 人 / 机构 | speaker、机构或来源账号 | `speakerLine`、source domain | 若只有账号，显示为“来源账号” |
| 2 | Title | 中文化观点标题 | `title` | 必须是中文判断式，不出现半截英文 |
| 3 | 原文或摘录 | 短观点直接展示；长英文显示短摘录 + 原文链接 | `originalView / sourceUrl` | 长英文不得铺满列表 |
| 4 | 时间线 | 原始发布时间、收录日期、关联日期 | `originalDate / date` | 用 Mono 日期 |
| 5 | 观澜解读 | 这条观点如何帮助理解相关信号 | `interpretation / usage` | 明确是观点参照 |
| 6 | 关联信号 | 相关商业信号 | `relatedSignals / relations / tags` | 关系为空时展示空态，不补解释 |
| 7 | 原文入口 | 查看原文 | `sourceUrl` | 外链清晰，不伪装成事实来源 |

展示规则：

- `feature / daily_feature / frontstage_feature` 可作为主观点详情。
- `sidebar / signal_sidebar / frontstage_sidebar` 可作为侧栏观点详情。
- `archive / discard` 不进入前台，不被搜索 fallback 带出。
- `ratingScore / selectionReason / opinionTier / displayLane / publishStatus` 只作为内部过滤，不显示。

## 9. 日期查看和 tags 检索规格

| 功能 | 输入 | 输出 | 空状态 | 交互说明 |
|---|---|---|---|---|
| 按日期查看 | 日期 tab / 下拉 | 当天信号、观点、类型分布、日期摘要 | `这一天没有可展示的商业信号。` | 默认选 `contentIndex.activeDate` 或最新日期 |
| 日期间切换 | 前后日期、日期列表 | 刷新列表、观点、关系入口 | `该日期暂无内容。` | URL 保留 `date` 参数 |
| 日期统计 | 日期对象 + 当天卡片 | 信号数量、观点数量、类型分布 | 数量为 0 时显示自然语言说明 | 不做后台仪表盘 |
| tag 分类 | 标签组 | 行业、岗位 / 部门、流程、技术路线、公司、商业变量 | `当前标签下没有信号。` | Tag 文案来自 `tagTaxonomy.name` |
| 多 tag 组合筛选 | 多个 tag id | 结果列表 | `当前组合没有结果。` | UI 用可移除 chips，不做标签墙 |
| 关键词搜索 | 标题、事件线、公司 / 人物、tags、商业变量 | 命中结果和命中类型提示 | `没有找到匹配信号。` | 少于 2 个中文字符或 3 个英文字符显示输入过短 |
| 清除筛选 | 清除按钮 | 回到当前日期默认信号 | 无 | 保留日期，清空 tag / keyword |

## 10. 关系模型与关联展示

| 关系 | 起点 | 终点 | 前台展示方式 | 数据字段来源 | 不得展示 |
|---|---|---|---|---|---|
| 信号 -> 观点卡 | 商业信号 | feature / sidebar 观点 | 详情侧栏“观点参照”；列表页最多 3 条 | `relations / relatedSignals / tags / date` | `opinionTier / displayLane / ratingScore` |
| 信号 -> 案例卡 | 商业信号 | 案例 | 详情“相关案例”；列表只显示数量或第一条 | `relations / contentIndex.cases / tags` | 空数组伪装成案例 |
| 信号 -> 融资 / 产品服务卡 | 商业信号 | 同类信号 | 详情“同类信号”；列表 tag 聚合 | `signalType / tags / date` | 原始 enum |
| 信号 -> 趋势观察 / 趋势报告 | 商业信号 | 趋势候选 / 报告 | 详情底部“相关趋势” | `contentIndex.trends / trendReports / tags / relations` | candidate / draft 状态 |
| 信号 -> 今日观察 | 商业信号 | 今日观察 | 日期页和详情关联入口 | `date / daily.points / daily.calibration` | 内部同步语言 |
| 信号 -> 商业内参 | 商业信号 | 内参 | 详情底部“相关内参” | `brief.evidence / tags / relations` | 会员内部字段 |
| 观点卡 -> 信号 | 观点 | 商业信号 | 观点详情“相关信号” | `relatedSignals / relations / tags` | 将观点当事实证据 |
| 日期 -> 信号组合 | 日期 | 当天信号 / 观点 / 趋势 | 日期工具条和类型分布 | `contentIndex.dates` | 后台批次语言 |
| tags -> 同类信号聚合 | tag | 信号 / 观点 / 趋势 | 筛选结果、同类入口 | `tagTaxonomy / tags` | Tags 作为一级栏目 |

关系展示原则：

- 显式关系优先：`relations / relatedSignals / relatedTrendReports`。
- 只有 tags / date 命中时，前台文案用“同类内容”或“相关内容”。
- 无关系时不补解释，显示简短空态。

## 11. Copy-first 文案表

栏目首页不使用栏目 H1 和栏目说明。

| 位置 | 文案 |
|---|---|
| 日期工具条标题 | 日期 |
| 日期统计：信号 | 信号 |
| 日期统计：观点 | 观点 |
| 日期统计：类型 | 类型 |
| 筛选区标题 | 筛选 |
| 日期切换文案 | 切换日期 |
| tags 文案 | 标签 |
| 搜索 placeholder | 搜公司、人物、流程或商业变量 |
| 搜索输入过短 | 请输入更具体的关键词。 |
| 无搜索结果 | 没有找到匹配信号。 |
| 筛选无结果 | 当前组合没有结果。 |
| 当日无内容 | 这一天没有可展示的商业信号。 |
| 卡片字段标签：类型 | 类型 |
| 卡片字段标签：日期 | 日期 |
| 卡片字段标签：主体 | 主体 |
| 卡片字段标签：动作 | 动作 |
| 卡片字段标签：来源 | 来源 |
| 卡片字段标签：标签 | 标签 |
| 详情页模块：事实 | 发生了什么 |
| 详情页模块：商业变量 | 商业变量 |
| 详情页模块：来源 | 来源与事实 |
| 详情页模块：相关内容 | 相关内容 |
| 观点详情模块：原文 | 观点原文 |
| 观点详情模块：时间线 | 观点时间线 |
| 观点详情模块：解读 | 观澜解读 |
| 观点详情模块：相关信号 | 相关信号 |
| 观点详情空关系 | 暂无相关信号。 |
| 列表 CTA | 查看信号 |
| 详情外链 CTA | 查看原文 |

禁用表达：

- 不使用 `Raw / Pool / gate / 入库 / 同步 / 字段 / eligible / index_only / candidate / draft`。
- 不使用 `赋能 / 重塑 / 生态 / 闭环 / 风口红利 / 立即行动`。
- 不使用任何前台指导式模块名。
- 不把观点写成事实，不把单条信号写成趋势。

## 12. Typography 页面位置表

### 12.1 商业信号栏目首页

| 位置 | 字号 / 行高 | 字重 | 字体族 | 备注 |
|---|---:|---:|---|---|
| 导航 | `14px / 20px` | 500 / 当前项 600 | `--gl-font-sans-cn` | 不加大当前导航 |
| 顶部工具条标签 | `12px / 18px` | 600 | `--gl-font-en` / `--gl-font-mono` | 页面首屏从工具条开始 |
| 日期统计数字 | `20px / 30px` | 600 | `--gl-font-mono` | 数字克制，不做大屏指标 |
| 日期 / 筛选文字 | `13px / 20px` | 500 | `--gl-font-sans-cn` | 不抢内容 |
| 筛选按钮 / chips | `13px / 20px` | 600 | `--gl-font-sans-cn` | 高度 34-38px |
| 分组标题 | `24px / 34px` | 600 | `--gl-font-serif-cn` 或 `--gl-font-sans-cn` | 台账区标题 |
| 今日精选主卡标题 | `22px / 32px` | 600 | `--gl-font-serif-cn` | 不超过卡片上限 |
| 普通信号卡标题 | `18px / 28px` | 600 | `--gl-font-sans-cn` | 默认列表 |
| 卡片摘要 | `14px / 24px` | 400 | `--gl-font-sans-cn` | 3-4 行内 |
| 标签 / 日期 / 数字 | `12px / 18px` | 500 / 600 | `--gl-font-mono` 或 `--gl-font-en` | 数字用 mono |
| 空状态 | `14px / 24px` | 400 | `--gl-font-sans-cn` | 克制说明 |

栏目首页明确不使用：

- 栏目 Eyebrow。
- 栏目 H1。
- 栏目说明。
- Hero 型页头。

### 12.2 商业信号详情页

| 位置 | 字号 / 行高 | 字重 | 字体族 | 备注 |
|---|---:|---:|---|---|
| 详情页标签 | `12px / 18px` | 600 | `--gl-font-en` / `--gl-font-mono` | H1 上方 |
| 详情页 H1 | `40px / 56px` | 600 | `--gl-font-serif-cn` | 最大宽度 860px |
| 事实摘要 | `18px / 32px` | 400 | `--gl-font-sans-cn` | H1 下方 |
| 元信息 | `12px / 18px` | 500 | `--gl-font-mono` | 日期、编号、来源 |
| 正文 | `16px / 30px` | 400 | `--gl-font-sans-cn` | 阅读宽度 760-860px |
| 正文 H2 | `26px / 38px` | 600 | `--gl-font-serif-cn` 或 `--gl-font-sans-cn` | 主段落 |
| 正文 H3 | `20px / 30px` | 600 | `--gl-font-sans-cn` | 小节 |
| 侧栏分组标签 | `11px / 16px` | 600 | `--gl-font-en` | 只做辅助 |
| 侧栏标题 | `16px / 24px` | 600 | `--gl-font-sans-cn` | 不能大过正文 H2 |
| 侧栏摘要 | `13px / 22px` | 400 | `--gl-font-sans-cn` | 辅助阅读 |

### 12.3 观点卡详情页

| 位置 | 字号 / 行高 | 字重 | 字体族 | 备注 |
|---|---:|---:|---|---|
| 人 / 机构标签 | `12px / 18px` | 600 | `--gl-font-en` / `--gl-font-mono` | 来源身份 |
| 观点详情 H1 | `40px / 56px` | 600 | `--gl-font-serif-cn` | 中文化 title |
| 原文摘录 | `20px / 34px` | 500 | `--gl-font-serif-cn` | 短摘录；长英文折叠或转链接 |
| 时间线 | `12px / 18px` | 500 | `--gl-font-mono` | 日期清楚 |
| 观澜解读正文 | `16px / 30px` | 400 | `--gl-font-sans-cn` | 不把观点当事实 |
| 关系卡标题 | `17px / 26px` | 600 | `--gl-font-sans-cn` | 侧栏 / 底部 |

禁止新增：

- 栏目首页 hero 标题。
- 详情页 H1 大于 `40px / 56px`。
- 卡片标题大于 `24px / 34px`。
- 不受控 `vw` 字号、过大 `clamp()`、`760 / 780` 等过重字重。
- 负字距。

## 13. 桌面端验收清单

后续 Build & Release 必须逐项验收：

| 项目 | 验收标准 |
|---|---|
| 页面定位 | 看起来是商业情报产品，不像资讯站、工具导航、SaaS dashboard 或 Bento 卡片墙 |
| 导航 | 不新增一级导航；前沿观点和 Tags 不成为一级栏目 |
| 栏目首页首屏 | 不出现页头模块、栏目 H1、栏目说明；直接进入日期、筛选和内容 |
| VI | 背景为 `--gl-bg-page`，卡片为暖白纸面，深澜蓝和香槟金克制使用 |
| Logo | 只引用正式 SVG，不重绘、不改品牌 token |
| 列表页阅读路径 | 日期 / 筛选 -> 今日精选事实 -> 观点参照 -> 台账 -> 关系入口清楚 |
| 详情页阅读路径 | 标题 -> 事实摘要 -> 事件经过 -> 商业变量 -> 来源 -> 相关内容 |
| 观点详情 | 按人 / 机构、title、观点原文、时间线、观澜解读、关联信号组织 |
| 筛选 | 日期、tags、关键词有结果、无结果、输入过短、筛选无结果四类状态 |
| 关系区 | 有显式关系展示关系；无关系不补解释 |
| 文案 | 不出现内部生产语言，不喊趋势，不把观点写成事实 |
| 前台字段 | 只展示事实、来源、分类和对象关系；不展示指导式字段 |
| Typography | 严格按本表实现，无表外字号和表外字重 |
| 桌面截图 | 1440px 宽截图，检查首屏重心、卡片密度、文字断行、筛选控件和详情页主次 |
| 移动基础 | 虽不作为硬阻塞，也不能横向溢出或遮挡 |
| 数据缺口 | `cases` 为空、`relations` 为空时有自然空状态 |

## 14. 验证结果

已完成：

- 解析 `site-content.json`，确认当前信号、观点、tags、relations 字段来源。
- 读取当前 `signals.html`、`signal-detail.html` 和 `app.js` 中商业信号相关渲染逻辑。
- 确认当前列表页由 `<main data-signal-system>` 挂载，详情页由 `<main data-front-signal-detail>` 挂载。
- 按用户最新指令移除栏目首页页头、栏目 H1、栏目说明，以及所有前台指导式字段。

不运行：

- 未运行构建。
- 未启动本地站点。
- 未截图。
- 未做浏览器验收。

原因：本任务明确不是代码实现任务。

## 15. 下游启动条件

阶段 2B 可在用户确认后启动，且只能使用以下输入：

- 本 closeout 的信息架构。
- 本 closeout 的字段确认表。
- 本 closeout 的文案表。
- 本 closeout 的 Typography 页面位置表。
- 当前 `site-content.json` 的已确认字段。
- 522 follow-builders closeout 中已放行的前台观点范围。

阶段 2B 不得：

- 新增一级导航。
- 把前沿观点做成一级栏目。
- 修改 Logo、SVG 生成脚本或品牌 token。
- 回到旧 `signals.html` / `signal-detail.html` 版面上修补。
- 把 `sourcePath`、Raw / Pool / gate / eligible / index_only / candidate / draft 等内部字段直出到前台。
- 用空 `relations` 强行画成关系图谱。

## 16. 本次文件变化

新增 / 修改：

- `agent-workflow/reports/WSD-20260522-business-signals-page-redesign-spec-closeout.md`

未修改：

- 未修改站点代码。
- 未修改 `site-content.json`。
- 未修改内容库或知识库资产。
- 未删除无效文件。
