# 2026-07-19 Guanlan Daily Monitor Log

- generated_at: 2026-07-19T05:46:07.429Z
- raw_count: 111
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 2
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 265 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 8 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 85 fetched hash duplicate candidate(s) before Raw writing.; Adaptive Raw fetch stopped with 109/150 active candidate(s): candidate pool exhausted.; Historical Raw dedupe removed 11 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 14
- recovered_failed_sources_count: 13
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-19/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-19/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-19/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-19/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 8958
- historical_duplicates_removed_before_fetch: 265
- historical_duplicates_removed_after_fetch: 85
- same_run_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 194
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 194
- adaptive_raw_expansion_candidates: 0
- aihot_count: 70
- keyword_search_count: 28
- keyword_search_non_community_count: 28
- keyword_search_path_distribution: capital_startup=5; fde_implementation=5; industry_landing=4; official_original=4; a_media_gdelt=3; ai_hardware_original=3; developer_ecosystem=3; procurement_marketplace=1
- keyword_search_intent_distribution: find_startups=9; find_customer_case=8; find_original_source=8; find_market_trend=3
- source_distribution: aihot=70; keyword-search=28; rss-feed=10; gdelt=3
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 27
- enterprise_ai_transformation_stage_distribution: platform_enablement=11; production_rollout=8; ai_transformation=2; org_build=2; pilot=2; procurement=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=70; keyword-search=28; rss-feed=10; gdelt=3
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=31; outside-core-exploration=17; developer-ecosystem-signal=16; mature-commercial-signal=14; uncategorized=9; capital-market-signal=7; early-direction-signal=5; enterprise-ai-implementation-signal=5; ai-hardware-investment-signal=2; ai-hardware-scenario-service-signal=2; targeted-pool-gap-refill=2; ai-hardware-trend-innovation-signal=1
- theme_distribution: technical-iteration-signal=34; outside-core-exploration=17; mature-commercial-signal=14; developer-ecosystem-signal=13; uncategorized=9; capital-market-signal=7; early-direction-signal=5; enterprise-ai-implementation-signal=5; ai-hardware-investment-signal=2; ai-hardware-scenario-service-signal=2; targeted-pool-gap-refill=2; ai-hardware-trend-innovation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=49; case_or_customer=34; supporting_article=6; regulatory_or_procurement=5; community_feedback=4; changelog_or_release=3; pricing_change=3; event_on_official_page=2; official_index_or_directory=2; repo_readme_or_index=1; research_or_report=1; search_result_or_tool_directory=1
- pool_route_distribution: core_pool=56; watchlist=34; emerging_pool=13; index_only=13; discard=8
- pool_index_route_distribution: core_pool=56; watchlist=34; emerging_pool=13; index_only=13
- pool_index_count: 103
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 90
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 34
- index_only_pool_count: 13
- aihot_index_only_count: 9
- aihot_core_count: 38
- aihot_daily_index_only_count: 2
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 103
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 40 result(s): missing_ai_anchor_in_result=10; job_or_salary_page=8; noise_term:career=6; social_or_profile_source=5; broad_list_or_market_report=4; noise_term:hiring=3; noise_term:affiliate=1; noise_term:avatar=1; noise_term:compensation=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 2 result(s): noise_term:avatar=1; noise_term:career=1; targeted pool/core refill cycle 1 added 2 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=78; media=10; news=8; developer=5; builder=4; product=2; community=1; industry=1; official=1; operators=1
- front_signal_sab_source_count: S=4; A=5; B=23; total=32
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-body-visible-text=33; fetched-readable-text-content-container=33; fetched-readable-text-main=20; summary-only-low-readable-body=10; fetched-readable-text-json-ld=6; blocked-http-403=4; fetched-readable-text-article=3; no-url-summary-only=2
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 82
- A: 18
- C: 2
- S: 9

## Evidence Object Type Distribution

- event_on_official_page: 2
- regulatory_or_procurement: 5
- event: 49
- case_or_customer: 34
- search_result_or_tool_directory: 1
- repo_readme_or_index: 1
- changelog_or_release: 3
- community_feedback: 4
- pricing_change: 3
- supporting_article: 6
- research_or_report: 1
- official_index_or_directory: 2

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 14
- 早期信号 (early-direction-signal): 5
- 开发者生态信号 (developer-ecosystem-signal): 13
- 资本市场信号 (capital-market-signal): 7
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 2
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 5
- 技术迭代信号 (technical-iteration-signal): 34
- targeted-pool-gap-refill (targeted-pool-gap-refill): 2
- 外围探索信号 (outside-core-exploration): 17
- uncategorized (uncategorized): 9
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 1

## Keyword Group Distribution

- mature-commercial-signal: 14
- early-direction-signal: 5
- developer-ecosystem-signal: 16
- capital-market-signal: 7
- ai-hardware-investment-signal: 2
- ai-hardware-scenario-service-signal: 2
- enterprise-ai-implementation-signal: 5
- technical-iteration-signal: 31
- targeted-pool-gap-refill: 2
- outside-core-exploration: 17
- uncategorized: 9
- ai-hardware-trend-innovation-signal: 1

## Keyword Search Path Distribution

- procurement_marketplace: 1
- ai_hardware_original: 3
- capital_startup: 5
- fde_implementation: 5
- industry_landing: 4
- developer_ecosystem: 3
- a_media_gdelt: 3
- official_original: 4

## Keyword Search Intent Distribution

- find_startups: 9
- find_customer_case: 8
- find_original_source: 8
- find_market_trend: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
