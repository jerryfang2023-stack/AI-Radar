---
schema_version: raw-evidence-v2
raw_id: R-083
title: "Kyutai 发布 MuScriptor：用于多乐器自动音乐转录的开源解码器专用 Transformer 模型"
title_zh: "Kyutai 发布 MuScriptor：用于多乐器自动音乐转录的开源解码器专用 Transformer 模型"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://www.marktechpost.com/2026/07/10/kyutai-releases-muscriptor-an-open-weight-decoder-only-transformer-for-multi-instrument-music-transcription-to-midi"
canonical_url: "https://marktechpost.com/2026/07/10/kyutai-releases-muscriptor-an-open-weight-decoder-only-transformer-for-multi-instrument-music-transcription-to-midi"
source_name: "MarkTechPost（RSS）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-07-10T20:21:08.000Z"
collected_at: 2026-07-11T04:06:43.897Z
language: mixed
full_text_hash: 8609e4d52449d906
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-11/r-083-kyutai-发布-muscriptor-用于多乐器自动音乐转录的开源解码器专用-transformer-模型.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-11/r-083-kyutai-发布-muscriptor-用于多乐器自动音乐转录的开源解码器专用-transformer-模型.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: summary-only-low-readable-body
extraction_quality: failed
extraction_method: "none"
readability_score: 0
extractor_diagnostics: {"readability_score":0,"text_length":0,"paragraph_count":0,"sentence_count":0,"boilerplate_hits":0,"symbol_ratio":1,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"none"}
has_full_text: false
content_length: 352
fetch_error: ""
evidence_strength: traceable_summary
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: traceable_summary_or_observation_candidate
degradation_reasons: ["missing_full_text"]
evidence_completeness: {"original_url_status":"present","full_text_status":"missing_or_summary_only","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"8609e4d52449d906","missing":["missing_full_text"]}
source_volatility: medium
community_name: ""
capture_scope: aihot_visible_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Kyutai 发布 MuScriptor：用于多乐器自动音乐转录的开源解码器专用 Transformer 模型","discovery_summary":"Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/10/kyutai-releases-muscriptor-an-open-weight-decoder-only-transformer-for-multi-instrument-music-transcription-to-midi","discovered_at":"2026-07-11T03:57:21.661Z","rank_on_page":104,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "summary_only"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 78114dafebc46f8b
content_hash: 8609e4d52449d906
semantic_hash: 83192c48e5ab56f0
duplicate_of: ""
first_seen_at: "2026-07-10T20:21:08.000Z"
last_seen_at: 2026-07-11T04:06:43.897Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":4,"importance_reason":"new product or service; rubric=4 concrete important change","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":2,"case_richness":4,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["MarkTechPost（RSS）"],"products":[],"people":[],"industries":[],"roles":[],"workflows":[],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["3","103M","307M","1.4B","145 万","17 万","11000","1"],"quotes":[]}
evidence_seed: {"company_actions":["Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。","模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.","在 D Test 基准上，large 模型 Multi F1 达 48."],"case_details":["它将音频转录建模为语言建模任务，采用 MT3 token 化方案。"],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["没有变化前后流程线索","没有可用全文快照"]
key_excerpts: [{"type":"number","text":"Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"product_update","text":"Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"high","confidence":"medium"},{"type":"case_detail","text":"它将音频转录建模为语言建模任务，采用 MT3 token 化方案。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"number","text":"训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"在 D Test 基准上，large 模型 Multi F1 达 48.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-11T04:06:43.897Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Kyutai 发布 MuScriptor：用于多乐器自动音乐转录的开源解码器专用 Transformer 模型

## clean_text

Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。

## full_text

Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。

## extraction_diagnostics

- extraction_method: none
- readability_score: 0
- fetch_status: summary-only-low-readable-body
- extraction_quality: failed
- diagnostics: {"readability_score":0,"text_length":0,"paragraph_count":0,"sentence_count":0,"boilerplate_hits":0,"symbol_ratio":1,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"none"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。

2. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=high｜confidence=medium
   Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。

3. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=medium
   它将音频转录建模为语言建模任务，采用 MT3 token 化方案。

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.

5. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   在 D Test 基准上，large 模型 Multi F1 达 48.

## business_elements

- companies: MarkTechPost（RSS）
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 3, 103M, 307M, 1.4B, 145 万, 17 万, 11000, 1
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。 / 模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1. / 在 D Test 基准上，large 模型 Multi F1 达 48.
- case_details: 它将音频转录建模为语言建模任务，采用 MT3 token 化方案。
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 4
- importance_reason: new product or service; rubric=4 concrete important change
- supporting_signals: adoption_context
- novelty: 3
- evidence_strength: 2
- case_richness: 4
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: false
- business_change: false
- relationship_graph_input: false
- trend_candidate_context: false
- signal_card_candidate: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: true

## pool_routes

- watchlist

## missing_information

- 没有变化前后流程线索
- 没有可用全文快照

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: aihot_visible_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: discovery_only
- discovery_source: AI HOT
- source_role: discovery_source
- origin_fetch_status: summary_only
- discovery_record: {"discovery_title":"Kyutai 发布 MuScriptor：用于多乐器自动音乐转录的开源解码器专用 Transformer 模型","discovery_summary":"Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/10/kyutai-releases-muscriptor-an-open-weight-decoder-only-transformer-for-multi-instrument-music-transcription-to-midi","discovered_at":"2026-07-11T03:57:21.661Z","rank_on_page":104,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
