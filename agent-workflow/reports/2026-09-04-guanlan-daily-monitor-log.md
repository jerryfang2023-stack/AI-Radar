# 2026-09-04 Guanlan Daily Monitor Log

- generated_at: 2026-09-04T04:39:04.165Z
- raw_count: 277
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 13
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: false
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 50 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 13 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 12
- recovered_failed_sources_count: 6
- unrecovered_failed_sources_count: 6
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-04/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-04/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-04/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-04/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-04/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 13
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 611
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 91
- keyword_search_count: 91
- keyword_search_non_community_count: 91
- keyword_search_path_distribution: hardware_shipment_deployment=12; official_original=9; developer_ecosystem=8; a_media_gdelt=7; fde_procurement_contract=7; hardware_product_specs=7; fde_customer_case=6; fde_production_rollout=5; procurement_marketplace=5; capital_startup=4; fde_earnings_disclosure=4; industry_landing=4; china_ai_hardware_funding=3; hardware_capacity_fab=3; hardware_capex=3; hardware_oem_odm=2; hardware_supply_agreement=2
- keyword_search_intent_distribution: find_original_source=26; find_startups=23; find_customer_case=21; find_market_trend=7; find_procurement_signal=5; verify_company_action=5; find_capacity_capex=2; find_hardware_supply=2
- source_distribution: rss-feed=95; aihot=91; keyword-search=91
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 88
- enterprise_ai_transformation_stage_distribution: platform_enablement=36; production_rollout=20; pilot=14; ai_transformation=7; org_build=6; procurement=5
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: rss-feed=95; aihot=91; keyword-search=91
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=91; technical-iteration-signal=50; developer-ecosystem-signal=34; mature-commercial-signal=26; enterprise-ai-implementation-signal=17; outside-core-exploration=12; ai-hardware-trend-innovation-signal=10; capital-market-signal=9; early-direction-signal=9; ai-hardware-scenario-service-signal=7; china-ai-hardware-funding=5; china-local-project=3; ai-hardware-investment-signal=2; china-listed-disclosure=2
- theme_distribution: uncategorized=91; technical-iteration-signal=51; developer-ecosystem-signal=29; mature-commercial-signal=27; enterprise-ai-implementation-signal=17; outside-core-exploration=12; capital-market-signal=11; ai-hardware-trend-innovation-signal=10; early-direction-signal=10; ai-hardware-scenario-service-signal=7; china-ai-hardware-funding=5; china-local-project=3; ai-hardware-investment-signal=2; china-listed-disclosure=2
- theme_concentration_warning: none
- evidence_object_type_distribution: event=103; case_or_customer=74; community_feedback=38; supporting_article=14; official_index_or_directory=13; research_or_report=10; regulatory_or_procurement=9; changelog_or_release=8; event_on_official_page=3; repo_readme_or_index=2; search_result_or_tool_directory=2; pricing_change=1
- pool_route_distribution: discard=111; watchlist=95; core_pool=37; index_only=31; emerging_pool=29
- pool_index_route_distribution: watchlist=95; core_pool=37; index_only=31; emerging_pool=29
- pool_index_count: 166
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 135
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 98
- index_only_pool_count: 31
- aihot_index_only_count: 13
- aihot_core_count: 9
- aihot_daily_index_only_count: 13
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 166
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact gdelt: source collection command failed; see gdelt-source-run.log; source-artifact keyword: keyword-search pre-gate filtered 86 result(s): missing_ai_anchor_in_result=37; social_or_profile_source=28; broad_list_or_market_report=16; noise_term:hiring=3; directory_or_search_page=1; noise_term:dictionary=1; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=79; operators=71; media=26; developer=17; newsletter=16; industry_media=14; product=12; news=11; builder=10; official=10; funding=9; industry=1; listed_company_disclosure=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=89; fetched-readable-text-content-container=62; fetched-readable-text-main=30; fetched-readable-text-body-visible-text=21; fetched-readable-text-article=20; no-url-summary-only=16; summary-only-low-readable-body=12; fetched-readable-text-json-ld=11; blocked-http-403=10; fetch-failed-fallback-visible-text=5; binary-text-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 37
- B: 117
- ungraded: 15
- C: 71
- S: 37

## Evidence Object Type Distribution

- event: 103
- pricing_change: 1
- case_or_customer: 74
- changelog_or_release: 8
- regulatory_or_procurement: 9
- research_or_report: 10
- search_result_or_tool_directory: 2
- supporting_article: 14
- repo_readme_or_index: 2
- official_index_or_directory: 13
- event_on_official_page: 3
- community_feedback: 38

## Theme Distribution

- 早期信号 (early-direction-signal): 10
- 外围探索信号 (outside-core-exploration): 12
- 技术迭代信号 (technical-iteration-signal): 51
- 开发者生态信号 (developer-ecosystem-signal): 29
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 10
- china-ai-hardware-funding (china-ai-hardware-funding): 5
- china-local-project (china-local-project): 3
- 资本市场信号 (capital-market-signal): 11
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 7
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 17
- 成熟信号 (mature-commercial-signal): 27
- uncategorized (uncategorized): 91
- china-listed-disclosure (china-listed-disclosure): 2

## Keyword Group Distribution

- early-direction-signal: 9
- outside-core-exploration: 12
- technical-iteration-signal: 50
- developer-ecosystem-signal: 34
- ai-hardware-investment-signal: 2
- ai-hardware-trend-innovation-signal: 10
- china-ai-hardware-funding: 5
- china-local-project: 3
- capital-market-signal: 9
- ai-hardware-scenario-service-signal: 7
- enterprise-ai-implementation-signal: 17
- mature-commercial-signal: 26
- uncategorized: 91
- china-listed-disclosure: 2

## Keyword Search Path Distribution

- hardware_product_specs: 7
- hardware_supply_agreement: 2
- china_ai_hardware_funding: 3
- hardware_capex: 3
- capital_startup: 4
- hardware_capacity_fab: 3
- fde_procurement_contract: 7
- hardware_shipment_deployment: 12
- procurement_marketplace: 5
- developer_ecosystem: 8
- fde_customer_case: 6
- a_media_gdelt: 7
- fde_production_rollout: 5
- official_original: 9
- fde_earnings_disclosure: 4
- industry_landing: 4
- hardware_oem_odm: 2

## Keyword Search Intent Distribution

- find_startups: 23
- find_hardware_supply: 2
- verify_company_action: 5
- find_capacity_capex: 2
- find_customer_case: 21
- find_original_source: 26
- find_market_trend: 7
- find_procurement_signal: 5

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
