# 2026-06-04 Guanlan Daily Monitor Log

- generated_at: 2026-06-04T00:38:28.120Z
- raw_count: 117
- aihot_mode: daily+all
- aihot_since: 2026-06-03T00:31:54.876Z
- aihot_discovered_count: 429
- aihot_daily_discovered_count: 32
- aihot_all_discovered_count: 397
- aihot_daily_included_count: 32
- aihot_daily_pool_count: 31
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 79
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 1106
- historical_duplicates_removed_before_fetch: 108
- historical_duplicates_removed_after_fetch: 3
- raw_dedupe_buffer: 40
- aihot_count: 63
- keyword_search_count: 29
- keyword_search_non_community_count: 29
- keyword_search_path_distribution: a_media_gdelt=7; capital_startup=5; industry_landing=5; procurement_marketplace=5; developer_ecosystem=4; official_original=3
- keyword_search_intent_distribution: find_original_source=12; find_startups=10; find_market_trend=7
- follow_builders_count: 7
- source_distribution: aihot=63; keyword-search=29; gdelt=18; follow-builders=7
- raw_count_by_channel: aihot=63; keyword-search=29; gdelt=18; follow-builders=7
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=35; mature-commercial-signal=32; developer-ecosystem-signal=21; early-direction-signal=21; outside-core-exploration=6; capital-market-signal=2
- theme_distribution: technical-iteration-signal=39; mature-commercial-signal=33; early-direction-signal=21; developer-ecosystem-signal=16; outside-core-exploration=6; capital-market-signal=2
- theme_concentration_warning: none
- source_level_distribution: B=57; A=25; C=23; S=12
- evidence_object_type_distribution: event=46; official_index_or_directory=24; case_or_customer=20; community_feedback=10; regulatory_or_procurement=5; changelog_or_release=4; supporting_article=4; event_on_official_page=3; search_result_or_tool_directory=1
- pool_route_distribution: core_pool=43; index_only=34; watchlist=22; discard=16; emerging_pool=14; user_feedback_pool=7
- pool_index_route_distribution: index_only=31; core_pool=15; emerging_pool=5
- pool_index_count: 46
- routed_pool_count: 15
- non_core_pool_count: 0
- index_only_pool_count: 31
- aihot_index_only_count: 31
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 46
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 3 result(s): job_or_salary_page=2; missing_ai_anchor_in_result=1; Historical Raw dedupe removed 24 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 6 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=50; community=16; news=13; media=12; official=9; builder=7; developer=5; domestic_vendor=2; product=2; marketplace=1
- front_signal_sab_source_count: S=4; A=4; B=5; total=13
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: no-url-summary-only=31; fetched-readable-text-content-container=21; summary-only-low-readable-body=17; blocked-http-403=12; fetched-readable-text-main=12; fetched-readable-text-body-visible-text=6; blocked-http-401=4; http-429-fallback-text=4; fetched-readable-text-article=3; fetched-readable-text-json-ld=3; fetched-readable-text-meta-description=2; http-404-fallback-text=1; http-999-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 57
- A: 25
- S: 12
- C: 23

## Evidence Object Type Distribution

- regulatory_or_procurement: 5
- event: 46
- changelog_or_release: 4
- supporting_article: 4
- case_or_customer: 20
- event_on_official_page: 3
- community_feedback: 10
- official_index_or_directory: 24
- search_result_or_tool_directory: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 21
- 外围探索信号 (outside-core-exploration): 6
- 技术迭代信号 (technical-iteration-signal): 39
- 开发者生态信号 (developer-ecosystem-signal): 16
- 成熟信号 (mature-commercial-signal): 33
- ?????? (capital-market-signal): 2

## Keyword Group Distribution

- early-direction-signal: 21
- outside-core-exploration: 6
- developer-ecosystem-signal: 21
- technical-iteration-signal: 35
- mature-commercial-signal: 32
- capital-market-signal: 2

## Keyword Search Path Distribution

- a_media_gdelt: 7
- procurement_marketplace: 5
- capital_startup: 5
- industry_landing: 5
- official_original: 3
- developer_ecosystem: 4

## Keyword Search Intent Distribution

- find_market_trend: 7
- find_original_source: 12
- find_startups: 10

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; follow-builders is fully scanned and fully written into the frontier-opinion library; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
