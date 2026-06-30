# 2026-06-30 Guanlan Daily Monitor Log

- generated_at: 2026-06-30T02:26:24.943Z
- raw_count: 116
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 22
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 5924
- historical_duplicates_removed_before_fetch: 38
- historical_duplicates_removed_after_fetch: 1
- raw_dedupe_buffer: 40
- aihot_count: 22
- keyword_search_count: 68
- keyword_search_non_community_count: 68
- keyword_search_path_distribution: official_original=22; capital_startup=15; developer_ecosystem=10; a_media_gdelt=9; industry_landing=6; procurement_marketplace=4; fde_implementation=2
- keyword_search_intent_distribution: find_customer_case=29; find_original_source=17; find_startups=13; find_market_trend=9
- source_distribution: keyword-search=68; aihot=22; rss-feed=15; gdelt=11
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 69
- enterprise_ai_transformation_stage_distribution: platform_enablement=32; ai_transformation=15; production_rollout=13; pilot=6; org_build=2; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: keyword-search=68; aihot=22; rss-feed=15; gdelt=11
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: targeted-pool-gap-refill=31; mature-commercial-signal=20; technical-iteration-signal=20; uncategorized=13; developer-ecosystem-signal=11; early-direction-signal=7; outside-core-exploration=7; enterprise-ai-implementation-signal=5; capital-market-signal=2
- theme_distribution: targeted-pool-gap-refill=31; mature-commercial-signal=20; technical-iteration-signal=20; uncategorized=13; outside-core-exploration=9; developer-ecosystem-signal=8; early-direction-signal=7; enterprise-ai-implementation-signal=6; capital-market-signal=2
- theme_concentration_warning: none
- source_level_distribution: B=80; C=16; S=11; A=9
- evidence_object_type_distribution: case_or_customer=52; official_index_or_directory=26; event=19; changelog_or_release=7; supporting_article=6; event_on_official_page=2; research_or_report=2; community_feedback=1; pricing_change=1
- pool_route_distribution: watchlist=36; core_pool=31; index_only=27; discard=22; emerging_pool=17; user_feedback_pool=15
- pool_index_route_distribution: watchlist=34; core_pool=31; index_only=25; emerging_pool=17; user_feedback_pool=15; discard=5
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 65
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 34
- index_only_pool_count: 25
- aihot_index_only_count: 22
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 35 result(s): missing_ai_anchor_in_result=15; noise_term:career=11; job_or_salary_page=5; noise_term:hiring=3; noise_term:definition=1; source-artifact keyword: Anysearch documented-payload retry for query "AI implementation startup funding enterprise workflow (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "enterprise AI implementation customer story (FDE OR "forward deployed" OR "applied AI" OR "customer engineering" OR "technical scoping" OR "production rollout" OR "pilot customer" OR "customer story" OR "case study")": Anysearch Search service temporarily unavailable.; source-artifact rss: RSS tigera-blog: HTTP 415; targeted pool/core refill cycle 1 added 3 item(s) for important_funding=3/5; routed_pool=41/60; core_pool=16/30; core_non_large=9/20; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=2; targeted pool/core refill cycle 2 added 16 item(s) for routed_pool=43/60; core_pool=18/30; core_non_large=11/20; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=2; noise_term:career=1; noise_term:hiring=1; targeted pool/core refill cycle 3 added 12 item(s) for routed_pool=58/60; core_pool=27/30
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=73; operators=16; media=6; developer=5; official=4; industry=3; news=3; product=3; builder=1; marketplace=1; organization-capability=1
- front_signal_sab_source_count: S=0; A=0; B=10; total=10
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: no-url-summary-only=31; fetched-readable-text-main=22; fetched-readable-text-content-container=19; fetched-readable-text-json-ld=17; blocked-http-403=11; summary-only-low-readable-body=7; fetched-readable-text-meta-description=4; fetched-readable-text-article=2; fetched-readable-text-body-visible-text=2; blocked-http-401=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 80
- C: 16
- A: 9
- S: 11

## Evidence Object Type Distribution

- case_or_customer: 52
- changelog_or_release: 7
- event: 19
- research_or_report: 2
- community_feedback: 1
- supporting_article: 6
- official_index_or_directory: 26
- event_on_official_page: 2
- pricing_change: 1

## Theme Distribution

- 资本市场信号 (capital-market-signal): 2
- 外围探索信号 (outside-core-exploration): 9
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 6
- 成熟信号 (mature-commercial-signal): 20
- 开发者生态信号 (developer-ecosystem-signal): 8
- 技术迭代信号 (technical-iteration-signal): 20
- targeted-pool-gap-refill (targeted-pool-gap-refill): 31
- 早期信号 (early-direction-signal): 7
- uncategorized (uncategorized): 13

## Keyword Group Distribution

- capital-market-signal: 2
- outside-core-exploration: 7
- enterprise-ai-implementation-signal: 5
- mature-commercial-signal: 20
- developer-ecosystem-signal: 11
- technical-iteration-signal: 20
- targeted-pool-gap-refill: 31
- early-direction-signal: 7
- uncategorized: 13

## Keyword Search Path Distribution

- developer_ecosystem: 10
- procurement_marketplace: 4
- capital_startup: 15
- fde_implementation: 2
- official_original: 22
- a_media_gdelt: 9
- industry_landing: 6

## Keyword Search Intent Distribution

- find_startups: 13
- find_customer_case: 29
- find_market_trend: 9
- find_original_source: 17

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
