# 2026-06-21 Guanlan Daily Monitor Log

- generated_at: 2026-06-21T03:09:49.661Z
- raw_count: 183
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 2
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 4061
- historical_duplicates_removed_before_fetch: 202
- historical_duplicates_removed_after_fetch: 7
- raw_dedupe_buffer: 40
- aihot_count: 96
- keyword_search_count: 27
- keyword_search_non_community_count: 27
- keyword_search_path_distribution: a_media_gdelt=5; industry_landing=5; capital_startup=4; developer_ecosystem=4; fde_implementation=3; official_original=3; procurement_marketplace=3
- keyword_search_intent_distribution: find_original_source=8; find_startups=8; find_customer_case=6; find_market_trend=5
- source_distribution: aihot=96; rss-feed=53; keyword-search=27; gdelt=7
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 59
- enterprise_ai_transformation_stage_distribution: platform_enablement=40; pilot=8; production_rollout=5; ai_transformation=3; org_build=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=96; rss-feed=53; keyword-search=27; gdelt=7
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=46; early-direction-signal=37; mature-commercial-signal=26; uncategorized=25; developer-ecosystem-signal=23; outside-core-exploration=19; enterprise-ai-implementation-signal=4; capital-market-signal=3
- theme_distribution: technical-iteration-signal=46; early-direction-signal=37; mature-commercial-signal=26; uncategorized=25; developer-ecosystem-signal=23; outside-core-exploration=19; enterprise-ai-implementation-signal=4; capital-market-signal=3
- theme_concentration_warning: none
- source_level_distribution: B=86; C=59; A=21; S=17
- evidence_object_type_distribution: event=71; case_or_customer=40; community_feedback=31; official_index_or_directory=9; research_or_report=9; supporting_article=9; pricing_change=4; regulatory_or_procurement=4; changelog_or_release=3; event_on_official_page=2; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=71; index_only=49; core_pool=39; user_feedback_pool=36; emerging_pool=32; discard=19
- pool_index_route_distribution: watchlist=41; core_pool=33; emerging_pool=24; index_only=16; user_feedback_pool=15; discard=1
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 78
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 45
- index_only_pool_count: 16
- aihot_index_only_count: 2
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 16 result(s): missing_ai_anchor_in_result=6; noise_term:career=5; job_or_salary_page=3; directory_or_search_page=1; noise_term:hiring=1
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=73; community=59; product=15; news=13; builder=9; media=8; analysis=3; industry=1; marketplace=1; official=1
- front_signal_sab_source_count: S=1; A=2; B=20; total=23
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=75; fetched-readable-text-content-container=39; fetched-readable-text-json-ld=16; fetched-readable-text-body-visible-text=13; no-url-summary-only=11; summary-only-low-readable-body=10; fetched-readable-text-article=8; http-404-fallback-text=4; blocked-http-401=3; blocked-http-403=3; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 59
- B: 86
- S: 17
- A: 21

## Evidence Object Type Distribution

- event: 71
- community_feedback: 31
- case_or_customer: 40
- pricing_change: 4
- regulatory_or_procurement: 4
- research_or_report: 9
- changelog_or_release: 3
- supporting_article: 9
- search_result_or_tool_directory: 1
- event_on_official_page: 2
- official_index_or_directory: 9

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 46
- 开发者生态信号 (developer-ecosystem-signal): 23
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 4
- 成熟信号 (mature-commercial-signal): 26
- 早期信号 (early-direction-signal): 37
- 外围探索信号 (outside-core-exploration): 19
- uncategorized (uncategorized): 25
- 资本市场信号 (capital-market-signal): 3

## Keyword Group Distribution

- technical-iteration-signal: 46
- developer-ecosystem-signal: 23
- enterprise-ai-implementation-signal: 4
- mature-commercial-signal: 26
- early-direction-signal: 37
- outside-core-exploration: 19
- uncategorized: 25
- capital-market-signal: 3

## Keyword Search Path Distribution

- fde_implementation: 3
- procurement_marketplace: 3
- official_original: 3
- capital_startup: 4
- industry_landing: 5
- a_media_gdelt: 5
- developer_ecosystem: 4

## Keyword Search Intent Distribution

- find_customer_case: 6
- find_original_source: 8
- find_market_trend: 5
- find_startups: 8

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
