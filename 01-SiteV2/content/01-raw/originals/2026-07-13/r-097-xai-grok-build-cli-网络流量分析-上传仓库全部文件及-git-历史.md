---
schema_version: raw-evidence-v2
raw_id: R-097
title: "xAI Grok Build CLI 网络流量分析：上传仓库全部文件及 git 历史"
title_zh: "xAI Grok Build CLI 网络流量分析：上传仓库全部文件及 git 历史"
title_translation_status: not_required
title_translation_method: source_title
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
collected_at: 2026-07-13T08:26:47.687Z
language: mixed
full_text_hash: f5329fc911295ccc
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-13/r-097-xai-grok-build-cli-网络流量分析-上传仓库全部文件及-git-历史.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-13/r-097-xai-grok-build-cli-网络流量分析-上传仓库全部文件及-git-历史.json"
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
evidence_strength: blocked
raw_qc_decision: block
raw_qc_downstream_use: not_allowed
degradation_reasons: ["index_only_or_directory_page","missing_full_text","missing_snapshot"]
evidence_completeness: {"original_url_status":"missing","full_text_status":"missing_or_summary_only","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"f5329fc911295ccc","missing":["missing_original_url","missing_full_text","missing_snapshot"]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: summary_only
visible_range: "采集通道提供的标题与摘要"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"xAI Grok Build CLI 网络流量分析：上传仓库全部文件及 git 历史","discovery_summary":"对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件——即使提示“不要读取任何文件”，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces …","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"","discovered_at":"2026-07-13T08:19:13.566Z","rank_on_page":9,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "summary_only"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: e3b0c44298fc1c14
content_hash: f5329fc911295ccc
semantic_hash: b20a8a207189f735
duplicate_of: ""
first_seen_at: "2026-07-13T08:26:47.687Z"
last_seen_at: 2026-07-13T08:26:47.687Z
update_detected: false
raw_status: ignored
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"none","importance_score":1,"importance_reason":"no core WaveSight importance signal","supporting_signals":[],"novelty":3,"evidence_strength":2,"case_richness":3,"trend_relevance":2,"guanlan_relevance":2,"emerging_signal_score":3}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","Google"],"products":[],"people":[],"industries":["开发者工具"],"roles":[],"workflows":[],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["0.2","93","1","200"],"quotes":["不要读取任何文件","不要读取任何文件"]}
evidence_seed: {"company_actions":["对 xAI 官方 Grok Build 编码 CLI（grok 0.","93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 ."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例","没有变化前后流程线索","没有可用全文快照"]
key_excerpts: [{"type":"quote","text":"对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件——即使提示“不要读取任何文件”，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces …","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"对 xAI 官方 Grok Build 编码 CLI（grok 0.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"quote","text":"env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件——即使提示“不要读取任何文件”，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces …","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-13T08:26:47.687Z
theme: mature-commercial-signal
keyword_group: mature-commercial-signal
copyright_note: local research archive only
---

# xAI Grok Build CLI 网络流量分析：上传仓库全部文件及 git 历史

## clean_text

对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件——即使提示“不要读取任何文件”，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces …

## full_text

对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件——即使提示“不要读取任何文件”，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces …

## extraction_diagnostics

- extraction_method: no_url_summary_fallback
- readability_score: 0
- fetch_status: no-url-summary-only
- extraction_quality: failed
- diagnostics: {"method":"no_url_summary_fallback"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=medium
   对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件——即使提示“不要读取任何文件”，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces …

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   对 xAI 官方 Grok Build 编码 CLI（grok 0.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .

4. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=medium
   env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件——即使提示“不要读取任何文件”，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces …

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, Google
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 0.2, 93, 1, 200
- quotes: 不要读取任何文件 / 不要读取任何文件

## evidence_seed

- company_actions: 对 xAI 官方 Grok Build 编码 CLI（grok 0. / 93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: none
- importance_score: 1
- importance_reason: no core WaveSight importance signal
- supporting_signals: 
- novelty: 3
- evidence_strength: 2
- case_richness: 3
- trend_relevance: 2
- guanlan_relevance: 2
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
- 没有具体客户或真实企业案例
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
- discovery_record: {"discovery_title":"xAI Grok Build CLI 网络流量分析：上传仓库全部文件及 git 历史","discovery_summary":"对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件——即使提示“不要读取任何文件”，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces …","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"","discovered_at":"2026-07-13T08:19:13.566Z","rank_on_page":9,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件——即使提示“不要读取任何文件”，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces …

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
