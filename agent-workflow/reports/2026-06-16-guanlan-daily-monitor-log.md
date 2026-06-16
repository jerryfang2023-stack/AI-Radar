# 2026-06-16 Guanlan Daily Monitor Log

- generated_at: 2026-06-16T03:08:05.254Z
- raw_count: 192
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 17
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 3124
- historical_duplicates_removed_before_fetch: 5
- historical_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 40
- aihot_count: 181
- keyword_search_count: 10
- keyword_search_non_community_count: 10
- keyword_search_path_distribution: official_original=3; a_media_gdelt=2; capital_startup=2; procurement_marketplace=2; industry_landing=1
- keyword_search_intent_distribution: find_startups=4; find_customer_case=3; find_market_trend=2; find_original_source=1
- source_distribution: aihot=181; keyword-search=10; gdelt=1
- raw_count_by_channel: aihot=181; keyword-search=10; gdelt=1
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=59; developer-ecosystem-signal=53; outside-core-exploration=31; mature-commercial-signal=24; early-direction-signal=21; targeted-pool-gap-refill=3; capital-market-signal=1
- theme_distribution: technical-iteration-signal=59; developer-ecosystem-signal=53; outside-core-exploration=31; mature-commercial-signal=24; early-direction-signal=21; targeted-pool-gap-refill=3; capital-market-signal=1
- theme_concentration_warning: none
- source_level_distribution: B=91; C=77; A=14; S=10
- evidence_object_type_distribution: event=83; community_feedback=41; case_or_customer=27; official_index_or_directory=11; supporting_article=10; research_or_report=6; regulatory_or_procurement=5; event_on_official_page=3; changelog_or_release=2; search_result_or_tool_directory=2; pricing_change=1; repo_readme_or_index=1
- pool_route_distribution: index_only=77; watchlist=70; user_feedback_pool=45; core_pool=33; emerging_pool=28; discard=11
- pool_index_route_distribution: watchlist=34; core_pool=30; index_only=29; user_feedback_pool=23; emerging_pool=14; discard=1
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 65
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 35
- index_only_pool_count: 29
- aihot_index_only_count: 17
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 4 result(s): missing_ai_anchor_in_result=3; directory_or_search_page=1; source-artifact rss: RSS tigera-blog: HTTP 415; targeted pool/core refill cycle 1 added 3 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=83; community=77; media=7; news=6; official=6; developer=4; domestic_vendor=4; industry=2; builder=1; marketplace=1; research=1
- front_signal_sab_source_count: S=2; A=4; B=10; total=16
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=81; fetched-readable-text-body-visible-text=43; fetched-readable-text-content-container=25; no-url-summary-only=17; summary-only-low-readable-body=13; fetched-readable-text-json-ld=6; blocked-http-403=5; fetched-readable-text-article=2
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 14
- C: 77
- S: 10
- B: 91

## Evidence Object Type Distribution

- event: 83
- regulatory_or_procurement: 5
- community_feedback: 41
- research_or_report: 6
- case_or_customer: 27
- repo_readme_or_index: 1
- pricing_change: 1
- changelog_or_release: 2
- supporting_article: 10
- search_result_or_tool_directory: 2
- event_on_official_page: 3
- official_index_or_directory: 11

## Theme Distribution

- 早期信号 (early-direction-signal): 21
- 技术迭代信号 (technical-iteration-signal): 59
- 成熟信号 (mature-commercial-signal): 24
- 外围探索信号 (outside-core-exploration): 31
- 开发者生态信号 (developer-ecosystem-signal): 53
- targeted-pool-gap-refill (targeted-pool-gap-refill): 3
- 资本市场信号 (capital-market-signal): 1

## Keyword Group Distribution

- early-direction-signal: 21
- technical-iteration-signal: 59
- mature-commercial-signal: 24
- outside-core-exploration: 31
- developer-ecosystem-signal: 53
- targeted-pool-gap-refill: 3
- capital-market-signal: 1

## Keyword Search Path Distribution

- capital_startup: 2
- official_original: 3
- a_media_gdelt: 2
- industry_landing: 1
- procurement_marketplace: 2

## Keyword Search Intent Distribution

- find_startups: 4
- find_customer_case: 3
- find_market_trend: 2
- find_original_source: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
