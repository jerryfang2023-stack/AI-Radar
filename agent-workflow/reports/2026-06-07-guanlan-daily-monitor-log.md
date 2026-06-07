# 2026-06-07 Guanlan Daily Monitor Log

- generated_at: 2026-06-07T02:44:54.960Z
- raw_count: 117
- aihot_mode: daily+all
- aihot_since: 2026-06-06T02:41:29.381Z
- aihot_discovered_count: 198
- aihot_daily_discovered_count: 13
- aihot_all_discovered_count: 185
- aihot_daily_included_count: 13
- aihot_daily_pool_count: 12
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 44
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 1449
- historical_duplicates_removed_before_fetch: 106
- historical_duplicates_removed_after_fetch: 3
- raw_dedupe_buffer: 40
- aihot_count: 101
- keyword_search_count: 13
- keyword_search_non_community_count: 13
- keyword_search_path_distribution: procurement_marketplace=4; developer_ecosystem=3; capital_startup=2; industry_landing=2; a_media_gdelt=1; official_original=1
- keyword_search_intent_distribution: find_startups=6; find_original_source=5; find_customer_case=1; find_market_trend=1
- source_distribution: aihot=101; keyword-search=13; gdelt=3
- raw_count_by_channel: aihot=101; keyword-search=13; gdelt=3
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=39; developer-ecosystem-signal=26; outside-core-exploration=24; mature-commercial-signal=16; early-direction-signal=12
- theme_distribution: technical-iteration-signal=40; outside-core-exploration=24; developer-ecosystem-signal=23; mature-commercial-signal=17; early-direction-signal=13
- theme_concentration_warning: none
- source_level_distribution: B=53; C=53; A=10; S=1
- evidence_object_type_distribution: community_feedback=41; event=39; case_or_customer=15; official_index_or_directory=8; regulatory_or_procurement=6; changelog_or_release=2; pricing_change=2; research_or_report=2; event_on_official_page=1; supporting_article=1
- pool_route_distribution: watchlist=59; core_pool=33; index_only=18; discard=7; emerging_pool=6; user_feedback_pool=3
- pool_index_route_distribution: core_pool=28; index_only=12; emerging_pool=6; user_feedback_pool=2
- pool_index_count: 40
- routed_pool_count: 28
- non_core_pool_count: 0
- index_only_pool_count: 12
- aihot_index_only_count: 12
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 40
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 6 result(s): missing_ai_anchor_in_result=5; job_or_salary_page=1; Historical Raw dedupe removed 3 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: community=53; web=46; developer=5; media=5; news=5; industry=2; marketplace=1
- front_signal_sab_source_count: S=0; A=3; B=7; total=10
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: summary-only-low-readable-body=54; fetched-readable-text-content-container=18; fetched-readable-text-body-visible-text=13; no-url-summary-only=12; blocked-http-403=5; fetched-readable-text-json-ld=5; fetched-readable-text-main=5; fetched-readable-text-article=3; blocked-http-401=2
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 53
- A: 10
- S: 1
- C: 53

## Evidence Object Type Distribution

- event: 39
- changelog_or_release: 2
- case_or_customer: 15
- regulatory_or_procurement: 6
- community_feedback: 41
- pricing_change: 2
- research_or_report: 2
- supporting_article: 1
- official_index_or_directory: 8
- event_on_official_page: 1

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 23
- 早期信号 (early-direction-signal): 13
- 技术迭代信号 (technical-iteration-signal): 40
- 成熟信号 (mature-commercial-signal): 17
- 外围探索信号 (outside-core-exploration): 24

## Keyword Group Distribution

- developer-ecosystem-signal: 26
- early-direction-signal: 12
- technical-iteration-signal: 39
- outside-core-exploration: 24
- mature-commercial-signal: 16

## Keyword Search Path Distribution

- developer_ecosystem: 3
- procurement_marketplace: 4
- capital_startup: 2
- official_original: 1
- industry_landing: 2
- a_media_gdelt: 1

## Keyword Search Intent Distribution

- find_startups: 6
- find_original_source: 5
- find_customer_case: 1
- find_market_trend: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
