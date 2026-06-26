---
schema_version: raw-evidence-v2
raw_id: R-232
title: "Ling-2.6-1T TPU 推理优化：用 Pallas Kernel 隐藏 MoE 数据搬运"
original_url: "https://mp.weixin.qq.com/s/Ql7lU0d4uf5_f1MscFMSQg"
canonical_url: "https://mp.weixin.qq.com/s/Ql7lU0d4uf5_f1MscFMSQg"
source_name: "公众号：蚂蚁百灵（Ling）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: research_or_report
evidence_object_usable: false
event_evidence: false
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-06-24T07:01:16.000Z"
collected_at: 2026-06-25T03:26:01.139Z
language: mixed
full_text_hash: 454e14935287583c
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-25/r-232-ling-2-6-1t-tpu-推理优化-用-pallas-kernel-隐藏-moe-数据搬运.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-25/r-232-ling-2-6-1t-tpu-推理优化-用-pallas-kernel-隐藏-moe-数据搬运.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: summary-only-low-readable-body
extraction_quality: failed
extraction_method: "none"
readability_score: 0
extractor_diagnostics: {"readability_score":0,"text_length":0,"paragraph_count":0,"sentence_count":0,"boilerplate_hits":0,"symbol_ratio":1,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"none"}
has_full_text: false
content_length: 545
fetch_error: ""
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["missing_full_text"]
evidence_completeness: {"original_url_status":"present","full_text_status":"missing_or_summary_only","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"454e14935287583c","missing":["missing_full_text"]}
source_volatility: medium
community_name: ""
capture_scope: aihot_visible_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Ling-2.6-1T TPU 推理优化：用 Pallas Kernel 隐藏 MoE 数据搬运","discovery_summary":"蚂蚁 ASystem Core 与 SGLang-JAX 团队在 TPU v7x 上优化了 1T 参数稀疏 MoE 模型 Ling-2.6-1T 的推理性能。核心是 Fused MoE V2 Pallas kernel，将 scatter、expert FFN 和 gather 合并，通过计算与数据搬运重叠降低延迟。相比 V1，MoE prefill latency 从 5.16 ms 降至 2.42 ms（降 53%），decode kernel latency 从 0.249 ms 降至 0.211 ms。仅替换 MoE kernel 即可使 prefill throughput 提升 24.8%，decode throughput 提升 18.5%-35.3%。在 SGLang decode benchmark 下，16 颗 TPU v7x 的 output throughput 达到 16 张 H200 的 1.29x-1.77x。该工作还完整支持 hybrid backbone，包括 hybrid KV/recurrent memory pools、GLA linear attention 及 single-controller data parallelism。","source_name":"公众号：蚂蚁百灵（Ling）","origin_url":"https://mp.weixin.qq.com/s/Ql7lU0d4uf5_f1MscFMSQg","discovered_at":"2026-06-25T03:03:30.173Z","rank_on_page":290,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "summary_only"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 4b8449792d21719c
content_hash: 454e14935287583c
semantic_hash: 4a3d2970b794447c
duplicate_of: ""
first_seen_at: "2026-06-24T07:01:16.000Z"
last_seen_at: 2026-06-25T03:26:01.139Z
update_detected: false
raw_status: ignored
usable_for: {"viewpoint":false,"case":false,"change":false,"trend":false,"daily_observation":false,"heatmap":false,"briefing":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["discard"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":4,"importance_reason":"technical trend or capability shift; rubric=4 concrete important change","supporting_signals":[],"novelty":3,"evidence_strength":2,"case_richness":4,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":2}
business_elements: {"companies":["公众号","蚂蚁百灵（Ling）"],"products":[],"people":[],"industries":["开发者工具"],"roles":[],"workflows":[],"business_actions":[],"affected_departments":[],"numbers":["2.6","1","7x","2","5.16 m","2.42 m","53%","0.249 m"],"quotes":[]}
evidence_seed: {"company_actions":["核心是 Fused MoE V2 Pallas kernel，将 scatter、expert FFN 和 gather 合并，通过计算与数据搬运重叠降低延迟。","相比 V1，MoE prefill latency 从 5.","仅替换 MoE kernel 即可使 prefill throughput 提升 24."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有具体客户或真实企业案例","没有变化前后流程线索","没有可用全文快照"]
key_excerpts: [{"type":"number","text":"蚂蚁 ASystem Core 与 SGLang-JAX 团队在 TPU v7x 上优化了 1T 参数稀疏 MoE 模型 Ling-2.6-1T 的推理性能。核心是 Fused MoE V2 Pallas kernel，将 scatter、expert FFN 和 gather 合并，通过计算与数据搬运重叠降低延迟。相比 V1，MoE prefill latency 从 5.16 ms 降至 2.42 ms（降 53%），decode kernel latency 从 0.249 ms 降至 0.211 ms。仅替换 MoE kernel 即可使 prefill throughput 提升 24.8%，decode throughput 提升 18.5%-35.3%。在 SGLang decode benchmark 下，16 颗 TPU v7x 的 output throughput 达到 16 张 H200 的 1.29x-1.77x。该工作还完整支持 hybrid backbone，包括 hybrid KV/recurrent memory pools、GLA linear attention 及 single-con","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"medium"},{"type":"number","text":"蚂蚁 ASystem Core 与 SGLang-JAX 团队在 TPU v7x 上优化了 1T 参数稀疏 MoE 模型 Ling-2.","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"核心是 Fused MoE V2 Pallas kernel，将 scatter、expert FFN 和 gather 合并，通过计算与数据搬运重叠降低延迟。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"相比 V1，MoE prefill latency 从 5.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"number","text":"42 ms（降 53%），decode kernel latency 从 0.","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"仅替换 MoE kernel 即可使 prefill throughput 提升 24.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Ling-2.6-1T TPU 推理优化：用 Pallas Kernel 隐藏 MoE 数据搬运

## clean_text

蚂蚁 ASystem Core 与 SGLang-JAX 团队在 TPU v7x 上优化了 1T 参数稀疏 MoE 模型 Ling-2.6-1T 的推理性能。核心是 Fused MoE V2 Pallas kernel，将 scatter、expert FFN 和 gather 合并，通过计算与数据搬运重叠降低延迟。相比 V1，MoE prefill latency 从 5.16 ms 降至 2.42 ms（降 53%），decode kernel latency 从 0.249 ms 降至 0.211 ms。仅替换 MoE kernel 即可使 prefill throughput 提升 24.8%，decode throughput 提升 18.5%-35.3%。在 SGLang decode benchmark 下，16 颗 TPU v7x 的 output throughput 达到 16 张 H200 的 1.29x-1.77x。该工作还完整支持 hybrid backbone，包括 hybrid KV/recurrent memory pools、GLA linear attention 及 single-controller data parallelism。

## full_text

蚂蚁 ASystem Core 与 SGLang-JAX 团队在 TPU v7x 上优化了 1T 参数稀疏 MoE 模型 Ling-2.6-1T 的推理性能。核心是 Fused MoE V2 Pallas kernel，将 scatter、expert FFN 和 gather 合并，通过计算与数据搬运重叠降低延迟。相比 V1，MoE prefill latency 从 5.16 ms 降至 2.42 ms（降 53%），decode kernel latency 从 0.249 ms 降至 0.211 ms。仅替换 MoE kernel 即可使 prefill throughput 提升 24.8%，decode throughput 提升 18.5%-35.3%。在 SGLang decode benchmark 下，16 颗 TPU v7x 的 output throughput 达到 16 张 H200 的 1.29x-1.77x。该工作还完整支持 hybrid backbone，包括 hybrid KV/recurrent memory pools、GLA linear attention 及 single-controller data parallelism。

## extraction_diagnostics

- extraction_method: none
- readability_score: 0
- fetch_status: summary-only-low-readable-body
- extraction_quality: failed
- diagnostics: {"readability_score":0,"text_length":0,"paragraph_count":0,"sentence_count":0,"boilerplate_hits":0,"symbol_ratio":1,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"none"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=medium
   蚂蚁 ASystem Core 与 SGLang-JAX 团队在 TPU v7x 上优化了 1T 参数稀疏 MoE 模型 Ling-2.6-1T 的推理性能。核心是 Fused MoE V2 Pallas kernel，将 scatter、expert FFN 和 gather 合并，通过计算与数据搬运重叠降低延迟。相比 V1，MoE prefill latency 从 5.16 ms 降至 2.42 ms（降 53%），decode kernel latency 从 0.249 ms 降至 0.211 ms。仅替换 MoE kernel 即可使 prefill throughput 提升 24.8%，decode throughput 提升 18.5%-35.3%。在 SGLang decode benchmark 下，16 颗 TPU v7x 的 output throughput 达到 16 张 H200 的 1.29x-1.77x。该工作还完整支持 hybrid backbone，包括 hybrid KV/recurrent memory pools、GLA linear attention 及 single-con

2. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=medium
   蚂蚁 ASystem Core 与 SGLang-JAX 团队在 TPU v7x 上优化了 1T 参数稀疏 MoE 模型 Ling-2.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   核心是 Fused MoE V2 Pallas kernel，将 scatter、expert FFN 和 gather 合并，通过计算与数据搬运重叠降低延迟。

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   相比 V1，MoE prefill latency 从 5.

5. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=medium
   42 ms（降 53%），decode kernel latency 从 0.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   仅替换 MoE kernel 即可使 prefill throughput 提升 24.

## business_elements

- companies: 公众号, 蚂蚁百灵（Ling）
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: 暂无公开信息
- numbers: 2.6, 1, 7x, 2, 5.16 m, 2.42 m, 53%, 0.249 m
- quotes: 暂无公开信息

## evidence_seed

- company_actions: 核心是 Fused MoE V2 Pallas kernel，将 scatter、expert FFN 和 gather 合并，通过计算与数据搬运重叠降低延迟。 / 相比 V1，MoE prefill latency 从 5. / 仅替换 MoE kernel 即可使 prefill throughput 提升 24.
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
- change: false
- trend: false
- daily_observation: false
- heatmap: false
- briefing: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- discard

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势
- 没有具体客户或真实企业案例
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
- discovery_record: {"discovery_title":"Ling-2.6-1T TPU 推理优化：用 Pallas Kernel 隐藏 MoE 数据搬运","discovery_summary":"蚂蚁 ASystem Core 与 SGLang-JAX 团队在 TPU v7x 上优化了 1T 参数稀疏 MoE 模型 Ling-2.6-1T 的推理性能。核心是 Fused MoE V2 Pallas kernel，将 scatter、expert FFN 和 gather 合并，通过计算与数据搬运重叠降低延迟。相比 V1，MoE prefill latency 从 5.16 ms 降至 2.42 ms（降 53%），decode kernel latency 从 0.249 ms 降至 0.211 ms。仅替换 MoE kernel 即可使 prefill throughput 提升 24.8%，decode throughput 提升 18.5%-35.3%。在 SGLang decode benchmark 下，16 颗 TPU v7x 的 output throughput 达到 16 张 H200 的 1.29x-1.77x。该工作还完整支持 hybrid backbone，包括 hybrid KV/recurrent memory pools、GLA linear attention 及 single-controller data parallelism。","source_name":"公众号：蚂蚁百灵（Ling）","origin_url":"https://mp.weixin.qq.com/s/Ql7lU0d4uf5_f1MscFMSQg","discovered_at":"2026-06-25T03:03:30.173Z","rank_on_page":290,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

蚂蚁 ASystem Core 与 SGLang-JAX 团队在 TPU v7x 上优化了 1T 参数稀疏 MoE 模型 Ling-2.6-1T 的推理性能。核心是 Fused MoE V2 Pallas kernel，将 scatter、expert FFN 和 gather 合并，通过计算与数据搬运重叠降低延迟。相比 V1，MoE prefill latency 从 5.16 ms 降至 2.42 ms（降 53%），decode kernel latency 从 0.249 ms 降至 0.211 ms。仅替换 MoE kernel 即可使 prefill throughput 提升 24.8%，decode throughput 提升 18.5%-35.3%。在 SGLang decode benchmark 下，16 颗 TPU v7x 的 output throughput 达到 16 张 H200 的 1.29x-1.77x。该工作还完整支持 hybrid backbone，包括 hybrid KV/recurrent memory pools、GLA linear attention 及 single-controller data parallelism。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
