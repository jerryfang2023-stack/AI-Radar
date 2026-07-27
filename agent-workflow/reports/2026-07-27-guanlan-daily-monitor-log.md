# 2026-07-27 Guanlan Daily Monitor Log

- generated_at: 2026-07-27T03:17:11.173Z
- raw_count: 73
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 6
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 270 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 11 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 67 fetched hash duplicate candidate(s) before Raw writing.; Adaptive Raw fetch stopped with 69/150 active candidate(s): candidate pool exhausted.; Historical Raw dedupe removed 21 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 1 fetched hash duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 8
- recovered_failed_sources_count: 7
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-27/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-27/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-27/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-27/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 10117
- historical_duplicates_removed_before_fetch: 270
- historical_duplicates_removed_after_fetch: 67
- same_run_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 136
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 136
- adaptive_raw_expansion_candidates: 0
- aihot_count: 33
- keyword_search_count: 32
- keyword_search_non_community_count: 32
- keyword_search_path_distribution: official_original=12; industry_landing=6; ai_hardware_original=4; fde_implementation=4; capital_startup=3; procurement_marketplace=2; a_media_gdelt=1
- keyword_search_intent_distribution: find_startups=13; find_customer_case=11; find_original_source=7; find_market_trend=1
- source_distribution: aihot=33; keyword-search=32; rss-feed=7; gdelt=1
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 33
- enterprise_ai_transformation_stage_distribution: platform_enablement=13; production_rollout=8; ai_transformation=4; pilot=4; org_build=3; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=33; keyword-search=32; rss-feed=7; gdelt=1
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=17; mature-commercial-signal=13; technical-iteration-signal=8; uncategorized=7; early-direction-signal=6; capital-market-signal=5; enterprise-ai-implementation-signal=4; outside-core-exploration=4; targeted-pool-gap-refill=4; ai-hardware-scenario-service-signal=3; ai-hardware-investment-signal=2
- theme_distribution: developer-ecosystem-signal=16; mature-commercial-signal=13; technical-iteration-signal=9; uncategorized=7; early-direction-signal=6; capital-market-signal=5; enterprise-ai-implementation-signal=4; outside-core-exploration=4; targeted-pool-gap-refill=4; ai-hardware-scenario-service-signal=3; ai-hardware-investment-signal=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=28; event=20; regulatory_or_procurement=7; changelog_or_release=5; official_index_or_directory=5; community_feedback=3; research_or_report=2; supporting_article=2; repo_readme_or_index=1
- pool_route_distribution: core_pool=35; watchlist=17; index_only=15; emerging_pool=12; discard=3
- pool_index_route_distribution: core_pool=35; watchlist=17; index_only=15; emerging_pool=12
- pool_index_count: 70
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 55
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 20
- index_only_pool_count: 15
- aihot_index_only_count: 12
- aihot_core_count: 17
- aihot_daily_index_only_count: 6
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5; important_funding=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 70
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 25 result(s): missing_ai_anchor_in_result=18; broad_list_or_market_report=4; noise_term:career=1; noise_term:hiring=1; noise_term:meme=1; targeted-refill pre-gate filtered 3 result(s): missing_ai_anchor_in_result=3; targeted pool/core refill cycle 1 added 4 item(s) for important_case=3/5; important_funding=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=46; media=6; operators=6; developer=5; news=5; builder=1; funding=1; industry=1; product=1; research=1
- front_signal_sab_source_count: S=1; A=1; B=15; total=17
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=22; fetched-readable-text-body-visible-text=16; fetched-readable-text-main=15; fetched-readable-text-article=6; no-url-summary-only=6; fetched-readable-text-json-ld=4; blocked-http-403=2; blocked-http-401=1; fetched-readable-text-meta-description=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 12
- C: 6
- B: 50
- S: 5

## Evidence Object Type Distribution

- regulatory_or_procurement: 7
- event: 20
- case_or_customer: 28
- changelog_or_release: 5
- community_feedback: 3
- research_or_report: 2
- repo_readme_or_index: 1
- supporting_article: 2
- official_index_or_directory: 5

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 9
- 开发者生态信号 (developer-ecosystem-signal): 16
- 资本市场信号 (capital-market-signal): 5
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 4
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- 早期信号 (early-direction-signal): 6
- 成熟信号 (mature-commercial-signal): 13
- targeted-pool-gap-refill (targeted-pool-gap-refill): 4
- uncategorized (uncategorized): 7
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 3
- 外围探索信号 (outside-core-exploration): 4

## Keyword Group Distribution

- technical-iteration-signal: 8
- developer-ecosystem-signal: 17
- capital-market-signal: 5
- enterprise-ai-implementation-signal: 4
- ai-hardware-investment-signal: 2
- early-direction-signal: 6
- mature-commercial-signal: 13
- targeted-pool-gap-refill: 4
- uncategorized: 7
- ai-hardware-scenario-service-signal: 3
- outside-core-exploration: 4

## Keyword Search Path Distribution

- procurement_marketplace: 2
- fde_implementation: 4
- ai_hardware_original: 4
- official_original: 12
- industry_landing: 6
- a_media_gdelt: 1
- capital_startup: 3

## Keyword Search Intent Distribution

- find_startups: 13
- find_original_source: 7
- find_customer_case: 11
- find_market_trend: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
