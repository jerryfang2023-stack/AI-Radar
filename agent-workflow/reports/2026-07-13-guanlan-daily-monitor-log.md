# 2026-07-13 Guanlan Daily Monitor Log

- generated_at: 2026-07-13T10:23:57.320Z
- raw_count: 120
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
- provider_fallback_notes: Same-date rerun carried forward 17 already published formal Card source snapshot(s).; Historical Raw dedupe removed 236 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 28 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 111 fetched hash duplicate candidate(s) before Raw writing.; Adaptive Raw fetch stopped with 117/150 active candidate(s): candidate pool exhausted.; Historical Raw dedupe removed 11 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 10
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-13/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 8078
- historical_duplicates_removed_before_fetch: 236
- historical_duplicates_removed_after_fetch: 111
- same_run_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 228
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 228
- adaptive_raw_expansion_candidates: 0
- aihot_count: 57
- keyword_search_count: 33
- keyword_search_non_community_count: 33
- keyword_search_path_distribution: ai_hardware_original=11; capital_startup=8; developer_ecosystem=6; official_original=6; a_media_gdelt=1; fde_implementation=1
- keyword_search_intent_distribution: find_customer_case=13; find_startups=10; find_original_source=9; find_market_trend=1
- source_distribution: aihot=57; keyword-search=33; rss-feed=29; gdelt=1
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 34
- enterprise_ai_transformation_stage_distribution: platform_enablement=19; production_rollout=8; pilot=4; org_build=2; ai_transformation=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=57; keyword-search=33; rss-feed=29; gdelt=1
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=37; technical-iteration-signal=21; developer-ecosystem-signal=18; mature-commercial-signal=10; ai-hardware-scenario-service-signal=7; early-direction-signal=7; capital-market-signal=6; ai-hardware-trend-innovation-signal=5; outside-core-exploration=5; targeted-pool-gap-refill=3; enterprise-ai-implementation-signal=1
- theme_distribution: uncategorized=37; technical-iteration-signal=21; developer-ecosystem-signal=17; mature-commercial-signal=11; ai-hardware-scenario-service-signal=7; early-direction-signal=7; capital-market-signal=6; ai-hardware-trend-innovation-signal=5; outside-core-exploration=5; targeted-pool-gap-refill=3; enterprise-ai-implementation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=52; case_or_customer=29; official_index_or_directory=9; research_or_report=8; supporting_article=7; community_feedback=5; regulatory_or_procurement=4; ecosystem_package_or_model_index=2; event_on_official_page=2; pricing_change=1; repo_readme_or_index=1
- pool_route_distribution: core_pool=39; index_only=37; watchlist=34; emerging_pool=15; discard=10; user_feedback_pool=5
- pool_index_route_distribution: core_pool=39; index_only=37; watchlist=34; emerging_pool=15; user_feedback_pool=5
- pool_index_count: 110
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 73
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 34
- index_only_pool_count: 37
- aihot_index_only_count: 26
- aihot_core_count: 16
- aihot_daily_index_only_count: 10
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 110
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 40 result(s): missing_ai_anchor_in_result=18; job_or_salary_page=8; noise_term:career=7; broad_list_or_market_report=3; noise_term:affiliate=1; noise_term:hiring=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 3 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=70; media=15; developer=10; newsletter=7; builder=4; funding=3; operators=3; product=3; domestic_vendor=1; industry=1; news=1; official=1; research=1
- front_signal_sab_source_count: S=0; A=2; B=19; total=21
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-body-visible-text=20; fetched-readable-text-content-container=20; fetched-readable-text-main=20; fetched-readable-text-carry-forward=17; fetched-readable-text-article=13; no-url-summary-only=11; summary-only-low-readable-body=7; fetched-readable-text-json-ld=6; blocked-http-403=5; http-523-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 92
- A: 16
- C: 3
- S: 9

## Evidence Object Type Distribution

- event: 52
- case_or_customer: 29
- pricing_change: 1
- community_feedback: 5
- regulatory_or_procurement: 4
- supporting_article: 7
- event_on_official_page: 2
- research_or_report: 8
- repo_readme_or_index: 1
- official_index_or_directory: 9
- ecosystem_package_or_model_index: 2

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 11
- uncategorized (uncategorized): 37
- 技术迭代信号 (technical-iteration-signal): 21
- 早期信号 (early-direction-signal): 7
- 开发者生态信号 (developer-ecosystem-signal): 17
- 资本市场信号 (capital-market-signal): 6
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 7
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 5
- targeted-pool-gap-refill (targeted-pool-gap-refill): 3
- 外围探索信号 (outside-core-exploration): 5
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 1

## Keyword Group Distribution

- mature-commercial-signal: 10
- uncategorized: 37
- technical-iteration-signal: 21
- early-direction-signal: 7
- developer-ecosystem-signal: 18
- capital-market-signal: 6
- ai-hardware-scenario-service-signal: 7
- ai-hardware-trend-innovation-signal: 5
- targeted-pool-gap-refill: 3
- outside-core-exploration: 5
- enterprise-ai-implementation-signal: 1

## Keyword Search Path Distribution

- capital_startup: 8
- official_original: 6
- ai_hardware_original: 11
- developer_ecosystem: 6
- fde_implementation: 1
- a_media_gdelt: 1

## Keyword Search Intent Distribution

- find_startups: 10
- find_customer_case: 13
- find_original_source: 9
- find_market_trend: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
