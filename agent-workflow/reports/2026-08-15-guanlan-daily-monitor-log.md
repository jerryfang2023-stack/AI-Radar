# 2026-08-15 Guanlan Daily Monitor Log

- generated_at: 2026-08-15T00:24:13.980Z
- raw_count: 242
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 11
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 61 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 56 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 7
- recovered_failed_sources_count: 6
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-15/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-15/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-15/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-15/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-15/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 56
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 573
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 34
- keyword_search_count: 95
- keyword_search_non_community_count: 95
- keyword_search_path_distribution: official_original=14; a_media_gdelt=9; hardware_capacity_fab=8; hardware_oem_odm=8; hardware_shipment_deployment=8; fde_production_rollout=7; fde_customer_case=6; fde_procurement_contract=6; hardware_product_specs=6; capital_startup=5; developer_ecosystem=5; procurement_marketplace=5; hardware_capex=3; industry_landing=3; hardware_supply_agreement=2
- keyword_search_intent_distribution: find_original_source=36; find_customer_case=23; find_startups=13; find_market_trend=9; find_capacity_capex=6; find_procurement_signal=3; verify_company_action=3; find_hardware_supply=2
- source_distribution: keyword-search=95; rss-feed=86; aihot=34; gdelt=27
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 112
- enterprise_ai_transformation_stage_distribution: platform_enablement=58; production_rollout=32; ai_transformation=8; pilot=8; procurement=4; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=95; rss-feed=86; aihot=34; gdelt=27
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=78; developer-ecosystem-signal=33; technical-iteration-signal=20; enterprise-ai-implementation-signal=19; mature-commercial-signal=18; ai-hardware-trend-innovation-signal=14; capital-market-signal=14; ai-hardware-scenario-service-signal=10; ai-hardware-investment-signal=8; early-direction-signal=8; targeted-pool-gap-refill=8; outside-core-exploration=4; china-local-project=3; china-policy-regulation=3; china-startup-funding=2
- theme_distribution: uncategorized=78; developer-ecosystem-signal=29; technical-iteration-signal=22; mature-commercial-signal=20; enterprise-ai-implementation-signal=19; ai-hardware-trend-innovation-signal=14; capital-market-signal=14; ai-hardware-scenario-service-signal=10; ai-hardware-investment-signal=8; early-direction-signal=8; targeted-pool-gap-refill=8; outside-core-exploration=4; china-local-project=3; china-policy-regulation=3; china-startup-funding=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=96; event=76; regulatory_or_procurement=23; supporting_article=16; official_index_or_directory=9; changelog_or_release=5; pricing_change=5; research_or_report=4; community_feedback=3; event_on_official_page=2; search_result_or_tool_directory=2; ecosystem_package_or_model_index=1
- pool_route_distribution: watchlist=118; core_pool=49; index_only=48; emerging_pool=42; discard=22
- pool_index_route_distribution: watchlist=118; core_pool=49; index_only=48; emerging_pool=42
- pool_index_count: 220
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 172
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 123
- index_only_pool_count: 48
- aihot_index_only_count: 14
- aihot_core_count: 11
- aihot_daily_index_only_count: 11
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 220
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 44 result(s): missing_ai_anchor_in_result=17; social_or_profile_source=15; broad_list_or_market_report=10; noise_term:hiring=2; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 1 result(s): social_or_profile_source=1; targeted pool/core refill cycle 1 added 8 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=91; media=30; news=26; industry_media=15; developer=14; product=14; builder=10; operators=10; funding=8; newsletter=7; industry=5; official=5; government_regulator=3; marketplace=2; company_official=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=100; fetched-readable-text-main=52; fetched-readable-text-article=25; fetched-readable-text-body-visible-text=16; blocked-http-403=13; fetched-readable-text-json-ld=12; no-url-summary-only=12; summary-only-low-readable-body=7; blocked-http-401=2; binary-text-rejected=1; http-429-fallback-text=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 57
- S: 31
- B: 125
- C: 10
- ungraded: 19

## Evidence Object Type Distribution

- event: 76
- changelog_or_release: 5
- case_or_customer: 96
- community_feedback: 3
- regulatory_or_procurement: 23
- supporting_article: 16
- research_or_report: 4
- search_result_or_tool_directory: 2
- pricing_change: 5
- ecosystem_package_or_model_index: 1
- official_index_or_directory: 9
- event_on_official_page: 2

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 4
- 开发者生态信号 (developer-ecosystem-signal): 29
- 早期信号 (early-direction-signal): 8
- 资本市场信号 (capital-market-signal): 14
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 19
- AI Hardware investment and financing (ai-hardware-investment-signal): 8
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 10
- china-local-project (china-local-project): 3
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 14
- 成熟信号 (mature-commercial-signal): 20
- 技术迭代信号 (technical-iteration-signal): 22
- targeted-pool-gap-refill (targeted-pool-gap-refill): 8
- uncategorized (uncategorized): 78
- china-startup-funding (china-startup-funding): 2
- china-policy-regulation (china-policy-regulation): 3

## Keyword Group Distribution

- outside-core-exploration: 4
- developer-ecosystem-signal: 33
- early-direction-signal: 8
- capital-market-signal: 14
- enterprise-ai-implementation-signal: 19
- ai-hardware-investment-signal: 8
- ai-hardware-scenario-service-signal: 10
- china-local-project: 3
- ai-hardware-trend-innovation-signal: 14
- mature-commercial-signal: 18
- technical-iteration-signal: 20
- targeted-pool-gap-refill: 8
- uncategorized: 78
- china-startup-funding: 2
- china-policy-regulation: 3

## Keyword Search Path Distribution

- a_media_gdelt: 9
- fde_customer_case: 6
- hardware_capacity_fab: 8
- hardware_shipment_deployment: 8
- hardware_capex: 3
- capital_startup: 5
- hardware_product_specs: 6
- procurement_marketplace: 5
- fde_procurement_contract: 6
- official_original: 14
- fde_production_rollout: 7
- hardware_oem_odm: 8
- developer_ecosystem: 5
- industry_landing: 3
- hardware_supply_agreement: 2

## Keyword Search Intent Distribution

- find_market_trend: 9
- find_customer_case: 23
- find_capacity_capex: 6
- verify_company_action: 3
- find_startups: 13
- find_original_source: 36
- find_procurement_signal: 3
- find_hardware_supply: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
