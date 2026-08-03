# 2026-08-03 Guanlan Daily Monitor Log

- generated_at: 2026-08-03T00:21:22.008Z
- raw_count: 228
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
- provider_fallback_notes: Search cross-entry dedupe removed 40 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 62 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 8
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-03/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-03/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-03/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-03/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 62
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 387
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 28
- keyword_search_count: 82
- keyword_search_non_community_count: 82
- keyword_search_path_distribution: fde_earnings_disclosure=7; hardware_capacity_fab=7; hardware_oem_odm=7; hardware_product_specs=7; hardware_shipment_deployment=7; procurement_marketplace=7; fde_production_rollout=6; industry_landing=6; a_media_gdelt=5; capital_startup=5; developer_ecosystem=4; fde_customer_case=4; fde_procurement_contract=4; official_original=3; hardware_supply_agreement=2; hardware_capex=1
- keyword_search_intent_distribution: find_customer_case=23; find_original_source=23; find_startups=14; find_procurement_signal=6; find_capacity_capex=5; find_market_trend=5; verify_company_action=4; find_hardware_supply=2
- source_distribution: keyword-search=82; rss-feed=82; gdelt=36; aihot=28
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 108
- enterprise_ai_transformation_stage_distribution: platform_enablement=60; production_rollout=23; pilot=10; org_build=6; ai_transformation=5; procurement=4
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=82; rss-feed=82; gdelt=36; aihot=28
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=72; mature-commercial-signal=25; technical-iteration-signal=22; enterprise-ai-implementation-signal=19; developer-ecosystem-signal=18; ai-hardware-scenario-service-signal=14; capital-market-signal=12; outside-core-exploration=12; ai-hardware-trend-innovation-signal=10; early-direction-signal=8; ai-hardware-investment-signal=6; china-listed-disclosure=3; china-policy-regulation=3; china-startup-funding=3; china-local-project=1
- theme_distribution: uncategorized=72; mature-commercial-signal=28; technical-iteration-signal=23; enterprise-ai-implementation-signal=19; ai-hardware-scenario-service-signal=14; developer-ecosystem-signal=14; capital-market-signal=12; outside-core-exploration=12; ai-hardware-trend-innovation-signal=10; early-direction-signal=8; ai-hardware-investment-signal=6; china-listed-disclosure=3; china-policy-regulation=3; china-startup-funding=3; china-local-project=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=90; event=76; regulatory_or_procurement=20; research_or_report=12; supporting_article=12; official_index_or_directory=8; community_feedback=3; pricing_change=3; search_result_or_tool_directory=2; changelog_or_release=1; event_on_official_page=1
- pool_route_distribution: watchlist=102; core_pool=60; index_only=45; emerging_pool=36; discard=17
- pool_index_route_distribution: watchlist=102; core_pool=60; index_only=45; emerging_pool=36
- pool_index_count: 211
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 166
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 106
- index_only_pool_count: 45
- aihot_index_only_count: 8
- aihot_core_count: 12
- aihot_daily_index_only_count: 5
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 211
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 43 result(s): missing_ai_anchor_in_result=19; social_or_profile_source=15; broad_list_or_market_report=7; noise_term:affiliate=1; noise_term:translation=1; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch business fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=90; operators=25; news=22; media=17; newsletter=17; industry_media=15; product=12; developer=11; builder=9; funding=4; industry=2; official=2; community=1; government_regulator=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=91; fetched-readable-text-main=47; fetched-readable-text-body-visible-text=29; fetched-readable-text-article=19; fetched-readable-text-json-ld=14; blocked-http-403=10; no-url-summary-only=7; summary-only-low-readable-body=5; binary-text-rejected=1; blocked-http-401=1; fetched-readable-text-meta-description=1; http-404-fallback-text=1; http-408-fallback-text=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 120
- S: 27
- C: 26
- A: 39
- ungraded: 16

## Evidence Object Type Distribution

- event: 76
- case_or_customer: 90
- supporting_article: 12
- changelog_or_release: 1
- regulatory_or_procurement: 20
- community_feedback: 3
- research_or_report: 12
- search_result_or_tool_directory: 2
- pricing_change: 3
- official_index_or_directory: 8
- event_on_official_page: 1

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 14
- 早期信号 (early-direction-signal): 8
- 资本市场信号 (capital-market-signal): 12
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 19
- AI Hardware investment and financing (ai-hardware-investment-signal): 6
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 14
- china-local-project (china-local-project): 1
- china-listed-disclosure (china-listed-disclosure): 3
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 10
- 成熟信号 (mature-commercial-signal): 28
- 外围探索信号 (outside-core-exploration): 12
- 技术迭代信号 (technical-iteration-signal): 23
- china-startup-funding (china-startup-funding): 3
- uncategorized (uncategorized): 72
- china-policy-regulation (china-policy-regulation): 3

## Keyword Group Distribution

- developer-ecosystem-signal: 18
- early-direction-signal: 8
- capital-market-signal: 12
- enterprise-ai-implementation-signal: 19
- ai-hardware-investment-signal: 6
- ai-hardware-scenario-service-signal: 14
- china-local-project: 1
- china-listed-disclosure: 3
- ai-hardware-trend-innovation-signal: 10
- mature-commercial-signal: 25
- outside-core-exploration: 12
- technical-iteration-signal: 22
- china-startup-funding: 3
- uncategorized: 72
- china-policy-regulation: 3

## Keyword Search Path Distribution

- hardware_oem_odm: 7
- capital_startup: 5
- fde_customer_case: 4
- hardware_product_specs: 7
- hardware_capacity_fab: 7
- hardware_capex: 1
- fde_earnings_disclosure: 7
- official_original: 3
- fde_procurement_contract: 4
- hardware_shipment_deployment: 7
- hardware_supply_agreement: 2
- fde_production_rollout: 6
- developer_ecosystem: 4
- procurement_marketplace: 7
- a_media_gdelt: 5
- industry_landing: 6

## Keyword Search Intent Distribution

- find_startups: 14
- find_customer_case: 23
- find_capacity_capex: 5
- verify_company_action: 4
- find_hardware_supply: 2
- find_original_source: 23
- find_procurement_signal: 6
- find_market_trend: 5

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
