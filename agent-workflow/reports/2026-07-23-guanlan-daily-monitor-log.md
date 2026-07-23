# 2026-07-23 Guanlan Daily Monitor Log

- generated_at: 2026-07-23T03:52:05.744Z
- raw_count: 163
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 24
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 225 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 34 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 126 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 6 duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 9 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 11
- recovered_failed_sources_count: 10
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-23/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-23/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-23/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-23/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 9488
- historical_duplicates_removed_before_fetch: 225
- historical_duplicates_removed_after_fetch: 126
- same_run_duplicates_removed_after_fetch: 6
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 371
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 92
- keyword_search_count: 39
- keyword_search_non_community_count: 39
- keyword_search_path_distribution: ai_hardware_original=10; capital_startup=9; official_original=9; a_media_gdelt=3; developer_ecosystem=3; fde_implementation=2; procurement_marketplace=2; industry_landing=1
- keyword_search_intent_distribution: find_startups=17; find_customer_case=13; find_original_source=6; find_market_trend=3
- source_distribution: aihot=92; keyword-search=39; rss-feed=27; gdelt=5
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 50
- enterprise_ai_transformation_stage_distribution: platform_enablement=23; production_rollout=10; pilot=8; org_build=5; ai_transformation=3; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=92; keyword-search=39; rss-feed=27; gdelt=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=32; technical-iteration-signal=31; uncategorized=21; mature-commercial-signal=19; early-direction-signal=18; capital-market-signal=12; outside-core-exploration=11; ai-hardware-scenario-service-signal=9; targeted-pool-gap-refill=5; ai-hardware-investment-signal=2; enterprise-ai-implementation-signal=2; ai-hardware-trend-innovation-signal=1
- theme_distribution: technical-iteration-signal=32; developer-ecosystem-signal=28; uncategorized=21; early-direction-signal=20; mature-commercial-signal=19; capital-market-signal=13; outside-core-exploration=11; ai-hardware-scenario-service-signal=9; targeted-pool-gap-refill=5; ai-hardware-investment-signal=2; enterprise-ai-implementation-signal=2; ai-hardware-trend-innovation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=62; case_or_customer=60; official_index_or_directory=18; changelog_or_release=4; regulatory_or_procurement=4; supporting_article=4; event_on_official_page=3; pricing_change=3; repo_readme_or_index=2; research_or_report=2; community_feedback=1
- pool_route_distribution: watchlist=62; core_pool=49; index_only=41; emerging_pool=27; discard=8
- pool_index_route_distribution: watchlist=62; core_pool=49; index_only=41; emerging_pool=27
- pool_index_count: 155
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 114
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 65
- index_only_pool_count: 41
- aihot_index_only_count: 31
- aihot_core_count: 29
- aihot_daily_index_only_count: 24
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 155
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 34 result(s): noise_term:career=12; missing_ai_anchor_in_result=9; job_or_salary_page=6; broad_list_or_market_report=3; noise_term:affiliate=1; noise_term:compensation=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 1 added 5 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=91; media=21; news=12; developer=10; official=10; operators=7; product=6; builder=4; marketplace=1; newsletter=1
- front_signal_sab_source_count: S=2; A=4; B=21; total=27
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=56; fetched-readable-text-main=33; no-url-summary-only=24; fetched-readable-text-body-visible-text=21; fetched-readable-text-json-ld=9; blocked-http-403=7; fetched-readable-text-article=7; summary-only-low-readable-body=4; http-404-fallback-text=2
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 33
- S: 22
- B: 101
- C: 7

## Evidence Object Type Distribution

- event: 62
- changelog_or_release: 4
- case_or_customer: 60
- regulatory_or_procurement: 4
- repo_readme_or_index: 2
- supporting_article: 4
- pricing_change: 3
- official_index_or_directory: 18
- research_or_report: 2
- event_on_official_page: 3
- community_feedback: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 20
- 开发者生态信号 (developer-ecosystem-signal): 28
- 外围探索信号 (outside-core-exploration): 11
- 成熟信号 (mature-commercial-signal): 19
- 技术迭代信号 (technical-iteration-signal): 32
- 资本市场信号 (capital-market-signal): 13
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 2
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 9
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 1
- targeted-pool-gap-refill (targeted-pool-gap-refill): 5
- uncategorized (uncategorized): 21

## Keyword Group Distribution

- early-direction-signal: 18
- developer-ecosystem-signal: 32
- outside-core-exploration: 11
- mature-commercial-signal: 19
- technical-iteration-signal: 31
- capital-market-signal: 12
- enterprise-ai-implementation-signal: 2
- ai-hardware-investment-signal: 2
- ai-hardware-scenario-service-signal: 9
- ai-hardware-trend-innovation-signal: 1
- targeted-pool-gap-refill: 5
- uncategorized: 21

## Keyword Search Path Distribution

- capital_startup: 9
- fde_implementation: 2
- ai_hardware_original: 10
- procurement_marketplace: 2
- official_original: 9
- industry_landing: 1
- a_media_gdelt: 3
- developer_ecosystem: 3

## Keyword Search Intent Distribution

- find_startups: 17
- find_customer_case: 13
- find_original_source: 6
- find_market_trend: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
