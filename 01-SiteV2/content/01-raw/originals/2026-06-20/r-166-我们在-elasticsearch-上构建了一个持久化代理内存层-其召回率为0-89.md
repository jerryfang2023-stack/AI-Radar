---
schema_version: raw-evidence-v2
raw_id: R-166
title: "我们在 Elasticsearch 上构建了一个持久化代理内存层，其召回率为0.89"
original_url: ""
canonical_url: ""
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: official_index_or_directory
evidence_object_usable: false
event_evidence: false
index_only_evidence: true
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: ""
collected_at: 2026-06-20T05:50:42.271Z
language: mixed
full_text_hash: 1ecc8f439778fc53
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-20/r-166-我们在-elasticsearch-上构建了一个持久化代理内存层-其召回率为0-89.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-20/r-166-我们在-elasticsearch-上构建了一个持久化代理内存层-其召回率为0-89.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: no-url-summary-only
extraction_quality: failed
extraction_method: "no_url_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"no_url_summary_fallback"}
has_full_text: false
content_length: 207
fetch_error: ""
raw_qc_decision: block
raw_qc_downstream_use: not_allowed
degradation_reasons: ["index_only_or_directory_page","missing_full_text","missing_snapshot","discovery_or_feedback_source_boundary"]
evidence_completeness: {"original_url_status":"missing","full_text_status":"missing_or_summary_only","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"1ecc8f439778fc53","missing":["missing_original_url","missing_full_text","missing_snapshot"]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: summary_only
visible_range: "采集通道提供的标题与摘要"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"我们在 Elasticsearch 上构建了一个持久化代理内存层，其召回率为0.89","discovery_summary":"Agent Builder 正式上市（GA）。基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。在 168 道 QA 题评估中，R@10 平均 0.89，零跨租户泄漏。该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"","discovered_at":"2026-06-20T05:46:00.206Z","rank_on_page":13,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "summary_only"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: e3b0c44298fc1c14
content_hash: 1ecc8f439778fc53
semantic_hash: df306cababd844eb
duplicate_of: ""
first_seen_at: "2026-06-20T05:50:42.271Z"
last_seen_at: 2026-06-20T05:50:42.271Z
update_detected: false
raw_status: ignored
usable_for: {"viewpoint":false,"case":false,"change":false,"trend":false,"daily_observation":false,"heatmap":false,"briefing":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":4,"importance_reason":"technical trend or capability shift; rubric=4 concrete important change","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":2,"case_richness":4,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":3}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","GitHub"],"products":["Agent","MCP"],"people":[],"industries":[],"roles":[],"workflows":[],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["0.89","25","5","168","10"],"quotes":[]}
evidence_seed: {"company_actions":["Agent Builder 正式上市（GA）。","基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。","在 168 道 QA 题评估中，R@10 平均 0."],"case_details":["Agent Builder 正式上市（GA）。基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。在 168 道 QA 题评估中，R@10 平均 0.89，零跨租户泄漏。该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。","召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。","该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。"],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存","没有变化前后流程线索","没有可用全文快照"]
key_excerpts: [{"type":"case_detail","text":"Agent Builder 正式上市（GA）。基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。在 168 道 QA 题评估中，R@10 平均 0.89，零跨租户泄漏。该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"Agent Builder 正式上市（GA）。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"case_detail","text":"召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"在 168 道 QA 题评估中，R@10 平均 0.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"case_detail","text":"该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# 我们在 Elasticsearch 上构建了一个持久化代理内存层，其召回率为0.89

## clean_text

Agent Builder 正式上市（GA）。基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。在 168 道 QA 题评估中，R@10 平均 0.89，零跨租户泄漏。该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。

## full_text

Agent Builder 正式上市（GA）。基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。在 168 道 QA 题评估中，R@10 平均 0.89，零跨租户泄漏。该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。

## extraction_diagnostics

- extraction_method: no_url_summary_fallback
- readability_score: 0
- fetch_status: no-url-summary-only
- extraction_quality: failed
- diagnostics: {"method":"no_url_summary_fallback"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=medium
   Agent Builder 正式上市（GA）。基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。在 168 道 QA 题评估中，R@10 平均 0.89，零跨租户泄漏。该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   Agent Builder 正式上市（GA）。

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。

4. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=medium
   召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   在 168 道 QA 题评估中，R@10 平均 0.

6. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=medium
   该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, GitHub
- products: Agent, MCP
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 0.89, 25, 5, 168, 10
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Agent Builder 正式上市（GA）。 / 基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。 / 在 168 道 QA 题评估中，R@10 平均 0.
- case_details: Agent Builder 正式上市（GA）。基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。在 168 道 QA 题评估中，R@10 平均 0.89，零跨租户泄漏。该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。 / 召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。 / 该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_technical_trend
- importance_score: 4
- importance_reason: technical trend or capability shift; rubric=4 concrete important change
- supporting_signals: adoption_context
- novelty: 3
- evidence_strength: 2
- case_richness: 4
- trend_relevance: 5
- guanlan_relevance: 4
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: false
- change: false
- trend: false
- daily_observation: false
- heatmap: false
- briefing: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 疑似官网首页、产品目录或导航页，只能索引留存
- 没有变化前后流程线索
- 没有可用全文快照

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News 热门（buzzing.cc 中文翻译）
- capture_scope: summary_only
- visible_range: 采集通道提供的标题与摘要
- evidence_level: discovery_only
- discovery_source: AI HOT
- source_role: discovery_source
- origin_fetch_status: summary_only
- discovery_record: {"discovery_title":"我们在 Elasticsearch 上构建了一个持久化代理内存层，其召回率为0.89","discovery_summary":"Agent Builder 正式上市（GA）。基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。在 168 道 QA 题评估中，R@10 平均 0.89，零跨租户泄漏。该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"","discovered_at":"2026-06-20T05:46:00.206Z","rank_on_page":13,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Agent Builder 正式上市（GA）。基于 Elasticsearch 的持久化内存层将记忆分为情景、语义、程序三类，分别存入独立索引，各设不同写速率与过期规则。召回采用 BM25 与 Jina v5 稠密向量的 RRF 融合，再经交叉编码器重排序。在 168 道 QA 题评估中，R@10 平均 0.89，零跨租户泄漏。该层可通过支持 MCP 协议的客户端访问，不绑定特定运行时，已开源至 GitHub。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
