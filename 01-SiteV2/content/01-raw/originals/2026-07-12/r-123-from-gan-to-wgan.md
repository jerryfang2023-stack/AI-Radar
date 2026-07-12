---
schema_version: raw-evidence-v2
raw_id: R-123
title: "From GAN to WGAN"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://lilianweng.github.io/posts/2017-08-20-gan/"
canonical_url: "https://lilianweng.github.io/posts/2017-08-20-gan"
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
collected_at: 2026-07-12T09:56:06.814Z
language: mixed
full_text_hash: dd2c7102829bf616
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-123-from-gan-to-wgan.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-123-from-gan-to-wgan.json"
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
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"dd2c7102829bf616","missing":["missing_snapshot"]}
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
url_hash: 79cb9159913d328c
content_hash: dd2c7102829bf616
semantic_hash: 14a6aeb8fe75dab8
duplicate_of: ""
first_seen_at: "2026-07-12T09:56:06.814Z"
last_seen_at: 2026-07-12T09:56:06.814Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"none","importance_score":1,"importance_reason":"no core WaveSight importance signal","supporting_signals":[],"novelty":2,"evidence_strength":3,"case_richness":4,"trend_relevance":2,"guanlan_relevance":2,"emerging_signal_score":3}
business_elements: {"companies":["Lilian Weng's Blog (OpenAI)","GitHub"],"products":[],"people":[],"industries":[],"roles":[],"workflows":[],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["39","34","2018","09","30","1"],"quotes":[]}
evidence_seed: {"company_actions":["&lt;!-- This post explains the maths behind a generative adversarial network (GAN) model and why it is hard to be trained. Wasserstein GAN is intended to improve GANs&#39; training by adopting a smooth metric for measuring the distance between two probability distributions. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-09-30: thanks to Yoonju, we have this post translated in &lt;a href=&#34;https://github.com/yjucho1/articles/blob/master/fromGANtoWGAN/readme.md&#34;&gt;Kore","-- This post explains the maths behind a generative adversarial network (GAN) model and why it is hard to be trained.","Wasserstein GAN is intended to improve GANs&#39; training by adopting a smooth metric for measuring the distance between two probability distributions."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有具体客户或真实企业案例","没有变化前后流程线索"]
key_excerpts: [{"type":"product_update","text":"&lt;!-- This post explains the maths behind a generative adversarial network (GAN) model and why it is hard to be trained. Wasserstein GAN is intended to improve GANs&#39; training by adopting a smooth metric for measuring the distance between two probability distributions. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-09-30: thanks to Yoonju, we have this post translated in &lt;a href=&#34;https://github.com/yjucho1/articles/blob/master/fromGANtoWGAN/readme.md&#34;&gt;Kore","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"-- This post explains the maths behind a generative adversarial network (GAN) model and why it is hard to be trained.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"Wasserstein GAN is intended to improve GANs&#39; training by adopting a smooth metric for measuring the distance between two probability distributions.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"},{"type":"product_update","text":"--&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-09-30: thanks to Yoonju, we have this post translated in &lt;a href=&#34;https://github.","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"com/yjucho1/articles/blob/master/fromGANtoWGAN/readme.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-12T09:56:06.814Z
theme: uncategorized
keyword_group: uncategorized
copyright_note: local research archive only
---

# From GAN to WGAN

## clean_text

&lt;!-- This post explains the maths behind a generative adversarial network (GAN) model and why it is hard to be trained. Wasserstein GAN is intended to improve GANs&#39; training by adopting a smooth metric for measuring the distance between two probability distributions. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-09-30: thanks to Yoonju, we have this post translated in &lt;a href=&#34;https://github.com/yjucho1/articles/blob/master/fromGANtoWGAN/readme.md&#34;&gt;Kore

## full_text

&lt;!-- This post explains the maths behind a generative adversarial network (GAN) model and why it is hard to be trained. Wasserstein GAN is intended to improve GANs&#39; training by adopting a smooth metric for measuring the distance between two probability distributions. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-09-30: thanks to Yoonju, we have this post translated in &lt;a href=&#34;https://github.com/yjucho1/articles/blob/master/fromGANtoWGAN/readme.md&#34;&gt;Kore

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
   &lt;!-- This post explains the maths behind a generative adversarial network (GAN) model and why it is hard to be trained. Wasserstein GAN is intended to improve GANs&#39; training by adopting a smooth metric for measuring the distance between two probability distributions. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-09-30: thanks to Yoonju, we have this post translated in &lt;a href=&#34;https://github.com/yjucho1/articles/blob/master/fromGANtoWGAN/readme.md&#34;&gt;Kore

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   -- This post explains the maths behind a generative adversarial network (GAN) model and why it is hard to be trained.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   Wasserstein GAN is intended to improve GANs&#39; training by adopting a smooth metric for measuring the distance between two probability distributions.

4. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=medium｜confidence=medium
   --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-09-30: thanks to Yoonju, we have this post translated in &lt;a href=&#34;https://github.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=medium
   com/yjucho1/articles/blob/master/fromGANtoWGAN/readme.

## business_elements

- companies: Lilian Weng's Blog (OpenAI), GitHub
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 39, 34, 2018, 09, 30, 1
- quotes: 暂无公开信息

## evidence_seed

- company_actions: &lt;!-- This post explains the maths behind a generative adversarial network (GAN) model and why it is hard to be trained. Wasserstein GAN is intended to improve GANs&#39; training by adopting a smooth metric for measuring the distance between two probability distributions. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-09-30: thanks to Yoonju, we have this post translated in &lt;a href=&#34;https://github.com/yjucho1/articles/blob/master/fromGANtoWGAN/readme.md&#34;&gt;Kore / -- This post explains the maths behind a generative adversarial network (GAN) model and why it is hard to be trained. / Wasserstein GAN is intended to improve GANs&#39; training by adopting a smooth metric for measuring the distance between two probability distributions.
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

&lt;!-- This post explains the maths behind a generative adversarial network (GAN) model and why it is hard to be trained. Wasserstein GAN is intended to improve GANs&#39; training by adopting a smooth metric for measuring the distance between two probability distributions. --&gt; &lt;p&gt;&lt;span class=&#34;update&#34;&gt;[Updated on 2018-09-30: thanks to Yoonju, we have this post translated in &lt;a href=&#34;https://github.com/yjucho1/articles/blob/master/fromGANtoWGAN/readme.md&#34;&gt;Kore

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
