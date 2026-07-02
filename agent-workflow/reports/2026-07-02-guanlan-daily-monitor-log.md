# 2026-07-02 Guanlan Daily Monitor Log

- generated_at: 2026-07-02T02:28:35.647Z
- raw_count: 147
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
- historical_raw_records_checked: 6199
- historical_duplicates_removed_before_fetch: 564
- historical_duplicates_removed_after_fetch: 191
- raw_dedupe_buffer: 180
- aihot_count: 61
- keyword_search_count: 55
- keyword_search_non_community_count: 55
- keyword_search_path_distribution: capital_startup=13; developer_ecosystem=13; a_media_gdelt=9; official_original=8; procurement_marketplace=8; industry_landing=3; fde_implementation=1
- keyword_search_intent_distribution: find_customer_case=23; find_startups=12; find_original_source=10; find_market_trend=9; find_workflow_change=1
- source_distribution: aihot=61; keyword-search=55; rss-feed=27; gdelt=4
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 68
- enterprise_ai_transformation_stage_distribution: platform_enablement=26; production_rollout=18; ai_transformation=10; org_build=10; pilot=3; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=61; keyword-search=55; rss-feed=27; gdelt=4
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: mature-commercial-signal=34; technical-iteration-signal=33; uncategorized=26; developer-ecosystem-signal=24; early-direction-signal=9; targeted-pool-gap-refill=8; outside-core-exploration=7; capital-market-signal=3; enterprise-ai-implementation-signal=3
- theme_distribution: mature-commercial-signal=36; technical-iteration-signal=33; uncategorized=26; developer-ecosystem-signal=19; early-direction-signal=10; targeted-pool-gap-refill=8; outside-core-exploration=7; enterprise-ai-implementation-signal=5; capital-market-signal=3
- theme_concentration_warning: none
- source_level_distribution: B=90; A=25; C=20; S=12
- evidence_object_type_distribution: event=61; case_or_customer=40; official_index_or_directory=14; supporting_article=9; changelog_or_release=8; research_or_report=6; event_on_official_page=3; regulatory_or_procurement=3; pricing_change=2; marketplace_listing=1
- pool_route_distribution: watchlist=64; core_pool=35; discard=23; emerging_pool=23; index_only=23; user_feedback_pool=6
- pool_index_route_distribution: watchlist=40; core_pool=33; emerging_pool=23; index_only=20; user_feedback_pool=5
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 75
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 42
- index_only_pool_count: 20
- aihot_index_only_count: 15
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 46 result(s): missing_ai_anchor_in_result=16; job_or_salary_page=11; noise_term:career=11; noise_term:hiring=5; noise_term:definition=2; directory_or_search_page=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=2; targeted raw-volume refill cycle 1 added 8 item(s) for raw_count=147/150; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted raw-volume refill cycle 2 added 0 item(s) for raw_count=147/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=81; operators=20; media=12; news=12; official=8; developer=6; industry=3; product=2; analysis=1; marketplace=1; research=1
- front_signal_sab_source_count: S=1; A=3; B=11; total=15
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: summary-only-low-readable-body=31; fetched-readable-text-content-container=28; fetched-readable-text-main=27; no-url-summary-only=17; fetched-readable-text-body-visible-text=13; blocked-http-403=7; fetched-readable-text-article=6; fetched-readable-text-json-ld=6; fetched-readable-text-meta-description=5; blocked-http-401=4; fetched-readable-text-json-text=1; http-410-fallback-text=1; http-999-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 25
- S: 12
- B: 90
- C: 20

## Evidence Object Type Distribution

- event: 61
- research_or_report: 6
- changelog_or_release: 8
- case_or_customer: 40
- pricing_change: 2
- regulatory_or_procurement: 3
- event_on_official_page: 3
- supporting_article: 9
- official_index_or_directory: 14
- marketplace_listing: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 10
- 成熟信号 (mature-commercial-signal): 36
- 开发者生态信号 (developer-ecosystem-signal): 19
- 技术迭代信号 (technical-iteration-signal): 33
- 资本市场信号 (capital-market-signal): 3
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 5
- 外围探索信号 (outside-core-exploration): 7
- targeted-pool-gap-refill (targeted-pool-gap-refill): 8
- uncategorized (uncategorized): 26

## Keyword Group Distribution

- early-direction-signal: 9
- mature-commercial-signal: 34
- developer-ecosystem-signal: 24
- technical-iteration-signal: 33
- capital-market-signal: 3
- enterprise-ai-implementation-signal: 3
- outside-core-exploration: 7
- targeted-pool-gap-refill: 8
- uncategorized: 26

## Keyword Search Path Distribution

- capital_startup: 13
- developer_ecosystem: 13
- procurement_marketplace: 8
- official_original: 8
- a_media_gdelt: 9
- industry_landing: 3
- fde_implementation: 1

## Keyword Search Intent Distribution

- find_startups: 12
- find_customer_case: 23
- find_original_source: 10
- find_market_trend: 9
- find_workflow_change: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
