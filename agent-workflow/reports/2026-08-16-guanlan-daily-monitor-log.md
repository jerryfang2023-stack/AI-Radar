# 2026-08-16 Guanlan Daily Monitor Log

- generated_at: 2026-08-16T00:22:13.616Z
- raw_count: 231
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 1
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 60 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 61 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 6
- recovered_failed_sources_count: 5
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-16/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-16/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-16/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-16/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-16/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 61
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 472
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 28
- keyword_search_count: 86
- keyword_search_non_community_count: 86
- keyword_search_path_distribution: official_original=10; hardware_oem_odm=9; a_media_gdelt=7; fde_procurement_contract=7; fde_customer_case=6; hardware_capacity_fab=6; hardware_product_specs=6; hardware_shipment_deployment=6; procurement_marketplace=6; developer_ecosystem=5; fde_production_rollout=5; industry_landing=5; fde_earnings_disclosure=4; capital_startup=2; hardware_capex=1; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=31; find_customer_case=20; find_startups=17; find_market_trend=7; find_procurement_signal=5; find_capacity_capex=4; find_hardware_supply=1; verify_company_action=1
- source_distribution: keyword-search=86; rss-feed=82; gdelt=35; aihot=28
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 108
- enterprise_ai_transformation_stage_distribution: platform_enablement=54; production_rollout=27; pilot=14; ai_transformation=6; procurement=4; org_build=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=86; rss-feed=82; gdelt=35; aihot=28
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=75; mature-commercial-signal=26; developer-ecosystem-signal=24; technical-iteration-signal=18; enterprise-ai-implementation-signal=17; capital-market-signal=15; ai-hardware-trend-innovation-signal=12; ai-hardware-scenario-service-signal=10; early-direction-signal=10; ai-hardware-investment-signal=7; outside-core-exploration=6; china-policy-regulation=4; china-startup-funding=4; targeted-pool-gap-refill=2; china-local-project=1
- theme_distribution: uncategorized=75; mature-commercial-signal=29; technical-iteration-signal=20; developer-ecosystem-signal=19; enterprise-ai-implementation-signal=17; capital-market-signal=15; ai-hardware-trend-innovation-signal=12; ai-hardware-scenario-service-signal=10; early-direction-signal=10; ai-hardware-investment-signal=7; outside-core-exploration=6; china-policy-regulation=4; china-startup-funding=4; targeted-pool-gap-refill=2; china-local-project=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=93; event=79; regulatory_or_procurement=23; supporting_article=13; research_or_report=8; changelog_or_release=5; community_feedback=2; official_index_or_directory=2; pricing_change=2; search_result_or_tool_directory=2; ecosystem_package_or_model_index=1; marketplace_listing=1
- pool_route_distribution: watchlist=114; core_pool=54; emerging_pool=34; index_only=34; discard=23
- pool_index_route_distribution: watchlist=114; core_pool=54; emerging_pool=34; index_only=34
- pool_index_count: 208
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 174
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 120
- index_only_pool_count: 34
- aihot_index_only_count: 7
- aihot_core_count: 13
- aihot_daily_index_only_count: 1
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 208
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 37 result(s): missing_ai_anchor_in_result=21; social_or_profile_source=11; broad_list_or_market_report=4; noise_term:hiring=1; targeted pool/core refill cycle 1 added 2 item(s) for important_case=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=79; news=30; industry_media=21; media=21; developer=14; newsletter=14; operators=12; builder=10; product=10; funding=8; government_regulator=4; official=4; marketplace=3; industry=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=88; fetched-readable-text-main=45; fetched-readable-text-body-visible-text=33; fetched-readable-text-article=29; blocked-http-403=10; fetched-readable-text-json-ld=10; blocked-http-401=9; summary-only-low-readable-body=3; no-url-summary-only=2; binary-text-rejected=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 118
- A: 51
- C: 12
- S: 25
- ungraded: 25

## Evidence Object Type Distribution

- community_feedback: 2
- event: 79
- case_or_customer: 93
- regulatory_or_procurement: 23
- changelog_or_release: 5
- supporting_article: 13
- research_or_report: 8
- search_result_or_tool_directory: 2
- pricing_change: 2
- ecosystem_package_or_model_index: 1
- official_index_or_directory: 2
- marketplace_listing: 1

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 20
- 开发者生态信号 (developer-ecosystem-signal): 19
- 资本市场信号 (capital-market-signal): 15
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 17
- AI Hardware investment and financing (ai-hardware-investment-signal): 7
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 10
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 12
- china-local-project (china-local-project): 1
- 早期信号 (early-direction-signal): 10
- 外围探索信号 (outside-core-exploration): 6
- 成熟信号 (mature-commercial-signal): 29
- targeted-pool-gap-refill (targeted-pool-gap-refill): 2
- uncategorized (uncategorized): 75
- china-startup-funding (china-startup-funding): 4
- china-policy-regulation (china-policy-regulation): 4

## Keyword Group Distribution

- technical-iteration-signal: 18
- developer-ecosystem-signal: 24
- capital-market-signal: 15
- enterprise-ai-implementation-signal: 17
- ai-hardware-investment-signal: 7
- ai-hardware-scenario-service-signal: 10
- ai-hardware-trend-innovation-signal: 12
- china-local-project: 1
- early-direction-signal: 10
- outside-core-exploration: 6
- mature-commercial-signal: 26
- targeted-pool-gap-refill: 2
- uncategorized: 75
- china-startup-funding: 4
- china-policy-regulation: 4

## Keyword Search Path Distribution

- a_media_gdelt: 7
- fde_production_rollout: 5
- hardware_product_specs: 6
- hardware_shipment_deployment: 6
- hardware_supply_agreement: 1
- hardware_capex: 1
- fde_customer_case: 6
- hardware_capacity_fab: 6
- hardware_oem_odm: 9
- fde_procurement_contract: 7
- fde_earnings_disclosure: 4
- official_original: 10
- capital_startup: 2
- procurement_marketplace: 6
- developer_ecosystem: 5
- industry_landing: 5

## Keyword Search Intent Distribution

- find_market_trend: 7
- find_customer_case: 20
- find_startups: 17
- find_hardware_supply: 1
- verify_company_action: 1
- find_capacity_capex: 4
- find_original_source: 31
- find_procurement_signal: 5

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
