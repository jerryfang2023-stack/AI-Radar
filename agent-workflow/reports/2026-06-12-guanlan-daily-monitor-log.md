# 2026-06-12 Guanlan Daily Monitor Log

- generated_at: 2026-06-12T03:53:39.502Z
- raw_count: 185
- aihot_mode: daily+all
- aihot_since: 2026-06-11T03:48:18.115Z
- aihot_discovered_count: 358
- aihot_daily_discovered_count: 27
- aihot_all_discovered_count: 331
- aihot_daily_included_count: 27
- aihot_daily_pool_count: 26
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 77
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 2370
- historical_duplicates_removed_before_fetch: 197
- historical_duplicates_removed_after_fetch: 5
- raw_dedupe_buffer: 40
- aihot_count: 159
- keyword_search_count: 19
- keyword_search_non_community_count: 19
- keyword_search_path_distribution: industry_landing=5; procurement_marketplace=5; capital_startup=3; official_original=3; developer_ecosystem=2; a_media_gdelt=1
- keyword_search_intent_distribution: find_startups=11; find_customer_case=4; find_original_source=3; find_market_trend=1
- source_distribution: aihot=159; keyword-search=19; gdelt=7
- raw_count_by_channel: aihot=159; keyword-search=19; gdelt=7
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=60; developer-ecosystem-signal=47; mature-commercial-signal=31; outside-core-exploration=26; early-direction-signal=18; capital-market-signal=3
- theme_distribution: technical-iteration-signal=63; developer-ecosystem-signal=44; mature-commercial-signal=31; outside-core-exploration=26; early-direction-signal=18; capital-market-signal=3
- theme_concentration_warning: none
- source_level_distribution: B=81; C=72; S=21; A=11
- evidence_object_type_distribution: event=90; case_or_customer=33; official_index_or_directory=22; community_feedback=19; regulatory_or_procurement=7; changelog_or_release=4; pricing_change=4; supporting_article=3; event_on_official_page=2; search_result_or_tool_directory=1
- pool_route_distribution: core_pool=80; user_feedback_pool=61; index_only=54; emerging_pool=34; watchlist=25; discard=6
- pool_index_route_distribution: core_pool=33; index_only=26; user_feedback_pool=23; emerging_pool=16; watchlist=12
- pool_index_count: 86
- pool_target: 75
- routed_pool_count: 60
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 27
- index_only_pool_count: 26
- aihot_index_only_count: 26
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 86
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 12 result(s): missing_ai_anchor_in_result=9; job_or_salary_page=2; noise_term:hiring=1; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.; RSS microsoft-ai-blog: HTTP 410; RSS import-ai-newsletter: HTTP 403
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=73; community=72; official=12; developer=6; media=6; domestic_vendor=5; news=5; builder=2; product=2; industry=1; marketplace=1
- front_signal_sab_source_count: S=4; A=5; B=12; total=21
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=76; fetched-readable-text-body-visible-text=38; no-url-summary-only=26; fetched-readable-text-content-container=20; fetched-readable-text-json-ld=8; summary-only-low-readable-body=7; fetched-readable-text-article=5; blocked-http-403=2; blocked-http-401=1; fetch-failed-fallback-visible-text=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 11
- C: 72
- S: 21
- B: 81

## Evidence Object Type Distribution

- event: 90
- case_or_customer: 33
- pricing_change: 4
- community_feedback: 19
- regulatory_or_procurement: 7
- event_on_official_page: 2
- search_result_or_tool_directory: 1
- changelog_or_release: 4
- supporting_article: 3
- official_index_or_directory: 22

## Theme Distribution

- 早期信号 (early-direction-signal): 18
- 技术迭代信号 (technical-iteration-signal): 63
- 外围探索信号 (outside-core-exploration): 26
- 成熟信号 (mature-commercial-signal): 31
- 开发者生态信号 (developer-ecosystem-signal): 44
- 资本市场信号 (capital-market-signal): 3

## Keyword Group Distribution

- early-direction-signal: 18
- technical-iteration-signal: 60
- outside-core-exploration: 26
- mature-commercial-signal: 31
- developer-ecosystem-signal: 47
- capital-market-signal: 3

## Keyword Search Path Distribution

- official_original: 3
- procurement_marketplace: 5
- industry_landing: 5
- capital_startup: 3
- developer_ecosystem: 2
- a_media_gdelt: 1

## Keyword Search Intent Distribution

- find_startups: 11
- find_customer_case: 4
- find_original_source: 3
- find_market_trend: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
