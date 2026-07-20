# 2026-07-20 Guanlan Daily Monitor Log

- generated_at: 2026-07-20T03:57:16.120Z
- raw_count: 116
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 8
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 254 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 9 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 96 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 1 duplicate candidate(s) before Raw writing.; Adaptive Raw fetch stopped with 110/150 active candidate(s): candidate pool exhausted.; Historical Raw dedupe removed 33 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 16
- recovered_failed_sources_count: 13
- unrecovered_failed_sources_count: 3
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-20/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-20/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-20/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-20/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 9069
- historical_duplicates_removed_before_fetch: 254
- historical_duplicates_removed_after_fetch: 96
- same_run_duplicates_removed_after_fetch: 1
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 207
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 207
- adaptive_raw_expansion_candidates: 0
- aihot_count: 65
- keyword_search_count: 31
- keyword_search_non_community_count: 31
- keyword_search_path_distribution: capital_startup=9; developer_ecosystem=6; fde_implementation=5; official_original=4; a_media_gdelt=2; industry_landing=2; procurement_marketplace=2; ai_hardware_original=1
- keyword_search_intent_distribution: find_startups=13; find_customer_case=9; find_original_source=7; find_market_trend=2
- source_distribution: aihot=65; keyword-search=31; gdelt=11; rss-feed=9
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 37
- enterprise_ai_transformation_stage_distribution: platform_enablement=11; production_rollout=9; ai_transformation=7; org_build=6; pilot=3; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=65; keyword-search=31; gdelt=11; rss-feed=9
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=27; developer-ecosystem-signal=25; mature-commercial-signal=14; outside-core-exploration=11; capital-market-signal=9; uncategorized=9; targeted-pool-gap-refill=6; ai-hardware-scenario-service-signal=5; enterprise-ai-implementation-signal=5; ai-hardware-trend-innovation-signal=3; early-direction-signal=2
- theme_distribution: technical-iteration-signal=28; developer-ecosystem-signal=20; mature-commercial-signal=17; outside-core-exploration=11; capital-market-signal=9; uncategorized=9; targeted-pool-gap-refill=6; ai-hardware-scenario-service-signal=5; enterprise-ai-implementation-signal=5; ai-hardware-trend-innovation-signal=3; early-direction-signal=3
- theme_concentration_warning: none
- evidence_object_type_distribution: event=50; case_or_customer=41; supporting_article=8; official_index_or_directory=6; event_on_official_page=3; regulatory_or_procurement=3; community_feedback=2; changelog_or_release=1; repo_readme_or_index=1; research_or_report=1
- pool_route_distribution: core_pool=51; watchlist=38; index_only=19; emerging_pool=15; discard=8
- pool_index_route_distribution: core_pool=51; watchlist=38; index_only=19; emerging_pool=15
- pool_index_count: 108
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 89
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 38
- index_only_pool_count: 19
- aihot_index_only_count: 16
- aihot_core_count: 37
- aihot_daily_index_only_count: 8
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5; important_funding=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 108
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 43 result(s): missing_ai_anchor_in_result=12; noise_term:career=9; broad_list_or_market_report=7; job_or_salary_page=7; noise_term:hiring=3; social_or_profile_source=3; directory_or_search_page=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=1; missing_ai_anchor_in_result=1; noise_term:career=1; noise_term:hiring=1; targeted pool/core refill cycle 1 added 6 item(s) for important_case=3/5; important_funding=1/5; important_vertical_solution=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=79; media=9; developer=8; news=7; operators=4; marketplace=3; domestic_vendor=2; official=2; product=2
- front_signal_sab_source_count: S=0; A=0; B=17; total=17
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=33; fetched-readable-text-body-visible-text=25; fetched-readable-text-main=21; fetched-readable-text-article=8; no-url-summary-only=8; summary-only-low-readable-body=8; blocked-http-403=6; fetched-readable-text-json-ld=5; fetched-readable-text-meta-description=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 91
- A: 16
- C: 4
- S: 5

## Evidence Object Type Distribution

- event: 50
- case_or_customer: 41
- regulatory_or_procurement: 3
- repo_readme_or_index: 1
- event_on_official_page: 3
- supporting_article: 8
- community_feedback: 2
- changelog_or_release: 1
- research_or_report: 1
- official_index_or_directory: 6

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 28
- 资本市场信号 (capital-market-signal): 9
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 5
- 成熟信号 (mature-commercial-signal): 17
- 早期信号 (early-direction-signal): 3
- 开发者生态信号 (developer-ecosystem-signal): 20
- targeted-pool-gap-refill (targeted-pool-gap-refill): 6
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 5
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 3
- uncategorized (uncategorized): 9
- 外围探索信号 (outside-core-exploration): 11

## Keyword Group Distribution

- technical-iteration-signal: 27
- capital-market-signal: 9
- enterprise-ai-implementation-signal: 5
- developer-ecosystem-signal: 25
- mature-commercial-signal: 14
- targeted-pool-gap-refill: 6
- early-direction-signal: 2
- ai-hardware-scenario-service-signal: 5
- ai-hardware-trend-innovation-signal: 3
- uncategorized: 9
- outside-core-exploration: 11

## Keyword Search Path Distribution

- a_media_gdelt: 2
- fde_implementation: 5
- developer_ecosystem: 6
- capital_startup: 9
- procurement_marketplace: 2
- industry_landing: 2
- official_original: 4
- ai_hardware_original: 1

## Keyword Search Intent Distribution

- find_market_trend: 2
- find_customer_case: 9
- find_original_source: 7
- find_startups: 13

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
