---
schema_version: raw-evidence-v2
raw_id: R-121
title: "A (Long) Peek into Reinforcement Learning"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://lilianweng.github.io/posts/2018-02-19-rl-overview/"
canonical_url: "https://lilianweng.github.io/posts/2018-02-19-rl-overview"
source_name: "Lilian Weng's Blog (OpenAI)"
source_type: builder
source_level: B
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
collected_at: 2026-07-12T09:56:05.997Z
language: mixed
full_text_hash: 7113188dfdbc2bea
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-121-a-long-peek-into-reinforcement-learning.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-121-a-long-peek-into-reinforcement-learning.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: timeout-fallback-visible-text
extraction_quality: low
extraction_method: "fetch_failed_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"fetch_failed_summary_fallback","error_type":"timeout"}
has_full_text: true
content_length: 500
fetch_error: "fetch failed (code=UND_ERR_CONNECT_TIMEOUT)"
evidence_strength: blocked
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["missing_snapshot"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"7113188dfdbc2bea","missing":["missing_snapshot"]}
source_volatility: medium
community_name: ""
capture_scope: summary_only
visible_range: "仅保留采集通道当时可见文本，未抓到原页面正文"
evidence_level: core_evidence_candidate
discovery_source: ""
discovery_record: null
source_role: discovery_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 56057e564275169a
content_hash: 7113188dfdbc2bea
semantic_hash: a38cb723b61b8cd1
duplicate_of: ""
first_seen_at: "2026-07-12T09:56:05.997Z"
last_seen_at: 2026-07-12T09:56:05.997Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"none","importance_score":1,"importance_reason":"no core WaveSight importance signal","supporting_signals":[],"novelty":2,"evidence_strength":3,"case_richness":3,"trend_relevance":2,"guanlan_relevance":2,"emerging_signal_score":3}
business_elements: {"companies":["Lilian Weng's Blog (OpenAI)"],"products":[],"people":[],"industries":[],"roles":[],"workflows":["合同审阅 / 法律研究"],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["34","2020","09","03"],"quotes":[]}
evidence_seed: {"company_actions":["&lt;!-- In this post, we are gonna briefly go over the field of Reinforcement Learning (RL), from fundamental concepts to classic algorithms. Hopefully, this review is helpful enough so that newbies would not get lost in specialized terms and jargons while starting. [WARNING] This is a long read. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2020-09-03: Updated the algorithm of &lt;a href=&#34;#sarsa-on-policy-td-control&#34;&gt;SARSA&lt;/a&gt; and &lt;a href=&#34;#q-learning-of","-- In this post, we are gonna briefly go over the field of Reinforcement Learning (RL), from fundamental concepts to classic algorithms.","Hopefully, this review is helpful enough so that newbies would not get lost in specialized terms and jargons while starting."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"product_update","text":"&lt;!-- In this post, we are gonna briefly go over the field of Reinforcement Learning (RL), from fundamental concepts to classic algorithms. Hopefully, this review is helpful enough so that newbies would not get lost in specialized terms and jargons while starting. [WARNING] This is a long read. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2020-09-03: Updated the algorithm of &lt;a href=&#34;#sarsa-on-policy-td-control&#34;&gt;SARSA&lt;/a&gt; and &lt;a href=&#34;#q-learning-of","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"-- In this post, we are gonna briefly go over the field of Reinforcement Learning (RL), from fundamental concepts to classic algorithms.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"Hopefully, this review is helpful enough so that newbies would not get lost in specialized terms and jargons while starting.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"[WARNING] This is a long read.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"product_update","text":"--&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2020-09-03: Updated the algorithm of &lt;a href=&#34;#sarsa-on-policy-td-control&#34;&gt;SARSA&lt;/a&gt; and &lt;a href=&#34;#q-learning-of","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"medium","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-12T09:56:05.997Z
theme: uncategorized
keyword_group: uncategorized
copyright_note: local research archive only
---

# A (Long) Peek into Reinforcement Learning

## clean_text

&lt;!-- In this post, we are gonna briefly go over the field of Reinforcement Learning (RL), from fundamental concepts to classic algorithms. Hopefully, this review is helpful enough so that newbies would not get lost in specialized terms and jargons while starting. [WARNING] This is a long read. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2020-09-03: Updated the algorithm of &lt;a href=&#34;#sarsa-on-policy-td-control&#34;&gt;SARSA&lt;/a&gt; and &lt;a href=&#34;#q-learning-of

## full_text

&lt;!-- In this post, we are gonna briefly go over the field of Reinforcement Learning (RL), from fundamental concepts to classic algorithms. Hopefully, this review is helpful enough so that newbies would not get lost in specialized terms and jargons while starting. [WARNING] This is a long read. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2020-09-03: Updated the algorithm of &lt;a href=&#34;#sarsa-on-policy-td-control&#34;&gt;SARSA&lt;/a&gt; and &lt;a href=&#34;#q-learning-of

## extraction_diagnostics

- extraction_method: fetch_failed_summary_fallback
- readability_score: 0
- fetch_status: timeout-fallback-visible-text
- extraction_quality: low
- diagnostics: {"method":"fetch_failed_summary_fallback","error_type":"timeout"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=medium｜confidence=medium
   &lt;!-- In this post, we are gonna briefly go over the field of Reinforcement Learning (RL), from fundamental concepts to classic algorithms. Hopefully, this review is helpful enough so that newbies would not get lost in specialized terms and jargons while starting. [WARNING] This is a long read. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2020-09-03: Updated the algorithm of &lt;a href=&#34;#sarsa-on-policy-td-control&#34;&gt;SARSA&lt;/a&gt; and &lt;a href=&#34;#q-learning-of

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   -- In this post, we are gonna briefly go over the field of Reinforcement Learning (RL), from fundamental concepts to classic algorithms.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   Hopefully, this review is helpful enough so that newbies would not get lost in specialized terms and jargons while starting.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   [WARNING] This is a long read.

5. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=medium｜confidence=medium
   --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2020-09-03: Updated the algorithm of &lt;a href=&#34;#sarsa-on-policy-td-control&#34;&gt;SARSA&lt;/a&gt; and &lt;a href=&#34;#q-learning-of

## business_elements

- companies: Lilian Weng's Blog (OpenAI)
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 合同审阅 / 法律研究
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 34, 2020, 09, 03
- quotes: 暂无公开信息

## evidence_seed

- company_actions: &lt;!-- In this post, we are gonna briefly go over the field of Reinforcement Learning (RL), from fundamental concepts to classic algorithms. Hopefully, this review is helpful enough so that newbies would not get lost in specialized terms and jargons while starting. [WARNING] This is a long read. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2020-09-03: Updated the algorithm of &lt;a href=&#34;#sarsa-on-policy-td-control&#34;&gt;SARSA&lt;/a&gt; and &lt;a href=&#34;#q-learning-of / -- In this post, we are gonna briefly go over the field of Reinforcement Learning (RL), from fundamental concepts to classic algorithms. / Hopefully, this review is helpful enough so that newbies would not get lost in specialized terms and jargons while starting.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: none
- importance_score: 1
- importance_reason: no core WaveSight importance signal
- supporting_signals:
- novelty: 2
- evidence_strength: 3
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
- watchlist: true

## pool_routes

- watchlist

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: summary_only
- visible_range: 仅保留采集通道当时可见文本，未抓到原页面正文
- evidence_level: core_evidence_candidate
- discovery_source: none
- source_role: discovery_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

&lt;!-- In this post, we are gonna briefly go over the field of Reinforcement Learning (RL), from fundamental concepts to classic algorithms. Hopefully, this review is helpful enough so that newbies would not get lost in specialized terms and jargons while starting. [WARNING] This is a long read. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2020-09-03: Updated the algorithm of &lt;a href=&#34;#sarsa-on-policy-td-control&#34;&gt;SARSA&lt;/a&gt; and &lt;a href=&#34;#q-learning-of

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
