# 2026-06-22 Guanlan Daily Monitor Log

- generated_at: 2026-06-22T03:38:47.840Z
- raw_count: 180
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
- keyword_search_count: 31
- keyword_search_non_community_count: 30
- keyword_search_path_distribution: procurement_marketplace=6; capital_startup=5; developer_ecosystem=5; a_media_gdelt=4; official_original=4; fde_implementation=3; industry_landing=3; community_feedback=1
- keyword_search_intent_distribution: find_original_source=13; find_startups=10; find_market_trend=4; find_customer_case=3; find_user_feedback=1
- source_distribution: aihot=100; rss-feed=43; keyword-search=31; gdelt=6
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 53
- enterprise_ai_transformation_stage_distribution: platform_enablement=28; pilot=11; production_rollout=8; ai_transformation=5; org_build=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=100; rss-feed=43; keyword-search=31; gdelt=6
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=43; technical-iteration-signal=40; outside-core-exploration=29; mature-commercial-signal=26; developer-ecosystem-signal=20; early-direction-signal=15; enterprise-ai-implementation-signal=4; capital-market-signal=3
- theme_distribution: uncategorized=43; technical-iteration-signal=40; outside-core-exploration=29; mature-commercial-signal=26; developer-ecosystem-signal=19; early-direction-signal=16; enterprise-ai-implementation-signal=4; capital-market-signal=3
- theme_concentration_warning: none
- source_level_distribution: B=93; C=71; A=10; S=6
- evidence_object_type_distribution: community_feedback=49; event=42; case_or_customer=37; official_index_or_directory=24; supporting_article=10; research_or_report=6; event_on_official_page=3; regulatory_or_procurement=3; search_result_or_tool_directory=3; changelog_or_release=2; low_quality_chinese_official_or_seo=1
- pool_route_distribution: discard=114; core_pool=28; index_only=18; watchlist=16; emerging_pool=15; user_feedback_pool=6
- pool_index_route_distribution: discard=35; core_pool=28; watchlist=16; emerging_pool=15; index_only=12; user_feedback_pool=6
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 48
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 20
- index_only_pool_count: 12
- aihot_index_only_count: 4
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 11 result(s): missing_ai_anchor_in_result=4; noise_term:career=4; job_or_salary_page=3; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; core_pool=28/30; core_non_large=18/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=79; community=71; builder=5; media=5; news=5; official=4; industry=3; newsletter=2; product=2; analysis=1; developer=1; funding=1; marketplace=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=88; no-url-summary-only=29; fetched-readable-text-content-container=16; fetched-readable-text-main=12; fetched-readable-text-article=10; fetched-readable-text-body-visible-text=10; fetched-readable-text-json-ld=5; blocked-http-403=4; http-451-fallback-text=2; summary-only-low-readable-body=2; fetch-failed-fallback-visible-text=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 10
- B: 93
- S: 6
- C: 71

## Evidence Object Type Distribution

- case_or_customer: 37
- event: 42
- supporting_article: 10
- research_or_report: 6
- regulatory_or_procurement: 3
- event_on_official_page: 3
- changelog_or_release: 2
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
- uncategorized (uncategorized): 43

## Keyword Group Distribution

- developer-ecosystem-signal: 20
- outside-core-exploration: 29
- technical-iteration-signal: 40
- capital-market-signal: 3
- enterprise-ai-implementation-signal: 4
- early-direction-signal: 15
- mature-commercial-signal: 26
- uncategorized: 43

## Keyword Search Path Distribution

- official_original: 4
- fde_implementation: 3
- capital_startup: 5
- procurement_marketplace: 6
- industry_landing: 3
- developer_ecosystem: 5
- a_media_gdelt: 4
- community_feedback: 1

## Keyword Search Intent Distribution

- find_startups: 10
- find_original_source: 13
- find_customer_case: 3
- find_market_trend: 4
- find_user_feedback: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
