# 2026-06-25 Guanlan Daily Monitor Log

- generated_at: 2026-06-25T05:10:40.524Z
- raw_count: 187
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 20
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 4851
- historical_duplicates_removed_before_fetch: 258
- historical_duplicates_removed_after_fetch: 3
- raw_dedupe_buffer: 40
- aihot_count: 158
- keyword_search_count: 24
- keyword_search_non_community_count: 24
- keyword_search_path_distribution: official_original=7; procurement_marketplace=5; developer_ecosystem=4; a_media_gdelt=3; capital_startup=3; fde_implementation=1; industry_landing=1
- keyword_search_intent_distribution: find_startups=10; find_original_source=9; find_market_trend=3; find_customer_case=2
- source_distribution: aihot=158; keyword-search=24; gdelt=5
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 29
- enterprise_ai_transformation_stage_distribution: platform_enablement=12; pilot=5; production_rollout=5; ai_transformation=3; org_build=2; procurement=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=158; keyword-search=24; gdelt=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=77; developer-ecosystem-signal=52; mature-commercial-signal=21; outside-core-exploration=17; early-direction-signal=14; capital-market-signal=5; enterprise-ai-implementation-signal=1
- theme_distribution: technical-iteration-signal=77; developer-ecosystem-signal=50; mature-commercial-signal=22; outside-core-exploration=17; early-direction-signal=15; capital-market-signal=5; enterprise-ai-implementation-signal=1
- theme_concentration_warning: warning: 技术迭代信号 concentration 41.2% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- source_level_distribution: B=90; C=66; S=16; A=15
- evidence_object_type_distribution: event=88; case_or_customer=35; community_feedback=20; official_index_or_directory=17; supporting_article=7; regulatory_or_procurement=6; research_or_report=6; event_on_official_page=3; pricing_change=2; changelog_or_release=1; repo_readme_or_index=1; search_result_or_tool_directory=1
- pool_route_distribution: discard=97; core_pool=34; index_only=30; watchlist=25; emerging_pool=12; user_feedback_pool=7
- pool_index_route_distribution: core_pool=34; watchlist=25; index_only=24; emerging_pool=12; discard=11; user_feedback_pool=7
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 60
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 26
- index_only_pool_count: 24
- aihot_index_only_count: 20
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 10 result(s): noise_term:career=5; missing_ai_anchor_in_result=4; job_or_salary_page=1
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=77; community=66; official=10; media=9; domestic_vendor=7; news=6; developer=5; product=5; marketplace=1; research=1
- front_signal_sab_source_count: S=2; A=9; B=10; total=21
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=94; fetched-readable-text-content-container=25; no-url-summary-only=20; fetched-readable-text-main=14; fetched-readable-text-body-visible-text=12; summary-only-low-readable-body=7; blocked-http-403=4; fetched-readable-text-json-ld=4; fetched-readable-text-article=3; http-451-fallback-text=3; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 15
- B: 90
- S: 16
- C: 66

## Evidence Object Type Distribution

- research_or_report: 6
- event: 88
- case_or_customer: 35
- regulatory_or_procurement: 6
- pricing_change: 2
- official_index_or_directory: 17
- supporting_article: 7
- changelog_or_release: 1
- event_on_official_page: 3
- repo_readme_or_index: 1
- community_feedback: 20
- search_result_or_tool_directory: 1

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 22
- 早期信号 (early-direction-signal): 15
- 外围探索信号 (outside-core-exploration): 17
- 技术迭代信号 (technical-iteration-signal): 77
- 开发者生态信号 (developer-ecosystem-signal): 50
- 资本市场信号 (capital-market-signal): 5
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 1

## Keyword Group Distribution

- mature-commercial-signal: 21
- early-direction-signal: 14
- outside-core-exploration: 17
- technical-iteration-signal: 77
- developer-ecosystem-signal: 52
- capital-market-signal: 5
- enterprise-ai-implementation-signal: 1

## Keyword Search Path Distribution

- official_original: 7
- procurement_marketplace: 5
- developer_ecosystem: 4
- capital_startup: 3
- a_media_gdelt: 3
- industry_landing: 1
- fde_implementation: 1

## Keyword Search Intent Distribution

- find_startups: 10
- find_original_source: 9
- find_market_trend: 3
- find_customer_case: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
