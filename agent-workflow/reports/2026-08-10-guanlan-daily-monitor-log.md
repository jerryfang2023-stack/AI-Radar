# 2026-08-10 Guanlan Daily Monitor Log

- generated_at: 2026-08-10T01:52:12.782Z
- raw_count: 248
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
- provider_fallback_notes: Search cross-entry dedupe removed 49 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 60 duplicate candidate(s) before Raw writing.; Search cross-entry dedupe removed 1 duplicate provider hits before Raw selection.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 8
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-10/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-10/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-10/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-10/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 60
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 379
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 30
- keyword_search_count: 101
- keyword_search_non_community_count: 101
- keyword_search_path_distribution: official_original=23; a_media_gdelt=8; hardware_oem_odm=8; hardware_shipment_deployment=8; industry_landing=7; procurement_marketplace=7; hardware_capacity_fab=6; hardware_product_specs=6; capital_startup=5; developer_ecosystem=5; fde_procurement_contract=5; fde_customer_case=4; fde_production_rollout=4; fde_earnings_disclosure=2; hardware_capex=2; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=44; find_startups=21; find_customer_case=18; find_market_trend=8; find_capacity_capex=5; find_procurement_signal=2; verify_company_action=2; find_hardware_supply=1
- source_distribution: keyword-search=101; rss-feed=83; gdelt=34; aihot=30
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 121
- enterprise_ai_transformation_stage_distribution: platform_enablement=59; production_rollout=26; pilot=22; ai_transformation=6; org_build=5; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=101; rss-feed=83; gdelt=34; aihot=30
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=76; mature-commercial-signal=23; technical-iteration-signal=22; targeted-pool-gap-refill=18; capital-market-signal=17; enterprise-ai-implementation-signal=16; ai-hardware-trend-innovation-signal=14; early-direction-signal=14; developer-ecosystem-signal=13; ai-hardware-scenario-service-signal=10; ai-hardware-investment-signal=8; outside-core-exploration=8; china-policy-regulation=4; china-startup-funding=3; china-local-project=2
- theme_distribution: uncategorized=76; mature-commercial-signal=26; technical-iteration-signal=22; targeted-pool-gap-refill=18; capital-market-signal=17; enterprise-ai-implementation-signal=16; ai-hardware-trend-innovation-signal=14; early-direction-signal=14; ai-hardware-scenario-service-signal=10; developer-ecosystem-signal=10; ai-hardware-investment-signal=8; outside-core-exploration=8; china-policy-regulation=4; china-startup-funding=3; china-local-project=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=102; event=82; supporting_article=21; regulatory_or_procurement=18; official_index_or_directory=7; research_or_report=6; changelog_or_release=5; community_feedback=2; pricing_change=2; search_result_or_tool_directory=2; event_on_official_page=1
- pool_route_distribution: watchlist=128; index_only=50; core_pool=43; emerging_pool=41; discard=22
- pool_index_route_distribution: watchlist=128; index_only=50; core_pool=43; emerging_pool=41
- pool_index_count: 226
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 176
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 133
- index_only_pool_count: 50
- aihot_index_only_count: 11
- aihot_core_count: 10
- aihot_daily_index_only_count: 4
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=1/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 226
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 39 result(s): missing_ai_anchor_in_result=19; broad_list_or_market_report=10; social_or_profile_source=6; noise_term:hiring=2; noise_term:definition=1; noise_term:meme=1; targeted-refill pre-gate filtered 7 result(s): missing_ai_anchor_in_result=7; targeted pool/core refill cycle 1 added 18 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=85; news=28; media=25; industry_media=19; newsletter=16; operators=14; product=12; builder=11; developer=11; official=10; funding=8; government_regulator=3; industry=3; marketplace=2; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=102; fetched-readable-text-main=53; fetched-readable-text-article=26; fetched-readable-text-body-visible-text=25; blocked-http-403=12; fetched-readable-text-json-ld=8; no-url-summary-only=6; summary-only-low-readable-body=5; blocked-http-401=4; timeout-fallback-visible-text=3; binary-text-rejected=1; fetched-readable-text-meta-description=1; http-404-fallback-text=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 124
- S: 34
- C: 14
- A: 54
- ungraded: 22

## Evidence Object Type Distribution

- event: 82
- case_or_customer: 102
- regulatory_or_procurement: 18
- supporting_article: 21
- event_on_official_page: 1
- changelog_or_release: 5
- official_index_or_directory: 7
- search_result_or_tool_directory: 2
- research_or_report: 6
- community_feedback: 2
- pricing_change: 2

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 22
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 16
- AI Hardware investment and financing (ai-hardware-investment-signal): 8
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 10
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 14
- china-local-project (china-local-project): 2
- 成熟信号 (mature-commercial-signal): 26
- 早期信号 (early-direction-signal): 14
- 外围探索信号 (outside-core-exploration): 8
- 开发者生态信号 (developer-ecosystem-signal): 10
- 资本市场信号 (capital-market-signal): 17
- targeted-pool-gap-refill (targeted-pool-gap-refill): 18
- uncategorized (uncategorized): 76
- china-policy-regulation (china-policy-regulation): 4
- china-startup-funding (china-startup-funding): 3

## Keyword Group Distribution

- technical-iteration-signal: 22
- enterprise-ai-implementation-signal: 16
- ai-hardware-investment-signal: 8
- ai-hardware-scenario-service-signal: 10
- ai-hardware-trend-innovation-signal: 14
- china-local-project: 2
- mature-commercial-signal: 23
- early-direction-signal: 14
- outside-core-exploration: 8
- developer-ecosystem-signal: 13
- capital-market-signal: 17
- targeted-pool-gap-refill: 18
- uncategorized: 76
- china-policy-regulation: 4
- china-startup-funding: 3

## Keyword Search Path Distribution

- fde_production_rollout: 4
- hardware_product_specs: 6
- hardware_capacity_fab: 6
- hardware_supply_agreement: 1
- hardware_capex: 2
- a_media_gdelt: 8
- hardware_oem_odm: 8
- fde_procurement_contract: 5
- hardware_shipment_deployment: 8
- fde_earnings_disclosure: 2
- developer_ecosystem: 5
- capital_startup: 5
- official_original: 23
- procurement_marketplace: 7
- industry_landing: 7
- fde_customer_case: 4

## Keyword Search Intent Distribution

- find_customer_case: 18
- find_startups: 21
- find_capacity_capex: 5
- find_hardware_supply: 1
- verify_company_action: 2
- find_market_trend: 8
- find_original_source: 44
- find_procurement_signal: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
