# 2026-06-18 Guanlan Daily Monitor Log

- generated_at: 2026-06-18T03:06:53.430Z
- raw_count: 186
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 29
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 3504
- historical_duplicates_removed_before_fetch: 47
- historical_duplicates_removed_after_fetch: 4
- raw_dedupe_buffer: 40
- aihot_count: 104
- keyword_search_count: 69
- keyword_search_non_community_count: 69
- keyword_search_path_distribution: developer_ecosystem=15; industry_landing=13; capital_startup=12; a_media_gdelt=11; procurement_marketplace=10; official_original=8
- keyword_search_intent_distribution: find_original_source=36; find_startups=12; find_market_trend=11; find_customer_case=10
- source_distribution: aihot=104; keyword-search=69; gdelt=13
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 87
- enterprise_ai_transformation_stage_distribution: platform_enablement=38; production_rollout=22; pilot=20; org_build=6; ai_transformation=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=104; keyword-search=69; gdelt=13
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=65; mature-commercial-signal=46; developer-ecosystem-signal=39; early-direction-signal=26; outside-core-exploration=9; capital-market-signal=1
- theme_distribution: technical-iteration-signal=68; mature-commercial-signal=47; developer-ecosystem-signal=33; early-direction-signal=28; outside-core-exploration=9; capital-market-signal=1
- theme_concentration_warning: none
- source_level_distribution: B=117; C=31; A=21; S=17
- evidence_object_type_distribution: case_or_customer=69; event=69; official_index_or_directory=23; changelog_or_release=5; community_feedback=5; supporting_article=5; research_or_report=4; event_on_official_page=2; pricing_change=2; regulatory_or_procurement=2
- pool_route_distribution: watchlist=83; core_pool=52; emerging_pool=48; user_feedback_pool=46; index_only=40; discard=10
- pool_index_route_distribution: index_only=33; core_pool=32; watchlist=30; emerging_pool=22; user_feedback_pool=17
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 62
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 30
- index_only_pool_count: 33
- aihot_index_only_count: 29
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 10 result(s): missing_ai_anchor_in_result=5; job_or_salary_page=2; noise_term:career=2; directory_or_search_page=1
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=99; community=31; media=12; official=12; news=9; marketplace=8; developer=7; funding=3; product=3; builder=1; industry=1
- front_signal_sab_source_count: S=2; A=10; B=10; total=22
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=58; fetched-readable-text-content-container=42; no-url-summary-only=29; fetched-readable-text-json-ld=20; fetched-readable-text-body-visible-text=15; summary-only-low-readable-body=8; blocked-http-403=7; fetched-readable-text-article=3; blocked-http-401=1; fetched-readable-text-plain-text=1; http-404-fallback-text=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 117
- A: 21
- C: 31
- S: 17

## Evidence Object Type Distribution

- pricing_change: 2
- event: 69
- case_or_customer: 69
- changelog_or_release: 5
- regulatory_or_procurement: 2
- research_or_report: 4
- community_feedback: 5
- supporting_article: 5
- official_index_or_directory: 23
- event_on_official_page: 2

## Theme Distribution

- 早期信号 (early-direction-signal): 28
- 外围探索信号 (outside-core-exploration): 9
- 技术迭代信号 (technical-iteration-signal): 68
- 开发者生态信号 (developer-ecosystem-signal): 33
- 成熟信号 (mature-commercial-signal): 47
- 资本市场信号 (capital-market-signal): 1

## Keyword Group Distribution

- early-direction-signal: 26
- outside-core-exploration: 9
- technical-iteration-signal: 65
- developer-ecosystem-signal: 39
- mature-commercial-signal: 46
- capital-market-signal: 1

## Keyword Search Path Distribution

- a_media_gdelt: 11
- developer_ecosystem: 15
- official_original: 8
- procurement_marketplace: 10
- capital_startup: 12
- industry_landing: 13

## Keyword Search Intent Distribution

- find_market_trend: 11
- find_startups: 12
- find_original_source: 36
- find_customer_case: 10

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
