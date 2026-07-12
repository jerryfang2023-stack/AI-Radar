---
schema_version: raw-evidence-v2
raw_id: R-120
title: "Policy Gradient Algorithms"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://lilianweng.github.io/posts/2018-04-08-policy-gradient/"
canonical_url: "https://lilianweng.github.io/posts/2018-04-08-policy-gradient"
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
collected_at: 2026-07-12T09:56:05.800Z
language: mixed
full_text_hash: 91f7bc4d0e1316bf
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-120-policy-gradient-algorithms.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-120-policy-gradient-algorithms.json"
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
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"91f7bc4d0e1316bf","missing":["missing_snapshot"]}
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
url_hash: 9957c973a9f543ba
content_hash: 91f7bc4d0e1316bf
semantic_hash: 2fcd3277e4ef3a7c
duplicate_of: ""
first_seen_at: "2026-07-12T09:56:05.800Z"
last_seen_at: 2026-07-12T09:56:05.800Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"none","importance_score":1,"importance_reason":"no core WaveSight importance signal","supporting_signals":[],"novelty":2,"evidence_strength":3,"case_richness":4,"trend_relevance":2,"guanlan_relevance":2,"emerging_signal_score":3}
business_elements: {"companies":["Lilian Weng's Blog (OpenAI)"],"products":[],"people":[],"industries":[],"roles":["CIO / IT 负责人"],"workflows":[],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["3","2","4","34","2018","06","30"],"quotes":[]}
evidence_seed: {"company_actions":["&lt;!-- Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, SAC, TD3 &amp; SVPG. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-06-30: add two new policy gradient methods, &lt;a href=&#34;#sac&#34;&gt;SAC&lt;/a&gt; and &lt;a href=&#34;#d4pg&#34;&gt;D4PG&lt","-- Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, SAC, TD3 &amp; SVPG.","--&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-06-30: add two new policy gradient methods, &lt;a href=&#34;#sac&#34;&gt;SAC&lt;/a&gt; and &lt;a href=&#34;#d4pg&#34;&gt;D4PG&lt"],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有具体客户或真实企业案例","没有变化前后流程线索"]
key_excerpts: [{"type":"product_update","text":"&lt;!-- Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, SAC, TD3 &amp; SVPG. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-06-30: add two new policy gradient methods, &lt;a href=&#34;#sac&#34;&gt;SAC&lt;/a&gt; and &lt;a href=&#34;#d4pg&#34;&gt;D4PG&lt","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"-- Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, SAC, TD3 &amp; SVPG.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"product_update","text":"--&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-06-30: add two new policy gradient methods, &lt;a href=&#34;#sac&#34;&gt;SAC&lt;/a&gt; and &lt;a href=&#34;#d4pg&#34;&gt;D4PG&lt","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"medium","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-12T09:56:05.800Z
theme: uncategorized
keyword_group: uncategorized
copyright_note: local research archive only
---

# Policy Gradient Algorithms

## clean_text

&lt;!-- Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, SAC, TD3 &amp; SVPG. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-06-30: add two new policy gradient methods, &lt;a href=&#34;#sac&#34;&gt;SAC&lt;/a&gt; and &lt;a href=&#34;#d4pg&#34;&gt;D4PG&lt

## full_text

&lt;!-- Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, SAC, TD3 &amp; SVPG. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-06-30: add two new policy gradient methods, &lt;a href=&#34;#sac&#34;&gt;SAC&lt;/a&gt; and &lt;a href=&#34;#d4pg&#34;&gt;D4PG&lt

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
   &lt;!-- Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, SAC, TD3 &amp; SVPG. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-06-30: add two new policy gradient methods, &lt;a href=&#34;#sac&#34;&gt;SAC&lt;/a&gt; and &lt;a href=&#34;#d4pg&#34;&gt;D4PG&lt

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   -- Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, SAC, TD3 &amp; SVPG.

3. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=medium｜confidence=medium
   --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-06-30: add two new policy gradient methods, &lt;a href=&#34;#sac&#34;&gt;SAC&lt;/a&gt; and &lt;a href=&#34;#d4pg&#34;&gt;D4PG&lt

## business_elements

- companies: Lilian Weng's Blog (OpenAI)
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: CIO / IT 负责人
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 3, 2, 4, 34, 2018, 06, 30
- quotes: 暂无公开信息

## evidence_seed

- company_actions: &lt;!-- Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, SAC, TD3 &amp; SVPG. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-06-30: add two new policy gradient methods, &lt;a href=&#34;#sac&#34;&gt;SAC&lt;/a&gt; and &lt;a href=&#34;#d4pg&#34;&gt;D4PG&lt / -- Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, SAC, TD3 &amp; SVPG. / --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-06-30: add two new policy gradient methods, &lt;a href=&#34;#sac&#34;&gt;SAC&lt;/a&gt; and &lt;a href=&#34;#d4pg&#34;&gt;D4PG&lt
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: CIO / IT 负责人
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: none
- importance_score: 1
- importance_reason: no core WaveSight importance signal
- supporting_signals:
- novelty: 2
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

&lt;!-- Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, SAC, TD3 &amp; SVPG. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-06-30: add two new policy gradient methods, &lt;a href=&#34;#sac&#34;&gt;SAC&lt;/a&gt; and &lt;a href=&#34;#d4pg&#34;&gt;D4PG&lt

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
