---
title: Raw Evidence Schema
date: 2026-05-18
status: active
owner: intelligence-data-agent / workflow-agent
---

# Raw Evidence Schema｜原始证据仓库

Raw 不再只是网页存档。它是观澜 AI 所有判断资产的证据底座，也是 Pool、变化卡、案例卡、观点卡、趋势卡、每日观察、商业内参和 AI 商业热力图的内容加工入口。

## 1. Raw 的职责

Raw 负责保存三类东西：

- 来源：这条材料来自哪里，谁发布，什么时候发布，什么时候被观澜采集。
- 证据：原文正文、Markdown 快照、关键摘录、必要时的 HTML / 截图归档。
- 加工入口：商业要素、证据种子、可用方向、缺失信息和初筛评分。

Pool 只能引用 Raw，不能替代 Raw。后续所有卡片和文章必须能回到 Raw 的具体公司动作、案例细节、岗位流程变化、数字和原文证据。

Pool 分流细则以 `agent-workflow/product/pool-routing-rules.md` 为准；本文只保留 Raw 字段和下游使用边界。

## 2. 标准字段

### 来源信息

| 字段 | 说明 |
|---|---|
| `raw_id` | 当日 Raw 稳定 ID |
| `title` | 原始标题，禁止生成半截标题 |
| `original_url` | 采集到的原始 URL |
| `canonical_url` | 去掉追踪参数后的规范 URL |
| `source_name` | 来源名称 |
| `source_type` | official / media / developer / community / research / funding / web 等 |
| `author` | 作者或发布账号；未知留空 |
| `published_at` | 原文发布时间 |
| `collected_at` | 观澜采集时间 |
| `language` | zh / en / mixed / unknown |
| `source_level` | S / A / B / C / D，回源后的事实来源等级，只判断事实可靠度，不判断商业价值 |
| `acquisition_source_level` | 采集通道等级；AI HOT / follow-builders / 搜索聚合等为 M。M 不是事实来源等级 |
| `research_status` | preprint / formal_report / peer_reviewed / not_research / unknown |
| `search_intent` | keyword-search 的检索意图；非 keyword-search 可留空 |
| `search_path` | keyword-search 的检索路径，如 official_original / developer_ecosystem / community_feedback |
| `search_path_label` | 检索路径前台不可见说明 |

### 原文证据

| 字段 | 说明 |
|---|---|
| `full_text` | 尽量完整保存的可读全文证据，优先用于人工回查和后续补证 |
| `clean_text` | 清洗正文，供 AI 分析 |
| `markdown_snapshot` | 人工回查用 Markdown 快照 |
| `markdown_snapshot_path` | 本地 Markdown 档案路径 |
| `json_snapshot_path` | 机器可读 Raw 证据对象路径 |
| `html_snapshot_path` | 必要时保存 HTML 归档路径 |
| `screenshot_path` | 必要时保存截图路径 |

### 抓取质量

| 字段 | 说明 |
|---|---|
| `fetch_status` | fetched-clean-text / summary-only / fetch-failed 等 |
| `extraction_quality` | high / medium / low / failed |
| `has_full_text` | 是否有可用全文 |
| `content_length` | 正文长度 |
| `full_text_hash` | `full_text` 的内容 hash，用于版本检测和证据完整性检查 |
| `fetch_error` | 抓取错误 |
| `source_volatility` | low / medium / high，说明来源内容是否容易变化或消失 |
| `community_name` | 社区、讨论区或高波动来源名称 |
| `capture_scope` | 抓到了什么范围 |
| `visible_range` | 抓取时可见范围说明 |
| `evidence_level` | 这条材料能作为多强证据 |
| `discovery_source` | 如 AI HOT 等发现源 |
| `discovery_record` | 聚合源发现记录 |
| `source_role` | primary_source / discovery_source |
| `origin_fetch_status` | 聚合源回抓原始页面结果 |
| `paywall_status` | none / suspected |
| `block_status` | none / suspected |
| `duplicate_status` | unique / duplicate |

`full_text` 和 `clean_text` 的职责不同：

- `full_text` 是证据底座，尽量完整保存原文可读正文、社区可见文本或聚合源 fallback 文本。
- `clean_text` 是分析入口，可做去噪、截断和结构化提取。
- Writer、卡片生成器和二搜补证优先回看 `full_text` / Markdown 快照，不得只看 Pool 摘要。

核心证据门槛：

```text
has_full_text = true
extraction_quality = high | medium
source_level = S | A | B
```

不满足时只能作为线索。不得直接支撑变化卡、案例卡、趋势报告、今日观察或商业内参中的事实判断。

观点卡使用另一套主证据门槛：必须证明“谁在何时何处说了什么”，至少保存人物 / title、原文链接、原文摘录或当时可见文本、发布时间、抓取时间和观察边界 / `capture_scope`。观点中的公司动作、客户采用、收入、融资、市场规模等事实主张，才需要另找 S/A/B 事实来源补证。

来源等级不是商业价值评分。S/A/B/C/D 只回答“这条材料作为事实依据是否可靠”，不回答“是否值得写”。M 只写入 `acquisition_source_level`，表示采集通道或发现入口。一条 C 级来源如果 `emerging_signal_score` 高，可以进入 Emerging Pool、User Feedback Pool 或 Watchlist；一条 S 级来源如果只是普通通稿、没有商业变化，也可以只建索引，不进入 Pool。

### 来源等级与采集通道

| 标记 | 定义 | 典型来源 | 允许用途 |
|---|---|---|---|
| S | 一手事实来源 | 官方博客、产品文档、API / SDK changelog、价格页、客户案例、合作公告、监管 / 采购 / 证券披露、官方 GitHub release / README、官方 HF / npm / PyPI 页面、小公司官网、创始人 / 高管 / 项目方原帖 | 事实主证据；仍需区分官方说法和真实客户采用 |
| A | 高质量转述 / 权威研究 | Reuters、Bloomberg、FT、WSJ、The Information、Axios、TechCrunch、权威研究机构、大学、CNCF、行业协会、投资机构深度研究、正式技术报告、会议论文、权威 benchmark | 事实证据；重要事件尽量回找 S |
| B | 行业 / 生态 / 垂直来源 | 垂直媒体、Crunchbase、Dealroom、PitchBook、YC / VC 公告、Product Hunt、非官方 HF / npm / PyPI / 云市场 / 插件市场榜单或评论、awesome list、生态地图、垂直报告 / newsletter | 辅助证据或早期信号；进入前台核心判断前最好补 S/A |
| C | 社区 / 社媒 / 聚合 / 讨论来源 | X、Reddit、HN、Discord、Telegram、GitHub Trending、AI newsletter 转述、二次搬运、论坛评论 | 讨论、反馈、痛点和早期热度；不能单独证明公司动作、客户采用、收入、融资或市场规模 |
| M | 混合获取通道 / 发现入口 | AI HOT、follow-builders、搜索聚合、自动化摘要源、RSS 聚合流、榜单聚合页 | 只用于 `acquisition_source_level`；必须回源后重新判定 `source_level=S/A/B/C/D` |
| D | 噪音或低可信来源 | 无来源搬运、标题党、纯 SEO、affiliate、与 AI 商业变化无关内容 | 降权、忽略或归档 |

创始人 / 高管 / 项目方原帖可以是 S 级一手来源，但如果来自 X 等高波动平台，必须同时标记 `source_volatility=high`，并保存当时可见文本、抓取时间和截图或快照。

arXiv 预印本必须标记 `research_status=preprint`，不能直接写成已经验证的行业结论。

## 2.1 高波动 / 社区 / 聚合来源处理

高波动来源不是天然失败，聚合来源不是核心证据。Raw 必须标清“抓到了什么、什么时候抓的、来自哪里、能作为多强证据”，不能因为来源类型粗暴写成 `summary_only` 或 `failed`。

### X / Reddit / HN 等社区来源

社区来源包括 X、Reddit、Hacker News、社群讨论、开发者论坛等。

如果成功抓到帖子正文、讨论串、评论或当时可见文本，必须保存：

- 当时可见文本
- 抓取时间
- 原始 URL
- 作者 / 社区 / 发布时间
- 可见范围
- 必要时的截图或 HTML 快照

并标记：

```yaml
source_volatility: high | medium
capture_scope: visible_text | thread_text | post_and_top_comments
evidence_level: community_signal | user_feedback_signal | supporting_evidence
```

只有在仅抓到标题、链接卡片、搜索摘要或第三方摘要，没有抓到正文时，才标记为：

```yaml
capture_scope: summary_only
evidence_level: weak_signal
```

只有页面无法访问、登录限制、权限阻断、反爬失败或无有效内容时，才标记为：

```yaml
fetch_status: blocked-* | timeout-* | fetch-failed-*
extraction_quality: failed
```

社区来源可以作为用户反馈、讨论升温、开发者阻力或早期信号，但不得单独作为公司事实和客户采用的核心证据。

### AI HOT 等聚合来源

AI HOT 是 `discovery_source`，不是正式事实来源。

每日生产中，AI HOT 是 Raw 主发现入口：系统默认拉取最近 24 小时 `mode=all` 全量，再用观澜关键词、类目和商业动作规则筛选进入 Raw Candidate。`industry`、`ai-products`、`ai-models` 可默认进入候选；`paper` 必须命中技术迭代词、商业动作、开发者生态词或明确应用场景才进入候选；`tip` 必须命中关键词、P0/P1 赛道词或商业动作，不能整池无差别入库。

系统必须优先从 AI HOT 提取 `origin_url` / `original_url`，回到原始页面抓取正文、快照、关键证据和结构化商业要素。

AI HOT 自身只保存 `discovery_record`：

```yaml
discovery_record:
  discovery_title:
  discovery_summary:
  source_name:
  origin_url:
  discovered_at:
  rank_on_page:
  discovery_status:
```

如果原始页面抓取成功，正式 Raw 记录以原始页面为准：

```yaml
discovery_source: AI HOT
source_role: primary_source
origin_fetch_status: success
```

这里的 `primary_source` 指正式 Raw 以回源后的原始页面为准，不表示 AI HOT 自身成为事实主证据。

如果原始页面抓取失败，才允许保存 AI HOT 当时可见文本作为 fallback：

```yaml
capture_scope: aihot_visible_text
source_role: discovery_source
evidence_level: discovery_only | weak_signal
origin_fetch_status: failed | blocked | paywalled | timeout
```

这类 fallback 不得作为案例库、变化库、今日观察或商业内参的核心证据，只能作为待补抓线索或弱趋势信号。

重要卡片强制回源补证：任何由 AI HOT 发现的变化卡、案例卡、趋势报告、今日观察段落或商业内参判断，在公开使用前必须至少回看原始 URL；有公开资料时必须补足 S/A/B 来源。AI HOT 标题、摘要和热度只能解释“为什么值得看”，不能单独解释“事实已经成立”。

### follow-builders 观点入口

follow-builders 每日全量进入前沿观点库。每条观点至少保存人物 / 来源、原文链接、当时可见文本、发布时间、抓取时间和观察边界 / `capture_scope`。

它的默认用途是：

- 观点卡
- 人物观点时间线
- 前沿观点聚合页
- 今日观察中的观点参照
- 趋势判断的观点分歧或验证线索

它的默认限制是：不作为公司动作、客户采用、收入、融资、市场规模或采购事实的主证据。若观点里包含事实主张，必须另行回源补证。

## 2.2 Keyword Search 多路搜索规则

`keyword-search` 不得只依赖 HN / Reddit / X 等社区来源。每次检索必须先判断 `search_intent`，再选择对应 `search_path`。

允许的 `search_intent`：

- `verify_company_action`
- `find_original_source`
- `find_startups`
- `find_customer_case`
- `find_workflow_change`
- `find_funding_signal`
- `find_developer_adoption`
- `find_user_feedback`
- `find_procurement_signal`
- `find_market_trend`

必须覆盖的 `search_path`：

- `official_original`：公司官网、官方博客、新闻稿、产品页、changelog、API / SDK 文档、价格页、客户案例、合作公告、上线公告。
- `developer_ecosystem`：GitHub、npm、PyPI、Hugging Face、Docker Hub、VS Code Marketplace、Chrome Web Store、云市场、插件市场。
- `capital_startup`：YC、VC 机构公告、Crunchbase、Dealroom、PitchBook、Tracxn、投资方公告、startup directory。
- `industry_landing`：垂直行业媒体、行业协会、行业报告、企业服务媒体、客户案例库、咨询公司行业报告。
- `procurement_marketplace`：政府采购公告、企业招投标、云市场、企业软件 marketplace、应用商店、招聘 JD。
- `a_media_gdelt`：Reuters、Bloomberg、FT、WSJ、The Information、Axios、TechCrunch、VentureBeat、CNBC、GDELT。
- `community_feedback`：HN、Reddit、X、Discord、Telegram、Product Hunt 评论、GitHub issues、YouTube 评论。

分流规则：

- S/A 结果进入 Raw 证据仓库，可用于 Evidence Pack。
- B 结果进入 Candidate Pool / Emerging Pool，必要时补证。
- C 结果进入 User Feedback Pool / Watchlist，只作为社区反馈或早期信号。
- M 结果只生成 `discovery_record`，必须回源 `origin_url` 后重新判定 `source_level=S/A/B/C/D`。

如果某次 keyword-search 只返回 HN / Reddit / X / 社区讨论结果，不得直接生成正式 Pool、案例卡、变化卡、趋势报告或今日观察，只能进入 Watchlist 或 User Feedback Pool。若其中存在明确人物 / 账号 / title / 原文表达，并满足观点证据门槛，可以进入前沿观点候选，但不得把其中事实主张当作已证实事实。

### 去重和版本

| 字段 | 说明 |
|---|---|
| `url_hash` | URL hash |
| `content_hash` | 正文 hash |
| `semantic_hash` | 标题 + 摘录语义 hash |
| `duplicate_of` | 重复指向 |
| `first_seen_at` | 首次发现时间 |
| `last_seen_at` | 最近发现时间 |
| `update_detected` | 是否检测到内容更新 |

## 3. 结构化摘录

`key_excerpts` 必须是结构化数组，不允许只放一段文本。

```yaml
key_excerpts:
  - type: company_action
    text: "公司做了什么"
    supports: [change, daily_observation, heatmap]
    importance: high
    confidence: medium
```

`type` 只允许：

- `company_action`
- `product_update`
- `number`
- `quote`
- `case_detail`
- `workflow_change`
- `funding`
- `risk`
- `opinion`

`supports` 只允许：

- `viewpoint`
- `case`
- `change`
- `trend`
- `daily_observation`
- `heatmap`

其中 `viewpoint` 是内部字段名，对应前台和栏目口径里的“前沿观点”。

## 4. 商业要素

Raw 入库时必须提取：

```yaml
business_elements:
  companies: []
  products: []
  people: []
  industries: []
  roles: []
  workflows: []
  business_actions: []
  affected_departments: []
  numbers: []
  quotes: []
```

这些字段不是前台文案。它们用于判断这条 Raw 能否支撑商业信号、案例、观点和趋势。

## 5. Evidence Seed

`evidence_seed` 保存后续 Evidence Pack 的初始材料：

```yaml
evidence_seed:
  company_actions: []
  case_details: []
  workflow_changes: []
  before_after_clues: []
  affected_roles: []
  risks_or_constraints: []
```

写卡片时必须优先使用这些种子。如果种子为空，不能在卡片里编造客户、流程、数字或人物观点。

## 6. 观澜初筛评分

每项 1-5 分：

```yaml
guanlan_scores:
  commercial_value: 1
  novelty: 1
  evidence_strength: 1
  case_richness: 1
  trend_relevance: 1
  guanlan_relevance: 1
  emerging_signal_score: 1
```

评分只决定分流，不对外展示。评分低不代表删除；可能只保存索引和快照，不进入重加工。

`emerging_signal_score` 专门用于保留早期信号和社区反馈。它不受 S/A/B 直接压制：C 级来源如果出现高密度讨论、真实用户反馈、新公司、新开源项目、早期融资或开发者采用线索，可以进入 Emerging Pool、User Feedback Pool 或 Watchlist，但不能直接作为事实主证据。

## 7. 可用方向

`usable_for` 使用布尔对象：

```yaml
usable_for:
  viewpoint: false
  case: false
  change: false
  trend: false
  daily_observation: false
  heatmap: true
  briefing: false
  emerging_pool: false
  user_feedback_pool: false
  watchlist: false
```

规则：

- `viewpoint` 需要明确人物 / 账号 / title / 原文表达。
- `case` 需要具体公司、客户、流程或部署细节。
- `change` 需要可描述的公司动作、产品更新、流程变化、风险或商业动作。
- `trend` 需要可与其他 Raw / 卡片聚合，不由单条材料直接生成。
- `daily_observation` 需要能服务当天主问题。
- `heatmap` 可接纳弱线索，但必须保留质量标记。
- `briefing` 需要周期复盘价值。
- `emerging_pool` 接纳早期高潜线索，允许 C 级来源进入，但必须标清待补证。
- `user_feedback_pool` 接纳社区反馈、开发者阻力、客户痛点和讨论升温。
- `watchlist` 接纳值得继续看的线索，不等于可以写成前台事实。

## 7.1 Pool 分流

`pool_routes` 使用数组记录 Raw 进入哪类候选池：

```yaml
pool_routes:
  - emerging_pool
  - watchlist
```

允许值：

- `core_pool`
- `emerging_pool`
- `user_feedback_pool`
- `watchlist`
- `index_only`
- `discard`

分流规则：

- `core_pool` 需要 S/A/B、可用全文、抽取质量 high / medium，并且有明确商业变化。
- `emerging_pool` 可以接纳 C 级或 B 级早期线索，但需要 `emerging_signal_score >= 4`。
- `user_feedback_pool` 可以接纳 HN / Reddit / X / issue / forum 中的真实反馈和讨论升温。
- `watchlist` 保存值得继续跟踪但证据不足的材料。
- `index_only` 只建索引和快照。
- `discard` 只用于低价值、重复、失败或明显噪音。

## 8. 缺失信息

`missing_information` 必须记录证据缺口，例如：

- 没有明确公司或机构主体
- 没有具体客户或真实企业案例
- 没有变化前后流程线索
- 没有成本、收入、采用率或市场规模数字
- 没有可核验原文引述
- 缺少一手来源或可靠转述来源
- 没有可用全文快照

后续 Writer 和卡片生成器必须尊重缺口。缺口没有补齐前，只能写“暂无公开信息”或“暂未监测到同类案例”。

## 9. Raw 状态

`raw_status` 只允许：

- `indexed`：只建索引和快照。
- `candidate`：可进入候选重加工。
- `pooled`：已进入 Pool。
- `asset_used`：已被变化卡 / 案例卡 / 观点卡 / 趋势卡使用。
- `archived`：保留归档，不再主动加工。
- `ignored`：低价值或抓取失败，只保留最低限度记录。

默认不要让所有 Raw 进入重加工链路。

## 10. 下游使用规则

- Pool 必须携带 `raw_ref`、`raw_archive`、`raw_json`、`extraction_quality`、`has_full_text`、`full_text_hash`、`usable_for`、`pool_routes`、`evidence_seed`、`missing_information`。
- 变化卡 / 案例卡 / 趋势报告 / 今日观察 / 商业内参里的事实判断，只能把满足核心证据门槛的 Raw 作为主证据。
- 观点卡的主证据是观点原文和人物来源；观点里的事实主张必须另行补 S/A/B 来源。
- C 级或 discovery 来源可以触发检索，但不得单独作为事实主证据。
- 每日观察可以使用 Raw 全局分布形成市场温度，但具体事实必须回到 Raw 证据或二搜 S/A/B 来源。
- 商业内参必须复盘周期内 Raw / Pool / Asset 的变化，不照搬每日观察。
- AI 商业热力图可使用弱信号，但必须展示为热度和待证状态，不写成事实结论。
