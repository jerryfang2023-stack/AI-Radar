# 2026-07-22 Guanlan Daily Monitor Log

- generated_at: 2026-07-22T01:55:59.235Z
- raw_count: 164
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 31
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 250 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 27 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 211 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 6 duplicate candidate(s) before Raw writing.; Adaptive Raw fetch expanded by 91 candidate(s) across 2 batch(es) after post-fetch dedupe left active Raw below 150.; Historical Raw dedupe removed 4 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 9
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-22/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-22/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-22/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-22/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 9324
- historical_duplicates_removed_before_fetch: 250
- historical_duplicates_removed_after_fetch: 211
- same_run_duplicates_removed_after_fetch: 6
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 381
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 2
- adaptive_raw_fetched_candidates: 381
- adaptive_raw_expansion_candidates: 91
- aihot_count: 112
- keyword_search_count: 20
- keyword_search_non_community_count: 20
- keyword_search_path_distribution: ai_hardware_original=6; capital_startup=4; a_media_gdelt=3; developer_ecosystem=3; fde_implementation=2; industry_landing=2
- keyword_search_intent_distribution: find_customer_case=8; find_startups=6; find_market_trend=3; find_original_source=3
- source_distribution: aihot=112; rss-feed=30; keyword-search=20; gdelt=2
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 43
- enterprise_ai_transformation_stage_distribution: platform_enablement=25; production_rollout=10; pilot=4; ai_transformation=2; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=112; rss-feed=30; keyword-search=20; gdelt=2
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=42; developer-ecosystem-signal=38; uncategorized=26; mature-commercial-signal=21; early-direction-signal=13; outside-core-exploration=9; capital-market-signal=7; ai-hardware-scenario-service-signal=5; enterprise-ai-implementation-signal=2; ai-hardware-investment-signal=1
- theme_distribution: technical-iteration-signal=43; developer-ecosystem-signal=34; uncategorized=26; mature-commercial-signal=23; early-direction-signal=14; outside-core-exploration=9; capital-market-signal=7; ai-hardware-scenario-service-signal=5; enterprise-ai-implementation-signal=2; ai-hardware-investment-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=60; case_or_customer=46; official_index_or_directory=23; supporting_article=9; research_or_report=8; regulatory_or_procurement=7; changelog_or_release=3; community_feedback=3; event_on_official_page=2; pricing_change=2; marketplace_listing=1
- pool_route_distribution: core_pool=52; watchlist=49; index_only=48; emerging_pool=20; discard=12
- pool_index_route_distribution: core_pool=52; watchlist=49; index_only=48; emerging_pool=20
- pool_index_count: 152
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 104
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 52
- index_only_pool_count: 48
- aihot_index_only_count: 37
- aihot_core_count: 37
- aihot_daily_index_only_count: 31
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 152
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 35 result(s): missing_ai_anchor_in_result=12; noise_term:career=9; job_or_salary_page=7; broad_list_or_market_report=4; directory_or_search_page=1; noise_term:avatar=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_case=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=99; media=27; news=12; official=9; developer=6; product=5; builder=2; newsletter=2; community=1; funding=1
- front_signal_sab_source_count: S=4; A=9; B=26; total=39
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=58; no-url-summary-only=31; fetched-readable-text-body-visible-text=28; fetched-readable-text-main=14; summary-only-low-readable-body=10; fetched-readable-text-json-ld=9; blocked-http-403=7; fetched-readable-text-article=7
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 105
- S: 19
- A: 39
- C: 1

## Evidence Object Type Distribution

- case_or_customer: 46
- event: 60
- changelog_or_release: 3
- regulatory_or_procurement: 7
- pricing_change: 2
- supporting_article: 9
- research_or_report: 8
- community_feedback: 3
- official_index_or_directory: 23
- marketplace_listing: 1
- event_on_official_page: 2

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 23
- 开发者生态信号 (developer-ecosystem-signal): 34
- 技术迭代信号 (technical-iteration-signal): 43
- 资本市场信号 (capital-market-signal): 7
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 2
- AI Hardware investment and financing (ai-hardware-investment-signal): 1
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 5
- 早期信号 (early-direction-signal): 14
- uncategorized (uncategorized): 26
- 外围探索信号 (outside-core-exploration): 9

## Keyword Group Distribution

- mature-commercial-signal: 21
- developer-ecosystem-signal: 38
- technical-iteration-signal: 42
- capital-market-signal: 7
- enterprise-ai-implementation-signal: 2
- ai-hardware-investment-signal: 1
- ai-hardware-scenario-service-signal: 5
- early-direction-signal: 13
- uncategorized: 26
- outside-core-exploration: 9

## Keyword Search Path Distribution

- capital_startup: 4
- fde_implementation: 2
- ai_hardware_original: 6
- developer_ecosystem: 3
- industry_landing: 2
- a_media_gdelt: 3

## Keyword Search Intent Distribution

- find_startups: 6
- find_customer_case: 8
- find_original_source: 3
- find_market_trend: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
