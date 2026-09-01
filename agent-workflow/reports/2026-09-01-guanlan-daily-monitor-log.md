# 2026-09-01 Guanlan Daily Monitor Log

- generated_at: 2026-09-01T00:24:23.195Z
- raw_count: 250
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
- provider_fallback_notes: Search cross-entry dedupe removed 59 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 56 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 24
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 16
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-01/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-01/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-01/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-01/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-01/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 56
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 512
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 37
- keyword_search_count: 99
- keyword_search_non_community_count: 99
- keyword_search_path_distribution: official_original=24; hardware_shipment_deployment=11; developer_ecosystem=9; hardware_capacity_fab=9; procurement_marketplace=8; industry_landing=7; a_media_gdelt=6; fde_production_rollout=5; hardware_product_specs=5; fde_customer_case=4; capital_startup=3; fde_procurement_contract=3; hardware_oem_odm=3; fde_earnings_disclosure=2
- keyword_search_intent_distribution: find_original_source=45; find_startups=20; find_customer_case=19; find_capacity_capex=7; find_market_trend=6; find_procurement_signal=2
- source_distribution: keyword-search=99; rss-feed=85; aihot=37; gdelt=29
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 114
- enterprise_ai_transformation_stage_distribution: platform_enablement=56; production_rollout=31; pilot=17; ai_transformation=4; org_build=3; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=99; rss-feed=85; aihot=37; gdelt=29
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=78; developer-ecosystem-signal=25; mature-commercial-signal=22; technical-iteration-signal=21; enterprise-ai-implementation-signal=18; targeted-pool-gap-refill=16; capital-market-signal=13; ai-hardware-scenario-service-signal=12; early-direction-signal=12; ai-hardware-trend-innovation-signal=11; ai-hardware-investment-signal=10; outside-core-exploration=7; china-startup-funding=4; china-policy-regulation=1
- theme_distribution: uncategorized=78; mature-commercial-signal=25; technical-iteration-signal=24; developer-ecosystem-signal=18; enterprise-ai-implementation-signal=18; targeted-pool-gap-refill=16; capital-market-signal=13; early-direction-signal=13; ai-hardware-scenario-service-signal=12; ai-hardware-trend-innovation-signal=11; ai-hardware-investment-signal=10; outside-core-exploration=7; china-startup-funding=4; china-policy-regulation=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=111; event=79; supporting_article=17; regulatory_or_procurement=15; research_or_report=9; official_index_or_directory=8; changelog_or_release=5; search_result_or_tool_directory=2; community_feedback=1; ecosystem_package_or_model_index=1; event_on_official_page=1; pricing_change=1
- pool_route_distribution: watchlist=117; core_pool=48; index_only=44; discard=37; emerging_pool=34
- pool_index_route_distribution: watchlist=117; core_pool=48; index_only=44; emerging_pool=34
- pool_index_count: 213
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 169
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 121
- index_only_pool_count: 44
- aihot_index_only_count: 7
- aihot_core_count: 15
- aihot_daily_index_only_count: 6
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 213
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact funding: RSS cn-ithome-rss: The operation was aborted due to timeout; source-artifact keyword: keyword-search pre-gate filtered 54 result(s): social_or_profile_source=33; missing_ai_anchor_in_result=10; broad_list_or_market_report=9; directory_or_search_page=1; noise_term:hiring=1; source-artifact keyword: Anysearch business fallback for query "AI implementation startup funding enterprise workflow announced September 2026 (startup OR funding OR seed OR pre-seed OR YC OR venture OR Crunchbase OR Dealroom OR PitchBook OR Tracxn)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch business fallback for query "YC AI startup funding vertical AI announced September 2026 (startup OR funding OR seed OR pre-seed OR YC OR venture OR Crunchbase OR Dealroom OR PitchBook OR Tracxn)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch tech fallback for query "YC AI startup funding vertical AI announced September 2026 (startup OR funding OR seed OR pre-seed OR YC OR venture OR Crunchbase OR Dealroom OR PitchBook OR Tracxn)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "YC AI startup funding vertical AI announced September 2026 (startup OR funding OR seed OR pre-seed OR YC OR venture OR Crunchbase OR Dealroom OR PitchBook OR Tracxn)": business: Anysearch Search service temporarily unavailable.; tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch business fallback for query "Y Combinator AI startup agent infra announced September 2026 (startup OR funding OR seed OR pre-seed OR YC OR venture OR Crunchbase OR Dealroom OR PitchBook OR Tracxn)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "FDE AI implementation production rollout announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "applied AI deployment customer workflow announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "open-source AI agent GitHub enterprise adoption announced September 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS cn-ithome-rss: The operation was aborted due to timeout; targeted-refill pre-gate filtered 2 result(s): broad_list_or_market_report=1; social_or_profile_source=1; targeted pool/core refill cycle 1 added 16 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=102; news=23; media=22; developer=18; industry_media=17; newsletter=13; operators=12; official=11; product=11; builder=10; funding=7; industry=4
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=74; fetched-readable-text-main=62; fetched-readable-text-article=27; fetched-readable-text-body-visible-text=23; blocked-http-403=22; fetched-readable-text-json-ld=12; blocked-http-401=10; no-url-summary-only=9; summary-only-low-readable-body=8; http-429-fallback-text=2; binary-text-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 34
- B: 142
- A: 45
- ungraded: 17
- C: 12

## Evidence Object Type Distribution

- event: 79
- regulatory_or_procurement: 15
- case_or_customer: 111
- changelog_or_release: 5
- pricing_change: 1
- ecosystem_package_or_model_index: 1
- event_on_official_page: 1
- research_or_report: 9
- search_result_or_tool_directory: 2
- supporting_article: 17
- community_feedback: 1
- official_index_or_directory: 8

## Theme Distribution

- 早期信号 (early-direction-signal): 13
- 开发者生态信号 (developer-ecosystem-signal): 18
- 技术迭代信号 (technical-iteration-signal): 24
- 资本市场信号 (capital-market-signal): 13
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 18
- AI Hardware investment and financing (ai-hardware-investment-signal): 10
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 12
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 11
- 外围探索信号 (outside-core-exploration): 7
- 成熟信号 (mature-commercial-signal): 25
- targeted-pool-gap-refill (targeted-pool-gap-refill): 16
- uncategorized (uncategorized): 78
- china-policy-regulation (china-policy-regulation): 1
- china-startup-funding (china-startup-funding): 4

## Keyword Group Distribution

- early-direction-signal: 12
- developer-ecosystem-signal: 25
- technical-iteration-signal: 21
- capital-market-signal: 13
- enterprise-ai-implementation-signal: 18
- ai-hardware-investment-signal: 10
- ai-hardware-scenario-service-signal: 12
- ai-hardware-trend-innovation-signal: 11
- outside-core-exploration: 7
- mature-commercial-signal: 22
- targeted-pool-gap-refill: 16
- uncategorized: 78
- china-policy-regulation: 1
- china-startup-funding: 4

## Keyword Search Path Distribution

- a_media_gdelt: 6
- fde_customer_case: 4
- hardware_product_specs: 5
- hardware_shipment_deployment: 11
- capital_startup: 3
- fde_procurement_contract: 3
- hardware_capacity_fab: 9
- fde_earnings_disclosure: 2
- fde_production_rollout: 5
- procurement_marketplace: 8
- official_original: 24
- developer_ecosystem: 9
- industry_landing: 7
- hardware_oem_odm: 3

## Keyword Search Intent Distribution

- find_market_trend: 6
- find_customer_case: 19
- find_startups: 20
- find_original_source: 45
- find_capacity_capex: 7
- find_procurement_signal: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
