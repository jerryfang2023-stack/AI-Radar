# 2026-06-15 Guanlan Daily Monitor Log

- generated_at: 2026-06-15T03:58:54.581Z
- raw_count: 187
- aihot_mode: daily+all
- aihot_since: 2026-06-14T03:52:37.394Z
- aihot_discovered_count: 165
- aihot_daily_discovered_count: 6
- aihot_all_discovered_count: 159
- aihot_daily_included_count: 6
- aihot_daily_pool_count: 6
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 31
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 2930
- historical_duplicates_removed_before_fetch: 212
- historical_duplicates_removed_after_fetch: 3
- raw_dedupe_buffer: 40
- aihot_count: 123
- keyword_search_count: 20
- keyword_search_non_community_count: 20
- keyword_search_path_distribution: procurement_marketplace=7; a_media_gdelt=5; official_original=4; capital_startup=2; developer_ecosystem=1; industry_landing=1
- keyword_search_intent_distribution: find_startups=10; find_market_trend=5; find_original_source=3; find_customer_case=2
- source_distribution: aihot=123; rss-feed=39; keyword-search=20; gdelt=5
- raw_count_by_channel: aihot=123; rss-feed=39; keyword-search=20; gdelt=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=65; developer-ecosystem-signal=31; early-direction-signal=26; outside-core-exploration=25; mature-commercial-signal=22; uncategorized=10; capital-market-signal=8
- theme_distribution: technical-iteration-signal=66; developer-ecosystem-signal=29; early-direction-signal=26; outside-core-exploration=25; mature-commercial-signal=23; uncategorized=10; capital-market-signal=8
- theme_concentration_warning: none
- source_level_distribution: B=88; C=73; S=14; A=12
- evidence_object_type_distribution: event=72; community_feedback=36; case_or_customer=24; research_or_report=13; official_index_or_directory=12; regulatory_or_procurement=10; supporting_article=7; changelog_or_release=6; event_on_official_page=3; search_result_or_tool_directory=2; pricing_change=1; repo_readme_or_index=1
- pool_route_distribution: watchlist=65; index_only=60; user_feedback_pool=44; core_pool=35; emerging_pool=31; discard=21
- pool_index_route_distribution: watchlist=39; core_pool=31; user_feedback_pool=23; emerging_pool=22; index_only=22; discard=1
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 72
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 41
- index_only_pool_count: 22
- aihot_index_only_count: 6
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 10 result(s): missing_ai_anchor_in_result=8; directory_or_search_page=1; noise_term:career=1; Historical Raw dedupe removed 9 URL duplicate candidate(s) before Raw selection.; RSS tigera-blog: HTTP 415
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=77; community=73; product=10; media=7; news=5; funding=4; developer=3; official=3; industry=2; builder=1; domestic_vendor=1; research=1
- front_signal_sab_source_count: S=3; A=2; B=13; total=18
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=79; fetched-readable-text-body-visible-text=26; fetched-readable-text-content-container=23; no-url-summary-only=16; fetched-readable-text-article=13; summary-only-low-readable-body=12; fetched-readable-text-json-ld=8; blocked-http-403=3; http-404-fallback-text=3; fetched-readable-text-meta-description=1; fetched-readable-text-plain-text=1; http-429-fallback-text=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 14
- C: 73
- A: 12
- B: 88

## Evidence Object Type Distribution

- event: 72
- regulatory_or_procurement: 10
- pricing_change: 1
- community_feedback: 36
- repo_readme_or_index: 1
- case_or_customer: 24
- changelog_or_release: 6
- research_or_report: 13
- supporting_article: 7
- search_result_or_tool_directory: 2
- event_on_official_page: 3
- official_index_or_directory: 12

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 29
- 外围探索信号 (outside-core-exploration): 25
- 早期信号 (early-direction-signal): 26
- 技术迭代信号 (technical-iteration-signal): 66
- 成熟信号 (mature-commercial-signal): 23
- 资本市场信号 (capital-market-signal): 8
- uncategorized (uncategorized): 10

## Keyword Group Distribution

- developer-ecosystem-signal: 31
- outside-core-exploration: 25
- early-direction-signal: 26
- technical-iteration-signal: 65
- capital-market-signal: 8
- mature-commercial-signal: 22
- uncategorized: 10

## Keyword Search Path Distribution

- developer_ecosystem: 1
- capital_startup: 2
- a_media_gdelt: 5
- official_original: 4
- procurement_marketplace: 7
- industry_landing: 1

## Keyword Search Intent Distribution

- find_startups: 10
- find_market_trend: 5
- find_customer_case: 2
- find_original_source: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
