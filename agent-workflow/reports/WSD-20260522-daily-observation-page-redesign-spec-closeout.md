---
task_id: WSD-20260522-daily-observation-page-redesign-spec
date: 2026-05-22
status: completed
owner: Experience & Editorial / Product Commander
scope: daily-observation-page-redesign-spec
harness: page-copy-typography
encoding: UTF-8
---

# WSD-20260522 今日观察栏目页面重设计规格 Closeout

## 0. 执行范围与结论

本任务属于 `页面 / 文案 / Typography Harness`，本次只产出规格，不改代码、不改 `site-content.json`、不生成页面、不进入 Build & Release。

结论：

- 今日观察栏目应采用“按日期组织的每日长文首页”方案，不采用资讯流、后台工作台、卡片墙或旧版 `daily.html` / `daily-detail.html` 局部修补。
- 栏目页首屏必须把当天今日观察文章放在中心位置，标题、导语、更多原文露出和“阅读原文”入口直接服务长文阅读；不再放概要列表，也不设置首屏右侧索引区。
- 文章详情页必须从“报告阅读路径”组织，不把字段直接摊开。
- 案例 / 融资 / 产品服务等商业信号卡统一命名为“商业信号”，跳转到商业信号详情页；观点卡统一命名为“前沿观点”，跳转到观点卡详情页，但不新增“前沿观点”一级导航。
- 当前数据已具备 `daily`、`contentIndex.dates`、`signals`、`contentIndex.points`、`tagTaxonomy` 基础字段；待补齐项主要在结构化关系、观点详情页目标、产品服务 / 变化短专题类型和历史 daily 正文结构。
- 阶段 2B 可以在用户确认本规格后启动；启动时只能按本文规格进入 Build & Release。

## 1. 读取与遵守情况

已读取：

- `AGENTS.md`
- `context/00-current-state.md`
- `context/01-product-map.md`
- `context/02-vi-style.md`
- `context/03-copy-style.md`
- `context/06-execution-harness.md`
- `agent-workflow/product/DESIGN.md`
- `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
- `docs/brand/wavesight-ai-vi/brand-tokens.css`
- `docs/brand/wavesight-ai-vi/USAGE.md`
- `docs/brand/wavesight-ai-vi/visual-identity-guidelines.md`
- `docs/brand/wavesight-ai-vi/typography-guidelines.md`
- `skills/guanlan-copy-style/SKILL.md`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/daily.html`
- `01-SiteV2/site/daily-detail.html`
- `agent-workflow/reports/WSD-20260522-opinion-rating-followbuilders-closeout.md`

派发单点名但当前未找到：

- `agent-workflow/reports/WSD-20260522-site-page-module-layer1-diagnostic-closeout.md`
- `agent-workflow/reports/WSD-20260522-opinion-rating-governance-closeout.md`
- `agent-workflow/reports/WSD-20260522-write-20260520-20260521-daily-observation-closeout.md`
- `agent-workflow/reports/WSD-20260522-card-frontend-field-confirmation-closeout.md`

处理方式：不阻塞本任务，按派发单要求在第 4 节补出“今日观察专项字段确认表”。缺失 closeout 的结论不得被当作已验收依据。

## 2. 当前数据解析结论

解析 `01-SiteV2/site/data/site-content.json` 后确认：

| 数据区 | 当前字段 | 可用于今日观察 | 待补齐项 |
|---|---|---|---|
| `daily` | `id`、`slug`、`title`、`contentType`、`judgment`、`dek`、`summary`、`sections`、`homeTitle`、`homeSummary`、`homeCards`、`columnPage`、`points`、`calibration`、`link` | 当前活跃日期的文章标题、导语、正文、首页卡和相关观点素材 | 不是多日数组；历史日期的完整文章正文不在同一结构中；`judgment` 是现有数据字段名，前台按文章摘要处理 |
| `contentIndex.dates` | `date`、`label`、`title`、`dek`、`signalCount`、`pointCount`、`trendCount`、`hasTrendReport` | 日期切换、日期状态、数量摘要 | 缺少每日文章状态、卡片类型分布明细、空状态原因 |
| `signals` / `contentIndex.signals` | `id`、`slug`、`title`、`date`、`signalType`、`brief`、`judgment`、`event`、`businessMeaning`、`sourceUrl`、`sources`、`audience`、`analysis`、`link`、`frontend`、`tags` | 当天商业信号卡、商业信号详情跳转、标签检索 | 当前 active `signals` 类型主要为 `funding` / `case`；产品服务、成熟变化短专题需要补齐或映射 |
| `contentIndex.points` | `id`、`slug`、`title`、`date`、`sourceUrl`、`speakerLine`、`originalView`、`interpretation`、`calibrates`、`opinionTier`、`displayLane`、`selectionReason`、`ratingScore`、`publishStatus`、`usage`、`relatedSignals`、`relatedTrends`、`relatedTrendReports`、`tags` | 已评级观点卡、前沿观点、观点详情页素材 | 当前关系数组多数为空；当前页面没有明确观点详情页目标 |
| `tagTaxonomy` | `id`、`name`、`group`、`aliases` | tags 分类、检索、筛选 | 分组名偏后台，需要前台映射成用户可理解分类 |
| `relations` / `relationFields` | 在信号、观点、趋势报告对象中存在 | 可作为后续关系模型字段入口 | 当前多数为空，不能假装已有强关系 |

当前数量：

- `contentIndex.dates`：6 天。
- 当前 active date：`2026-05-22`。
- active `signals`：7 条，类型为 `funding` 与 `case`。
- `contentIndex.points`：35 条，其中 2026-05-22 有 12 条；`feature` 3 条，`sidebar` 32 条；`daily_feature` 3 条，`signal_sidebar` 32 条。
- `tagTaxonomy`：61 个 tag，分组包括 `track`、`function`、`scenario`、`customer`、`evidence`、`stage`、`region`、`source`、`opinion`。

## 3. 设计方案选择说明

| 方案 | 适合点 | 不适合点 | 是否采用 |
|---|---|---|---|
| 每日长文首页型 | 最符合修正后的今日观察定位；首屏直接呈现当天文章，支持点击进入详情阅读长文；日期切换和当日数据统计可同时成立 | 需要避免把文章摘要做成资讯流 | 采用 |
| 每日简报型 | 信息密度高，适合快速扫描当天内容 | 容易被误解为结论发布或行动建议，并把信号和观点错误设计成论证关系 | 不采用 |
| 编辑精选 / 主编信型 | 有人味，适合强调“今天为什么只写这一篇” | 容易弱化日期切换、检索和结构化素材能力 | 不采用为主方案，可吸收语气 |
| 情报摘要 + 关系台账型 | 关系清晰，能展示信号、观点、趋势、内参之间的连接 | 容易像后台 dashboard；首屏会被筛选器、数字、关系图抢走 | 不采用为主方案，可用于详情页侧栏与底部关系区 |

最终方案：`每日长文首页型`。

页面气质：像一份克制的每日商业观察长文入口。第一屏不是“最新内容列表”，也不是结论发布台，而是当天文章本身。视觉上采用暖白纸面、细分隔线、少量香槟金强调、墨海蓝标题；不做大面积蓝紫渐变、不做标签墙、不做后台矩阵。

## 4. 今日观察专项字段确认表

| 对象 | 前台主字段 | 详情字段 | 关系 / 检索字段 | 隐藏但可计算 | 禁止直出 |
|---|---|---|---|---|---|
| 今日观察文章 | `title`、`date`、`dek`、`summary[0..2]`、`homeCards`、`columnPage.title` | `sections`、`summary`、`columnPage.body`、`columnPage.impact`、`calibration` | `slug`、`contentType`、`link`、`columnPage.keywords`、日期索引 | `id`、`period`、`issue`、`judgment` 仅作现有字段兼容 | Raw / Pool / gate、`sourcePath`、内部状态、脚本字段 |
| 商业信号卡 | `frontend.displayTitle`、`frontend.eventLine`、`frontend.whyWatch`、`frontend.businessMeaning`、`signalType`、`date`、`tags` | `analysis`、`frontend.sourceLinks` | `id`、`slug`、`link`、`tags`、`structuredRefs`、`relations` | `sourceUrl` 可用于外链；`sourcePath` 仅供内部追溯 | `sourcePath`、Raw / Pool、门禁、`relationFields` 原文、后台评级 |
| 观点卡 | `title`、`speakerLine`、`originalView`、`interpretation`、`usage`、`opinionTier` 的前台映射、`tags` | 人物 / 机构、观点原文摘录、观澜解读、时间线、相关信号 | `id`、`slug`、`date`、`sourceUrl`、`relatedSignals`、`relatedTrends`、`relatedTrendReports`、`displayLane` | `ratingScore` 可排序，不展示分数 | `sourcePath`、`ratingScore`、`opinionTier` 原字段名、`displayLane`、`publishStatus`、`archive` / `discard`、`calibrates` |
| 日期对象 | `date`、`label`、`title`、`dek`、`signalCount`、`pointCount`、`trendCount`、`hasTrendReport` | 当日文章、信号、观点、趋势报告组合 | 日期 URL 参数、前后日期、状态 | activeDate | 内部同步状态、生成状态 |
| Tag | `name`、前台分类名、选中态 | 同类文章 / 信号 / 观点聚合 | `id`、`group`、`aliases` | 原始 group 可映射 | 标签墙主视觉、后台 group 原名直出 |

## 5. 今日观察栏目页信息架构

| 顺序 | 区块 | 用户任务 | 内容 | 数据来源 | 处理 |
|---|---|---|---|---|---|
| 1 | 日期切换与当日数据条 | 快速切换日期，并立即知道这一天有哪些相关内容 | 当前日期、快捷日期列表、前后日、文章状态、信号数、观点数、趋势报告状态、卡片类型分布 | `contentIndex.dates`、当日 `signals`、当日 `points` | 页面不设置栏目名称页头和栏目说明；日期切换必须快捷，统计数据为辅助导航，不做后台统计面板 |
| 2 | 今日观察文章首屏 | 直接进入当天文章，并能点击进入详情阅读长文 | 文章标题、导语、正文前几段、阅读原文入口 | `daily.title`、`daily.dek`、`daily.sections`、`daily.link` | 首屏是文章；不使用行动建议式表达；不放概要列表和右侧索引 |
| 3 | 日期内容模块 | 每一天的文章、商业信号、前沿观点集中在同一个大模块下 | 日期、文章入口、商业信号、前沿观点 | `contentIndex.dates`、当日 `signals`、当日 `points` | 页面内容紧凑，多显示几天内容 |
| 4 | Tags / 搜索 | 按主题、岗位、流程、公司检索 | 首屏搜索框、分类筛选、关键词 chips | `tagTaxonomy`、文章 / 信号 / 观点 tags | 搜索栏在首屏工具条内，不做标签墙 |

## 6. 首屏文章模块规格

| 模块 | 内容 | 字段来源 | 视觉权重 | 备注 |
|---|---|---|---|---|
| 日期快捷切换 | 最近日期、上一日 / 今日 / 下一日、当日内容数量 | `contentIndex.dates`、当日 `signals`、当日 `points` | 高，首屏顶部工具条 | 快捷、可扫，不压过文章标题 |
| 今日文章 | 文章标题、导语、正文前几段、阅读原文入口 | `daily.title`、`daily.dek`、`daily.sections`、`daily.link` | 最高，首屏主内容 | 文章是页面中心；单栏呈现，不配右侧索引 |
| 3-5 条文章要点 | 从文章里抽出的段落级要点 | `daily.homeCards`、`daily.summary`、`daily.columnPage` | 中高，服务阅读决策 | 不写成行动建议 |
| 当天案例 / 融资 / 产品服务卡 | 同日或同主题商业信号 | 当日 `signals`，优先 `frontend` 字段 | 中，纸面卡片 | `sourcePath` 和来源等级原字段不直出；只展示外部来源说明 |
| 当天观点卡 | 同日或同主题观点素材 | `daily.calibration`、`contentIndex.points` | 中，侧栏或下方列表 | 观点只是素材，不替代文章 |

## 7. 卡片类型与字段表

| 卡片类型 | 栏目页字段 | 详情页字段 | 侧栏字段 | 禁止字段 |
|---|---|---|---|---|
| 今日观察文章卡 | `title`、`date`、`dek`、正文前几段、`link` | `summary`、`sections`、`columnPage`、前沿观点 | 日期、相关信号数、观点数、前后日期 | Raw / Pool / gate、`sourcePath`、后台生成状态、行动建议式标题 |
| 产品服务卡 | `frontend.displayTitle`、`eventLine`、`whyWatch`、`businessMeaning`、tags | 产品动作、客户对象、部署 / 发布信息、来源链接 | 相关今日观察、同类观点、同类产品服务 | `sourcePath`、未过门禁字段、内部候选状态 |
| 融资卡 | `displayTitle`、融资事件、商业含义、金额可读表达 | 融资背景、投资方、产品方向、来源链接 | 相关信号、同类融资 | Raw / Pool、未确认收入 / 客户事实 |
| 案例卡 | 客户 / 机构、场景动作、流程变化、商业含义 | 场景、使用对象、变化前后、来源链接 | 相关今日观察、同类行业 / 流程 | 未公开的 ROI、预算、客户满意度 |
| 变化短专题卡 | 变化名称、相关信号数、商业含义 | 变化假设、相关信号、成立条件 | 相关趋势、内参、同类 tags | candidate / draft、弱证据包装成趋势 |
| 观点素材卡 | 人物 / 机构、观点标题、原文摘录或“见正文原文摘录”、观澜解读 | 人物 + title + 观点 + 时间线 | 相关信号、相关今日观察、原文链接 | `ratingScore`、`opinionTier` 原字段名、`displayLane`、`publishStatus`、`calibrates` |
| 关系卡 | 关系类型、连接对象、为什么相关 | 关系说明、共同 tags、时间位置 | 侧栏“相关内容” | 空关系、后台 relation 原文 |

## 8. 今日观察文章详情页模板

| 顺序 | 模块 | 内容 | 字段来源 | 备注 |
|---|---|---|---|---|
| 1 | 标题区 | 栏目标签、文章标题、日期、阅读时长 | `daily.title`、`contentIndex.activeDate`、`daily.contentType` | 详情页 H1 不超过 `40px / 56px` |
| 2 | 导语 | 文章 deck / 简短导读 | `daily.dek`、`daily.summary[0]` | 不写“本文将” |
| 3 | 文章要点 | 3-5 条文章要点 | `daily.summary`、`daily.homeCards` | 帮用户决定是否继续读长文，不写成行动建议 |
| 4 | 正文 | 文章主内容分节 | `daily.sections` | 阅读宽度 `760-860px` |
| 5 | 关联案例 / 融资 / 产品服务卡 | 3-5 条同日或同主题信号，按类型标记 | 当日 `signals` | 链接到商业信号详情页，不写成论证关系 |
| 6 | 相关观点素材 | 观点卡摘录、人物、原文入口 | `daily.calibration`、当日 `points` | 观点只是相关素材 |
| 7 | 相关日期 | 前后日期、标题、状态变化 | `contentIndex.dates` | 帮读者看连续文章 |
| 8 | 底部关联 | 同类信号、观点、趋势、内参 | relations、tags、trendReports | 可延后到关系字段补齐后增强 |

## 9. 关联卡详情跳转规格

| 卡片类型 | 从哪里出现 | 跳转目标 | 目标详情页结构 | 备注 |
|---|---|---|---|---|
| 融资卡 | 栏目页同日信号、详情页关联信号、关系索引 | `signal-detail.html?id=<slug>` | 事件标题、事实背景、商业含义、相关观点 / 今日观察 | 使用商业信号详情页，不新增融资栏目 |
| 案例卡 | 栏目页同日信号、详情页关联案例 | `signal-detail.html?id=<slug>` | 场景动作、使用对象、流程变化、商业含义、相关内容 | 禁止写未公开 ROI 和内部采购动机 |
| 产品服务卡 | 栏目页同日信号、详情页关联产品服务 | `signal-detail.html?id=<slug>` | 产品动作、目标用户、解决的业务问题、来源链接 | 当前数据需补 `product_service` 类型或映射 |
| 变化短专题卡 | 详情页底部、趋势 / 内参关联 | 商业信号或趋势详情，视成熟度而定 | 变化假设、相关信号、成立条件 | candidate 不进入前台普通卡 |
| 观点卡 | 同日观点区、详情页相关观点、关系索引 | 后续 `opinion-detail.html?id=<slug>` 或商业信号相邻观点详情路由 | 人 + title + 观点 + 时间线 + 原文链接 + 相关今日观察 / 信号 | 不新增一级导航；当前前台缺明确观点详情页，是 Build 前数据 / 路由缺口 |

## 10. 日期查看和 tags 检索规格

| 功能 | 输入 | 输出 | 空状态 | 交互说明 |
|---|---|---|---|---|
| 日期查看 | 日期参数或日期切换按钮 | 当日文章、信号数、观点数、趋势报告状态、卡片类型分布 | “这一天还没有文章，可先查看当日商业信号。” | 日期切换保留在首屏日期条，前后日按钮不抢文章标题 |
| 日期状态 | `contentIndex.dates` + 当日资产数量 | 有文章 / 无文章 / 有信号无文章 / 有观点无信号 | “这一天还没有文章，可先查看商业信号。” | 状态语用自然语言，不显示内部同步状态 |
| 多 tag 筛选 | 一个或多个 tag id | 匹配文章、信号、观点 | “这个组合太窄，先去掉一个条件。” | 支持 chips，tags 不做主视觉 |
| 关键词搜索 | 标题、导语、要点、信号标题、观点人物 / title、tags、商业变量 | 分组结果：文章 / 信号 / 观点 | 输入过短：“再输入一个关键词。” 无结果：“没有找到可展示材料。” | 最小 2 个中文字符或 3 个英文字符 |
| 分类浏览 | 前台分类：行业、岗位 / 部门、流程、技术路线、公司 / 人物、商业变量、文章主题 | 对应 tag 组的可选项 | “这一类暂时没有通过前台门禁的材料。” | 后台 group 映射为用户语言 |

Tag group 前台映射建议：

| 后台 group | 前台分类 |
|---|---|
| `track` | 技术路线 / 主题 |
| `function` | 岗位 / 部门 |
| `scenario` | 流程 / 使用场景 |
| `customer` | 客户类型 |
| `evidence` | 证据类型 |
| `stage` | 内容阶段 |
| `region` | 区域 |
| `source` | 来源类型 |
| `opinion` | 观点主题 |

## 11. 关系模型与关联展示

| 关系 | 起点 | 终点 | 前台展示方式 | 数据字段来源 | 不得展示 |
|---|---|---|---|---|---|
| 今日观察 -> 商业信号 | `daily.id` / 日期 | 当日 `signals` | 栏目页“商业信号”、详情页“关联信号” | 日期匹配、`relations`、tags 匹配 | Raw / Pool / gate、`sourcePath` |
| 今日观察 -> 案例 / 融资 / 产品服务卡 | `daily.date` | `signals.signalType` 分类卡 | 卡片类型标签 + 事件一句话 | `signalType`、`frontend`、`tags` | 未公开客户事实、内部资产等级 |
| 今日观察 -> 观点卡 | `daily.calibration` / 日期 | `contentIndex.points` | “前沿观点”模块 | `opinionTier`、`displayLane`、`publishStatus`、`date` | `ratingScore`、后台字段名、`calibrates` |
| 今日观察 -> 趋势观察 / 趋势报告 | `daily` / tags | `contentIndex.trends`、`contentIndex.trendReports` | 底部“趋势背景”或侧栏关联 | `relatedTrends`、`relatedTrendReports`、tags | candidate 直接前台化 |
| 今日观察 -> 商业内参 | `daily` / tags / 日期 | `brief` | “进入周期内容”弱入口 | 后续内参关系字段 | 会员数据、后台热力原始字段 |
| 观点卡 -> 今日观察 / 信号 | `point.id` | `daily.id`、`signal.id` | 观点详情页“相关内容” | `relatedSignals`、日期、tags | 把观点当事实 |
| 日期 -> 当天组合 | `contentIndex.dates.date` | 当日 daily / signals / points | 日期索引和状态条 | `date` 字段 | 内部生成状态 |
| tags -> 同类聚合 | tag id | 文章 / 信号 / 观点 / 趋势 | 搜索结果页或栏目页筛选结果 | `tagTaxonomy`、对象 `tags` | 标签墙主视觉、后台 group 原名 |

关系展示位置：

- 栏目页首屏：核心是今日观察文章；日期统计和同日素材入口只作为辅助导航。
- 栏目页中段：按日期聚合展示更多天的商业信号和前沿观点。
- 文章详情侧栏：展示日期状态、信号数、观点数、相关日期。
- 文章详情底部：展示关系索引，允许进入信号详情、观点详情、趋势报告、内参。

当前关系风险：

- `relations`、`relatedSignals`、`relatedTrends`、`relatedTrendReports` 多数为空，Build 时不得假装已有强关系。
- 第一版可使用日期 + tags + 显式 `daily.calibration` 做弱关系；关系强度文案必须克制，不写成论证关系或行动建议。

## 12. Copy-first 文案表

| 位置 | 建议文案 | 使用说明 |
|---|---|---|
| 首屏文章标题区 | 今日文章 | 模块标题，可弱化为小标签 |
| 日期切换 | 上一日 / 今日 / 下一日 | 克制按钮文案 |
| 日期状态 | 当日有 1 篇文章、7 条信号、12 条观点 | 数量可变 |
| 搜索占位 | 搜索公司、场景、人物或商业变量 | 覆盖多对象 |
| Tags 工具标题 | 按变量筛选 | 不写“标签墙” |
| 文章入口 | 阅读完整观察 | 主 CTA |
| 信号模块标题 | 商业信号 | 不表达论证关系 |
| 观点模块标题 | 前沿观点 | 不叫“观点热榜”，不表达证明关系 |
| 空状态：无文章 | 这一天还没有文章。可以先看当日已经放行的商业信号。 | 不写“敬请期待” |
| 空状态：无信号 | 这一天暂无可展示信号，只显示今日观察文章。 | 不硬凑 |
| 空状态：无观点 | 当天暂无达标观点。 | 遵守观点门禁 |
| 空状态：搜索无结果 | 没有找到可展示材料。换一个公司、场景或商业变量试试。 | 不暴露后台 |
| 空状态：输入过短 | 再输入一个关键词。 | 简短 |
| 详情页信号模块 | 商业信号 | 文章详情页 |
| 详情页观点模块 | 相关观点素材 | 防止观点事实化 |
| 详情页相关日期 | 前后几天的文章 | 时间线 |

## 13. Typography 页面位置表

| 页面 / 区域 | 位置 | 字号 / 行高 | 字重 | 字体族 | 备注 |
|---|---|---:|---:|---|---|
| 全站导航 | 一级导航 | `14px / 20px` | 500 / 当前 600 | `--gl-font-sans-cn` | 不放大当前导航 |
| 今日观察栏目页 | 日期状态条 | `12px / 18px` | 500 / 600 | `--gl-font-mono` 或 `--gl-font-en` | 首屏起点，不放栏目名称和解释说明 |
| 今日观察栏目页 | 文章标题 | `36px / 48px` 以内 | 600 | `--gl-font-serif-cn` | 作为页面首个强标题，不用首页 Hero 尺寸 |
| 今日观察栏目页 | 文章导语 | `18px / 32px` | 400 / 500 | `--gl-font-sans-cn` | 只用于首屏文章导语 |
| 今日观察栏目页 | 分组标题 | `24px / 34px` | 600 | `--gl-font-serif-cn` 或 `--gl-font-sans-cn` | 商业信号、观点、关系索引 |
| 今日观察栏目页 | 主信号卡标题 | `22px / 32px` | 600 | `--gl-font-serif-cn` | 只用于主卡 |
| 今日观察栏目页 | 普通信号 / 观点卡标题 | `18px / 28px` | 600 | `--gl-font-sans-cn` | 默认卡片 |
| 今日观察栏目页 | 摘要 / 卡片正文 | `14px / 24px` | 400 | `--gl-font-sans-cn` | 不超过 3-4 行 |
| 今日观察栏目页 | 标签 / 日期 / 数量 | `12px / 18px` | 500 / 600 | `--gl-font-mono` 或 `--gl-font-en` | 数字用 mono |
| 今日观察详情页 | H1 | `40px / 56px` | 600 | `--gl-font-serif-cn` | 最大宽度 860px |
| 今日观察详情页 | Deck | `18px / 32px` | 400 | `--gl-font-sans-cn` | H1 下方 |
| 今日观察详情页 | 正文 | `16px / 30px` | 400 | `--gl-font-sans-cn` | 阅读宽度 760-860px |
| 今日观察详情页 | 正文 H2 | `26px / 38px` | 600 | `--gl-font-serif-cn` 或 `--gl-font-sans-cn` | 段落大节 |
| 今日观察详情页 | 文章要点块 | `20px / 34px` | 500 | `--gl-font-serif-cn` | 不超过 4-6 行 |
| 详情页侧栏 | 分组标签 | `11px / 16px` | 600 | `--gl-font-en` | 不抢正文 |
| 详情页侧栏 | 标题 | `16px / 24px` | 600 | `--gl-font-sans-cn` | 侧栏永远小于正文 H2 |
| 详情页侧栏 | 摘要 | `13px / 22px` | 400 | `--gl-font-sans-cn` | 关系说明 |
| 关联卡片区 | 卡片标题 | `17px / 26px` | 600 | `--gl-font-sans-cn` | 底部关联区 |
| 页脚 | 品牌 / 链接 | `12-14px / 20-22px` | 400-600 | `--gl-font-sans-cn` | 不使用 Hero 风格 |

禁止项：

- 栏目页不设置独立 H1 页头；首屏强标题使用文章标题，不得使用 `56px / 72px`。
- 详情页 H1 不得超过 `40px / 56px`。
- 不得新增 `5vw`、过大 `clamp()`、`760 / 780` 字重、负字距。
- 卡片标题不得超过 `24px / 34px`。

## 14. 视觉与交互规格

| 项 | 规格 |
|---|---|
| 背景 | 全局 `--gl-bg-page` / `#FFFDF8`，导航融合背景 |
| 卡片 | 暖白纸面或 `--gl-paper`，半透明可用但不过度玻璃拟态 |
| 强调色 | 香槟金只用于细线、状态点、少量关键标记 |
| 圆角 | 卡片 `6-12px`，优先 token；不使用大圆角 Bento |
| 关系展示 | 优先细分隔线、弱标签、侧栏摘要，不做关系大图或后台矩阵 |
| 搜索 / tags | 工具条化，允许 chips 与下拉，不做标签墙 |
| 动效 | 可后续使用 `motion-tokens.css` 的轻微 fade / hover，不做炫技 |
| 移动端 | 本任务桌面优先；后续实现必须基础不崩坏、无横向溢出 |

## 15. 桌面端验收清单

后续 Build & Release 必须逐项验收：

1. 栏目页首屏是否以今日观察文章为中心，并能点击进入详情页阅读长文。
2. 页面是否像按日期组织的长文首页，而不是结论发布台、资讯流、卡片墙或后台 dashboard。
3. 是否没有新增一级导航，没有把前沿观点做成一级栏目。
4. 是否只展示 `feature` / `sidebar` 且 `daily_feature` / `signal_sidebar` 的观点。
5. 是否没有把 Raw / Pool / gate / eligible / index_only / candidate / draft / sourcePath 等内部字段直出。
6. 日期切换是否支持当前日、前后日、空日期、无文章、有信号无文章、无观点等状态。
7. Tags 是否支持分类、多 tag、关键词搜索和空结果状态，且没有做成主视觉标签墙。
8. 商业信号卡是否能跳转到商业信号详情页。
9. 观点卡是否有观点详情页目标或明确的非一级导航详情路由。
10. 文章详情页是否有标题、日期 / 阅读时长、导语、文章要点、正文、关联信号、相关观点素材和相关日期。
11. 关系模型是否使用真实字段；关系字段为空时是否降级为日期 / tags 弱关系。
12. 栏目页是否取消独立栏目名称页头和辅助解释说明模块。
13. 详情页 H1 是否为 `40px / 56px`。
14. 模块标题是否不超过 `36px / 48px`。
15. 卡片标题是否不超过 `24px / 34px`。
16. 是否不存在不受控 `vw`、过大 `clamp()`、负字距、`760 / 780` 字重。
17. 页面背景、卡片、分隔线、强调色是否遵守 `brand-tokens.css`。
18. 是否使用正式 Logo SVG，未重绘或修改品牌资产。
19. 桌面 1440px 截图中主次是否清楚，文字是否无重叠、无截断、无横向溢出。
20. 移动基础观察是否无横向溢出、按钮可点击、标题不断成难读碎片。

## 16. 字段待补齐项与后续数据补齐

| 待补齐项 | 影响 | 后续处理 |
|---|---|---|
| 历史 daily 正文不是统一多日数组 | 日期切换只能显示历史摘要，不能完整渲染每一天文章详情 | 后续将 daily 文章按日期结构化，或为详情页提供按 date / slug 取文机制 |
| `relations` / `relatedSignals` 多数为空 | 关系展示只能弱化为日期和 tags 匹配 | 资产链后续补显式关系，不允许前台假装强关联 |
| 当前 active 信号类型主要是 `funding` / `case` | 产品服务、成熟变化短专题展示无法完整覆盖 | 资产同步时补 `product_service`、`change_topic` 或建立类型映射 |
| 观点详情页目标缺失 | 观点卡无法按派发单跳转到自身详情页 | 阶段 2B 需定义非一级导航的 `opinion-detail` 路由或信号相邻详情路由 |
| 日期状态缺少文章状态和卡片类型分布 | 日期条无法完整展示“有文章 / 无文章 / 类型分布” | 后续同步脚本补 `articleStatus`、`cardTypeCounts` |
| tags 分组偏后台语义 | 前台分类可能读起来像字段 | Build 时使用本文前台映射 |

## 17. 质量门与验证

已完成：

- 读取并遵守页面 / 文案 / Typography Harness。
- 读取 VI、token、字体、页面位置规范。
- 读取基础文案 Skill。
- 解析 `site-content.json`，确认 daily、signals、points、tags、relations 字段来源。
- 输出 Copy-first 文案表。
- 输出 Typography 页面位置表。
- 输出桌面端验收清单。

未运行：

- 构建：本任务不改代码。
- 截图：本任务不生成页面。
- `$guanlan-typography-qc`：当前是规格产出，后续 Build 前必须按本文 Typography 表执行。
- `cardcopy` / `syntax`：本任务不改数据和代码。

阶段 2B 结论：

- 可以启动，但只能在用户确认本规格后启动。
- 阶段 2B 不得临场新增一级导航、临场补关键文案、临场新增字号体系或把观点卡做成独立一级栏目。
- 阶段 2B 必须先处理观点详情页目标和关系字段降级策略，再进入页面实现。

## 18. 交付物

本 closeout 写入：

```text
agent-workflow/reports/WSD-20260522-daily-observation-page-redesign-spec-closeout.md
```

本任务没有删除无效文件，没有修改代码，没有修改数据，没有运行构建或部署。
