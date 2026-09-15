# 2026-09-15 Guanlan Daily Monitor Log

- generated_at: 2026-09-15T07:03:56.966Z
- raw_count: 234
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 7
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 63 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 59 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 14
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 6
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-15/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-15/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-15/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-15/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-15/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 59
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 499
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 45
- keyword_search_count: 94
- keyword_search_non_community_count: 94
- keyword_search_path_distribution: hardware_shipment_deployment=10; fde_production_rollout=8; fde_customer_case=7; official_original=7; procurement_marketplace=7; developer_ecosystem=6; fde_procurement_contract=6; hardware_product_specs=6; a_media_gdelt=5; capital_startup=5; hardware_capacity_fab=5; fde_earnings_disclosure=4; hardware_oem_odm=4; industry_landing=4; china_ai_hardware_funding=3; hardware_capex=3; china_vertical_agent_funding=2; hardware_supply_agreement=2
- keyword_search_intent_distribution: find_startups=29; find_original_source=27; find_customer_case=22; find_market_trend=5; find_capacity_capex=3; find_procurement_signal=3; verify_company_action=3; find_hardware_supply=2
- source_distribution: rss-feed=95; keyword-search=94; aihot=45
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 105
- enterprise_ai_transformation_stage_distribution: platform_enablement=52; production_rollout=25; pilot=15; ai_transformation=6; procurement=4; org_build=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: rss-feed=95; keyword-search=94; aihot=45
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=92; mature-commercial-signal=26; developer-ecosystem-signal=20; enterprise-ai-implementation-signal=20; capital-market-signal=14; technical-iteration-signal=13; early-direction-signal=11; ai-hardware-trend-innovation-signal=9; ai-hardware-scenario-service-signal=8; china-ai-hardware-funding=7; outside-core-exploration=4; china-local-project=3; targeted-pool-gap-refill=3; ai-hardware-investment-signal=2; china-vertical-agent-funding=2
- theme_distribution: uncategorized=92; mature-commercial-signal=26; enterprise-ai-implementation-signal=21; capital-market-signal=15; developer-ecosystem-signal=14; early-direction-signal=14; technical-iteration-signal=14; ai-hardware-trend-innovation-signal=9; ai-hardware-scenario-service-signal=8; china-ai-hardware-funding=7; outside-core-exploration=4; china-local-project=3; targeted-pool-gap-refill=3; ai-hardware-investment-signal=2; china-vertical-agent-funding=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=92; event=72; regulatory_or_procurement=24; supporting_article=16; research_or_report=12; official_index_or_directory=8; changelog_or_release=3; event_on_official_page=3; community_feedback=2; repo_readme_or_index=1; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=100; core_pool=59; index_only=47; emerging_pool=36; discard=24
- pool_index_route_distribution: watchlist=100; core_pool=59; index_only=47; emerging_pool=36
- pool_index_count: 210
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 163
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 104
- index_only_pool_count: 47
- aihot_index_only_count: 19
- aihot_core_count: 19
- aihot_daily_index_only_count: 7
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 210
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact gdelt: source collection command failed; see gdelt-source-run.log; source-artifact keyword: keyword-search pre-gate filtered 75 result(s): missing_ai_anchor_in_result=34; social_or_profile_source=24; broad_list_or_market_report=14; directory_or_search_page=1; noise_term:definition=1; noise_term:hiring=1; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI accelerator supply agreement data center announced September 2026 (GPU OR accelerator OR HBM OR AI server) ("supply agreement" OR "supply contract" OR supplier OR "purchasing agreement") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; targeted-refill pre-gate filtered 1 result(s): broad_list_or_market_report=1; targeted pool/core refill cycle 1 added 3 item(s) for important_case=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=94; industry_media=22; media=21; developer=17; newsletter=16; product=14; funding=12; news=12; operators=9; builder=6; official=6; industry=4; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=73; fetched-readable-text-main=43; fetched-readable-text-article=39; fetched-readable-text-body-visible-text=26; blocked-http-403=14; fetched-readable-text-json-ld=13; no-url-summary-only=11; summary-only-low-readable-body=8; blocked-http-401=2; fetch-failed-fallback-visible-text=2; binary-text-rejected=1; http-429-fallback-text=1; http-521-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 34
- B: 137
- C: 9
- S: 32
- ungraded: 22

## Evidence Object Type Distribution

- research_or_report: 12
- event: 72
- case_or_customer: 92
- regulatory_or_procurement: 24
- changelog_or_release: 3
- event_on_official_page: 3
- supporting_article: 16
- community_feedback: 2
- search_result_or_tool_directory: 1
- repo_readme_or_index: 1
- official_index_or_directory: 8

## Theme Distribution

- 早期信号 (early-direction-signal): 14
- 技术迭代信号 (technical-iteration-signal): 14
- 成熟信号 (mature-commercial-signal): 26
- 外围探索信号 (outside-core-exploration): 4
- 开发者生态信号 (developer-ecosystem-signal): 14
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 21
- china-ai-hardware-funding (china-ai-hardware-funding): 7
- china-local-project (china-local-project): 3
- 资本市场信号 (capital-market-signal): 15
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 9
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 8
- targeted-pool-gap-refill (targeted-pool-gap-refill): 3
- uncategorized (uncategorized): 92
- china-vertical-agent-funding (china-vertical-agent-funding): 2

## Keyword Group Distribution

- early-direction-signal: 11
- technical-iteration-signal: 13
- mature-commercial-signal: 26
- outside-core-exploration: 4
- developer-ecosystem-signal: 20
- enterprise-ai-implementation-signal: 20
- china-ai-hardware-funding: 7
- china-local-project: 3
- capital-market-signal: 14
- ai-hardware-investment-signal: 2
- ai-hardware-trend-innovation-signal: 9
- ai-hardware-scenario-service-signal: 8
- targeted-pool-gap-refill: 3
- uncategorized: 92
- china-vertical-agent-funding: 2

## Keyword Search Path Distribution

- fde_customer_case: 7
- china_ai_hardware_funding: 3
- hardware_capex: 3
- capital_startup: 5
- fde_production_rollout: 8
- hardware_shipment_deployment: 10
- hardware_supply_agreement: 2
- hardware_capacity_fab: 5
- procurement_marketplace: 7
- hardware_product_specs: 6
- fde_procurement_contract: 6
- a_media_gdelt: 5
- developer_ecosystem: 6
- official_original: 7
- industry_landing: 4
- hardware_oem_odm: 4
- china_vertical_agent_funding: 2
- fde_earnings_disclosure: 4

## Keyword Search Intent Distribution

- find_customer_case: 22
- find_startups: 29
- verify_company_action: 3
- find_hardware_supply: 2
- find_capacity_capex: 3
- find_original_source: 27
- find_market_trend: 5
- find_procurement_signal: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
