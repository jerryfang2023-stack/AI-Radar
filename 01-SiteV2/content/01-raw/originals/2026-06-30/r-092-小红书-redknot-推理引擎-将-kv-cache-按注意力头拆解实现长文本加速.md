---
schema_version: raw-evidence-v2
raw_id: R-092
title: "小红书 RedKnot 推理引擎：将 KV Cache 按注意力头拆解实现长文本加速"
original_url: ""
canonical_url: ""
source_name: "公众号：小红书技术（dots.llm）"
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
collected_at: 2026-06-30T02:26:24.895Z
language: mixed
full_text_hash: 394528ad6624bd6f
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-30/r-092-小红书-redknot-推理引擎-将-kv-cache-按注意力头拆解实现长文本加速.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-30/r-092-小红书-redknot-推理引擎-将-kv-cache-按注意力头拆解实现长文本加速.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: no-url-summary-only
extraction_quality: failed
extraction_method: "no_url_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"no_url_summary_fallback"}
has_full_text: false
content_length: 245
fetch_error: ""
raw_qc_decision: block
raw_qc_downstream_use: not_allowed
degradation_reasons: ["index_only_or_directory_page","missing_full_text","missing_snapshot"]
evidence_completeness: {"original_url_status":"missing","full_text_status":"missing_or_summary_only","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"394528ad6624bd6f","missing":["missing_original_url","missing_full_text","missing_snapshot"]}
source_volatility: medium
community_name: ""
capture_scope: summary_only
visible_range: "采集通道提供的标题与摘要"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"小红书 RedKnot 推理引擎：将 KV Cache 按注意力头拆解实现长文本加速","discovery_summary":"RedKnot 将 KV Cache 沿注意力头维度拆解，通过头分类稀疏（局部头占 83.4%–96.8%）、稀疏 FFN 和 SegPagedAttention 三个机制统一算法与存储粒度。在 8 卡 H800 上，TTFT 最高加速 1.6–3.54×，单卡并发提升 4.7–7.8×，预填充 FLOPs 削减 67%–79.5%。DeepSeek-V4-Flash 上 128K 上下文 TTFT 加速达 5.16×，KV 传输最多省 6.3×。精度通常不低于稠密 F1 的 95%。","source_name":"公众号：小红书技术（dots.llm）","origin_url":"","discovered_at":"2026-06-30T02:08:01.948Z","rank_on_page":4,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "summary_only"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: e3b0c44298fc1c14
content_hash: 394528ad6624bd6f
semantic_hash: 819f79918689b37b
duplicate_of: ""
first_seen_at: "2026-06-30T02:26:24.895Z"
last_seen_at: 2026-06-30T02:26:24.895Z
update_detected: false
raw_status: ignored
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":4,"importance_reason":"technical trend or capability shift; rubric=4 concrete important change","supporting_signals":[],"novelty":3,"evidence_strength":2,"case_richness":4,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":2}
business_elements: {"companies":["公众号","小红书技术（dots.llm）"],"products":[],"people":[],"industries":[],"roles":[],"workflows":[],"business_actions":[],"affected_departments":[],"numbers":["83.4%","96.8%","8","800","1.6","3.54","4.7","7.8"],"quotes":[]}
evidence_seed: {"company_actions":["RedKnot 将 KV Cache 沿注意力头维度拆解，通过头分类稀疏（局部头占 83.","在 8 卡 H800 上，TTFT 最高加速 1.","DeepSeek-V4-Flash 上 128K 上下文 TTFT 加速达 5."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例","没有变化前后流程线索","没有可用全文快照"]
key_excerpts: [{"type":"number","text":"RedKnot 将 KV Cache 沿注意力头维度拆解，通过头分类稀疏（局部头占 83.4%–96.8%）、稀疏 FFN 和 SegPagedAttention 三个机制统一算法与存储粒度。在 8 卡 H800 上，TTFT 最高加速 1.6–3.54×，单卡并发提升 4.7–7.8×，预填充 FLOPs 削减 67%–79.5%。DeepSeek-V4-Flash 上 128K 上下文 TTFT 加速达 5.16×，KV 传输最多省 6.3×。精度通常不低于稠密 F1 的 95%。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"RedKnot 将 KV Cache 沿注意力头维度拆解，通过头分类稀疏（局部头占 83.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"number","text":"8%）、稀疏 FFN 和 SegPagedAttention 三个机制统一算法与存储粒度。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"在 8 卡 H800 上，TTFT 最高加速 1.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"number","text":"8×，预填充 FLOPs 削减 67%–79.","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"DeepSeek-V4-Flash 上 128K 上下文 TTFT 加速达 5.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# 小红书 RedKnot 推理引擎：将 KV Cache 按注意力头拆解实现长文本加速

## clean_text

RedKnot 将 KV Cache 沿注意力头维度拆解，通过头分类稀疏（局部头占 83.4%–96.8%）、稀疏 FFN 和 SegPagedAttention 三个机制统一算法与存储粒度。在 8 卡 H800 上，TTFT 最高加速 1.6–3.54×，单卡并发提升 4.7–7.8×，预填充 FLOPs 削减 67%–79.5%。DeepSeek-V4-Flash 上 128K 上下文 TTFT 加速达 5.16×，KV 传输最多省 6.3×。精度通常不低于稠密 F1 的 95%。

## full_text

RedKnot 将 KV Cache 沿注意力头维度拆解，通过头分类稀疏（局部头占 83.4%–96.8%）、稀疏 FFN 和 SegPagedAttention 三个机制统一算法与存储粒度。在 8 卡 H800 上，TTFT 最高加速 1.6–3.54×，单卡并发提升 4.7–7.8×，预填充 FLOPs 削减 67%–79.5%。DeepSeek-V4-Flash 上 128K 上下文 TTFT 加速达 5.16×，KV 传输最多省 6.3×。精度通常不低于稠密 F1 的 95%。

## extraction_diagnostics

- extraction_method: no_url_summary_fallback
- readability_score: 0
- fetch_status: no-url-summary-only
- extraction_quality: failed
- diagnostics: {"method":"no_url_summary_fallback"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   RedKnot 将 KV Cache 沿注意力头维度拆解，通过头分类稀疏（局部头占 83.4%–96.8%）、稀疏 FFN 和 SegPagedAttention 三个机制统一算法与存储粒度。在 8 卡 H800 上，TTFT 最高加速 1.6–3.54×，单卡并发提升 4.7–7.8×，预填充 FLOPs 削减 67%–79.5%。DeepSeek-V4-Flash 上 128K 上下文 TTFT 加速达 5.16×，KV 传输最多省 6.3×。精度通常不低于稠密 F1 的 95%。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   RedKnot 将 KV Cache 沿注意力头维度拆解，通过头分类稀疏（局部头占 83.

3. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   8%）、稀疏 FFN 和 SegPagedAttention 三个机制统一算法与存储粒度。

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   在 8 卡 H800 上，TTFT 最高加速 1.

5. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   8×，预填充 FLOPs 削减 67%–79.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   DeepSeek-V4-Flash 上 128K 上下文 TTFT 加速达 5.

## business_elements

- companies: 公众号, 小红书技术（dots.llm）
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: 暂无公开信息
- numbers: 83.4%, 96.8%, 8, 800, 1.6, 3.54, 4.7, 7.8
- quotes: 暂无公开信息

## evidence_seed

- company_actions: RedKnot 将 KV Cache 沿注意力头维度拆解，通过头分类稀疏（局部头占 83. / 在 8 卡 H800 上，TTFT 最高加速 1. / DeepSeek-V4-Flash 上 128K 上下文 TTFT 加速达 5.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_technical_trend
- importance_score: 4
- importance_reason: technical trend or capability shift; rubric=4 concrete important change
- supporting_signals: 
- novelty: 3
- evidence_strength: 2
- case_richness: 4
- trend_relevance: 5
- guanlan_relevance: 4
- emerging_signal_score: 2

## usable_for

- viewpoint: false
- case: false
- business_change: false
- relationship_graph_input: false
- trend_candidate_context: false
- signal_card_candidate: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势
- 疑似官网首页、产品目录或导航页，只能索引留存
- 没有具体客户或真实企业案例
- 没有变化前后流程线索
- 没有可用全文快照

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: summary_only
- visible_range: 采集通道提供的标题与摘要
- evidence_level: discovery_only
- discovery_source: AI HOT
- source_role: discovery_source
- origin_fetch_status: summary_only
- discovery_record: {"discovery_title":"小红书 RedKnot 推理引擎：将 KV Cache 按注意力头拆解实现长文本加速","discovery_summary":"RedKnot 将 KV Cache 沿注意力头维度拆解，通过头分类稀疏（局部头占 83.4%–96.8%）、稀疏 FFN 和 SegPagedAttention 三个机制统一算法与存储粒度。在 8 卡 H800 上，TTFT 最高加速 1.6–3.54×，单卡并发提升 4.7–7.8×，预填充 FLOPs 削减 67%–79.5%。DeepSeek-V4-Flash 上 128K 上下文 TTFT 加速达 5.16×，KV 传输最多省 6.3×。精度通常不低于稠密 F1 的 95%。","source_name":"公众号：小红书技术（dots.llm）","origin_url":"","discovered_at":"2026-06-30T02:08:01.948Z","rank_on_page":4,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

RedKnot 将 KV Cache 沿注意力头维度拆解，通过头分类稀疏（局部头占 83.4%–96.8%）、稀疏 FFN 和 SegPagedAttention 三个机制统一算法与存储粒度。在 8 卡 H800 上，TTFT 最高加速 1.6–3.54×，单卡并发提升 4.7–7.8×，预填充 FLOPs 削减 67%–79.5%。DeepSeek-V4-Flash 上 128K 上下文 TTFT 加速达 5.16×，KV 传输最多省 6.3×。精度通常不低于稠密 F1 的 95%。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
