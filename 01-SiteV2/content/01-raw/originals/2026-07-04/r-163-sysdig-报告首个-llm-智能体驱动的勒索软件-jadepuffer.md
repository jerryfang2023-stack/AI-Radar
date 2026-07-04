---
schema_version: raw-evidence-v2
raw_id: R-163
title: "Sysdig 报告首个 LLM 智能体驱动的勒索软件 JADEPUFFER"
title_zh: "Sysdig 报告首个 LLM 智能体驱动的勒索软件 JADEPUFFER"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://x.com/rohanpaul_ai/status/2073113826904674620"
canonical_url: "https://x.com/rohanpaul_ai/status/2073113826904674620"
source_name: "X：Rohan Paul (@rohanpaul_ai)"
source_type: operators
source_level: C
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
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
published_at: "2026-07-03T18:37:07.000Z"
collected_at: 2026-07-04T04:50:51.271Z
language: mixed
full_text_hash: e955da175b5dd740
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-163-sysdig-报告首个-llm-智能体驱动的勒索软件-jadepuffer.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-163-sysdig-报告首个-llm-智能体驱动的勒索软件-jadepuffer.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: timeout-fallback-visible-text
extraction_quality: failed
extraction_method: "fetch_failed_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"fetch_failed_summary_fallback","error_type":"timeout"}
has_full_text: false
content_length: 217
fetch_error: "fetch failed (code=UND_ERR_CONNECT_TIMEOUT)"
evidence_strength: blocked
raw_qc_decision: block
raw_qc_downstream_use: not_allowed
degradation_reasons: ["index_only_or_directory_page","missing_full_text","missing_snapshot"]
evidence_completeness: {"original_url_status":"present","full_text_status":"missing_or_summary_only","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"e955da175b5dd740","missing":["missing_full_text","missing_snapshot"]}
source_volatility: high
community_name: "X：Rohan Paul (@rohanpaul_ai)"
capture_scope: aihot_visible_text
visible_range: "仅保留采集通道当时可见文本，未抓到原页面正文"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Sysdig 报告首个 LLM 智能体驱动的勒索软件 JADEPUFFER","discovery_summary":"Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。智能体随后搜索 API 密钥、云凭证、加密钱包及数据库登录，横向移动至生产数据库服务器。它生成了 600 多个针对性 payload 并根据条件调整行为。与常规勒索软件不同，该智能体未保留可用的恢复密钥，直接损坏数据且无法恢复。","source_name":"X：Rohan Paul (@rohanpaul_ai)","origin_url":"https://x.com/rohanpaul_ai/status/2073113826904674620","discovered_at":"2026-07-04T03:11:32.655Z","rank_on_page":77,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "timeout"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: ac24be08fe67b3bb
content_hash: e955da175b5dd740
semantic_hash: d596a5cb344efa00
duplicate_of: ""
first_seen_at: "2026-07-03T18:37:07.000Z"
last_seen_at: 2026-07-04T04:50:51.271Z
update_detected: false
raw_status: ignored
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["discard"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":4,"importance_reason":"technical trend or capability shift; rubric=4 concrete important change","supporting_signals":[],"novelty":3,"evidence_strength":2,"case_richness":2,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":3}
business_elements: {"companies":["X","Rohan Paul (@rohanpaul_ai)"],"products":[],"people":[],"industries":[],"roles":[],"workflows":[],"business_actions":[],"affected_departments":[],"numbers":["600"],"quotes":[]}
evidence_seed: {"company_actions":["Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。智能体随后搜索 API 密钥、云凭证、加密钱包及数据库登录，横向移动至生产数据库服务器。它生成了 600 多个针对性 payload 并根据条件调整行为。与常规勒索软件不同，该智能体未保留可用的恢复密钥，直接损坏数据且无法恢复。","Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。","攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。"],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例","没有变化前后流程线索","没有可用全文快照"]
key_excerpts: [{"type":"company_action","text":"Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。智能体随后搜索 API 密钥、云凭证、加密钱包及数据库登录，横向移动至生产数据库服务器。它生成了 600 多个针对性 payload 并根据条件调整行为。与常规勒索软件不同，该智能体未保留可用的恢复密钥，直接损坏数据且无法恢复。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"智能体随后搜索 API 密钥、云凭证、加密钱包及数据库登录，横向移动至生产数据库服务器。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"它生成了 600 多个针对性 payload 并根据条件调整行为。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"与常规勒索软件不同，该智能体未保留可用的恢复密钥，直接损坏数据且无法恢复。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-04T04:50:51.271Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Sysdig 报告首个 LLM 智能体驱动的勒索软件 JADEPUFFER

## clean_text

Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。智能体随后搜索 API 密钥、云凭证、加密钱包及数据库登录，横向移动至生产数据库服务器。它生成了 600 多个针对性 payload 并根据条件调整行为。与常规勒索软件不同，该智能体未保留可用的恢复密钥，直接损坏数据且无法恢复。

## full_text

Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。智能体随后搜索 API 密钥、云凭证、加密钱包及数据库登录，横向移动至生产数据库服务器。它生成了 600 多个针对性 payload 并根据条件调整行为。与常规勒索软件不同，该智能体未保留可用的恢复密钥，直接损坏数据且无法恢复。

## extraction_diagnostics

- extraction_method: fetch_failed_summary_fallback
- readability_score: 0
- fetch_status: timeout-fallback-visible-text
- extraction_quality: failed
- diagnostics: {"method":"fetch_failed_summary_fallback","error_type":"timeout"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。智能体随后搜索 API 密钥、云凭证、加密钱包及数据库登录，横向移动至生产数据库服务器。它生成了 600 多个针对性 payload 并根据条件调整行为。与常规勒索软件不同，该智能体未保留可用的恢复密钥，直接损坏数据且无法恢复。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   智能体随后搜索 API 密钥、云凭证、加密钱包及数据库登录，横向移动至生产数据库服务器。

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   它生成了 600 多个针对性 payload 并根据条件调整行为。

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   与常规勒索软件不同，该智能体未保留可用的恢复密钥，直接损坏数据且无法恢复。

## business_elements

- companies: X, Rohan Paul (@rohanpaul_ai)
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: 暂无公开信息
- numbers: 600
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。智能体随后搜索 API 密钥、云凭证、加密钱包及数据库登录，横向移动至生产数据库服务器。它生成了 600 多个针对性 payload 并根据条件调整行为。与常规勒索软件不同，该智能体未保留可用的恢复密钥，直接损坏数据且无法恢复。 / Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。 / 攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。
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
- case_richness: 2
- trend_relevance: 5
- guanlan_relevance: 4
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

- discard

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 疑似官网首页、产品目录或导航页，只能索引留存
- 没有具体客户或真实企业案例
- 没有变化前后流程线索
- 没有可用全文快照

## volatile_and_discovery_handling

- source_volatility: high
- community_name: X：Rohan Paul (@rohanpaul_ai)
- capture_scope: aihot_visible_text
- visible_range: 仅保留采集通道当时可见文本，未抓到原页面正文
- evidence_level: discovery_only
- discovery_source: AI HOT
- source_role: discovery_source
- origin_fetch_status: timeout
- discovery_record: {"discovery_title":"Sysdig 报告首个 LLM 智能体驱动的勒索软件 JADEPUFFER","discovery_summary":"Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。智能体随后搜索 API 密钥、云凭证、加密钱包及数据库登录，横向移动至生产数据库服务器。它生成了 600 多个针对性 payload 并根据条件调整行为。与常规勒索软件不同，该智能体未保留可用的恢复密钥，直接损坏数据且无法恢复。","source_name":"X：Rohan Paul (@rohanpaul_ai)","origin_url":"https://x.com/rohanpaul_ai/status/2073113826904674620","discovered_at":"2026-07-04T03:11:32.655Z","rank_on_page":77,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Sysdig 将 JADEPUFFER 定义为首个完全由大语言模型（LLM）智能体驱动的勒索软件。攻击目标为开源 AI 构建工具 Langflow，利用其缺失认证漏洞在暴露服务器上执行 Python 代码。智能体随后搜索 API 密钥、云凭证、加密钱包及数据库登录，横向移动至生产数据库服务器。它生成了 600 多个针对性 payload 并根据条件调整行为。与常规勒索软件不同，该智能体未保留可用的恢复密钥，直接损坏数据且无法恢复。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
