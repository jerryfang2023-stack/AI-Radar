# 2026-06-27 Guanlan Daily Monitor Log

- generated_at: 2026-06-27T03:15:06.497Z
- raw_count: 177
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 12
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 5469
- historical_duplicates_removed_before_fetch: 33
- historical_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 40
- aihot_count: 12
- keyword_search_count: 53
- keyword_search_non_community_count: 53
- keyword_search_path_distribution: capital_startup=13; developer_ecosystem=11; official_original=11; a_media_gdelt=6; fde_implementation=5; industry_landing=5; procurement_marketplace=2
- keyword_search_intent_distribution: find_original_source=18; find_startups=18; find_customer_case=13; find_market_trend=4
- source_distribution: rss-feed=108; keyword-search=53; aihot=12; gdelt=4
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 88
- enterprise_ai_transformation_stage_distribution: platform_enablement=57; pilot=10; production_rollout=10; ai_transformation=6; procurement=3; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: rss-feed=108; keyword-search=53; aihot=12; gdelt=4
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=106; developer-ecosystem-signal=13; mature-commercial-signal=13; targeted-pool-gap-refill=13; technical-iteration-signal=12; early-direction-signal=8; capital-market-signal=6; enterprise-ai-implementation-signal=5; outside-core-exploration=1
- theme_distribution: uncategorized=106; mature-commercial-signal=13; targeted-pool-gap-refill=13; technical-iteration-signal=13; developer-ecosystem-signal=10; early-direction-signal=10; capital-market-signal=6; enterprise-ai-implementation-signal=5; outside-core-exploration=1
- theme_concentration_warning: warning: uncategorized concentration 59.9% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- source_level_distribution: B=164; A=7; S=6
- evidence_object_type_distribution: event=61; case_or_customer=49; official_index_or_directory=39; research_or_report=12; event_on_official_page=4; regulatory_or_procurement=4; supporting_article=4; changelog_or_release=2; marketplace_listing=1; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=77; discard=50; core_pool=33; emerging_pool=28; index_only=17; user_feedback_pool=5
- pool_index_route_distribution: watchlist=49; core_pool=30; emerging_pool=24; index_only=15; user_feedback_pool=3; discard=1
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 79
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 49
- index_only_pool_count: 15
- aihot_index_only_count: 12
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 17 result(s): missing_ai_anchor_in_result=9; noise_term:career=5; job_or_salary_page=3; source-artifact keyword: Anysearch documented-payload retry for query "enterprise AI transformation production rollout customer deployment (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "agent governance evals production rollout enterprise AI (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.; targeted pool/core refill cycle 1 added 3 item(s) for important_funding=4/5; core_pool=26/30; core_non_large=16/20; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 2 added 10 item(s) for core_pool=28/30; core_non_large=18/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=151; developer=7; media=4; news=3; official=3; analysis=2; industry=2; product=2; builder=1; funding=1; marketplace=1
- front_signal_sab_source_count: S=0; A=3; B=16; total=19
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=46; no-url-summary-only=45; summary-only-low-readable-body=32; fetched-readable-text-article=17; fetched-readable-text-content-container=17; fetched-readable-text-body-visible-text=6; fetched-readable-text-json-ld=5; fetched-readable-text-meta-description=5; blocked-http-403=2; blocked-http-401=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 164
- S: 6
- A: 7

## Evidence Object Type Distribution

- case_or_customer: 49
- official_index_or_directory: 39
- event_on_official_page: 4
- search_result_or_tool_directory: 1
- event: 61
- changelog_or_release: 2
- regulatory_or_procurement: 4
- research_or_report: 12
- supporting_article: 4
- marketplace_listing: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 10
- 资本市场信号 (capital-market-signal): 6
- 成熟信号 (mature-commercial-signal): 13
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 5
- 开发者生态信号 (developer-ecosystem-signal): 10
- 技术迭代信号 (technical-iteration-signal): 13
- targeted-pool-gap-refill (targeted-pool-gap-refill): 13
- uncategorized (uncategorized): 106
- 外围探索信号 (outside-core-exploration): 1

## Keyword Group Distribution

- early-direction-signal: 8
- capital-market-signal: 6
- mature-commercial-signal: 13
- enterprise-ai-implementation-signal: 5
- developer-ecosystem-signal: 13
- technical-iteration-signal: 12
- targeted-pool-gap-refill: 13
- uncategorized: 106
- outside-core-exploration: 1

## Keyword Search Path Distribution

- official_original: 11
- procurement_marketplace: 2
- capital_startup: 13
- fde_implementation: 5
- developer_ecosystem: 11
- industry_landing: 5
- a_media_gdelt: 6

## Keyword Search Intent Distribution

- find_startups: 18
- find_original_source: 18
- find_customer_case: 13
- find_market_trend: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
