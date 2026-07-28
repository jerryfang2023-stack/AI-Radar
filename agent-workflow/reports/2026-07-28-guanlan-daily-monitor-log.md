# 2026-07-28 Guanlan Daily Monitor Log

- generated_at: 2026-07-28T05:40:18.624Z
- raw_count: 156
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 16
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 236 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 40 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 165 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 1 duplicate candidate(s) before Raw writing.; Adaptive Raw fetch expanded by 26 candidate(s) across 2 batch(es) after post-fetch dedupe left active Raw below 150.; Historical Raw dedupe removed 16 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 1 fetched hash duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 8
- recovered_failed_sources_count: 7
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-28/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-28/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-28/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-28/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 10190
- historical_duplicates_removed_before_fetch: 236
- historical_duplicates_removed_after_fetch: 165
- same_run_duplicates_removed_after_fetch: 1
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 316
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 2
- adaptive_raw_fetched_candidates: 316
- adaptive_raw_expansion_candidates: 26
- aihot_count: 101
- keyword_search_count: 32
- keyword_search_non_community_count: 32
- keyword_search_path_distribution: capital_startup=8; official_original=7; industry_landing=4; procurement_marketplace=4; a_media_gdelt=3; fde_implementation=3; ai_hardware_original=2; developer_ecosystem=1
- keyword_search_intent_distribution: find_startups=14; find_original_source=11; find_customer_case=4; find_market_trend=3
- source_distribution: aihot=101; keyword-search=32; rss-feed=22; gdelt=1
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 43
- enterprise_ai_transformation_stage_distribution: platform_enablement=24; ai_transformation=7; production_rollout=7; pilot=3; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=101; keyword-search=32; rss-feed=22; gdelt=1
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=36; technical-iteration-signal=34; mature-commercial-signal=27; uncategorized=21; early-direction-signal=11; capital-market-signal=6; enterprise-ai-implementation-signal=6; outside-core-exploration=6; targeted-pool-gap-refill=6; ai-hardware-investment-signal=2; ai-hardware-trend-innovation-signal=1
- theme_distribution: developer-ecosystem-signal=34; technical-iteration-signal=34; mature-commercial-signal=27; uncategorized=21; early-direction-signal=12; capital-market-signal=7; enterprise-ai-implementation-signal=6; outside-core-exploration=6; targeted-pool-gap-refill=6; ai-hardware-investment-signal=2; ai-hardware-trend-innovation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=65; case_or_customer=42; official_index_or_directory=12; supporting_article=11; regulatory_or_procurement=9; research_or_report=7; changelog_or_release=3; event_on_official_page=2; pricing_change=2; search_result_or_tool_directory=2; community_feedback=1
- pool_route_distribution: watchlist=59; core_pool=48; index_only=35; emerging_pool=22; discard=10
- pool_index_route_distribution: watchlist=59; core_pool=48; index_only=35; emerging_pool=22
- pool_index_count: 146
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 111
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 63
- index_only_pool_count: 35
- aihot_index_only_count: 27
- aihot_core_count: 34
- aihot_daily_index_only_count: 16
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5; important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 146
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 24 result(s): missing_ai_anchor_in_result=16; broad_list_or_market_report=3; social_or_profile_source=3; noise_term:career=1; noise_term:hiring=1; targeted-refill pre-gate filtered 6 result(s): missing_ai_anchor_in_result=6; targeted pool/core refill cycle 1 added 6 item(s) for important_case=3/5; important_funding=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=100; media=21; news=13; developer=7; official=6; product=5; builder=1; industry=1; newsletter=1; operators=1
- front_signal_sab_source_count: S=5; A=5; B=24; total=34
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=56; fetched-readable-text-main=31; fetched-readable-text-body-visible-text=29; no-url-summary-only=16; summary-only-low-readable-body=8; fetched-readable-text-article=6; fetched-readable-text-json-ld=5; blocked-http-403=4; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 34
- B: 106
- S: 15
- C: 1

## Evidence Object Type Distribution

- event: 65
- case_or_customer: 42
- regulatory_or_procurement: 9
- changelog_or_release: 3
- supporting_article: 11
- community_feedback: 1
- event_on_official_page: 2
- search_result_or_tool_directory: 2
- research_or_report: 7
- pricing_change: 2
- official_index_or_directory: 12

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 34
- 开发者生态信号 (developer-ecosystem-signal): 34
- 成熟信号 (mature-commercial-signal): 27
- 早期信号 (early-direction-signal): 12
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 6
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- 资本市场信号 (capital-market-signal): 7
- targeted-pool-gap-refill (targeted-pool-gap-refill): 6
- 外围探索信号 (outside-core-exploration): 6
- uncategorized (uncategorized): 21
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 1

## Keyword Group Distribution

- technical-iteration-signal: 34
- developer-ecosystem-signal: 36
- mature-commercial-signal: 27
- early-direction-signal: 11
- enterprise-ai-implementation-signal: 6
- ai-hardware-investment-signal: 2
- capital-market-signal: 6
- targeted-pool-gap-refill: 6
- outside-core-exploration: 6
- uncategorized: 21
- ai-hardware-trend-innovation-signal: 1

## Keyword Search Path Distribution

- fde_implementation: 3
- ai_hardware_original: 2
- capital_startup: 8
- official_original: 7
- procurement_marketplace: 4
- industry_landing: 4
- a_media_gdelt: 3
- developer_ecosystem: 1

## Keyword Search Intent Distribution

- find_original_source: 11
- find_startups: 14
- find_customer_case: 4
- find_market_trend: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
