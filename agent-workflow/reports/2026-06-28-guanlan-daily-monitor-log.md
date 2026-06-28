# 2026-06-28 Guanlan Daily Monitor Log

- generated_at: 2026-06-28T04:05:28.413Z
- raw_count: 126
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 10
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 5646
- historical_duplicates_removed_before_fetch: 369
- historical_duplicates_removed_after_fetch: 64
- raw_dedupe_buffer: 40
- aihot_count: 10
- keyword_search_count: 42
- keyword_search_non_community_count: 41
- keyword_search_path_distribution: developer_ecosystem=12; official_original=9; procurement_marketplace=6; a_media_gdelt=4; capital_startup=4; fde_implementation=4; industry_landing=2; community_feedback=1
- keyword_search_intent_distribution: find_customer_case=24; find_startups=8; find_market_trend=4; find_original_source=3; find_workflow_change=2; find_user_feedback=1
- source_distribution: rss-feed=59; keyword-search=42; gdelt=15; aihot=10
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 70
- enterprise_ai_transformation_stage_distribution: platform_enablement=32; production_rollout=14; ai_transformation=11; pilot=9; org_build=2; procurement=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: rss-feed=59; keyword-search=42; gdelt=15; aihot=10
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=26; early-direction-signal=23; uncategorized=21; enterprise-ai-implementation-signal=15; outside-core-exploration=13; developer-ecosystem-signal=12; mature-commercial-signal=12; capital-market-signal=4
- theme_distribution: technical-iteration-signal=26; early-direction-signal=23; uncategorized=21; enterprise-ai-implementation-signal=17; outside-core-exploration=14; mature-commercial-signal=12; developer-ecosystem-signal=9; capital-market-signal=4
- theme_concentration_warning: none
- source_level_distribution: B=91; A=19; S=16
- evidence_object_type_distribution: case_or_customer=54; event=39; official_index_or_directory=15; supporting_article=5; research_or_report=4; regulatory_or_procurement=3; changelog_or_release=2; community_feedback=1; event_on_official_page=1; pricing_change=1; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=47; core_pool=38; emerging_pool=24; discard=22; index_only=17; user_feedback_pool=12
- pool_index_route_distribution: watchlist=41; core_pool=32; emerging_pool=22; index_only=15; user_feedback_pool=11; discard=5
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 75
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 43
- index_only_pool_count: 15
- aihot_index_only_count: 10
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 17 result(s): missing_ai_anchor_in_result=8; noise_term:career=4; job_or_salary_page=2; noise_term:hiring=2; noise_term:jobs at=1
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=62; builder=14; developer=10; news=10; media=9; analysis=7; industry=3; marketplace=3; product=3; funding=2; newsletter=2; official=1
- front_signal_sab_source_count: S=4; A=3; B=14; total=21
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=30; fetched-readable-text-main=29; no-url-summary-only=20; fetched-readable-text-json-ld=13; fetched-readable-text-body-visible-text=9; blocked-http-403=7; summary-only-low-readable-body=6; fetched-readable-text-meta-description=4; blocked-http-401=3; fetched-readable-text-article=3; fetched-readable-text-plain-text=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 91
- A: 19
- S: 16

## Evidence Object Type Distribution

- event: 39
- case_or_customer: 54
- research_or_report: 4
- regulatory_or_procurement: 3
- changelog_or_release: 2
- supporting_article: 5
- community_feedback: 1
- pricing_change: 1
- official_index_or_directory: 15
- event_on_official_page: 1
- search_result_or_tool_directory: 1

## Theme Distribution

- 资本市场信号 (capital-market-signal): 4
- 外围探索信号 (outside-core-exploration): 14
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 17
- 成熟信号 (mature-commercial-signal): 12
- 技术迭代信号 (technical-iteration-signal): 26
- 早期信号 (early-direction-signal): 23
- uncategorized (uncategorized): 21
- 开发者生态信号 (developer-ecosystem-signal): 9

## Keyword Group Distribution

- capital-market-signal: 4
- outside-core-exploration: 13
- enterprise-ai-implementation-signal: 15
- mature-commercial-signal: 12
- technical-iteration-signal: 26
- developer-ecosystem-signal: 12
- early-direction-signal: 23
- uncategorized: 21

## Keyword Search Path Distribution

- official_original: 9
- procurement_marketplace: 6
- fde_implementation: 4
- capital_startup: 4
- developer_ecosystem: 12
- industry_landing: 2
- a_media_gdelt: 4
- community_feedback: 1

## Keyword Search Intent Distribution

- find_startups: 8
- find_customer_case: 24
- find_original_source: 3
- find_market_trend: 4
- find_user_feedback: 1
- find_workflow_change: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
