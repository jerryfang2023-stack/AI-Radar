# 2026-07-15 Guanlan Daily Monitor Log

- generated_at: 2026-07-15T04:28:38.343Z
- raw_count: 171
- aihot_mode: source-artifacts
- aihot_since:
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 25
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 233 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 30 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 121 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 2 duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 18 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 11
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 2
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-15/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-15/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-15/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-15/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 8320
- historical_duplicates_removed_before_fetch: 233
- historical_duplicates_removed_after_fetch: 121
- same_run_duplicates_removed_after_fetch: 2
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 332
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 107
- keyword_search_count: 35
- keyword_search_non_community_count: 35
- keyword_search_path_distribution: capital_startup=10; official_original=8; ai_hardware_original=7; developer_ecosystem=5; fde_implementation=2; procurement_marketplace=2; industry_landing=1
- keyword_search_intent_distribution: find_startups=20; find_original_source=9; find_customer_case=6
- source_distribution: aihot=107; keyword-search=35; rss-feed=25; gdelt=4
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 46
- enterprise_ai_transformation_stage_distribution: platform_enablement=25; pilot=8; production_rollout=7; ai_transformation=3; org_build=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=107; keyword-search=35; rss-feed=25; gdelt=4
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=45; developer-ecosystem-signal=30; uncategorized=25; mature-commercial-signal=21; early-direction-signal=16; capital-market-signal=11; outside-core-exploration=9; targeted-pool-gap-refill=4; ai-hardware-investment-signal=3; ai-hardware-trend-innovation-signal=3; ai-hardware-scenario-service-signal=2; enterprise-ai-implementation-signal=2
- theme_distribution: technical-iteration-signal=46; uncategorized=25; developer-ecosystem-signal=24; early-direction-signal=21; mature-commercial-signal=21; capital-market-signal=11; outside-core-exploration=9; targeted-pool-gap-refill=4; ai-hardware-investment-signal=3; ai-hardware-trend-innovation-signal=3; ai-hardware-scenario-service-signal=2; enterprise-ai-implementation-signal=2
- theme_concentration_warning: none
- evidence_object_type_distribution: event=57; case_or_customer=43; regulatory_or_procurement=20; official_index_or_directory=19; supporting_article=10; research_or_report=7; changelog_or_release=6; community_feedback=4; event_on_official_page=3; pricing_change=1; repo_readme_or_index=1
- pool_route_distribution: watchlist=64; index_only=46; core_pool=44; emerging_pool=26; discard=14
- pool_index_route_distribution: watchlist=64; index_only=46; core_pool=44; emerging_pool=26
- pool_index_count: 157
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 111
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 67
- index_only_pool_count: 46
- aihot_index_only_count: 36
- aihot_core_count: 30
- aihot_daily_index_only_count: 25
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5; important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 157
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 30 result(s): missing_ai_anchor_in_result=16; job_or_salary_page=6; noise_term:career=5; broad_list_or_market_report=1; noise_term:hiring=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 2 result(s): noise_term:avatar=1; noise_term:hiring=1; targeted pool/core refill cycle 1 added 4 item(s) for important_case=2/5; important_funding=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=91; media=26; news=16; developer=10; official=10; operators=7; product=5; builder=2; funding=2; newsletter=2
- front_signal_sab_source_count: S=2; A=5; B=17; total=24
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=61; no-url-summary-only=26; fetched-readable-text-body-visible-text=24; fetched-readable-text-main=23; summary-only-low-readable-body=17; fetched-readable-text-json-ld=8; blocked-http-403=5; fetched-readable-text-article=5; blocked-http-401=1; http-502-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 42
- B: 102
- C: 7
- S: 20

## Evidence Object Type Distribution

- regulatory_or_procurement: 20
- event: 57
- community_feedback: 4
- case_or_customer: 43
- changelog_or_release: 6
- repo_readme_or_index: 1
- supporting_article: 10
- pricing_change: 1
- research_or_report: 7
- official_index_or_directory: 19
- event_on_official_page: 3

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 21
- 早期信号 (early-direction-signal): 21
- 外围探索信号 (outside-core-exploration): 9
- 开发者生态信号 (developer-ecosystem-signal): 24
- 技术迭代信号 (technical-iteration-signal): 46
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 2
- AI Hardware investment and financing (ai-hardware-investment-signal): 3
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 2
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 3
- 资本市场信号 (capital-market-signal): 11
- targeted-pool-gap-refill (targeted-pool-gap-refill): 4
- uncategorized (uncategorized): 25

## Keyword Group Distribution

- mature-commercial-signal: 21
- early-direction-signal: 16
- outside-core-exploration: 9
- developer-ecosystem-signal: 30
- technical-iteration-signal: 45
- enterprise-ai-implementation-signal: 2
- ai-hardware-investment-signal: 3
- ai-hardware-scenario-service-signal: 2
- ai-hardware-trend-innovation-signal: 3
- capital-market-signal: 11
- targeted-pool-gap-refill: 4
- uncategorized: 25

## Keyword Search Path Distribution

- fde_implementation: 2
- ai_hardware_original: 7
- capital_startup: 10
- official_original: 8
- developer_ecosystem: 5
- industry_landing: 1
- procurement_marketplace: 2

## Keyword Search Intent Distribution

- find_customer_case: 6
- find_startups: 20
- find_original_source: 9

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
