# 2026-08-10 Guanlan Daily Monitor Log

- generated_at: 2026-08-10T02:42:15.305Z
- raw_count: 246
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 4
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 45 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 59 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 9
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-10/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-10/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-10/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-10/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 59
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 391
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 30
- keyword_search_count: 97
- keyword_search_non_community_count: 97
- keyword_search_path_distribution: official_original=15; capital_startup=11; hardware_oem_odm=8; hardware_product_specs=8; fde_procurement_contract=7; hardware_shipment_deployment=7; procurement_marketplace=7; hardware_capacity_fab=6; a_media_gdelt=5; fde_customer_case=5; fde_production_rollout=5; developer_ecosystem=4; industry_landing=4; hardware_capex=2; hardware_supply_agreement=2; fde_earnings_disclosure=1
- keyword_search_intent_distribution: find_original_source=30; find_startups=29; find_customer_case=21; find_capacity_capex=6; find_market_trend=5; find_hardware_supply=2; find_procurement_signal=2; verify_company_action=2
- source_distribution: keyword-search=97; rss-feed=83; gdelt=36; aihot=30
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 117
- enterprise_ai_transformation_stage_distribution: platform_enablement=63; production_rollout=24; pilot=18; ai_transformation=6; org_build=4; procurement=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=97; rss-feed=83; gdelt=36; aihot=30
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=76; mature-commercial-signal=23; technical-iteration-signal=20; capital-market-signal=18; enterprise-ai-implementation-signal=18; developer-ecosystem-signal=16; targeted-pool-gap-refill=15; ai-hardware-scenario-service-signal=14; early-direction-signal=11; ai-hardware-trend-innovation-signal=10; ai-hardware-investment-signal=9; outside-core-exploration=6; china-policy-regulation=4; china-startup-funding=4; china-local-project=2
- theme_distribution: uncategorized=76; mature-commercial-signal=26; technical-iteration-signal=20; capital-market-signal=18; enterprise-ai-implementation-signal=18; targeted-pool-gap-refill=15; ai-hardware-scenario-service-signal=14; developer-ecosystem-signal=13; early-direction-signal=11; ai-hardware-trend-innovation-signal=10; ai-hardware-investment-signal=9; outside-core-exploration=6; china-policy-regulation=4; china-startup-funding=4; china-local-project=2
- theme_concentration_warning: none
- evidence_object_type_distribution: event=94; case_or_customer=89; regulatory_or_procurement=21; supporting_article=19; official_index_or_directory=7; research_or_report=6; changelog_or_release=4; community_feedback=2; pricing_change=2; search_result_or_tool_directory=2
- pool_route_distribution: watchlist=121; core_pool=54; emerging_pool=42; index_only=42; discard=27
- pool_index_route_distribution: watchlist=121; core_pool=54; emerging_pool=42; index_only=42
- pool_index_count: 219
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 177
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 123
- index_only_pool_count: 42
- aihot_index_only_count: 11
- aihot_core_count: 10
- aihot_daily_index_only_count: 4
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 219
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 31 result(s): missing_ai_anchor_in_result=13; broad_list_or_market_report=9; social_or_profile_source=5; directory_or_search_page=1; noise_term:definition=1; noise_term:hiring=1; noise_term:meme=1; targeted pool/core refill cycle 1 added 15 item(s) for important_case=3/5; important_funding=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=85; news=32; media=22; industry_media=19; newsletter=16; operators=14; product=13; builder=10; developer=10; funding=8; official=7; government_regulator=3; industry=3; marketplace=2; research=2
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=97; fetched-readable-text-main=52; fetched-readable-text-body-visible-text=28; fetched-readable-text-article=20; blocked-http-403=14; fetched-readable-text-json-ld=8; summary-only-low-readable-body=7; blocked-http-401=6; no-url-summary-only=6; timeout-fallback-visible-text=3; http-429-fallback-text=2; binary-text-rejected=1; http-404-fallback-text=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 123
- S: 31
- C: 14
- A: 56
- ungraded: 22

## Evidence Object Type Distribution

- event: 94
- case_or_customer: 89
- regulatory_or_procurement: 21
- changelog_or_release: 4
- official_index_or_directory: 7
- search_result_or_tool_directory: 2
- supporting_article: 19
- research_or_report: 6
- community_feedback: 2
- pricing_change: 2

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 20
- 资本市场信号 (capital-market-signal): 18
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 18
- AI Hardware investment and financing (ai-hardware-investment-signal): 9
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 14
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 10
- 成熟信号 (mature-commercial-signal): 26
- 早期信号 (early-direction-signal): 11
- 开发者生态信号 (developer-ecosystem-signal): 13
- targeted-pool-gap-refill (targeted-pool-gap-refill): 15
- uncategorized (uncategorized): 76
- 外围探索信号 (outside-core-exploration): 6
- china-policy-regulation (china-policy-regulation): 4
- china-startup-funding (china-startup-funding): 4
- china-local-project (china-local-project): 2

## Keyword Group Distribution

- technical-iteration-signal: 20
- capital-market-signal: 18
- enterprise-ai-implementation-signal: 18
- ai-hardware-investment-signal: 9
- ai-hardware-scenario-service-signal: 14
- ai-hardware-trend-innovation-signal: 10
- mature-commercial-signal: 23
- early-direction-signal: 11
- developer-ecosystem-signal: 16
- targeted-pool-gap-refill: 15
- uncategorized: 76
- outside-core-exploration: 6
- china-policy-regulation: 4
- china-startup-funding: 4
- china-local-project: 2

## Keyword Search Path Distribution

- hardware_oem_odm: 8
- fde_customer_case: 5
- hardware_product_specs: 8
- hardware_shipment_deployment: 7
- hardware_supply_agreement: 2
- a_media_gdelt: 5
- official_original: 15
- capital_startup: 11
- fde_procurement_contract: 7
- hardware_capacity_fab: 6
- procurement_marketplace: 7
- fde_production_rollout: 5
- developer_ecosystem: 4
- fde_earnings_disclosure: 1
- industry_landing: 4
- hardware_capex: 2

## Keyword Search Intent Distribution

- find_startups: 29
- find_customer_case: 21
- find_hardware_supply: 2
- find_market_trend: 5
- find_capacity_capex: 6
- find_original_source: 30
- find_procurement_signal: 2
- verify_company_action: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
