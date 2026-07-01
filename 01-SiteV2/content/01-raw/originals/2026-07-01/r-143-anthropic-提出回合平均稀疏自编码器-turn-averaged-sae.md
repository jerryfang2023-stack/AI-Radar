---
schema_version: raw-evidence-v2
raw_id: R-143
title: "Anthropic 提出回合平均稀疏自编码器 (Turn-Averaged SAE)"
original_url: ""
canonical_url: ""
source_name: "Anthropic：Transformer Circuits（可解释性研究）"
source_type: official
source_level: S
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
collected_at: 2026-07-01T02:33:05.688Z
language: mixed
full_text_hash: e33b6db13a785a3f
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-01/r-143-anthropic-提出回合平均稀疏自编码器-turn-averaged-sae.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-01/r-143-anthropic-提出回合平均稀疏自编码器-turn-averaged-sae.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: no-url-summary-only
extraction_quality: failed
extraction_method: "no_url_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"no_url_summary_fallback"}
has_full_text: false
content_length: 267
fetch_error: ""
raw_qc_decision: block
raw_qc_downstream_use: not_allowed
degradation_reasons: ["index_only_or_directory_page","missing_full_text","missing_snapshot"]
evidence_completeness: {"original_url_status":"missing","full_text_status":"missing_or_summary_only","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"e33b6db13a785a3f","missing":["missing_original_url","missing_full_text","missing_snapshot"]}
source_volatility: medium
community_name: ""
capture_scope: summary_only
visible_range: "采集通道提供的标题与摘要"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Anthropic 提出回合平均稀疏自编码器 (Turn-Averaged SAE)","discovery_summary":"Anthropic 对每个对话回合所有 token 的残差流取平均后训练 SAE，大幅减少需解析的特征数量。实验使用 Qwen-2.5-7B-Instruct 和 LMSYS-Chat-1M 数据集，回合平均特征更关注模型行为的高层特性（如错误答案），每 token SAE 侧重数值推理等细节。Sonnet 4.6 评测显示：回合平均 SAE 在从 10 个回合中唯一识别目标（区分度）为 74%，低于每 token SAE 的 95%；但在全面描述回合（覆盖度）上以 77% 胜出。该方法可外推至训练平均长度 150 倍长的回合。","source_name":"Anthropic：Transformer Circuits（可解释性研究）","origin_url":"","discovered_at":"2026-07-01T02:17:37.271Z","rank_on_page":18,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "summary_only"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: e3b0c44298fc1c14
content_hash: e33b6db13a785a3f
semantic_hash: b33e2656841182bd
duplicate_of: ""
first_seen_at: "2026-07-01T02:33:05.688Z"
last_seen_at: 2026-07-01T02:33:05.688Z
update_detected: false
raw_status: ignored
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":5,"importance_reason":"technical trend or capability shift; rubric=5 major/platform/industry-shaping","supporting_signals":[],"novelty":3,"evidence_strength":2,"case_richness":4,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":2}
business_elements: {"companies":["Anthropic","Transformer Circuits（可解释性研究）"],"products":[],"people":[],"industries":[],"roles":[],"workflows":[],"business_actions":[],"affected_departments":[],"numbers":["2.5","7B","1M","4.6","10","74%","95%","77%"],"quotes":[]}
evidence_seed: {"company_actions":["Anthropic 对每个对话回合所有 token 的残差流取平均后训练 SAE，大幅减少需解析的特征数量。","5-7B-Instruct 和 LMSYS-Chat-1M 数据集，回合平均特征更关注模型行为的高层特性（如错误答案），每 token SAE 侧重数值推理等细节。"],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例","没有变化前后流程线索","没有可用全文快照"]
key_excerpts: [{"type":"number","text":"Anthropic 对每个对话回合所有 token 的残差流取平均后训练 SAE，大幅减少需解析的特征数量。实验使用 Qwen-2.5-7B-Instruct 和 LMSYS-Chat-1M 数据集，回合平均特征更关注模型行为的高层特性（如错误答案），每 token SAE 侧重数值推理等细节。Sonnet 4.6 评测显示：回合平均 SAE 在从 10 个回合中唯一识别目标（区分度）为 74%，低于每 token SAE 的 95%；但在全面描述回合（覆盖度）上以 77% 胜出。该方法可外推至训练平均长度 150 倍长的回合。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"Anthropic 对每个对话回合所有 token 的残差流取平均后训练 SAE，大幅减少需解析的特征数量。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"5-7B-Instruct 和 LMSYS-Chat-1M 数据集，回合平均特征更关注模型行为的高层特性（如错误答案），每 token SAE 侧重数值推理等细节。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"number","text":"6 评测显示：回合平均 SAE 在从 10 个回合中唯一识别目标（区分度）为 74%，低于每 token SAE 的 95%；但在全面描述回合（覆盖度）上以 77% 胜出。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"number","text":"该方法可外推至训练平均长度 150 倍长的回合。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Anthropic 提出回合平均稀疏自编码器 (Turn-Averaged SAE)

## clean_text

Anthropic 对每个对话回合所有 token 的残差流取平均后训练 SAE，大幅减少需解析的特征数量。实验使用 Qwen-2.5-7B-Instruct 和 LMSYS-Chat-1M 数据集，回合平均特征更关注模型行为的高层特性（如错误答案），每 token SAE 侧重数值推理等细节。Sonnet 4.6 评测显示：回合平均 SAE 在从 10 个回合中唯一识别目标（区分度）为 74%，低于每 token SAE 的 95%；但在全面描述回合（覆盖度）上以 77% 胜出。该方法可外推至训练平均长度 150 倍长的回合。

## full_text

Anthropic 对每个对话回合所有 token 的残差流取平均后训练 SAE，大幅减少需解析的特征数量。实验使用 Qwen-2.5-7B-Instruct 和 LMSYS-Chat-1M 数据集，回合平均特征更关注模型行为的高层特性（如错误答案），每 token SAE 侧重数值推理等细节。Sonnet 4.6 评测显示：回合平均 SAE 在从 10 个回合中唯一识别目标（区分度）为 74%，低于每 token SAE 的 95%；但在全面描述回合（覆盖度）上以 77% 胜出。该方法可外推至训练平均长度 150 倍长的回合。

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
   Anthropic 对每个对话回合所有 token 的残差流取平均后训练 SAE，大幅减少需解析的特征数量。实验使用 Qwen-2.5-7B-Instruct 和 LMSYS-Chat-1M 数据集，回合平均特征更关注模型行为的高层特性（如错误答案），每 token SAE 侧重数值推理等细节。Sonnet 4.6 评测显示：回合平均 SAE 在从 10 个回合中唯一识别目标（区分度）为 74%，低于每 token SAE 的 95%；但在全面描述回合（覆盖度）上以 77% 胜出。该方法可外推至训练平均长度 150 倍长的回合。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   Anthropic 对每个对话回合所有 token 的残差流取平均后训练 SAE，大幅减少需解析的特征数量。

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   5-7B-Instruct 和 LMSYS-Chat-1M 数据集，回合平均特征更关注模型行为的高层特性（如错误答案），每 token SAE 侧重数值推理等细节。

4. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   6 评测显示：回合平均 SAE 在从 10 个回合中唯一识别目标（区分度）为 74%，低于每 token SAE 的 95%；但在全面描述回合（覆盖度）上以 77% 胜出。

5. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   该方法可外推至训练平均长度 150 倍长的回合。

## business_elements

- companies: Anthropic, Transformer Circuits（可解释性研究）
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: 暂无公开信息
- numbers: 2.5, 7B, 1M, 4.6, 10, 74%, 95%, 77%
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Anthropic 对每个对话回合所有 token 的残差流取平均后训练 SAE，大幅减少需解析的特征数量。 / 5-7B-Instruct 和 LMSYS-Chat-1M 数据集，回合平均特征更关注模型行为的高层特性（如错误答案），每 token SAE 侧重数值推理等细节。
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_technical_trend
- importance_score: 5
- importance_reason: technical trend or capability shift; rubric=5 major/platform/industry-shaping
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
- discovery_record: {"discovery_title":"Anthropic 提出回合平均稀疏自编码器 (Turn-Averaged SAE)","discovery_summary":"Anthropic 对每个对话回合所有 token 的残差流取平均后训练 SAE，大幅减少需解析的特征数量。实验使用 Qwen-2.5-7B-Instruct 和 LMSYS-Chat-1M 数据集，回合平均特征更关注模型行为的高层特性（如错误答案），每 token SAE 侧重数值推理等细节。Sonnet 4.6 评测显示：回合平均 SAE 在从 10 个回合中唯一识别目标（区分度）为 74%，低于每 token SAE 的 95%；但在全面描述回合（覆盖度）上以 77% 胜出。该方法可外推至训练平均长度 150 倍长的回合。","source_name":"Anthropic：Transformer Circuits（可解释性研究）","origin_url":"","discovered_at":"2026-07-01T02:17:37.271Z","rank_on_page":18,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Anthropic 对每个对话回合所有 token 的残差流取平均后训练 SAE，大幅减少需解析的特征数量。实验使用 Qwen-2.5-7B-Instruct 和 LMSYS-Chat-1M 数据集，回合平均特征更关注模型行为的高层特性（如错误答案），每 token SAE 侧重数值推理等细节。Sonnet 4.6 评测显示：回合平均 SAE 在从 10 个回合中唯一识别目标（区分度）为 74%，低于每 token SAE 的 95%；但在全面描述回合（覆盖度）上以 77% 胜出。该方法可外推至训练平均长度 150 倍长的回合。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
