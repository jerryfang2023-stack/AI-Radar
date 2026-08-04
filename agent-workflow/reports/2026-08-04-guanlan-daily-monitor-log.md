# 2026-08-04 Guanlan Daily Monitor Log

- generated_at: 2026-08-04T00:22:23.999Z
- raw_count: 250
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 18
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 57 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 40 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 8
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-04/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-04/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-04/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-04/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 40
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 526
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 49
- keyword_search_count: 83
- keyword_search_non_community_count: 83
- keyword_search_path_distribution: a_media_gdelt=8; hardware_shipment_deployment=8; official_original=8; fde_production_rollout=6; hardware_product_specs=6; industry_landing=6; procurement_marketplace=6; developer_ecosystem=5; fde_customer_case=5; fde_procurement_contract=5; hardware_capacity_fab=5; hardware_oem_odm=5; hardware_capex=3; hardware_supply_agreement=3; capital_startup=2; fde_earnings_disclosure=2
- keyword_search_intent_distribution: find_original_source=25; find_customer_case=20; find_startups=16; find_market_trend=8; find_capacity_capex=4; find_procurement_signal=4; find_hardware_supply=3; verify_company_action=3
- source_distribution: keyword-search=83; rss-feed=83; aihot=49; gdelt=35
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 118
- enterprise_ai_transformation_stage_distribution: platform_enablement=61; production_rollout=32; pilot=10; ai_transformation=6; org_build=5; procurement=4
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=83; rss-feed=83; aihot=49; gdelt=35
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=73; technical-iteration-signal=32; mature-commercial-signal=27; developer-ecosystem-signal=22; enterprise-ai-implementation-signal=17; early-direction-signal=14; capital-market-signal=13; ai-hardware-scenario-service-signal=11; ai-hardware-trend-innovation-signal=11; ai-hardware-investment-signal=10; outside-core-exploration=10; china-startup-funding=4; china-local-project=3; china-policy-regulation=3
- theme_distribution: uncategorized=73; technical-iteration-signal=32; mature-commercial-signal=30; developer-ecosystem-signal=19; enterprise-ai-implementation-signal=17; early-direction-signal=14; capital-market-signal=13; ai-hardware-scenario-service-signal=11; ai-hardware-trend-innovation-signal=11; ai-hardware-investment-signal=10; outside-core-exploration=10; china-startup-funding=4; china-local-project=3; china-policy-regulation=3
- theme_concentration_warning: none
- evidence_object_type_distribution: event=93; case_or_customer=90; official_index_or_directory=15; regulatory_or_procurement=14; research_or_report=11; supporting_article=11; event_on_official_page=7; pricing_change=3; changelog_or_release=2; search_result_or_tool_directory=2; community_feedback=1; repo_readme_or_index=1
- pool_route_distribution: watchlist=107; index_only=58; core_pool=55; emerging_pool=40; discard=27
- pool_index_route_distribution: watchlist=107; index_only=58; core_pool=55; emerging_pool=40
- pool_index_count: 223
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 165
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 110
- index_only_pool_count: 58
- aihot_index_only_count: 24
- aihot_core_count: 11
- aihot_daily_index_only_count: 18
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 223
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 33 result(s): missing_ai_anchor_in_result=13; broad_list_or_market_report=9; social_or_profile_source=6; noise_term:hiring=2; directory_or_search_page=1; noise_term:career=1; noise_term:definition=1; source-artifact keyword: Anysearch business fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch Search service temporarily unavailable.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=103; news=25; media=21; industry_media=17; newsletter=16; operators=16; developer=14; product=13; official=9; builder=6; funding=5; government_regulator=3; company_official=1; marketplace=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=101; fetched-readable-text-main=47; fetched-readable-text-article=20; no-url-summary-only=20; fetched-readable-text-body-visible-text=19; fetched-readable-text-json-ld=13; blocked-http-403=9; summary-only-low-readable-body=8; blocked-http-401=7; timeout-fallback-visible-text=4; binary-text-rejected=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 16
- B: 136
- S: 31
- A: 46
- ungraded: 21

## Evidence Object Type Distribution

- event: 93
- supporting_article: 11
- event_on_official_page: 7
- case_or_customer: 90
- regulatory_or_procurement: 14
- changelog_or_release: 2
- repo_readme_or_index: 1
- research_or_report: 11
- search_result_or_tool_directory: 2
- pricing_change: 3
- official_index_or_directory: 15
- community_feedback: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 14
- 外围探索信号 (outside-core-exploration): 10
- 技术迭代信号 (technical-iteration-signal): 32
- 开发者生态信号 (developer-ecosystem-signal): 19
- 资本市场信号 (capital-market-signal): 13
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 17
- AI Hardware investment and financing (ai-hardware-investment-signal): 10
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 11
- china-local-project (china-local-project): 3
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 11
- 成熟信号 (mature-commercial-signal): 30
- china-startup-funding (china-startup-funding): 4
- uncategorized (uncategorized): 73
- china-policy-regulation (china-policy-regulation): 3

## Keyword Group Distribution

- early-direction-signal: 14
- outside-core-exploration: 10
- technical-iteration-signal: 32
- developer-ecosystem-signal: 22
- capital-market-signal: 13
- enterprise-ai-implementation-signal: 17
- ai-hardware-investment-signal: 10
- ai-hardware-trend-innovation-signal: 11
- china-local-project: 3
- ai-hardware-scenario-service-signal: 11
- mature-commercial-signal: 27
- china-startup-funding: 4
- uncategorized: 73
- china-policy-regulation: 3

## Keyword Search Path Distribution

- a_media_gdelt: 8
- fde_customer_case: 5
- hardware_product_specs: 6
- hardware_supply_agreement: 3
- hardware_capex: 3
- hardware_capacity_fab: 5
- capital_startup: 2
- fde_production_rollout: 6
- hardware_shipment_deployment: 8
- hardware_oem_odm: 5
- procurement_marketplace: 6
- fde_earnings_disclosure: 2
- official_original: 8
- fde_procurement_contract: 5
- developer_ecosystem: 5
- industry_landing: 6

## Keyword Search Intent Distribution

- find_market_trend: 8
- find_customer_case: 20
- find_startups: 16
- find_hardware_supply: 3
- verify_company_action: 3
- find_capacity_capex: 4
- find_original_source: 25
- find_procurement_signal: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
