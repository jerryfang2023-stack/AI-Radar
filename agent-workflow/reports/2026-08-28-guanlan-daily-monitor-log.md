# 2026-08-28 Guanlan Daily Monitor Log

- generated_at: 2026-08-28T02:25:09.921Z
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
- provider_fallback_notes: Search cross-entry dedupe removed 87 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 49 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 18
- recovered_failed_sources_count: 7
- unrecovered_failed_sources_count: 11
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-28/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-28/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-28/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-28/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-28/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 49
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 542
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 47
- keyword_search_count: 89
- keyword_search_non_community_count: 89
- keyword_search_path_distribution: official_original=20; hardware_shipment_deployment=10; developer_ecosystem=7; fde_procurement_contract=7; hardware_capacity_fab=7; procurement_marketplace=7; fde_production_rollout=6; hardware_product_specs=6; hardware_oem_odm=5; a_media_gdelt=4; fde_earnings_disclosure=4; capital_startup=2; hardware_supply_agreement=2; industry_landing=2
- keyword_search_intent_distribution: find_original_source=38; find_customer_case=17; find_startups=17; find_capacity_capex=6; find_market_trend=4; find_procurement_signal=4; find_hardware_supply=2; verify_company_action=1
- source_distribution: keyword-search=89; rss-feed=87; aihot=47; gdelt=26
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 113
- enterprise_ai_transformation_stage_distribution: platform_enablement=56; pilot=23; production_rollout=21; ai_transformation=7; procurement=4; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=89; rss-feed=87; aihot=47; gdelt=26
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=78; technical-iteration-signal=30; developer-ecosystem-signal=26; enterprise-ai-implementation-signal=18; mature-commercial-signal=18; early-direction-signal=15; ai-hardware-trend-innovation-signal=14; ai-hardware-scenario-service-signal=11; capital-market-signal=10; outside-core-exploration=10; targeted-pool-gap-refill=8; ai-hardware-investment-signal=4; china-startup-funding=4; china-policy-regulation=2; china-listed-disclosure=1
- theme_distribution: uncategorized=78; technical-iteration-signal=32; developer-ecosystem-signal=21; mature-commercial-signal=19; enterprise-ai-implementation-signal=18; early-direction-signal=16; ai-hardware-trend-innovation-signal=14; ai-hardware-scenario-service-signal=11; capital-market-signal=11; outside-core-exploration=10; targeted-pool-gap-refill=8; ai-hardware-investment-signal=4; china-startup-funding=4; china-policy-regulation=2; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=104; event=86; research_or_report=12; regulatory_or_procurement=11; official_index_or_directory=9; supporting_article=9; changelog_or_release=7; community_feedback=3; event_on_official_page=3; search_result_or_tool_directory=3; ecosystem_package_or_model_index=1; pricing_change=1
- pool_route_distribution: watchlist=124; core_pool=46; index_only=46; emerging_pool=33; discard=26
- pool_index_route_distribution: watchlist=124; core_pool=46; index_only=46; emerging_pool=33
- pool_index_count: 223
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 177
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 131
- index_only_pool_count: 46
- aihot_index_only_count: 15
- aihot_core_count: 14
- aihot_daily_index_only_count: 13
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 223
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 45 result(s): social_or_profile_source=23; broad_list_or_market_report=10; missing_ai_anchor_in_result=9; directory_or_search_page=1; noise_term:career=1; noise_term:hiring=1; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "applied AI engineer enterprise customer case announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "enterprise AI transformation production rollout customer deployment announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "agent governance evals production rollout enterprise AI announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "open-source AI agent GitHub enterprise adoption announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; targeted pool/core refill cycle 1 added 8 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=91; media=27; news=20; developer=17; industry_media=17; operators=17; official=15; product=15; newsletter=12; builder=9; funding=7; industry=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=82; fetched-readable-text-main=49; fetched-readable-text-article=25; fetched-readable-text-body-visible-text=25; fetched-readable-text-json-ld=21; no-url-summary-only=16; blocked-http-403=12; summary-only-low-readable-body=8; blocked-http-401=5; http-429-fallback-text=3; binary-text-rejected=1; fetch-failed-fallback-visible-text=1; fetched-readable-text-meta-description=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 125
- A: 48
- S: 42
- C: 17
- ungraded: 17

## Evidence Object Type Distribution

- case_or_customer: 104
- event: 86
- changelog_or_release: 7
- regulatory_or_procurement: 11
- research_or_report: 12
- pricing_change: 1
- ecosystem_package_or_model_index: 1
- community_feedback: 3
- supporting_article: 9
- search_result_or_tool_directory: 3
- official_index_or_directory: 9
- event_on_official_page: 3

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 21
- 成熟信号 (mature-commercial-signal): 19
- 早期信号 (early-direction-signal): 16
- 技术迭代信号 (technical-iteration-signal): 32
- 资本市场信号 (capital-market-signal): 11
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 18
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 11
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 14
- china-listed-disclosure (china-listed-disclosure): 1
- AI Hardware investment and financing (ai-hardware-investment-signal): 4
- 外围探索信号 (outside-core-exploration): 10
- targeted-pool-gap-refill (targeted-pool-gap-refill): 8
- uncategorized (uncategorized): 78
- china-startup-funding (china-startup-funding): 4
- china-policy-regulation (china-policy-regulation): 2

## Keyword Group Distribution

- developer-ecosystem-signal: 26
- mature-commercial-signal: 18
- early-direction-signal: 15
- technical-iteration-signal: 30
- capital-market-signal: 10
- enterprise-ai-implementation-signal: 18
- ai-hardware-scenario-service-signal: 11
- ai-hardware-trend-innovation-signal: 14
- china-listed-disclosure: 1
- ai-hardware-investment-signal: 4
- outside-core-exploration: 10
- targeted-pool-gap-refill: 8
- uncategorized: 78
- china-startup-funding: 4
- china-policy-regulation: 2

## Keyword Search Path Distribution

- capital_startup: 2
- fde_procurement_contract: 7
- hardware_capacity_fab: 7
- hardware_product_specs: 6
- fde_earnings_disclosure: 4
- procurement_marketplace: 7
- hardware_shipment_deployment: 10
- hardware_supply_agreement: 2
- fde_production_rollout: 6
- a_media_gdelt: 4
- hardware_oem_odm: 5
- developer_ecosystem: 7
- official_original: 20
- industry_landing: 2

## Keyword Search Intent Distribution

- find_startups: 17
- find_customer_case: 17
- find_capacity_capex: 6
- find_original_source: 38
- verify_company_action: 1
- find_hardware_supply: 2
- find_market_trend: 4
- find_procurement_signal: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
