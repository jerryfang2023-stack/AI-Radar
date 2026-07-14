# 2026-07-14 Guanlan Daily Monitor Log

- generated_at: 2026-07-14T01:56:51.923Z
- raw_count: 122
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 12
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 265 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 19 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 145 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 1 duplicate candidate(s) before Raw writing.; Adaptive Raw fetch stopped with 115/150 active candidate(s): candidate pool exhausted.; Historical Raw dedupe removed 19 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 1 fetched hash duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 15
- recovered_failed_sources_count: 12
- unrecovered_failed_sources_count: 3
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-14/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-14/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-14/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-14/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 8198
- historical_duplicates_removed_before_fetch: 265
- historical_duplicates_removed_after_fetch: 145
- same_run_duplicates_removed_after_fetch: 1
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 261
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 261
- adaptive_raw_expansion_candidates: 0
- aihot_count: 59
- keyword_search_count: 40
- keyword_search_non_community_count: 40
- keyword_search_path_distribution: ai_hardware_original=11; capital_startup=10; official_original=6; a_media_gdelt=4; industry_landing=4; developer_ecosystem=3; fde_implementation=2
- keyword_search_intent_distribution: find_startups=15; find_original_source=12; find_customer_case=9; find_market_trend=4
- source_distribution: aihot=59; keyword-search=40; rss-feed=18; gdelt=5
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 37
- enterprise_ai_transformation_stage_distribution: platform_enablement=19; pilot=6; production_rollout=6; ai_transformation=4; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=59; keyword-search=40; rss-feed=18; gdelt=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: mature-commercial-signal=21; technical-iteration-signal=20; uncategorized=18; developer-ecosystem-signal=17; early-direction-signal=11; ai-hardware-trend-innovation-signal=8; outside-core-exploration=7; targeted-pool-gap-refill=7; capital-market-signal=6; enterprise-ai-implementation-signal=4; ai-hardware-scenario-service-signal=2; ai-hardware-investment-signal=1
- theme_distribution: mature-commercial-signal=21; technical-iteration-signal=21; uncategorized=18; developer-ecosystem-signal=13; early-direction-signal=11; capital-market-signal=9; ai-hardware-trend-innovation-signal=8; outside-core-exploration=7; targeted-pool-gap-refill=7; enterprise-ai-implementation-signal=4; ai-hardware-scenario-service-signal=2; ai-hardware-investment-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=51; case_or_customer=37; official_index_or_directory=10; research_or_report=9; regulatory_or_procurement=6; changelog_or_release=3; supporting_article=2; community_feedback=1; event_on_official_page=1; pricing_change=1; repo_readme_or_index=1
- pool_route_distribution: core_pool=43; watchlist=39; index_only=28; emerging_pool=18; discard=10
- pool_index_route_distribution: core_pool=43; watchlist=39; index_only=28; emerging_pool=18
- pool_index_count: 112
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 84
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 41
- index_only_pool_count: 28
- aihot_index_only_count: 22
- aihot_core_count: 24
- aihot_daily_index_only_count: 12
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5; important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 112
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 31 result(s): missing_ai_anchor_in_result=13; job_or_salary_page=6; noise_term:career=6; broad_list_or_market_report=3; noise_term:hiring=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS tigera-blog: HTTP 415; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 6 result(s): missing_ai_anchor_in_result=2; noise_term:hiring=2; directory_or_search_page=1; noise_term:career=1; targeted pool/core refill cycle 1 added 7 item(s) for important_case=2/5; important_funding=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=65; media=20; news=15; product=6; developer=5; builder=3; official=3; operators=2; industry=1; marketplace=1; newsletter=1
- front_signal_sab_source_count: S=1; A=2; B=7; total=10
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=49; fetched-readable-text-main=19; fetched-readable-text-body-visible-text=16; no-url-summary-only=12; blocked-http-403=9; fetched-readable-text-article=8; fetched-readable-text-json-ld=7; http-429-fallback-text=1; summary-only-low-readable-body=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 35
- B: 71
- S: 14
- C: 2

## Evidence Object Type Distribution

- event: 51
- changelog_or_release: 3
- regulatory_or_procurement: 6
- research_or_report: 9
- case_or_customer: 37
- community_feedback: 1
- supporting_article: 2
- repo_readme_or_index: 1
- event_on_official_page: 1
- official_index_or_directory: 10
- pricing_change: 1

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 21
- 早期信号 (early-direction-signal): 11
- 开发者生态信号 (developer-ecosystem-signal): 13
- 技术迭代信号 (technical-iteration-signal): 21
- 外围探索信号 (outside-core-exploration): 7
- 资本市场信号 (capital-market-signal): 9
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 4
- AI Hardware investment and financing (ai-hardware-investment-signal): 1
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 2
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 8
- targeted-pool-gap-refill (targeted-pool-gap-refill): 7
- uncategorized (uncategorized): 18

## Keyword Group Distribution

- mature-commercial-signal: 21
- early-direction-signal: 11
- developer-ecosystem-signal: 17
- technical-iteration-signal: 20
- outside-core-exploration: 7
- capital-market-signal: 6
- enterprise-ai-implementation-signal: 4
- ai-hardware-investment-signal: 1
- ai-hardware-scenario-service-signal: 2
- ai-hardware-trend-innovation-signal: 8
- targeted-pool-gap-refill: 7
- uncategorized: 18

## Keyword Search Path Distribution

- capital_startup: 10
- fde_implementation: 2
- ai_hardware_original: 11
- industry_landing: 4
- developer_ecosystem: 3
- a_media_gdelt: 4
- official_original: 6

## Keyword Search Intent Distribution

- find_startups: 15
- find_customer_case: 9
- find_original_source: 12
- find_market_trend: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
