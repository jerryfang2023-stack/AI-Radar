---
schema_version: raw-evidence-v2
raw_id: R-076
title: "小红书发布大模型新架构 PIPO"
title_zh: "小红书发布大模型新架构 PIPO"
title_translation_status: not_required
title_translation_method: source_title
original_url: ""
canonical_url: ""
source_name: "公众号：小红书技术（dots.llm）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: case_or_customer
evidence_object_usable: false
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: ""
collected_at: 2026-07-11T04:06:43.472Z
language: mixed
full_text_hash: 3c7dfa96b7ab061d
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-11/r-076-小红书发布大模型新架构-pipo.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-11/r-076-小红书发布大模型新架构-pipo.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: no-url-summary-only
extraction_quality: failed
extraction_method: "no_url_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"no_url_summary_fallback"}
has_full_text: false
content_length: 265
fetch_error: ""
evidence_strength: blocked
raw_qc_decision: block
raw_qc_downstream_use: not_allowed
degradation_reasons: ["index_only_or_directory_page","missing_full_text","missing_snapshot"]
evidence_completeness: {"original_url_status":"missing","full_text_status":"missing_or_summary_only","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"3c7dfa96b7ab061d","missing":["missing_original_url","missing_full_text","missing_snapshot"]}
source_volatility: medium
community_name: ""
capture_scope: summary_only
visible_range: "采集通道提供的标题与摘要"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"小红书发布大模型新架构 PIPO","discovery_summary":"小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。基于 Qwen3.5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.15 pass@4 提升。部署测评中，TTFT 加速约 1.23×，TPOT 加速约 1.86×。训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。","source_name":"公众号：小红书技术（dots.llm）","origin_url":"","discovered_at":"2026-07-11T03:57:19.020Z","rank_on_page":11,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "summary_only"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: e3b0c44298fc1c14
content_hash: 3c7dfa96b7ab061d
semantic_hash: d361f84221fae4d3
duplicate_of: ""
first_seen_at: "2026-07-11T04:06:43.472Z"
last_seen_at: 2026-07-11T04:06:43.472Z
update_detected: false
raw_status: ignored
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":4,"importance_reason":"new product or service; rubric=4 concrete important change","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":2,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":2}
business_elements: {"companies":["公众号","小红书技术（dots.llm）"],"products":[],"people":[],"industries":[],"roles":[],"workflows":["部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":[],"numbers":["3.5","4B","9B","2025","7.15","4","1.23","1.86"],"quotes":[]}
evidence_seed: {"company_actions":["小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。","5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7."],"case_details":["小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。基于 Qwen3.5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.15 pass@4 提升。部署测评中，TTFT 加速约 1.23×，TPOT 加速约 1.86×。训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。","训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。"],"workflow_changes":[],"before_after_clues":["可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存","没有可用全文快照"]
key_excerpts: [{"type":"case_detail","text":"小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。基于 Qwen3.5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.15 pass@4 提升。部署测评中，TTFT 加速约 1.23×，TPOT 加速约 1.86×。训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"case_detail","text":"训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-11T04:06:43.472Z
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# 小红书发布大模型新架构 PIPO

## clean_text

小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。基于 Qwen3.5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.15 pass@4 提升。部署测评中，TTFT 加速约 1.23×，TPOT 加速约 1.86×。训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。

## full_text

小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。基于 Qwen3.5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.15 pass@4 提升。部署测评中，TTFT 加速约 1.23×，TPOT 加速约 1.86×。训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。

## extraction_diagnostics

- extraction_method: no_url_summary_fallback
- readability_score: 0
- fetch_status: no-url-summary-only
- extraction_quality: failed
- diagnostics: {"method":"no_url_summary_fallback"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=medium
   小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。基于 Qwen3.5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.15 pass@4 提升。部署测评中，TTFT 加速约 1.23×，TPOT 加速约 1.86×。训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.

4. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=medium
   训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。

## business_elements

- companies: 公众号, 小红书技术（dots.llm）
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: 暂无公开信息
- numbers: 3.5, 4B, 9B, 2025, 7.15, 4, 1.23, 1.86
- quotes: 暂无公开信息

## evidence_seed

- company_actions: 小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。 / 5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.
- case_details: 小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。基于 Qwen3.5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.15 pass@4 提升。部署测评中，TTFT 加速约 1.23×，TPOT 加速约 1.86×。训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。 / 训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 4
- importance_reason: new product or service; rubric=4 concrete important change
- supporting_signals: adoption_context
- novelty: 3
- evidence_strength: 2
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
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
- 疑似官网首页、产品目录或导航页，只能索引留存
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
- discovery_record: {"discovery_title":"小红书发布大模型新架构 PIPO","discovery_summary":"小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。基于 Qwen3.5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.15 pass@4 提升。部署测评中，TTFT 加速约 1.23×，TPOT 加速约 1.86×。训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。","source_name":"公众号：小红书技术（dots.llm）","origin_url":"","discovered_at":"2026-07-11T03:57:19.020Z","rank_on_page":11,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

小红书提出 PIPO 架构，通过输入侧压缩器将两个 token 折叠为一个 latent，输出侧 MTP head 将隐藏状态展开为额外 token，实现输入长度减半、每步输出翻倍。基于 Qwen3.5-4B/9B backbone，在 AIME 2025 等基准上最高带来 +7.15 pass@4 提升。部署测评中，TTFT 加速约 1.23×，TPOT 加速约 1.86×。训练采用 SFT 和 On-Policy Distillation 两阶段，将 verifier 校验能力蒸馏进轻量 confidence head。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
