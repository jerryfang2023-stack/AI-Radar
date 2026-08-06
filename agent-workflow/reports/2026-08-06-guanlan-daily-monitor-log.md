# 2026-08-06 Guanlan Daily Monitor Log

- generated_at: 2026-08-06T00:22:17.214Z
- raw_count: 245
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
- provider_fallback_notes: Search cross-entry dedupe removed 58 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 53 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 10
- recovered_failed_sources_count: 7
- unrecovered_failed_sources_count: 3
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-06/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-06/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-06/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-06/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 53
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 561
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 42
- keyword_search_count: 91
- keyword_search_non_community_count: 91
- keyword_search_path_distribution: official_original=15; hardware_shipment_deployment=10; procurement_marketplace=7; fde_customer_case=6; fde_procurement_contract=6; hardware_capacity_fab=6; hardware_product_specs=6; industry_landing=6; a_media_gdelt=5; hardware_oem_odm=5; developer_ecosystem=4; fde_production_rollout=4; fde_earnings_disclosure=3; hardware_capex=3; hardware_supply_agreement=3; capital_startup=2
- keyword_search_intent_distribution: find_original_source=33; find_customer_case=20; find_startups=19; find_market_trend=5; find_capacity_capex=4; find_procurement_signal=4; find_hardware_supply=3; verify_company_action=3
- source_distribution: keyword-search=91; rss-feed=84; aihot=42; gdelt=28
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 115
- enterprise_ai_transformation_stage_distribution: platform_enablement=62; production_rollout=29; pilot=11; procurement=8; org_build=3; ai_transformation=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=91; rss-feed=84; aihot=42; gdelt=28
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=75; mature-commercial-signal=27; technical-iteration-signal=22; capital-market-signal=16; developer-ecosystem-signal=16; early-direction-signal=16; ai-hardware-trend-innovation-signal=13; enterprise-ai-implementation-signal=13; ai-hardware-investment-signal=11; ai-hardware-scenario-service-signal=10; outside-core-exploration=9; targeted-pool-gap-refill=8; china-local-project=3; china-policy-regulation=3; china-startup-funding=3
- theme_distribution: uncategorized=75; mature-commercial-signal=29; technical-iteration-signal=24; capital-market-signal=16; early-direction-signal=16; ai-hardware-trend-innovation-signal=13; enterprise-ai-implementation-signal=13; developer-ecosystem-signal=12; ai-hardware-investment-signal=11; ai-hardware-scenario-service-signal=10; outside-core-exploration=9; targeted-pool-gap-refill=8; china-local-project=3; china-policy-regulation=3; china-startup-funding=3
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=89; event=86; regulatory_or_procurement=15; official_index_or_directory=14; supporting_article=12; research_or_report=11; changelog_or_release=6; pricing_change=5; community_feedback=4; search_result_or_tool_directory=2; event_on_official_page=1
- pool_route_distribution: watchlist=109; index_only=61; core_pool=51; emerging_pool=43; discard=22
- pool_index_route_distribution: watchlist=109; index_only=61; core_pool=51; emerging_pool=43
- pool_index_count: 223
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 162
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 111
- index_only_pool_count: 61
- aihot_index_only_count: 21
- aihot_core_count: 14
- aihot_daily_index_only_count: 15
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 223
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 35 result(s): missing_ai_anchor_in_result=12; social_or_profile_source=11; broad_list_or_market_report=9; noise_term:hiring=2; noise_term:affiliate=1; source-artifact keyword: Anysearch fallback for query "open-source AI agent GitHub enterprise adoption announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch business fallback for query "customer engineering AI production deployment announced August 2026 (procurement notice OR tender award OR contract awarded OR purchasing agreement OR production deployment) (official OR government OR newsroom OR press release)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch business fallback for query "AI implementation startup funding enterprise workflow (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; targeted-refill pre-gate filtered 1 result(s): social_or_profile_source=1; targeted pool/core refill cycle 1 added 8 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=104; news=24; operators=21; media=17; newsletter=16; industry_media=12; builder=11; developer=11; product=10; funding=7; official=5; government_regulator=3; analysis=1; domestic_vendor=1; marketplace=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=96; fetched-readable-text-main=42; fetched-readable-text-body-visible-text=29; fetched-readable-text-article=23; no-url-summary-only=17; fetched-readable-text-json-ld=16; blocked-http-403=12; blocked-http-401=4; summary-only-low-readable-body=4; binary-text-rejected=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 42
- B: 139
- C: 21
- S: 28
- ungraded: 15

## Evidence Object Type Distribution

- event: 86
- changelog_or_release: 6
- supporting_article: 12
- case_or_customer: 89
- pricing_change: 5
- regulatory_or_procurement: 15
- research_or_report: 11
- community_feedback: 4
- search_result_or_tool_directory: 2
- official_index_or_directory: 14
- event_on_official_page: 1

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 24
- 外围探索信号 (outside-core-exploration): 9
- 开发者生态信号 (developer-ecosystem-signal): 12
- 早期信号 (early-direction-signal): 16
- 资本市场信号 (capital-market-signal): 16
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 13
- AI Hardware investment and financing (ai-hardware-investment-signal): 11
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 10
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 13
- china-local-project (china-local-project): 3
- 成熟信号 (mature-commercial-signal): 29
- targeted-pool-gap-refill (targeted-pool-gap-refill): 8
- uncategorized (uncategorized): 75
- china-startup-funding (china-startup-funding): 3
- china-policy-regulation (china-policy-regulation): 3

## Keyword Group Distribution

- technical-iteration-signal: 22
- outside-core-exploration: 9
- developer-ecosystem-signal: 16
- early-direction-signal: 16
- capital-market-signal: 16
- enterprise-ai-implementation-signal: 13
- ai-hardware-investment-signal: 11
- ai-hardware-scenario-service-signal: 10
- ai-hardware-trend-innovation-signal: 13
- china-local-project: 3
- mature-commercial-signal: 27
- targeted-pool-gap-refill: 8
- uncategorized: 75
- china-startup-funding: 3
- china-policy-regulation: 3

## Keyword Search Path Distribution

- a_media_gdelt: 5
- fde_customer_case: 6
- hardware_product_specs: 6
- hardware_shipment_deployment: 10
- hardware_supply_agreement: 3
- hardware_capex: 3
- capital_startup: 2
- hardware_capacity_fab: 6
- procurement_marketplace: 7
- fde_earnings_disclosure: 3
- fde_procurement_contract: 6
- fde_production_rollout: 4
- official_original: 15
- developer_ecosystem: 4
- hardware_oem_odm: 5
- industry_landing: 6

## Keyword Search Intent Distribution

- find_market_trend: 5
- find_customer_case: 20
- find_startups: 19
- find_hardware_supply: 3
- verify_company_action: 3
- find_original_source: 33
- find_capacity_capex: 4
- find_procurement_signal: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
