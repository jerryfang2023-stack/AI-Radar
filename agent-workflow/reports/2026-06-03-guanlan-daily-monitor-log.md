# 2026-06-03 Guanlan Daily Monitor Log

- generated_at: 2026-06-03T03:22:50.519Z
- raw_count: 120
- aihot_mode: daily+all
- aihot_since: 2026-06-02T03:17:03.321Z
- aihot_discovered_count: 469
- aihot_daily_discovered_count: 29
- aihot_all_discovered_count: 440
- aihot_daily_included_count: 29
- aihot_daily_pool_count: 29
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 80
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 986
- historical_duplicates_removed_before_fetch: 56
- historical_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 40
- aihot_count: 66
- keyword_search_count: 23
- keyword_search_non_community_count: 23
- keyword_search_path_distribution: industry_landing=6; developer_ecosystem=5; procurement_marketplace=5; a_media_gdelt=4; official_original=3
- keyword_search_intent_distribution: find_startups=16; find_market_trend=4; find_customer_case=3
- follow_builders_count: 16
- source_distribution: aihot=66; keyword-search=23; follow-builders=16; gdelt=15
- raw_count_by_channel: aihot=66; keyword-search=23; follow-builders=16; gdelt=15
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=39; mature-commercial-signal=36; technical-iteration-signal=28; early-direction-signal=12; outside-core-exploration=3; capital-market-signal=2
- theme_distribution: mature-commercial-signal=37; developer-ecosystem-signal=33; technical-iteration-signal=29; early-direction-signal=16; outside-core-exploration=3; capital-market-signal=2
- theme_concentration_warning: none
- source_level_distribution: B=59; C=30; S=20; A=11
- evidence_object_type_distribution: case_or_customer=47; event=31; official_index_or_directory=21; community_feedback=7; event_on_official_page=6; regulatory_or_procurement=3; supporting_article=3; changelog_or_release=2
- pool_route_distribution: core_pool=47; index_only=36; watchlist=26; emerging_pool=16; discard=11; user_feedback_pool=10
- pool_index_route_distribution: index_only=29; core_pool=15; user_feedback_pool=6; emerging_pool=5
- pool_index_count: 44
- routed_pool_count: 15
- non_core_pool_count: 0
- index_only_pool_count: 29
- aihot_index_only_count: 29
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 44
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 1 result(s): job_or_salary_page=1; Historical Raw dedupe removed 5 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 13 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=51; official=17; builder=16; community=14; developer=6; news=6; media=5; industry=2; product=2; marketplace=1
- front_signal_sab_source_count: S=4; A=0; B=5; total=9
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: no-url-summary-only=29; summary-only-low-readable-body=24; fetched-readable-text-content-container=21; fetched-readable-text-main=16; fetched-readable-text-body-visible-text=11; blocked-http-401=6; fetched-readable-text-article=6; blocked-http-403=5; fetched-readable-text-json-ld=2
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 30
- S: 20
- B: 59
- A: 11

## Evidence Object Type Distribution

- event_on_official_page: 6
- case_or_customer: 47
- event: 31
- changelog_or_release: 2
- official_index_or_directory: 21
- regulatory_or_procurement: 3
- community_feedback: 7
- supporting_article: 3

## Theme Distribution

- 早期信号 (early-direction-signal): 16
- 开发者生态信号 (developer-ecosystem-signal): 33
- 成熟信号 (mature-commercial-signal): 37
- 技术迭代信号 (technical-iteration-signal): 29
- ?????? (capital-market-signal): 2
- 外围探索信号 (outside-core-exploration): 3

## Keyword Group Distribution

- early-direction-signal: 12
- developer-ecosystem-signal: 39
- mature-commercial-signal: 36
- technical-iteration-signal: 28
- capital-market-signal: 2
- outside-core-exploration: 3

## Keyword Search Path Distribution

- procurement_marketplace: 5
- official_original: 3
- industry_landing: 6
- a_media_gdelt: 4
- developer_ecosystem: 5

## Keyword Search Intent Distribution

- find_startups: 16
- find_market_trend: 4
- find_customer_case: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; follow-builders is fully scanned and fully written into the frontier-opinion library; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
