# 2026-08-26 Guanlan Daily Monitor Log

- generated_at: 2026-08-26T03:44:13.600Z
- raw_count: 250
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 15
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 90 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 52 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 19
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 11
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-26/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-26/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-26/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-26/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-26/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 52
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 580
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 45
- keyword_search_count: 91
- keyword_search_non_community_count: 91
- keyword_search_path_distribution: official_original=20; hardware_shipment_deployment=10; developer_ecosystem=8; fde_production_rollout=8; fde_procurement_contract=6; industry_landing=6; a_media_gdelt=5; capital_startup=5; procurement_marketplace=5; fde_earnings_disclosure=4; hardware_capacity_fab=4; fde_customer_case=3; hardware_oem_odm=3; hardware_product_specs=3; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=35; find_customer_case=21; find_startups=21; find_market_trend=5; find_capacity_capex=3; find_procurement_signal=3; verify_company_action=2; find_hardware_supply=1
- source_distribution: keyword-search=91; rss-feed=86; aihot=45; gdelt=28
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 108
- enterprise_ai_transformation_stage_distribution: platform_enablement=51; pilot=21; production_rollout=20; ai_transformation=10; org_build=4; procurement=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=91; rss-feed=86; aihot=45; gdelt=28
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=77; technical-iteration-signal=27; developer-ecosystem-signal=24; mature-commercial-signal=22; enterprise-ai-implementation-signal=20; capital-market-signal=15; early-direction-signal=13; targeted-pool-gap-refill=12; ai-hardware-trend-innovation-signal=11; ai-hardware-scenario-service-signal=8; outside-core-exploration=7; ai-hardware-investment-signal=6; china-startup-funding=4; china-listed-disclosure=2; china-policy-regulation=2
- theme_distribution: uncategorized=77; technical-iteration-signal=29; mature-commercial-signal=23; enterprise-ai-implementation-signal=20; developer-ecosystem-signal=19; capital-market-signal=16; early-direction-signal=14; targeted-pool-gap-refill=12; ai-hardware-trend-innovation-signal=11; ai-hardware-scenario-service-signal=8; outside-core-exploration=7; ai-hardware-investment-signal=6; china-startup-funding=4; china-listed-disclosure=2; china-policy-regulation=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=109; event=80; official_index_or_directory=11; regulatory_or_procurement=11; supporting_article=10; research_or_report=9; changelog_or_release=7; event_on_official_page=4; community_feedback=3; pricing_change=3; search_result_or_tool_directory=2; repo_readme_or_index=1
- pool_route_distribution: watchlist=122; core_pool=50; index_only=49; emerging_pool=36; discard=22
- pool_index_route_distribution: watchlist=122; core_pool=50; index_only=49; emerging_pool=36
- pool_index_count: 228
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 179
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 129
- index_only_pool_count: 49
- aihot_index_only_count: 21
- aihot_core_count: 17
- aihot_daily_index_only_count: 15
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 228
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 47 result(s): social_or_profile_source=31; missing_ai_anchor_in_result=8; broad_list_or_market_report=6; noise_term:career=1; noise_term:hiring=1; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "FDE AI implementation production rollout announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "agent governance evals production rollout enterprise AI announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "open-source AI agent GitHub enterprise adoption announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch tech fallback for query "(人工智能产业园 OR 大模型项目 OR 智算中心) (签约 OR 落地 OR 开工 OR 投产) (市政府 OR 区政府 OR 管委会) announced August 2026 (AI infrastructure OR data center OR fab) (capex OR "capital expenditure" OR "capital spending" OR investment) (earnings OR official)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "(人工智能产业园 OR 大模型项目 OR 智算中心) (签约 OR 落地 OR 开工 OR 投产) (市政府 OR 区政府 OR 管委会) announced August 2026 (AI infrastructure OR data center OR fab) (capex OR "capital expenditure" OR "capital spending" OR investment) (earnings OR official)": tech: Anysearch Search service temporarily unavailable.; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=1; social_or_profile_source=1; targeted pool/core refill cycle 1 added 12 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=94; media=22; industry_media=20; operators=18; news=17; official=17; developer=16; newsletter=13; product=11; funding=10; builder=9; industry=2; marketplace=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=81; fetched-readable-text-main=52; fetched-readable-text-body-visible-text=31; fetched-readable-text-article=24; fetched-readable-text-json-ld=18; no-url-summary-only=18; blocked-http-403=11; summary-only-low-readable-body=8; blocked-http-401=5; binary-text-rejected=1; fetched-readable-text-meta-description=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 39
- B: 133
- S: 40
- C: 18
- ungraded: 20

## Evidence Object Type Distribution

- event: 80
- regulatory_or_procurement: 11
- repo_readme_or_index: 1
- case_or_customer: 109
- changelog_or_release: 7
- research_or_report: 9
- supporting_article: 10
- pricing_change: 3
- community_feedback: 3
- search_result_or_tool_directory: 2
- event_on_official_page: 4
- official_index_or_directory: 11

## Theme Distribution

- 早期信号 (early-direction-signal): 14
- 开发者生态信号 (developer-ecosystem-signal): 19
- 技术迭代信号 (technical-iteration-signal): 29
- 资本市场信号 (capital-market-signal): 16
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 20
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 8
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 11
- china-listed-disclosure (china-listed-disclosure): 2
- AI Hardware investment and financing (ai-hardware-investment-signal): 6
- 外围探索信号 (outside-core-exploration): 7
- 成熟信号 (mature-commercial-signal): 23
- targeted-pool-gap-refill (targeted-pool-gap-refill): 12
- uncategorized (uncategorized): 77
- china-startup-funding (china-startup-funding): 4
- china-policy-regulation (china-policy-regulation): 2

## Keyword Group Distribution

- early-direction-signal: 13
- developer-ecosystem-signal: 24
- technical-iteration-signal: 27
- capital-market-signal: 15
- enterprise-ai-implementation-signal: 20
- ai-hardware-scenario-service-signal: 8
- ai-hardware-trend-innovation-signal: 11
- china-listed-disclosure: 2
- ai-hardware-investment-signal: 6
- outside-core-exploration: 7
- mature-commercial-signal: 22
- targeted-pool-gap-refill: 12
- uncategorized: 77
- china-startup-funding: 4
- china-policy-regulation: 2

## Keyword Search Path Distribution

- a_media_gdelt: 5
- fde_procurement_contract: 6
- hardware_product_specs: 3
- hardware_supply_agreement: 1
- fde_earnings_disclosure: 4
- capital_startup: 5
- hardware_capacity_fab: 4
- procurement_marketplace: 5
- hardware_shipment_deployment: 10
- hardware_oem_odm: 3
- fde_production_rollout: 8
- fde_customer_case: 3
- official_original: 20
- developer_ecosystem: 8
- industry_landing: 6

## Keyword Search Intent Distribution

- find_market_trend: 5
- find_customer_case: 21
- find_hardware_supply: 1
- verify_company_action: 2
- find_startups: 21
- find_capacity_capex: 3
- find_original_source: 35
- find_procurement_signal: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
