---
schema_version: raw-evidence-v2
raw_id: R-113
title: "Meta Reinforcement Learning"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://lilianweng.github.io/posts/2019-06-23-meta-rl/"
canonical_url: "https://lilianweng.github.io/posts/2019-06-23-meta-rl"
source_name: "Lilian Weng's Blog (OpenAI)"
source_type: builder
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: supporting_article
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
published_at: ""
collected_at: 2026-07-12T09:56:03.599Z
language: mixed
full_text_hash: eb9d97da08177da1
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-113-meta-reinforcement-learning.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-113-meta-reinforcement-learning.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: timeout-fallback-visible-text
extraction_quality: low
extraction_method: "fetch_failed_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"fetch_failed_summary_fallback","error_type":"timeout"}
has_full_text: true
content_length: 499
fetch_error: "fetch failed (code=UND_ERR_CONNECT_TIMEOUT)"
evidence_strength: blocked
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["missing_snapshot"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"eb9d97da08177da1","missing":["missing_snapshot"]}
source_volatility: medium
community_name: ""
capture_scope: summary_only
visible_range: "仅保留采集通道当时可见文本，未抓到原页面正文"
evidence_level: supporting_evidence
discovery_source: ""
discovery_record: null
source_role: discovery_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 9ebf1ba53d7f7751
content_hash: eb9d97da08177da1
semantic_hash: 9d66e1c4a5ed5bbb
duplicate_of: ""
first_seen_at: "2026-07-12T09:56:03.599Z"
last_seen_at: 2026-07-12T09:56:03.599Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"none","importance_score":1,"importance_reason":"no core WaveSight importance signal","supporting_signals":[],"novelty":2,"evidence_strength":3,"case_richness":3,"trend_relevance":2,"guanlan_relevance":2,"emerging_signal_score":3}
business_elements: {"companies":["Lilian Weng's Blog (OpenAI)","GitHub","Meta"],"products":["agent"],"people":[],"industries":[],"roles":[],"workflows":[],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["34","2018","11","30"],"quotes":[]}
evidence_seed: {"company_actions":["&lt;!-- Meta-RL is meta-learning on reinforcement learning tasks. After trained over a distribution of tasks, the agent is able to solve a new task by developing a new RL algorithm with its internal activity dynamics. This post starts with the origin of meta-RL and then dives into three key components of meta-RL. --&gt; &lt;p&gt;In my earlier post on &lt;a href=&#34;https://lilianweng.github.io/posts/2018-11-30-meta-learning/&#34;&gt;meta-learning&lt;/a&gt;, the problem is mainly defined in the","-- Meta-RL is meta-learning on reinforcement learning tasks.","After trained over a distribution of tasks, the agent is able to solve a new task by developing a new RL algorithm with its internal activity dynamics."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有具体客户或真实企业案例","没有变化前后流程线索"]
key_excerpts: [{"type":"company_action","text":"&lt;!-- Meta-RL is meta-learning on reinforcement learning tasks. After trained over a distribution of tasks, the agent is able to solve a new task by developing a new RL algorithm with its internal activity dynamics. This post starts with the origin of meta-RL and then dives into three key components of meta-RL. --&gt; &lt;p&gt;In my earlier post on &lt;a href=&#34;https://lilianweng.github.io/posts/2018-11-30-meta-learning/&#34;&gt;meta-learning&lt;/a&gt;, the problem is mainly defined in the","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"-- Meta-RL is meta-learning on reinforcement learning tasks.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"After trained over a distribution of tasks, the agent is able to solve a new task by developing a new RL algorithm with its internal activity dynamics.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"This post starts with the origin of meta-RL and then dives into three key components of meta-RL.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"--&gt; &lt;p&gt;In my earlier post on &lt;a href=&#34;https://lilianweng.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"io/posts/2018-11-30-meta-learning/&#34;&gt;meta-learning&lt;/a&gt;, the problem is mainly defined in the","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-12T09:56:03.599Z
theme: uncategorized
keyword_group: uncategorized
copyright_note: local research archive only
---

# Meta Reinforcement Learning

## clean_text

&lt;!-- Meta-RL is meta-learning on reinforcement learning tasks. After trained over a distribution of tasks, the agent is able to solve a new task by developing a new RL algorithm with its internal activity dynamics. This post starts with the origin of meta-RL and then dives into three key components of meta-RL. --&gt; &lt;p&gt;In my earlier post on &lt;a href=&#34;https://lilianweng.github.io/posts/2018-11-30-meta-learning/&#34;&gt;meta-learning&lt;/a&gt;, the problem is mainly defined in the

## full_text

&lt;!-- Meta-RL is meta-learning on reinforcement learning tasks. After trained over a distribution of tasks, the agent is able to solve a new task by developing a new RL algorithm with its internal activity dynamics. This post starts with the origin of meta-RL and then dives into three key components of meta-RL. --&gt; &lt;p&gt;In my earlier post on &lt;a href=&#34;https://lilianweng.github.io/posts/2018-11-30-meta-learning/&#34;&gt;meta-learning&lt;/a&gt;, the problem is mainly defined in the

## extraction_diagnostics

- extraction_method: fetch_failed_summary_fallback
- readability_score: 0
- fetch_status: timeout-fallback-visible-text
- extraction_quality: low
- diagnostics: {"method":"fetch_failed_summary_fallback","error_type":"timeout"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   &lt;!-- Meta-RL is meta-learning on reinforcement learning tasks. After trained over a distribution of tasks, the agent is able to solve a new task by developing a new RL algorithm with its internal activity dynamics. This post starts with the origin of meta-RL and then dives into three key components of meta-RL. --&gt; &lt;p&gt;In my earlier post on &lt;a href=&#34;https://lilianweng.github.io/posts/2018-11-30-meta-learning/&#34;&gt;meta-learning&lt;/a&gt;, the problem is mainly defined in the

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   -- Meta-RL is meta-learning on reinforcement learning tasks.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   After trained over a distribution of tasks, the agent is able to solve a new task by developing a new RL algorithm with its internal activity dynamics.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   This post starts with the origin of meta-RL and then dives into three key components of meta-RL.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   --&gt; &lt;p&gt;In my earlier post on &lt;a href=&#34;https://lilianweng.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   io/posts/2018-11-30-meta-learning/&#34;&gt;meta-learning&lt;/a&gt;, the problem is mainly defined in the

## business_elements

- companies: Lilian Weng's Blog (OpenAI), GitHub, Meta
- products: agent
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 34, 2018, 11, 30
- quotes: 暂无公开信息

## evidence_seed

- company_actions: &lt;!-- Meta-RL is meta-learning on reinforcement learning tasks. After trained over a distribution of tasks, the agent is able to solve a new task by developing a new RL algorithm with its internal activity dynamics. This post starts with the origin of meta-RL and then dives into three key components of meta-RL. --&gt; &lt;p&gt;In my earlier post on &lt;a href=&#34;https://lilianweng.github.io/posts/2018-11-30-meta-learning/&#34;&gt;meta-learning&lt;/a&gt;, the problem is mainly defined in the / -- Meta-RL is meta-learning on reinforcement learning tasks. / After trained over a distribution of tasks, the agent is able to solve a new task by developing a new RL algorithm with its internal activity dynamics.
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
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势
- 没有具体客户或真实企业案例
- 没有变化前后流程线索

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: summary_only
- visible_range: 仅保留采集通道当时可见文本，未抓到原页面正文
- evidence_level: supporting_evidence
- discovery_source: none
- source_role: discovery_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

&lt;!-- Meta-RL is meta-learning on reinforcement learning tasks. After trained over a distribution of tasks, the agent is able to solve a new task by developing a new RL algorithm with its internal activity dynamics. This post starts with the origin of meta-RL and then dives into three key components of meta-RL. --&gt; &lt;p&gt;In my earlier post on &lt;a href=&#34;https://lilianweng.github.io/posts/2018-11-30-meta-learning/&#34;&gt;meta-learning&lt;/a&gt;, the problem is mainly defined in the

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
