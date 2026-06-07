# 2026-06-07 Guanlan Daily Monitor Log

- generated_at: 2026-06-07T05:57:13.194Z
- raw_count: 153
- aihot_mode: daily+all
- aihot_since: 2026-06-06T05:47:56.249Z
- aihot_discovered_count: 195
- aihot_daily_discovered_count: 13
- aihot_all_discovered_count: 182
- aihot_daily_included_count: 13
- aihot_daily_pool_count: 9
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 39
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 1524
- historical_duplicates_removed_before_fetch: 250
- historical_duplicates_removed_after_fetch: 3
- raw_dedupe_buffer: 40
- aihot_count: 100
- keyword_search_count: 44
- keyword_search_non_community_count: 44
- keyword_search_path_distribution: developer_ecosystem=12; a_media_gdelt=10; official_original=7; capital_startup=6; industry_landing=5; procurement_marketplace=4
- keyword_search_intent_distribution: find_startups=15; find_customer_case=11; find_market_trend=10; find_original_source=7; find_workflow_change=1
- source_distribution: aihot=100; keyword-search=44; gdelt=9
- raw_count_by_channel: aihot=100; keyword-search=44; gdelt=9
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: outside-core-exploration=38; technical-iteration-signal=36; developer-ecosystem-signal=32; mature-commercial-signal=30; early-direction-signal=9; capital-market-signal=8
- theme_distribution: outside-core-exploration=38; technical-iteration-signal=36; mature-commercial-signal=31; developer-ecosystem-signal=29; capital-market-signal=10; early-direction-signal=9
- theme_concentration_warning: none
- source_level_distribution: B=75; C=58; A=17; S=3
- evidence_object_type_distribution: community_feedback=49; event=48; case_or_customer=22; regulatory_or_procurement=9; official_index_or_directory=6; research_or_report=6; supporting_article=6; changelog_or_release=2; event_on_official_page=2; ecosystem_package_or_model_index=1; pricing_change=1; search_result_or_tool_directory=1
- pool_route_distribution: discard=80; index_only=26; core_pool=25; watchlist=22; emerging_pool=17; user_feedback_pool=4
- pool_index_route_distribution: core_pool=25; watchlist=22; emerging_pool=17; index_only=16; discard=12; user_feedback_pool=4
- pool_index_count: 75
- pool_target: 75
- routed_pool_count: 47
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 22
- index_only_pool_count: 16
- aihot_index_only_count: 9
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 75
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 13 result(s): missing_ai_anchor_in_result=10; job_or_salary_page=3; Historical Raw dedupe removed 51 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=66; community=58; news=9; media=8; developer=6; funding=3; industry=1; official=1; product=1
- front_signal_sab_source_count: S=1; A=3; B=9; total=13
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=75; fetched-readable-text-content-container=26; fetched-readable-text-body-visible-text=15; fetched-readable-text-main=13; no-url-summary-only=9; http-451-fallback-text=6; fetch-failed-fallback-visible-text=3; blocked-http-403=2; summary-only-low-readable-body=2; fetched-readable-text-article=1; fetched-readable-text-json-ld=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 75
- A: 17
- S: 3
- C: 58

## Evidence Object Type Distribution

- regulatory_or_procurement: 9
- case_or_customer: 22
- event: 48
- event_on_official_page: 2
- changelog_or_release: 2
- research_or_report: 6
- pricing_change: 1
- supporting_article: 6
- ecosystem_package_or_model_index: 1
- official_index_or_directory: 6
- community_feedback: 49
- search_result_or_tool_directory: 1

## Theme Distribution

- 资本市场信号 (capital-market-signal): 10
- 早期信号 (early-direction-signal): 9
- 技术迭代信号 (technical-iteration-signal): 36
- 开发者生态信号 (developer-ecosystem-signal): 29
- 成熟信号 (mature-commercial-signal): 31
- 外围探索信号 (outside-core-exploration): 38

## Keyword Group Distribution

- capital-market-signal: 8
- early-direction-signal: 9
- technical-iteration-signal: 36
- developer-ecosystem-signal: 32
- mature-commercial-signal: 30
- outside-core-exploration: 38

## Keyword Search Path Distribution

- procurement_marketplace: 4
- a_media_gdelt: 10
- industry_landing: 5
- capital_startup: 6
- official_original: 7
- developer_ecosystem: 12

## Keyword Search Intent Distribution

- find_startups: 15
- find_market_trend: 10
- find_original_source: 7
- find_workflow_change: 1
- find_customer_case: 11

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
