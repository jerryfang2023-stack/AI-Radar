# 2026-06-22 Guanlan Daily Monitor Log

- generated_at: 2026-06-22T06:23:07.238Z
- raw_count: 227
- aihot_mode: daily+all
- aihot_since: 2026-06-21T06:05:44.090Z
- aihot_discovered_count: 150
- aihot_daily_discovered_count: 4
- aihot_all_discovered_count: 146
- aihot_daily_included_count: 4
- aihot_daily_pool_count: 4
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 34
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 4244
- historical_duplicates_removed_before_fetch: 3
- historical_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 40
- aihot_count: 115
- keyword_search_count: 86
- keyword_search_non_community_count: 85
- keyword_search_path_distribution: official_original=24; a_media_gdelt=14; capital_startup=12; developer_ecosystem=11; industry_landing=11; procurement_marketplace=8; fde_implementation=5; community_feedback=1
- keyword_search_intent_distribution: find_original_source=42; find_startups=23; find_customer_case=17; find_market_trend=3; find_user_feedback=1
- source_distribution: aihot=115; keyword-search=86; rss-feed=21; gdelt=5
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 77
- enterprise_ai_transformation_stage_distribution: platform_enablement=34; production_rollout=19; ai_transformation=13; pilot=9; org_build=1; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=115; keyword-search=86; rss-feed=21; gdelt=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=48; targeted-pool-gap-refill=43; outside-core-exploration=31; mature-commercial-signal=29; developer-ecosystem-signal=28; uncategorized=21; early-direction-signal=15; capital-market-signal=6; enterprise-ai-implementation-signal=6
- theme_distribution: technical-iteration-signal=48; targeted-pool-gap-refill=43; outside-core-exploration=31; mature-commercial-signal=29; developer-ecosystem-signal=24; uncategorized=21; early-direction-signal=15; capital-market-signal=10; enterprise-ai-implementation-signal=6
- theme_concentration_warning: none
- source_level_distribution: B=123; C=81; A=14; S=9
- evidence_object_type_distribution: case_or_customer=65; event=59; community_feedback=53; official_index_or_directory=13; changelog_or_release=9; supporting_article=8; event_on_official_page=6; regulatory_or_procurement=5; research_or_report=5; search_result_or_tool_directory=3; low_quality_chinese_official_or_seo=1
- pool_route_distribution: discard=122; watchlist=53; core_pool=31; emerging_pool=23; index_only=21; user_feedback_pool=4
- pool_index_route_distribution: watchlist=47; core_pool=31; emerging_pool=23; index_only=12; discard=5; user_feedback_pool=4
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 78
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 47
- index_only_pool_count: 12
- aihot_index_only_count: 4
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_technical_trend=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 21 result(s): missing_ai_anchor_in_result=9; job_or_salary_page=6; noise_term:career=4; noise_term:hiring=1; noise_term:jobs at=1; RSS the-verge-ai: fetch failed; RSS latent-space-podcast: fetch failed; RSS mad-podcast: fetch failed; RSS ai-and-i-podcast: fetch failed; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=1; noise_term:definition=1; targeted pool/core refill cycle 1 added 42 item(s) for routed_pool=54/60; core_pool=20/30; core_non_large=10/20; targeted pool/core refill cycle 2 added 1 item(s) for important_technical_trend=4/5; targeted pool/core refill cycle 3 added 0 item(s) for important_technical_trend=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=106; community=81; news=7; official=7; builder=5; media=5; developer=4; industry=3; marketplace=2; newsletter=2; product=2; research=2; analysis=1
- front_signal_sab_source_count: S=0; A=2; B=18; total=20
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=110; fetched-readable-text-content-container=34; fetched-readable-text-main=27; no-url-summary-only=18; fetched-readable-text-body-visible-text=14; http-451-fallback-text=7; blocked-http-403=6; fetched-readable-text-json-ld=6; fetched-readable-text-article=2; summary-only-low-readable-body=2; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 14
- B: 123
- S: 9
- C: 81

## Evidence Object Type Distribution

- event: 59
- case_or_customer: 65
- event_on_official_page: 6
- changelog_or_release: 9
- supporting_article: 8
- research_or_report: 5
- regulatory_or_procurement: 5
- community_feedback: 53
- official_index_or_directory: 13
- low_quality_chinese_official_or_seo: 1
- search_result_or_tool_directory: 3

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 31
- 开发者生态信号 (developer-ecosystem-signal): 24
- 技术迭代信号 (technical-iteration-signal): 48
- 资本市场信号 (capital-market-signal): 10
- 早期信号 (early-direction-signal): 15
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 6
- 成熟信号 (mature-commercial-signal): 29
- targeted-pool-gap-refill (targeted-pool-gap-refill): 43
- uncategorized (uncategorized): 21

## Keyword Group Distribution

- outside-core-exploration: 31
- developer-ecosystem-signal: 28
- technical-iteration-signal: 48
- capital-market-signal: 6
- early-direction-signal: 15
- enterprise-ai-implementation-signal: 6
- mature-commercial-signal: 29
- targeted-pool-gap-refill: 43
- uncategorized: 21

## Keyword Search Path Distribution

- capital_startup: 12
- procurement_marketplace: 8
- official_original: 24
- fde_implementation: 5
- developer_ecosystem: 11
- industry_landing: 11
- a_media_gdelt: 14
- community_feedback: 1

## Keyword Search Intent Distribution

- find_startups: 23
- find_customer_case: 17
- find_original_source: 42
- find_market_trend: 3
- find_user_feedback: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
