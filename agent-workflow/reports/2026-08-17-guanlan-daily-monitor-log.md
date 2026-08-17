# 2026-08-17 Guanlan Daily Monitor Log

- generated_at: 2026-08-17T00:21:53.710Z
- raw_count: 251
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 2
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 62 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 57 duplicate candidate(s) before Raw writing.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 11
- recovered_failed_sources_count: 10
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-17/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-17/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-17/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-17/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-17/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 57
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 423
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 34
- keyword_search_count: 102
- keyword_search_non_community_count: 102
- keyword_search_path_distribution: official_original=25; a_media_gdelt=9; hardware_shipment_deployment=9; fde_customer_case=7; hardware_oem_odm=7; fde_procurement_contract=6; hardware_capacity_fab=6; developer_ecosystem=5; industry_landing=5; procurement_marketplace=5; fde_production_rollout=4; hardware_product_specs=4; capital_startup=3; hardware_capex=3; fde_earnings_disclosure=2; hardware_supply_agreement=2
- keyword_search_intent_distribution: find_original_source=43; find_customer_case=21; find_startups=15; find_market_trend=9; find_procurement_signal=5; find_capacity_capex=4; verify_company_action=3; find_hardware_supply=2
- source_distribution: keyword-search=102; rss-feed=84; aihot=34; gdelt=31
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 113
- enterprise_ai_transformation_stage_distribution: platform_enablement=54; production_rollout=28; pilot=13; procurement=7; org_build=6; ai_transformation=5
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=102; rss-feed=84; aihot=34; gdelt=31
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=77; mature-commercial-signal=28; technical-iteration-signal=24; targeted-pool-gap-refill=18; developer-ecosystem-signal=16; enterprise-ai-implementation-signal=16; capital-market-signal=13; ai-hardware-trend-innovation-signal=12; early-direction-signal=11; ai-hardware-scenario-service-signal=10; ai-hardware-investment-signal=8; outside-core-exploration=8; china-policy-regulation=4; china-local-project=3; china-startup-funding=3
- theme_distribution: uncategorized=77; mature-commercial-signal=31; technical-iteration-signal=24; targeted-pool-gap-refill=18; enterprise-ai-implementation-signal=16; capital-market-signal=13; developer-ecosystem-signal=13; ai-hardware-trend-innovation-signal=12; early-direction-signal=11; ai-hardware-scenario-service-signal=10; ai-hardware-investment-signal=8; outside-core-exploration=8; china-policy-regulation=4; china-local-project=3; china-startup-funding=3
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=96; event=88; regulatory_or_procurement=23; supporting_article=17; research_or_report=7; pricing_change=6; changelog_or_release=4; official_index_or_directory=4; community_feedback=3; search_result_or_tool_directory=3
- pool_route_distribution: watchlist=119; core_pool=56; index_only=43; discard=29; emerging_pool=21
- pool_index_route_distribution: watchlist=119; core_pool=56; index_only=43; emerging_pool=21
- pool_index_count: 222
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 179
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 123
- index_only_pool_count: 43
- aihot_index_only_count: 9
- aihot_core_count: 17
- aihot_daily_index_only_count: 2
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 222
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 42 result(s): missing_ai_anchor_in_result=21; broad_list_or_market_report=10; social_or_profile_source=8; noise_term:hiring=2; noise_term:definition=1; targeted-refill pre-gate filtered 4 result(s): directory_or_search_page=1; missing_ai_anchor_in_result=1; noise_term:career=1; social_or_profile_source=1; targeted pool/core refill cycle 1 added 18 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=88; industry_media=29; media=25; news=25; newsletter=14; developer=13; product=12; builder=10; operators=10; funding=8; official=7; industry=5; government_regulator=4; marketplace=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=94; fetched-readable-text-main=53; fetched-readable-text-body-visible-text=35; fetched-readable-text-article=26; blocked-http-403=17; blocked-http-401=8; fetched-readable-text-json-ld=8; summary-only-low-readable-body=5; no-url-summary-only=3; binary-text-rejected=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 10
- B: 128
- A: 50
- S: 30
- ungraded: 33

## Evidence Object Type Distribution

- event: 88
- community_feedback: 3
- supporting_article: 17
- case_or_customer: 96
- regulatory_or_procurement: 23
- changelog_or_release: 4
- pricing_change: 6
- research_or_report: 7
- search_result_or_tool_directory: 3
- official_index_or_directory: 4

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 31
- 技术迭代信号 (technical-iteration-signal): 24
- 资本市场信号 (capital-market-signal): 13
- AI Hardware investment and financing (ai-hardware-investment-signal): 8
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 10
- china-local-project (china-local-project): 3
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 16
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 12
- 外围探索信号 (outside-core-exploration): 8
- 早期信号 (early-direction-signal): 11
- targeted-pool-gap-refill (targeted-pool-gap-refill): 18
- 开发者生态信号 (developer-ecosystem-signal): 13
- china-startup-funding (china-startup-funding): 3
- uncategorized (uncategorized): 77
- china-policy-regulation (china-policy-regulation): 4

## Keyword Group Distribution

- mature-commercial-signal: 28
- technical-iteration-signal: 24
- capital-market-signal: 13
- ai-hardware-investment-signal: 8
- ai-hardware-scenario-service-signal: 10
- china-local-project: 3
- enterprise-ai-implementation-signal: 16
- ai-hardware-trend-innovation-signal: 12
- outside-core-exploration: 8
- early-direction-signal: 11
- developer-ecosystem-signal: 16
- targeted-pool-gap-refill: 18
- china-startup-funding: 3
- uncategorized: 77
- china-policy-regulation: 4

## Keyword Search Path Distribution

- a_media_gdelt: 9
- hardware_product_specs: 4
- hardware_capacity_fab: 6
- hardware_capex: 3
- fde_production_rollout: 4
- hardware_shipment_deployment: 9
- fde_earnings_disclosure: 2
- capital_startup: 3
- fde_customer_case: 7
- hardware_oem_odm: 7
- fde_procurement_contract: 6
- official_original: 25
- procurement_marketplace: 5
- developer_ecosystem: 5
- industry_landing: 5
- hardware_supply_agreement: 2

## Keyword Search Intent Distribution

- find_market_trend: 9
- find_startups: 15
- find_capacity_capex: 4
- verify_company_action: 3
- find_customer_case: 21
- find_original_source: 43
- find_procurement_signal: 5
- find_hardware_supply: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
