# 2026-07-08 Guanlan Daily Monitor Log

- generated_at: 2026-07-08T02:16:36.807Z
- raw_count: 115
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
- historical_raw_records_checked: 7311
- historical_duplicates_removed_before_fetch: 575
- historical_duplicates_removed_after_fetch: 206
- raw_dedupe_buffer: 160
- aihot_count: 3
- keyword_search_count: 34
- keyword_search_non_community_count: 34
- keyword_search_path_distribution: official_original=10; a_media_gdelt=5; capital_startup=5; industry_landing=5; developer_ecosystem=4; ai_hardware_original=2; procurement_marketplace=2; fde_implementation=1
- keyword_search_intent_distribution: find_startups=10; find_customer_case=8; find_workflow_change=7; find_market_trend=5; find_original_source=4
- source_distribution: rss-feed=73; keyword-search=34; gdelt=5; aihot=3
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 46
- enterprise_ai_transformation_stage_distribution: platform_enablement=40; ai_transformation=2; pilot=2; org_build=1; production_rollout=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: rss-feed=73; keyword-search=34; gdelt=5; aihot=3
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=67; targeted-pool-gap-refill=11; ai-hardware-investment-signal=8; developer-ecosystem-signal=8; ai-hardware-scenario-service-signal=7; mature-commercial-signal=4; capital-market-signal=2; early-direction-signal=2; enterprise-ai-implementation-signal=2; aihot-fallback-funding=1; aihot-fallback-market-structure=1; aihot-fallback-product=1; technical-iteration-signal=1
- theme_distribution: uncategorized=67; targeted-pool-gap-refill=11; ai-hardware-investment-signal=9; ai-hardware-scenario-service-signal=9; developer-ecosystem-signal=5; mature-commercial-signal=4; capital-market-signal=2; early-direction-signal=2; enterprise-ai-implementation-signal=2; aihot-fallback-funding=1; aihot-fallback-market-structure=1; aihot-fallback-product=1; technical-iteration-signal=1
- theme_concentration_warning: warning: uncategorized concentration 58.3% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- evidence_object_type_distribution: event=42; case_or_customer=18; supporting_article=18; research_or_report=15; regulatory_or_procurement=14; changelog_or_release=5; pricing_change=2; event_on_official_page=1
- pool_route_distribution: watchlist=40; index_only=38; core_pool=28; emerging_pool=15; discard=9; user_feedback_pool=1
- pool_index_route_distribution: watchlist=40; index_only=38; core_pool=28; emerging_pool=15; user_feedback_pool=1
- pool_index_count: 106
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 68
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 40
- index_only_pool_count: 38
- aihot_index_only_count: 0
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 106
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-08): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT (all): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT API unavailable; used fallback source search (13 item(s), 18 filtered); source-artifact keyword: keyword-search pre-gate filtered 66 result(s): social_or_profile_source=33; missing_ai_anchor_in_result=17; noise_term:career=6; broad_list_or_market_report=3; job_or_salary_page=3; noise_term:hiring=2; noise_term:avatar=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 14 result(s): broad_list_or_market_report=8; social_or_profile_source=6; targeted pool/core refill cycle 1 added 6 item(s) for routed_pool=58/60; core_pool=21/30; core_non_large=12/20; targeted-refill pre-gate filtered 13 result(s): broad_list_or_market_report=8; social_or_profile_source=5; targeted pool/core refill cycle 2 added 0 item(s) for core_pool=25/30; core_non_large=15/20; targeted-refill pre-gate filtered 19 result(s): broad_list_or_market_report=10; social_or_profile_source=7; noise_term:avatar=1; noise_term:hiring=1; targeted raw-volume refill cycle 1 added 3 item(s) for raw_count=113/150; targeted-refill pre-gate filtered 16 result(s): broad_list_or_market_report=11; social_or_profile_source=4; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 2 item(s) for raw_count=115/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: builder=43; media=23; web=20; news=14; developer=6; product=4; marketplace=2; operators=2; newsletter=1
- front_signal_sab_source_count: S=0; A=3; B=4; total=7
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=47; fetched-readable-text-json-ld=22; fetched-readable-text-main=21; fetched-readable-text-article=9; fetched-readable-text-body-visible-text=6; blocked-http-403=4; blocked-http-401=3; summary-only-low-readable-body=2; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 69
- A: 37
- S: 7
- C: 2

## Evidence Object Type Distribution

- event: 42
- case_or_customer: 18
- changelog_or_release: 5
- regulatory_or_procurement: 14
- event_on_official_page: 1
- pricing_change: 2
- research_or_report: 15
- supporting_article: 18

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 4
- 开发者生态信号 (developer-ecosystem-signal): 5
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 2
- AI Hardware investment and financing (ai-hardware-investment-signal): 9
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 9
- targeted-pool-gap-refill (targeted-pool-gap-refill): 11
- 资本市场信号 (capital-market-signal): 2
- aihot-fallback-product (aihot-fallback-product): 1
- uncategorized (uncategorized): 67
- 早期信号 (early-direction-signal): 2
- 技术迭代信号 (technical-iteration-signal): 1
- aihot-fallback-funding (aihot-fallback-funding): 1
- aihot-fallback-market-structure (aihot-fallback-market-structure): 1

## Keyword Group Distribution

- mature-commercial-signal: 4
- developer-ecosystem-signal: 8
- enterprise-ai-implementation-signal: 2
- ai-hardware-investment-signal: 8
- ai-hardware-scenario-service-signal: 7
- targeted-pool-gap-refill: 11
- capital-market-signal: 2
- aihot-fallback-product: 1
- uncategorized: 67
- early-direction-signal: 2
- technical-iteration-signal: 1
- aihot-fallback-funding: 1
- aihot-fallback-market-structure: 1

## Keyword Search Path Distribution

- industry_landing: 5
- a_media_gdelt: 5
- fde_implementation: 1
- capital_startup: 5
- official_original: 10
- procurement_marketplace: 2
- ai_hardware_original: 2
- developer_ecosystem: 4

## Keyword Search Intent Distribution

- find_customer_case: 8
- find_market_trend: 5
- find_workflow_change: 7
- find_startups: 10
- find_original_source: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
