# 2026-08-13 Guanlan Daily Monitor Log

- generated_at: 2026-08-13T00:24:08.209Z
- raw_count: 249
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 13
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 60 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 47 duplicate candidate(s) before Raw writing.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 8
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-13/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-13/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-13/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-13/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 47
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 565
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 45
- keyword_search_count: 87
- keyword_search_non_community_count: 87
- keyword_search_path_distribution: official_original=12; hardware_product_specs=9; procurement_marketplace=8; a_media_gdelt=7; hardware_oem_odm=7; industry_landing=7; developer_ecosystem=6; fde_customer_case=6; hardware_capacity_fab=5; fde_procurement_contract=4; fde_production_rollout=4; hardware_shipment_deployment=4; hardware_capex=3; capital_startup=2; fde_earnings_disclosure=2; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=38; find_customer_case=18; find_startups=13; find_market_trend=7; find_capacity_capex=5; verify_company_action=3; find_procurement_signal=2; find_hardware_supply=1
- source_distribution: keyword-search=87; rss-feed=85; aihot=45; gdelt=32
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 115
- enterprise_ai_transformation_stage_distribution: platform_enablement=65; production_rollout=30; pilot=11; ai_transformation=3; org_build=3; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=87; rss-feed=85; aihot=45; gdelt=32
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=78; technical-iteration-signal=28; mature-commercial-signal=26; developer-ecosystem-signal=23; enterprise-ai-implementation-signal=18; capital-market-signal=13; early-direction-signal=12; outside-core-exploration=11; ai-hardware-trend-innovation-signal=9; ai-hardware-investment-signal=8; ai-hardware-scenario-service-signal=8; targeted-pool-gap-refill=6; china-local-project=3; china-policy-regulation=3; china-startup-funding=3
- theme_distribution: uncategorized=78; technical-iteration-signal=31; mature-commercial-signal=28; developer-ecosystem-signal=18; enterprise-ai-implementation-signal=18; capital-market-signal=13; early-direction-signal=12; outside-core-exploration=11; ai-hardware-trend-innovation-signal=9; ai-hardware-investment-signal=8; ai-hardware-scenario-service-signal=8; targeted-pool-gap-refill=6; china-local-project=3; china-policy-regulation=3; china-startup-funding=3
- theme_concentration_warning: none
- evidence_object_type_distribution: event=97; case_or_customer=94; regulatory_or_procurement=14; official_index_or_directory=12; supporting_article=10; changelog_or_release=6; research_or_report=6; pricing_change=3; search_result_or_tool_directory=3; event_on_official_page=2; community_feedback=1; ecosystem_package_or_model_index=1
- pool_route_distribution: watchlist=125; core_pool=55; index_only=49; emerging_pool=40; discard=17
- pool_index_route_distribution: watchlist=125; core_pool=55; index_only=49; emerging_pool=40
- pool_index_count: 232
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 183
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 128
- index_only_pool_count: 49
- aihot_index_only_count: 17
- aihot_core_count: 14
- aihot_daily_index_only_count: 13
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 232
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 32 result(s): missing_ai_anchor_in_result=18; broad_list_or_market_report=7; social_or_profile_source=4; noise_term:hiring=2; noise_term:career=1; targeted-refill pre-gate filtered 2 result(s): directory_or_search_page=1; social_or_profile_source=1; targeted pool/core refill cycle 1 added 6 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=86; news=32; media=25; newsletter=17; industry_media=16; operators=15; developer=14; product=13; builder=9; funding=8; official=7; government_regulator=3; marketplace=3; industry=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=103; fetched-readable-text-main=56; fetched-readable-text-article=22; fetched-readable-text-body-visible-text=21; no-url-summary-only=15; fetched-readable-text-json-ld=11; summary-only-low-readable-body=9; blocked-http-403=7; blocked-http-401=2; binary-text-rejected=1; fetched-readable-text-meta-description=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 57
- S: 32
- B: 126
- C: 15
- ungraded: 19

## Evidence Object Type Distribution

- case_or_customer: 94
- event: 97
- changelog_or_release: 6
- supporting_article: 10
- regulatory_or_procurement: 14
- search_result_or_tool_directory: 3
- pricing_change: 3
- research_or_report: 6
- ecosystem_package_or_model_index: 1
- official_index_or_directory: 12
- community_feedback: 1
- event_on_official_page: 2

## Theme Distribution

- 早期信号 (early-direction-signal): 12
- 开发者生态信号 (developer-ecosystem-signal): 18
- 技术迭代信号 (technical-iteration-signal): 31
- 外围探索信号 (outside-core-exploration): 11
- 成熟信号 (mature-commercial-signal): 28
- 资本市场信号 (capital-market-signal): 13
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 18
- AI Hardware investment and financing (ai-hardware-investment-signal): 8
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 8
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 9
- china-local-project (china-local-project): 3
- targeted-pool-gap-refill (targeted-pool-gap-refill): 6
- uncategorized (uncategorized): 78
- china-startup-funding (china-startup-funding): 3
- china-policy-regulation (china-policy-regulation): 3

## Keyword Group Distribution

- early-direction-signal: 12
- developer-ecosystem-signal: 23
- technical-iteration-signal: 28
- outside-core-exploration: 11
- mature-commercial-signal: 26
- capital-market-signal: 13
- enterprise-ai-implementation-signal: 18
- ai-hardware-investment-signal: 8
- ai-hardware-scenario-service-signal: 8
- ai-hardware-trend-innovation-signal: 9
- china-local-project: 3
- targeted-pool-gap-refill: 6
- uncategorized: 78
- china-startup-funding: 3
- china-policy-regulation: 3

## Keyword Search Path Distribution

- capital_startup: 2
- fde_customer_case: 6
- hardware_product_specs: 9
- hardware_shipment_deployment: 4
- hardware_supply_agreement: 1
- hardware_capex: 3
- fde_procurement_contract: 4
- fde_production_rollout: 4
- hardware_capacity_fab: 5
- procurement_marketplace: 8
- fde_earnings_disclosure: 2
- hardware_oem_odm: 7
- a_media_gdelt: 7
- official_original: 12
- developer_ecosystem: 6
- industry_landing: 7

## Keyword Search Intent Distribution

- find_startups: 13
- find_customer_case: 18
- find_hardware_supply: 1
- verify_company_action: 3
- find_capacity_capex: 5
- find_original_source: 38
- find_market_trend: 7
- find_procurement_signal: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
