# 2026-07-11 Guanlan Daily Monitor Log

- generated_at: 2026-07-11T04:06:44.197Z
- raw_count: 85
- aihot_mode: source-artifacts
- aihot_since:
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 14
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 544 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 18 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 214 fetched hash duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 3 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 57 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 1 fetched hash duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 56 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 1 fetched hash duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 25
- recovered_failed_sources_count: 23
- unrecovered_failed_sources_count: 2
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-11/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-11/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-11/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-11/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 7724
- historical_duplicates_removed_before_fetch: 544
- historical_duplicates_removed_after_fetch: 214
- raw_dedupe_buffer: 140
- aihot_count: 49
- keyword_search_count: 25
- keyword_search_non_community_count: 25
- keyword_search_path_distribution: official_original=12; capital_startup=4; developer_ecosystem=2; industry_landing=2; procurement_marketplace=2; a_media_gdelt=1; ai_hardware_original=1; fde_implementation=1
- keyword_search_intent_distribution: find_original_source=15; find_startups=6; find_customer_case=3; find_market_trend=1
- source_distribution: aihot=49; keyword-search=25; rss-feed=9; gdelt=2
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 28
- enterprise_ai_transformation_stage_distribution: platform_enablement=10; production_rollout=8; ai_transformation=6; pilot=3; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=49; keyword-search=25; rss-feed=9; gdelt=2
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=21; technical-iteration-signal=18; mature-commercial-signal=15; targeted-pool-gap-refill=9; uncategorized=9; early-direction-signal=6; capital-market-signal=2; outside-core-exploration=2; ai-hardware-investment-signal=1; ai-hardware-scenario-service-signal=1; enterprise-ai-implementation-signal=1
- theme_distribution: developer-ecosystem-signal=19; technical-iteration-signal=19; mature-commercial-signal=15; targeted-pool-gap-refill=9; uncategorized=9; early-direction-signal=7; capital-market-signal=2; outside-core-exploration=2; ai-hardware-investment-signal=1; ai-hardware-scenario-service-signal=1; enterprise-ai-implementation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=27; case_or_customer=26; official_index_or_directory=14; regulatory_or_procurement=6; supporting_article=4; changelog_or_release=3; event_on_official_page=2; research_or_report=2; community_feedback=1
- pool_route_distribution: watchlist=33; core_pool=22; index_only=22; emerging_pool=9; discard=8; user_feedback_pool=2
- pool_index_route_distribution: watchlist=33; core_pool=22; index_only=22; emerging_pool=9; user_feedback_pool=2
- pool_index_count: 77
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 55
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 33
- index_only_pool_count: 22
- aihot_index_only_count: 21
- aihot_core_count: 10
- aihot_daily_index_only_count: 14
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 77
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 26 result(s): missing_ai_anchor_in_result=13; job_or_salary_page=5; noise_term:career=5; broad_list_or_market_report=1; noise_term:hiring=1; noise_term:jobs at=1; source-artifact rss: RSS tigera-blog: HTTP 415; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 1 result(s): broad_list_or_market_report=1; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; routed_pool=47/60; core_pool=21/30; core_non_large=11/20; targeted-refill pre-gate filtered 7 result(s): broad_list_or_market_report=2; missing_ai_anchor_in_result=2; directory_or_search_page=1; noise_term:avatar=1; noise_term:career=1; targeted raw-volume refill cycle 1 added 9 item(s) for raw_count=85/150; targeted-refill pre-gate filtered 7 result(s): broad_list_or_market_report=2; missing_ai_anchor_in_result=2; directory_or_search_page=1; noise_term:avatar=1; noise_term:career=1; targeted raw-volume refill cycle 2 added 0 item(s) for raw_count=85/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=53; media=15; developer=6; news=3; operators=3; funding=1; industry=1; marketplace=1; official=1; product=1
- front_signal_sab_source_count: S=1; A=5; B=3; total=9
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=18; fetched-readable-text-main=16; no-url-summary-only=14; fetched-readable-text-body-visible-text=13; summary-only-low-readable-body=10; blocked-http-403=6; fetched-readable-text-json-ld=6; fetched-readable-text-article=2
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 18
- B: 60
- S: 4
- C: 3

## Evidence Object Type Distribution

- event: 27
- regulatory_or_procurement: 6
- official_index_or_directory: 14
- changelog_or_release: 3
- case_or_customer: 26
- research_or_report: 2
- event_on_official_page: 2
- community_feedback: 1
- supporting_article: 4

## Theme Distribution

- 早期信号 (early-direction-signal): 7
- 成熟信号 (mature-commercial-signal): 15
- 开发者生态信号 (developer-ecosystem-signal): 19
- 技术迭代信号 (technical-iteration-signal): 19
- 资本市场信号 (capital-market-signal): 2
- AI Hardware investment and financing (ai-hardware-investment-signal): 1
- targeted-pool-gap-refill (targeted-pool-gap-refill): 9
- uncategorized (uncategorized): 9
- 外围探索信号 (outside-core-exploration): 2
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 1
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 1

## Keyword Group Distribution

- early-direction-signal: 6
- mature-commercial-signal: 15
- developer-ecosystem-signal: 21
- technical-iteration-signal: 18
- capital-market-signal: 2
- ai-hardware-investment-signal: 1
- targeted-pool-gap-refill: 9
- uncategorized: 9
- outside-core-exploration: 2
- enterprise-ai-implementation-signal: 1
- ai-hardware-scenario-service-signal: 1

## Keyword Search Path Distribution

- official_original: 12
- ai_hardware_original: 1
- procurement_marketplace: 2
- industry_landing: 2
- a_media_gdelt: 1
- developer_ecosystem: 2
- capital_startup: 4
- fde_implementation: 1

## Keyword Search Intent Distribution

- find_startups: 6
- find_original_source: 15
- find_customer_case: 3
- find_market_trend: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
