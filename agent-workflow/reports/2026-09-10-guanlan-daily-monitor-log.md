# 2026-09-10 Guanlan Daily Monitor Log

- generated_at: 2026-09-10T00:26:51.453Z
- raw_count: 236
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 14
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 70 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 56 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 14
- recovered_failed_sources_count: 7
- unrecovered_failed_sources_count: 7
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-10/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-10/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-10/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-10/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-10/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 56
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 567
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 47
- keyword_search_count: 98
- keyword_search_non_community_count: 98
- keyword_search_path_distribution: procurement_marketplace=11; fde_procurement_contract=10; hardware_shipment_deployment=10; industry_landing=10; official_original=10; fde_customer_case=7; hardware_product_specs=7; a_media_gdelt=6; developer_ecosystem=4; fde_earnings_disclosure=4; fde_production_rollout=4; hardware_oem_odm=4; china_ai_hardware_funding=3; hardware_capacity_fab=2; hardware_capex=2; hardware_supply_agreement=2; capital_startup=1; china_vertical_agent_funding=1
- keyword_search_intent_distribution: find_original_source=33; find_customer_case=25; find_startups=21; find_market_trend=6; find_procurement_signal=6; verify_company_action=3; find_capacity_capex=2; find_hardware_supply=2
- source_distribution: keyword-search=98; rss-feed=91; aihot=47
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 107
- enterprise_ai_transformation_stage_distribution: platform_enablement=50; production_rollout=28; pilot=12; ai_transformation=6; procurement=6; org_build=5
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=98; rss-feed=91; aihot=47
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=88; mature-commercial-signal=33; technical-iteration-signal=22; enterprise-ai-implementation-signal=20; early-direction-signal=17; capital-market-signal=11; developer-ecosystem-signal=10; ai-hardware-scenario-service-signal=8; ai-hardware-trend-innovation-signal=8; outside-core-exploration=8; china-ai-hardware-funding=3; ai-hardware-investment-signal=2; china-local-project=2; targeted-pool-gap-refill=2; china-listed-disclosure=1; china-vertical-agent-funding=1
- theme_distribution: uncategorized=88; mature-commercial-signal=33; technical-iteration-signal=23; enterprise-ai-implementation-signal=20; early-direction-signal=18; capital-market-signal=12; ai-hardware-scenario-service-signal=8; ai-hardware-trend-innovation-signal=8; outside-core-exploration=8; developer-ecosystem-signal=7; china-ai-hardware-funding=3; ai-hardware-investment-signal=2; china-local-project=2; targeted-pool-gap-refill=2; china-listed-disclosure=1; china-vertical-agent-funding=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=94; event=80; regulatory_or_procurement=17; official_index_or_directory=12; supporting_article=10; research_or_report=9; changelog_or_release=6; community_feedback=3; event_on_official_page=3; pricing_change=1; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=121; core_pool=49; index_only=41; emerging_pool=27; discard=20
- pool_index_route_distribution: watchlist=121; core_pool=49; index_only=41; emerging_pool=27
- pool_index_count: 216
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 175
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 126
- index_only_pool_count: 41
- aihot_index_only_count: 17
- aihot_core_count: 17
- aihot_daily_index_only_count: 14
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 216
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact gdelt: source collection command failed; see gdelt-source-run.log; source-artifact keyword: keyword-search pre-gate filtered 58 result(s): social_or_profile_source=28; missing_ai_anchor_in_result=18; broad_list_or_market_report=9; noise_term:hiring=3; source-artifact keyword: Anysearch fallback for query "FDE AI implementation production rollout announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "open-source AI agent GitHub enterprise adoption announced September 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; targeted-refill pre-gate filtered 6 result(s): missing_ai_anchor_in_result=5; broad_list_or_market_report=1; targeted pool/core refill cycle 1 added 2 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=92; media=24; industry_media=21; newsletter=16; official=16; product=16; news=14; developer=13; funding=9; builder=8; operators=6; industry=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=79; fetched-readable-text-main=45; fetched-readable-text-article=32; fetched-readable-text-body-visible-text=28; no-url-summary-only=17; blocked-http-403=12; fetched-readable-text-json-ld=12; summary-only-low-readable-body=7; blocked-http-401=2; binary-text-rejected=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 44
- A: 38
- B: 127
- ungraded: 21
- C: 6

## Evidence Object Type Distribution

- changelog_or_release: 6
- event: 80
- case_or_customer: 94
- community_feedback: 3
- regulatory_or_procurement: 17
- research_or_report: 9
- pricing_change: 1
- search_result_or_tool_directory: 1
- supporting_article: 10
- event_on_official_page: 3
- official_index_or_directory: 12

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 33
- 外围探索信号 (outside-core-exploration): 8
- 早期信号 (early-direction-signal): 18
- 技术迭代信号 (technical-iteration-signal): 23
- 开发者生态信号 (developer-ecosystem-signal): 7
- 资本市场信号 (capital-market-signal): 12
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 20
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 8
- china-vertical-agent-funding (china-vertical-agent-funding): 1
- china-local-project (china-local-project): 2
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 8
- china-ai-hardware-funding (china-ai-hardware-funding): 3
- targeted-pool-gap-refill (targeted-pool-gap-refill): 2
- uncategorized (uncategorized): 88
- china-listed-disclosure (china-listed-disclosure): 1

## Keyword Group Distribution

- mature-commercial-signal: 33
- outside-core-exploration: 8
- early-direction-signal: 17
- technical-iteration-signal: 22
- developer-ecosystem-signal: 10
- capital-market-signal: 11
- enterprise-ai-implementation-signal: 20
- ai-hardware-investment-signal: 2
- ai-hardware-scenario-service-signal: 8
- china-vertical-agent-funding: 1
- china-local-project: 2
- ai-hardware-trend-innovation-signal: 8
- china-ai-hardware-funding: 3
- targeted-pool-gap-refill: 2
- uncategorized: 88
- china-listed-disclosure: 1

## Keyword Search Path Distribution

- procurement_marketplace: 11
- fde_customer_case: 7
- hardware_product_specs: 7
- hardware_capacity_fab: 2
- china_vertical_agent_funding: 1
- hardware_capex: 2
- capital_startup: 1
- fde_production_rollout: 4
- hardware_shipment_deployment: 10
- hardware_supply_agreement: 2
- china_ai_hardware_funding: 3
- fde_procurement_contract: 10
- fde_earnings_disclosure: 4
- a_media_gdelt: 6
- developer_ecosystem: 4
- hardware_oem_odm: 4
- official_original: 10
- industry_landing: 10

## Keyword Search Intent Distribution

- find_startups: 21
- find_customer_case: 25
- find_capacity_capex: 2
- verify_company_action: 3
- find_hardware_supply: 2
- find_original_source: 33
- find_procurement_signal: 6
- find_market_trend: 6

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
