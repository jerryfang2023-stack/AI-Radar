---
schema_version: raw-evidence-v2
raw_id: R-031
title: "新版 Claude 模型导致 Pi 工具调用异常"
title_zh: "新版 Claude 模型导致 Pi 工具调用异常"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://simonwillison.net/2026/Jul/4/better-models-worse-tools"
canonical_url: "https://simonwillison.net/2026/Jul/4/better-models-worse-tools"
source_name: "Simon Willison 博客"
source_type: builder
source_level: S
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
published_at: "2026-07-04T22:53:52.000Z"
collected_at: 2026-07-05T04:56:15.285Z
language: mixed
full_text_hash: 9574680b5a4bb76c
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-05/r-031-新版-claude-模型导致-pi-工具调用异常.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-05/r-031-新版-claude-模型导致-pi-工具调用异常.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-body-visible-text
extraction_quality: high
extraction_method: "body-visible-text"
readability_score: 64
extractor_diagnostics: {"readability_score":64,"text_length":2701,"paragraph_count":17,"sentence_count":18,"boilerplate_hits":2,"symbol_ratio":0.0011,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"body-visible-text"}
has_full_text: true
content_length: 2701
fetch_error: ""
evidence_strength: source_backed_event
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["insufficient_usable_evidence_object"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"9574680b5a4bb76c","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: supporting_evidence
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"新版 Claude 模型导致 Pi 工具调用异常","discovery_summary":"Armin 在开发编码工具 Pi 时发现，新版 Claude 模型（Opus 4.8 和 Sonnet 5）调用 Pi 的 edit 工具时，会在嵌套的 `edits【】` 数组中凭空增加不存在的键，导致工具调用因 schema 不匹配被 Pi 拒绝。旧模型（包括 Haiku）均无此问题。Armin 推测 Anthropic 通过强化学习让新模型更善于使用 Claude Code 内置的编辑工具，却导致第三方工具 Pi 的自定义编辑工具更易被误用。OpenAI 的 Codex 采用 `apply_patch` 机制，也面临类似问题。这引发思考：第三方编码工具是否应为不同底层模型分别实现多个编辑工具以保障兼容性。","source_name":"Simon Willison 博客","origin_url":"https://simonwillison.net/2026/Jul/4/better-models-worse-tools","discovered_at":"2026-07-05T04:46:18.987Z","rank_on_page":41,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: df80d6a1f2b3f4fe
content_hash: 9574680b5a4bb76c
semantic_hash: 9d1d7ad7f9ada728
duplicate_of: ""
first_seen_at: "2026-07-04T22:53:52.000Z"
last_seen_at: 2026-07-05T04:56:15.285Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":5,"importance_reason":"technical trend or capability shift; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":2}
business_elements: {"companies":["Simon Willison 博客","OpenAI","Anthropic"],"products":["Claude","Codex","agent","agents"],"people":[],"industries":["开发者工具"],"roles":[],"workflows":[],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["4.8","5","2026 M","4","2026","10","53","4.0"],"quotes":[]}
evidence_seed: {"company_actions":["Better Models: Worse Tools Simon Willison’s Weblog Subscribe Sponsored by: Sonar &mdash; Gartner just named Sonar a Leader in the 2026 Magic Quadrant™ for Technical Debt Management Tools.","Read the report and learn how to measure and remediate technical debt across your codebase.","Get the report 4th July 2026 - Link Blog Better Models: Worse Tools ."],"case_details":["Armin 在开发编码工具 Pi 时发现，新版 Claude 模型（Opus 4.8 和 Sonnet 5）调用 Pi 的 edit 工具时，会在嵌套的 `edits【】` 数组中凭空增加不存在的键，导致工具调用因 schema 不匹配被 Pi 拒绝。旧模型（包括 Haiku）均无此问题。Armin 推测 Anthropic 通过强化学习让新模型更善于使用 Claude Code 内置的编辑工具，却导致第三方工具 Pi 的自定义编辑工具更易被误用。OpenAI 的 Codex 采用 `apply_patch` 机制，也面临类似问题。这引发思考：第三方编码工具是否应为不同底层模型分别实现多个编辑工具以保障兼容性。"],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有变化前后流程线索"]
key_excerpts: [{"type":"case_detail","text":"Armin 在开发编码工具 Pi 时发现，新版 Claude 模型（Opus 4.8 和 Sonnet 5）调用 Pi 的 edit 工具时，会在嵌套的 `edits【】` 数组中凭空增加不存在的键，导致工具调用因 schema 不匹配被 Pi 拒绝。旧模型（包括 Haiku）均无此问题。Armin 推测 Anthropic 通过强化学习让新模型更善于使用 Claude Code 内置的编辑工具，却导致第三方工具 Pi 的自定义编辑工具更易被误用。OpenAI 的 Codex 采用 `apply_patch` 机制，也面临类似问题。这引发思考：第三方编码工具是否应为不同底层模型分别实现多个编辑工具以保障兼容性。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Better Models: Worse Tools Simon Willison’s Weblog Subscribe Sponsored by: Sonar &mdash; Gartner just named Sonar a Leader in the 2026 Magic Quadrant™ for Technical Debt Management Tools.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Read the report and learn how to measure and remediate technical debt across your codebase.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Get the report 4th July 2026 - Link Blog Better Models: Worse Tools .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Armin reports on a weird problem he ran into while hacking on Pi: The short version is that newer Claude models sometimes call Pi’s edit tool with extra, invented fields in the nested edits[] array.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"And not Haiku or some small model: Opus 4.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-05T04:56:15.285Z
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# 新版 Claude 模型导致 Pi 工具调用异常

## clean_text

Better Models: Worse Tools
Simon Willison’s Weblog
Subscribe
Sponsored by: Sonar &mdash; Gartner just named Sonar a Leader in the 2026 Magic Quadrant™ for Technical Debt Management Tools. Read the report and learn how to measure and remediate technical debt across your codebase. Get the report
4th July 2026 - Link Blog
Better Models: Worse Tools . Armin reports on a weird problem he ran into while hacking on Pi:
The short version is that newer Claude models sometimes call Pi’s edit tool with extra, invented fields in the nested edits[] array. And not Haiku or some small model: Opus 4.8. The edit itself is usually correct but the arguments do not match the schema as the model invents made-up keys and Pi thus rejects the tool call and asks to try again.
That alone is not too surprising as models emit malformed tool calls sometimes. Particularly small ones. What surprised me is that this is getting worse with newer Anthropic models as both Opus 4.8 and Sonnet 5 show it but none of the older models. In other words, the SOTA models of the family are worse at this specific tool schema than their older siblings.
Armin theorizes that this is because more recent Anthropic models have been specifically trained (presumably via Reinforcement Learning) to better use the edit tools that are baked into Claude Code. This has the unfortunate effect that other coding harnesses, such as Pi, may find that their own custom edit tools are more likely to be used incorrectly.
Claude's edit tool uses search and replace . OpenAI's Codex uses an apply_patch mechanism instead , and OpenAI have talked in the past about how their models are trained to use that tool effectively.
Does this mean third-party coding harnesses like Pi should implement multiple edit tools just so they can use the one with the best performance for the underlying model the user has selected?
Posted 4th July 2026 at 10:53 pm
Recent articles
sqlite-utils 4.0rc2, mostly written by Claude Fable (for about $149.25) - 5th July 2026
Have your agent record video demos of its work with shot-scraper video - 30th June 2026
Porting the Moebius 0.2B image inpainting model to run in the browser with Claude Code - 22nd June 2026
This is a link post by Simon Willison, posted on 4th July 2026 .
armin-ronacher
24
ai
2,102
openai
426
generative-ai
1,859
llms
1,826
anthropic
305
llm-tool-use
72
coding-agents
219
pi
Monthly briefing
Sponsor me for $10/month and get a curated email digest of the month's most important LLM developments.
Pay me to send you less!
Sponsor & subscribe
Disclosures
Colophon
&copy;
2002
2003
2004
2005
2006
2007
2008
2009
2010
2011
2012
2013
2014
2015
2016
2017
2018
2019
2020
2021
2022
2023
2024
2025
2026

## full_text

Better Models: Worse Tools
Simon Willison’s Weblog
Subscribe
Sponsored by: Sonar &mdash; Gartner just named Sonar a Leader in the 2026 Magic Quadrant™ for Technical Debt Management Tools. Read the report and learn how to measure and remediate technical debt across your codebase. Get the report
4th July 2026 - Link Blog
Better Models: Worse Tools . Armin reports on a weird problem he ran into while hacking on Pi:
The short version is that newer Claude models sometimes call Pi’s edit tool with extra, invented fields in the nested edits[] array. And not Haiku or some small model: Opus 4.8. The edit itself is usually correct but the arguments do not match the schema as the model invents made-up keys and Pi thus rejects the tool call and asks to try again.
That alone is not too surprising as models emit malformed tool calls sometimes. Particularly small ones. What surprised me is that this is getting worse with newer Anthropic models as both Opus 4.8 and Sonnet 5 show it but none of the older models. In other words, the SOTA models of the family are worse at this specific tool schema than their older siblings.
Armin theorizes that this is because more recent Anthropic models have been specifically trained (presumably via Reinforcement Learning) to better use the edit tools that are baked into Claude Code. This has the unfortunate effect that other coding harnesses, such as Pi, may find that their own custom edit tools are more likely to be used incorrectly.
Claude's edit tool uses search and replace . OpenAI's Codex uses an apply_patch mechanism instead , and OpenAI have talked in the past about how their models are trained to use that tool effectively.
Does this mean third-party coding harnesses like Pi should implement multiple edit tools just so they can use the one with the best performance for the underlying model the user has selected?
Posted 4th July 2026 at 10:53 pm
Recent articles
sqlite-utils 4.0rc2, mostly written by Claude Fable (for about $149.25) - 5th July 2026
Have your agent record video demos of its work with shot-scraper video - 30th June 2026
Porting the Moebius 0.2B image inpainting model to run in the browser with Claude Code - 22nd June 2026
This is a link post by Simon Willison, posted on 4th July 2026 .
armin-ronacher
24
ai
2,102
openai
426
generative-ai
1,859
llms
1,826
anthropic
305
llm-tool-use
72
coding-agents
219
pi
Monthly briefing
Sponsor me for $10/month and get a curated email digest of the month's most important LLM developments.
Pay me to send you less!
Sponsor & subscribe
Disclosures
Colophon
&copy;
2002
2003
2004
2005
2006
2007
2008
2009
2010
2011
2012
2013
2014
2015
2016
2017
2018
2019
2020
2021
2022
2023
2024
2025
2026

## extraction_diagnostics

- extraction_method: body-visible-text
- readability_score: 64
- fetch_status: fetched-readable-text-body-visible-text
- extraction_quality: high
- diagnostics: {"readability_score":64,"text_length":2701,"paragraph_count":17,"sentence_count":18,"boilerplate_hits":2,"symbol_ratio":0.0011,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"body-visible-text"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   Armin 在开发编码工具 Pi 时发现，新版 Claude 模型（Opus 4.8 和 Sonnet 5）调用 Pi 的 edit 工具时，会在嵌套的 `edits【】` 数组中凭空增加不存在的键，导致工具调用因 schema 不匹配被 Pi 拒绝。旧模型（包括 Haiku）均无此问题。Armin 推测 Anthropic 通过强化学习让新模型更善于使用 Claude Code 内置的编辑工具，却导致第三方工具 Pi 的自定义编辑工具更易被误用。OpenAI 的 Codex 采用 `apply_patch` 机制，也面临类似问题。这引发思考：第三方编码工具是否应为不同底层模型分别实现多个编辑工具以保障兼容性。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Better Models: Worse Tools Simon Willison’s Weblog Subscribe Sponsored by: Sonar &mdash; Gartner just named Sonar a Leader in the 2026 Magic Quadrant™ for Technical Debt Management Tools.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Read the report and learn how to measure and remediate technical debt across your codebase.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Get the report 4th July 2026 - Link Blog Better Models: Worse Tools .

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Armin reports on a weird problem he ran into while hacking on Pi: The short version is that newer Claude models sometimes call Pi’s edit tool with extra, invented fields in the nested edits[] array.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   And not Haiku or some small model: Opus 4.

## business_elements

- companies: Simon Willison 博客, OpenAI, Anthropic
- products: Claude, Codex, agent, agents
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 4.8, 5, 2026 M, 4, 2026, 10, 53, 4.0
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Better Models: Worse Tools Simon Willison’s Weblog Subscribe Sponsored by: Sonar &mdash; Gartner just named Sonar a Leader in the 2026 Magic Quadrant™ for Technical Debt Management Tools. / Read the report and learn how to measure and remediate technical debt across your codebase. / Get the report 4th July 2026 - Link Blog Better Models: Worse Tools .
- case_details: Armin 在开发编码工具 Pi 时发现，新版 Claude 模型（Opus 4.8 和 Sonnet 5）调用 Pi 的 edit 工具时，会在嵌套的 `edits【】` 数组中凭空增加不存在的键，导致工具调用因 schema 不匹配被 Pi 拒绝。旧模型（包括 Haiku）均无此问题。Armin 推测 Anthropic 通过强化学习让新模型更善于使用 Claude Code 内置的编辑工具，却导致第三方工具 Pi 的自定义编辑工具更易被误用。OpenAI 的 Codex 采用 `apply_patch` 机制，也面临类似问题。这引发思考：第三方编码工具是否应为不同底层模型分别实现多个编辑工具以保障兼容性。
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_technical_trend
- importance_score: 5
- importance_reason: technical trend or capability shift; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
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
- 没有变化前后流程线索

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: supporting_evidence
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"新版 Claude 模型导致 Pi 工具调用异常","discovery_summary":"Armin 在开发编码工具 Pi 时发现，新版 Claude 模型（Opus 4.8 和 Sonnet 5）调用 Pi 的 edit 工具时，会在嵌套的 `edits【】` 数组中凭空增加不存在的键，导致工具调用因 schema 不匹配被 Pi 拒绝。旧模型（包括 Haiku）均无此问题。Armin 推测 Anthropic 通过强化学习让新模型更善于使用 Claude Code 内置的编辑工具，却导致第三方工具 Pi 的自定义编辑工具更易被误用。OpenAI 的 Codex 采用 `apply_patch` 机制，也面临类似问题。这引发思考：第三方编码工具是否应为不同底层模型分别实现多个编辑工具以保障兼容性。","source_name":"Simon Willison 博客","origin_url":"https://simonwillison.net/2026/Jul/4/better-models-worse-tools","discovered_at":"2026-07-05T04:46:18.987Z","rank_on_page":41,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Armin 在开发编码工具 Pi 时发现，新版 Claude 模型（Opus 4.8 和 Sonnet 5）调用 Pi 的 edit 工具时，会在嵌套的 `edits【】` 数组中凭空增加不存在的键，导致工具调用因 schema 不匹配被 Pi 拒绝。旧模型（包括 Haiku）均无此问题。Armin 推测 Anthropic 通过强化学习让新模型更善于使用 Claude Code 内置的编辑工具，却导致第三方工具 Pi 的自定义编辑工具更易被误用。OpenAI 的 Codex 采用 `apply_patch` 机制，也面临类似问题。这引发思考：第三方编码工具是否应为不同底层模型分别实现多个编辑工具以保障兼容性。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
