# 2026-06-19 Guanlan Daily Monitor Log

- generated_at: 2026-06-19T06:41:39.945Z
- raw_count: 185
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
- historical_raw_records_checked: 3691
- historical_duplicates_removed_before_fetch: 101
- historical_duplicates_removed_after_fetch: 5
- raw_dedupe_buffer: 40
- aihot_count: 152
- keyword_search_count: 28
- keyword_search_non_community_count: 28
- keyword_search_path_distribution: developer_ecosystem=7; official_original=6; a_media_gdelt=4; capital_startup=4; procurement_marketplace=4; industry_landing=3
- keyword_search_intent_distribution: find_original_source=18; find_market_trend=4; find_startups=4; find_customer_case=2
- source_distribution: aihot=152; keyword-search=28; gdelt=5
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 42
- enterprise_ai_transformation_stage_distribution: platform_enablement=23; production_rollout=12; pilot=6; org_build=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=152; keyword-search=28; gdelt=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=70; developer-ecosystem-signal=47; mature-commercial-signal=31; early-direction-signal=22; outside-core-exploration=15
- theme_distribution: technical-iteration-signal=71; developer-ecosystem-signal=45; mature-commercial-signal=32; early-direction-signal=22; outside-core-exploration=15
- theme_concentration_warning: none
- source_level_distribution: B=75; C=74; S=19; A=17
- evidence_object_type_distribution: event=83; case_or_customer=46; official_index_or_directory=24; community_feedback=14; research_or_report=5; supporting_article=5; regulatory_or_procurement=3; changelog_or_release=2; event_on_official_page=2; pricing_change=1
- pool_route_distribution: watchlist=76; user_feedback_pool=68; index_only=57; emerging_pool=44; core_pool=39; discard=10
- pool_index_route_distribution: index_only=35; core_pool=33; watchlist=27; emerging_pool=23; user_feedback_pool=22
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 60
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 27
- index_only_pool_count: 35
- aihot_index_only_count: 29
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 10 result(s): missing_ai_anchor_in_result=6; job_or_salary_page=3; noise_term:career=1
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: community=74; web=69; media=10; official=10; news=7; product=7; developer=2; industry=2; marketplace=2; builder=1; domestic_vendor=1
- front_signal_sab_source_count: S=2; A=5; B=13; total=20
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=79; fetched-readable-text-content-container=32; no-url-summary-only=29; fetched-readable-text-body-visible-text=14; fetched-readable-text-json-ld=11; blocked-http-403=8; fetched-readable-text-article=3; summary-only-low-readable-body=3; fetched-readable-text-meta-description=2; http-500-fallback-text=2; blocked-http-401=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 74
- A: 17
- B: 75
- S: 19

## Evidence Object Type Distribution

- case_or_customer: 46
- event: 83
- regulatory_or_procurement: 3
- changelog_or_release: 2
- community_feedback: 14
- research_or_report: 5
- event_on_official_page: 2
- supporting_article: 5
- pricing_change: 1
- official_index_or_directory: 24

## Theme Distribution

- 早期信号 (early-direction-signal): 22
- 外围探索信号 (outside-core-exploration): 15
- 成熟信号 (mature-commercial-signal): 32
- 技术迭代信号 (technical-iteration-signal): 71
- 开发者生态信号 (developer-ecosystem-signal): 45

## Keyword Group Distribution

- early-direction-signal: 22
- outside-core-exploration: 15
- mature-commercial-signal: 31
- technical-iteration-signal: 70
- developer-ecosystem-signal: 47

## Keyword Search Path Distribution

- a_media_gdelt: 4
- official_original: 6
- developer_ecosystem: 7
- procurement_marketplace: 4
- industry_landing: 3
- capital_startup: 4

## Keyword Search Intent Distribution

- find_market_trend: 4
- find_startups: 4
- find_original_source: 18
- find_customer_case: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
