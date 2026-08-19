# 2026-08-19 Guanlan Daily Monitor Log

- generated_at: 2026-08-19T02:01:55.927Z
- raw_count: 255
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 13
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 58 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 44 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 9
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-19/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-19/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-19/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-19/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-19/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 44
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 604
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 49
- keyword_search_count: 89
- keyword_search_non_community_count: 89
- keyword_search_path_distribution: official_original=12; a_media_gdelt=9; hardware_shipment_deployment=9; hardware_oem_odm=8; hardware_product_specs=8; fde_customer_case=6; fde_production_rollout=6; procurement_marketplace=6; developer_ecosystem=5; fde_procurement_contract=5; industry_landing=5; fde_earnings_disclosure=3; hardware_capacity_fab=3; hardware_capex=2; capital_startup=1; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=36; find_customer_case=17; find_startups=16; find_market_trend=9; find_procurement_signal=4; find_capacity_capex=3; verify_company_action=3; find_hardware_supply=1
- source_distribution: keyword-search=89; rss-feed=85; aihot=49; gdelt=32
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 116
- enterprise_ai_transformation_stage_distribution: platform_enablement=61; production_rollout=29; pilot=10; org_build=6; procurement=6; ai_transformation=4
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=89; rss-feed=85; aihot=49; gdelt=32
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=78; mature-commercial-signal=31; technical-iteration-signal=27; developer-ecosystem-signal=20; enterprise-ai-implementation-signal=18; outside-core-exploration=13; ai-hardware-trend-innovation-signal=12; capital-market-signal=11; early-direction-signal=11; ai-hardware-investment-signal=9; targeted-pool-gap-refill=9; ai-hardware-scenario-service-signal=6; china-policy-regulation=4; china-startup-funding=3; china-local-project=2; china-listed-disclosure=1
- theme_distribution: uncategorized=78; mature-commercial-signal=34; technical-iteration-signal=27; enterprise-ai-implementation-signal=18; developer-ecosystem-signal=16; outside-core-exploration=13; ai-hardware-trend-innovation-signal=12; capital-market-signal=12; early-direction-signal=11; ai-hardware-investment-signal=9; targeted-pool-gap-refill=9; ai-hardware-scenario-service-signal=6; china-policy-regulation=4; china-startup-funding=3; china-local-project=2; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=101; event=95; regulatory_or_procurement=21; supporting_article=11; official_index_or_directory=10; research_or_report=7; pricing_change=4; changelog_or_release=3; event_on_official_page=2; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=129; core_pool=50; index_only=49; emerging_pool=34; discard=20
- pool_index_route_distribution: watchlist=129; core_pool=50; index_only=49; emerging_pool=34
- pool_index_count: 235
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 186
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 136
- index_only_pool_count: 49
- aihot_index_only_count: 19
- aihot_core_count: 14
- aihot_daily_index_only_count: 13
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 235
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 54 result(s): missing_ai_anchor_in_result=26; broad_list_or_market_report=12; social_or_profile_source=11; noise_term:career=2; noise_term:definition=1; noise_term:hiring=1; noise_term:meme=1; targeted pool/core refill cycle 1 added 9 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=89; media=29; news=20; industry_media=19; newsletter=15; developer=14; operators=14; official=13; product=13; builder=9; funding=8; government_regulator=4; industry=3; marketplace=3; listed_company_disclosure=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=95; fetched-readable-text-main=49; fetched-readable-text-article=32; fetched-readable-text-body-visible-text=25; no-url-summary-only=15; blocked-http-403=13; fetched-readable-text-json-ld=12; summary-only-low-readable-body=7; blocked-http-401=4; binary-text-rejected=1; http-404-fallback-text=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 129
- A: 50
- S: 38
- C: 14
- ungraded: 24

## Evidence Object Type Distribution

- research_or_report: 7
- case_or_customer: 101
- event: 95
- changelog_or_release: 3
- regulatory_or_procurement: 21
- pricing_change: 4
- supporting_article: 11
- search_result_or_tool_directory: 1
- event_on_official_page: 2
- official_index_or_directory: 10

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 13
- 成熟信号 (mature-commercial-signal): 34
- 早期信号 (early-direction-signal): 11
- 技术迭代信号 (technical-iteration-signal): 27
- 开发者生态信号 (developer-ecosystem-signal): 16
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 18
- AI Hardware investment and financing (ai-hardware-investment-signal): 9
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 6
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 12
- 资本市场信号 (capital-market-signal): 12
- china-local-project (china-local-project): 2
- targeted-pool-gap-refill (targeted-pool-gap-refill): 9
- uncategorized (uncategorized): 78
- china-startup-funding (china-startup-funding): 3
- china-listed-disclosure (china-listed-disclosure): 1
- china-policy-regulation (china-policy-regulation): 4

## Keyword Group Distribution

- outside-core-exploration: 13
- mature-commercial-signal: 31
- early-direction-signal: 11
- technical-iteration-signal: 27
- developer-ecosystem-signal: 20
- enterprise-ai-implementation-signal: 18
- ai-hardware-investment-signal: 9
- ai-hardware-scenario-service-signal: 6
- ai-hardware-trend-innovation-signal: 12
- capital-market-signal: 11
- china-local-project: 2
- targeted-pool-gap-refill: 9
- uncategorized: 78
- china-startup-funding: 3
- china-listed-disclosure: 1
- china-policy-regulation: 4

## Keyword Search Path Distribution

- fde_customer_case: 6
- hardware_product_specs: 8
- hardware_capacity_fab: 3
- hardware_supply_agreement: 1
- capital_startup: 1
- fde_procurement_contract: 5
- hardware_shipment_deployment: 9
- hardware_capex: 2
- fde_earnings_disclosure: 3
- fde_production_rollout: 6
- procurement_marketplace: 6
- a_media_gdelt: 9
- hardware_oem_odm: 8
- official_original: 12
- developer_ecosystem: 5
- industry_landing: 5

## Keyword Search Intent Distribution

- find_customer_case: 17
- find_startups: 16
- find_capacity_capex: 3
- find_hardware_supply: 1
- verify_company_action: 3
- find_original_source: 36
- find_market_trend: 9
- find_procurement_signal: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
