# 2026-08-14 Guanlan Daily Monitor Log

- generated_at: 2026-08-14T00:21:55.250Z
- raw_count: 234
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 9
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 69 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 56 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 8
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-14/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-14/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-14/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-14/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 56
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 573
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 35
- keyword_search_count: 81
- keyword_search_non_community_count: 81
- keyword_search_path_distribution: hardware_oem_odm=9; a_media_gdelt=8; fde_production_rollout=7; hardware_shipment_deployment=7; fde_procurement_contract=6; hardware_capacity_fab=6; hardware_product_specs=6; official_original=6; fde_customer_case=5; industry_landing=5; procurement_marketplace=5; developer_ecosystem=4; capital_startup=2; fde_earnings_disclosure=2; hardware_capex=2; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=29; find_customer_case=23; find_startups=11; find_market_trend=8; find_capacity_capex=4; find_procurement_signal=3; verify_company_action=2; find_hardware_supply=1
- source_distribution: rss-feed=84; keyword-search=81; aihot=35; gdelt=34
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 112
- enterprise_ai_transformation_stage_distribution: platform_enablement=63; production_rollout=31; procurement=6; pilot=5; ai_transformation=4; org_build=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: rss-feed=84; keyword-search=81; aihot=35; gdelt=34
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=78; technical-iteration-signal=28; developer-ecosystem-signal=27; mature-commercial-signal=27; enterprise-ai-implementation-signal=17; ai-hardware-trend-innovation-signal=13; capital-market-signal=11; ai-hardware-scenario-service-signal=8; ai-hardware-investment-signal=7; early-direction-signal=6; china-policy-regulation=4; china-startup-funding=3; outside-core-exploration=3; china-local-project=2
- theme_distribution: uncategorized=78; mature-commercial-signal=29; technical-iteration-signal=28; developer-ecosystem-signal=25; enterprise-ai-implementation-signal=17; ai-hardware-trend-innovation-signal=13; capital-market-signal=11; ai-hardware-scenario-service-signal=8; ai-hardware-investment-signal=7; early-direction-signal=6; china-policy-regulation=4; china-startup-funding=3; outside-core-exploration=3; china-local-project=2
- theme_concentration_warning: none
- evidence_object_type_distribution: event=97; case_or_customer=84; supporting_article=14; regulatory_or_procurement=13; changelog_or_release=7; official_index_or_directory=6; research_or_report=6; pricing_change=3; search_result_or_tool_directory=2; community_feedback=1; marketplace_listing=1
- pool_route_distribution: watchlist=125; core_pool=46; index_only=43; emerging_pool=29; discard=16
- pool_index_route_distribution: watchlist=125; core_pool=46; index_only=43; emerging_pool=29
- pool_index_count: 218
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 175
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 129
- index_only_pool_count: 43
- aihot_index_only_count: 12
- aihot_core_count: 8
- aihot_daily_index_only_count: 9
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 218
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 39 result(s): broad_list_or_market_report=14; missing_ai_anchor_in_result=13; social_or_profile_source=5; noise_term:hiring=3; noise_term:avatar=1; noise_term:career=1; noise_term:definition=1; noise_term:translation=1
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=69; media=32; news=29; developer=16; newsletter=16; official=15; product=14; industry_media=13; builder=9; funding=8; operators=6; government_regulator=3; marketplace=3; industry=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=102; fetched-readable-text-main=39; fetched-readable-text-article=26; fetched-readable-text-body-visible-text=23; blocked-http-403=12; no-url-summary-only=10; summary-only-low-readable-body=9; fetched-readable-text-json-ld=8; binary-text-rejected=1; blocked-http-401=1; http-404-fallback-text=1; http-429-fallback-text=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 61
- S: 42
- B: 109
- ungraded: 16
- C: 6

## Evidence Object Type Distribution

- case_or_customer: 84
- changelog_or_release: 7
- community_feedback: 1
- event: 97
- regulatory_or_procurement: 13
- supporting_article: 14
- research_or_report: 6
- search_result_or_tool_directory: 2
- pricing_change: 3
- official_index_or_directory: 6
- marketplace_listing: 1

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 29
- 开发者生态信号 (developer-ecosystem-signal): 25
- 外围探索信号 (outside-core-exploration): 3
- 技术迭代信号 (technical-iteration-signal): 28
- 资本市场信号 (capital-market-signal): 11
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 17
- AI Hardware investment and financing (ai-hardware-investment-signal): 7
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 8
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 13
- china-local-project (china-local-project): 2
- 早期信号 (early-direction-signal): 6
- china-startup-funding (china-startup-funding): 3
- uncategorized (uncategorized): 78
- china-policy-regulation (china-policy-regulation): 4

## Keyword Group Distribution

- mature-commercial-signal: 27
- developer-ecosystem-signal: 27
- outside-core-exploration: 3
- technical-iteration-signal: 28
- capital-market-signal: 11
- enterprise-ai-implementation-signal: 17
- ai-hardware-investment-signal: 7
- ai-hardware-scenario-service-signal: 8
- ai-hardware-trend-innovation-signal: 13
- china-local-project: 2
- early-direction-signal: 6
- china-startup-funding: 3
- uncategorized: 78
- china-policy-regulation: 4

## Keyword Search Path Distribution

- capital_startup: 2
- fde_customer_case: 5
- hardware_capacity_fab: 6
- hardware_product_specs: 6
- hardware_shipment_deployment: 7
- hardware_capex: 2
- procurement_marketplace: 5
- fde_production_rollout: 7
- hardware_oem_odm: 9
- fde_procurement_contract: 6
- fde_earnings_disclosure: 2
- a_media_gdelt: 8
- official_original: 6
- industry_landing: 5
- hardware_supply_agreement: 1
- developer_ecosystem: 4

## Keyword Search Intent Distribution

- find_startups: 11
- find_customer_case: 23
- find_capacity_capex: 4
- find_original_source: 29
- verify_company_action: 2
- find_procurement_signal: 3
- find_market_trend: 8
- find_hardware_supply: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
