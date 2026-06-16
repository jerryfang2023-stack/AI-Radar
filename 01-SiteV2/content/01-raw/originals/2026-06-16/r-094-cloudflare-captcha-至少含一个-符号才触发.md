---
schema_version: raw-evidence-v2
raw_id: R-094
title: "Cloudflare CAPTCHA 至少含一个 & 符号才触发"
original_url: "https://simonwillison.net/2026/Jun/16/captcha-on-at-least-one-ampersand"
canonical_url: "https://simonwillison.net/2026/Jun/16/captcha-on-at-least-one-ampersand"
source_name: "Simon Willison 博客"
source_type: builder
source_level: S
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
published_at: "2026-06-16T00:21:36.000Z"
collected_at: 2026-06-16T03:08:05.080Z
language: mixed
full_text_hash: 8036f21ec20b35f2
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-16/r-094-cloudflare-captcha-至少含一个-符号才触发.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-16/r-094-cloudflare-captcha-至少含一个-符号才触发.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-body-visible-text
extraction_quality: medium
extraction_method: "body-visible-text"
readability_score: 57
extractor_diagnostics: {"readability_score":57,"text_length":2150,"paragraph_count":18,"sentence_count":10,"boilerplate_hits":2,"symbol_ratio":0.0037,"method":"body-visible-text"}
has_full_text: true
content_length: 2150
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"8036f21ec20b35f2","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Cloudflare CAPTCHA 至少含一个 & 符号才触发","discovery_summary":"使用 Cloudflare CAPTCHA（WAF 自定义规则 Managed Challenge）防止爬虫过度抓取分面搜索引擎时，连简单 `？q=term` 搜索也会触发验证。通过 Claude Code 发现可注册规则：仅当搜索 URL 包含至少一个 `&` 符号才触发 CAPTCHA，例如 `/search/？q=lemur` 不再触发验证。另尝试了 Cloudflare MCP 与 Claude Code 集成但无法编辑规则，改用 Cloudflare API 实现。","source_name":"Simon Willison 博客","origin_url":"https://simonwillison.net/2026/Jun/16/captcha-on-at-least-one-ampersand","discovered_at":"2026-06-16T03:02:46.998Z","rank_on_page":53,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 528d855b556c22f9
content_hash: 8036f21ec20b35f2
semantic_hash: e298b1e29dfcde3e
duplicate_of: ""
first_seen_at: "2026-06-16T00:21:36.000Z"
last_seen_at: 2026-06-16T03:08:05.080Z
update_detected: false
raw_status: candidate
usable_for: {"viewpoint":true,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["emerging_pool","watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":4,"importance_reason":"technical trend or capability shift; rubric=4 concrete important change","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":4}
business_elements: {"companies":["Simon Willison 博客"],"products":["Claude","MCP","claude"],"people":[],"industries":["开发者工具"],"roles":["开发者 / 工程团队"],"workflows":["权限 / 安全治理","部署 / 集成交付"],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["16","2026","2017","5","12","21","13","11"],"quotes":["Managed Challenge","Web Application Firewall > Custom rules > Managed Challenge","/search/*"]}
evidence_seed: {"company_actions":["使用 Cloudflare CAPTCHA（WAF 自定义规则 Managed Challenge）防止爬虫过度抓取分面搜索引擎时，连简单 `？q=term` 搜索也会触发验证。通过 Claude Code 发现可注册规则：仅当搜索 URL 包含至少一个 `&` 符号才触发 CAPTCHA，例如 `/search/？q=lemur` 不再触发验证。另尝试了 Cloudflare MCP 与 Claude Code 集成但无法编辑规则，改用 Cloudflare API 实现。","TIL: Cloudflare CAPTCHA on at least one ampersand Simon Willison’s Weblog Subscribe Sponsored by: Teleport &mdash; Prevent access bottlenecks.","net/search/](https://simonwillison."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":["Teleport replaces fragmented identity and access tooling with a single identity layer that security teams trust, and engineers want to use."]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"product_update","text":"使用 Cloudflare CAPTCHA（WAF 自定义规则 Managed Challenge）防止爬虫过度抓取分面搜索引擎时，连简单 `？q=term` 搜索也会触发验证。通过 Claude Code 发现可注册规则：仅当搜索 URL 包含至少一个 `&` 符号才触发 CAPTCHA，例如 `/search/？q=lemur` 不再触发验证。另尝试了 Cloudflare MCP 与 Claude Code 集成但无法编辑规则，改用 Cloudflare API 实现。","supports":["daily_observation","heatmap","change"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"TIL: Cloudflare CAPTCHA on at least one ampersand Simon Willison’s Weblog Subscribe Sponsored by: Teleport &mdash; Prevent access bottlenecks.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"supporting_context","text":"Teleport replaces fragmented identity and access tooling with a single identity layer that security teams trust, and engineers want to use.","supports":["daily_observation","heatmap"],"importance":"high","confidence":"medium"},{"type":"quote","text":"16th June 2026 TIL Cloudflare CAPTCHA on at least one ampersand &mdash; I use Cloudflare's CAPTCHA (they call it a \"Managed Challenge\") on [simonwillison.","supports":["daily_observation","heatmap","viewpoint"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"net/search/](https://simonwillison.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"net/search/) to prevent crawlers from following every single possible combination of my [faceted search](https://simonwillison.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Cloudflare CAPTCHA 至少含一个 & 符号才触发

## clean_text

TIL: Cloudflare CAPTCHA on at least one ampersand
Simon Willison’s Weblog
Subscribe
Sponsored by: Teleport &mdash; Prevent access bottlenecks. Unify identity. Teleport replaces fragmented identity and access tooling with a single identity layer that security teams trust, and engineers want to use.
16th June 2026
TIL
Cloudflare CAPTCHA on at least one ampersand
&mdash; I use Cloudflare's CAPTCHA (they call it a "Managed Challenge") on [simonwillison.net/search/](https://simonwillison.net/search/) to prevent crawlers from following every single possible combination of my [faceted search](https://simonwillison.net/2017/Oct/5/django-postgresql-faceted-search/) UI.
I'm using Cloudflare's CAPTCHA (they call it a "Web Application Firewall > Custom rules > Managed Challenge" these days) to prevent crawlers from aggresively spidering my faceted search engine on this site, but I got fed up of even simple ?q=term searches triggering the challenge.
After some mucking around with Claude Code it turns out you can register the following rule instead, so the CAPTCHA only kicks in for search URLs containing at least one ampersand:
(http.request.uri.path wildcard r"/search/*" and http.request.uri.query contains "&")
And now /search/?q=lemur works without triggering a CAPTCHA!
Also included: notes on trying out the Cloudflare MCP with Claude Code , though it turned out not to be able to edit the rules in question so I had Claude Code switch to the Cloudflare API instead.
Posted 16th June 2026 at 12:21 am
Recent articles
Publishing WASM wheels to PyPI for use with Pyodide - 13th June 2026
Claude Fable is relentlessly proactive - 11th June 2026
Initial impressions of Claude Fable 5 - 9th June 2026
This is a beat by Simon Willison, posted on 16th June 2026 .
captchas
cloudflare
31
model-context-protocol
26
claude-code
117
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

TIL: Cloudflare CAPTCHA on at least one ampersand
Simon Willison’s Weblog
Subscribe
Sponsored by: Teleport &mdash; Prevent access bottlenecks. Unify identity. Teleport replaces fragmented identity and access tooling with a single identity layer that security teams trust, and engineers want to use.
16th June 2026
TIL
Cloudflare CAPTCHA on at least one ampersand
&mdash; I use Cloudflare's CAPTCHA (they call it a "Managed Challenge") on [simonwillison.net/search/](https://simonwillison.net/search/) to prevent crawlers from following every single possible combination of my [faceted search](https://simonwillison.net/2017/Oct/5/django-postgresql-faceted-search/) UI.
I'm using Cloudflare's CAPTCHA (they call it a "Web Application Firewall > Custom rules > Managed Challenge" these days) to prevent crawlers from aggresively spidering my faceted search engine on this site, but I got fed up of even simple ?q=term searches triggering the challenge.
After some mucking around with Claude Code it turns out you can register the following rule instead, so the CAPTCHA only kicks in for search URLs containing at least one ampersand:
(http.request.uri.path wildcard r"/search/*" and http.request.uri.query contains "&")
And now /search/?q=lemur works without triggering a CAPTCHA!
Also included: notes on trying out the Cloudflare MCP with Claude Code , though it turned out not to be able to edit the rules in question so I had Claude Code switch to the Cloudflare API instead.
Posted 16th June 2026 at 12:21 am
Recent articles
Publishing WASM wheels to PyPI for use with Pyodide - 13th June 2026
Claude Fable is relentlessly proactive - 11th June 2026
Initial impressions of Claude Fable 5 - 9th June 2026
This is a beat by Simon Willison, posted on 16th June 2026 .
captchas
cloudflare
31
model-context-protocol
26
claude-code
117
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
- readability_score: 57
- fetch_status: fetched-readable-text-body-visible-text
- extraction_quality: medium
- diagnostics: {"readability_score":57,"text_length":2150,"paragraph_count":18,"sentence_count":10,"boilerplate_hits":2,"symbol_ratio":0.0037,"method":"body-visible-text"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **product_update**｜supports=daily_observation, heatmap, change｜importance=high｜confidence=medium
   使用 Cloudflare CAPTCHA（WAF 自定义规则 Managed Challenge）防止爬虫过度抓取分面搜索引擎时，连简单 `？q=term` 搜索也会触发验证。通过 Claude Code 发现可注册规则：仅当搜索 URL 包含至少一个 `&` 符号才触发 CAPTCHA，例如 `/search/？q=lemur` 不再触发验证。另尝试了 Cloudflare MCP 与 Claude Code 集成但无法编辑规则，改用 Cloudflare API 实现。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   TIL: Cloudflare CAPTCHA on at least one ampersand Simon Willison’s Weblog Subscribe Sponsored by: Teleport &mdash; Prevent access bottlenecks.

3. **supporting_context**｜supports=daily_observation, heatmap｜importance=high｜confidence=medium
   Teleport replaces fragmented identity and access tooling with a single identity layer that security teams trust, and engineers want to use.

4. **quote**｜supports=daily_observation, heatmap, viewpoint｜importance=high｜confidence=medium
   16th June 2026 TIL Cloudflare CAPTCHA on at least one ampersand &mdash; I use Cloudflare's CAPTCHA (they call it a "Managed Challenge") on [simonwillison.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   net/search/](https://simonwillison.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   net/search/) to prevent crawlers from following every single possible combination of my [faceted search](https://simonwillison.

## business_elements

- companies: Simon Willison 博客
- products: Claude, MCP, claude
- people: 暂无公开信息
- industries: 开发者工具
- roles: 开发者 / 工程团队
- workflows: 权限 / 安全治理, 部署 / 集成交付
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 16, 2026, 2017, 5, 12, 21, 13, 11
- quotes: Managed Challenge / Web Application Firewall > Custom rules > Managed Challenge / /search/*

## evidence_seed

- company_actions: 使用 Cloudflare CAPTCHA（WAF 自定义规则 Managed Challenge）防止爬虫过度抓取分面搜索引擎时，连简单 `？q=term` 搜索也会触发验证。通过 Claude Code 发现可注册规则：仅当搜索 URL 包含至少一个 `&` 符号才触发 CAPTCHA，例如 `/search/？q=lemur` 不再触发验证。另尝试了 Cloudflare MCP 与 Claude Code 集成但无法编辑规则，改用 Cloudflare API 实现。 / TIL: Cloudflare CAPTCHA on at least one ampersand Simon Willison’s Weblog Subscribe Sponsored by: Teleport &mdash; Prevent access bottlenecks. / net/search/](https://simonwillison.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: Teleport replaces fragmented identity and access tooling with a single identity layer that security teams trust, and engineers want to use.

## guanlan_scores

- importance_type: important_technical_trend
- importance_score: 4
- importance_reason: technical trend or capability shift; rubric=4 concrete important change
- supporting_signals: commercial_or_risk_context,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 5
- guanlan_relevance: 4
- emerging_signal_score: 4

## usable_for

- viewpoint: true
- case: true
- change: true
- trend: true
- daily_observation: true
- heatmap: true
- briefing: true
- emerging_pool: true
- user_feedback_pool: false
- watchlist: true

## pool_routes

- emerging_pool
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
- discovery_record: {"discovery_title":"Cloudflare CAPTCHA 至少含一个 & 符号才触发","discovery_summary":"使用 Cloudflare CAPTCHA（WAF 自定义规则 Managed Challenge）防止爬虫过度抓取分面搜索引擎时，连简单 `？q=term` 搜索也会触发验证。通过 Claude Code 发现可注册规则：仅当搜索 URL 包含至少一个 `&` 符号才触发 CAPTCHA，例如 `/search/？q=lemur` 不再触发验证。另尝试了 Cloudflare MCP 与 Claude Code 集成但无法编辑规则，改用 Cloudflare API 实现。","source_name":"Simon Willison 博客","origin_url":"https://simonwillison.net/2026/Jun/16/captcha-on-at-least-one-ampersand","discovered_at":"2026-06-16T03:02:46.998Z","rank_on_page":53,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

使用 Cloudflare CAPTCHA（WAF 自定义规则 Managed Challenge）防止爬虫过度抓取分面搜索引擎时，连简单 `？q=term` 搜索也会触发验证。通过 Claude Code 发现可注册规则：仅当搜索 URL 包含至少一个 `&` 符号才触发 CAPTCHA，例如 `/search/？q=lemur` 不再触发验证。另尝试了 Cloudflare MCP 与 Claude Code 集成但无法编辑规则，改用 Cloudflare API 实现。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
