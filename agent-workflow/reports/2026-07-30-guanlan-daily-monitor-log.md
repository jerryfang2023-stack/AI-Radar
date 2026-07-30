# 2026-07-30 Guanlan Daily Monitor Log

- generated_at: 2026-07-30T03:09:47.475Z
- raw_count: 179
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
- provider_fallback_notes: Historical Raw dedupe removed 183 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 41 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 116 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 3 duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 23 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 10
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-30/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-07-30/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-07-30/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-07-30/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 10505
- historical_duplicates_removed_before_fetch: 183
- historical_duplicates_removed_after_fetch: 116
- same_run_duplicates_removed_after_fetch: 3
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 360
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 80
- keyword_search_count: 65
- keyword_search_non_community_count: 65
- keyword_search_path_distribution: official_original=13; ai_hardware_original=10; procurement_marketplace=10; a_media_gdelt=7; capital_startup=7; industry_landing=7; developer_ecosystem=6; fde_implementation=5
- keyword_search_intent_distribution: find_startups=23; find_original_source=21; find_customer_case=14; find_market_trend=7
- source_distribution: aihot=80; keyword-search=65; rss-feed=28; gdelt=6
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 76
- enterprise_ai_transformation_stage_distribution: platform_enablement=33; production_rollout=18; ai_transformation=12; pilot=8; org_build=3; procurement=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: aihot=80; keyword-search=65; rss-feed=28; gdelt=6
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=43; mature-commercial-signal=28; developer-ecosystem-signal=26; uncategorized=26; early-direction-signal=10; enterprise-ai-implementation-signal=10; capital-market-signal=9; outside-core-exploration=9; targeted-pool-gap-refill=8; ai-hardware-scenario-service-signal=5; ai-hardware-trend-innovation-signal=3; ai-hardware-investment-signal=2
- theme_distribution: technical-iteration-signal=45; mature-commercial-signal=28; uncategorized=26; developer-ecosystem-signal=20; early-direction-signal=12; capital-market-signal=11; enterprise-ai-implementation-signal=10; outside-core-exploration=9; targeted-pool-gap-refill=8; ai-hardware-scenario-service-signal=5; ai-hardware-trend-innovation-signal=3; ai-hardware-investment-signal=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=64; event=56; official_index_or_directory=18; regulatory_or_procurement=15; research_or_report=7; supporting_article=5; changelog_or_release=4; community_feedback=4; pricing_change=3; event_on_official_page=2; repo_readme_or_index=1
- pool_route_distribution: watchlist=72; index_only=46; core_pool=42; emerging_pool=37; discard=14
- pool_index_route_distribution: watchlist=72; index_only=46; core_pool=42; emerging_pool=37
- pool_index_count: 165
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 119
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 77
- index_only_pool_count: 46
- aihot_index_only_count: 36
- aihot_core_count: 25
- aihot_daily_index_only_count: 20
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5; important_funding=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 165
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 29 result(s): broad_list_or_market_report=10; noise_term:hiring=9; missing_ai_anchor_in_result=6; noise_term:definition=2; social_or_profile_source=2; targeted-refill pre-gate filtered 6 result(s): broad_list_or_market_report=3; missing_ai_anchor_in_result=2; noise_term:hiring=1; targeted pool/core refill cycle 1 added 8 item(s) for important_case=3/5; important_funding=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=105; media=25; news=20; developer=8; official=5; product=4; operators=3; research=3; builder=2; industry=2; domestic_vendor=1; newsletter=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=64; fetched-readable-text-main=36; fetched-readable-text-body-visible-text=23; no-url-summary-only=20; fetched-readable-text-json-ld=13; blocked-http-403=9; fetched-readable-text-article=8; blocked-http-401=4; fetch-failed-fallback-visible-text=1; summary-only-low-readable-body=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 47
- B: 117
- C: 3
- S: 12

## Evidence Object Type Distribution

- event: 56
- case_or_customer: 64
- research_or_report: 7
- regulatory_or_procurement: 15
- changelog_or_release: 4
- supporting_article: 5
- official_index_or_directory: 18
- repo_readme_or_index: 1
- event_on_official_page: 2
- pricing_change: 3
- community_feedback: 4

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 9
- 成熟信号 (mature-commercial-signal): 28
- 开发者生态信号 (developer-ecosystem-signal): 20
- 技术迭代信号 (technical-iteration-signal): 45
- 资本市场信号 (capital-market-signal): 11
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 10
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 5
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 3
- targeted-pool-gap-refill (targeted-pool-gap-refill): 8
- 早期信号 (early-direction-signal): 12
- uncategorized (uncategorized): 26

## Keyword Group Distribution

- outside-core-exploration: 9
- mature-commercial-signal: 28
- developer-ecosystem-signal: 26
- technical-iteration-signal: 43
- capital-market-signal: 9
- enterprise-ai-implementation-signal: 10
- ai-hardware-investment-signal: 2
- ai-hardware-scenario-service-signal: 5
- ai-hardware-trend-innovation-signal: 3
- targeted-pool-gap-refill: 8
- early-direction-signal: 10
- uncategorized: 26

## Keyword Search Path Distribution

- procurement_marketplace: 10
- ai_hardware_original: 10
- fde_implementation: 5
- capital_startup: 7
- official_original: 13
- industry_landing: 7
- a_media_gdelt: 7
- developer_ecosystem: 6

## Keyword Search Intent Distribution

- find_startups: 23
- find_original_source: 21
- find_customer_case: 14
- find_market_trend: 7

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
