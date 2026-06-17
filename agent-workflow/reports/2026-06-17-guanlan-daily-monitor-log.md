# 2026-06-17 Guanlan Daily Monitor Log

- generated_at: 2026-06-17T01:51:13.489Z
- raw_count: 188
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 27
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 3316
- historical_duplicates_removed_before_fetch: 149
- historical_duplicates_removed_after_fetch: 2
- raw_dedupe_buffer: 40
- aihot_count: 171
- keyword_search_count: 14
- keyword_search_non_community_count: 14
- keyword_search_path_distribution: procurement_marketplace=4; industry_landing=3; a_media_gdelt=2; capital_startup=2; developer_ecosystem=2; official_original=1
- keyword_search_intent_distribution: find_startups=7; find_original_source=4; find_market_trend=2; find_customer_case=1
- source_distribution: aihot=171; keyword-search=14; gdelt=3
- raw_count_by_channel: aihot=171; keyword-search=14; gdelt=3
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=72; developer-ecosystem-signal=55; mature-commercial-signal=30; early-direction-signal=17; outside-core-exploration=13; capital-market-signal=1
- theme_distribution: technical-iteration-signal=73; developer-ecosystem-signal=53; mature-commercial-signal=31; early-direction-signal=17; outside-core-exploration=13; capital-market-signal=1
- theme_concentration_warning: none
- source_level_distribution: B=83; C=72; A=18; S=15
- evidence_object_type_distribution: event=98; case_or_customer=28; official_index_or_directory=19; community_feedback=16; supporting_article=8; pricing_change=5; regulatory_or_procurement=5; research_or_report=4; changelog_or_release=2; event_on_official_page=2; repo_readme_or_index=1
- pool_route_distribution: watchlist=85; user_feedback_pool=70; index_only=58; emerging_pool=43; core_pool=36; discard=6
- pool_index_route_distribution: index_only=35; core_pool=30; watchlist=29; user_feedback_pool=23; emerging_pool=22
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 60
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 30
- index_only_pool_count: 35
- aihot_index_only_count: 27
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 4 result(s): missing_ai_anchor_in_result=3; directory_or_search_page=1
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=78; community=72; official=11; media=10; news=8; product=3; developer=2; domestic_vendor=2; funding=1; marketplace=1
- front_signal_sab_source_count: S=4; A=9; B=8; total=21
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=81; fetched-readable-text-content-container=36; no-url-summary-only=27; fetched-readable-text-body-visible-text=19; summary-only-low-readable-body=10; fetched-readable-text-json-ld=8; fetched-readable-text-article=3; fetched-readable-text-meta-description=2; blocked-http-403=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 72
- S: 15
- A: 18
- B: 83

## Evidence Object Type Distribution

- event: 98
- case_or_customer: 28
- research_or_report: 4
- community_feedback: 16
- pricing_change: 5
- repo_readme_or_index: 1
- regulatory_or_procurement: 5
- changelog_or_release: 2
- supporting_article: 8
- official_index_or_directory: 19
- event_on_official_page: 2

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 13
- 成熟信号 (mature-commercial-signal): 31
- 技术迭代信号 (technical-iteration-signal): 73
- 开发者生态信号 (developer-ecosystem-signal): 53
- 早期信号 (early-direction-signal): 17
- 资本市场信号 (capital-market-signal): 1

## Keyword Group Distribution

- outside-core-exploration: 13
- mature-commercial-signal: 30
- technical-iteration-signal: 72
- developer-ecosystem-signal: 55
- early-direction-signal: 17
- capital-market-signal: 1

## Keyword Search Path Distribution

- developer_ecosystem: 2
- industry_landing: 3
- procurement_marketplace: 4
- official_original: 1
- a_media_gdelt: 2
- capital_startup: 2

## Keyword Search Intent Distribution

- find_startups: 7
- find_original_source: 4
- find_market_trend: 2
- find_customer_case: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
