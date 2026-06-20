# 2026-06-20 Guanlan Daily Monitor Log

- generated_at: 2026-06-20T05:50:42.302Z
- raw_count: 185
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 15
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 3876
- historical_duplicates_removed_before_fetch: 165
- historical_duplicates_removed_after_fetch: 5
- raw_dedupe_buffer: 40
- aihot_count: 136
- keyword_search_count: 39
- keyword_search_non_community_count: 39
- keyword_search_path_distribution: a_media_gdelt=10; procurement_marketplace=7; developer_ecosystem=6; industry_landing=5; fde_implementation=4; official_original=4; capital_startup=3
- keyword_search_intent_distribution: find_market_trend=10; find_original_source=10; find_startups=10; find_customer_case=9
- source_distribution: aihot=136; keyword-search=39; gdelt=10
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 48
- enterprise_ai_transformation_stage_distribution: platform_enablement=18; pilot=10; production_rollout=8; ai_transformation=7; org_build=3; procurement=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=136; keyword-search=39; gdelt=10
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=46; mature-commercial-signal=42; developer-ecosystem-signal=35; outside-core-exploration=32; early-direction-signal=17; capital-market-signal=8; enterprise-ai-implementation-signal=5
- theme_distribution: technical-iteration-signal=46; mature-commercial-signal=42; developer-ecosystem-signal=33; outside-core-exploration=32; early-direction-signal=19; capital-market-signal=8; enterprise-ai-implementation-signal=5
- theme_concentration_warning: none
- source_level_distribution: C=84; B=65; A=28; S=8
- evidence_object_type_distribution: event=62; community_feedback=50; case_or_customer=42; official_index_or_directory=11; regulatory_or_procurement=8; supporting_article=4; research_or_report=3; search_result_or_tool_directory=2; changelog_or_release=1; event_on_official_page=1; pricing_change=1
- pool_route_distribution: index_only=70; watchlist=61; user_feedback_pool=40; core_pool=32; emerging_pool=29; discard=20
- pool_index_route_distribution: watchlist=35; core_pool=32; emerging_pool=24; index_only=23; user_feedback_pool=21; discard=4
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 68
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 36
- index_only_pool_count: 23
- aihot_index_only_count: 15
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 17 result(s): missing_ai_anchor_in_result=7; noise_term:career=4; job_or_salary_page=3; noise_term:hiring=3; source-artifact rss: RSS tigera-blog: HTTP 415
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: community=84; web=58; news=14; media=13; developer=4; product=4; marketplace=3; official=2; builder=1; funding=1; research=1
- front_signal_sab_source_count: S=2; A=5; B=10; total=17
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=77; fetched-readable-text-content-container=23; fetched-readable-text-json-ld=21; fetched-readable-text-body-visible-text=16; no-url-summary-only=15; blocked-http-401=9; summary-only-low-readable-body=8; blocked-http-403=6; fetched-readable-text-article=3; http-404-fallback-text=3; fetched-readable-text-meta-description=2; fetched-readable-text-json-text=1; fetched-readable-text-plain-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 84
- A: 28
- B: 65
- S: 8

## Evidence Object Type Distribution

- community_feedback: 50
- event: 62
- regulatory_or_procurement: 8
- pricing_change: 1
- case_or_customer: 42
- changelog_or_release: 1
- supporting_article: 4
- search_result_or_tool_directory: 2
- research_or_report: 3
- official_index_or_directory: 11
- event_on_official_page: 1

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 46
- 开发者生态信号 (developer-ecosystem-signal): 33
- 早期信号 (early-direction-signal): 19
- 资本市场信号 (capital-market-signal): 8
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 5
- 成熟信号 (mature-commercial-signal): 42
- 外围探索信号 (outside-core-exploration): 32

## Keyword Group Distribution

- technical-iteration-signal: 46
- developer-ecosystem-signal: 35
- early-direction-signal: 17
- capital-market-signal: 8
- enterprise-ai-implementation-signal: 5
- mature-commercial-signal: 42
- outside-core-exploration: 32

## Keyword Search Path Distribution

- capital_startup: 3
- fde_implementation: 4
- procurement_marketplace: 7
- a_media_gdelt: 10
- official_original: 4
- developer_ecosystem: 6
- industry_landing: 5

## Keyword Search Intent Distribution

- find_startups: 10
- find_original_source: 10
- find_market_trend: 10
- find_customer_case: 9

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
