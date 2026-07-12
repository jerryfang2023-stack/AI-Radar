---
schema_version: raw-evidence-v2
raw_id: R-125
title: "xAI Grok Build CLI 网络流量分析：上传仓库全部文件及 git 历史"
title_zh: "xAI Grok Build CLI 网络流量分析：上传仓库全部文件及 git 历史"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://gist.github.com/cereblab/dc9a40bc26120f4540e4e09b75ffb547"
canonical_url: "https://gist.github.com/cereblab/dc9a40bc26120f4540e4e09b75ffb547"
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: developer
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: repo_readme_or_index
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
published_at: "2026-07-12T03:59:09.632Z"
collected_at: 2026-07-12T09:56:07.221Z
language: mixed
full_text_hash: 2692fbb549582ca5
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-125-xai-grok-build-cli-网络流量分析-上传仓库全部文件及-git-历史.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-125-xai-grok-build-cli-网络流量分析-上传仓库全部文件及-git-历史.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: timeout-fallback-visible-text
extraction_quality: low
extraction_method: "fetch_failed_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"fetch_failed_summary_fallback","error_type":"timeout"}
has_full_text: true
content_length: 507
fetch_error: "fetch failed (code=UND_ERR_CONNECT_TIMEOUT)"
evidence_strength: blocked
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["index_only_or_directory_page","missing_snapshot"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"2692fbb549582ca5","missing":["missing_snapshot"]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: aihot_visible_text
visible_range: "仅保留采集通道当时可见文本，未抓到原页面正文"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"xAI Grok Build CLI 网络流量分析：上传仓库全部文件及 git 历史","discovery_summary":"对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件--即使提示\"不要读取任何文件\"，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces 存储桶；三是该上传机制默认开启，且关闭\"改进模型\"设置不会禁用（/v1/settings 仍返回 trace_upload_enabled： true）。在 12 GB 仓库测试中，/v1/storage 传输了 5.10 GiB 数据，而模型对话通道仅传输 192 KB，比例约 27，800 倍。分析未证明 xAI 使用这些数据进行训练，但证实了数据被传输、接收并存储。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://gist.github.com/cereblab/dc9a40bc26120f4540e4e09b75ffb547","discovered_at":"2026-07-12T06:01:47.584Z","rank_on_page":17,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "timeout"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: cbe2d7cc977042f8
content_hash: 2692fbb549582ca5
semantic_hash: ecffd1bc574f311b
duplicate_of: ""
first_seen_at: "2026-07-12T03:59:09.632Z"
last_seen_at: 2026-07-12T09:56:07.221Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"none","importance_score":1,"importance_reason":"no core WaveSight importance signal","supporting_signals":[],"novelty":3,"evidence_strength":3,"case_richness":4,"trend_relevance":2,"guanlan_relevance":2,"emerging_signal_score":3}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","Google"],"products":[],"people":[],"industries":["开发者工具"],"roles":[],"workflows":[],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["0.2","93","1","200","12","5.10","192","27"],"quotes":["不要读取任何文件","不要读取任何文件"]}
evidence_seed: {"company_actions":["对 xAI 官方 Grok Build 编码 CLI（grok 0.","93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .","在 12 GB 仓库测试中，/v1/storage 传输了 5."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例","没有变化前后流程线索"]
key_excerpts: [{"type":"number","text":"对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件--即使提示\"不要读取任何文件\"，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces 存储桶；三是该上传机制默认开启，且关闭\"改进模型\"设置不会禁用（/v1/settings 仍返回 trace_upload_enabled： true）。在 12 GB 仓库测试中，/v1/storage 传输了 5.10 GiB 数据，而模型对话通道仅传输 192 KB，比例约 27，800 倍。分析未证明 xAI 使用这些数据进行训练，但证实了数据被传输、接收并存储。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"对 xAI 官方 Grok Build 编码 CLI（grok 0.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"quote","text":"env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件--即使提示\"不要读取任何文件\"，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces 存储桶；三是该上传机制默认开启，且关闭\"改进模型\"设置不会禁用（/v1/settings 仍返回 trace_upload_enabled： true）。","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"在 12 GB 仓库测试中，/v1/storage 传输了 5.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"number","text":"10 GiB 数据，而模型对话通道仅传输 192 KB，比例约 27，800 倍。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-12T09:56:07.221Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# xAI Grok Build CLI 网络流量分析：上传仓库全部文件及 git 历史

## clean_text

对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件--即使提示"不要读取任何文件"，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces 存储桶；三是该上传机制默认开启，且关闭"改进模型"设置不会禁用（/v1/settings 仍返回 trace_upload_enabled： true）。在 12 GB 仓库测试中，/v1/storage 传输了 5.10 GiB 数据，而模型对话通道仅传输 192 KB，比例约 27，800 倍。分析未证明 xAI 使用这些数据进行训练，但证实了数据被传输、接收并存储。

## full_text

对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件--即使提示"不要读取任何文件"，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces 存储桶；三是该上传机制默认开启，且关闭"改进模型"设置不会禁用（/v1/settings 仍返回 trace_upload_enabled： true）。在 12 GB 仓库测试中，/v1/storage 传输了 5.10 GiB 数据，而模型对话通道仅传输 192 KB，比例约 27，800 倍。分析未证明 xAI 使用这些数据进行训练，但证实了数据被传输、接收并存储。

## extraction_diagnostics

- extraction_method: fetch_failed_summary_fallback
- readability_score: 0
- fetch_status: timeout-fallback-visible-text
- extraction_quality: low
- diagnostics: {"method":"fetch_failed_summary_fallback","error_type":"timeout"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件--即使提示"不要读取任何文件"，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces 存储桶；三是该上传机制默认开启，且关闭"改进模型"设置不会禁用（/v1/settings 仍返回 trace_upload_enabled： true）。在 12 GB 仓库测试中，/v1/storage 传输了 5.10 GiB 数据，而模型对话通道仅传输 192 KB，比例约 27，800 倍。分析未证明 xAI 使用这些数据进行训练，但证实了数据被传输、接收并存储。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   对 xAI 官方 Grok Build 编码 CLI（grok 0.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .

4. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=medium
   env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件--即使提示"不要读取任何文件"，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces 存储桶；三是该上传机制默认开启，且关闭"改进模型"设置不会禁用（/v1/settings 仍返回 trace_upload_enabled： true）。

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   在 12 GB 仓库测试中，/v1/storage 传输了 5.

6. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   10 GiB 数据，而模型对话通道仅传输 192 KB，比例约 27，800 倍。

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, Google
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 0.2, 93, 1, 200, 12, 5.10, 192, 27
- quotes: 不要读取任何文件 / 不要读取任何文件

## evidence_seed

- company_actions: 对 xAI 官方 Grok Build 编码 CLI（grok 0. / 93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 . / 在 12 GB 仓库测试中，/v1/storage 传输了 5.
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
- evidence_strength: 3
- case_richness: 4
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
- 疑似官网首页、产品目录或导航页，只能索引留存
- 没有具体客户或真实企业案例
- 没有变化前后流程线索

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News 热门（buzzing.cc 中文翻译）
- capture_scope: aihot_visible_text
- visible_range: 仅保留采集通道当时可见文本，未抓到原页面正文
- evidence_level: discovery_only
- discovery_source: AI HOT
- source_role: discovery_source
- origin_fetch_status: timeout
- discovery_record: {"discovery_title":"xAI Grok Build CLI 网络流量分析：上传仓库全部文件及 git 历史","discovery_summary":"对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件--即使提示\"不要读取任何文件\"，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces 存储桶；三是该上传机制默认开启，且关闭\"改进模型\"设置不会禁用（/v1/settings 仍返回 trace_upload_enabled： true）。在 12 GB 仓库测试中，/v1/storage 传输了 5.10 GiB 数据，而模型对话通道仅传输 192 KB，比例约 27，800 倍。分析未证明 xAI 使用这些数据进行训练，但证实了数据被传输、接收并存储。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://gist.github.com/cereblab/dc9a40bc26120f4540e4e09b75ffb547","discovered_at":"2026-07-12T06:01:47.584Z","rank_on_page":17,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

对 xAI 官方 Grok Build 编码 CLI（grok 0.2.93）的网络流量分析显示，该工具在消费者登录后会向 xAI 发送三类数据：一是它读取的文件内容（包括 .env 密钥文件）以明文形式通过 POST /v1/responses 传输，并同时打包成 session_state 存档通过 POST /v1/storage 上传并获 HTTP 200 确认；二是整个仓库的全部文件内容及 git 历史，独立于 AI 智能体实际读取的文件--即使提示"不要读取任何文件"，Grok 仍将整个仓库作为 git bundle 上传至 Google Cloud Storage 的 grok-code-session-traces 存储桶；三是该上传机制默认开启，且关闭"改进模型"设置不会禁用（/v1/settings 仍返回 trace_upload_enabled： true）。在 12 GB 仓库测试中，/v1/storage 传输了 5.10 GiB 数据，而模型对话通道仅传输 192 KB，比例约 27，800 倍。分析未证明 xAI 使用这些数据进行训练，但证实了数据被传输、接收并存储。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
