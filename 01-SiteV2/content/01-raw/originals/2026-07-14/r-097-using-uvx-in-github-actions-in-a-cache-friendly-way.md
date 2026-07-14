---
schema_version: raw-evidence-v2
raw_id: R-097
title: "Using uvx in GitHub Actions in a cache-friendly way"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://simonwillison.net/2026/Jul/14/uvx-github-actions-cache/#atom-everything"
canonical_url: "https://simonwillison.net/2026/Jul/14/uvx-github-actions-cache"
source_name: "Simon Willison's Blog"
source_type: builder
source_level: S
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
published_at: "2026-07-14T00:56:20.000Z"
collected_at: 2026-07-14T01:56:51.855Z
language: mixed
full_text_hash: 2665cd4bd592a150
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-14/r-097-using-uvx-in-github-actions-in-a-cache-friendly-way.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-14/r-097-using-uvx-in-github-actions-in-a-cache-friendly-way.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-body-visible-text
extraction_quality: medium
extraction_method: "body-visible-text"
readability_score: 56
extractor_diagnostics: {"readability_score":56,"text_length":2025,"paragraph_count":15,"sentence_count":11,"boilerplate_hits":2,"symbol_ratio":0.001,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"body-visible-text"}
has_full_text: true
content_length: 2025
fetch_error: ""
evidence_strength: source_backed_event
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["insufficient_usable_evidence_object"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"2665cd4bd592a150","missing":[]}
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
duplicate_status: unique
url_hash: 383074e2de7c8874
content_hash: 2665cd4bd592a150
semantic_hash: b98e3c894305be69
duplicate_of: ""
first_seen_at: "2026-07-14T00:56:20.000Z"
last_seen_at: 2026-07-14T01:56:51.855Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":true,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":4,"importance_reason":"technical trend or capability shift; rubric=4 concrete important change","supporting_signals":["adoption_context"],"novelty":2,"evidence_strength":4,"case_richness":4,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":4}
business_elements: {"companies":["Simon Willison's Blog","GitHub"],"products":["agents","Agent","GPT-5","Claude"],"people":[],"industries":["开发者工具"],"roles":[],"workflows":[],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["2026","07","12","14","56","5.6","9","4.0"],"quotes":["https://til.simonwillison.net/github-actions/uvx-github-actions-cache","2026-07-12","From Zero Trust to Agent Trust","2026-07-12"]}
evidence_seed: {"company_actions":["TIL: Using uvx in GitHub Actions in a cache-friendly way Simon Willison’s Weblog Subscribe Sponsored by: Teleport &mdash; How do you ensure that AI agents act within your intended boundaries?","I want the tool to be fetched the first time and then reused from the GitHub Actions cache for subsequent runs."],"case_details":[],"workflow_changes":["14th July 2026 TIL Using uvx in GitHub Actions in a cache-friendly way &mdash; I often find myself wanting to run a quick Python tool inside of GitHub Actions using `uvx name-of-tool` - but I don't want that to result in a network request to PyPI every time the workflow runs.","I finally found a cache-friendly recipe for using uvx tool-name in GitHub Actions workflows that I like."],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有具体客户或真实企业案例","没有变化前后流程线索"]
key_excerpts: [{"type":"quote","text":"&lt;p&gt;&lt;strong&gt;TIL:&lt;/strong&gt; &lt;a href=\"https://til.simonwillison.net/github-actions/uvx-github-actions-cache\"&gt;Using uvx in GitHub Actions in a cache-friendly way&lt;/a&gt;&lt;/p&gt; &lt;p&gt;I finally found a cache-friendly recipe for using &lt;code&gt;uvx tool-name&lt;/code&gt; in GitHub Actions workflows that I like.&lt;/p&gt; &lt;p&gt;The trick is setting a &lt;code&gt;UV_EXCLUDE_NEWER: \"2026-07-12\"&lt;/code&gt; environment variable at the start of the workflow and","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"TIL: Using uvx in GitHub Actions in a cache-friendly way Simon Willison’s Weblog Subscribe Sponsored by: Teleport &mdash; How do you ensure that AI agents act within your intended boundaries?","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"quote","text":"Teleport’s “From Zero Trust to Agent Trust” white paper details what needs to be in place to realize the promise of agentic designs.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"medium"},{"type":"workflow_change","text":"14th July 2026 TIL Using uvx in GitHub Actions in a cache-friendly way &mdash; I often find myself wanting to run a quick Python tool inside of GitHub Actions using `uvx name-of-tool` - but I don't want that to result in a network request to PyPI every time the workflow runs.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"I want the tool to be fetched the first time and then reused from the GitHub Actions cache for subsequent runs.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"workflow_change","text":"I finally found a cache-friendly recipe for using uvx tool-name in GitHub Actions workflows that I like.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-14T01:56:51.855Z
theme: uncategorized
keyword_group: uncategorized
copyright_note: local research archive only
---

# Using uvx in GitHub Actions in a cache-friendly way

## clean_text

TIL: Using uvx in GitHub Actions in a cache-friendly way
Simon Willison’s Weblog
Subscribe
Sponsored by: Teleport &mdash; How do you ensure that AI agents act within your intended boundaries? Teleport’s “From Zero Trust to Agent Trust” white paper details what needs to be in place to realize the promise of agentic designs.
14th July 2026
TIL
Using uvx in GitHub Actions in a cache-friendly way
&mdash; I often find myself wanting to run a quick Python tool inside of GitHub Actions using `uvx name-of-tool` - but I don't want that to result in a network request to PyPI every time the workflow runs. I want the tool to be fetched the first time and then reused from the GitHub Actions cache for subsequent runs.
I finally found a cache-friendly recipe for using uvx tool-name in GitHub Actions workflows that I like.
The trick is setting a UV_EXCLUDE_NEWER: "2026-07-12" environment variable at the start of the workflow and then using that as part of the GitHub Actions cache key. This means any uvx tool-name commands will resolve to the most recent version as-of that date, and you can bust the cache and upgrade the tools by bumping the date in the future.
My goal here is to use Python tools in GitHub Actions without every run of the workflow hitting PyPI to download a fresh copy of the tool and its dependencies.
Posted 14th July 2026 at 12:56 am
Recent articles
The new GPT-5.6 family: Luna, Terra, Sol - 9th July 2026
sqlite-utils 4.0, now with database schema migrations - 7th July 2026
sqlite-utils 4.0rc2, mostly written by Claude Fable (for about $149.25) - 5th July 2026
This is a beat by Simon Willison, posted on 14th July 2026 .
packaging
49
pypi
48
python
1,264
github-actions
68
uv
96
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

TIL: Using uvx in GitHub Actions in a cache-friendly way
Simon Willison’s Weblog
Subscribe
Sponsored by: Teleport &mdash; How do you ensure that AI agents act within your intended boundaries? Teleport’s “From Zero Trust to Agent Trust” white paper details what needs to be in place to realize the promise of agentic designs.
14th July 2026
TIL
Using uvx in GitHub Actions in a cache-friendly way
&mdash; I often find myself wanting to run a quick Python tool inside of GitHub Actions using `uvx name-of-tool` - but I don't want that to result in a network request to PyPI every time the workflow runs. I want the tool to be fetched the first time and then reused from the GitHub Actions cache for subsequent runs.
I finally found a cache-friendly recipe for using uvx tool-name in GitHub Actions workflows that I like.
The trick is setting a UV_EXCLUDE_NEWER: "2026-07-12" environment variable at the start of the workflow and then using that as part of the GitHub Actions cache key. This means any uvx tool-name commands will resolve to the most recent version as-of that date, and you can bust the cache and upgrade the tools by bumping the date in the future.
My goal here is to use Python tools in GitHub Actions without every run of the workflow hitting PyPI to download a fresh copy of the tool and its dependencies.
Posted 14th July 2026 at 12:56 am
Recent articles
The new GPT-5.6 family: Luna, Terra, Sol - 9th July 2026
sqlite-utils 4.0, now with database schema migrations - 7th July 2026
sqlite-utils 4.0rc2, mostly written by Claude Fable (for about $149.25) - 5th July 2026
This is a beat by Simon Willison, posted on 14th July 2026 .
packaging
49
pypi
48
python
1,264
github-actions
68
uv
96
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
- readability_score: 56
- fetch_status: fetched-readable-text-body-visible-text
- extraction_quality: medium
- diagnostics: {"readability_score":56,"text_length":2025,"paragraph_count":15,"sentence_count":11,"boilerplate_hits":2,"symbol_ratio":0.001,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"body-visible-text"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=medium
   &lt;p&gt;&lt;strong&gt;TIL:&lt;/strong&gt; &lt;a href="https://til.simonwillison.net/github-actions/uvx-github-actions-cache"&gt;Using uvx in GitHub Actions in a cache-friendly way&lt;/a&gt;&lt;/p&gt; &lt;p&gt;I finally found a cache-friendly recipe for using &lt;code&gt;uvx tool-name&lt;/code&gt; in GitHub Actions workflows that I like.&lt;/p&gt; &lt;p&gt;The trick is setting a &lt;code&gt;UV_EXCLUDE_NEWER: "2026-07-12"&lt;/code&gt; environment variable at the start of the workflow and

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   TIL: Using uvx in GitHub Actions in a cache-friendly way Simon Willison’s Weblog Subscribe Sponsored by: Teleport &mdash; How do you ensure that AI agents act within your intended boundaries?

3. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=medium
   Teleport’s “From Zero Trust to Agent Trust” white paper details what needs to be in place to realize the promise of agentic designs.

4. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   14th July 2026 TIL Using uvx in GitHub Actions in a cache-friendly way &mdash; I often find myself wanting to run a quick Python tool inside of GitHub Actions using `uvx name-of-tool` - but I don't want that to result in a network request to PyPI every time the workflow runs.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   I want the tool to be fetched the first time and then reused from the GitHub Actions cache for subsequent runs.

6. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   I finally found a cache-friendly recipe for using uvx tool-name in GitHub Actions workflows that I like.

## business_elements

- companies: Simon Willison's Blog, GitHub
- products: agents, Agent, GPT-5, Claude
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 2026, 07, 12, 14, 56, 5.6, 9, 4.0
- quotes: https://til.simonwillison.net/github-actions/uvx-github-actions-cache / 2026-07-12 / From Zero Trust to Agent Trust / 2026-07-12

## evidence_seed

- company_actions: TIL: Using uvx in GitHub Actions in a cache-friendly way Simon Willison’s Weblog Subscribe Sponsored by: Teleport &mdash; How do you ensure that AI agents act within your intended boundaries? / I want the tool to be fetched the first time and then reused from the GitHub Actions cache for subsequent runs.
- case_details: 暂无公开信息
- workflow_changes: 14th July 2026 TIL Using uvx in GitHub Actions in a cache-friendly way &mdash; I often find myself wanting to run a quick Python tool inside of GitHub Actions using `uvx name-of-tool` - but I don't want that to result in a network request to PyPI every time the workflow runs. / I finally found a cache-friendly recipe for using uvx tool-name in GitHub Actions workflows that I like.
- before_after_clues: 暂无公开信息
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_technical_trend
- importance_score: 4
- importance_reason: technical trend or capability shift; rubric=4 concrete important change
- supporting_signals: adoption_context
- novelty: 2
- evidence_strength: 4
- case_richness: 4
- trend_relevance: 5
- guanlan_relevance: 4
- emerging_signal_score: 4

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
- 没有变化前后流程线索

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

&lt;p&gt;&lt;strong&gt;TIL:&lt;/strong&gt; &lt;a href="https://til.simonwillison.net/github-actions/uvx-github-actions-cache"&gt;Using uvx in GitHub Actions in a cache-friendly way&lt;/a&gt;&lt;/p&gt; &lt;p&gt;I finally found a cache-friendly recipe for using &lt;code&gt;uvx tool-name&lt;/code&gt; in GitHub Actions workflows that I like.&lt;/p&gt; &lt;p&gt;The trick is setting a &lt;code&gt;UV_EXCLUDE_NEWER: "2026-07-12"&lt;/code&gt; environment variable at the start of the workflow and

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
