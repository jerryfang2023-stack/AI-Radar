# 2026-07-04 Guanlan Daily Monitor Log

- generated_at: 2026-07-04T04:35:48.416Z
- raw_count: 139
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
- historical_raw_records_checked: 6482
- historical_duplicates_removed_before_fetch: 437
- historical_duplicates_removed_after_fetch: 162
- raw_dedupe_buffer: 140
- aihot_count: 0
- keyword_search_count: 19
- keyword_search_non_community_count: 19
- keyword_search_path_distribution: official_original=8; capital_startup=6; a_media_gdelt=2; industry_landing=2; procurement_marketplace=1
- keyword_search_intent_distribution: find_original_source=10; find_startups=4; find_customer_case=3; find_market_trend=2
- source_distribution: rss-feed=119; keyword-search=19; gdelt=1
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 77
- enterprise_ai_transformation_stage_distribution: platform_enablement=66; ai_transformation=5; production_rollout=5; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: rss-feed=119; keyword-search=19; gdelt=1
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=93; early-direction-signal=18; targeted-pool-gap-refill=11; technical-iteration-signal=8; mature-commercial-signal=4; capital-market-signal=3; developer-ecosystem-signal=1; enterprise-ai-implementation-signal=1
- theme_distribution: uncategorized=93; early-direction-signal=18; targeted-pool-gap-refill=11; technical-iteration-signal=8; mature-commercial-signal=4; capital-market-signal=3; developer-ecosystem-signal=1; enterprise-ai-implementation-signal=1
- theme_concentration_warning: warning: uncategorized concentration 66.9% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- evidence_object_type_distribution: event=64; case_or_customer=28; official_index_or_directory=28; research_or_report=6; event_on_official_page=4; search_result_or_tool_directory=4; supporting_article=4; changelog_or_release=1
- pool_route_distribution: watchlist=61; discard=47; core_pool=21; emerging_pool=15; index_only=10; user_feedback_pool=4
- pool_index_route_distribution: watchlist=61; core_pool=21; emerging_pool=15; index_only=10; user_feedback_pool=4
- pool_index_count: 92
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 82
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 61
- index_only_pool_count: 10
- aihot_index_only_count: 0
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 92
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-04): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (all): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact keyword: keyword-search pre-gate filtered 21 result(s): missing_ai_anchor_in_result=11; noise_term:career=4; job_or_salary_page=3; noise_term:compensation=1; noise_term:hiring=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 1 added 1 item(s) for important_case=2/5; core_pool=17/30; core_non_large=13/20; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 2 added 1 item(s) for important_case=2/5; core_pool=18/30; core_non_large=13/20; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 3 added 0 item(s) for important_case=2/5; core_pool=18/30; core_non_large=13/20; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=5; targeted raw-volume refill cycle 1 added 9 item(s) for raw_count=139/150; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted raw-volume refill cycle 2 added 0 item(s) for raw_count=139/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=73; operators=31; builder=10; media=7; analysis=6; product=5; news=4; official=2; newsletter=1
- front_signal_sab_source_count: S=0; A=1; B=3; total=4
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=44; no-url-summary-only=40; fetched-readable-text-content-container=16; fetched-readable-text-article=10; summary-only-low-readable-body=9; fetched-readable-text-json-ld=8; fetched-readable-text-body-visible-text=4; http-429-fallback-text=4; blocked-http-403=2; fetched-readable-text-meta-description=2
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 88
- C: 31
- S: 9
- A: 11

## Evidence Object Type Distribution

- case_or_customer: 28
- event: 64
- changelog_or_release: 1
- search_result_or_tool_directory: 4
- research_or_report: 6
- supporting_article: 4
- official_index_or_directory: 28
- event_on_official_page: 4

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 4
- 技术迭代信号 (technical-iteration-signal): 8
- 资本市场信号 (capital-market-signal): 3
- targeted-pool-gap-refill (targeted-pool-gap-refill): 11
- 早期信号 (early-direction-signal): 18
- uncategorized (uncategorized): 93
- 开发者生态信号 (developer-ecosystem-signal): 1
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 1

## Keyword Group Distribution

- mature-commercial-signal: 4
- technical-iteration-signal: 8
- capital-market-signal: 3
- targeted-pool-gap-refill: 11
- early-direction-signal: 18
- uncategorized: 93
- developer-ecosystem-signal: 1
- enterprise-ai-implementation-signal: 1

## Keyword Search Path Distribution

- capital_startup: 6
- procurement_marketplace: 1
- industry_landing: 2
- official_original: 8
- a_media_gdelt: 2

## Keyword Search Intent Distribution

- find_original_source: 10
- find_startups: 4
- find_customer_case: 3
- find_market_trend: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
