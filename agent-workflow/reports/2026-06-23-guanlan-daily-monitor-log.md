# 2026-06-23 Guanlan Daily Monitor Log

- generated_at: 2026-06-23T02:03:46.885Z
- raw_count: 190
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 17
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 4471
- historical_duplicates_removed_before_fetch: 297
- historical_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 40
- aihot_count: 171
- keyword_search_count: 15
- keyword_search_non_community_count: 15
- keyword_search_path_distribution: capital_startup=4; developer_ecosystem=4; official_original=3; fde_implementation=2; a_media_gdelt=1; procurement_marketplace=1
- keyword_search_intent_distribution: find_startups=7; find_original_source=4; find_customer_case=3; find_market_trend=1
- source_distribution: aihot=171; keyword-search=15; gdelt=4
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 21
- enterprise_ai_transformation_stage_distribution: platform_enablement=12; pilot=5; production_rollout=2; ai_transformation=1; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=171; keyword-search=15; gdelt=4
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=67; technical-iteration-signal=49; outside-core-exploration=28; early-direction-signal=27; mature-commercial-signal=15; capital-market-signal=2; enterprise-ai-implementation-signal=2
- theme_distribution: developer-ecosystem-signal=65; technical-iteration-signal=51; outside-core-exploration=28; early-direction-signal=27; mature-commercial-signal=15; capital-market-signal=2; enterprise-ai-implementation-signal=2
- theme_concentration_warning: none
- source_level_distribution: C=86; B=68; A=21; S=15
- evidence_object_type_distribution: event=89; case_or_customer=35; community_feedback=32; official_index_or_directory=13; supporting_article=6; regulatory_or_procurement=5; pricing_change=3; changelog_or_release=2; event_on_official_page=2; research_or_report=2; search_result_or_tool_directory=1
- pool_route_distribution: core_pool=80; index_only=60; user_feedback_pool=60; emerging_pool=59; watchlist=27; discard=9
- pool_index_route_distribution: core_pool=45; emerging_pool=40; user_feedback_pool=33; index_only=23; watchlist=13
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 72
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 27
- index_only_pool_count: 23
- aihot_index_only_count: 17
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 12 result(s): missing_ai_anchor_in_result=4; noise_term:career=4; job_or_salary_page=2; noise_term:hiring=2
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: community=86; web=61; media=11; official=10; news=9; developer=4; domestic_vendor=3; product=3; builder=1; industry=1; research=1
- front_signal_sab_source_count: S=2; A=6; B=11; total=19
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=84; fetched-readable-text-content-container=33; fetched-readable-text-body-visible-text=26; no-url-summary-only=17; fetched-readable-text-json-ld=11; blocked-http-403=6; fetched-readable-text-article=4; http-404-fallback-text=4; summary-only-low-readable-body=4; blocked-http-401=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 68
- A: 21
- C: 86
- S: 15

## Evidence Object Type Distribution

- event: 89
- case_or_customer: 35
- changelog_or_release: 2
- community_feedback: 32
- regulatory_or_procurement: 5
- pricing_change: 3
- supporting_article: 6
- research_or_report: 2
- search_result_or_tool_directory: 1
- official_index_or_directory: 13
- event_on_official_page: 2

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 28
- 早期信号 (early-direction-signal): 27
- 技术迭代信号 (technical-iteration-signal): 51
- 开发者生态信号 (developer-ecosystem-signal): 65
- 资本市场信号 (capital-market-signal): 2
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 2
- 成熟信号 (mature-commercial-signal): 15

## Keyword Group Distribution

- outside-core-exploration: 28
- early-direction-signal: 27
- technical-iteration-signal: 49
- developer-ecosystem-signal: 67
- capital-market-signal: 2
- enterprise-ai-implementation-signal: 2
- mature-commercial-signal: 15

## Keyword Search Path Distribution

- procurement_marketplace: 1
- fde_implementation: 2
- developer_ecosystem: 4
- capital_startup: 4
- official_original: 3
- a_media_gdelt: 1

## Keyword Search Intent Distribution

- find_startups: 7
- find_original_source: 4
- find_customer_case: 3
- find_market_trend: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
