---
schema_version: raw-evidence-v2
raw_id: R-174
title: "用SGLang-JAX在TPU上优化Ling-2.6-1T：一个Pallas核将MoE数据移动隐藏在计算中"
original_url: ""
canonical_url: ""
source_name: "LMSYS：Blog（Chatbot Arena 团队）"
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
collected_at: 2026-06-18T03:06:53.409Z
language: mixed
full_text_hash: 36547228a2fbad33
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-18/r-174-用sglang-jax在tpu上优化ling-2-6-1t-一个pallas核将moe数据移动隐藏在计算中.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-18/r-174-用sglang-jax在tpu上优化ling-2-6-1t-一个pallas核将moe数据移动隐藏在计算中.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: no-url-summary-only
extraction_quality: failed
extraction_method: "no_url_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"no_url_summary_fallback"}
has_full_text: false
content_length: 321
fetch_error: ""
raw_qc_decision: block
raw_qc_downstream_use: not_allowed
degradation_reasons: ["index_only_or_directory_page","missing_full_text","missing_snapshot","discovery_or_feedback_source_boundary"]
evidence_completeness: {"original_url_status":"missing","full_text_status":"missing_or_summary_only","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"36547228a2fbad33","missing":["missing_original_url","missing_full_text","missing_snapshot"]}
source_volatility: medium
community_name: ""
capture_scope: summary_only
visible_range: "采集通道提供的标题与摘要"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"用SGLang-JAX在TPU上优化Ling-2.6-1T：一个Pallas核将MoE数据移动隐藏在计算中","discovery_summary":"SGLang-JAX现已支持inclusionAI的Ling-2.6-1T（1T稀疏MoE，63B激活参数，256路由专家，top-8路由加共享专家）在TPU v7x上高效推理。团队开发了Fused MoE V2——一个融合scatter、专家FFN和gather的Pallas核，通过将MoE数据移动隐藏在计算中，使MoE预填充延迟从5.16ms降至2.42ms（降幅53%），解码核延迟从0.249ms降至0.211ms（降幅约15%）。仅替换MoE核即提升预填充吞吐量24.8%，解码吞吐量18.5%–35.3%。在SGLang解码基准测试中，16块TPU v7x芯片输出吞吐量达16块H200 GPU的1.29倍（mc=128）至1…","source_name":"LMSYS：Blog（Chatbot Arena 团队）","origin_url":"","discovered_at":"2026-06-18T03:01:25.293Z","rank_on_page":20,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "summary_only"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: e3b0c44298fc1c14
content_hash: 36547228a2fbad33
semantic_hash: 8d6293114964f247
duplicate_of: ""
first_seen_at: "2026-06-18T03:06:53.409Z"
last_seen_at: 2026-06-18T03:06:53.409Z
update_detected: false
raw_status: ignored
usable_for: {"viewpoint":false,"case":false,"change":false,"trend":false,"daily_observation":false,"heatmap":false,"briefing":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":4,"importance_reason":"technical trend or capability shift; rubric=4 concrete important change","supporting_signals":[],"novelty":3,"evidence_strength":2,"case_richness":4,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":2}
business_elements: {"companies":["LMSYS","Blog（Chatbot Arena 团队）"],"products":[],"people":[],"industries":[],"roles":[],"workflows":[],"business_actions":[],"affected_departments":[],"numbers":["2.6","1","63B","256","8","7x","2","5.16m"],"quotes":[]}
evidence_seed: {"company_actions":["SGLang-JAX现已支持inclusionAI的Ling-2.","团队开发了Fused MoE V2——一个融合scatter、专家FFN和gather的Pallas核，通过将MoE数据移动隐藏在计算中，使MoE预填充延迟从5.","仅替换MoE核即提升预填充吞吐量24."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例","没有变化前后流程线索","没有可用全文快照"]
key_excerpts: [{"type":"number","text":"SGLang-JAX现已支持inclusionAI的Ling-2.6-1T（1T稀疏MoE，63B激活参数，256路由专家，top-8路由加共享专家）在TPU v7x上高效推理。团队开发了Fused MoE V2——一个融合scatter、专家FFN和gather的Pallas核，通过将MoE数据移动隐藏在计算中，使MoE预填充延迟从5.16ms降至2.42ms（降幅53%），解码核延迟从0.249ms降至0.211ms（降幅约15%）。仅替换MoE核即提升预填充吞吐量24.8%，解码吞吐量18.5%–35.3%。在SGLang解码基准测试中，16块TPU v7x芯片输出吞吐量达16块H200 GPU的1.29倍（mc=128）至1…","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"SGLang-JAX现已支持inclusionAI的Ling-2.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"number","text":"6-1T（1T稀疏MoE，63B激活参数，256路由专家，top-8路由加共享专家）在TPU v7x上高效推理。","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"团队开发了Fused MoE V2——一个融合scatter、专家FFN和gather的Pallas核，通过将MoE数据移动隐藏在计算中，使MoE预填充延迟从5.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"number","text":"42ms（降幅53%），解码核延迟从0.","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"仅替换MoE核即提升预填充吞吐量24.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# 用SGLang-JAX在TPU上优化Ling-2.6-1T：一个Pallas核将MoE数据移动隐藏在计算中

## clean_text

SGLang-JAX现已支持inclusionAI的Ling-2.6-1T（1T稀疏MoE，63B激活参数，256路由专家，top-8路由加共享专家）在TPU v7x上高效推理。团队开发了Fused MoE V2——一个融合scatter、专家FFN和gather的Pallas核，通过将MoE数据移动隐藏在计算中，使MoE预填充延迟从5.16ms降至2.42ms（降幅53%），解码核延迟从0.249ms降至0.211ms（降幅约15%）。仅替换MoE核即提升预填充吞吐量24.8%，解码吞吐量18.5%–35.3%。在SGLang解码基准测试中，16块TPU v7x芯片输出吞吐量达16块H200 GPU的1.29倍（mc=128）至1…

## full_text

SGLang-JAX现已支持inclusionAI的Ling-2.6-1T（1T稀疏MoE，63B激活参数，256路由专家，top-8路由加共享专家）在TPU v7x上高效推理。团队开发了Fused MoE V2——一个融合scatter、专家FFN和gather的Pallas核，通过将MoE数据移动隐藏在计算中，使MoE预填充延迟从5.16ms降至2.42ms（降幅53%），解码核延迟从0.249ms降至0.211ms（降幅约15%）。仅替换MoE核即提升预填充吞吐量24.8%，解码吞吐量18.5%–35.3%。在SGLang解码基准测试中，16块TPU v7x芯片输出吞吐量达16块H200 GPU的1.29倍（mc=128）至1…

## extraction_diagnostics

- extraction_method: no_url_summary_fallback
- readability_score: 0
- fetch_status: no-url-summary-only
- extraction_quality: failed
- diagnostics: {"method":"no_url_summary_fallback"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=medium
   SGLang-JAX现已支持inclusionAI的Ling-2.6-1T（1T稀疏MoE，63B激活参数，256路由专家，top-8路由加共享专家）在TPU v7x上高效推理。团队开发了Fused MoE V2——一个融合scatter、专家FFN和gather的Pallas核，通过将MoE数据移动隐藏在计算中，使MoE预填充延迟从5.16ms降至2.42ms（降幅53%），解码核延迟从0.249ms降至0.211ms（降幅约15%）。仅替换MoE核即提升预填充吞吐量24.8%，解码吞吐量18.5%–35.3%。在SGLang解码基准测试中，16块TPU v7x芯片输出吞吐量达16块H200 GPU的1.29倍（mc=128）至1…

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   SGLang-JAX现已支持inclusionAI的Ling-2.

3. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=medium
   6-1T（1T稀疏MoE，63B激活参数，256路由专家，top-8路由加共享专家）在TPU v7x上高效推理。

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   团队开发了Fused MoE V2——一个融合scatter、专家FFN和gather的Pallas核，通过将MoE数据移动隐藏在计算中，使MoE预填充延迟从5.

5. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=medium
   42ms（降幅53%），解码核延迟从0.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   仅替换MoE核即提升预填充吞吐量24.

## business_elements

- companies: LMSYS, Blog（Chatbot Arena 团队）
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: 暂无公开信息
- numbers: 2.6, 1, 63B, 256, 8, 7x, 2, 5.16m
- quotes: 暂无公开信息

## evidence_seed

- company_actions: SGLang-JAX现已支持inclusionAI的Ling-2. / 团队开发了Fused MoE V2——一个融合scatter、专家FFN和gather的Pallas核，通过将MoE数据移动隐藏在计算中，使MoE预填充延迟从5. / 仅替换MoE核即提升预填充吞吐量24.
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
- discovery_record: {"discovery_title":"用SGLang-JAX在TPU上优化Ling-2.6-1T：一个Pallas核将MoE数据移动隐藏在计算中","discovery_summary":"SGLang-JAX现已支持inclusionAI的Ling-2.6-1T（1T稀疏MoE，63B激活参数，256路由专家，top-8路由加共享专家）在TPU v7x上高效推理。团队开发了Fused MoE V2——一个融合scatter、专家FFN和gather的Pallas核，通过将MoE数据移动隐藏在计算中，使MoE预填充延迟从5.16ms降至2.42ms（降幅53%），解码核延迟从0.249ms降至0.211ms（降幅约15%）。仅替换MoE核即提升预填充吞吐量24.8%，解码吞吐量18.5%–35.3%。在SGLang解码基准测试中，16块TPU v7x芯片输出吞吐量达16块H200 GPU的1.29倍（mc=128）至1…","source_name":"LMSYS：Blog（Chatbot Arena 团队）","origin_url":"","discovered_at":"2026-06-18T03:01:25.293Z","rank_on_page":20,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

SGLang-JAX现已支持inclusionAI的Ling-2.6-1T（1T稀疏MoE，63B激活参数，256路由专家，top-8路由加共享专家）在TPU v7x上高效推理。团队开发了Fused MoE V2——一个融合scatter、专家FFN和gather的Pallas核，通过将MoE数据移动隐藏在计算中，使MoE预填充延迟从5.16ms降至2.42ms（降幅53%），解码核延迟从0.249ms降至0.211ms（降幅约15%）。仅替换MoE核即提升预填充吞吐量24.8%，解码吞吐量18.5%–35.3%。在SGLang解码基准测试中，16块TPU v7x芯片输出吞吐量达16块H200 GPU的1.29倍（mc=128）至1…

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
