# 2026-07-21 Guanlan Daily Monitor Log

- generated_at: 2026-07-21T01:26:26.156Z
- raw_count: 139
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 20
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 264 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 21 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 123 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 5 duplicate candidate(s) before Raw writing.; Adaptive Raw fetch stopped with 138/150 active candidate(s): candidate pool exhausted.; Historical Raw dedupe removed 14 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 10
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-21/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-21/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-21/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-21/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 9185
- historical_duplicates_removed_before_fetch: 264
- historical_duplicates_removed_after_fetch: 123
- same_run_duplicates_removed_after_fetch: 5
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 266
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 266
- adaptive_raw_expansion_candidates: 0
- aihot_count: 93
- keyword_search_count: 24
- keyword_search_non_community_count: 24
- keyword_search_path_distribution: capital_startup=8; official_original=5; ai_hardware_original=4; developer_ecosystem=3; a_media_gdelt=2; fde_implementation=1; industry_landing=1
- keyword_search_intent_distribution: find_startups=11; find_customer_case=7; find_original_source=4; find_market_trend=2
- source_distribution: aihot=93; keyword-search=24; rss-feed=21; gdelt=1
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 31
- enterprise_ai_transformation_stage_distribution: platform_enablement=17; pilot=5; production_rollout=5; org_build=4
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=93; keyword-search=24; rss-feed=21; gdelt=1
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=37; developer-ecosystem-signal=33; uncategorized=19; mature-commercial-signal=14; early-direction-signal=13; outside-core-exploration=9; capital-market-signal=7; ai-hardware-scenario-service-signal=5; enterprise-ai-implementation-signal=1; targeted-pool-gap-refill=1
- theme_distribution: technical-iteration-signal=39; developer-ecosystem-signal=30; uncategorized=19; mature-commercial-signal=15; early-direction-signal=13; outside-core-exploration=9; capital-market-signal=7; ai-hardware-scenario-service-signal=5; enterprise-ai-implementation-signal=1; targeted-pool-gap-refill=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=52; case_or_customer=40; official_index_or_directory=16; regulatory_or_procurement=11; supporting_article=8; changelog_or_release=5; research_or_report=3; event_on_official_page=2; pricing_change=1; repo_readme_or_index=1
- pool_route_distribution: core_pool=57; watchlist=43; index_only=31; emerging_pool=28; discard=5
- pool_index_route_distribution: core_pool=57; watchlist=43; index_only=31; emerging_pool=28
- pool_index_count: 134
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 103
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 46
- index_only_pool_count: 31
- aihot_index_only_count: 27
- aihot_core_count: 32
- aihot_daily_index_only_count: 20
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_funding=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 134
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 35 result(s): noise_term:career=13; missing_ai_anchor_in_result=11; job_or_salary_page=7; broad_list_or_market_report=2; noise_term:avatar=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 2 result(s): noise_term:hiring=1; social_or_profile_source=1; targeted pool/core refill cycle 1 added 1 item(s) for important_funding=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=80; media=19; news=11; developer=6; operators=6; official=5; builder=4; funding=3; product=2; marketplace=1; newsletter=1; research=1
- front_signal_sab_source_count: S=3; A=10; B=21; total=34
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=60; fetched-readable-text-body-visible-text=26; no-url-summary-only=20; fetched-readable-text-main=16; summary-only-low-readable-body=7; fetched-readable-text-json-ld=5; blocked-http-403=3; fetched-readable-text-article=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 90
- A: 31
- S: 12
- C: 6

## Evidence Object Type Distribution

- changelog_or_release: 5
- regulatory_or_procurement: 11
- event: 52
- case_or_customer: 40
- event_on_official_page: 2
- supporting_article: 8
- research_or_report: 3
- repo_readme_or_index: 1
- pricing_change: 1
- official_index_or_directory: 16

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 15
- 技术迭代信号 (technical-iteration-signal): 39
- 早期信号 (early-direction-signal): 13
- 开发者生态信号 (developer-ecosystem-signal): 30
- 资本市场信号 (capital-market-signal): 7
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 1
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 5
- targeted-pool-gap-refill (targeted-pool-gap-refill): 1
- uncategorized (uncategorized): 19
- 外围探索信号 (outside-core-exploration): 9

## Keyword Group Distribution

- mature-commercial-signal: 14
- technical-iteration-signal: 37
- early-direction-signal: 13
- developer-ecosystem-signal: 33
- capital-market-signal: 7
- enterprise-ai-implementation-signal: 1
- ai-hardware-scenario-service-signal: 5
- targeted-pool-gap-refill: 1
- uncategorized: 19
- outside-core-exploration: 9

## Keyword Search Path Distribution

- capital_startup: 8
- fde_implementation: 1
- ai_hardware_original: 4
- official_original: 5
- a_media_gdelt: 2
- developer_ecosystem: 3
- industry_landing: 1

## Keyword Search Intent Distribution

- find_startups: 11
- find_original_source: 4
- find_customer_case: 7
- find_market_trend: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
