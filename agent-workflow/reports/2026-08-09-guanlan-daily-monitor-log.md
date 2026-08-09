# 2026-08-09 Guanlan Daily Monitor Log

- generated_at: 2026-08-09T00:21:17.933Z
- raw_count: 253
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 5
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 42 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 59 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 9
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-09/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-09/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-09/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-09/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 59
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 395
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 33
- keyword_search_count: 105
- keyword_search_non_community_count: 105
- keyword_search_path_distribution: official_original=23; procurement_marketplace=9; a_media_gdelt=8; capital_startup=8; hardware_shipment_deployment=8; hardware_oem_odm=7; hardware_product_specs=7; hardware_capacity_fab=6; industry_landing=6; fde_customer_case=5; fde_procurement_contract=5; developer_ecosystem=3; fde_production_rollout=3; hardware_capex=3; fde_earnings_disclosure=2; hardware_supply_agreement=2
- keyword_search_intent_distribution: find_original_source=41; find_startups=23; find_customer_case=17; find_market_trend=8; find_procurement_signal=6; find_capacity_capex=5; verify_company_action=3; find_hardware_supply=2
- source_distribution: keyword-search=105; rss-feed=85; aihot=33; gdelt=30
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 108
- enterprise_ai_transformation_stage_distribution: platform_enablement=56; production_rollout=26; pilot=15; procurement=8; ai_transformation=2; org_build=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=105; rss-feed=85; aihot=33; gdelt=30
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=77; mature-commercial-signal=29; targeted-pool-gap-refill=22; technical-iteration-signal=21; developer-ecosystem-signal=19; enterprise-ai-implementation-signal=15; outside-core-exploration=13; ai-hardware-trend-innovation-signal=11; capital-market-signal=11; ai-hardware-investment-signal=10; ai-hardware-scenario-service-signal=8; early-direction-signal=8; china-local-project=3; china-policy-regulation=3; china-startup-funding=3
- theme_distribution: uncategorized=77; mature-commercial-signal=30; targeted-pool-gap-refill=22; technical-iteration-signal=22; developer-ecosystem-signal=17; enterprise-ai-implementation-signal=15; outside-core-exploration=13; ai-hardware-trend-innovation-signal=11; capital-market-signal=11; ai-hardware-investment-signal=10; ai-hardware-scenario-service-signal=8; early-direction-signal=8; china-local-project=3; china-policy-regulation=3; china-startup-funding=3
- theme_concentration_warning: none
- evidence_object_type_distribution: event=101; case_or_customer=84; regulatory_or_procurement=23; supporting_article=13; official_index_or_directory=9; research_or_report=9; changelog_or_release=5; pricing_change=5; community_feedback=2; search_result_or_tool_directory=2
- pool_route_distribution: watchlist=120; core_pool=53; index_only=52; emerging_pool=38; discard=27
- pool_index_route_distribution: watchlist=120; core_pool=53; index_only=52; emerging_pool=38
- pool_index_count: 226
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 174
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 121
- index_only_pool_count: 52
- aihot_index_only_count: 10
- aihot_core_count: 10
- aihot_daily_index_only_count: 5
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 226
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 48 result(s): missing_ai_anchor_in_result=23; broad_list_or_market_report=14; social_or_profile_source=6; noise_term:career=2; noise_term:hiring=2; noise_term:definition=1; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 1 added 22 item(s) for important_case=2/5; important_funding=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=88; news=29; media=26; industry_media=25; newsletter=18; operators=12; developer=11; official=10; product=10; funding=9; builder=8; government_regulator=3; research=2; industry=1; marketplace=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=104; fetched-readable-text-main=45; fetched-readable-text-body-visible-text=31; fetched-readable-text-article=24; blocked-http-403=17; fetched-readable-text-json-ld=9; no-url-summary-only=7; summary-only-low-readable-body=5; blocked-http-401=4; timeout-fallback-visible-text=4; binary-text-rejected=1; http-404-fallback-text=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 31
- B: 125
- A: 57
- C: 12
- ungraded: 28

## Evidence Object Type Distribution

- community_feedback: 2
- event: 101
- case_or_customer: 84
- research_or_report: 9
- changelog_or_release: 5
- supporting_article: 13
- regulatory_or_procurement: 23
- pricing_change: 5
- official_index_or_directory: 9
- search_result_or_tool_directory: 2

## Theme Distribution

- 早期信号 (early-direction-signal): 8
- 开发者生态信号 (developer-ecosystem-signal): 17
- 技术迭代信号 (technical-iteration-signal): 22
- 资本市场信号 (capital-market-signal): 11
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 15
- AI Hardware investment and financing (ai-hardware-investment-signal): 10
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 8
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 11
- china-local-project (china-local-project): 3
- 外围探索信号 (outside-core-exploration): 13
- 成熟信号 (mature-commercial-signal): 30
- targeted-pool-gap-refill (targeted-pool-gap-refill): 22
- uncategorized (uncategorized): 77
- china-startup-funding (china-startup-funding): 3
- china-policy-regulation (china-policy-regulation): 3

## Keyword Group Distribution

- early-direction-signal: 8
- developer-ecosystem-signal: 19
- technical-iteration-signal: 21
- capital-market-signal: 11
- enterprise-ai-implementation-signal: 15
- ai-hardware-investment-signal: 10
- ai-hardware-scenario-service-signal: 8
- ai-hardware-trend-innovation-signal: 11
- china-local-project: 3
- outside-core-exploration: 13
- mature-commercial-signal: 29
- targeted-pool-gap-refill: 22
- uncategorized: 77
- china-startup-funding: 3
- china-policy-regulation: 3

## Keyword Search Path Distribution

- capital_startup: 8
- fde_customer_case: 5
- hardware_product_specs: 7
- hardware_shipment_deployment: 8
- hardware_supply_agreement: 2
- hardware_capex: 3
- hardware_oem_odm: 7
- procurement_marketplace: 9
- hardware_capacity_fab: 6
- fde_earnings_disclosure: 2
- official_original: 23
- fde_production_rollout: 3
- a_media_gdelt: 8
- industry_landing: 6
- fde_procurement_contract: 5
- developer_ecosystem: 3

## Keyword Search Intent Distribution

- find_startups: 23
- find_customer_case: 17
- find_hardware_supply: 2
- verify_company_action: 3
- find_capacity_capex: 5
- find_procurement_signal: 6
- find_original_source: 41
- find_market_trend: 8

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
