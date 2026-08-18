# 2026-08-18 Guanlan Daily Monitor Log

- generated_at: 2026-08-18T00:23:10.590Z
- raw_count: 260
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 14
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 67 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 46 duplicate candidate(s) before Raw writing.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 12
- recovered_failed_sources_count: 11
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-18/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-18/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-18/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-18/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-18/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 46
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 541
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 43
- keyword_search_count: 101
- keyword_search_non_community_count: 101
- keyword_search_path_distribution: official_original=22; hardware_oem_odm=9; hardware_product_specs=9; hardware_shipment_deployment=9; a_media_gdelt=7; fde_customer_case=7; fde_procurement_contract=6; fde_production_rollout=6; capital_startup=5; developer_ecosystem=4; procurement_marketplace=4; fde_earnings_disclosure=3; hardware_capacity_fab=3; hardware_capex=3; industry_landing=3; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=48; find_startups=19; find_customer_case=16; find_market_trend=7; find_procurement_signal=4; find_capacity_capex=3; verify_company_action=3; find_hardware_supply=1
- source_distribution: keyword-search=101; rss-feed=86; aihot=43; gdelt=30
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 111
- enterprise_ai_transformation_stage_distribution: platform_enablement=48; production_rollout=28; pilot=19; procurement=6; ai_transformation=5; org_build=5
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=101; rss-feed=86; aihot=43; gdelt=30
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=80; mature-commercial-signal=27; developer-ecosystem-signal=21; technical-iteration-signal=21; enterprise-ai-implementation-signal=16; targeted-pool-gap-refill=16; capital-market-signal=14; early-direction-signal=14; ai-hardware-scenario-service-signal=12; ai-hardware-trend-innovation-signal=12; outside-core-exploration=9; ai-hardware-investment-signal=8; china-policy-regulation=4; china-local-project=3; china-startup-funding=3
- theme_distribution: uncategorized=80; mature-commercial-signal=30; technical-iteration-signal=22; developer-ecosystem-signal=17; enterprise-ai-implementation-signal=16; targeted-pool-gap-refill=16; capital-market-signal=14; early-direction-signal=14; ai-hardware-scenario-service-signal=12; ai-hardware-trend-innovation-signal=12; outside-core-exploration=9; ai-hardware-investment-signal=8; china-policy-regulation=4; china-local-project=3; china-startup-funding=3
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=110; event=84; regulatory_or_procurement=22; supporting_article=17; research_or_report=11; official_index_or_directory=7; event_on_official_page=3; changelog_or_release=2; search_result_or_tool_directory=2; community_feedback=1; pricing_change=1
- pool_route_distribution: watchlist=130; index_only=55; core_pool=38; emerging_pool=31; discard=30
- pool_index_route_distribution: watchlist=130; index_only=55; core_pool=38; emerging_pool=31
- pool_index_count: 230
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 175
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 137
- index_only_pool_count: 55
- aihot_index_only_count: 18
- aihot_core_count: 10
- aihot_daily_index_only_count: 14
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 230
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 36 result(s): broad_list_or_market_report=12; missing_ai_anchor_in_result=12; social_or_profile_source=8; noise_term:definition=1; noise_term:hiring=1; noise_term:meme=1; noise_term:translation=1; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 5 result(s): directory_or_search_page=2; missing_ai_anchor_in_result=2; social_or_profile_source=1; targeted pool/core refill cycle 1 added 16 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=94; news=32; media=26; industry_media=17; product=17; official=15; developer=14; operators=14; builder=9; funding=8; newsletter=8; government_regulator=3; industry=2; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=104; fetched-readable-text-main=53; fetched-readable-text-article=29; blocked-http-403=17; fetched-readable-text-body-visible-text=16; no-url-summary-only=15; fetched-readable-text-json-ld=8; blocked-http-401=6; summary-only-low-readable-body=5; timeout-fallback-visible-text=3; binary-text-rejected=1; http-429-fallback-text=1; http-500-fallback-text=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 59
- B: 125
- S: 42
- C: 14
- ungraded: 20

## Evidence Object Type Distribution

- event: 84
- case_or_customer: 110
- community_feedback: 1
- changelog_or_release: 2
- research_or_report: 11
- supporting_article: 17
- regulatory_or_procurement: 22
- search_result_or_tool_directory: 2
- pricing_change: 1
- official_index_or_directory: 7
- event_on_official_page: 3

## Theme Distribution

- 早期信号 (early-direction-signal): 14
- 外围探索信号 (outside-core-exploration): 9
- 技术迭代信号 (technical-iteration-signal): 22
- 成熟信号 (mature-commercial-signal): 30
- 开发者生态信号 (developer-ecosystem-signal): 17
- 资本市场信号 (capital-market-signal): 14
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 16
- AI Hardware investment and financing (ai-hardware-investment-signal): 8
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 12
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 12
- china-local-project (china-local-project): 3
- targeted-pool-gap-refill (targeted-pool-gap-refill): 16
- uncategorized (uncategorized): 80
- china-policy-regulation (china-policy-regulation): 4
- china-startup-funding (china-startup-funding): 3

## Keyword Group Distribution

- early-direction-signal: 14
- outside-core-exploration: 9
- technical-iteration-signal: 21
- mature-commercial-signal: 27
- developer-ecosystem-signal: 21
- capital-market-signal: 14
- enterprise-ai-implementation-signal: 16
- ai-hardware-investment-signal: 8
- ai-hardware-scenario-service-signal: 12
- ai-hardware-trend-innovation-signal: 12
- china-local-project: 3
- targeted-pool-gap-refill: 16
- uncategorized: 80
- china-policy-regulation: 4
- china-startup-funding: 3

## Keyword Search Path Distribution

- a_media_gdelt: 7
- fde_customer_case: 7
- hardware_product_specs: 9
- hardware_capacity_fab: 3
- hardware_shipment_deployment: 9
- hardware_capex: 3
- capital_startup: 5
- fde_production_rollout: 6
- hardware_supply_agreement: 1
- fde_earnings_disclosure: 3
- procurement_marketplace: 4
- fde_procurement_contract: 6
- hardware_oem_odm: 9
- official_original: 22
- developer_ecosystem: 4
- industry_landing: 3

## Keyword Search Intent Distribution

- find_market_trend: 7
- find_customer_case: 16
- find_startups: 19
- find_capacity_capex: 3
- find_original_source: 48
- verify_company_action: 3
- find_hardware_supply: 1
- find_procurement_signal: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
