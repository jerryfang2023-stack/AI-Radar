# 2026-06-06 Guanlan Daily Monitor Log

- generated_at: 2026-06-07T04:07:13.705Z
- raw_count: 190
- aihot_mode: daily+all
- aihot_since: 2026-06-06T03:57:16.393Z
- aihot_discovered_count: 212
- aihot_daily_discovered_count: 30
- aihot_all_discovered_count: 182
- aihot_daily_included_count: 30
- aihot_daily_pool_count: 29
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 43
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 1334
- historical_duplicates_removed_before_fetch: 126
- historical_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 40
- aihot_count: 81
- keyword_search_count: 94
- keyword_search_non_community_count: 91
- keyword_search_path_distribution: developer_ecosystem=22; a_media_gdelt=20; industry_landing=16; capital_startup=15; official_original=11; procurement_marketplace=7; community_feedback=3
- keyword_search_intent_distribution: find_startups=44; find_market_trend=20; find_customer_case=15; find_original_source=9; find_user_feedback=3; find_workflow_change=3
- source_distribution: keyword-search=94; aihot=81; gdelt=15
- raw_count_by_channel: keyword-search=94; aihot=81; gdelt=15
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=54; mature-commercial-signal=46; technical-iteration-signal=42; early-direction-signal=23; capital-market-signal=18; outside-core-exploration=7
- theme_distribution: mature-commercial-signal=47; technical-iteration-signal=45; developer-ecosystem-signal=43; capital-market-signal=24; early-direction-signal=24; outside-core-exploration=7
- theme_concentration_warning: none
- source_level_distribution: B=123; C=35; A=21; S=11
- evidence_object_type_distribution: event=82; case_or_customer=33; official_index_or_directory=28; community_feedback=19; regulatory_or_procurement=12; repo_readme_or_index=5; supporting_article=4; changelog_or_release=2; pricing_change=2; event_on_official_page=1; research_or_report=1; search_result_or_tool_directory=1
- pool_route_distribution: discard=82; index_only=38; core_pool=35; watchlist=35; emerging_pool=25; user_feedback_pool=1
- pool_index_route_distribution: core_pool=35; index_only=29; watchlist=25; emerging_pool=23; user_feedback_pool=1
- pool_index_count: 89
- pool_target: 75
- routed_pool_count: 60
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 25
- index_only_pool_count: 29
- aihot_index_only_count: 29
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 89
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 17 result(s): missing_ai_anchor_in_result=11; job_or_salary_page=4; directory_or_search_page=2; Search cross-entry dedupe removed 1 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=95; community=35; developer=18; news=12; industry=9; media=9; official=5; domestic_vendor=2; funding=2; product=2; marketplace=1
- front_signal_sab_source_count: S=3; A=3; B=12; total=18
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=74; no-url-summary-only=29; fetched-readable-text-content-container=27; fetched-readable-text-main=20; http-451-fallback-text=11; blocked-http-403=9; fetched-readable-text-body-visible-text=8; fetched-readable-text-article=7; fetched-readable-text-json-ld=3; fetch-failed-fallback-visible-text=2
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 123
- A: 21
- S: 11
- C: 35

## Evidence Object Type Distribution

- event: 82
- regulatory_or_procurement: 12
- case_or_customer: 33
- community_feedback: 19
- pricing_change: 2
- changelog_or_release: 2
- research_or_report: 1
- event_on_official_page: 1
- supporting_article: 4
- search_result_or_tool_directory: 1
- official_index_or_directory: 28
- repo_readme_or_index: 5

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 43
- 技术迭代信号 (technical-iteration-signal): 45
- 资本市场信号 (capital-market-signal): 24
- 早期信号 (early-direction-signal): 24
- 成熟信号 (mature-commercial-signal): 47
- 外围探索信号 (outside-core-exploration): 7

## Keyword Group Distribution

- developer-ecosystem-signal: 54
- technical-iteration-signal: 42
- capital-market-signal: 18
- early-direction-signal: 23
- mature-commercial-signal: 46
- outside-core-exploration: 7

## Keyword Search Path Distribution

- procurement_marketplace: 7
- official_original: 11
- a_media_gdelt: 20
- capital_startup: 15
- industry_landing: 16
- developer_ecosystem: 22
- community_feedback: 3

## Keyword Search Intent Distribution

- find_startups: 44
- find_market_trend: 20
- find_workflow_change: 3
- find_customer_case: 15
- find_original_source: 9
- find_user_feedback: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
