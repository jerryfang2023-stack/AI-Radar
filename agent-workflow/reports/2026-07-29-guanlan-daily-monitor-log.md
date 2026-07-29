# 2026-07-29 Guanlan Daily Monitor Log

- generated_at: 2026-07-29T04:44:17.772Z
- raw_count: 159
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
- provider_fallback_notes: Historical Raw dedupe removed 240 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 35 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 133 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 1 duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 9 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 6
- recovered_failed_sources_count: 6
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-29/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-29/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-29/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-29/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 10346
- historical_duplicates_removed_before_fetch: 240
- historical_duplicates_removed_after_fetch: 133
- same_run_duplicates_removed_after_fetch: 1
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 330
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 94
- keyword_search_count: 34
- keyword_search_non_community_count: 34
- keyword_search_path_distribution: official_original=7; capital_startup=6; fde_implementation=6; ai_hardware_original=5; procurement_marketplace=5; a_media_gdelt=3; industry_landing=2
- keyword_search_intent_distribution: find_startups=12; find_original_source=10; find_customer_case=9; find_market_trend=3
- source_distribution: aihot=94; keyword-search=34; rss-feed=28; gdelt=3
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 50
- enterprise_ai_transformation_stage_distribution: platform_enablement=29; production_rollout=11; ai_transformation=5; pilot=4; org_build=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=94; keyword-search=34; rss-feed=28; gdelt=3
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=35; technical-iteration-signal=35; uncategorized=27; mature-commercial-signal=22; capital-market-signal=10; early-direction-signal=9; enterprise-ai-implementation-signal=9; outside-core-exploration=4; targeted-pool-gap-refill=3; ai-hardware-investment-signal=2; ai-hardware-scenario-service-signal=2; ai-hardware-trend-innovation-signal=1
- theme_distribution: technical-iteration-signal=37; developer-ecosystem-signal=33; uncategorized=27; mature-commercial-signal=22; capital-market-signal=10; early-direction-signal=9; enterprise-ai-implementation-signal=9; outside-core-exploration=4; targeted-pool-gap-refill=3; ai-hardware-investment-signal=2; ai-hardware-scenario-service-signal=2; ai-hardware-trend-innovation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=52; event=51; official_index_or_directory=21; regulatory_or_procurement=12; research_or_report=6; supporting_article=6; repo_readme_or_index=3; changelog_or_release=2; event_on_official_page=2; search_result_or_tool_directory=2; community_feedback=1; pricing_change=1
- pool_route_distribution: core_pool=56; watchlist=50; index_only=40; emerging_pool=26; discard=12
- pool_index_route_distribution: core_pool=56; watchlist=50; index_only=40; emerging_pool=26
- pool_index_count: 147
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 107
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 51
- index_only_pool_count: 40
- aihot_index_only_count: 32
- aihot_core_count: 33
- aihot_daily_index_only_count: 24
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 147
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 15 result(s): missing_ai_anchor_in_result=10; broad_list_or_market_report=3; noise_term:career=1; noise_term:hiring=1; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=5; targeted pool/core refill cycle 1 added 3 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=96; media=17; official=10; news=9; product=8; developer=7; operators=5; builder=4; newsletter=2; industry=1
- front_signal_sab_source_count: S=3; A=2; B=27; total=32
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=58; fetched-readable-text-main=25; no-url-summary-only=24; fetched-readable-text-body-visible-text=21; fetched-readable-text-article=10; fetched-readable-text-json-ld=9; blocked-http-403=7; summary-only-low-readable-body=4; blocked-http-401=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 104
- A: 26
- S: 24
- C: 5

## Evidence Object Type Distribution

- case_or_customer: 52
- event: 51
- repo_readme_or_index: 3
- regulatory_or_procurement: 12
- changelog_or_release: 2
- search_result_or_tool_directory: 2
- supporting_article: 6
- pricing_change: 1
- research_or_report: 6
- official_index_or_directory: 21
- event_on_official_page: 2
- community_feedback: 1

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 22
- 早期信号 (early-direction-signal): 9
- 开发者生态信号 (developer-ecosystem-signal): 33
- 技术迭代信号 (technical-iteration-signal): 37
- 资本市场信号 (capital-market-signal): 10
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 9
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 2
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 1
- targeted-pool-gap-refill (targeted-pool-gap-refill): 3
- uncategorized (uncategorized): 27
- 外围探索信号 (outside-core-exploration): 4

## Keyword Group Distribution

- mature-commercial-signal: 22
- early-direction-signal: 9
- developer-ecosystem-signal: 35
- technical-iteration-signal: 35
- capital-market-signal: 10
- enterprise-ai-implementation-signal: 9
- ai-hardware-investment-signal: 2
- ai-hardware-scenario-service-signal: 2
- ai-hardware-trend-innovation-signal: 1
- targeted-pool-gap-refill: 3
- uncategorized: 27
- outside-core-exploration: 4

## Keyword Search Path Distribution

- capital_startup: 6
- fde_implementation: 6
- ai_hardware_original: 5
- procurement_marketplace: 5
- official_original: 7
- industry_landing: 2
- a_media_gdelt: 3

## Keyword Search Intent Distribution

- find_startups: 12
- find_customer_case: 9
- find_original_source: 10
- find_market_trend: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
