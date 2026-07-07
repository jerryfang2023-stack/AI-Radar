# 2026-07-07 Guanlan Daily Monitor Log

- generated_at: 2026-07-07T02:01:23.861Z
- raw_count: 97
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
- historical_raw_records_checked: 7043
- historical_duplicates_removed_before_fetch: 500
- historical_duplicates_removed_after_fetch: 205
- raw_dedupe_buffer: 140
- aihot_count: 0
- keyword_search_count: 30
- keyword_search_non_community_count: 30
- keyword_search_path_distribution: capital_startup=9; ai_hardware_original=8; official_original=8; developer_ecosystem=2; a_media_gdelt=1; fde_implementation=1; procurement_marketplace=1
- keyword_search_intent_distribution: find_startups=15; find_original_source=11; find_customer_case=3; find_market_trend=1
- source_distribution: rss-feed=60; keyword-search=30; gdelt=7
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 33
- enterprise_ai_transformation_stage_distribution: platform_enablement=17; ai_transformation=8; pilot=3; production_rollout=3; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: rss-feed=60; keyword-search=30; gdelt=7
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=58; targeted-pool-gap-refill=12; ai-hardware-investment-signal=9; developer-ecosystem-signal=5; early-direction-signal=3; mature-commercial-signal=3; ai-hardware-trend-innovation-signal=2; enterprise-ai-implementation-signal=2; ai-hardware-scenario-service-signal=1; capital-market-signal=1; technical-iteration-signal=1
- theme_distribution: uncategorized=58; targeted-pool-gap-refill=12; ai-hardware-investment-signal=9; early-direction-signal=4; mature-commercial-signal=4; developer-ecosystem-signal=3; ai-hardware-trend-innovation-signal=2; enterprise-ai-implementation-signal=2; ai-hardware-scenario-service-signal=1; capital-market-signal=1; technical-iteration-signal=1
- theme_concentration_warning: warning: uncategorized concentration 59.8% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- evidence_object_type_distribution: event=45; case_or_customer=21; research_or_report=12; supporting_article=7; regulatory_or_procurement=5; official_index_or_directory=4; changelog_or_release=1; community_feedback=1; repo_readme_or_index=1
- pool_route_distribution: watchlist=37; core_pool=28; index_only=25; emerging_pool=17; discard=7
- pool_index_route_distribution: watchlist=37; core_pool=28; index_only=25; emerging_pool=17
- pool_index_count: 90
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 65
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 37
- index_only_pool_count: 25
- aihot_index_only_count: 0
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 90
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-07): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT (all): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT API unavailable; used fallback source search (10 item(s), 21 filtered); source-artifact keyword: keyword-search pre-gate filtered 52 result(s): social_or_profile_source=26; missing_ai_anchor_in_result=16; broad_list_or_market_report=5; noise_term:career=4; noise_term:hiring=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 1 result(s): broad_list_or_market_report=1; targeted pool/core refill cycle 1 added 1 item(s) for important_case=3/5; routed_pool=55/60; core_pool=25/30; targeted pool/core refill cycle 2 added 0 item(s) for important_case=4/5; routed_pool=56/60; core_pool=25/30; targeted-refill pre-gate filtered 14 result(s): social_or_profile_source=6; broad_list_or_market_report=4; missing_ai_anchor_in_result=3; noise_term:avatar=1; targeted raw-volume refill cycle 1 added 6 item(s) for raw_count=92/150; targeted-refill pre-gate filtered 13 result(s): social_or_profile_source=7; broad_list_or_market_report=4; missing_ai_anchor_in_result=2; targeted raw-volume refill cycle 2 added 5 item(s) for raw_count=97/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: media=28; web=25; news=13; builder=10; product=7; operators=6; developer=3; industry=2; official=2; analysis=1
- front_signal_sab_source_count: S=0; A=1; B=6; total=7
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=41; fetched-readable-text-main=25; fetched-readable-text-json-ld=16; blocked-http-403=3; fetched-readable-text-body-visible-text=3; no-url-summary-only=3; fetched-readable-text-article=2; http-429-fallback-text=2; fetched-readable-text-meta-description=1; summary-only-low-readable-body=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 38
- S: 12
- A: 41
- C: 6

## Evidence Object Type Distribution

- case_or_customer: 21
- repo_readme_or_index: 1
- event: 45
- regulatory_or_procurement: 5
- official_index_or_directory: 4
- changelog_or_release: 1
- supporting_article: 7
- research_or_report: 12
- community_feedback: 1

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 4
- 开发者生态信号 (developer-ecosystem-signal): 3
- AI Hardware investment and financing (ai-hardware-investment-signal): 9
- 早期信号 (early-direction-signal): 4
- 技术迭代信号 (technical-iteration-signal): 1
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 2
- targeted-pool-gap-refill (targeted-pool-gap-refill): 12
- uncategorized (uncategorized): 58
- 资本市场信号 (capital-market-signal): 1
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 1
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 2

## Keyword Group Distribution

- developer-ecosystem-signal: 5
- ai-hardware-investment-signal: 9
- mature-commercial-signal: 3
- early-direction-signal: 3
- technical-iteration-signal: 1
- enterprise-ai-implementation-signal: 2
- targeted-pool-gap-refill: 12
- uncategorized: 58
- capital-market-signal: 1
- ai-hardware-scenario-service-signal: 1
- ai-hardware-trend-innovation-signal: 2

## Keyword Search Path Distribution

- developer_ecosystem: 2
- capital_startup: 9
- ai_hardware_original: 8
- procurement_marketplace: 1
- fde_implementation: 1
- official_original: 8
- a_media_gdelt: 1

## Keyword Search Intent Distribution

- find_original_source: 11
- find_customer_case: 3
- find_startups: 15
- find_market_trend: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
