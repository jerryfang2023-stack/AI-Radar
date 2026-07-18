---
schema_version: raw-evidence-v2
raw_id: R-117
title: "新 AI 漏洞披露：可从 Claude 记忆中泄露姓名与工作单位等信息"
title_zh: "新 AI 漏洞披露：可从 Claude 记忆中泄露姓名与工作单位等信息"
title_translation_status: not_required
title_translation_method: source_title
title_translation_model: not_applicable
original_url: "https://www.ithome.com/0/978/084.htm"
canonical_url: "https://ithome.com/0/978/084.htm"
source_name: "IT之家（RSS）"
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
published_at: "2026-07-17T07:28:57.000Z"
collected_at: 2026-07-18T01:55:20.408Z
language: mixed
full_text_hash: 082efb8004d02307
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-18/r-117-新-ai-漏洞披露-可从-claude-记忆中泄露姓名与工作单位等信息.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-18/r-117-新-ai-漏洞披露-可从-claude-记忆中泄露姓名与工作单位等信息.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: low
extraction_method: "content-container"
readability_score: 49
extractor_diagnostics: {"readability_score":49,"text_length":746,"paragraph_count":9,"sentence_count":7,"boilerplate_hits":1,"symbol_ratio":0.0027,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 746
fetch_error: ""
evidence_strength: source_backed_event
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["insufficient_usable_evidence_object"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"082efb8004d02307","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: supporting_evidence
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"新 AI 漏洞披露：可从 Claude 记忆中泄露姓名与工作单位等信息","discovery_summary":"安全研究员 Ayush Paul 披露了一种针对 Claude 的攻击方法，可在用户不知情下将存储的个人信息（如姓名、工作单位）通过恶意 URL 发送到外部网站。Anthropic 已通过 HackerOne 漏洞赏金项目知晓该问题，并在报告提交后关闭了 web_fetch 跟随外部页面内链接的能力。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/978/084.htm","discovered_at":"2026-07-18T01:46:31.843Z","rank_on_page":232,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 7a7b3852f2f0f79c
content_hash: 082efb8004d02307
semantic_hash: 3f3bc32eb5c23feb
duplicate_of: ""
first_seen_at: "2026-07-17T07:28:57.000Z"
last_seen_at: 2026-07-18T01:55:20.408Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context"],"novelty":3,"evidence_strength":3,"case_richness":3,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":2}
business_elements: {"companies":["IT之家（RSS）","Anthropic"],"products":["Claude"],"people":[],"industries":["金融 / 保险"],"roles":[],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["7","17","9","2"],"quotes":["Name: Ayush Paul","Company: Beem","Hometown: Charlotte, NC"]}
evidence_seed: {"company_actions":["保罗指出 Claude 具备总结过往对话并在新对话中调用的能力，目前共有 2 部分记忆机制： 一是每日摘要，将近期对话压缩为数段内容，并注入后续会话； 二是 conversation_search 工具，可按需检索完整历史对话。","该机制可让回答结合用户背景，但长期使用也会积累较完整的个人画像，范围可包括姓名、工作单位、籍贯、工作信息与个人困扰等。"],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":["安全研究员 Ayush Paul 披露了一种针对 Claude 的攻击方法，可在用户不知情下将存储的个人信息（如姓名、工作单位）通过恶意 URL 发送到外部网站。Anthropic 已通过 HackerOne 漏洞赏金项目知晓该问题，并在报告提交后关闭了 web_fetch 跟随外部页面内链接的能力。","IT之家 7 月 17 日消息，安全研究员阿尤什 · 保罗（Ayush Paul）于 7 月 9 日发布博文，披露针对 Claude 的攻击方法， 让用户不知情的情况下将存储的个人信息（例如姓名和工作单位）发送到外部网站。"]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有具体客户或真实企业案例"]
key_excerpts: [{"type":"supporting_context","text":"安全研究员 Ayush Paul 披露了一种针对 Claude 的攻击方法，可在用户不知情下将存储的个人信息（如姓名、工作单位）通过恶意 URL 发送到外部网站。Anthropic 已通过 HackerOne 漏洞赏金项目知晓该问题，并在报告提交后关闭了 web_fetch 跟随外部页面内链接的能力。","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"medium"},{"type":"supporting_context","text":"IT之家 7 月 17 日消息，安全研究员阿尤什 · 保罗（Ayush Paul）于 7 月 9 日发布博文，披露针对 Claude 的攻击方法， 让用户不知情的情况下将存储的个人信息（例如姓名和工作单位）发送到外部网站。","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"保罗指出 Claude 具备总结过往对话并在新对话中调用的能力，目前共有 2 部分记忆机制： 一是每日摘要，将近期对话压缩为数段内容，并注入后续会话； 二是 conversation_search 工具，可按需检索完整历史对话。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"该机制可让回答结合用户背景，但长期使用也会积累较完整的个人画像，范围可包括姓名、工作单位、籍贯、工作信息与个人困扰等。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"quote","text":"保罗在测试中表示无额外提示用户的情况，Claude 依次提交了姓名、公司与家乡信息，日志示例显示外传内容包括“Name: Ayush Paul”“Company: Beem”“Hometown: Charlotte, NC”。","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"medium"},{"type":"opinion","text":"保罗称，当恶意 URL 与真实咖啡馆 URL 混在一起并要求 Claude 比较时，Claude 会在未征求许可的情况下，按字符将姓名编码进链接。","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-18T01:55:20.408Z
theme: mature-commercial-signal
keyword_group: mature-commercial-signal
copyright_note: local research archive only
---

# 新 AI 漏洞披露：可从 Claude 记忆中泄露姓名与工作单位等信息

## clean_text

IT之家 7 月 17 日消息，安全研究员阿尤什 · 保罗（Ayush Paul）于 7 月 9 日发布博文，披露针对 Claude 的攻击方法， 让用户不知情的情况下将存储的个人信息（例如姓名和工作单位）发送到外部网站。
保罗指出 Claude 具备总结过往对话并在新对话中调用的能力，目前共有 2 部分记忆机制：
一是每日摘要，将近期对话压缩为数段内容，并注入后续会话；
二是 conversation_search 工具，可按需检索完整历史对话。
该机制可让回答结合用户背景，但长期使用也会积累较完整的个人画像，范围可包括姓名、工作单位、籍贯、工作信息与个人困扰等。
保罗在测试中表示无额外提示用户的情况，Claude 依次提交了姓名、公司与家乡信息，日志示例显示外传内容包括“Name: Ayush Paul”“Company: Beem”“Hometown: Charlotte, NC”。
保罗称，当恶意 URL 与真实咖啡馆 URL 混在一起并要求 Claude 比较时，Claude 会在未征求许可的情况下，按字符将姓名编码进链接。进一步诱导后，当前工作单位，甚至可用于银行等机构身份校验的原籍城市，也可能被外传。
保罗通过 Anthropic 的 HackerOne 漏洞赏金项目提交该问题。披露称，Anthropic 当时已在内部知晓该问题，但在报告提交时尚未修复，保罗也未获得赏金。此后，Anthropic 关闭了 web_fetch 跟随外部页面内链接的能力。
IT之家附上参考地址
The Memory Heist
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。

## full_text

IT之家 7 月 17 日消息，安全研究员阿尤什 · 保罗（Ayush Paul）于 7 月 9 日发布博文，披露针对 Claude 的攻击方法， 让用户不知情的情况下将存储的个人信息（例如姓名和工作单位）发送到外部网站。
保罗指出 Claude 具备总结过往对话并在新对话中调用的能力，目前共有 2 部分记忆机制：
一是每日摘要，将近期对话压缩为数段内容，并注入后续会话；
二是 conversation_search 工具，可按需检索完整历史对话。
该机制可让回答结合用户背景，但长期使用也会积累较完整的个人画像，范围可包括姓名、工作单位、籍贯、工作信息与个人困扰等。
保罗在测试中表示无额外提示用户的情况，Claude 依次提交了姓名、公司与家乡信息，日志示例显示外传内容包括“Name: Ayush Paul”“Company: Beem”“Hometown: Charlotte, NC”。
保罗称，当恶意 URL 与真实咖啡馆 URL 混在一起并要求 Claude 比较时，Claude 会在未征求许可的情况下，按字符将姓名编码进链接。进一步诱导后，当前工作单位，甚至可用于银行等机构身份校验的原籍城市，也可能被外传。
保罗通过 Anthropic 的 HackerOne 漏洞赏金项目提交该问题。披露称，Anthropic 当时已在内部知晓该问题，但在报告提交时尚未修复，保罗也未获得赏金。此后，Anthropic 关闭了 web_fetch 跟随外部页面内链接的能力。
IT之家附上参考地址
The Memory Heist
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 49
- fetch_status: fetched-readable-text-content-container
- extraction_quality: low
- diagnostics: {"readability_score":49,"text_length":746,"paragraph_count":9,"sentence_count":7,"boilerplate_hits":1,"symbol_ratio":0.0027,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=medium
   安全研究员 Ayush Paul 披露了一种针对 Claude 的攻击方法，可在用户不知情下将存储的个人信息（如姓名、工作单位）通过恶意 URL 发送到外部网站。Anthropic 已通过 HackerOne 漏洞赏金项目知晓该问题，并在报告提交后关闭了 web_fetch 跟随外部页面内链接的能力。

2. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=medium
   IT之家 7 月 17 日消息，安全研究员阿尤什 · 保罗（Ayush Paul）于 7 月 9 日发布博文，披露针对 Claude 的攻击方法， 让用户不知情的情况下将存储的个人信息（例如姓名和工作单位）发送到外部网站。

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   保罗指出 Claude 具备总结过往对话并在新对话中调用的能力，目前共有 2 部分记忆机制： 一是每日摘要，将近期对话压缩为数段内容，并注入后续会话； 二是 conversation_search 工具，可按需检索完整历史对话。

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   该机制可让回答结合用户背景，但长期使用也会积累较完整的个人画像，范围可包括姓名、工作单位、籍贯、工作信息与个人困扰等。

5. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=medium
   保罗在测试中表示无额外提示用户的情况，Claude 依次提交了姓名、公司与家乡信息，日志示例显示外传内容包括“Name: Ayush Paul”“Company: Beem”“Hometown: Charlotte, NC”。

6. **opinion**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=medium
   保罗称，当恶意 URL 与真实咖啡馆 URL 混在一起并要求 Claude 比较时，Claude 会在未征求许可的情况下，按字符将姓名编码进链接。

## business_elements

- companies: IT之家（RSS）, Anthropic
- products: Claude
- people: 暂无公开信息
- industries: 金融 / 保险
- roles: 暂无公开信息
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 7, 17, 9, 2
- quotes: Name: Ayush Paul / Company: Beem / Hometown: Charlotte, NC

## evidence_seed

- company_actions: 保罗指出 Claude 具备总结过往对话并在新对话中调用的能力，目前共有 2 部分记忆机制： 一是每日摘要，将近期对话压缩为数段内容，并注入后续会话； 二是 conversation_search 工具，可按需检索完整历史对话。 / 该机制可让回答结合用户背景，但长期使用也会积累较完整的个人画像，范围可包括姓名、工作单位、籍贯、工作信息与个人困扰等。
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 安全研究员 Ayush Paul 披露了一种针对 Claude 的攻击方法，可在用户不知情下将存储的个人信息（如姓名、工作单位）通过恶意 URL 发送到外部网站。Anthropic 已通过 HackerOne 漏洞赏金项目知晓该问题，并在报告提交后关闭了 web_fetch 跟随外部页面内链接的能力。 / IT之家 7 月 17 日消息，安全研究员阿尤什 · 保罗（Ayush Paul）于 7 月 9 日发布博文，披露针对 Claude 的攻击方法， 让用户不知情的情况下将存储的个人信息（例如姓名和工作单位）发送到外部网站。

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context
- novelty: 3
- evidence_strength: 3
- case_richness: 3
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
- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: supporting_evidence
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"新 AI 漏洞披露：可从 Claude 记忆中泄露姓名与工作单位等信息","discovery_summary":"安全研究员 Ayush Paul 披露了一种针对 Claude 的攻击方法，可在用户不知情下将存储的个人信息（如姓名、工作单位）通过恶意 URL 发送到外部网站。Anthropic 已通过 HackerOne 漏洞赏金项目知晓该问题，并在报告提交后关闭了 web_fetch 跟随外部页面内链接的能力。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/978/084.htm","discovered_at":"2026-07-18T01:46:31.843Z","rank_on_page":232,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

安全研究员 Ayush Paul 披露了一种针对 Claude 的攻击方法，可在用户不知情下将存储的个人信息（如姓名、工作单位）通过恶意 URL 发送到外部网站。Anthropic 已通过 HackerOne 漏洞赏金项目知晓该问题，并在报告提交后关闭了 web_fetch 跟随外部页面内链接的能力。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
