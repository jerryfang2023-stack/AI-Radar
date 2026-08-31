# 2026-08-31 Guanlan Daily Monitor Log

- generated_at: 2026-08-31T02:34:32.455Z
- raw_count: 237
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
- provider_fallback_notes: Search cross-entry dedupe removed 61 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 65 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 19
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 11
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-31/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-31/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-31/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-31/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-31/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 65
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 401
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 28
- keyword_search_count: 94
- keyword_search_non_community_count: 94
- keyword_search_path_distribution: official_original=20; hardware_shipment_deployment=13; developer_ecosystem=7; fde_production_rollout=7; procurement_marketplace=7; fde_procurement_contract=6; hardware_capacity_fab=6; hardware_oem_odm=6; a_media_gdelt=5; capital_startup=4; fde_earnings_disclosure=4; hardware_product_specs=4; industry_landing=4; fde_customer_case=1
- keyword_search_intent_distribution: find_original_source=42; find_customer_case=19; find_startups=18; find_capacity_capex=5; find_market_trend=5; find_procurement_signal=4; verify_company_action=1
- source_distribution: keyword-search=94; rss-feed=87; aihot=28; gdelt=28
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 113
- enterprise_ai_transformation_stage_distribution: platform_enablement=53; production_rollout=27; pilot=18; ai_transformation=8; org_build=4; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=94; rss-feed=87; aihot=28; gdelt=28
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=81; mature-commercial-signal=24; technical-iteration-signal=21; enterprise-ai-implementation-signal=19; developer-ecosystem-signal=15; ai-hardware-trend-innovation-signal=12; capital-market-signal=12; targeted-pool-gap-refill=12; ai-hardware-scenario-service-signal=11; early-direction-signal=11; outside-core-exploration=8; ai-hardware-investment-signal=5; china-startup-funding=3; china-policy-regulation=2; china-listed-disclosure=1
- theme_distribution: uncategorized=81; mature-commercial-signal=25; technical-iteration-signal=22; enterprise-ai-implementation-signal=19; capital-market-signal=13; ai-hardware-trend-innovation-signal=12; early-direction-signal=12; targeted-pool-gap-refill=12; ai-hardware-scenario-service-signal=11; developer-ecosystem-signal=11; outside-core-exploration=8; ai-hardware-investment-signal=5; china-startup-funding=3; china-policy-regulation=2; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=111; event=78; research_or_report=13; regulatory_or_procurement=12; community_feedback=5; official_index_or_directory=5; supporting_article=5; changelog_or_release=4; pricing_change=2; search_result_or_tool_directory=2
- pool_route_distribution: watchlist=125; core_pool=48; index_only=38; emerging_pool=36; discard=21
- pool_index_route_distribution: watchlist=125; core_pool=48; index_only=38; emerging_pool=36
- pool_index_count: 216
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 178
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 130
- index_only_pool_count: 38
- aihot_index_only_count: 10
- aihot_core_count: 8
- aihot_daily_index_only_count: 2
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 216
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 50 result(s): social_or_profile_source=27; missing_ai_anchor_in_result=11; broad_list_or_market_report=10; noise_term:career=1; noise_term:hiring=1; source-artifact keyword: Anysearch business fallback for query "AI implementation startup funding enterprise workflow announced August 2026 (startup OR funding OR seed OR pre-seed OR YC OR venture OR Crunchbase OR Dealroom OR PitchBook OR Tracxn)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "enterprise AI transformation production rollout customer deployment announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "agent governance evals production rollout enterprise AI announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "open-source AI agent GitHub enterprise adoption announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; targeted-refill pre-gate filtered 3 result(s): social_or_profile_source=2; missing_ai_anchor_in_result=1; targeted pool/core refill cycle 1 added 12 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=90; news=23; media=22; industry_media=18; operators=18; developer=14; newsletter=12; builder=11; product=11; official=8; funding=7; company_official=1; industry=1; marketplace=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=86; fetched-readable-text-main=42; fetched-readable-text-body-visible-text=30; fetched-readable-text-article=25; fetched-readable-text-json-ld=20; blocked-http-403=13; summary-only-low-readable-body=9; blocked-http-401=4; no-url-summary-only=4; http-429-fallback-text=2; binary-text-rejected=1; http-405-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 45
- B: 123
- C: 18
- S: 32
- ungraded: 19

## Evidence Object Type Distribution

- case_or_customer: 111
- event: 78
- pricing_change: 2
- changelog_or_release: 4
- regulatory_or_procurement: 12
- community_feedback: 5
- research_or_report: 13
- search_result_or_tool_directory: 2
- supporting_article: 5
- official_index_or_directory: 5

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 25
- 技术迭代信号 (technical-iteration-signal): 22
- 资本市场信号 (capital-market-signal): 13
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 19
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 11
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 12
- china-listed-disclosure (china-listed-disclosure): 1
- 早期信号 (early-direction-signal): 12
- 外围探索信号 (outside-core-exploration): 8
- 开发者生态信号 (developer-ecosystem-signal): 11
- targeted-pool-gap-refill (targeted-pool-gap-refill): 12
- uncategorized (uncategorized): 81
- china-startup-funding (china-startup-funding): 3
- china-policy-regulation (china-policy-regulation): 2

## Keyword Group Distribution

- mature-commercial-signal: 24
- technical-iteration-signal: 21
- capital-market-signal: 12
- enterprise-ai-implementation-signal: 19
- ai-hardware-investment-signal: 5
- ai-hardware-scenario-service-signal: 11
- ai-hardware-trend-innovation-signal: 12
- china-listed-disclosure: 1
- early-direction-signal: 11
- outside-core-exploration: 8
- developer-ecosystem-signal: 15
- targeted-pool-gap-refill: 12
- uncategorized: 81
- china-startup-funding: 3
- china-policy-regulation: 2

## Keyword Search Path Distribution

- a_media_gdelt: 5
- fde_procurement_contract: 6
- hardware_product_specs: 4
- hardware_capacity_fab: 6
- fde_earnings_disclosure: 4
- procurement_marketplace: 7
- fde_production_rollout: 7
- hardware_shipment_deployment: 13
- hardware_oem_odm: 6
- capital_startup: 4
- official_original: 20
- developer_ecosystem: 7
- fde_customer_case: 1
- industry_landing: 4

## Keyword Search Intent Distribution

- find_market_trend: 5
- find_customer_case: 19
- find_startups: 18
- find_capacity_capex: 5
- find_original_source: 42
- verify_company_action: 1
- find_procurement_signal: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
