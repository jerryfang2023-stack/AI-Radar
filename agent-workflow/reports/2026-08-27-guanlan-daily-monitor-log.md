# 2026-08-27 Guanlan Daily Monitor Log

- generated_at: 2026-08-27T03:40:17.719Z
- raw_count: 236
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 11
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 83 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 54 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 15
- recovered_failed_sources_count: 15
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-27/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-27/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-27/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-27/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-27/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 54
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 583
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 41
- keyword_search_count: 83
- keyword_search_non_community_count: 83
- keyword_search_path_distribution: hardware_shipment_deployment=11; official_original=10; hardware_capacity_fab=9; developer_ecosystem=7; fde_procurement_contract=6; fde_production_rollout=6; industry_landing=6; procurement_marketplace=6; a_media_gdelt=4; capital_startup=4; fde_earnings_disclosure=4; hardware_oem_odm=4; hardware_product_specs=4; fde_customer_case=1; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=27; find_customer_case=20; find_startups=20; find_capacity_capex=8; find_market_trend=4; find_procurement_signal=2; find_hardware_supply=1; verify_company_action=1
- source_distribution: rss-feed=87; keyword-search=83; aihot=41; gdelt=25
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 110
- enterprise_ai_transformation_stage_distribution: platform_enablement=56; pilot=22; production_rollout=17; ai_transformation=9; org_build=4; procurement=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: rss-feed=87; keyword-search=83; aihot=41; gdelt=25
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=81; technical-iteration-signal=24; mature-commercial-signal=21; developer-ecosystem-signal=19; enterprise-ai-implementation-signal=18; early-direction-signal=15; ai-hardware-trend-innovation-signal=14; capital-market-signal=14; ai-hardware-scenario-service-signal=12; outside-core-exploration=7; ai-hardware-investment-signal=5; china-startup-funding=3; china-policy-regulation=2; china-listed-disclosure=1
- theme_distribution: uncategorized=81; technical-iteration-signal=25; mature-commercial-signal=22; enterprise-ai-implementation-signal=18; capital-market-signal=16; developer-ecosystem-signal=15; early-direction-signal=15; ai-hardware-trend-innovation-signal=14; ai-hardware-scenario-service-signal=12; outside-core-exploration=7; ai-hardware-investment-signal=5; china-startup-funding=3; china-policy-regulation=2; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=98; event=88; official_index_or_directory=11; regulatory_or_procurement=11; supporting_article=10; research_or_report=7; changelog_or_release=6; search_result_or_tool_directory=2; community_feedback=1; event_on_official_page=1; pricing_change=1
- pool_route_distribution: watchlist=117; core_pool=46; index_only=42; emerging_pool=35; discard=24
- pool_index_route_distribution: watchlist=117; core_pool=46; index_only=42; emerging_pool=35
- pool_index_count: 212
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 170
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 124
- index_only_pool_count: 42
- aihot_index_only_count: 15
- aihot_core_count: 15
- aihot_daily_index_only_count: 11
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 212
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 47 result(s): social_or_profile_source=24; broad_list_or_market_report=10; missing_ai_anchor_in_result=10; directory_or_search_page=1; noise_term:career=1; noise_term:hiring=1; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "agent governance evals production rollout enterprise AI announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "open-source AI agent GitHub enterprise adoption announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=81; media=22; news=21; product=17; industry_media=16; official=16; operators=16; developer=14; newsletter=13; funding=9; builder=8; industry=3
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=86; fetched-readable-text-main=41; fetched-readable-text-body-visible-text=25; fetched-readable-text-article=24; fetched-readable-text-json-ld=18; blocked-http-403=15; no-url-summary-only=14; summary-only-low-readable-body=6; blocked-http-401=3; http-429-fallback-text=2; binary-text-rejected=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 43
- A: 43
- B: 118
- C: 16
- ungraded: 16

## Evidence Object Type Distribution

- event: 88
- case_or_customer: 98
- changelog_or_release: 6
- supporting_article: 10
- regulatory_or_procurement: 11
- pricing_change: 1
- official_index_or_directory: 11
- community_feedback: 1
- research_or_report: 7
- search_result_or_tool_directory: 2
- event_on_official_page: 1

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 7
- 早期信号 (early-direction-signal): 15
- 开发者生态信号 (developer-ecosystem-signal): 15
- 成熟信号 (mature-commercial-signal): 22
- 技术迭代信号 (technical-iteration-signal): 25
- 资本市场信号 (capital-market-signal): 16
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 18
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 12
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 14
- china-listed-disclosure (china-listed-disclosure): 1
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- uncategorized (uncategorized): 81
- china-startup-funding (china-startup-funding): 3
- china-policy-regulation (china-policy-regulation): 2

## Keyword Group Distribution

- outside-core-exploration: 7
- early-direction-signal: 15
- developer-ecosystem-signal: 19
- mature-commercial-signal: 21
- technical-iteration-signal: 24
- capital-market-signal: 14
- enterprise-ai-implementation-signal: 18
- ai-hardware-scenario-service-signal: 12
- ai-hardware-trend-innovation-signal: 14
- china-listed-disclosure: 1
- ai-hardware-investment-signal: 5
- uncategorized: 81
- china-startup-funding: 3
- china-policy-regulation: 2

## Keyword Search Path Distribution

- capital_startup: 4
- fde_procurement_contract: 6
- hardware_product_specs: 4
- hardware_supply_agreement: 1
- fde_earnings_disclosure: 4
- a_media_gdelt: 4
- procurement_marketplace: 6
- hardware_capacity_fab: 9
- hardware_shipment_deployment: 11
- fde_production_rollout: 6
- developer_ecosystem: 7
- official_original: 10
- hardware_oem_odm: 4
- industry_landing: 6
- fde_customer_case: 1

## Keyword Search Intent Distribution

- find_startups: 20
- find_customer_case: 20
- find_hardware_supply: 1
- verify_company_action: 1
- find_market_trend: 4
- find_original_source: 27
- find_capacity_capex: 8
- find_procurement_signal: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
