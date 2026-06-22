# 2026-06-22 Guanlan Daily Monitor Log

- generated_at: 2026-06-22T03:52:56.341Z
- raw_count: 226
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 4
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 4244
- historical_duplicates_removed_before_fetch: 4
- historical_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 40
- aihot_count: 100
- keyword_search_count: 77
- keyword_search_non_community_count: 76
- keyword_search_path_distribution: official_original=25; capital_startup=18; industry_landing=15; procurement_marketplace=6; developer_ecosystem=5; a_media_gdelt=4; fde_implementation=3; community_feedback=1
- keyword_search_intent_distribution: find_original_source=31; find_startups=23; find_customer_case=18; find_market_trend=4; find_user_feedback=1
- source_distribution: aihot=100; keyword-search=77; rss-feed=43; gdelt=6
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 81
- enterprise_ai_transformation_stage_distribution: platform_enablement=43; pilot=14; production_rollout=13; ai_transformation=10; org_build=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=100; keyword-search=77; rss-feed=43; gdelt=6
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: targeted-pool-gap-refill=45; uncategorized=43; technical-iteration-signal=40; outside-core-exploration=29; mature-commercial-signal=26; developer-ecosystem-signal=21; early-direction-signal=15; enterprise-ai-implementation-signal=4; capital-market-signal=3
- theme_distribution: targeted-pool-gap-refill=46; uncategorized=43; technical-iteration-signal=40; outside-core-exploration=29; mature-commercial-signal=26; developer-ecosystem-signal=19; early-direction-signal=16; enterprise-ai-implementation-signal=4; capital-market-signal=3
- theme_concentration_warning: none
- source_level_distribution: B=137; C=71; A=10; S=8
- evidence_object_type_distribution: case_or_customer=62; event=55; community_feedback=49; official_index_or_directory=24; supporting_article=10; changelog_or_release=7; research_or_report=6; regulatory_or_procurement=4; event_on_official_page=3; search_result_or_tool_directory=3; pricing_change=2; low_quality_chinese_official_or_seo=1
- pool_route_distribution: discard=117; core_pool=49; watchlist=34; emerging_pool=31; index_only=19; user_feedback_pool=10
- pool_index_route_distribution: core_pool=45; emerging_pool=30; watchlist=25; index_only=12; user_feedback_pool=9; discard=6
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 77
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 32
- index_only_pool_count: 12
- aihot_index_only_count: 4
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 11 result(s): missing_ai_anchor_in_result=4; noise_term:career=4; job_or_salary_page=3; targeted pool/core refill cycle 1 added 3 item(s) for important_funding=4/5; core_pool=24/30; core_non_large=14/20; targeted-refill pre-gate filtered 12 result(s): directory_or_search_page=7; noise_term:affiliate=1; noise_term:avatar=1; noise_term:career=1; noise_term:hiring=1; noise_term:translation=1; targeted pool/core refill cycle 2 added 43 item(s) for core_pool=25/30; core_non_large=15/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=121; community=71; official=6; builder=5; media=5; news=5; industry=4; developer=2; newsletter=2; product=2; analysis=1; funding=1; marketplace=1
- front_signal_sab_source_count: S=0; A=2; B=29; total=31
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=89; fetched-readable-text-content-container=29; no-url-summary-only=29; fetched-readable-text-main=25; fetched-readable-text-article=14; fetched-readable-text-body-visible-text=13; blocked-http-403=6; fetched-readable-text-json-ld=6; http-451-fallback-text=6; summary-only-low-readable-body=4; fetch-failed-fallback-visible-text=2; fetched-readable-text-plain-text=2; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 10
- B: 137
- S: 8
- C: 71

## Evidence Object Type Distribution

- case_or_customer: 62
- event: 55
- pricing_change: 2
- supporting_article: 10
- research_or_report: 6
- regulatory_or_procurement: 4
- changelog_or_release: 7
- event_on_official_page: 3
- community_feedback: 49
- official_index_or_directory: 24
- low_quality_chinese_official_or_seo: 1
- search_result_or_tool_directory: 3

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 19
- 外围探索信号 (outside-core-exploration): 29
- 技术迭代信号 (technical-iteration-signal): 40
- 资本市场信号 (capital-market-signal): 3
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 4
- 早期信号 (early-direction-signal): 16
- 成熟信号 (mature-commercial-signal): 26
- targeted-pool-gap-refill (targeted-pool-gap-refill): 46
- uncategorized (uncategorized): 43

## Keyword Group Distribution

- developer-ecosystem-signal: 21
- outside-core-exploration: 29
- technical-iteration-signal: 40
- capital-market-signal: 3
- enterprise-ai-implementation-signal: 4
- early-direction-signal: 15
- mature-commercial-signal: 26
- targeted-pool-gap-refill: 45
- uncategorized: 43

## Keyword Search Path Distribution

- official_original: 25
- fde_implementation: 3
- capital_startup: 18
- procurement_marketplace: 6
- industry_landing: 15
- developer_ecosystem: 5
- a_media_gdelt: 4
- community_feedback: 1

## Keyword Search Intent Distribution

- find_startups: 23
- find_original_source: 31
- find_customer_case: 18
- find_market_trend: 4
- find_user_feedback: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
