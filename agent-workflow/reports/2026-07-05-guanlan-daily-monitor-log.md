# 2026-07-05 Guanlan Daily Monitor Log

- generated_at: 2026-07-05T02:07:33.370Z
- raw_count: 116
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 0
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 6850
- historical_duplicates_removed_before_fetch: 601
- historical_duplicates_removed_after_fetch: 207
- raw_dedupe_buffer: 160
- aihot_count: 0
- keyword_search_count: 37
- keyword_search_non_community_count: 37
- keyword_search_path_distribution: capital_startup=10; official_original=10; industry_landing=5; developer_ecosystem=4; a_media_gdelt=3; procurement_marketplace=3; fde_implementation=2
- keyword_search_intent_distribution: find_customer_case=14; find_original_source=10; find_startups=9; find_market_trend=3; find_workflow_change=1
- source_distribution: rss-feed=72; keyword-search=37; gdelt=7
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 58
- enterprise_ai_transformation_stage_distribution: platform_enablement=31; production_rollout=12; ai_transformation=10; procurement=3; org_build=1; pilot=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: rss-feed=72; keyword-search=37; gdelt=7
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=69; targeted-pool-gap-refill=13; outside-core-exploration=7; mature-commercial-signal=6; developer-ecosystem-signal=5; enterprise-ai-implementation-signal=5; technical-iteration-signal=5; capital-market-signal=3; early-direction-signal=3
- theme_distribution: uncategorized=69; targeted-pool-gap-refill=13; mature-commercial-signal=7; outside-core-exploration=7; enterprise-ai-implementation-signal=6; technical-iteration-signal=5; capital-market-signal=3; developer-ecosystem-signal=3; early-direction-signal=3
- theme_concentration_warning: warning: uncategorized concentration 59.5% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- evidence_object_type_distribution: event=43; case_or_customer=28; research_or_report=19; supporting_article=18; changelog_or_release=4; regulatory_or_procurement=3; repo_readme_or_index=1
- pool_route_distribution: watchlist=44; index_only=43; core_pool=23; emerging_pool=20; discard=5; user_feedback_pool=3
- pool_index_route_distribution: watchlist=44; index_only=43; core_pool=23; emerging_pool=20; user_feedback_pool=3
- pool_index_count: 111
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 68
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 45
- index_only_pool_count: 43
- aihot_index_only_count: 0
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 111
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-05): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (all): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact keyword: keyword-search pre-gate filtered 39 result(s): missing_ai_anchor_in_result=17; noise_term:career=9; job_or_salary_page=6; noise_term:hiring=4; noise_term:job description=2; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=3/5; routed_pool=55/60; core_pool=16/30; core_non_large=9/20; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=2; noise_term:avatar=1; noise_term:career=1; noise_term:hiring=1; targeted raw-volume refill cycle 1 added 7 item(s) for raw_count=110/150; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=3; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 6 item(s) for raw_count=116/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=31; media=27; builder=26; news=10; operators=7; product=7; developer=3; industry=2; funding=1; official=1; research=1
- front_signal_sab_source_count: S=0; A=0; B=7; total=7
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=43; fetched-readable-text-json-ld=28; fetched-readable-text-main=23; fetched-readable-text-article=8; blocked-http-403=3; fetched-readable-text-body-visible-text=3; summary-only-low-readable-body=3; fetched-readable-text-meta-description=2; http-404-fallback-text=1; http-429-fallback-text=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 58
- A: 38
- S: 13
- C: 7

## Evidence Object Type Distribution

- case_or_customer: 28
- repo_readme_or_index: 1
- event: 43
- changelog_or_release: 4
- supporting_article: 18
- research_or_report: 19
- regulatory_or_procurement: 3

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 7
- 开发者生态信号 (developer-ecosystem-signal): 3
- 资本市场信号 (capital-market-signal): 3
- 外围探索信号 (outside-core-exploration): 7
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 6
- targeted-pool-gap-refill (targeted-pool-gap-refill): 13
- uncategorized (uncategorized): 69
- 技术迭代信号 (technical-iteration-signal): 5
- 早期信号 (early-direction-signal): 3

## Keyword Group Distribution

- developer-ecosystem-signal: 5
- capital-market-signal: 3
- outside-core-exploration: 7
- enterprise-ai-implementation-signal: 5
- mature-commercial-signal: 6
- targeted-pool-gap-refill: 13
- uncategorized: 69
- technical-iteration-signal: 5
- early-direction-signal: 3

## Keyword Search Path Distribution

- developer_ecosystem: 4
- capital_startup: 10
- a_media_gdelt: 3
- procurement_marketplace: 3
- fde_implementation: 2
- official_original: 10
- industry_landing: 5

## Keyword Search Intent Distribution

- find_original_source: 10
- find_customer_case: 14
- find_market_trend: 3
- find_startups: 9
- find_workflow_change: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
