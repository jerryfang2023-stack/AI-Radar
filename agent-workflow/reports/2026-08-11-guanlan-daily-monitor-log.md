# 2026-08-11 Guanlan Daily Monitor Log

- generated_at: 2026-08-11T00:23:17.374Z
- raw_count: 256
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
- provider_fallback_notes: Search cross-entry dedupe removed 46 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 56 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 12
- recovered_failed_sources_count: 11
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-11/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-11/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-11/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-11/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 56
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 522
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 32
- keyword_search_count: 108
- keyword_search_non_community_count: 108
- keyword_search_path_distribution: official_original=30; hardware_oem_odm=8; hardware_product_specs=8; a_media_gdelt=7; hardware_shipment_deployment=7; industry_landing=7; procurement_marketplace=7; fde_procurement_contract=6; fde_production_rollout=6; hardware_capacity_fab=6; developer_ecosystem=4; fde_earnings_disclosure=4; capital_startup=3; fde_customer_case=2; hardware_capex=2; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=51; find_startups=18; find_customer_case=17; find_market_trend=7; find_capacity_capex=6; find_procurement_signal=6; verify_company_action=2; find_hardware_supply=1
- source_distribution: keyword-search=108; rss-feed=85; aihot=32; gdelt=31
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 122
- enterprise_ai_transformation_stage_distribution: platform_enablement=61; production_rollout=30; pilot=16; procurement=7; ai_transformation=6; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=108; rss-feed=85; aihot=32; gdelt=31
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=78; developer-ecosystem-signal=27; targeted-pool-gap-refill=22; technical-iteration-signal=22; mature-commercial-signal=21; capital-market-signal=16; ai-hardware-trend-innovation-signal=13; enterprise-ai-implementation-signal=12; early-direction-signal=11; ai-hardware-scenario-service-signal=9; ai-hardware-investment-signal=8; outside-core-exploration=8; china-policy-regulation=4; china-startup-funding=3; china-local-project=2
- theme_distribution: uncategorized=78; technical-iteration-signal=25; developer-ecosystem-signal=23; mature-commercial-signal=22; targeted-pool-gap-refill=22; capital-market-signal=16; ai-hardware-trend-innovation-signal=13; enterprise-ai-implementation-signal=12; early-direction-signal=11; ai-hardware-scenario-service-signal=9; ai-hardware-investment-signal=8; outside-core-exploration=8; china-policy-regulation=4; china-startup-funding=3; china-local-project=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=102; event=95; regulatory_or_procurement=20; official_index_or_directory=8; supporting_article=8; research_or_report=7; changelog_or_release=5; event_on_official_page=3; search_result_or_tool_directory=3; pricing_change=2; community_feedback=1; ecosystem_package_or_model_index=1; marketplace_listing=1
- pool_route_distribution: watchlist=125; core_pool=46; index_only=45; discard=37; emerging_pool=36
- pool_index_route_distribution: watchlist=125; core_pool=46; index_only=45; emerging_pool=36
- pool_index_count: 219
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 174
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 128
- index_only_pool_count: 45
- aihot_index_only_count: 13
- aihot_core_count: 7
- aihot_daily_index_only_count: 12
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=1/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 219
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 42 result(s): missing_ai_anchor_in_result=19; social_or_profile_source=11; broad_list_or_market_report=6; noise_term:career=2; noise_term:affiliate=1; noise_term:avatar=1; noise_term:dictionary=1; noise_term:hiring=1; source-artifact keyword: Anysearch business fallback for query "Applied AI architect enterprise customer workflow announced August 2026 (official customer story OR case study OR production deployment OR procurement contract OR workflow rollout OR adoption)": Anysearch Search service temporarily unavailable.; targeted-refill pre-gate filtered 3 result(s): noise_term:definition=2; social_or_profile_source=1; targeted pool/core refill cycle 1 added 22 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=90; news=27; media=26; official=19; product=14; developer=13; newsletter=13; operators=13; industry_media=12; builder=11; funding=9; government_regulator=3; marketplace=3; domestic_vendor=1; industry=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=97; fetched-readable-text-main=47; fetched-readable-text-body-visible-text=27; fetched-readable-text-article=22; blocked-http-403=20; no-url-summary-only=14; blocked-http-401=11; fetched-readable-text-json-ld=9; summary-only-low-readable-body=5; http-429-fallback-text=2; binary-text-rejected=1; fetch-failed-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 46
- A: 54
- B: 128
- ungraded: 15
- C: 13

## Evidence Object Type Distribution

- event: 95
- regulatory_or_procurement: 20
- case_or_customer: 102
- changelog_or_release: 5
- community_feedback: 1
- search_result_or_tool_directory: 3
- research_or_report: 7
- pricing_change: 2
- supporting_article: 8
- ecosystem_package_or_model_index: 1
- event_on_official_page: 3
- official_index_or_directory: 8
- marketplace_listing: 1

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 25
- 开发者生态信号 (developer-ecosystem-signal): 23
- 资本市场信号 (capital-market-signal): 16
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 12
- AI Hardware investment and financing (ai-hardware-investment-signal): 8
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 9
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 13
- china-local-project (china-local-project): 2
- 成熟信号 (mature-commercial-signal): 22
- 外围探索信号 (outside-core-exploration): 8
- 早期信号 (early-direction-signal): 11
- targeted-pool-gap-refill (targeted-pool-gap-refill): 22
- uncategorized (uncategorized): 78
- china-policy-regulation (china-policy-regulation): 4
- china-startup-funding (china-startup-funding): 3

## Keyword Group Distribution

- technical-iteration-signal: 22
- developer-ecosystem-signal: 27
- capital-market-signal: 16
- enterprise-ai-implementation-signal: 12
- ai-hardware-investment-signal: 8
- ai-hardware-scenario-service-signal: 9
- ai-hardware-trend-innovation-signal: 13
- china-local-project: 2
- mature-commercial-signal: 21
- outside-core-exploration: 8
- early-direction-signal: 11
- targeted-pool-gap-refill: 22
- uncategorized: 78
- china-policy-regulation: 4
- china-startup-funding: 3

## Keyword Search Path Distribution

- capital_startup: 3
- fde_production_rollout: 6
- hardware_product_specs: 8
- hardware_capacity_fab: 6
- hardware_supply_agreement: 1
- hardware_capex: 2
- fde_procurement_contract: 6
- fde_customer_case: 2
- hardware_shipment_deployment: 7
- hardware_oem_odm: 8
- a_media_gdelt: 7
- procurement_marketplace: 7
- official_original: 30
- fde_earnings_disclosure: 4
- industry_landing: 7
- developer_ecosystem: 4

## Keyword Search Intent Distribution

- find_startups: 18
- find_customer_case: 17
- find_capacity_capex: 6
- find_hardware_supply: 1
- verify_company_action: 2
- find_original_source: 51
- find_market_trend: 7
- find_procurement_signal: 6

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
