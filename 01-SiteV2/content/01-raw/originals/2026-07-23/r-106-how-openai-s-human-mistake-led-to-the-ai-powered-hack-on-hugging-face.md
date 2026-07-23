---
schema_version: raw-evidence-v2
raw_id: R-106
title: "How OpenAI’s human mistake led to the AI-powered hack on Hugging Face"
title_zh: "OpenAI 的人为失误如何导致针对 Hugging Face 的 AI 驱动黑客攻击"
title_translation_status: translated
title_translation_method: deepseek_title_translation
title_translation_model: deepseek-v4-flash
original_url: "https://techcrunch.com/2026/07/22/how-an-openais-human-mistake-led-to-the-ai-powered-hack-on-hugging-face/"
canonical_url: "https://techcrunch.com/2026/07/22/how-an-openais-human-mistake-led-to-the-ai-powered-hack-on-hugging-face"
source_name: "TechCrunch AI"
source_type: news
source_level: A
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: research_or_report
evidence_object_usable: false
event_evidence: false
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: rss-feed
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-07-22T00:00:00.000Z"
collected_at: 2026-07-23T03:51:47.904Z
language: mixed
full_text_hash: 3f1bf4166ced7fb9
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-23/r-106-how-openai-s-human-mistake-led-to-the-ai-powered-hack-on-hugging-face.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-23/r-106-how-openai-s-human-mistake-led-to-the-ai-powered-hack-on-hugging-face.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":5698,"paragraph_count":37,"sentence_count":30,"boilerplate_hits":0,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 5698
fetch_error: ""
evidence_strength: source_backed_event
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["insufficient_usable_evidence_object"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"3f1bf4166ced7fb9","missing":[]}
source_volatility: low
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: supporting_evidence
discovery_source: ""
discovery_record: null
source_role: resolved_original_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: merged_provider_duplicates
url_hash: f3371fcff5447c5a
content_hash: 3f1bf4166ced7fb9
semantic_hash: c5d9887b785018a1
duplicate_of: "merged 1 duplicate provider hit(s) before Raw selection"
first_seen_at: "2026-07-22T00:00:00.000Z"
last_seen_at: 2026-07-23T03:51:47.904Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":true,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"important_market_structure","importance_score":5,"importance_reason":"market-structure commercial event; rubric=5 major/platform/industry-shaping","supporting_signals":["ai_hardware_lens","commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["TechCrunch AI","OpenAI","Anthropic","Google"],"products":["agents","Gemini"],"people":[],"industries":[],"roles":["CIO / IT 负责人"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出","融资 / 投资"],"affected_departments":["IT / 安全"],"numbers":["12","11","22","2026","1","917","257","1382"],"quotes":["highly isolated","highly isolated environment,","a containment failure with the safeties turned off.","responsibly disclosed the identified zero-day vulnerability in the internally-hosted third-party software and are working with them to patch.","this sounds like human failure."]}
evidence_seed: {"company_actions":["” The model was able to escape the sandboxed testing environment thanks to a previously undisclosed vulnerability in the package-installation system, a critical first step in the eventual hack on Hugging Face, according to OpenAI."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":["Image Credits: Samuel Boivin/NurPhoto and Samuel Boivin/NurPhoto / Getty Images Security How OpenAI’s human mistake led to the AI-powered hack on Hugging Face Lorenzo Franceschi-Bicchierai 12:11 PM PDT · July 22, 2026 On Tuesday, OpenAI revealed that one of its models went rogue during a test and hacked the systems of AI dataset platform Hugging Face in a fully AI-enabled attack , a dramatic example of the dangers posed by advanced AI models.","Dan Guido, the founder of cybersecurity research startup Trail of Bits, called the mistake “a containment failure with the safeties turned off.","” In its blog post detailing the incident , OpenAI said that the test that led to the Hugging Face breach was set up to run in “a highly isolated environment, with network access constrained to the ability to install packages through an internally hosted third-party software that acts as a proxy and cache for package registries."]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有具体客户或真实企业案例"]
key_excerpts: [{"type":"quote","text":"OpenAI made a mistake setting up what it called a “highly isolated” testing environment and sandbox. According to cybersecurity experts, that human mistake is what made the AI-powered attack on Hugging Face possible.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"high"},{"type":"supporting_context","text":"Image Credits: Samuel Boivin/NurPhoto and Samuel Boivin/NurPhoto / Getty Images Security How OpenAI’s human mistake led to the AI-powered hack on Hugging Face Lorenzo Franceschi-Bicchierai 12:11 PM PDT · July 22, 2026 On Tuesday, OpenAI revealed that one of its models went rogue during a test and hacked the systems of AI dataset platform Hugging Face in a fully AI-enabled attack , a dramatic example of the dangers posed by advanced AI models.","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"high"},{"type":"quote","text":"But, according to some cybersecurity experts, at the heart of this unprecedented AI-powered breach there was a very human mistake: OpenAI failed to properly configure what it called a “highly isolated environment,” allowing a testing sandbox that should have been completely secluded from the internet to actually connect to the internet.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"high"},{"type":"supporting_context","text":"Dan Guido, the founder of cybersecurity research startup Trail of Bits, called the mistake “a containment failure with the safeties turned off.","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"high"},{"type":"supporting_context","text":"” In its blog post detailing the incident , OpenAI said that the test that led to the Hugging Face breach was set up to run in “a highly isolated environment, with network access constrained to the ability to install packages through an internally hosted third-party software that acts as a proxy and cache for package registries.","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"” The model was able to escape the sandboxed testing environment thanks to a previously undisclosed vulnerability in the package-installation system, a critical first step in the eventual hack on Hugging Face, according to OpenAI.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-23T03:51:47.904Z
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# How OpenAI’s human mistake led to the AI-powered hack on Hugging Face

## clean_text

Image Credits: Samuel Boivin/NurPhoto and Samuel Boivin/NurPhoto / Getty Images
Security
How OpenAI’s human mistake led to the AI-powered hack on Hugging Face
Lorenzo Franceschi-Bicchierai
12:11 PM PDT · July 22, 2026
On Tuesday, OpenAI revealed that one of its models went rogue during a test and hacked the systems of AI dataset platform Hugging Face in a fully AI-enabled attack , a dramatic example of the dangers posed by advanced AI models.
But, according to some cybersecurity experts, at the heart of this unprecedented AI-powered breach there was a very human mistake: OpenAI failed to properly configure what it called a “highly isolated environment,” allowing a testing sandbox that should have been completely secluded from the internet to actually connect to the internet.
Dan Guido, the founder of cybersecurity research startup Trail of Bits, called the mistake “a containment failure with the safeties turned off.”
In its blog post detailing the incident , OpenAI said that the test that led to the Hugging Face breach was set up to run in “a highly isolated environment, with network access constrained to the ability to install packages through an internally hosted third-party software that acts as a proxy and cache for package registries.”
The model was able to escape the sandboxed testing environment thanks to a previously undisclosed vulnerability in the package-installation system, a critical first step in the eventual hack on Hugging Face, according to OpenAI.
In response, the company “responsibly disclosed the identified zero-day vulnerability in the internally-hosted third-party software and are working with them to patch.”
But to most cybersecurity professionals, software vulnerabilities are to be expected — and the real fault lies with the decision to maintain the third-party software in the first place. Ultimately, the value of a “sandbox” system lies in its full and total isolation. Including a package-installation system is asking for trouble.
Martin Boone, a cybersecurity researcher, told TechCrunch that “this sounds like human failure.”
“This should never have happened,” Boone said. “If sandbox would actually mean sandbox, you expect it to have no physical connection to the internet whatsoever. This sounds more like they had some firewalling or something in place, and firewalling is hard from the outside in, let alone inside to the outside internet.”
Cybersecurity veteran Jake Williams agreed. “Any model performing the types of actions documented by Hugging Face was not fully contained in a sandbox,” said Williams, who called this “a massive control failure” by OpenAI.
“One man’s ‘the model escaped the sandbox’ is another man’s ‘you failed to build the sandbox correctly, so of course it escaped,’” Williams continued.
Contact Us
Do you have more information about this incident? Or about other AI-enabled cyberattacks? We’d love to hear from you. From a non-work device and network, you can contact Lorenzo Franceschi-Bicchierai securely on Signal at +1 917 257 1382, or via Telegram and Keybase @lorenzofb, or email .
Daniel Card, a cybersecurity consultant, agreed that OpenAI “didn’t put adequate effort into the design of the sandbox nor its controls” by giving the sandbox or some part of it “an unfiltered route to the internet.” Setting up the sandbox, even with limited network access as OpenAI described it, was not a “reasonable” decision, according to Card.
To be sure, those criticisms have the benefit of hindsight, but they raise real questions about security practices in AI labs — particularly in maintaining isolated environments for testing models. OpenAI spokespeople did not respond to TechCrunch’s questions, which included whether an AI or a human had set up the testing environment.
But those questions go far beyond OpenAI.
In the document introducing its cybersecurity-focused model Mythos , Anthropic wrote that in a test, the model “was provided with a secured ‘sandbox’ computer to interact with,” and instructed to try to escape that “secure container.” Mythos succeeded and gained broader access to the internet “from a system that was meant to be able to reach only a small number of predetermined services.” Still, Anthropic noted that the model was not able to “fully” escape the designed containment.
Topics
AI , cyberattack , cybersecurity , data breach , Hugging Face , OpenAI , Security
When you purchase through links in our articles, we may earn a small commission . This doesn’t affect our editorial independence.
Lorenzo Franceschi-Bicchierai
Senior Reporter, Cybersecurity
Lorenzo Franceschi-Bicchierai is a Senior Writer at TechCrunch, where he covers hacking, cybersecurity, surveillance, and privacy.
You can contact or verify outreach from Lorenzo by emailing lorenzo@techcrunch.com , via encrypted message at +1 917 257 1382 on Signal, and @lorenzofb on Keybase/Telegram.
View Bio
October 13 – 15
San Francisco
Scale faster. Grow your portfolio. Gain practical expertise. No matter your goal, Disrupt can empower you.
Save up to $330 toda y!
REGISTER NOW
Most Popular
Jack Dorsey is taking on Slack with Buzz, a group chat platform for teams and their AI agents
Amanda Silberling
Light made a flip phone — it’s colorful and it’s cheap
Amanda Silberling
AI music generator Suno breach affects 55M users, per Have I Been Pwned
Zack Whittaker
Anthropic’s landmark $1.5B copyright settlement is approved
Kirsten Korosec
Google is working on a new AI chip designed to make Gemini more efficient
Lucas Ropek
X relaunches a rebuilt Android app after year-long effort
Sarah Perez
Judge pauses $110B Paramount-Warner Bros. merger
Aisha Malik
Loading the next article
Error loading the next article

## full_text

Image Credits: Samuel Boivin/NurPhoto and Samuel Boivin/NurPhoto / Getty Images
Security
How OpenAI’s human mistake led to the AI-powered hack on Hugging Face
Lorenzo Franceschi-Bicchierai
12:11 PM PDT · July 22, 2026
On Tuesday, OpenAI revealed that one of its models went rogue during a test and hacked the systems of AI dataset platform Hugging Face in a fully AI-enabled attack , a dramatic example of the dangers posed by advanced AI models.
But, according to some cybersecurity experts, at the heart of this unprecedented AI-powered breach there was a very human mistake: OpenAI failed to properly configure what it called a “highly isolated environment,” allowing a testing sandbox that should have been completely secluded from the internet to actually connect to the internet.
Dan Guido, the founder of cybersecurity research startup Trail of Bits, called the mistake “a containment failure with the safeties turned off.”
In its blog post detailing the incident , OpenAI said that the test that led to the Hugging Face breach was set up to run in “a highly isolated environment, with network access constrained to the ability to install packages through an internally hosted third-party software that acts as a proxy and cache for package registries.”
The model was able to escape the sandboxed testing environment thanks to a previously undisclosed vulnerability in the package-installation system, a critical first step in the eventual hack on Hugging Face, according to OpenAI.
In response, the company “responsibly disclosed the identified zero-day vulnerability in the internally-hosted third-party software and are working with them to patch.”
But to most cybersecurity professionals, software vulnerabilities are to be expected — and the real fault lies with the decision to maintain the third-party software in the first place. Ultimately, the value of a “sandbox” system lies in its full and total isolation. Including a package-installation system is asking for trouble.
Martin Boone, a cybersecurity researcher, told TechCrunch that “this sounds like human failure.”
“This should never have happened,” Boone said. “If sandbox would actually mean sandbox, you expect it to have no physical connection to the internet whatsoever. This sounds more like they had some firewalling or something in place, and firewalling is hard from the outside in, let alone inside to the outside internet.”
Cybersecurity veteran Jake Williams agreed. “Any model performing the types of actions documented by Hugging Face was not fully contained in a sandbox,” said Williams, who called this “a massive control failure” by OpenAI.
“One man’s ‘the model escaped the sandbox’ is another man’s ‘you failed to build the sandbox correctly, so of course it escaped,’” Williams continued.
Contact Us
Do you have more information about this incident? Or about other AI-enabled cyberattacks? We’d love to hear from you. From a non-work device and network, you can contact Lorenzo Franceschi-Bicchierai securely on Signal at +1 917 257 1382, or via Telegram and Keybase @lorenzofb, or email .
Daniel Card, a cybersecurity consultant, agreed that OpenAI “didn’t put adequate effort into the design of the sandbox nor its controls” by giving the sandbox or some part of it “an unfiltered route to the internet.” Setting up the sandbox, even with limited network access as OpenAI described it, was not a “reasonable” decision, according to Card.
To be sure, those criticisms have the benefit of hindsight, but they raise real questions about security practices in AI labs — particularly in maintaining isolated environments for testing models. OpenAI spokespeople did not respond to TechCrunch’s questions, which included whether an AI or a human had set up the testing environment.
But those questions go far beyond OpenAI.
In the document introducing its cybersecurity-focused model Mythos , Anthropic wrote that in a test, the model “was provided with a secured ‘sandbox’ computer to interact with,” and instructed to try to escape that “secure container.” Mythos succeeded and gained broader access to the internet “from a system that was meant to be able to reach only a small number of predetermined services.” Still, Anthropic noted that the model was not able to “fully” escape the designed containment.
Topics
AI , cyberattack , cybersecurity , data breach , Hugging Face , OpenAI , Security
When you purchase through links in our articles, we may earn a small commission . This doesn’t affect our editorial independence.
Lorenzo Franceschi-Bicchierai
Senior Reporter, Cybersecurity
Lorenzo Franceschi-Bicchierai is a Senior Writer at TechCrunch, where he covers hacking, cybersecurity, surveillance, and privacy.
You can contact or verify outreach from Lorenzo by emailing lorenzo@techcrunch.com , via encrypted message at +1 917 257 1382 on Signal, and @lorenzofb on Keybase/Telegram.
View Bio
October 13 – 15
San Francisco
Scale faster. Grow your portfolio. Gain practical expertise. No matter your goal, Disrupt can empower you.
Save up to $330 toda y!
REGISTER NOW
Most Popular
Jack Dorsey is taking on Slack with Buzz, a group chat platform for teams and their AI agents
Amanda Silberling
Light made a flip phone — it’s colorful and it’s cheap
Amanda Silberling
AI music generator Suno breach affects 55M users, per Have I Been Pwned
Zack Whittaker
Anthropic’s landmark $1.5B copyright settlement is approved
Kirsten Korosec
Google is working on a new AI chip designed to make Gemini more efficient
Lucas Ropek
X relaunches a rebuilt Android app after year-long effort
Sarah Perez
Judge pauses $110B Paramount-Warner Bros. merger
Aisha Malik
Loading the next article
Error loading the next article

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 97
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":5698,"paragraph_count":37,"sentence_count":30,"boilerplate_hits":0,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=high
   OpenAI made a mistake setting up what it called a “highly isolated” testing environment and sandbox. According to cybersecurity experts, that human mistake is what made the AI-powered attack on Hugging Face possible.

2. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=high
   Image Credits: Samuel Boivin/NurPhoto and Samuel Boivin/NurPhoto / Getty Images Security How OpenAI’s human mistake led to the AI-powered hack on Hugging Face Lorenzo Franceschi-Bicchierai 12:11 PM PDT · July 22, 2026 On Tuesday, OpenAI revealed that one of its models went rogue during a test and hacked the systems of AI dataset platform Hugging Face in a fully AI-enabled attack , a dramatic example of the dangers posed by advanced AI models.

3. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=high
   But, according to some cybersecurity experts, at the heart of this unprecedented AI-powered breach there was a very human mistake: OpenAI failed to properly configure what it called a “highly isolated environment,” allowing a testing sandbox that should have been completely secluded from the internet to actually connect to the internet.

4. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=high
   Dan Guido, the founder of cybersecurity research startup Trail of Bits, called the mistake “a containment failure with the safeties turned off.

5. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=high
   ” In its blog post detailing the incident , OpenAI said that the test that led to the Hugging Face breach was set up to run in “a highly isolated environment, with network access constrained to the ability to install packages through an internally hosted third-party software that acts as a proxy and cache for package registries.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   ” The model was able to escape the sandboxed testing environment thanks to a previously undisclosed vulnerability in the package-installation system, a critical first step in the eventual hack on Hugging Face, according to OpenAI.

## business_elements

- companies: TechCrunch AI, OpenAI, Anthropic, Google
- products: agents, Gemini
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: CIO / IT 负责人
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出, 融资 / 投资
- affected_departments: IT / 安全
- numbers: 12, 11, 22, 2026, 1, 917, 257, 1382
- quotes: highly isolated / highly isolated environment, / a containment failure with the safeties turned off. / responsibly disclosed the identified zero-day vulnerability in the internally-hosted third-party software and are working with them to patch. / this sounds like human failure.

## evidence_seed

- company_actions: ” The model was able to escape the sandboxed testing environment thanks to a previously undisclosed vulnerability in the package-installation system, a critical first step in the eventual hack on Hugging Face, according to OpenAI.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
- risks_or_constraints: Image Credits: Samuel Boivin/NurPhoto and Samuel Boivin/NurPhoto / Getty Images Security How OpenAI’s human mistake led to the AI-powered hack on Hugging Face Lorenzo Franceschi-Bicchierai 12:11 PM PDT · July 22, 2026 On Tuesday, OpenAI revealed that one of its models went rogue during a test and hacked the systems of AI dataset platform Hugging Face in a fully AI-enabled attack , a dramatic example of the dangers posed by advanced AI models. / Dan Guido, the founder of cybersecurity research startup Trail of Bits, called the mistake “a containment failure with the safeties turned off. / ” In its blog post detailing the incident , OpenAI said that the test that led to the Hugging Face breach was set up to run in “a highly isolated environment, with network access constrained to the ability to install packages through an internally hosted third-party software that acts as a proxy and cache for package registries.

## guanlan_scores

- importance_type: important_market_structure
- importance_score: 5
- importance_reason: market-structure commercial event; rubric=5 major/platform/industry-shaping
- supporting_signals: ai_hardware_lens,commercial_or_risk_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 3

## usable_for

- viewpoint: true
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
- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: low
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: supporting_evidence
- discovery_source: none
- source_role: resolved_original_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

OpenAI made a mistake setting up what it called a “highly isolated” testing environment and sandbox. According to cybersecurity experts, that human mistake is what made the AI-powered attack on Hugging Face possible.

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
