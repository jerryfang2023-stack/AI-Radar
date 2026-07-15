---
schema_version: raw-evidence-v2
raw_id: R-021
title: "xAI 的 Grok Build CLI 将 Git 仓库上传到 Google Cloud 存储桶"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://www.internationalcyberdigest.com/xais-grok-build-cli-uploads-entire-git-repositories-to-a-google-cloud-bucket"
canonical_url: "https://internationalcyberdigest.com/xais-grok-build-cli-uploads-entire-git-repositories-to-a-google-cloud-bucket"
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: changelog_or_release
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
published_at: "2026-07-13T15:28:29.000Z"
collected_at: 2026-07-15T04:28:37.659Z
language: mixed
full_text_hash: e40d4a59013232d0
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-15/r-021-xai-的-grok-build-cli-将-git-仓库上传到-google-cloud-存储桶.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-15/r-021-xai-的-grok-build-cli-将-git-仓库上传到-google-cloud-存储桶.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 82
extractor_diagnostics: {"readability_score":82,"text_length":4292,"paragraph_count":27,"sentence_count":34,"boilerplate_hits":5,"symbol_ratio":0.0014,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 4292
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"e40d4a59013232d0","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"xAI 的 Grok Build CLI 将 Git 仓库上传到 Google Cloud 存储桶","discovery_summary":"安全研究员 cereblab 通过 mitmproxy 抓包发现，Grok Build CLI 0.2.93 会将整个 Git 仓库（含完整历史）上传至名为 grok-code-session-traces 的 Google Cloud 存储桶。在 12 GB 测试仓库中，模型请求通道仅传输约 192 KB 任务数据，而存储上传量达 5.1 GB。关闭\"Improve the model\"开关并未阻止上传。xAI 在曝光一天后通过服务器端静默修复，返回 disable_codebase_upload： true，但未发布安全公告或说明已收集代码的处理方式。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://www.internationalcyberdigest.com/xais-grok-build-cli-uploads-entire-git-repositories-to-a-google-cloud-bucket","discovered_at":"2026-07-15T04:20:27.109Z","rank_on_page":184,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 96fb9285189e6e36
content_hash: e40d4a59013232d0
semantic_hash: 9636b2ac53774109
duplicate_of: ""
first_seen_at: "2026-07-13T15:28:29.000Z"
last_seen_at: 2026-07-15T04:28:37.659Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":true,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","Google"],"products":["agent","MCP"],"people":[],"industries":["开发者工具"],"roles":["开发者 / 工程团队"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["0.2","93","12","192","5.1","13","2026","15"],"quotes":["Improve the model","Improve the model"]}
evidence_seed: {"company_actions":["The fix arrived as a hidden server-side flag, with no advisory, no statement, and no answer on what happens to code already collected.","What the packet captures showed The findings come from a researcher publishing under the handle cereblab, who routed Grok Build CLI version 0.","93 through the interception proxy mitmproxy on macOS and released the captures as a public gist."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"quote","text":"安全研究员 cereblab 通过 mitmproxy 抓包发现，Grok Build CLI 0.2.93 会将整个 Git 仓库（含完整历史）上传至名为 grok-code-session-traces 的 Google Cloud 存储桶。在 12 GB 测试仓库中，模型请求通道仅传输约 192 KB 任务数据，而存储上传量达 5.1 GB。关闭\"Improve the model\"开关并未阻止上传。xAI 在曝光一天后通过服务器端静默修复，返回 disable_codebase_upload： true，但未发布安全公告或说明已收集代码的处理方式。","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"high","confidence":"high"},{"type":"number","text":"AI Security 13 July 2026 at 15:28 xAI's Grok Build CLI Uploads Entire Git repositories to a Google Cloud Bucket xAI appears to have shut off the mechanism that let its Grok Build CLI upload complete developer repositories to company-controlled cloud storage, according to follow-up testing by the security researcher who exposed the behavior.","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"The fix arrived as a hidden server-side flag, with no advisory, no statement, and no answer on what happens to code already collected.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"What the packet captures showed The findings come from a researcher publishing under the handle cereblab, who routed Grok Build CLI version 0.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"product_update","text":"93 through the interception proxy mitmproxy on macOS and released the captures as a public gist.","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"high","confidence":"high"},{"type":"company_action","text":"The analysis showed the client bundling the entire tracked repository, full Git history included, and uploading it to a Google Cloud Storage bucket named grok-code-session-traces.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-15T04:28:37.659Z
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# xAI 的 Grok Build CLI 将 Git 仓库上传到 Google Cloud 存储桶

## clean_text

AI Security
13 July 2026 at 15:28
xAI's Grok Build CLI Uploads Entire Git repositories to a Google Cloud Bucket
xAI appears to have shut off the mechanism that let its Grok Build CLI upload complete developer repositories to company-controlled cloud storage, according to follow-up testing by the security researcher who exposed the behavior. The fix arrived as a hidden server-side flag, with no advisory, no statement, and no answer on what happens to code already collected.
What the packet captures showed
The findings come from a researcher publishing under the handle cereblab, who routed Grok Build CLI version 0.2.93 through the interception proxy mitmproxy on macOS and released the captures as a public gist. The analysis showed the client bundling the entire tracked repository, full Git history included, and uploading it to a Google Cloud Storage bucket named grok-code-session-traces.
The upload ran independently of the files the agent actually opened for its coding task. The numbers make that distinction concrete. On a 12 GB test repository, the model request channel moved about 192 KB of task-relevant traffic. The storage upload moved roughly 5.1 gigabytes. The tool was not sending what it needed to answer the developer. It was sending the codebase.
A canary credential the researcher planted in a .env file appeared verbatim and unredacted in the captured traffic. And because the CLI uploaded whatever repository it ran in, any team that pointed it at a private or proprietary codebase handed xAI an undisclosed copy of its source history, credentials, and secrets along with it.
The opt-out that did not opt out
Grok Build ships with an "Improve the model" toggle that most developers would read as a data-collection control. Disabling it did not stop the uploads. Server responses still returned trace_upload_enabled: true, and the repository transfer proceeded as normal. The setting governs training consent, not whether code leaves the machine.
Neither the storage bucket nor the upload behavior appears in Grok Build's setup documentation, according to coverage of the analysis, which also notes xAI had marketed the tool as local-first.
A fix shipped in silence
A day after the report went public, the researcher retested the same 0.2.93 client and found the server now returning disable_codebase_upload: true alongside trace_upload_enabled: false. Across six retests, no repository uploads were observed. That points to a deliberate server-side mitigation rolled out after the exposure, flipped remotely and invisibly.
The caveats cut both ways. The mitigation has been verified on one machine and one account, so there is no confirmation it is global, staged, or permanent. At the same time, the researcher is explicit that the captures do not prove xAI trained on the uploaded code, that employees viewed it, or that every account received the same configuration. This is a finding about undisclosed collection, not confirmed misuse.
What is entirely missing is xAI's side of the story. No security advisory. No explanation of the upload's purpose, scope, or retention. No word on whether repositories already sitting in grok-code-session-traces will be deleted. The official changelog listed version 0.2.98 as the latest release on July 12, 2026 without mentioning repository-upload behavior at all.
International Cyber Digest
Get the ICD Newsletter
Subscribe for source-forward cyber news, OSINT notes, breach updates, and analysis. Have evidence or a lead? Send it to ICD.
Subscribe
Send a tip
Subscribe
Get the ICD Newsletter: cyber news, OSINT notes, sources, and analysis.
You might also like
Scanners Are Hunting MCP Servers and AI Assistant Credentials
Scanners Are Hunting MCP Servers and AI Assistant Credentials
Scanners Are Hunting MCP Servers and AI Assistant Credentials
Scanners Are Hunting MCP Servers and AI Assistant Credentials
Scanners Are Hunting MCP Servers and AI Assistant Credentials
Scanners Are Hunting MCP Servers and AI Assistant Credentials
AI Security
members
Scanners Are Hunting MCP Servers and AI Assistant Credentials
The server in question should have been boring. A SANS Internet Storm Center handler, Manuel Humberto Santander Peláez, pulled two weeks of Apache and ModSecurity logs from a&hellip;
13 July 2026 at 19:52

## full_text

AI Security
13 July 2026 at 15:28
xAI's Grok Build CLI Uploads Entire Git repositories to a Google Cloud Bucket
xAI appears to have shut off the mechanism that let its Grok Build CLI upload complete developer repositories to company-controlled cloud storage, according to follow-up testing by the security researcher who exposed the behavior. The fix arrived as a hidden server-side flag, with no advisory, no statement, and no answer on what happens to code already collected.
What the packet captures showed
The findings come from a researcher publishing under the handle cereblab, who routed Grok Build CLI version 0.2.93 through the interception proxy mitmproxy on macOS and released the captures as a public gist. The analysis showed the client bundling the entire tracked repository, full Git history included, and uploading it to a Google Cloud Storage bucket named grok-code-session-traces.
The upload ran independently of the files the agent actually opened for its coding task. The numbers make that distinction concrete. On a 12 GB test repository, the model request channel moved about 192 KB of task-relevant traffic. The storage upload moved roughly 5.1 gigabytes. The tool was not sending what it needed to answer the developer. It was sending the codebase.
A canary credential the researcher planted in a .env file appeared verbatim and unredacted in the captured traffic. And because the CLI uploaded whatever repository it ran in, any team that pointed it at a private or proprietary codebase handed xAI an undisclosed copy of its source history, credentials, and secrets along with it.
The opt-out that did not opt out
Grok Build ships with an "Improve the model" toggle that most developers would read as a data-collection control. Disabling it did not stop the uploads. Server responses still returned trace_upload_enabled: true, and the repository transfer proceeded as normal. The setting governs training consent, not whether code leaves the machine.
Neither the storage bucket nor the upload behavior appears in Grok Build's setup documentation, according to coverage of the analysis, which also notes xAI had marketed the tool as local-first.
A fix shipped in silence
A day after the report went public, the researcher retested the same 0.2.93 client and found the server now returning disable_codebase_upload: true alongside trace_upload_enabled: false. Across six retests, no repository uploads were observed. That points to a deliberate server-side mitigation rolled out after the exposure, flipped remotely and invisibly.
The caveats cut both ways. The mitigation has been verified on one machine and one account, so there is no confirmation it is global, staged, or permanent. At the same time, the researcher is explicit that the captures do not prove xAI trained on the uploaded code, that employees viewed it, or that every account received the same configuration. This is a finding about undisclosed collection, not confirmed misuse.
What is entirely missing is xAI's side of the story. No security advisory. No explanation of the upload's purpose, scope, or retention. No word on whether repositories already sitting in grok-code-session-traces will be deleted. The official changelog listed version 0.2.98 as the latest release on July 12, 2026 without mentioning repository-upload behavior at all.
International Cyber Digest
Get the ICD Newsletter
Subscribe for source-forward cyber news, OSINT notes, breach updates, and analysis. Have evidence or a lead? Send it to ICD.
Subscribe
Send a tip
Subscribe
Get the ICD Newsletter: cyber news, OSINT notes, sources, and analysis.
You might also like
Scanners Are Hunting MCP Servers and AI Assistant Credentials
Scanners Are Hunting MCP Servers and AI Assistant Credentials
Scanners Are Hunting MCP Servers and AI Assistant Credentials
Scanners Are Hunting MCP Servers and AI Assistant Credentials
Scanners Are Hunting MCP Servers and AI Assistant Credentials
Scanners Are Hunting MCP Servers and AI Assistant Credentials
AI Security
members
Scanners Are Hunting MCP Servers and AI Assistant Credentials
The server in question should have been boring. A SANS Internet Storm Center handler, Manuel Humberto Santander Peláez, pulled two weeks of Apache and ModSecurity logs from a&hellip;
13 July 2026 at 19:52

## extraction_diagnostics

- extraction_method: main
- readability_score: 82
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":82,"text_length":4292,"paragraph_count":27,"sentence_count":34,"boilerplate_hits":5,"symbol_ratio":0.0014,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=high｜confidence=high
   安全研究员 cereblab 通过 mitmproxy 抓包发现，Grok Build CLI 0.2.93 会将整个 Git 仓库（含完整历史）上传至名为 grok-code-session-traces 的 Google Cloud 存储桶。在 12 GB 测试仓库中，模型请求通道仅传输约 192 KB 任务数据，而存储上传量达 5.1 GB。关闭"Improve the model"开关并未阻止上传。xAI 在曝光一天后通过服务器端静默修复，返回 disable_codebase_upload： true，但未发布安全公告或说明已收集代码的处理方式。

2. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   AI Security 13 July 2026 at 15:28 xAI's Grok Build CLI Uploads Entire Git repositories to a Google Cloud Bucket xAI appears to have shut off the mechanism that let its Grok Build CLI upload complete developer repositories to company-controlled cloud storage, according to follow-up testing by the security researcher who exposed the behavior.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   The fix arrived as a hidden server-side flag, with no advisory, no statement, and no answer on what happens to code already collected.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   What the packet captures showed The findings come from a researcher publishing under the handle cereblab, who routed Grok Build CLI version 0.

5. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=high｜confidence=high
   93 through the interception proxy mitmproxy on macOS and released the captures as a public gist.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   The analysis showed the client bundling the entire tracked repository, full Git history included, and uploading it to a Google Cloud Storage bucket named grok-code-session-traces.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, Google
- products: agent, MCP
- people: 暂无公开信息
- industries: 开发者工具
- roles: 开发者 / 工程团队
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 0.2, 93, 12, 192, 5.1, 13, 2026, 15
- quotes: Improve the model / Improve the model

## evidence_seed

- company_actions: The fix arrived as a hidden server-side flag, with no advisory, no statement, and no answer on what happens to code already collected. / What the packet captures showed The findings come from a researcher publishing under the handle cereblab, who routed Grok Build CLI version 0. / 93 through the interception proxy mitmproxy on macOS and released the captures as a public gist.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 3

## usable_for

- viewpoint: true
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: true
- emerging_pool: false
- user_feedback_pool: false
- watchlist: true

## pool_routes

- watchlist

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News 热门（buzzing.cc 中文翻译）
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: user_feedback_signal
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"xAI 的 Grok Build CLI 将 Git 仓库上传到 Google Cloud 存储桶","discovery_summary":"安全研究员 cereblab 通过 mitmproxy 抓包发现，Grok Build CLI 0.2.93 会将整个 Git 仓库（含完整历史）上传至名为 grok-code-session-traces 的 Google Cloud 存储桶。在 12 GB 测试仓库中，模型请求通道仅传输约 192 KB 任务数据，而存储上传量达 5.1 GB。关闭\"Improve the model\"开关并未阻止上传。xAI 在曝光一天后通过服务器端静默修复，返回 disable_codebase_upload： true，但未发布安全公告或说明已收集代码的处理方式。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://www.internationalcyberdigest.com/xais-grok-build-cli-uploads-entire-git-repositories-to-a-google-cloud-bucket","discovered_at":"2026-07-15T04:20:27.109Z","rank_on_page":184,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

安全研究员 cereblab 通过 mitmproxy 抓包发现，Grok Build CLI 0.2.93 会将整个 Git 仓库（含完整历史）上传至名为 grok-code-session-traces 的 Google Cloud 存储桶。在 12 GB 测试仓库中，模型请求通道仅传输约 192 KB 任务数据，而存储上传量达 5.1 GB。关闭"Improve the model"开关并未阻止上传。xAI 在曝光一天后通过服务器端静默修复，返回 disable_codebase_upload： true，但未发布安全公告或说明已收集代码的处理方式。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
