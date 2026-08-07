# 2026-08-07 Guanlan Daily Monitor Log

- generated_at: 2026-08-07T00:24:09.372Z
- raw_count: 258
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
- provider_fallback_notes: Search cross-entry dedupe removed 59 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 51 duplicate candidate(s) before Raw writing.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 7
- recovered_failed_sources_count: 6
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-07/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-07/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-07/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-07/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 51
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 554
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 36
- keyword_search_count: 102
- keyword_search_non_community_count: 102
- keyword_search_path_distribution: official_original=24; hardware_shipment_deployment=8; hardware_oem_odm=7; industry_landing=7; procurement_marketplace=7; developer_ecosystem=6; fde_customer_case=6; fde_procurement_contract=6; hardware_capacity_fab=6; capital_startup=5; fde_production_rollout=5; hardware_product_specs=4; fde_earnings_disclosure=3; hardware_capex=3; hardware_supply_agreement=3; a_media_gdelt=2
- keyword_search_intent_distribution: find_original_source=46; find_startups=19; find_customer_case=17; find_capacity_capex=6; find_procurement_signal=5; verify_company_action=4; find_hardware_supply=3; find_market_trend=2
- source_distribution: keyword-search=102; rss-feed=83; gdelt=37; aihot=36
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 126
- enterprise_ai_transformation_stage_distribution: platform_enablement=62; production_rollout=33; pilot=19; procurement=6; org_build=4; ai_transformation=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=102; rss-feed=83; gdelt=37; aihot=36
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=75; mature-commercial-signal=25; technical-iteration-signal=25; developer-ecosystem-signal=19; targeted-pool-gap-refill=19; enterprise-ai-implementation-signal=17; capital-market-signal=16; early-direction-signal=15; ai-hardware-trend-innovation-signal=12; ai-hardware-investment-signal=10; ai-hardware-scenario-service-signal=10; outside-core-exploration=5; china-local-project=3; china-policy-regulation=3; china-startup-funding=3; china-listed-disclosure=1
- theme_distribution: uncategorized=75; mature-commercial-signal=28; technical-iteration-signal=28; targeted-pool-gap-refill=19; enterprise-ai-implementation-signal=17; capital-market-signal=16; early-direction-signal=15; developer-ecosystem-signal=13; ai-hardware-trend-innovation-signal=12; ai-hardware-investment-signal=10; ai-hardware-scenario-service-signal=10; outside-core-exploration=5; china-local-project=3; china-policy-regulation=3; china-startup-funding=3; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=95; event=91; regulatory_or_procurement=26; official_index_or_directory=12; supporting_article=11; research_or_report=6; changelog_or_release=4; event_on_official_page=4; pricing_change=4; ecosystem_package_or_model_index=2; search_result_or_tool_directory=2; community_feedback=1
- pool_route_distribution: watchlist=127; index_only=57; core_pool=44; emerging_pool=38; discard=27
- pool_index_route_distribution: watchlist=127; index_only=57; core_pool=44; emerging_pool=38
- pool_index_count: 231
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 174
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 130
- index_only_pool_count: 57
- aihot_index_only_count: 16
- aihot_core_count: 14
- aihot_daily_index_only_count: 14
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=1/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 231
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 39 result(s): missing_ai_anchor_in_result=19; broad_list_or_market_report=10; social_or_profile_source=9; noise_term:hiring=1; source-artifact rss: RSS cn-qbitai-rss: fetch failed; targeted-refill pre-gate filtered 3 result(s): missing_ai_anchor_in_result=3; targeted pool/core refill cycle 1 added 19 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=102; news=29; media=22; official=18; newsletter=16; product=15; developer=13; operators=12; industry_media=11; builder=8; funding=8; government_regulator=3; marketplace=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=98; fetched-readable-text-main=45; fetched-readable-text-article=29; fetched-readable-text-body-visible-text=28; no-url-summary-only=16; blocked-http-403=15; fetched-readable-text-json-ld=9; blocked-http-401=4; fetch-failed-fallback-visible-text=3; summary-only-low-readable-body=3; http-404-fallback-text=2; timeout-fallback-visible-text=2; binary-text-rejected=1; fetched-readable-text-meta-description=1; http-429-fallback-text=1; http-503-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 51
- B: 138
- S: 43
- C: 12
- ungraded: 14

## Evidence Object Type Distribution

- event: 91
- community_feedback: 1
- regulatory_or_procurement: 26
- case_or_customer: 95
- changelog_or_release: 4
- supporting_article: 11
- pricing_change: 4
- ecosystem_package_or_model_index: 2
- research_or_report: 6
- search_result_or_tool_directory: 2
- event_on_official_page: 4
- official_index_or_directory: 12

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 28
- 技术迭代信号 (technical-iteration-signal): 28
- 开发者生态信号 (developer-ecosystem-signal): 13
- 资本市场信号 (capital-market-signal): 16
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 17
- AI Hardware investment and financing (ai-hardware-investment-signal): 10
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 10
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 12
- china-local-project (china-local-project): 3
- china-listed-disclosure (china-listed-disclosure): 1
- 早期信号 (early-direction-signal): 15
- 外围探索信号 (outside-core-exploration): 5
- targeted-pool-gap-refill (targeted-pool-gap-refill): 19
- uncategorized (uncategorized): 75
- china-policy-regulation (china-policy-regulation): 3
- china-startup-funding (china-startup-funding): 3

## Keyword Group Distribution

- mature-commercial-signal: 25
- technical-iteration-signal: 25
- developer-ecosystem-signal: 19
- capital-market-signal: 16
- enterprise-ai-implementation-signal: 17
- ai-hardware-investment-signal: 10
- ai-hardware-scenario-service-signal: 10
- ai-hardware-trend-innovation-signal: 12
- china-local-project: 3
- china-listed-disclosure: 1
- early-direction-signal: 15
- outside-core-exploration: 5
- targeted-pool-gap-refill: 19
- uncategorized: 75
- china-policy-regulation: 3
- china-startup-funding: 3

## Keyword Search Path Distribution

- capital_startup: 5
- fde_customer_case: 6
- hardware_capacity_fab: 6
- hardware_product_specs: 4
- hardware_supply_agreement: 3
- hardware_capex: 3
- fde_earnings_disclosure: 3
- procurement_marketplace: 7
- hardware_shipment_deployment: 8
- fde_production_rollout: 5
- a_media_gdelt: 2
- hardware_oem_odm: 7
- industry_landing: 7
- fde_procurement_contract: 6
- official_original: 24
- developer_ecosystem: 6

## Keyword Search Intent Distribution

- find_startups: 19
- find_customer_case: 17
- find_capacity_capex: 6
- find_hardware_supply: 3
- verify_company_action: 4
- find_original_source: 46
- find_market_trend: 2
- find_procurement_signal: 5

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
