---
schema_version: raw-evidence-v2
raw_id: R-033
title: "Secret Claude tracker shocks users after Anthropic’s anti-surveillance stance"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: missing_translation_db_entry
original_url: "https://arstechnica.com/tech-policy/2026/07/anthropic-outed-for-claude-tracker-that-secretly-monitored-chinese-users/"
canonical_url: "https://arstechnica.com/tech-policy/2026/07/anthropic-outed-for-claude-tracker-that-secretly-monitored-chinese-users"
source_name: "Ars Technica AI"
source_type: media
source_level: A
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: rss-feed
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: ""
collected_at: 2026-07-07T02:01:23.500Z
language: mixed
full_text_hash: a5f7eb2ca0904d9a
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-07/r-033-secret-claude-tracker-shocks-users-after-anthropic-s-anti-surveillance.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-07/r-033-secret-claude-tracker-shocks-users-after-anthropic-s-anti-surveillance.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":8263,"paragraph_count":36,"sentence_count":45,"boilerplate_hits":2,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 8263
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"a5f7eb2ca0904d9a","missing":[]}
source_volatility: low
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: ""
discovery_record: null
source_role: resolved_original_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 138cc76acfd0a525
content_hash: a5f7eb2ca0904d9a
semantic_hash: 15c5291f38da1a04
duplicate_of: ""
first_seen_at: "2026-07-07T02:01:23.500Z"
last_seen_at: 2026-07-07T02:01:23.500Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":true,"case":true,"business_change":true,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"supporting_signal","importance_score":2,"importance_reason":"consumer entertainment or minor platform policy feature; AI-adjacent but not a core business signal","supporting_signals":["low_value_ai_adjacent_context"],"novelty":2,"evidence_strength":4,"case_richness":5,"trend_relevance":2,"guanlan_relevance":2,"emerging_signal_score":3}
business_elements: {"companies":["Ars Technica AI","OpenAI","Anthropic"],"products":["Claude","agents"],"people":[],"industries":["法律 / 法务","开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队","法务 / 律师"],"workflows":["合同审阅 / 法律研究","计费 / 预算管理","权限 / 安全治理"],"business_actions":["发布 / 推出","合作 / 联盟"],"affected_departments":["IT / 安全","法务","财务 / 预算"],"numbers":["$1","$100 m","$12","4.8 m","12","24","500","20"],"quotes":["experiment","serious breach of user trust.","Thereallo","prompt steganography","in plain sight."]}
evidence_seed: {"company_actions":["” This code wasn’t malicious, but it was sending information to Anthropic that most users wouldn’t detect, relying on shorthand markers to quietly flag users’ timezone, proxy, and potential connection to Chinese AI labs that Anthropic has accused of distillation attacks .","According to Shihipar, the code “was meant to prevent account abuse from unauthorized resellers and protect against distillation."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队","法务 / 律师"],"risks_or_constraints":["Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Anthropic quickly removed a tracker secretly monitoring Claude Code users in China after a security researcher exposed the hidden code and condemned the spyware-like tracking as a “serious breach of user trust."]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"quote","text":"Anthropic accused of spying on users; engineer says “experiment” is over.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"high"},{"type":"supporting_context","text":"Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Anthropic quickly removed a tracker secretly monitoring Claude Code users in China after a security researcher exposed the hidden code and condemned the spyware-like tracking as a “serious breach of user trust.","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"high"},{"type":"quote","text":"” Last week, a web developer known as “Thereallo” was researching privacy issues in Claude Code and was shocked to find that the AI firm was using “prompt steganography” to hide code that tracks Chinese users “in plain sight.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"” This code wasn’t malicious, but it was sending information to Anthropic that most users wouldn’t detect, relying on shorthand markers to quietly flag users’ timezone, proxy, and potential connection to Chinese AI labs that Anthropic has accused of distillation attacks .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"quote","text":"On X, Anthropic engineer Thariq Shihipar confirmed that the tracker was added to Claude Code as an “experiment” in March.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"According to Shihipar, the code “was meant to prevent account abuse from unauthorized resellers and protect against distillation.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-07T02:01:23.500Z
theme: uncategorized
keyword_group: uncategorized
copyright_note: local research archive only
---

# Secret Claude tracker shocks users after Anthropic’s anti-surveillance stance

## clean_text

Skip to content
Text
settings
Story text
Size
Small
Standard
Large
Width
Standard
Wide
Links
Standard
Orange
* Subscribers only
Learn more
Minimize to nav
Anthropic quickly removed a tracker secretly monitoring Claude Code users in China after a security researcher exposed the hidden code and condemned the spyware-like tracking as a “serious breach of user trust.”
Last week, a web developer known as “Thereallo” was researching privacy issues in Claude Code and was shocked to find that the AI firm was using “prompt steganography” to hide code that tracks Chinese users “in plain sight.” This code wasn’t malicious, but it was sending information to Anthropic that most users wouldn’t detect, relying on shorthand markers to quietly flag users’ timezone, proxy, and potential connection to Chinese AI labs that Anthropic has accused of distillation attacks .
On X, Anthropic engineer Thariq Shihipar confirmed that the tracker was added to Claude Code as an “experiment” in March. According to Shihipar, the code “was meant to prevent account abuse from unauthorized resellers and protect against distillation.” Regarding the former, The Washington Post found unauthorized retailers have sold access to free models for $1 a month, and pro subscriptions that can cost $100 monthly sell for “as little as $12.”
Supposedly, Anthropic has “actually been meaning to take this down for a while,” Shihipar said of the hidden code, because engineers have “landed stronger mitigations since then.”
Privacy advocates were not happy with the explanation, though, warning that the code is evidence that Anthropic is willing to cross lines to surveil users. That’s perhaps especially surprising, considering that Anthropic riled the Trump administration by refusing to allow the US government to use Claude to surveil US users. The AI firm has since sued the White House over the clash.
Anthropic wants distillation deemed illegal
The Post suggested that the tracker incident is a sign that US firms like Anthropic are taking “increasingly aggressive measures” to block Chinese AI firms from copying their models.
A more defensive stance has apparently become critical. In the past year, Chinese firms have “consistently matched” US firms’ model capabilities “within months,” the Post reported. Most recently, “a new, free AI model from Chinese company Zhipu AI was better at finding computer vulnerabilities than Anthropic’s Claude Opus 4.8 model, which was released in May,” the Post reported.
To lock in a 12- or possibly even 24-month lead for the US, Anthropic has said the US must ramp up interventions, using a range of possible penalties to combat distillation attacks , including blocking access to advanced models, chips, and data centers in the US.
Although distillation isn’t illegal (leading US firms do it, too), prompting models like Claude millions of times in order to quickly advance Chinese models violates Anthropic’s user terms.
To end the endless copying, Anthropic has joined OpenAI in urging the US to view distillation attacks as a form of intellectual property theft. At a recent Senate hearing, Sen. Tim Scott (R-S.C.) agreed legal intervention is needed, arguing that the US needs “to carefully craft export control policy that is clear and concise” to stop China from using such attacks to “gain a technological edge,” the Post reported.
Secret code triggers Alibaba Claude ban
It’s clear that Chinese firms are distilling US models, the Post reported. In February, Chinese researchers at Peking University and the state-funded Chinese Academy of Sciences “developed methods to detect signs of distillation in leading large language models” and found that most Chinese models “showed substantial evidence of distillation,” primarily of US models. One of Alibaba’s Qwen AI models—which Anthropic has since claimed was advanced after the largest distillation attack ever on Claude in June—“repeatedly appeared to mimic” Claude in February. In some intensive tests, the model would even sometimes slip up and identify itself as Claude, researchers found.
Alibaba has not commented on Anthropic’s accusations, but the company has moved to distance itself from Anthropic’s models amid ongoing scrutiny.
Last Friday, Alibaba banned its employees from using Claude Code for work, the South China Morning Post reported . According to a memo SCMP reviewed, Alibaba told employees the ban came in direct response to concerning news about a tracker Anthropic is using to monitor Chinese users.
“As Claude Code was recently discovered to carry back-door risks, after comprehensive evaluation, Claude Code has now been added to a list of high-risk software with security vulnerabilities,” the memo said.
For Alibaba, ignoring Anthropic’s determination to detect users connected to leading Chinese AI labs is risky.
Unlike individual users who can easily pay for cheap circumvention tech to evade Anthropic’s location blockers without fears of major repercussions, Alibaba could be exposed to legal and compliance risks if caught violating Anthropic’s terms, a source granted anonymity to discuss Alibaba’s Claude ban told Reuters .
For Anthropic, allowing the attacks to continue could hurt the company’s business. Some open source Chinese models are more popular than free and open American counterparts, the Post reported, and Fortune 500 CEOs have made it clear that they’re searching for cheaper AI solutions. For the US, not only would moving to block Chinese distillation of American models be challenging, but it could also be unpopular—blocking Americans from benefiting from cheaper AI alternatives from China, the Post suggested.
Anthropic tracking crossed “scary boundary”
In this climate, where a chatbot user’s loyalty depends on a cost-benefit analysis weighing the cost of accessing models against their capabilities, Anthropic likely can’t afford to lose user trust as it fights to keep frontier models ahead of China’s.
As the web developer who flagged the hidden tracker noted, it’s “weird” that Anthropic chose to move in secret when the company could have instead chosen to transparently alert users to the infringing user-tracking.
“This is not a malicious feature, but it is a weird choice for a developer tool that asks for trust,” Thereallo’s blog said. The blog noted that “if the client wants to detect custom API gateways, it can say so plainly. It can send an explicit telemetry field with documentation. It can make the policy visible. It can put the behavior in release notes.”
The researcher emphasized that “coding agents already live on the wrong side of a scary boundary. They can inspect code, summarize secrets by accident, run commands, install packages, edit files, and push commits on your local machine.”
Although most users were likely not impacted by the tracking, Thereallo warned that the “correct reaction” is more scrutiny of Claude’s potential for user surveillance, since “the feature mostly punishes the exact people who are easier to fingerprint: normal developers doing weird but legitimate things.”
“Hiding the signal in the system prompt makes every other privacy claim harder to believe,” Thereallo said.
Anthropic did not immediately respond to Ars’ request for comment.
However, a spokesperson told the Post that Chinese labs’ distillation attacks “pose a serious threat to national security and undermine AI safety standards across the industry. That’s why we continue to speak openly about what we’re seeing and work closely with other labs, government, and partners on shared solutions.”
Ashley Belanger
Senior Policy Reporter
Ashley Belanger
Senior Policy Reporter
Ashley is a senior policy reporter for Ars Technica, dedicated to tracking social impacts of emerging policies and new technologies. She is a Chicago-based journalist with 20 years of experience.
89 Comments
Comments
Forum view
Loading comments...
Prev story
Next story
1.
FCC to end Biden-era rule that forces ISPs to list all their fees
2.
Secret Claude tracker shocks users after Anthropic’s anti-surveillance stance
3.
The Czinger 21C might be the wildest car we drive all year
4.
Review: Supergirl is not the disaster its low box office suggests
5.
The incredible shrinking Xbox: Five studios, 3,200 employees let go
Customize

## full_text

Skip to content
Text
settings
Story text
Size
Small
Standard
Large
Width
Standard
Wide
Links
Standard
Orange
* Subscribers only
Learn more
Minimize to nav
Anthropic quickly removed a tracker secretly monitoring Claude Code users in China after a security researcher exposed the hidden code and condemned the spyware-like tracking as a “serious breach of user trust.”
Last week, a web developer known as “Thereallo” was researching privacy issues in Claude Code and was shocked to find that the AI firm was using “prompt steganography” to hide code that tracks Chinese users “in plain sight.” This code wasn’t malicious, but it was sending information to Anthropic that most users wouldn’t detect, relying on shorthand markers to quietly flag users’ timezone, proxy, and potential connection to Chinese AI labs that Anthropic has accused of distillation attacks .
On X, Anthropic engineer Thariq Shihipar confirmed that the tracker was added to Claude Code as an “experiment” in March. According to Shihipar, the code “was meant to prevent account abuse from unauthorized resellers and protect against distillation.” Regarding the former, The Washington Post found unauthorized retailers have sold access to free models for $1 a month, and pro subscriptions that can cost $100 monthly sell for “as little as $12.”
Supposedly, Anthropic has “actually been meaning to take this down for a while,” Shihipar said of the hidden code, because engineers have “landed stronger mitigations since then.”
Privacy advocates were not happy with the explanation, though, warning that the code is evidence that Anthropic is willing to cross lines to surveil users. That’s perhaps especially surprising, considering that Anthropic riled the Trump administration by refusing to allow the US government to use Claude to surveil US users. The AI firm has since sued the White House over the clash.
Anthropic wants distillation deemed illegal
The Post suggested that the tracker incident is a sign that US firms like Anthropic are taking “increasingly aggressive measures” to block Chinese AI firms from copying their models.
A more defensive stance has apparently become critical. In the past year, Chinese firms have “consistently matched” US firms’ model capabilities “within months,” the Post reported. Most recently, “a new, free AI model from Chinese company Zhipu AI was better at finding computer vulnerabilities than Anthropic’s Claude Opus 4.8 model, which was released in May,” the Post reported.
To lock in a 12- or possibly even 24-month lead for the US, Anthropic has said the US must ramp up interventions, using a range of possible penalties to combat distillation attacks , including blocking access to advanced models, chips, and data centers in the US.
Although distillation isn’t illegal (leading US firms do it, too), prompting models like Claude millions of times in order to quickly advance Chinese models violates Anthropic’s user terms.
To end the endless copying, Anthropic has joined OpenAI in urging the US to view distillation attacks as a form of intellectual property theft. At a recent Senate hearing, Sen. Tim Scott (R-S.C.) agreed legal intervention is needed, arguing that the US needs “to carefully craft export control policy that is clear and concise” to stop China from using such attacks to “gain a technological edge,” the Post reported.
Secret code triggers Alibaba Claude ban
It’s clear that Chinese firms are distilling US models, the Post reported. In February, Chinese researchers at Peking University and the state-funded Chinese Academy of Sciences “developed methods to detect signs of distillation in leading large language models” and found that most Chinese models “showed substantial evidence of distillation,” primarily of US models. One of Alibaba’s Qwen AI models—which Anthropic has since claimed was advanced after the largest distillation attack ever on Claude in June—“repeatedly appeared to mimic” Claude in February. In some intensive tests, the model would even sometimes slip up and identify itself as Claude, researchers found.
Alibaba has not commented on Anthropic’s accusations, but the company has moved to distance itself from Anthropic’s models amid ongoing scrutiny.
Last Friday, Alibaba banned its employees from using Claude Code for work, the South China Morning Post reported . According to a memo SCMP reviewed, Alibaba told employees the ban came in direct response to concerning news about a tracker Anthropic is using to monitor Chinese users.
“As Claude Code was recently discovered to carry back-door risks, after comprehensive evaluation, Claude Code has now been added to a list of high-risk software with security vulnerabilities,” the memo said.
For Alibaba, ignoring Anthropic’s determination to detect users connected to leading Chinese AI labs is risky.
Unlike individual users who can easily pay for cheap circumvention tech to evade Anthropic’s location blockers without fears of major repercussions, Alibaba could be exposed to legal and compliance risks if caught violating Anthropic’s terms, a source granted anonymity to discuss Alibaba’s Claude ban told Reuters .
For Anthropic, allowing the attacks to continue could hurt the company’s business. Some open source Chinese models are more popular than free and open American counterparts, the Post reported, and Fortune 500 CEOs have made it clear that they’re searching for cheaper AI solutions. For the US, not only would moving to block Chinese distillation of American models be challenging, but it could also be unpopular—blocking Americans from benefiting from cheaper AI alternatives from China, the Post suggested.
Anthropic tracking crossed “scary boundary”
In this climate, where a chatbot user’s loyalty depends on a cost-benefit analysis weighing the cost of accessing models against their capabilities, Anthropic likely can’t afford to lose user trust as it fights to keep frontier models ahead of China’s.
As the web developer who flagged the hidden tracker noted, it’s “weird” that Anthropic chose to move in secret when the company could have instead chosen to transparently alert users to the infringing user-tracking.
“This is not a malicious feature, but it is a weird choice for a developer tool that asks for trust,” Thereallo’s blog said. The blog noted that “if the client wants to detect custom API gateways, it can say so plainly. It can send an explicit telemetry field with documentation. It can make the policy visible. It can put the behavior in release notes.”
The researcher emphasized that “coding agents already live on the wrong side of a scary boundary. They can inspect code, summarize secrets by accident, run commands, install packages, edit files, and push commits on your local machine.”
Although most users were likely not impacted by the tracking, Thereallo warned that the “correct reaction” is more scrutiny of Claude’s potential for user surveillance, since “the feature mostly punishes the exact people who are easier to fingerprint: normal developers doing weird but legitimate things.”
“Hiding the signal in the system prompt makes every other privacy claim harder to believe,” Thereallo said.
Anthropic did not immediately respond to Ars’ request for comment.
However, a spokesperson told the Post that Chinese labs’ distillation attacks “pose a serious threat to national security and undermine AI safety standards across the industry. That’s why we continue to speak openly about what we’re seeing and work closely with other labs, government, and partners on shared solutions.”
Ashley Belanger
Senior Policy Reporter
Ashley Belanger
Senior Policy Reporter
Ashley is a senior policy reporter for Ars Technica, dedicated to tracking social impacts of emerging policies and new technologies. She is a Chicago-based journalist with 20 years of experience.
89 Comments
Comments
Forum view
Loading comments...
Prev story
Next story
1.
FCC to end Biden-era rule that forces ISPs to list all their fees
2.
Secret Claude tracker shocks users after Anthropic’s anti-surveillance stance
3.
The Czinger 21C might be the wildest car we drive all year
4.
Review: Supergirl is not the disaster its low box office suggests
5.
The incredible shrinking Xbox: Five studios, 3,200 employees let go
Customize

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 91
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":8263,"paragraph_count":36,"sentence_count":45,"boilerplate_hits":2,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=high
   Anthropic accused of spying on users; engineer says “experiment” is over.

2. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=high
   Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Anthropic quickly removed a tracker secretly monitoring Claude Code users in China after a security researcher exposed the hidden code and condemned the spyware-like tracking as a “serious breach of user trust.

3. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=high
   ” Last week, a web developer known as “Thereallo” was researching privacy issues in Claude Code and was shocked to find that the AI firm was using “prompt steganography” to hide code that tracks Chinese users “in plain sight.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   ” This code wasn’t malicious, but it was sending information to Anthropic that most users wouldn’t detect, relying on shorthand markers to quietly flag users’ timezone, proxy, and potential connection to Chinese AI labs that Anthropic has accused of distillation attacks .

5. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=high
   On X, Anthropic engineer Thariq Shihipar confirmed that the tracker was added to Claude Code as an “experiment” in March.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   According to Shihipar, the code “was meant to prevent account abuse from unauthorized resellers and protect against distillation.

## business_elements

- companies: Ars Technica AI, OpenAI, Anthropic
- products: Claude, agents
- people: 暂无公开信息
- industries: 法律 / 法务, 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队, 法务 / 律师
- workflows: 合同审阅 / 法律研究, 计费 / 预算管理, 权限 / 安全治理
- business_actions: 发布 / 推出, 合作 / 联盟
- affected_departments: IT / 安全, 法务, 财务 / 预算
- numbers: $1, $100 m, $12, 4.8 m, 12, 24, 500, 20
- quotes: experiment / serious breach of user trust. / Thereallo / prompt steganography / in plain sight.

## evidence_seed

- company_actions: ” This code wasn’t malicious, but it was sending information to Anthropic that most users wouldn’t detect, relying on shorthand markers to quietly flag users’ timezone, proxy, and potential connection to Chinese AI labs that Anthropic has accused of distillation attacks . / According to Shihipar, the code “was meant to prevent account abuse from unauthorized resellers and protect against distillation.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队, 法务 / 律师
- risks_or_constraints: Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Anthropic quickly removed a tracker secretly monitoring Claude Code users in China after a security researcher exposed the hidden code and condemned the spyware-like tracking as a “serious breach of user trust.

## guanlan_scores

- importance_type: supporting_signal
- importance_score: 2
- importance_reason: consumer entertainment or minor platform policy feature; AI-adjacent but not a core business signal
- supporting_signals: low_value_ai_adjacent_context
- novelty: 2
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 2
- guanlan_relevance: 2
- emerging_signal_score: 3

## usable_for

- viewpoint: true
- case: true
- business_change: true
- relationship_graph_input: false
- trend_candidate_context: false
- signal_card_candidate: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: true

## pool_routes

- watchlist

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: low
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: none
- source_role: resolved_original_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

Anthropic accused of spying on users; engineer says “experiment” is over.

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
