# 2026-08-02 Guanlan Daily Monitor Log

- generated_at: 2026-08-02T00:22:17.955Z
- raw_count: 227
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
- provider_fallback_notes: Search cross-entry dedupe removed 47 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 63 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 5
- recovered_failed_sources_count: 5
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-02/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-02/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-02/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-02/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 63
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 428
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 26
- keyword_search_count: 80
- keyword_search_non_community_count: 80
- keyword_search_path_distribution: hardware_shipment_deployment=10; hardware_product_specs=9; industry_landing=9; hardware_oem_odm=7; official_original=7; fde_procurement_contract=6; a_media_gdelt=5; developer_ecosystem=5; fde_customer_case=5; fde_production_rollout=5; procurement_marketplace=5; capital_startup=2; fde_earnings_disclosure=2; hardware_capacity_fab=2; hardware_capex=1
- keyword_search_intent_distribution: find_original_source=26; find_customer_case=22; find_startups=19; find_market_trend=5; find_procurement_signal=5; find_capacity_capex=2; verify_company_action=1
- source_distribution: rss-feed=83; keyword-search=80; gdelt=38; aihot=26
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 99
- enterprise_ai_transformation_stage_distribution: platform_enablement=43; production_rollout=24; pilot=15; ai_transformation=9; org_build=5; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: rss-feed=83; keyword-search=80; gdelt=38; aihot=26
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=69; mature-commercial-signal=25; technical-iteration-signal=23; developer-ecosystem-signal=20; enterprise-ai-implementation-signal=16; capital-market-signal=15; early-direction-signal=14; ai-hardware-investment-signal=10; ai-hardware-scenario-service-signal=9; ai-hardware-trend-innovation-signal=9; outside-core-exploration=8; china-policy-regulation=4; china-startup-funding=4; china-local-project=1
- theme_distribution: uncategorized=69; mature-commercial-signal=27; technical-iteration-signal=23; developer-ecosystem-signal=17; capital-market-signal=16; enterprise-ai-implementation-signal=16; early-direction-signal=14; ai-hardware-investment-signal=10; ai-hardware-scenario-service-signal=9; ai-hardware-trend-innovation-signal=9; outside-core-exploration=8; china-policy-regulation=4; china-startup-funding=4; china-local-project=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=89; case_or_customer=83; regulatory_or_procurement=21; research_or_report=9; supporting_article=6; changelog_or_release=5; official_index_or_directory=5; pricing_change=4; community_feedback=2; search_result_or_tool_directory=2; event_on_official_page=1
- pool_route_distribution: watchlist=118; core_pool=48; emerging_pool=35; index_only=34; discard=23
- pool_index_route_distribution: watchlist=118; core_pool=48; emerging_pool=35; index_only=34
- pool_index_count: 204
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 170
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 122
- index_only_pool_count: 34
- aihot_index_only_count: 3
- aihot_core_count: 12
- aihot_daily_index_only_count: 2
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 204
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 46 result(s): social_or_profile_source=23; missing_ai_anchor_in_result=16; broad_list_or_market_report=4; directory_or_search_page=2; noise_term:career=1
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=80; news=26; media=20; operators=19; industry_media=18; newsletter=17; product=14; developer=12; builder=9; funding=4; government_regulator=4; official=2; industry=1; marketplace=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=88; fetched-readable-text-main=46; fetched-readable-text-body-visible-text=32; fetched-readable-text-article=14; blocked-http-403=12; fetched-readable-text-json-ld=11; summary-only-low-readable-body=7; blocked-http-401=5; no-url-summary-only=4; timeout-fallback-visible-text=3; fetched-readable-text-meta-description=2; binary-text-rejected=1; http-404-fallback-text=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 46
- B: 111
- S: 29
- C: 19
- ungraded: 22

## Evidence Object Type Distribution

- regulatory_or_procurement: 21
- case_or_customer: 83
- event: 89
- official_index_or_directory: 5
- changelog_or_release: 5
- event_on_official_page: 1
- pricing_change: 4
- research_or_report: 9
- search_result_or_tool_directory: 2
- supporting_article: 6
- community_feedback: 2

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 8
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 16
- AI Hardware investment and financing (ai-hardware-investment-signal): 10
- 资本市场信号 (capital-market-signal): 16
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 9
- 早期信号 (early-direction-signal): 14
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 9
- 成熟信号 (mature-commercial-signal): 27
- 开发者生态信号 (developer-ecosystem-signal): 17
- 技术迭代信号 (technical-iteration-signal): 23
- china-startup-funding (china-startup-funding): 4
- uncategorized (uncategorized): 69
- china-policy-regulation (china-policy-regulation): 4
- china-local-project (china-local-project): 1

## Keyword Group Distribution

- outside-core-exploration: 8
- enterprise-ai-implementation-signal: 16
- ai-hardware-investment-signal: 10
- developer-ecosystem-signal: 20
- ai-hardware-scenario-service-signal: 9
- early-direction-signal: 14
- ai-hardware-trend-innovation-signal: 9
- capital-market-signal: 15
- mature-commercial-signal: 25
- technical-iteration-signal: 23
- china-startup-funding: 4
- uncategorized: 69
- china-policy-regulation: 4
- china-local-project: 1

## Keyword Search Path Distribution

- fde_customer_case: 5
- hardware_product_specs: 9
- developer_ecosystem: 5
- fde_production_rollout: 5
- hardware_capacity_fab: 2
- fde_earnings_disclosure: 2
- hardware_oem_odm: 7
- a_media_gdelt: 5
- capital_startup: 2
- hardware_shipment_deployment: 10
- official_original: 7
- fde_procurement_contract: 6
- procurement_marketplace: 5
- industry_landing: 9
- hardware_capex: 1

## Keyword Search Intent Distribution

- find_customer_case: 22
- find_startups: 19
- find_original_source: 26
- find_capacity_capex: 2
- find_procurement_signal: 5
- find_market_trend: 5
- verify_company_action: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
