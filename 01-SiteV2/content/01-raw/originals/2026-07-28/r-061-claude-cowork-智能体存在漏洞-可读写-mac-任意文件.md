---
schema_version: raw-evidence-v2
raw_id: R-061
title: "Claude Cowork 智能体存在漏洞，可读写 Mac 任意文件"
title_zh: "Claude Cowork 智能体存在漏洞，可读写 Mac 任意文件"
title_translation_status: not_required
title_translation_method: source_title
title_translation_model: not_applicable
original_url: "https://www.ithome.com/0/982/277.htm"
canonical_url: "https://ithome.com/0/982/277.htm"
source_name: "IT之家（RSS）"
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
published_at: "2026-07-27T22:57:17.000Z"
collected_at: 2026-07-28T05:39:44.960Z
language: mixed
full_text_hash: 3caeb50d4cc86577
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-28/r-061-claude-cowork-智能体存在漏洞-可读写-mac-任意文件.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-28/r-061-claude-cowork-智能体存在漏洞-可读写-mac-任意文件.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: medium
extraction_method: "content-container"
readability_score: 52
extractor_diagnostics: {"readability_score":52,"text_length":1017,"paragraph_count":10,"sentence_count":11,"boilerplate_hits":3,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 1017
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"3caeb50d4cc86577","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Claude Cowork 智能体存在漏洞，可读写 Mac 任意文件","discovery_summary":"Anthropic 的 Claude Cowork AI 智能体存在安全漏洞，攻击者可利用 Linux 内核漏洞从虚拟机沙箱逃逸，读写 Mac 任意位置文件并获取在线服务登录凭据。该漏洞影响约 50 万运行本地 Cowork 会话的 macOS 用户。Anthropic 未发布直接修复，后续版本默认在云端执行以绕过本地逃逸路径。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/982/277.htm","discovered_at":"2026-07-28T05:29:44.800Z","rank_on_page":97,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 17b15a475b42b9f3
content_hash: 3caeb50d4cc86577
semantic_hash: 8b0b990f59b9e152
duplicate_of: ""
first_seen_at: "2026-07-27T22:57:17.000Z"
last_seen_at: 2026-07-28T05:39:44.960Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["IT之家（RSS）","Anthropic"],"products":["Claude"],"people":[],"industries":["开发者工具"],"roles":["开发者 / 工程团队"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["50 万","7","28","9","5M","27","2","2026"],"quotes":["pedit COW"]}
evidence_seed: {"company_actions":["IT之家注：Claude Cowork 是 Anthropic 推出的 AI 智能体工具，在征得用户明确授权许可之后，该工具可以在 Mac 上访问本地文件和文件夹，并依据用户指令处理相关任务。","攻击者可让 Cowork 逃离其运行所在的 Linux 虚拟机沙箱，并在 Mac 任意位置读取或写入文件。"],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":["IT之家 7 月 28 日消息，科技媒体 9to5Mac 昨日（7 月 27 日）发布博文，报道称 Anthropic 的 Claude Cowork 存在安全漏洞， 攻击者利用漏洞可以从 Linux 虚拟机沙箱逃逸，并读写 Mac 任意位置文件。","在安全防护方面，Anthropic 为此设置 2 层限制，其一是 Cowork 在虚拟机内隔离运行，其二是仅可访问用户授权的文件与文件夹。","安全研究人员发现， 开发者利用该漏洞可同时突破上述 2 层限制。"]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"Anthropic 的 Claude Cowork AI 智能体存在安全漏洞，攻击者可利用 Linux 内核漏洞从虚拟机沙箱逃逸，读写 Mac 任意位置文件并获取在线服务登录凭据。该漏洞影响约 50 万运行本地 Cowork 会话的 macOS 用户。Anthropic 未发布直接修复，后续版本默认在云端执行以绕过本地逃逸路径。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"supporting_context","text":"IT之家 7 月 28 日消息，科技媒体 9to5Mac 昨日（7 月 27 日）发布博文，报道称 Anthropic 的 Claude Cowork 存在安全漏洞， 攻击者利用漏洞可以从 Linux 虚拟机沙箱逃逸，并读写 Mac 任意位置文件。","supports":["signal_card_candidate","relationship_graph_input"],"importance":"high","confidence":"medium"},{"type":"product_update","text":"IT之家注：Claude Cowork 是 Anthropic 推出的 AI 智能体工具，在征得用户明确授权许可之后，该工具可以在 Mac 上访问本地文件和文件夹，并依据用户指令处理相关任务。","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"high","confidence":"medium"},{"type":"supporting_context","text":"在安全防护方面，Anthropic 为此设置 2 层限制，其一是 Cowork 在虚拟机内隔离运行，其二是仅可访问用户授权的文件与文件夹。","supports":["signal_card_candidate","relationship_graph_input"],"importance":"high","confidence":"medium"},{"type":"supporting_context","text":"安全研究人员发现， 开发者利用该漏洞可同时突破上述 2 层限制。","supports":["signal_card_candidate","relationship_graph_input"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"攻击者可让 Cowork 逃离其运行所在的 Linux 虚拟机沙箱，并在 Mac 任意位置读取或写入文件。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-28T05:39:44.960Z
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Claude Cowork 智能体存在漏洞，可读写 Mac 任意文件

## clean_text

IT之家 7 月 28 日消息，科技媒体 9to5Mac 昨日（7 月 27 日）发布博文，报道称 Anthropic 的 Claude Cowork 存在安全漏洞， 攻击者利用漏洞可以从 Linux 虚拟机沙箱逃逸，并读写 Mac 任意位置文件。
IT之家注：Claude Cowork 是 Anthropic 推出的 AI 智能体工具，在征得用户明确授权许可之后，该工具可以在 Mac 上访问本地文件和文件夹，并依据用户指令处理相关任务。
在安全防护方面，Anthropic 为此设置 2 层限制，其一是 Cowork 在虚拟机内隔离运行，其二是仅可访问用户授权的文件与文件夹。
安全研究人员发现， 开发者利用该漏洞可同时突破上述 2 层限制。 攻击者可让 Cowork 逃离其运行所在的 Linux 虚拟机沙箱，并在 Mac 任意位置读取或写入文件。漏洞还可能使攻击者获取在线服务的登录凭据。
在具体实现方面，Accomplish AI 公司指出 Cowork 隔离运行的虚拟机可以通过可写的 VirtioFS 挂载点共享宿主机文件系统。该挂载点原本只允许虚拟机内的 root 用户访问，但研究人员发现，他们可以利用 CVE-2026-46331（一个被称为“pedit COW”的 Linux 内核漏洞，其严重性评分接近 8 分，满分 10 分）从会话用户提升到虚拟机 root 用户权限。
一旦智能体程序获得虚拟机内的 root 权限，它就可以访问登录的 Mac 用户能够访问的任何资源。
在影响规模方面，Accomplish AI 在漏洞披露前已向 The Hacker News 分享了该漏洞的详细信息。该公司表示，在漏洞修复前，影响约有 50 万运行本地 Cowork 会话的 macOS 用户。
据 Hacker News 报道，Anthropic 公司将该报告标记为“信息丰富”（ informative ），但并未发布直接的解决方案。随后发布的 Claude Cowork 版本默认在云端执行，完全绕过了本地逃逸路径。
然而，选择在本地而非云端运行智能体的用户仍然面临风险，除非他们通过禁用非特权用户命名空间、限制文件系统共享以及使用严格的挂载保护来强化配置。
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。

## full_text

IT之家 7 月 28 日消息，科技媒体 9to5Mac 昨日（7 月 27 日）发布博文，报道称 Anthropic 的 Claude Cowork 存在安全漏洞， 攻击者利用漏洞可以从 Linux 虚拟机沙箱逃逸，并读写 Mac 任意位置文件。
IT之家注：Claude Cowork 是 Anthropic 推出的 AI 智能体工具，在征得用户明确授权许可之后，该工具可以在 Mac 上访问本地文件和文件夹，并依据用户指令处理相关任务。
在安全防护方面，Anthropic 为此设置 2 层限制，其一是 Cowork 在虚拟机内隔离运行，其二是仅可访问用户授权的文件与文件夹。
安全研究人员发现， 开发者利用该漏洞可同时突破上述 2 层限制。 攻击者可让 Cowork 逃离其运行所在的 Linux 虚拟机沙箱，并在 Mac 任意位置读取或写入文件。漏洞还可能使攻击者获取在线服务的登录凭据。
在具体实现方面，Accomplish AI 公司指出 Cowork 隔离运行的虚拟机可以通过可写的 VirtioFS 挂载点共享宿主机文件系统。该挂载点原本只允许虚拟机内的 root 用户访问，但研究人员发现，他们可以利用 CVE-2026-46331（一个被称为“pedit COW”的 Linux 内核漏洞，其严重性评分接近 8 分，满分 10 分）从会话用户提升到虚拟机 root 用户权限。
一旦智能体程序获得虚拟机内的 root 权限，它就可以访问登录的 Mac 用户能够访问的任何资源。
在影响规模方面，Accomplish AI 在漏洞披露前已向 The Hacker News 分享了该漏洞的详细信息。该公司表示，在漏洞修复前，影响约有 50 万运行本地 Cowork 会话的 macOS 用户。
据 Hacker News 报道，Anthropic 公司将该报告标记为“信息丰富”（ informative ），但并未发布直接的解决方案。随后发布的 Claude Cowork 版本默认在云端执行，完全绕过了本地逃逸路径。
然而，选择在本地而非云端运行智能体的用户仍然面临风险，除非他们通过禁用非特权用户命名空间、限制文件系统共享以及使用严格的挂载保护来强化配置。
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 52
- fetch_status: fetched-readable-text-content-container
- extraction_quality: medium
- diagnostics: {"readability_score":52,"text_length":1017,"paragraph_count":10,"sentence_count":11,"boilerplate_hits":3,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   Anthropic 的 Claude Cowork AI 智能体存在安全漏洞，攻击者可利用 Linux 内核漏洞从虚拟机沙箱逃逸，读写 Mac 任意位置文件并获取在线服务登录凭据。该漏洞影响约 50 万运行本地 Cowork 会话的 macOS 用户。Anthropic 未发布直接修复，后续版本默认在云端执行以绕过本地逃逸路径。

2. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=high｜confidence=medium
   IT之家 7 月 28 日消息，科技媒体 9to5Mac 昨日（7 月 27 日）发布博文，报道称 Anthropic 的 Claude Cowork 存在安全漏洞， 攻击者利用漏洞可以从 Linux 虚拟机沙箱逃逸，并读写 Mac 任意位置文件。

3. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=high｜confidence=medium
   IT之家注：Claude Cowork 是 Anthropic 推出的 AI 智能体工具，在征得用户明确授权许可之后，该工具可以在 Mac 上访问本地文件和文件夹，并依据用户指令处理相关任务。

4. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=high｜confidence=medium
   在安全防护方面，Anthropic 为此设置 2 层限制，其一是 Cowork 在虚拟机内隔离运行，其二是仅可访问用户授权的文件与文件夹。

5. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=high｜confidence=medium
   安全研究人员发现， 开发者利用该漏洞可同时突破上述 2 层限制。

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   攻击者可让 Cowork 逃离其运行所在的 Linux 虚拟机沙箱，并在 Mac 任意位置读取或写入文件。

## business_elements

- companies: IT之家（RSS）, Anthropic
- products: Claude
- people: 暂无公开信息
- industries: 开发者工具
- roles: 开发者 / 工程团队
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 50 万, 7, 28, 9, 5M, 27, 2, 2026
- quotes: pedit COW

## evidence_seed

- company_actions: IT之家注：Claude Cowork 是 Anthropic 推出的 AI 智能体工具，在征得用户明确授权许可之后，该工具可以在 Mac 上访问本地文件和文件夹，并依据用户指令处理相关任务。 / 攻击者可让 Cowork 逃离其运行所在的 Linux 虚拟机沙箱，并在 Mac 任意位置读取或写入文件。
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: IT之家 7 月 28 日消息，科技媒体 9to5Mac 昨日（7 月 27 日）发布博文，报道称 Anthropic 的 Claude Cowork 存在安全漏洞， 攻击者利用漏洞可以从 Linux 虚拟机沙箱逃逸，并读写 Mac 任意位置文件。 / 在安全防护方面，Anthropic 为此设置 2 层限制，其一是 Cowork 在虚拟机内隔离运行，其二是仅可访问用户授权的文件与文件夹。 / 安全研究人员发现， 开发者利用该漏洞可同时突破上述 2 层限制。

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

- viewpoint: false
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

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Claude Cowork 智能体存在漏洞，可读写 Mac 任意文件","discovery_summary":"Anthropic 的 Claude Cowork AI 智能体存在安全漏洞，攻击者可利用 Linux 内核漏洞从虚拟机沙箱逃逸，读写 Mac 任意位置文件并获取在线服务登录凭据。该漏洞影响约 50 万运行本地 Cowork 会话的 macOS 用户。Anthropic 未发布直接修复，后续版本默认在云端执行以绕过本地逃逸路径。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/982/277.htm","discovered_at":"2026-07-28T05:29:44.800Z","rank_on_page":97,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Anthropic 的 Claude Cowork AI 智能体存在安全漏洞，攻击者可利用 Linux 内核漏洞从虚拟机沙箱逃逸，读写 Mac 任意位置文件并获取在线服务登录凭据。该漏洞影响约 50 万运行本地 Cowork 会话的 macOS 用户。Anthropic 未发布直接修复，后续版本默认在云端执行以绕过本地逃逸路径。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
