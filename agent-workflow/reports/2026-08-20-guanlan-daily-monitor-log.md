# 2026-08-20 Guanlan Daily Monitor Log

- generated_at: 2026-08-20T00:25:24.128Z
- raw_count: 262
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
- provider_fallback_notes: Search cross-entry dedupe removed 74 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 50 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 7
- recovered_failed_sources_count: 7
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-20/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-20/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-20/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-20/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-20/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 50
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 569
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 42
- keyword_search_count: 104
- keyword_search_non_community_count: 104
- keyword_search_path_distribution: official_original=27; hardware_shipment_deployment=10; hardware_oem_odm=8; fde_customer_case=7; hardware_product_specs=7; procurement_marketplace=7; a_media_gdelt=6; industry_landing=6; fde_procurement_contract=5; fde_production_rollout=5; developer_ecosystem=4; hardware_capacity_fab=4; hardware_capex=3; capital_startup=2; hardware_supply_agreement=2; fde_earnings_disclosure=1
- keyword_search_intent_distribution: find_original_source=47; find_customer_case=22; find_startups=17; find_market_trend=6; find_capacity_capex=4; find_procurement_signal=3; verify_company_action=3; find_hardware_supply=2
- source_distribution: keyword-search=104; rss-feed=83; aihot=42; gdelt=33
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 116
- enterprise_ai_transformation_stage_distribution: platform_enablement=50; production_rollout=38; pilot=14; procurement=7; ai_transformation=4; org_build=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=104; rss-feed=83; aihot=42; gdelt=33
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=73; technical-iteration-signal=28; mature-commercial-signal=26; developer-ecosystem-signal=23; targeted-pool-gap-refill=22; capital-market-signal=15; enterprise-ai-implementation-signal=15; ai-hardware-scenario-service-signal=13; ai-hardware-trend-innovation-signal=10; early-direction-signal=10; ai-hardware-investment-signal=9; outside-core-exploration=8; china-policy-regulation=4; china-local-project=3; china-startup-funding=3
- theme_distribution: uncategorized=73; technical-iteration-signal=30; mature-commercial-signal=28; targeted-pool-gap-refill=22; developer-ecosystem-signal=19; capital-market-signal=15; enterprise-ai-implementation-signal=15; ai-hardware-scenario-service-signal=13; ai-hardware-trend-innovation-signal=10; early-direction-signal=10; ai-hardware-investment-signal=9; outside-core-exploration=8; china-policy-regulation=4; china-local-project=3; china-startup-funding=3
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=110; event=84; regulatory_or_procurement=21; supporting_article=16; official_index_or_directory=10; research_or_report=7; pricing_change=5; event_on_official_page=3; changelog_or_release=2; community_feedback=2; ecosystem_package_or_model_index=1; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=133; core_pool=47; index_only=47; emerging_pool=33; discard=29
- pool_index_route_distribution: watchlist=133; core_pool=47; index_only=47; emerging_pool=33
- pool_index_count: 233
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 186
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 139
- index_only_pool_count: 47
- aihot_index_only_count: 16
- aihot_core_count: 11
- aihot_daily_index_only_count: 12
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 233
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 39 result(s): missing_ai_anchor_in_result=15; broad_list_or_market_report=11; social_or_profile_source=8; noise_term:hiring=3; noise_term:career=1; noise_term:meme=1; targeted pool/core refill cycle 1 added 22 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=100; media=27; news=26; developer=15; industry_media=15; newsletter=13; operators=13; product=13; official=12; builder=11; funding=8; government_regulator=4; marketplace=3; research=2
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=99; fetched-readable-text-main=50; fetched-readable-text-body-visible-text=27; fetched-readable-text-article=24; blocked-http-403=19; fetched-readable-text-json-ld=15; no-url-summary-only=14; blocked-http-401=6; summary-only-low-readable-body=5; binary-text-rejected=1; http-404-fallback-text=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 39
- A: 55
- ungraded: 19
- B: 136
- C: 13

## Evidence Object Type Distribution

- supporting_article: 16
- event: 84
- regulatory_or_procurement: 21
- changelog_or_release: 2
- community_feedback: 2
- case_or_customer: 110
- pricing_change: 5
- research_or_report: 7
- event_on_official_page: 3
- ecosystem_package_or_model_index: 1
- official_index_or_directory: 10
- search_result_or_tool_directory: 1

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 8
- 技术迭代信号 (technical-iteration-signal): 30
- 早期信号 (early-direction-signal): 10
- 成熟信号 (mature-commercial-signal): 28
- 开发者生态信号 (developer-ecosystem-signal): 19
- 资本市场信号 (capital-market-signal): 15
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 15
- AI Hardware investment and financing (ai-hardware-investment-signal): 9
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 13
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 10
- china-local-project (china-local-project): 3
- targeted-pool-gap-refill (targeted-pool-gap-refill): 22
- uncategorized (uncategorized): 73
- china-policy-regulation (china-policy-regulation): 4
- china-startup-funding (china-startup-funding): 3

## Keyword Group Distribution

- outside-core-exploration: 8
- technical-iteration-signal: 28
- early-direction-signal: 10
- mature-commercial-signal: 26
- developer-ecosystem-signal: 23
- capital-market-signal: 15
- enterprise-ai-implementation-signal: 15
- ai-hardware-investment-signal: 9
- ai-hardware-scenario-service-signal: 13
- ai-hardware-trend-innovation-signal: 10
- china-local-project: 3
- targeted-pool-gap-refill: 22
- uncategorized: 73
- china-policy-regulation: 4
- china-startup-funding: 3

## Keyword Search Path Distribution

- hardware_oem_odm: 8
- fde_customer_case: 7
- hardware_product_specs: 7
- hardware_capacity_fab: 4
- hardware_supply_agreement: 2
- capital_startup: 2
- fde_production_rollout: 5
- hardware_shipment_deployment: 10
- hardware_capex: 3
- fde_procurement_contract: 5
- fde_earnings_disclosure: 1
- procurement_marketplace: 7
- a_media_gdelt: 6
- industry_landing: 6
- official_original: 27
- developer_ecosystem: 4

## Keyword Search Intent Distribution

- find_startups: 17
- find_customer_case: 22
- find_capacity_capex: 4
- find_hardware_supply: 2
- find_original_source: 47
- verify_company_action: 3
- find_market_trend: 6
- find_procurement_signal: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
