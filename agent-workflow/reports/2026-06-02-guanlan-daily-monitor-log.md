# 2026-06-02 Guanlan Daily Monitor Log

- generated_at: 2026-06-02T03:48:57.216Z
- raw_count: 120
- aihot_mode: daily+all
- aihot_since: 2026-06-01T03:42:49.712Z
- aihot_discovered_count: 426
- aihot_daily_discovered_count: 31
- aihot_all_discovered_count: 395
- aihot_daily_included_count: 31
- aihot_daily_pool_count: 31
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 63
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 866
- historical_duplicates_removed_before_fetch: 77
- historical_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 40
- aihot_count: 53
- keyword_search_count: 21
- keyword_search_non_community_count: 21
- keyword_search_path_distribution: a_media_gdelt=9; developer_ecosystem=3; official_original=3; procurement_marketplace=3; industry_landing=2; capital_startup=1
- keyword_search_intent_distribution: find_startups=11; find_market_trend=9; find_customer_case=1
- follow_builders_count: 20
- source_distribution: aihot=53; gdelt=26; keyword-search=21; follow-builders=20
- raw_count_by_channel: aihot=53; gdelt=26; keyword-search=21; follow-builders=20
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: mature-commercial-signal=34; developer-ecosystem-signal=24; technical-iteration-signal=23; early-direction-signal=22; outside-core-exploration=9; capital-market-signal=8
- theme_distribution: mature-commercial-signal=36; early-direction-signal=23; technical-iteration-signal=23; developer-ecosystem-signal=21; outside-core-exploration=9; capital-market-signal=8
- theme_concentration_warning: none
- source_level_distribution: B=43; A=32; C=27; S=18
- evidence_object_type_distribution: event=37; case_or_customer=32; official_index_or_directory=27; supporting_article=8; community_feedback=6; regulatory_or_procurement=5; event_on_official_page=3; changelog_or_release=1; repo_readme_or_index=1
- pool_route_distribution: core_pool=49; index_only=40; emerging_pool=30; watchlist=15; discard=14; user_feedback_pool=13
- pool_index_route_distribution: index_only=31; core_pool=15; emerging_pool=11; user_feedback_pool=4
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
- failed_sources: keyword-search pre-gate filtered 10 result(s): job_or_salary_page=8; noise_term:definition=1; noise_term:translation=1; Historical Raw dedupe removed 39 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 5 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=39; builder=20; news=20; official=17; media=12; community=7; developer=4; domestic_vendor=1
- front_signal_sab_source_count: S=3; A=5; B=3; total=11
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: no-url-summary-only=31; fetched-readable-text-content-container=26; fetched-readable-text-main=15; blocked-http-403=13; summary-only-low-readable-body=12; fetched-readable-text-body-visible-text=10; http-429-fallback-text=4; fetched-readable-text-article=3; fetched-readable-text-json-ld=3; http-999-fallback-text=2; blocked-http-401=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 27
- S: 18
- B: 43
- A: 32

## Evidence Object Type Distribution

- event: 37
- regulatory_or_procurement: 5
- changelog_or_release: 1
- case_or_customer: 32
- repo_readme_or_index: 1
- event_on_official_page: 3
- community_feedback: 6
- official_index_or_directory: 27
- supporting_article: 8

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 9
- 技术迭代信号 (technical-iteration-signal): 23
- 开发者生态信号 (developer-ecosystem-signal): 21
- 成熟信号 (mature-commercial-signal): 36
- 早期信号 (early-direction-signal): 23
- ?????? (capital-market-signal): 8

## Keyword Group Distribution

- outside-core-exploration: 9
- technical-iteration-signal: 23
- developer-ecosystem-signal: 24
- mature-commercial-signal: 34
- early-direction-signal: 22
- capital-market-signal: 8

## Keyword Search Path Distribution

- developer_ecosystem: 3
- a_media_gdelt: 9
- procurement_marketplace: 3
- official_original: 3
- capital_startup: 1
- industry_landing: 2

## Keyword Search Intent Distribution

- find_startups: 11
- find_market_trend: 9
- find_customer_case: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; follow-builders is fully scanned and fully written into the frontier-opinion library; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
