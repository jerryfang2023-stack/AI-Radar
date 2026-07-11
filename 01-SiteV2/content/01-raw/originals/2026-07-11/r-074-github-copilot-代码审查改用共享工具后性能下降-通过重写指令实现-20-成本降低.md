---
schema_version: raw-evidence-v2
raw_id: R-074
title: "GitHub Copilot 代码审查改用共享工具后性能下降，通过重写指令实现 20% 成本降低"
title_zh: "GitHub Copilot 代码审查改用共享工具后性能下降，通过重写指令实现 20% 成本降低"
title_translation_status: not_required
title_translation_method: source_title
original_url: ""
canonical_url: ""
source_name: "GitHub Blog"
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
collected_at: 2026-07-11T04:06:43.470Z
language: mixed
full_text_hash: 86e80fc27c4549ad
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-11/r-074-github-copilot-代码审查改用共享工具后性能下降-通过重写指令实现-20-成本降低.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-11/r-074-github-copilot-代码审查改用共享工具后性能下降-通过重写指令实现-20-成本降低.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: no-url-summary-only
extraction_quality: failed
extraction_method: "no_url_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"no_url_summary_fallback"}
has_full_text: false
content_length: 194
fetch_error: ""
evidence_strength: blocked
raw_qc_decision: block
raw_qc_downstream_use: not_allowed
degradation_reasons: ["index_only_or_directory_page","missing_full_text","missing_snapshot"]
evidence_completeness: {"original_url_status":"missing","full_text_status":"missing_or_summary_only","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"86e80fc27c4549ad","missing":["missing_original_url","missing_full_text","missing_snapshot"]}
source_volatility: medium
community_name: ""
capture_scope: summary_only
visible_range: "采集通道提供的标题与摘要"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"GitHub Copilot 代码审查改用共享工具后性能下降，通过重写指令实现 20% 成本降低","discovery_summary":"GitHub 在 Copilot 代码审查中尝试用 Copilot CLI 的共享代码探索工具（grep、glob、view）替换原有专用工具，结果导致审查成本上升、有效评论数量下降。分析 trace 发现，问题不在工具本身，而在于指令让智能体像通用编程助手一样大范围浏览仓库，而非像审查者一样从 diff 出发进行定向搜索。重写指令后，审查平均成本降低约 20%，同时保持相同审查质量。","source_name":"GitHub Blog","origin_url":"","discovered_at":"2026-07-11T03:57:19.023Z","rank_on_page":16,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "summary_only"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: e3b0c44298fc1c14
content_hash: 86e80fc27c4549ad
semantic_hash: f452f7611576ad6f
duplicate_of: ""
first_seen_at: "2026-07-11T04:06:43.470Z"
last_seen_at: 2026-07-11T04:06:43.470Z
update_detected: false
raw_status: ignored
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_case","importance_score":4,"importance_reason":"real customer or adoption case; rubric=4 concrete important change","supporting_signals":[],"novelty":3,"evidence_strength":2,"case_richness":3,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["GitHub Blog","GitHub"],"products":["Copilot"],"people":[],"industries":["开发者工具"],"roles":[],"workflows":["计费 / 预算管理"],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["20%"],"quotes":[]}
evidence_seed: {"company_actions":["分析 trace 发现，问题不在工具本身，而在于指令让智能体像通用编程助手一样大范围浏览仓库，而非像审查者一样从 diff 出发进行定向搜索。"],"case_details":["GitHub 在 Copilot 代码审查中尝试用 Copilot CLI 的共享代码探索工具（grep、glob、view）替换原有专用工具，结果导致审查成本上升、有效评论数量下降。"],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","疑似官网首页、产品目录或导航页，只能索引留存","没有可用全文快照"]
key_excerpts: [{"type":"number","text":"GitHub 在 Copilot 代码审查中尝试用 Copilot CLI 的共享代码探索工具（grep、glob、view）替换原有专用工具，结果导致审查成本上升、有效评论数量下降。分析 trace 发现，问题不在工具本身，而在于指令让智能体像通用编程助手一样大范围浏览仓库，而非像审查者一样从 diff 出发进行定向搜索。重写指令后，审查平均成本降低约 20%，同时保持相同审查质量。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"case_detail","text":"GitHub 在 Copilot 代码审查中尝试用 Copilot CLI 的共享代码探索工具（grep、glob、view）替换原有专用工具，结果导致审查成本上升、有效评论数量下降。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"分析 trace 发现，问题不在工具本身，而在于指令让智能体像通用编程助手一样大范围浏览仓库，而非像审查者一样从 diff 出发进行定向搜索。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"number","text":"重写指令后，审查平均成本降低约 20%，同时保持相同审查质量。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-11T04:06:43.470Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# GitHub Copilot 代码审查改用共享工具后性能下降，通过重写指令实现 20% 成本降低

## clean_text

GitHub 在 Copilot 代码审查中尝试用 Copilot CLI 的共享代码探索工具（grep、glob、view）替换原有专用工具，结果导致审查成本上升、有效评论数量下降。分析 trace 发现，问题不在工具本身，而在于指令让智能体像通用编程助手一样大范围浏览仓库，而非像审查者一样从 diff 出发进行定向搜索。重写指令后，审查平均成本降低约 20%，同时保持相同审查质量。

## full_text

GitHub 在 Copilot 代码审查中尝试用 Copilot CLI 的共享代码探索工具（grep、glob、view）替换原有专用工具，结果导致审查成本上升、有效评论数量下降。分析 trace 发现，问题不在工具本身，而在于指令让智能体像通用编程助手一样大范围浏览仓库，而非像审查者一样从 diff 出发进行定向搜索。重写指令后，审查平均成本降低约 20%，同时保持相同审查质量。

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
   GitHub 在 Copilot 代码审查中尝试用 Copilot CLI 的共享代码探索工具（grep、glob、view）替换原有专用工具，结果导致审查成本上升、有效评论数量下降。分析 trace 发现，问题不在工具本身，而在于指令让智能体像通用编程助手一样大范围浏览仓库，而非像审查者一样从 diff 出发进行定向搜索。重写指令后，审查平均成本降低约 20%，同时保持相同审查质量。

2. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=medium
   GitHub 在 Copilot 代码审查中尝试用 Copilot CLI 的共享代码探索工具（grep、glob、view）替换原有专用工具，结果导致审查成本上升、有效评论数量下降。

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   分析 trace 发现，问题不在工具本身，而在于指令让智能体像通用编程助手一样大范围浏览仓库，而非像审查者一样从 diff 出发进行定向搜索。

4. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   重写指令后，审查平均成本降低约 20%，同时保持相同审查质量。

## business_elements

- companies: GitHub Blog, GitHub
- products: Copilot
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 计费 / 预算管理
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 20%
- quotes: 暂无公开信息

## evidence_seed

- company_actions: 分析 trace 发现，问题不在工具本身，而在于指令让智能体像通用编程助手一样大范围浏览仓库，而非像审查者一样从 diff 出发进行定向搜索。
- case_details: GitHub 在 Copilot 代码审查中尝试用 Copilot CLI 的共享代码探索工具（grep、glob、view）替换原有专用工具，结果导致审查成本上升、有效评论数量下降。
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_case
- importance_score: 4
- importance_reason: real customer or adoption case; rubric=4 concrete important change
- supporting_signals:
- novelty: 3
- evidence_strength: 2
- case_richness: 3
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
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势
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
- discovery_record: {"discovery_title":"GitHub Copilot 代码审查改用共享工具后性能下降，通过重写指令实现 20% 成本降低","discovery_summary":"GitHub 在 Copilot 代码审查中尝试用 Copilot CLI 的共享代码探索工具（grep、glob、view）替换原有专用工具，结果导致审查成本上升、有效评论数量下降。分析 trace 发现，问题不在工具本身，而在于指令让智能体像通用编程助手一样大范围浏览仓库，而非像审查者一样从 diff 出发进行定向搜索。重写指令后，审查平均成本降低约 20%，同时保持相同审查质量。","source_name":"GitHub Blog","origin_url":"","discovered_at":"2026-07-11T03:57:19.023Z","rank_on_page":16,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

GitHub 在 Copilot 代码审查中尝试用 Copilot CLI 的共享代码探索工具（grep、glob、view）替换原有专用工具，结果导致审查成本上升、有效评论数量下降。分析 trace 发现，问题不在工具本身，而在于指令让智能体像通用编程助手一样大范围浏览仓库，而非像审查者一样从 diff 出发进行定向搜索。重写指令后，审查平均成本降低约 20%，同时保持相同审查质量。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
