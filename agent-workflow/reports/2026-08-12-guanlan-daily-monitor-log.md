# 2026-08-12 Guanlan Daily Monitor Log

- generated_at: 2026-08-12T04:17:24.982Z
- raw_count: 264
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
- provider_fallback_notes: Search cross-entry dedupe removed 64 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 46 duplicate candidate(s) before Raw writing.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 9
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-12/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-12/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-12/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-12/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 46
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 565
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 45
- keyword_search_count: 103
- keyword_search_non_community_count: 103
- keyword_search_path_distribution: official_original=26; a_media_gdelt=8; procurement_marketplace=8; hardware_oem_odm=7; capital_startup=6; hardware_shipment_deployment=6; industry_landing=6; fde_procurement_contract=5; fde_production_rollout=5; hardware_capacity_fab=5; hardware_product_specs=5; developer_ecosystem=4; fde_customer_case=4; fde_earnings_disclosure=3; hardware_capex=3; hardware_supply_agreement=2
- keyword_search_intent_distribution: find_original_source=44; find_startups=21; find_customer_case=17; find_market_trend=8; find_capacity_capex=5; find_procurement_signal=3; verify_company_action=3; find_hardware_supply=2
- source_distribution: keyword-search=103; rss-feed=84; aihot=45; gdelt=32
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 130
- enterprise_ai_transformation_stage_distribution: platform_enablement=71; production_rollout=22; pilot=20; ai_transformation=7; org_build=6; procurement=4
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=103; rss-feed=84; aihot=45; gdelt=32
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=76; developer-ecosystem-signal=28; mature-commercial-signal=25; technical-iteration-signal=23; targeted-pool-gap-refill=20; capital-market-signal=18; enterprise-ai-implementation-signal=15; early-direction-signal=12; ai-hardware-scenario-service-signal=11; ai-hardware-trend-innovation-signal=10; outside-core-exploration=10; ai-hardware-investment-signal=7; china-local-project=3; china-policy-regulation=3; china-startup-funding=3
- theme_distribution: uncategorized=76; mature-commercial-signal=27; developer-ecosystem-signal=24; technical-iteration-signal=24; targeted-pool-gap-refill=20; capital-market-signal=18; enterprise-ai-implementation-signal=15; early-direction-signal=13; ai-hardware-scenario-service-signal=11; ai-hardware-trend-innovation-signal=10; outside-core-exploration=10; ai-hardware-investment-signal=7; china-local-project=3; china-policy-regulation=3; china-startup-funding=3
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=100; event=100; regulatory_or_procurement=19; official_index_or_directory=13; supporting_article=11; research_or_report=7; changelog_or_release=6; pricing_change=3; event_on_official_page=2; search_result_or_tool_directory=2; ecosystem_package_or_model_index=1
- pool_route_distribution: watchlist=143; index_only=48; core_pool=40; emerging_pool=40; discard=28
- pool_index_route_distribution: watchlist=143; index_only=48; core_pool=40; emerging_pool=40
- pool_index_count: 236
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 188
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 148
- index_only_pool_count: 48
- aihot_index_only_count: 17
- aihot_core_count: 10
- aihot_daily_index_only_count: 12
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=0/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 236
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 39 result(s): missing_ai_anchor_in_result=16; broad_list_or_market_report=15; social_or_profile_source=5; noise_term:definition=2; noise_term:hiring=1; source-artifact keyword: Anysearch business fallback for query "YC AI startup funding vertical AI announced August 2026 (startup OR funding OR seed OR pre-seed OR YC OR venture OR Crunchbase OR Dealroom OR PitchBook OR Tracxn)": Anysearch Search service temporarily unavailable.; targeted-refill pre-gate filtered 4 result(s): directory_or_search_page=2; missing_ai_anchor_in_result=2; targeted pool/core refill cycle 1 added 20 item(s) for important_case=0/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=93; media=31; news=27; product=16; industry_media=15; official=15; developer=14; newsletter=14; operators=13; builder=10; funding=8; government_regulator=3; industry=3; marketplace=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=104; fetched-readable-text-main=53; fetched-readable-text-article=27; fetched-readable-text-body-visible-text=24; blocked-http-403=15; no-url-summary-only=14; fetched-readable-text-json-ld=12; blocked-http-401=6; summary-only-low-readable-body=4; timeout-fallback-visible-text=3; binary-text-rejected=1; fetched-readable-text-meta-description=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 13
- A: 59
- S: 43
- B: 131
- ungraded: 18

## Evidence Object Type Distribution

- case_or_customer: 100
- event: 100
- research_or_report: 7
- ecosystem_package_or_model_index: 1
- changelog_or_release: 6
- official_index_or_directory: 13
- regulatory_or_procurement: 19
- search_result_or_tool_directory: 2
- supporting_article: 11
- pricing_change: 3
- event_on_official_page: 2

## Theme Distribution

- 早期信号 (early-direction-signal): 13
- 成熟信号 (mature-commercial-signal): 27
- 技术迭代信号 (technical-iteration-signal): 24
- 外围探索信号 (outside-core-exploration): 10
- 开发者生态信号 (developer-ecosystem-signal): 24
- 资本市场信号 (capital-market-signal): 18
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 15
- AI Hardware investment and financing (ai-hardware-investment-signal): 7
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 11
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 10
- china-local-project (china-local-project): 3
- targeted-pool-gap-refill (targeted-pool-gap-refill): 20
- china-startup-funding (china-startup-funding): 3
- uncategorized (uncategorized): 76
- china-policy-regulation (china-policy-regulation): 3

## Keyword Group Distribution

- early-direction-signal: 12
- mature-commercial-signal: 25
- developer-ecosystem-signal: 28
- technical-iteration-signal: 23
- outside-core-exploration: 10
- capital-market-signal: 18
- enterprise-ai-implementation-signal: 15
- ai-hardware-investment-signal: 7
- ai-hardware-scenario-service-signal: 11
- ai-hardware-trend-innovation-signal: 10
- china-local-project: 3
- targeted-pool-gap-refill: 20
- china-startup-funding: 3
- uncategorized: 76
- china-policy-regulation: 3

## Keyword Search Path Distribution

- capital_startup: 6
- fde_production_rollout: 5
- hardware_product_specs: 5
- hardware_capacity_fab: 5
- hardware_supply_agreement: 2
- hardware_capex: 3
- hardware_oem_odm: 7
- fde_procurement_contract: 5
- procurement_marketplace: 8
- hardware_shipment_deployment: 6
- fde_earnings_disclosure: 3
- fde_customer_case: 4
- official_original: 26
- industry_landing: 6
- a_media_gdelt: 8
- developer_ecosystem: 4

## Keyword Search Intent Distribution

- find_startups: 21
- find_customer_case: 17
- find_capacity_capex: 5
- find_hardware_supply: 2
- verify_company_action: 3
- find_original_source: 44
- find_procurement_signal: 3
- find_market_trend: 8

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
