# 2026-08-01 Guanlan Daily Monitor Log

- generated_at: 2026-08-01T02:42:01.031Z
- raw_count: 249
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
- provider_fallback_notes: Search cross-entry dedupe removed 95 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 46 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 8
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-01/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-01/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-01/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-01/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 46
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 525
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 47
- keyword_search_count: 89
- keyword_search_non_community_count: 89
- keyword_search_path_distribution: hardware_shipment_deployment=11; official_original=11; industry_landing=9; a_media_gdelt=8; developer_ecosystem=7; hardware_capacity_fab=7; hardware_oem_odm=6; fde_customer_case=5; hardware_product_specs=5; fde_procurement_contract=4; fde_production_rollout=4; procurement_marketplace=4; hardware_supply_agreement=3; capital_startup=2; hardware_capex=2; fde_earnings_disclosure=1
- keyword_search_intent_distribution: find_customer_case=26; find_original_source=25; find_startups=17; find_market_trend=8; find_capacity_capex=6; find_hardware_supply=3; find_procurement_signal=2; verify_company_action=2
- source_distribution: keyword-search=89; rss-feed=85; aihot=47; gdelt=28
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 117
- enterprise_ai_transformation_stage_distribution: platform_enablement=56; production_rollout=28; ai_transformation=10; pilot=9; org_build=8; procurement=6
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=89; rss-feed=85; aihot=47; gdelt=28
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=71; developer-ecosystem-signal=32; mature-commercial-signal=29; technical-iteration-signal=23; early-direction-signal=15; ai-hardware-trend-innovation-signal=14; capital-market-signal=13; enterprise-ai-implementation-signal=13; ai-hardware-scenario-service-signal=11; ai-hardware-investment-signal=10; outside-core-exploration=5; targeted-pool-gap-refill=5; china-policy-regulation=3; china-startup-funding=3; china-local-project=2
- theme_distribution: uncategorized=71; mature-commercial-signal=32; developer-ecosystem-signal=26; technical-iteration-signal=23; early-direction-signal=16; capital-market-signal=15; ai-hardware-trend-innovation-signal=14; enterprise-ai-implementation-signal=13; ai-hardware-scenario-service-signal=11; ai-hardware-investment-signal=10; outside-core-exploration=5; targeted-pool-gap-refill=5; china-policy-regulation=3; china-startup-funding=3; china-local-project=2
- theme_concentration_warning: none
- evidence_object_type_distribution: event=98; case_or_customer=87; regulatory_or_procurement=20; official_index_or_directory=18; research_or_report=6; changelog_or_release=5; supporting_article=5; event_on_official_page=3; pricing_change=3; search_result_or_tool_directory=2; community_feedback=1; repo_readme_or_index=1
- pool_route_distribution: watchlist=117; index_only=54; core_pool=52; emerging_pool=45; discard=21
- pool_index_route_distribution: watchlist=117; index_only=54; core_pool=52; emerging_pool=45
- pool_index_count: 228
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 174
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 122
- index_only_pool_count: 54
- aihot_index_only_count: 22
- aihot_core_count: 14
- aihot_daily_index_only_count: 20
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 228
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 28 result(s): broad_list_or_market_report=11; missing_ai_anchor_in_result=11; noise_term:hiring=2; social_or_profile_source=2; noise_term:affiliate=1; noise_term:definition=1; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 1 added 5 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=85; news=31; media=19; industry_media=17; developer=16; newsletter=16; operators=14; product=14; official=12; builder=11; funding=8; government_regulator=3; community=1; marketplace=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=104; fetched-readable-text-main=47; fetched-readable-text-body-visible-text=28; no-url-summary-only=22; fetched-readable-text-article=20; blocked-http-403=9; fetched-readable-text-json-ld=7; blocked-http-401=5; timeout-fallback-visible-text=3; summary-only-low-readable-body=2; binary-text-rejected=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 51
- B: 122
- S: 41
- C: 15
- ungraded: 20

## Evidence Object Type Distribution

- event: 98
- community_feedback: 1
- regulatory_or_procurement: 20
- case_or_customer: 87
- supporting_article: 5
- research_or_report: 6
- changelog_or_release: 5
- event_on_official_page: 3
- repo_readme_or_index: 1
- search_result_or_tool_directory: 2
- pricing_change: 3
- official_index_or_directory: 18

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 5
- 成熟信号 (mature-commercial-signal): 32
- 技术迭代信号 (technical-iteration-signal): 23
- 开发者生态信号 (developer-ecosystem-signal): 26
- 资本市场信号 (capital-market-signal): 15
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 13
- AI Hardware investment and financing (ai-hardware-investment-signal): 10
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 11
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 14
- china-local-project (china-local-project): 2
- 早期信号 (early-direction-signal): 16
- targeted-pool-gap-refill (targeted-pool-gap-refill): 5
- uncategorized (uncategorized): 71
- china-startup-funding (china-startup-funding): 3
- china-policy-regulation (china-policy-regulation): 3

## Keyword Group Distribution

- outside-core-exploration: 5
- mature-commercial-signal: 29
- technical-iteration-signal: 23
- developer-ecosystem-signal: 32
- capital-market-signal: 13
- enterprise-ai-implementation-signal: 13
- ai-hardware-investment-signal: 10
- ai-hardware-scenario-service-signal: 11
- ai-hardware-trend-innovation-signal: 14
- china-local-project: 2
- early-direction-signal: 15
- targeted-pool-gap-refill: 5
- uncategorized: 71
- china-startup-funding: 3
- china-policy-regulation: 3

## Keyword Search Path Distribution

- a_media_gdelt: 8
- fde_customer_case: 5
- hardware_product_specs: 5
- hardware_shipment_deployment: 11
- hardware_supply_agreement: 3
- hardware_capex: 2
- fde_production_rollout: 4
- hardware_capacity_fab: 7
- hardware_oem_odm: 6
- procurement_marketplace: 4
- capital_startup: 2
- fde_earnings_disclosure: 1
- fde_procurement_contract: 4
- developer_ecosystem: 7
- industry_landing: 9
- official_original: 11

## Keyword Search Intent Distribution

- find_market_trend: 8
- find_customer_case: 26
- find_startups: 17
- find_hardware_supply: 3
- verify_company_action: 2
- find_capacity_capex: 6
- find_original_source: 25
- find_procurement_signal: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
