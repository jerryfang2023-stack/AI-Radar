# 2026-08-30 Guanlan Daily Monitor Log

- generated_at: 2026-08-30T01:28:52.964Z
- raw_count: 244
- aihot_mode: source-artifacts
- aihot_since:
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 6
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 62 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 66 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 17
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 9
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-30/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-30/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-30/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-30/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-30/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 66
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 447
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 28
- keyword_search_count: 101
- keyword_search_non_community_count: 101
- keyword_search_path_distribution: official_original=30; hardware_shipment_deployment=13; fde_procurement_contract=7; fde_production_rollout=7; developer_ecosystem=6; hardware_capacity_fab=6; procurement_marketplace=6; a_media_gdelt=5; hardware_product_specs=5; industry_landing=5; fde_earnings_disclosure=4; capital_startup=3; hardware_oem_odm=3; fde_customer_case=1
- keyword_search_intent_distribution: find_original_source=45; find_startups=23; find_customer_case=19; find_capacity_capex=6; find_market_trend=5; find_procurement_signal=3
- source_distribution: keyword-search=101; rss-feed=87; aihot=28; gdelt=28
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 114
- enterprise_ai_transformation_stage_distribution: platform_enablement=50; production_rollout=27; pilot=23; ai_transformation=6; org_build=5; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=101; rss-feed=87; aihot=28; gdelt=28
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=79; developer-ecosystem-signal=23; technical-iteration-signal=22; targeted-pool-gap-refill=20; enterprise-ai-implementation-signal=19; mature-commercial-signal=15; capital-market-signal=14; ai-hardware-scenario-service-signal=11; ai-hardware-trend-innovation-signal=11; early-direction-signal=11; ai-hardware-investment-signal=7; outside-core-exploration=6; china-startup-funding=4; china-policy-regulation=2
- theme_distribution: uncategorized=79; technical-iteration-signal=23; developer-ecosystem-signal=20; targeted-pool-gap-refill=20; enterprise-ai-implementation-signal=19; capital-market-signal=15; mature-commercial-signal=15; early-direction-signal=12; ai-hardware-scenario-service-signal=11; ai-hardware-trend-innovation-signal=11; ai-hardware-investment-signal=7; outside-core-exploration=6; china-startup-funding=4; china-policy-regulation=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=107; event=76; regulatory_or_procurement=18; research_or_report=10; supporting_article=9; official_index_or_directory=7; changelog_or_release=5; pricing_change=4; community_feedback=3; search_result_or_tool_directory=3; event_on_official_page=1; repo_readme_or_index=1
- pool_route_distribution: watchlist=123; core_pool=44; index_only=44; emerging_pool=39; discard=27
- pool_index_route_distribution: watchlist=123; core_pool=44; index_only=44; emerging_pool=39
- pool_index_count: 217
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 173
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 129
- index_only_pool_count: 44
- aihot_index_only_count: 11
- aihot_core_count: 13
- aihot_daily_index_only_count: 6
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=1/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 217
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 47 result(s): social_or_profile_source=29; broad_list_or_market_report=8; missing_ai_anchor_in_result=8; directory_or_search_page=1; noise_term:hiring=1; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch tech fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "agent governance evals production rollout enterprise AI announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=2; social_or_profile_source=2; targeted pool/core refill cycle 1 added 20 item(s) for important_case=0/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=99; media=22; news=21; operators=20; industry_media=18; developer=13; product=13; newsletter=12; builder=10; official=8; funding=7; company_official=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=81; fetched-readable-text-main=46; fetched-readable-text-body-visible-text=29; fetched-readable-text-article=25; fetched-readable-text-json-ld=22; blocked-http-403=17; no-url-summary-only=8; blocked-http-401=5; summary-only-low-readable-body=5; http-429-fallback-text=2; binary-text-rejected=1; fetch-failed-fallback-visible-text=1; fetched-readable-text-meta-description=1; http-405-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 43
- B: 130
- ungraded: 19
- S: 32
- C: 20

## Evidence Object Type Distribution

- regulatory_or_procurement: 18
- event: 76
- pricing_change: 4
- case_or_customer: 107
- changelog_or_release: 5
- repo_readme_or_index: 1
- community_feedback: 3
- research_or_report: 10
- search_result_or_tool_directory: 3
- supporting_article: 9
- official_index_or_directory: 7
- event_on_official_page: 1

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 23
- 开发者生态信号 (developer-ecosystem-signal): 20
- 早期信号 (early-direction-signal): 12
- 资本市场信号 (capital-market-signal): 15
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 19
- AI Hardware investment and financing (ai-hardware-investment-signal): 7
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 11
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 11
- 成熟信号 (mature-commercial-signal): 15
- 外围探索信号 (outside-core-exploration): 6
- targeted-pool-gap-refill (targeted-pool-gap-refill): 20
- uncategorized (uncategorized): 79
- china-policy-regulation (china-policy-regulation): 2
- china-startup-funding (china-startup-funding): 4

## Keyword Group Distribution

- technical-iteration-signal: 22
- developer-ecosystem-signal: 23
- early-direction-signal: 11
- capital-market-signal: 14
- enterprise-ai-implementation-signal: 19
- ai-hardware-investment-signal: 7
- ai-hardware-scenario-service-signal: 11
- ai-hardware-trend-innovation-signal: 11
- mature-commercial-signal: 15
- outside-core-exploration: 6
- targeted-pool-gap-refill: 20
- uncategorized: 79
- china-policy-regulation: 2
- china-startup-funding: 4

## Keyword Search Path Distribution

- hardware_oem_odm: 3
- a_media_gdelt: 5
- fde_procurement_contract: 7
- hardware_product_specs: 5
- hardware_shipment_deployment: 13
- fde_production_rollout: 7
- hardware_capacity_fab: 6
- developer_ecosystem: 6
- capital_startup: 3
- fde_earnings_disclosure: 4
- procurement_marketplace: 6
- official_original: 30
- industry_landing: 5
- fde_customer_case: 1

## Keyword Search Intent Distribution

- find_startups: 23
- find_market_trend: 5
- find_customer_case: 19
- find_original_source: 45
- find_capacity_capex: 6
- find_procurement_signal: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
