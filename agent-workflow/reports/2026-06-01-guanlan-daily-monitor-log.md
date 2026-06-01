# 2026-06-01 Guanlan Daily Monitor Log

- generated_at: 2026-06-01T07:37:54.783Z
- raw_count: 120
- aihot_mode: daily+all
- aihot_since: 2026-05-31T07:31:31.168Z
- aihot_discovered_count: 237
- aihot_daily_discovered_count: 8
- aihot_all_discovered_count: 229
- aihot_daily_included_count: 8
- aihot_daily_pool_count: 8
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 56
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 668
- historical_duplicates_removed_before_fetch: 36
- historical_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 40
- aihot_count: 55
- keyword_search_count: 22
- keyword_search_non_community_count: 21
- keyword_search_path_distribution: a_media_gdelt=7; procurement_marketplace=5; developer_ecosystem=3; industry_landing=3; official_original=2; capital_startup=1; community_feedback=1
- keyword_search_intent_distribution: find_startups=12; find_market_trend=7; find_customer_case=2; find_user_feedback=1
- follow_builders_count: 20
- source_distribution: aihot=55; gdelt=23; keyword-search=22; follow-builders=20
- raw_count_by_channel: aihot=55; gdelt=23; keyword-search=22; follow-builders=20
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: mature-commercial-signal=31; developer-ecosystem-signal=25; outside-core-exploration=20; technical-iteration-signal=20; early-direction-signal=18; capital-market-signal=6
- theme_distribution: mature-commercial-signal=33; technical-iteration-signal=21; developer-ecosystem-signal=20; early-direction-signal=20; outside-core-exploration=20; capital-market-signal=6
- theme_concentration_warning: none
- source_level_distribution: B=38; C=38; A=28; S=16
- evidence_object_type_distribution: event=48; case_or_customer=32; community_feedback=16; official_index_or_directory=10; supporting_article=6; changelog_or_release=5; event_on_official_page=2; regulatory_or_procurement=1
- pool_route_distribution: core_pool=65; emerging_pool=34; watchlist=30; index_only=14; user_feedback_pool=14; discard=8
- pool_index_route_distribution: core_pool=32; emerging_pool=19; index_only=8; user_feedback_pool=7
- pool_index_count: 40
- routed_pool_count: 32
- non_core_pool_count: 0
- index_only_pool_count: 8
- aihot_index_only_count: 8
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 40
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 12 result(s): job_or_salary_page=9; noise_term:definition=2; noise_term:translation=1; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=30; news=22; builder=20; community=18; official=9; media=6; product=6; developer=5; industry=2; funding=1; marketplace=1
- front_signal_sab_source_count: S=10; A=8; B=7; total=25
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=33; fetched-readable-text-main=25; summary-only-low-readable-body=24; fetched-readable-text-body-visible-text=11; no-url-summary-only=8; blocked-http-403=6; fetched-readable-text-json-ld=5; http-429-fallback-text=3; fetched-readable-text-article=2; blocked-http-401=1; fetch-failed-fallback-visible-text=1; http-999-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 16
- C: 38
- B: 38
- A: 28

## Evidence Object Type Distribution

- event: 48
- case_or_customer: 32
- supporting_article: 6
- event_on_official_page: 2
- official_index_or_directory: 10
- changelog_or_release: 5
- community_feedback: 16
- regulatory_or_procurement: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 20
- 外围探索信号 (outside-core-exploration): 20
- 成熟信号 (mature-commercial-signal): 33
- 技术迭代信号 (technical-iteration-signal): 21
- 开发者生态信号 (developer-ecosystem-signal): 20
- ?????? (capital-market-signal): 6

## Keyword Group Distribution

- early-direction-signal: 18
- outside-core-exploration: 20
- mature-commercial-signal: 31
- developer-ecosystem-signal: 25
- technical-iteration-signal: 20
- capital-market-signal: 6

## Keyword Search Path Distribution

- a_media_gdelt: 7
- procurement_marketplace: 5
- official_original: 2
- developer_ecosystem: 3
- industry_landing: 3
- community_feedback: 1
- capital_startup: 1

## Keyword Search Intent Distribution

- find_market_trend: 7
- find_startups: 12
- find_customer_case: 2
- find_user_feedback: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; follow-builders is fully scanned and fully written into the frontier-opinion library; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
