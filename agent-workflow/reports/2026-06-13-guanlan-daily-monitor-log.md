# 2026-06-13 Guanlan Daily Monitor Log

- generated_at: 2026-06-13T05:32:37.574Z
- raw_count: 188
- aihot_mode: daily+all
- aihot_since: 2026-06-12T05:25:11.874Z
- aihot_discovered_count: 327
- aihot_daily_discovered_count: 19
- aihot_all_discovered_count: 308
- aihot_daily_included_count: 19
- aihot_daily_pool_count: 19
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 67
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 2555
- historical_duplicates_removed_before_fetch: 192
- historical_duplicates_removed_after_fetch: 2
- raw_dedupe_buffer: 40
- aihot_count: 156
- keyword_search_count: 29
- keyword_search_non_community_count: 29
- keyword_search_path_distribution: procurement_marketplace=7; developer_ecosystem=6; a_media_gdelt=5; capital_startup=4; official_original=4; industry_landing=3
- keyword_search_intent_distribution: find_startups=14; find_customer_case=8; find_market_trend=5; find_original_source=2
- source_distribution: aihot=156; keyword-search=29; gdelt=3
- raw_count_by_channel: aihot=156; keyword-search=29; gdelt=3
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=72; technical-iteration-signal=66; mature-commercial-signal=18; early-direction-signal=15; outside-core-exploration=15; capital-market-signal=2
- theme_distribution: developer-ecosystem-signal=68; technical-iteration-signal=68; mature-commercial-signal=18; early-direction-signal=15; outside-core-exploration=15; capital-market-signal=4
- theme_concentration_warning: none
- source_level_distribution: B=83; C=77; S=18; A=10
- evidence_object_type_distribution: event=82; community_feedback=34; case_or_customer=32; official_index_or_directory=14; changelog_or_release=7; regulatory_or_procurement=7; ecosystem_package_or_model_index=3; event_on_official_page=3; pricing_change=2; research_or_report=2; repo_readme_or_index=1; supporting_article=1
- pool_route_distribution: core_pool=82; index_only=65; user_feedback_pool=50; emerging_pool=49; watchlist=18; discard=8
- pool_index_route_distribution: core_pool=40; emerging_pool=27; index_only=19; user_feedback_pool=19; watchlist=7
- pool_index_count: 79
- pool_target: 75
- routed_pool_count: 60
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 20
- index_only_pool_count: 19
- aihot_index_only_count: 19
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 79
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 11 result(s): missing_ai_anchor_in_result=10; noise_term:hiring=1; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.; RSS microsoft-ai-blog: HTTP 410; RSS import-ai-newsletter: HTTP 403
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: community=77; web=66; developer=11; official=11; domestic_vendor=5; media=5; news=5; product=3; industry=2; marketplace=2; funding=1
- front_signal_sab_source_count: S=4; A=2; B=10; total=16
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=89; fetched-readable-text-body-visible-text=33; fetched-readable-text-content-container=20; no-url-summary-only=19; fetched-readable-text-json-ld=13; blocked-http-403=6; summary-only-low-readable-body=6; fetched-readable-text-article=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 77
- A: 10
- S: 18
- B: 83

## Evidence Object Type Distribution

- community_feedback: 34
- event: 82
- regulatory_or_procurement: 7
- case_or_customer: 32
- changelog_or_release: 7
- research_or_report: 2
- ecosystem_package_or_model_index: 3
- pricing_change: 2
- event_on_official_page: 3
- repo_readme_or_index: 1
- official_index_or_directory: 14
- supporting_article: 1

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 15
- 开发者生态信号 (developer-ecosystem-signal): 68
- 成熟信号 (mature-commercial-signal): 18
- 技术迭代信号 (technical-iteration-signal): 68
- 早期信号 (early-direction-signal): 15
- 资本市场信号 (capital-market-signal): 4

## Keyword Group Distribution

- outside-core-exploration: 15
- developer-ecosystem-signal: 72
- mature-commercial-signal: 18
- technical-iteration-signal: 66
- early-direction-signal: 15
- capital-market-signal: 2

## Keyword Search Path Distribution

- official_original: 4
- industry_landing: 3
- capital_startup: 4
- a_media_gdelt: 5
- procurement_marketplace: 7
- developer_ecosystem: 6

## Keyword Search Intent Distribution

- find_startups: 14
- find_market_trend: 5
- find_customer_case: 8
- find_original_source: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
