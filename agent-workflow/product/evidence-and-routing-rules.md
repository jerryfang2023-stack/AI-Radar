---
title: Evidence And Routing Rules
date: 2026-05-22
status: active-v2.2
owner: intelligence-engine / product-commander
consolidation: raw_fields_and_raw_to_pool_routing
---

# Evidence And Routing Rules

本文件是每日监测 Raw 证据字段、核心证据门槛和 Raw-to-Pool 分流算法的单一真源。

Source closeout 中已经写入的 Raw-to-Pool、QC、quality gate 内容，在本文件中重新归位：

- Raw 证据字段、页面类型、原文可用性、hash、摘录、证据缺口和 Raw QC 决策属于本层。
- `pool_routes` 只作为 Raw 证据门禁的候选输出字段保留。
- Pool 路由策略、Pool-to-Content 和卡片生成属于后续流程，不在本层继续扩写。

## 1. 基本原则

- Raw 是证据底座，不只是网页存档。
- Pool 是 Raw 之后的候选索引，不是事实正文，也不是最终内容资产。
- Pool 只能引用 Raw，不能替代 Raw。
- 下游事实判断必须回到 Raw 全文、Markdown 快照、JSON 证据对象，必要时二搜补证。
- `S/A/B/C/D/M`：来源类型、证据角色、使用边界。禁止作为内容价值评级、加分项或核心证据硬门槛。
- 内容价值只来自六类观澜重要性：重要案例、重要融资事件、重要技术趋势、重要产品和服务产生、重要垂直行业解决方案、重要发言 / 观点 / 文章。
- 采购、预算、收入、监管、诉讼、合规、风险等只作为 `supporting_signals`，不能单独推高内容价值。

## 2. Raw 字段分层

Raw 字段分为五层。前两层是 Raw 证据层必填，第三层是证据判断字段，第四层是门禁输出字段，第五层是下游派生字段。

### 2.1 核心采集字段

- `raw_id`
- `title`
- `original_url`
- `canonical_url`
- `source_name`
- `source_type`
- `source_level`
- `source_level_role`
- `acquisition_source_level`
- `acquisition_channel`
- `research_status`
- `published_at`
- `collected_at`

### 2.2 证据完整性字段

- `full_text`
- `clean_text`
- `markdown_snapshot_path`
- `json_snapshot_path`
- `fetch_status`
- `extraction_quality`
- `extraction_method`
- `readability_score`
- `extractor_diagnostics`
- `has_full_text`
- `content_length`
- `full_text_hash`
- `evidence_completeness`

### 2.3 证据判断字段

- `evidence_object_type`
- `evidence_object_usable`
- `index_only_evidence`
- `evidence_eligibility`
- `evidence_block_reason`
- `missing_information`
- `raw_status`
- `source_volatility`
- `capture_scope`
- `evidence_level`
- `discovery_source`
- `discovery_record`
- `source_role`
- `origin_fetch_status`
- `key_excerpts`

### 2.4 门禁输出字段

- `raw_qc_decision`
- `raw_qc_downstream_use`
- `degradation_reasons`

### 2.5 派生分析字段

- `business_elements`
- `evidence_seed`
- `guanlan_scores`
- `usable_for`
- `pool_routes`

`full_text` 是证据底座。`clean_text` 是分析入口，不能替代 `full_text`。

Raw 核验清单：

```text
original_url
full_text
markdown_snapshot_path
json_snapshot_path
content_hash
full_text_hash
extraction_method
readability_score
key_excerpts
missing_information
raw_qc_decision
```

Raw QC 只输出三种决策：

- `allow`：可作为候选主证据进入后续 QC，但仍需每日监测 QC 最终放行。
- `allow_with_degradation`：只能进入 `index_only`、`watchlist`、`emerging_pool` 或 `user_feedback_pool` 等低强度用途；不得作为事实主证据。
- `block`：不得进入下游使用，只能保留为失败、噪音或排除记录。

## 3. 原文缺失降级规则

`full_text`、snapshot、hash、excerpt 任一缺失时，必须记录在 `evidence_completeness` 和 `degradation_reasons` 中。

| 缺失项 | 默认处理 |
|---|---|
| `original_url` 缺失 | `raw_qc_decision=block` |
| `full_text` 缺失，仅有摘要或入口文本 | `allow_with_degradation`；如同时抓取失败则 `block` |
| Markdown / JSON snapshot 缺失 | `allow_with_degradation`；核心证据不可用 |
| `content_hash` / `full_text_hash` 缺失 | `allow_with_degradation`；不能进入 `core_pool` |
| `key_excerpts` 缺失 | `allow_with_degradation`；不能作为事实主证据 |
| 页面抓取 blocked / timeout / paywall | 默认 `allow_with_degradation` 或 `block`，必须在 `missing_information` 写明补证需求 |

`clean_text` 不能补位为 `full_text`。入口摘要、搜索摘要、未回源的聚合摘要和 follow-builders 转述不得作为事实依据。

## 3.1 抓取层诊断规则

当前抓取层会记录：

- `extraction_method`：正文抽取方式。
- `readability_score`：正文可读性评分。
- `extractor_diagnostics`：段落数、句子数、样板噪音、符号比例和抽取方式。

默认门槛：

- `core_pool` 项目必须有 `extraction_method`。
- `core_pool` 项目 `readability_score` 默认不低于 24。
- `readability_score` 过低、抽取方式为 fallback、正文主要是导航 / 登录 / 目录 / 评论加载 / 订阅提示时，即使存在 `full_text_hash`，也不得作为事实主证据。
- JSON-LD、meta description 可以作为 fallback 线索，但不能单独替代完整正文支撑强判断。

## 4. Raw-to-Pool 算法顺序

Raw-to-Pool 必须按以下顺序执行。

### Step 1: 归一来源角色

- `source_level` 记录来源分类：S / A / B / C / D。
- `acquisition_source_level=M` 记录采集入口：AI HOT、follow-builders、HN、RSS、X、Reddit、搜索聚合等。
- 采集入口文本不能单独支撑事实判断；事实判断必须回到原文、全文快照、证据对象和 Raw QC 决策。
- S / A / B / C / D / M 不得直接给内容价值加分，也不得决定能否进入 `core_pool`。

### Step 1.1: Search Freshness And Duplicate Merge

- NewsAPI is retired from the active monitoring provider chain.
- Active semantic discovery order is `Anysearch -> Tavily -> Exa -> DuckDuckGo -> Bing fallback`.
- Active A-media / news verification order is `GDELT -> Anysearch -> Tavily / Exa -> DuckDuckGo / Bing fallback`.
- Tavily / Exa / Anysearch / GDELT provider date fields must be normalized into `published_at` before freshness comparison.
- Invalid dates, isolated years, tracking ids and social activity ids must remain blank; do not manufacture freshness.
- Before Raw selection, merge duplicate provider hits by canonical URL and by source-family title/date fingerprint, especially Reuters, financing-wire posts, product pages and company announcements.
- The kept provider hit should prefer usable original URL, valid `published_at`, richer snippet/full-text lead and stronger source reliability. Merged Raw records should preserve traceability with `duplicate_status=merged_provider_duplicates` or equivalent notes.

### Step 2: 页面类型硬门槛

以下页面默认 `index_only`：

- 官网首页。
- 产品页、Demo 页、开放平台首页。
- 产品目录、工具目录。
- 文档 / API / SDK 目录。
- 价格导航页。
- GitHub README / repo index。
- Hugging Face / npm / PyPI 包页或模型页。
- Marketplace listing。
- 控制台 / 登录页。
- 搜索结果页。
- AI 工具导航页。
- 中文 SEO 页。
- 低质量中文官网。
- 工具平台官网、产品陈列页、模板页、教程合集页。

只有同一页面包含明确日期、主体、可核验事实或完整观点正文时，才能解除硬降级。

默认处理：

```yaml
raw_status: indexed
pool_routes:
  - index_only
evidence_object_usable: false
index_only_evidence: true
raw_qc_decision: allow_with_degradation | block
```

### Step 3: 核心证据硬门槛

核心证据的原子门槛必须同时满足：

```text
original_url exists
has_full_text = true
extraction_method exists
readability_score >= 24
extraction_quality = high | medium
evidence_object_type not in index_only_types
index_only_evidence = false
content_hash exists
full_text_hash exists
key_excerpts exists
```

`raw_qc_decision=allow` 是以上原子门槛和降级规则计算后的输出结果，不与原子门槛并列。

不满足时，只能进入 `emerging_pool`、`user_feedback_pool`、`watchlist`、`index_only` 或 `discard`，不得直接作为事实主证据。

### Step 4: 内容价值评分

内容价值评分必须先识别 `importance_type`，再给出 `importance_score`。只允许六类核心重要性：

| `importance_type` | 最低判定特征 |
|---|---|
| `important_case` | 真实客户 / 真实行业场景 / 可复用工作流 / AI 进入业务系统路径，至少命中 1 项 |
| `important_funding` | 知名机构 / 融资规模 / 估值变化 / 关键赛道 / 团队背景 / 赛道拐点，至少命中 1 项 |
| `important_technical_trend` | 模型能力 / 成本结构 / agent 架构 / 推理 / 评测 / 开源生态 / 基础设施变化，至少命中 1 项 |
| `important_product_or_service` | 新产品 / 新 API / 新平台 / 新商业化能力 / 新分发渠道，至少命中 1 项 |
| `important_vertical_solution` | 明确行业 + 完整解决方案 / 行业工作流 / 可交付产品形态，至少命中 2 项 |
| `important_viewpoint_or_article` | 影响行业判断 / 投资判断 / 技术路线 / 商业采用，至少命中 1 项 |

以下不得单独构成 `importance_type`：

- 部署、采购、预算、收入、成本、价格变化。
- 监管、诉讼、合规、风险、安全事件。
- 一般客户采用、一般工作流变化。

仅命中以上内容时，设为 `importance_type=supporting_signal`，不得进入 `core_pool`。

`importance_score` 采用 1-5 分解释表：

| 分数 | 含义 | 是否可进 `core_pool` |
|---:|---|---|
| 1 | 没有观澜核心重要性，只能归档或排除。 | 否 |
| 2 | 只有 supporting signal，例如一般采购、预算、收入、监管、诉讼、合规、风险或采用背景。 | 否 |
| 3 | 有潜在线索或观点，但主体、动作、时间、证据强度或下游判断价值不足。 | 否 |
| 4 | 六类重要性之一的明确变化，有主体、动作、时间或可用原文证据。 | 可，仍需 Raw QC 和最终 QC |
| 5 | 平台级、头部客户、知名机构、前沿实验室、行业路线变化或高影响判断，且证据强。 | 可，仍需 Raw QC 和最终 QC |

六类内部的评分上限：

- `important_case`：真实客户 / 生产部署 / 真实工作流为 4；头部客户、跨行业可复用路径或明确业务结果为 5。
- `important_funding`：融资事件为 4；知名机构、较大金额、估值变化、赛道拐点或强团队背景为 5。
- `important_technical_trend`：可验证的 release、benchmark、paper、repo release 或架构变化为 4；前沿能力、成本结构或行业路线变化为 5。
- `important_product_or_service`：明确新产品、API、平台或商业化能力为 4；平台级、大厂生态级或企业级分发变化为 5。
- `important_vertical_solution`：明确行业和交付形态为 4；真实客户、完整行业工作流或可复制落地路径为 5。
- `important_viewpoint_or_article`：影响技术路线、投资判断或商业采用的完整观点为 4；高影响人物 / 机构且改变行业判断框架为 5。

重大监管、诉讼、合规、安全、隐私和风险事件不得自动作为 supporting signal 压低；只有当它改变行业采用、治理路径、部署节奏或商业判断时，才可归入 `important_viewpoint_or_article` 或 `important_case`，且最低需要完整原文或可信报道。

精选入口只影响采集优先级：

- AI HOT daily 可提高 Raw 抓取优先级和候选保留优先级，但不能按渠道身份自动限制到 `index_only` / `watchlist`，也不能自动进入 `core_pool`。
- follow-builders 可提高前沿观点候选优先级。
- HN / Reddit / X 只提高反馈观察价值，不证明公司事实。

## 5. Pool 路由

采集入口不决定 Pool 路由。AI HOT、RSS、关键词搜索、GDELT、Anysearch、Tavily、Exa 等入口发现的候选，都必须先回到原文，再按原文证据、页面类型、时间、商业重要性和事实类型统一判定。

`pool_routes` 只允许：

- `core_pool`
- `emerging_pool`
- `user_feedback_pool`
- `watchlist`
- `index_only`
- `discard`

`pool_routes` 是候选分流字段，不是内容生成状态。本层只治理 Raw 证据能否支撑这些候选标签；Pool 层如何排序、取舍和进入内容资产，留给后续 Pool / 分流层任务。

### core_pool

进入条件：

- 满足核心证据硬门槛。
- `raw_qc_decision=allow`。
- `importance_score >= 4`。
- `importance_type` 属于六类核心重要性之一，不能是 `none` 或 `supporting_signal`。

用途：正式变化判断、场景 / 案例信号、趋势报告、今日观察、商业信号和商业内参的事实候选。进入下游前仍需 QC。

### emerging_pool

进入条件：

- 证据对象可用，但尚未达到 `core_pool` 的完整事实主证据门槛。
- 具备早期产品、融资、开源、开发者生态、技术路线或新兴采用线索。
- `raw_qc_decision=allow` 或 `allow_with_degradation`；若为降级，只能作为补证队列和早期观察，不得直接写事实结论。

用途：后续补采、趋势苗头观察和候选扩展。

### user_feedback_pool

进入条件：

- 来源为 HN / Reddit / X / forum / issue / 社区评论等反馈材料。
- 只能证明“有人反馈、讨论或表达观点”，不能单独证明公司动作、客户采用、收入、融资、市场规模或监管事实。
- 若要转入 `core_pool`，必须另有非社区原文、可信报道或完整观点正文支撑。

用途：用户摩擦、开发者反馈、社区热度和反证线索。

### watchlist

进入条件：

- 有明确主体、方向或早期信号，但事实链仍不完整。
- 可用证据不足以作为事实主证据，常见原因包括缺全文、缺快照、缺 hash、缺关键摘录、只命中入口摘要、只有早期观点或等待二搜。
- `raw_qc_decision=allow_with_degradation` 的项目默认最高只能到 `watchlist` / `emerging_pool` / `user_feedback_pool`，不得进入 `core_pool`。

用途：保留值得追踪的线索、等待补采或复核。`watchlist` 与 `index_only` 的区别是：`watchlist` 有可追踪的主体或方向，`index_only` 只保留索引关系或入口记录。

### index_only

进入条件：

- 首页、产品页、目录页、文档目录、README、包页、模型页、Marketplace listing、登录页、搜索结果页、SEO 页等默认硬降级页面。
- 精选入口全量保留但未通过证据门的项目。
- 材料只能证明“这个入口或页面存在”，不能证明一个可写入下游的事实变化。

用途：去重、回溯、补采入口和来源审计。不得作为事实主证据。

### discard

进入条件：

- 无原始 URL、抓取失败且无可用快照、明显非 AI 噪音、搜索结果 / 工具目录 / 低质 SEO 无可用证据，或 `raw_qc_decision=block`。
- 精选入口全量保留项可降到 `index_only`，但不得因精选身份避免事实使用阻断。

用途：保留排除理由或失败记录，不进入下游。`discard` 表示丢弃下游使用资格，不表示删除 Raw 记录。

### 降级原因到最高路由

| 降级原因 | 最高允许路由 | 说明 |
|---|---|---|
| `missing_original_url` | `discard` | 无法追溯原文。 |
| `missing_full_text` | `watchlist` / `index_only` | 有主体时可追踪；只有入口摘要时只索引。 |
| `missing_snapshot` | `watchlist` / `index_only` | 不能作为事实证据。 |
| `missing_hash` | `watchlist` | 可补 hash，补完前不得核心化。 |
| `missing_excerpt` | `watchlist` | 无可引用证据片段，补完前不得核心化。 |
| `index_only_or_directory_page` | `index_only` | 首页、目录、产品陈列、包页、模型页等只保留索引。 |
| `discovery_or_feedback_source_boundary` | `user_feedback_pool` / `index_only` | 社区反馈进反馈池；聚合入口摘要只索引或等待回源。 |
| `raw_evidence_unusable` | `discard` | 保留失败记录，不进入 Pool 使用。 |

Pool 路由冲突处理：

- 同时满足 `core_pool` 和其他路由时，`core_pool` 只表示事实候选资格，不取消后续主题分流。
- `core_pool` 与 `index_only` / `discard` 互斥。
- `raw_qc_decision=block` 不得进入 `core_pool`、`watchlist` 或 `emerging_pool`。
- `allow_with_degradation` 可进入非核心路由，但下游只能按 QC 报告列明范围使用。

Pool 统计必须拆分：

- `pool_index_count`：Pool index 总量，包含精选入口全量保留项。
- `routed_pool_count`：进入 `core_pool` / `emerging_pool` / `user_feedback_pool` / `watchlist` 的可路由候选数。
- `core_pool_count`：核心事实候选数。
- `index_only_pool_count`：只索引的 Pool 项。
- `aihot_index_only_count`：AI HOT selected 中回源后仍只索引的项。
- `aihot_core_count`：AI HOT selected 中回源后真正过证据门进入核心池的项。

质量判断不得只看 `pool_count`，因为精选入口全量保留会抬高 Pool index 数量。

## 6. 每日重要性覆盖

每日覆盖只以 `importance_type` 为主分类：

- `important_case`
- `important_funding`
- `important_technical_trend`
- `important_product_or_service`
- `important_vertical_solution`
- `important_viewpoint_or_article`

Raw-to-Pool 分流后必须检查六类重要性覆盖。缺任一类时，先补采或标记 `importance_coverage_gap`。

不得用首页、目录、SEO、M 入口摘要、社区反馈、采购、预算、收入、成本、监管、诉讼、合规或风险材料填补六类重要性缺口。

## 7. 下游使用

- Pool 必须携带 `raw_ref`、`raw_archive`、`raw_json`、`source_url`、`extraction_quality`、`has_full_text`、`full_text_hash`、`usable_for`、`pool_routes`、`key_excerpts`、`evidence_seed` 和 `missing_information`。
- 正式变化判断、场景 / 案例信号、趋势报告、今日观察和商业内参里的事实判断，只能使用满足核心证据硬门槛的 Raw 作为主证据。
- 商业信号、观点、趋势和关系模块的前台内容必须回到 Raw `full_text`、Raw `key_excerpts`、Pool `evidence_seed` 或明确补证来源生成；不得用旧 `event`、`why_selected`、`business_meaning`、`watch_reason`、前台摘要、标签解释或 `business_elements` 二次生成事实、价值、趋势和关系文案。
- `business_elements`、`source_level`、`acquisition_channel`、`pool_routes`、`usable_for`、`guanlan_scores`、`raw_qc_decision` 等字段只作为后台分类、门禁、统计和回溯使用，不得直接作为读者可见内容。
- Card 前台只保留最小内容面：标题、主体、日期、来源、标签、新闻事实、原文要点、简要价值描述、可见原文片段和必要证据边界。构建期路径、Raw / Pool id、门禁状态、抓取诊断不得写入公开前台 JSON。
- C 类社区来源和 M 类发现入口可以触发观察、用户反馈和补证任务，但不得单独写成事实结论。
- 未回到原文的聚合标题、摘要和热度不得作为事实依据；AI HOT 只记录发现来源，回源后的材料按统一证据门槛判定。
- follow-builders 只能证明“谁在何时何处说了什么”；其中的公司动作、客户采用、收入、融资、市场规模等事实主张必须另有原文或可信报道。
- X / Twitter 来源进入观点资产链时，必须保留当时可见全文、全文中文翻译和 `capture_scope: x_full_visible_text`；它仍然只证明观点出现过，不升级为公司事实证据。
- `core_pool` 不是最终内容许可；下游使用必须等待 `guanlan-daily-monitor-qc` 返回 `allow` 或明确范围的 `allow_with_degradation`。
- 本层不决定前沿观点卡前台展示。follow-builders / 社区观点进入资产链后，先入 `opinion_intake` 并写入中文翻译，再由观点卡四档评级决定 `feature`、`sidebar`、`archive` 或 `discard`；只有完成翻译的 `feature` / `sidebar` 可进入前台。
