---
title: Daily Monitoring Minimal Context
date: 2026-05-22
status: active-v2.2
owner: intelligence-engine / product-commander
---

# Daily Monitoring Minimal Context

本文件是每日监测 / Raw / Pool 任务的最小上下文。详细字段和分流规则见 `agent-workflow/product/evidence-and-routing-rules.md`。

每日监测属于高风险流程，执行、修复或验收时必须同时套用 `context/06-execution-harness.md` 的每日监测 Harness。

## 1. 任务边界

每日监测只产出：

- Raw candidates。
- Pool candidates。
- follow-builders 前沿观点候选。
- 监测日志。
- 质量门报告。
- QC 所需材料。

不写今日观察，不生成卡片，不同步网站，不推送 GitHub，不部署 Netlify。

Source Layer Governance includes Raw-to-Pool routing governance.

Raw-to-Pool 属于本流程；Pool-to-Content 属于下一个流程。

## 2. 必读

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `context/06-execution-harness.md`
4. `skills/guanlan-daily-monitor/SKILL.md`
5. `skills/guanlan-monitor-quality-gate/SKILL.md`
6. `skills/guanlan-daily-monitor-qc/SKILL.md`

按需读取：

- `agent-workflow/product/evidence-and-routing-rules.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/daily-monitoring-playbook.md`

## 3. 数量目标

- Raw 正常目标：80-150。
- Raw 不固定为 100。
- Raw 降级区间：50-80，必须写明低信号、源失败或补采受限原因。
- Raw 低于 50：默认阻断下游，除非 QC 明确降级允许。
- Pool 目标：20-40。

## 4. 六类重要性覆盖

每日必须覆盖：

- `important_case`：重要案例。
- `important_funding`：重要融资事件。
- `important_technical_trend`：重要技术趋势。
- `important_product_or_service`：重要产品和服务产生。
- `important_vertical_solution`：重要垂直行业解决方案。
- `important_viewpoint_or_article`：影响行业的重要发言、观点或文章。

缺任一类必须补采或标记 `importance_coverage_gap`。不得用弱页面、首页、目录、SEO、入口摘要或社区反馈硬填。

## 5. 来源类型

`S/A/B/C/D/M` 只表示来源类型、证据角色和使用边界，不是内容价值评级。

- S：海外一手事件或变化源。
- A：高质量报道、研究、分析师或权威数据库。
- B：垂直行业、融资、生态、创业公司、VC、Product Hunt、GitHub release、行业 newsletter。
- C：社区、观点、反馈、讨论。
- D：噪音、SEO、无事件页面。
- M：采集入口，如 AI HOT、follow-builders、HN、RSS、搜索聚合。

内容价值只来自六类重要性：重要案例、重要融资事件、重要技术趋势、重要产品和服务产生、重要垂直行业解决方案、影响行业的重要发言 / 观点 / 文章。

## 6. 精选入口

AI HOT daily 是每日精选：

- 全量保留。
- 提高采集权重。
- 不自动进入 `core_pool`。
- 不作为事实主证据。

follow-builders 是精选 Builder 入口：

- 全量扫描。
- 提高采集权重。
- 默认先进入 `opinion_intake`。
- `opinion_intake` 入库时必须同步写入中文翻译；翻译失败时标记 `translation_status: pending_translation`，不得进入前台。
- 来自 X / Twitter 的观点必须抓取当时可见全文，`capture_scope` 标记为 `x_full_visible_text`，入库时保留全文原文并生成全文中文翻译；前台详情页展示全文原文和全文译文，列表页只允许做预览截短。
- 只证明“谁说了什么”，不证明公司事实。
- 每日监测只产出前沿观点候选，不给出前台展示结论；是否进入前台必须等资产链执行观点卡四档评级。

HN / Reddit / X 只作为社区反馈补充，不得成为搜索主体。

## 7. S 与 B 的边界

S 只看海外一手事件源。

不得判为 S：

- 国内厂商官网或 SEO 页面。
- 官网首页。
- 产品页、Demo 页、产品目录。
- 文档首页、API / SDK 目录。
- 价格导航页。
- README / repo index。
- 包页 / 模型页。
- 控制台、登录页、搜索结果页。

百度、阿里云、腾讯云、华为云、火山引擎等国内官网默认不作为 S。

B 类有原文即可采信，不需要强制回到 S/A 补证。但 B 类也必须有具体变化，只有公司介绍、项目页、包页、模型页、榜单或目录时，只能 `index_only` / `watchlist`。

## 8. Raw-to-Pool 算法

分流顺序：

1. 区分原始事实来源 `source_level` 和采集入口 `acquisition_source_level=M`。
2. 页面类型硬降级；首页、目录、README、包页、模型页、搜索结果、SEO 页默认 `index_only`。
3. 核心证据门槛；`core_pool` 必须有原始 URL、可读全文、高/中质量抽取、`extraction_method`、`readability_score>=24`、非 index 证据对象、content hash、full text hash 和关键摘录。
4. 内容价值评分；价值来自六类重要性，不来自 S/A/B 层级、采集入口、采购、预算、收入、成本、监管、诉讼、合规或风险材料。
5. 早期但证据不足进入 `emerging_pool` 或 `watchlist`。
6. HN / Reddit / X / issue / forum 进入 `user_feedback_pool`，不能单独证明公司事实。
7. AI HOT daily 和 follow-builders 可提高候选优先级，但必须过证据门才能进入 `core_pool`。
8. 分流后检查六类 `importance_type` 覆盖。

`importance_score` 采用 1-5 分：

- 1-2：归档、索引或 supporting context。
- 3：潜在线索，不能进入 `core_pool`。
- 4：六类重要性之一的明确重要变化。
- 5：平台级、头部客户、知名机构、前沿能力、行业路线或高影响判断变化。

重大监管、诉讼、合规、安全、隐私和风险事件只有在改变行业采用、治理路径、部署节奏或商业判断时，才可升级为重要信号。

## 8.1 Raw 抓取层字段

每日监测脚本会自动尝试抓取原文，并按以下顺序抽取正文：`article/main`、内容容器、JSON-LD、meta description、普通可见文本。

Raw / Pool 必须保留以下抓取诊断字段：

- `extraction_method`：本次正文来自 article、main、content-container、json-ld、plain-text、meta fallback 或失败 fallback。
- `readability_score`：正文可读性评分；`core_pool` 默认要求不低于 24。
- `extractor_diagnostics`：段落数、句子数、样板噪音、符号比例等诊断信息。

`has_full_text=true` 只表示抓到可读正文，不代表自动进入 `core_pool`。如果 `full_text` 主要是导航、登录、订阅、评论加载、目录或 fallback 摘要，应按 `readability_score` 和页面类型降级。

降级上限：

- `missing_full_text` / `missing_snapshot`：最高 `watchlist` 或 `index_only`。
- `missing_hash` / `missing_excerpt`：最高 `watchlist`。
- `index_only_or_directory_page`：最高 `index_only`。
- `discovery_or_feedback_source_boundary`：社区材料最高 `user_feedback_pool`；聚合入口最高 `index_only`，除非回源成功。
- `raw_qc_decision=block`：`discard`；AI HOT daily selected 可保留为 `index_only`，但不得下游使用。

Pool 健康度必须拆分：

- `pool_index_count`
- `routed_pool_count`
- `core_pool_count`
- `index_only_pool_count`
- `aihot_index_only_count`
- `aihot_core_count`

不得只用 `pool_count` 判断 Pool 是否健康。

## 9. 硬降级页面

以下页面默认 `index_only`：

- 官网首页。
- 产品 / Demo 页。
- 产品目录。
- 文档 / API / SDK 目录。
- 价格导航。
- GitHub README / repo index。
- Hugging Face / npm / PyPI 包页或模型页。
- Marketplace listing。
- 控制台 / 登录页。
- 搜索结果页。
- AI 工具导航页。
- 中文 SEO 页。

只有同一页面包含明确日期、主体、可核验事实或完整观点正文时，才允许重新判断。

## 10. 放行

`guanlan-monitor-quality-gate` 是脚本预闸门。

最终下游放行看 `guanlan-daily-monitor-qc`：

- `allow`
- `allow_with_degradation`
- `block`

任一 P0 blocker 触发时，下游暂停。

## 11. Layered Search Provider Sync

Current daily monitoring uses layered search providers when configured by local environment variables:

```text
semantic keyword discovery: Anysearch -> Tavily -> Exa -> DuckDuckGo -> Bing fallback
A-media / news verification: GDELT -> Anysearch -> Tavily / Exa -> DuckDuckGo / Bing fallback
```

Provider keys are local secrets and must not be committed. Supported local env names:

```text
TAVILY_API_KEY
EXA_API_KEY
ANYSEARCH_API_KEY
```

All search providers are discovery entrances only. A result from Anysearch, Tavily, Exa, GDELT, DuckDuckGo or Bing cannot enter `core_pool` unless it resolves to original evidence, passes Raw QC, passes page-type checks, and matches one of the six `importance_type` lanes with `importance_score >= 4`.

Tavily / Exa / AnySearch / GDELT results must normalize provider date fields into `published_at` before freshness comparison. Search results are deduped across provider entrances by canonical URL plus a title/date fingerprint, with extra attention to Reuters, financing-wire posts, product pages and company announcements.

NewsAPI is retired from the current monitoring path. Do not add `NEWSAPI_KEY` back to the active environment checklist, provider config or QC expectations unless there is a future explicit replacement decision.

Duplicate provider hits are merged before Raw selection. The kept record should prefer usable original URL, valid `published_at`, longer snippet/full-text lead and higher-source reliability; merged records should be traceable through `duplicate_status=merged_provider_duplicates` or equivalent notes.

Pool-to-Card rule: once a fact item is eligible `core_pool` with `raw_qc_decision=allow`, it should generate a frontstage business signal card by default. `important_viewpoint_or_article` must go through the opinion-card path instead of being auto-converted into a fact signal. Do not use a separate daily card cap after fact `core_pool`; if a fact result should not appear publicly, fix the Raw-to-Pool routing instead of silently dropping it in card generation.

V3.1.1 downstream handoff rule: Raw / Pool must preserve enough source material for Card, opinion, trend and relationship modules to go back to the original source. Keep Raw `full_text` / `clean_text`, Raw `key_excerpts`, Raw or Pool `evidence_seed`, source URL, source name, publish date, and `missing_information`. Do not let downstream frontstage fields depend on AI HOT summaries, search snippets, `business_elements`, tag explanations, `why_selected`, `business_meaning`, `watch_reason` or other generated summaries. If original text, key excerpts or evidence seed are missing, downgrade or mark the gap in monitoring instead of leaving the asset chain to fill it with copy.

## 12. Lane Volume Backfill Rule

Six-lane Raw volume guardrail:

```text
Raw minimum per required importance type: 3
Raw target per required importance type: 5
Pool minimum per required importance type: 1
Core Pool maximum per required importance type: 3
Core Pool force fill: false
```

If a lane has fewer than 3 Raw candidates, run lane-specific backfill before judging Pool health. Do not lower Pool or Core Pool evidence gates because Raw is small.

## 13. 前沿观点候选下游边界

follow-builders / 社区材料先入 `opinion_intake`，入库时必须保留原文或当时可见摘录，并写入 `frontend.originalTranslation` 或等价中文翻译字段。来自 X / Twitter 的材料不得只保留摘录：必须保留当时可见全文、全文中文翻译和 `x_full_visible_text` 抓取范围。生成正式观点卡前，必须补齐 `opinion_tier`、`display_lane`、`selection_reason`、`opinion_rating_score`、`opinion_rating_version`、`publish_status` 和翻译状态。

页面展示规则：列表页、首页模块、侧栏和卡片预览可以为了版面截短中文翻译；观点详情页和人物详情页必须展示已入库的完整中文翻译，不得用前台版式限制、预览长度或摘要字段替代完整译文。

观点卡四档为：

- `feature`：可进入今日观察主推观点。
- `sidebar`：可进入商业信号页观点模块。
- `archive`：仅知识库归档，不进入前台。
- `discard`：隐藏或后续清理。

`feature` 与 `sidebar` 都可以形成正式 `opinion_card`；其中 `feature` 进入 `daily_feature`，`sidebar` 进入 `signal_sidebar`。未评级、缺中文翻译、`archive` 或 `discard` 观点卡不得进入前台同步。观点卡仍然只能证明“谁在何时何处说了什么”，不能替代公司事实证据。

Opinion-card duplicate handling: before rating and frontstage sync, merge cards that share `canonical_url`, `original_url` or `source_url`. Keep the card with the best frontstage tier, rating score, manual-review status and translation completeness; move duplicate files to `01-SiteV2/knowledge/99-Archive/Opinion-Duplicates/<date>/`; write `merged_duplicate_count`, `merged_duplicate_refs` and a body merge note into the keeper.
