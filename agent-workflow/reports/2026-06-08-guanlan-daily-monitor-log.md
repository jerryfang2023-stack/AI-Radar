# 2026-06-08 Guanlan Daily Monitor Log

- generated_at: 2026-06-08T00:36:49.175Z
- raw_count: 139
- aihot_mode: daily+all
- aihot_since: 2026-06-07T00:27:26.159Z
- aihot_discovered_count: 167
- aihot_daily_discovered_count: 13
- aihot_all_discovered_count: 154
- aihot_daily_included_count: 13
- aihot_daily_pool_count: 12
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 27
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 1677
- historical_duplicates_removed_before_fetch: 216
- historical_duplicates_removed_after_fetch: 3
- raw_dedupe_buffer: 40
- aihot_count: 106
- keyword_search_count: 24
- keyword_search_non_community_count: 24
- keyword_search_path_distribution: developer_ecosystem=6; capital_startup=5; a_media_gdelt=4; industry_landing=3; official_original=3; procurement_marketplace=3
- keyword_search_intent_distribution: find_startups=12; find_original_source=5; find_market_trend=4; find_customer_case=3
- source_distribution: aihot=106; keyword-search=24; gdelt=9
- raw_count_by_channel: aihot=106; keyword-search=24; gdelt=9
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=41; mature-commercial-signal=34; developer-ecosystem-signal=30; outside-core-exploration=19; early-direction-signal=10; capital-market-signal=5
- theme_distribution: technical-iteration-signal=43; mature-commercial-signal=35; developer-ecosystem-signal=26; outside-core-exploration=20; early-direction-signal=10; capital-market-signal=5
- theme_concentration_warning: none
- source_level_distribution: B=68; C=50; A=15; S=6
- evidence_object_type_distribution: event=50; community_feedback=33; case_or_customer=19; official_index_or_directory=10; supporting_article=8; regulatory_or_procurement=6; research_or_report=5; changelog_or_release=2; pricing_change=2; search_result_or_tool_directory=2; event_on_official_page=1; repo_readme_or_index=1
- pool_route_distribution: discard=45; watchlist=37; core_pool=31; index_only=25; emerging_pool=10; user_feedback_pool=5
- pool_index_route_distribution: core_pool=31; watchlist=28; index_only=15; emerging_pool=10; user_feedback_pool=5
- pool_index_count: 75
- pool_target: 75
- routed_pool_count: 60
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 29
- index_only_pool_count: 15
- aihot_index_only_count: 12
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 75
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 15 result(s): missing_ai_anchor_in_result=11; job_or_salary_page=3; noise_term:definition=1; Historical Raw dedupe removed 33 URL duplicate candidate(s) before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=57; community=50; media=9; developer=8; news=5; product=3; industry=2; research=2; funding=1; marketplace=1; official=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: summary-only-low-readable-body=55; fetched-readable-text-main=19; fetched-readable-text-content-container=15; fetched-readable-text-body-visible-text=12; no-url-summary-only=12; blocked-http-403=8; fetched-readable-text-json-ld=7; http-429-fallback-text=5; fetched-readable-text-meta-description=3; blocked-http-401=1; fetch-failed-fallback-visible-text=1; fetched-readable-text-article=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 6
- A: 15
- B: 68
- C: 50

## Evidence Object Type Distribution

- event: 50
- case_or_customer: 19
- changelog_or_release: 2
- regulatory_or_procurement: 6
- community_feedback: 33
- research_or_report: 5
- pricing_change: 2
- repo_readme_or_index: 1
- supporting_article: 8
- official_index_or_directory: 10
- event_on_official_page: 1
- search_result_or_tool_directory: 2

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 26
- 技术迭代信号 (technical-iteration-signal): 43
- 成熟信号 (mature-commercial-signal): 35
- 外围探索信号 (outside-core-exploration): 20
- 资本市场信号 (capital-market-signal): 5
- 早期信号 (early-direction-signal): 10

## Keyword Group Distribution

- developer-ecosystem-signal: 30
- technical-iteration-signal: 41
- mature-commercial-signal: 34
- outside-core-exploration: 19
- capital-market-signal: 5
- early-direction-signal: 10

## Keyword Search Path Distribution

- industry_landing: 3
- developer_ecosystem: 6
- official_original: 3
- procurement_marketplace: 3
- capital_startup: 5
- a_media_gdelt: 4

## Keyword Search Intent Distribution

- find_startups: 12
- find_customer_case: 3
- find_original_source: 5
- find_market_trend: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
