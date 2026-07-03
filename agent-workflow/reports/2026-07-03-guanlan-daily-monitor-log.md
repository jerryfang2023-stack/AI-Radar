# 2026-07-03 Guanlan Daily Monitor Log

- generated_at: 2026-07-03T01:59:31.632Z
- raw_count: 136
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 20
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 6346
- historical_duplicates_removed_before_fetch: 408
- historical_duplicates_removed_after_fetch: 177
- raw_dedupe_buffer: 140
- aihot_count: 73
- keyword_search_count: 37
- keyword_search_non_community_count: 37
- keyword_search_path_distribution: official_original=19; capital_startup=7; industry_landing=4; a_media_gdelt=3; developer_ecosystem=3; procurement_marketplace=1
- keyword_search_intent_distribution: find_original_source=18; find_startups=9; find_customer_case=7; find_market_trend=3
- source_distribution: aihot=73; keyword-search=37; rss-feed=23; gdelt=3
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 55
- enterprise_ai_transformation_stage_distribution: platform_enablement=30; production_rollout=9; ai_transformation=7; pilot=7; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=73; keyword-search=37; rss-feed=23; gdelt=3
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=32; developer-ecosystem-signal=29; targeted-pool-gap-refill=23; uncategorized=21; mature-commercial-signal=15; early-direction-signal=8; outside-core-exploration=5; capital-market-signal=2; enterprise-ai-implementation-signal=1
- theme_distribution: technical-iteration-signal=33; developer-ecosystem-signal=26; targeted-pool-gap-refill=23; uncategorized=21; mature-commercial-signal=15; early-direction-signal=10; outside-core-exploration=5; capital-market-signal=2; enterprise-ai-implementation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=48; case_or_customer=41; official_index_or_directory=18; changelog_or_release=13; event_on_official_page=4; regulatory_or_procurement=3; research_or_report=3; supporting_article=3; pricing_change=2; community_feedback=1
- pool_route_distribution: watchlist=61; index_only=32; core_pool=31; emerging_pool=19; discard=11; user_feedback_pool=3
- pool_index_route_distribution: watchlist=61; index_only=32; core_pool=31; emerging_pool=19; user_feedback_pool=3
- pool_index_count: 125
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 93
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 62
- index_only_pool_count: 32
- aihot_index_only_count: 20
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 125
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 23 result(s): missing_ai_anchor_in_result=14; noise_term:career=4; job_or_salary_page=2; noise_term:hiring=2; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 3 result(s): missing_ai_anchor_in_result=3; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=2/5; core_pool=26/30; core_non_large=16/20; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=1; noise_term:avatar=1; targeted raw-volume refill cycle 1 added 14 item(s) for raw_count=127/150; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=1; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 9 item(s) for raw_count=136/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=101; news=9; operators=7; developer=6; media=5; official=4; builder=2; product=1; research=1
- front_signal_sab_source_count: S=2; A=5; B=7; total=14
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=38; fetched-readable-text-main=38; no-url-summary-only=25; fetched-readable-text-body-visible-text=13; summary-only-low-readable-body=11; blocked-http-403=3; fetched-readable-text-json-ld=3; fetched-readable-text-meta-description=3; fetched-readable-text-article=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 14
- B: 105
- S: 10
- C: 7

## Evidence Object Type Distribution

- event: 48
- case_or_customer: 41
- changelog_or_release: 13
- event_on_official_page: 4
- community_feedback: 1
- pricing_change: 2
- regulatory_or_procurement: 3
- research_or_report: 3
- supporting_article: 3
- official_index_or_directory: 18

## Theme Distribution

- 早期信号 (early-direction-signal): 10
- 外围探索信号 (outside-core-exploration): 5
- 成熟信号 (mature-commercial-signal): 15
- 技术迭代信号 (technical-iteration-signal): 33
- 开发者生态信号 (developer-ecosystem-signal): 26
- 资本市场信号 (capital-market-signal): 2
- targeted-pool-gap-refill (targeted-pool-gap-refill): 23
- uncategorized (uncategorized): 21
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 1

## Keyword Group Distribution

- early-direction-signal: 8
- outside-core-exploration: 5
- mature-commercial-signal: 15
- technical-iteration-signal: 32
- developer-ecosystem-signal: 29
- capital-market-signal: 2
- targeted-pool-gap-refill: 23
- uncategorized: 21
- enterprise-ai-implementation-signal: 1

## Keyword Search Path Distribution

- official_original: 19
- a_media_gdelt: 3
- capital_startup: 7
- industry_landing: 4
- developer_ecosystem: 3
- procurement_marketplace: 1

## Keyword Search Intent Distribution

- find_startups: 9
- find_market_trend: 3
- find_original_source: 18
- find_customer_case: 7

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
