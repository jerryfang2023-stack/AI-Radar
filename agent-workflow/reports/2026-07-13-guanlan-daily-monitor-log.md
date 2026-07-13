# 2026-07-13 Guanlan Daily Monitor Log

- generated_at: 2026-07-13T08:26:47.707Z
- raw_count: 101
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 10
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Same-date rerun carried forward 14 already published formal Card source snapshot(s).; Historical Raw dedupe removed 252 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 22 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 107 fetched hash duplicate candidate(s) before Raw writing.; Adaptive Raw fetch stopped with 99/150 active candidate(s): candidate pool exhausted.; Historical Raw dedupe removed 28 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 1 fetched hash duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 14
- recovered_failed_sources_count: 11
- unrecovered_failed_sources_count: 3
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-13/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 8078
- historical_duplicates_removed_before_fetch: 252
- historical_duplicates_removed_after_fetch: 107
- same_run_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 206
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 206
- adaptive_raw_expansion_candidates: 0
- aihot_count: 52
- keyword_search_count: 20
- keyword_search_non_community_count: 20
- keyword_search_path_distribution: capital_startup=11; fde_implementation=3; official_original=3; a_media_gdelt=1; industry_landing=1; procurement_marketplace=1
- keyword_search_intent_distribution: find_startups=14; find_customer_case=3; find_original_source=2; find_market_trend=1
- source_distribution: aihot=52; rss-feed=28; keyword-search=20; gdelt=1
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 26
- enterprise_ai_transformation_stage_distribution: platform_enablement=15; pilot=4; org_build=3; ai_transformation=2; production_rollout=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=52; rss-feed=28; keyword-search=20; gdelt=1
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=36; technical-iteration-signal=18; mature-commercial-signal=12; developer-ecosystem-signal=11; capital-market-signal=8; outside-core-exploration=6; early-direction-signal=4; enterprise-ai-implementation-signal=3; targeted-pool-gap-refill=2; ai-hardware-scenario-service-signal=1
- theme_distribution: uncategorized=36; technical-iteration-signal=18; mature-commercial-signal=12; developer-ecosystem-signal=11; capital-market-signal=8; outside-core-exploration=6; early-direction-signal=4; enterprise-ai-implementation-signal=3; targeted-pool-gap-refill=2; ai-hardware-scenario-service-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=49; case_or_customer=18; official_index_or_directory=9; research_or_report=7; supporting_article=7; community_feedback=4; regulatory_or_procurement=4; event_on_official_page=1; pricing_change=1; repo_readme_or_index=1
- pool_route_distribution: index_only=36; watchlist=30; core_pool=27; emerging_pool=14; discard=8; user_feedback_pool=4
- pool_index_route_distribution: index_only=36; watchlist=30; core_pool=27; emerging_pool=14; user_feedback_pool=4
- pool_index_count: 93
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 57
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 30
- index_only_pool_count: 36
- aihot_index_only_count: 24
- aihot_core_count: 13
- aihot_daily_index_only_count: 10
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5; important_funding=3/5; important_vertical_solution=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 93
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 33 result(s): missing_ai_anchor_in_result=13; job_or_salary_page=7; noise_term:career=6; broad_list_or_market_report=2; noise_term:affiliate=2; noise_term:hiring=2; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 3 result(s): broad_list_or_market_report=1; missing_ai_anchor_in_result=1; noise_term:hiring=1; targeted pool/core refill cycle 1 added 2 item(s) for important_case=2/5; important_funding=3/5; important_vertical_solution=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=57; media=14; newsletter=7; developer=5; builder=4; funding=3; operators=3; news=2; product=2; domestic_vendor=1; industry=1; official=1; research=1
- front_signal_sab_source_count: S=1; A=0; B=15; total=16
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=22; fetched-readable-text-body-visible-text=19; fetched-readable-text-carry-forward=14; no-url-summary-only=11; fetched-readable-text-main=10; fetched-readable-text-article=8; fetched-readable-text-json-ld=7; blocked-http-403=5; summary-only-low-readable-body=3; http-523-fallback-text=2
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 74
- C: 3
- A: 16
- S: 8

## Evidence Object Type Distribution

- event: 49
- case_or_customer: 18
- pricing_change: 1
- community_feedback: 4
- regulatory_or_procurement: 4
- supporting_article: 7
- research_or_report: 7
- repo_readme_or_index: 1
- official_index_or_directory: 9
- event_on_official_page: 1

## Theme Distribution

- uncategorized (uncategorized): 36
- 成熟信号 (mature-commercial-signal): 12
- 技术迭代信号 (technical-iteration-signal): 18
- 开发者生态信号 (developer-ecosystem-signal): 11
- 资本市场信号 (capital-market-signal): 8
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 3
- targeted-pool-gap-refill (targeted-pool-gap-refill): 2
- 外围探索信号 (outside-core-exploration): 6
- 早期信号 (early-direction-signal): 4
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 1

## Keyword Group Distribution

- uncategorized: 36
- mature-commercial-signal: 12
- technical-iteration-signal: 18
- developer-ecosystem-signal: 11
- capital-market-signal: 8
- enterprise-ai-implementation-signal: 3
- targeted-pool-gap-refill: 2
- outside-core-exploration: 6
- early-direction-signal: 4
- ai-hardware-scenario-service-signal: 1

## Keyword Search Path Distribution

- capital_startup: 11
- official_original: 3
- fde_implementation: 3
- industry_landing: 1
- procurement_marketplace: 1
- a_media_gdelt: 1

## Keyword Search Intent Distribution

- find_startups: 14
- find_original_source: 2
- find_customer_case: 3
- find_market_trend: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
