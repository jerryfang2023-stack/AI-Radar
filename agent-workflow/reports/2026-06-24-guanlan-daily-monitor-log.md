# 2026-06-24 Guanlan Daily Monitor Log

- generated_at: 2026-06-24T01:53:52.668Z
- raw_count: 190
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 26
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 4661
- historical_duplicates_removed_before_fetch: 2
- historical_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 40
- aihot_count: 165
- keyword_search_count: 21
- keyword_search_non_community_count: 21
- keyword_search_path_distribution: capital_startup=8; industry_landing=5; official_original=3; a_media_gdelt=2; procurement_marketplace=2; developer_ecosystem=1
- keyword_search_intent_distribution: find_customer_case=7; find_original_source=6; find_startups=6; find_market_trend=2
- source_distribution: aihot=165; keyword-search=21; gdelt=4
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 24
- enterprise_ai_transformation_stage_distribution: platform_enablement=8; pilot=5; production_rollout=5; ai_transformation=3; org_build=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=165; keyword-search=21; gdelt=4
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=56; technical-iteration-signal=48; early-direction-signal=35; mature-commercial-signal=26; outside-core-exploration=21; capital-market-signal=2; targeted-pool-gap-refill=2
- theme_distribution: developer-ecosystem-signal=53; technical-iteration-signal=50; early-direction-signal=36; mature-commercial-signal=26; outside-core-exploration=21; capital-market-signal=2; targeted-pool-gap-refill=2
- theme_concentration_warning: none
- source_level_distribution: C=85; B=81; S=15; A=9
- evidence_object_type_distribution: event=89; case_or_customer=34; community_feedback=31; official_index_or_directory=13; changelog_or_release=5; regulatory_or_procurement=5; research_or_report=5; supporting_article=5; event_on_official_page=3
- pool_route_distribution: watchlist=83; discard=40; index_only=34; core_pool=31; emerging_pool=11; user_feedback_pool=4
- pool_index_route_distribution: core_pool=31; index_only=30; watchlist=27; emerging_pool=11; discard=5; user_feedback_pool=4
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 60
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 29
- index_only_pool_count: 30
- aihot_index_only_count: 26
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 15 result(s): noise_term:career=5; job_or_salary_page=4; missing_ai_anchor_in_result=4; noise_term:definition=1; noise_term:hiring=1; targeted pool/core refill cycle 1 added 2 item(s) for important_funding=4/5; core_pool=29/30; core_non_large=19/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: community=85; web=71; official=9; developer=5; media=5; domestic_vendor=4; news=4; product=4; industry=1; marketplace=1; research=1
- front_signal_sab_source_count: S=2; A=5; B=10; total=17
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: binary-text-rejected=92; no-url-summary-only=26; fetched-readable-text-main=19; fetched-readable-text-content-container=18; summary-only-low-readable-body=14; fetched-readable-text-body-visible-text=9; blocked-http-403=6; fetched-readable-text-json-ld=2; http-404-fallback-text=2; blocked-http-401=1; fetched-readable-text-meta-description=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 15
- A: 9
- B: 81
- C: 85

## Evidence Object Type Distribution

- event: 89
- changelog_or_release: 5
- case_or_customer: 34
- regulatory_or_procurement: 5
- community_feedback: 31
- research_or_report: 5
- supporting_article: 5
- event_on_official_page: 3
- official_index_or_directory: 13

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 26
- 外围探索信号 (outside-core-exploration): 21
- 开发者生态信号 (developer-ecosystem-signal): 53
- 技术迭代信号 (technical-iteration-signal): 50
- 资本市场信号 (capital-market-signal): 2
- targeted-pool-gap-refill (targeted-pool-gap-refill): 2
- 早期信号 (early-direction-signal): 36

## Keyword Group Distribution

- mature-commercial-signal: 26
- outside-core-exploration: 21
- developer-ecosystem-signal: 56
- technical-iteration-signal: 48
- capital-market-signal: 2
- targeted-pool-gap-refill: 2
- early-direction-signal: 35

## Keyword Search Path Distribution

- official_original: 3
- capital_startup: 8
- a_media_gdelt: 2
- procurement_marketplace: 2
- industry_landing: 5
- developer_ecosystem: 1

## Keyword Search Intent Distribution

- find_startups: 6
- find_market_trend: 2
- find_original_source: 6
- find_customer_case: 7

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
