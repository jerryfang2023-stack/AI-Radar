# 2026-06-25 Guanlan Daily Monitor Log

- generated_at: 2026-06-25T03:26:01.183Z
- raw_count: 244
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
- historical_duplicates_removed_before_fetch: 13
- historical_duplicates_removed_after_fetch: 2
- raw_dedupe_buffer: 40
- aihot_count: 158
- keyword_search_count: 81
- keyword_search_non_community_count: 81
- keyword_search_path_distribution: official_original=32; a_media_gdelt=14; capital_startup=14; industry_landing=11; procurement_marketplace=5; developer_ecosystem=4; fde_implementation=1
- keyword_search_intent_distribution: find_original_source=39; find_startups=21; find_customer_case=18; find_market_trend=3
- source_distribution: aihot=158; keyword-search=81; gdelt=5
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 65
- enterprise_ai_transformation_stage_distribution: platform_enablement=35; production_rollout=11; ai_transformation=8; pilot=7; org_build=2; procurement=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=158; keyword-search=81; gdelt=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=77; targeted-pool-gap-refill=57; developer-ecosystem-signal=52; mature-commercial-signal=21; outside-core-exploration=17; early-direction-signal=14; capital-market-signal=5; enterprise-ai-implementation-signal=1
- theme_distribution: technical-iteration-signal=77; targeted-pool-gap-refill=57; developer-ecosystem-signal=50; mature-commercial-signal=22; outside-core-exploration=17; early-direction-signal=15; capital-market-signal=5; enterprise-ai-implementation-signal=1
- theme_concentration_warning: none
- source_level_distribution: B=144; C=67; S=18; A=15
- evidence_object_type_distribution: event=106; case_or_customer=62; community_feedback=20; official_index_or_directory=17; changelog_or_release=10; supporting_article=8; regulatory_or_procurement=7; research_or_report=6; event_on_official_page=3; pricing_change=3; repo_readme_or_index=1; search_result_or_tool_directory=1
- pool_route_distribution: discard=107; watchlist=59; core_pool=48; emerging_pool=37; index_only=29; user_feedback_pool=7
- pool_index_route_distribution: core_pool=40; watchlist=32; emerging_pool=28; index_only=22; user_feedback_pool=6
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 73
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 33
- index_only_pool_count: 22
- aihot_index_only_count: 20
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 10 result(s): noise_term:career=5; missing_ai_anchor_in_result=4; job_or_salary_page=1; targeted-refill pre-gate filtered 10 result(s): noise_term:definition=4; noise_term:career=2; directory_or_search_page=1; noise_term:avatar=1; noise_term:hiring=1; noise_term:translation=1; targeted pool/core refill cycle 1 added 57 item(s) for routed_pool=56/60
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=129; community=67; official=11; media=9; domestic_vendor=7; developer=6; news=6; product=5; industry=2; marketplace=1; research=1
- front_signal_sab_source_count: S=1; A=6; B=20; total=27
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=103; fetched-readable-text-content-container=37; fetched-readable-text-main=30; no-url-summary-only=20; fetched-readable-text-body-visible-text=15; blocked-http-403=9; summary-only-low-readable-body=7; http-451-fallback-text=6; fetched-readable-text-article=5; fetched-readable-text-json-ld=5; http-503-fallback-text=3; fetched-readable-text-plain-text=2; fetch-failed-fallback-visible-text=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 15
- B: 144
- C: 67
- S: 18

## Evidence Object Type Distribution

- research_or_report: 6
- event: 106
- case_or_customer: 62
- regulatory_or_procurement: 7
- pricing_change: 3
- changelog_or_release: 10
- official_index_or_directory: 17
- supporting_article: 8
- event_on_official_page: 3
- repo_readme_or_index: 1
- community_feedback: 20
- search_result_or_tool_directory: 1

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 22
- 外围探索信号 (outside-core-exploration): 17
- 技术迭代信号 (technical-iteration-signal): 77
- 开发者生态信号 (developer-ecosystem-signal): 50
- 资本市场信号 (capital-market-signal): 5
- 早期信号 (early-direction-signal): 15
- targeted-pool-gap-refill (targeted-pool-gap-refill): 57
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 1

## Keyword Group Distribution

- mature-commercial-signal: 21
- outside-core-exploration: 17
- technical-iteration-signal: 77
- developer-ecosystem-signal: 52
- capital-market-signal: 5
- early-direction-signal: 14
- targeted-pool-gap-refill: 57
- enterprise-ai-implementation-signal: 1

## Keyword Search Path Distribution

- official_original: 32
- procurement_marketplace: 5
- capital_startup: 14
- developer_ecosystem: 4
- industry_landing: 11
- a_media_gdelt: 14
- fde_implementation: 1

## Keyword Search Intent Distribution

- find_startups: 21
- find_original_source: 39
- find_customer_case: 18
- find_market_trend: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
