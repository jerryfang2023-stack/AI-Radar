# 2026-06-09 Guanlan Daily Monitor Log

- generated_at: 2026-06-09T02:33:36.748Z
- raw_count: 186
- aihot_mode: daily+all
- aihot_since: 2026-06-08T02:25:42.177Z
- aihot_discovered_count: 431
- aihot_daily_discovered_count: 31
- aihot_all_discovered_count: 400
- aihot_daily_included_count: 31
- aihot_daily_pool_count: 30
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 88
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 1816
- historical_duplicates_removed_before_fetch: 204
- historical_duplicates_removed_after_fetch: 4
- raw_dedupe_buffer: 40
- aihot_count: 162
- keyword_search_count: 19
- keyword_search_non_community_count: 19
- keyword_search_path_distribution: developer_ecosystem=6; procurement_marketplace=5; a_media_gdelt=2; capital_startup=2; industry_landing=2; official_original=2
- keyword_search_intent_distribution: find_startups=13; find_original_source=3; find_market_trend=2; find_customer_case=1
- source_distribution: aihot=162; keyword-search=19; gdelt=5
- raw_count_by_channel: aihot=162; keyword-search=19; gdelt=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=59; technical-iteration-signal=52; outside-core-exploration=27; mature-commercial-signal=24; early-direction-signal=21; capital-market-signal=3
- theme_distribution: developer-ecosystem-signal=55; technical-iteration-signal=54; outside-core-exploration=27; mature-commercial-signal=25; early-direction-signal=21; capital-market-signal=4
- theme_concentration_warning: none
- source_level_distribution: B=100; C=61; A=14; S=11
- evidence_object_type_distribution: event=78; community_feedback=32; case_or_customer=24; official_index_or_directory=22; supporting_article=11; regulatory_or_procurement=8; changelog_or_release=5; event_on_official_page=4; research_or_report=1; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=56; discard=47; index_only=46; core_pool=36; emerging_pool=12; user_feedback_pool=2
- pool_index_route_distribution: core_pool=31; index_only=30; watchlist=28; emerging_pool=11; user_feedback_pool=2
- pool_index_count: 90
- pool_target: 75
- routed_pool_count: 60
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 29
- index_only_pool_count: 30
- aihot_index_only_count: 30
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 90
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 9 result(s): missing_ai_anchor_in_result=6; job_or_salary_page=2; noise_term:hiring=1; Search cross-entry dedupe removed 6 duplicate provider hits before Raw selection.; RSS import-ai-newsletter: HTTP 403
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=92; community=61; media=7; news=7; official=6; developer=5; product=3; domestic_vendor=2; industry=2; funding=1
- front_signal_sab_source_count: S=2; A=1; B=11; total=14
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: summary-only-low-readable-body=68; fetched-readable-text-content-container=30; no-url-summary-only=30; fetched-readable-text-body-visible-text=18; fetched-readable-text-main=16; blocked-http-403=13; fetched-readable-text-article=7; fetched-readable-text-json-ld=4
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 100
- A: 14
- S: 11
- C: 61

## Evidence Object Type Distribution

- regulatory_or_procurement: 8
- event: 78
- changelog_or_release: 5
- case_or_customer: 24
- supporting_article: 11
- research_or_report: 1
- event_on_official_page: 4
- official_index_or_directory: 22
- community_feedback: 32
- search_result_or_tool_directory: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 21
- 开发者生态信号 (developer-ecosystem-signal): 55
- 技术迭代信号 (technical-iteration-signal): 54
- 资本市场信号 (capital-market-signal): 4
- 成熟信号 (mature-commercial-signal): 25
- 外围探索信号 (outside-core-exploration): 27

## Keyword Group Distribution

- early-direction-signal: 21
- developer-ecosystem-signal: 59
- technical-iteration-signal: 52
- capital-market-signal: 3
- mature-commercial-signal: 24
- outside-core-exploration: 27

## Keyword Search Path Distribution

- procurement_marketplace: 5
- developer_ecosystem: 6
- capital_startup: 2
- industry_landing: 2
- official_original: 2
- a_media_gdelt: 2

## Keyword Search Intent Distribution

- find_startups: 13
- find_customer_case: 1
- find_original_source: 3
- find_market_trend: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
