# 2026-09-11 Guanlan Daily Monitor Log

- generated_at: 2026-09-11T07:37:53.948Z
- raw_count: 234
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 6
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 66 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 56 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 8
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-11/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-11/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-11/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-11/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-11/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 56
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 566
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 38
- keyword_search_count: 80
- keyword_search_non_community_count: 80
- keyword_search_path_distribution: hardware_shipment_deployment=10; fde_production_rollout=8; fde_procurement_contract=7; a_media_gdelt=6; hardware_oem_odm=6; industry_landing=6; procurement_marketplace=6; fde_customer_case=5; hardware_capacity_fab=5; hardware_product_specs=5; official_original=5; hardware_capex=3; china_ai_hardware_funding=2; fde_earnings_disclosure=2; capital_startup=1; china_vertical_agent_funding=1; developer_ecosystem=1; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=25; find_customer_case=23; find_startups=12; find_market_trend=6; find_capacity_capex=5; find_procurement_signal=4; verify_company_action=4; find_hardware_supply=1
- source_distribution: rss-feed=83; keyword-search=80; aihot=38; gdelt=33
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 92
- enterprise_ai_transformation_stage_distribution: platform_enablement=45; production_rollout=24; pilot=10; ai_transformation=5; org_build=4; procurement=4
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: rss-feed=83; keyword-search=80; aihot=38; gdelt=33
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=80; technical-iteration-signal=27; enterprise-ai-implementation-signal=23; mature-commercial-signal=20; developer-ecosystem-signal=15; early-direction-signal=12; ai-hardware-scenario-service-signal=10; ai-hardware-trend-innovation-signal=10; capital-market-signal=10; ai-hardware-investment-signal=5; outside-core-exploration=5; china-startup-funding=4; china-vertical-agent-funding=4; china-ai-hardware-funding=3; china-local-project=3; china-policy-regulation=2; china-listed-disclosure=1
- theme_distribution: uncategorized=80; technical-iteration-signal=28; enterprise-ai-implementation-signal=23; mature-commercial-signal=20; developer-ecosystem-signal=14; early-direction-signal=12; ai-hardware-scenario-service-signal=10; ai-hardware-trend-innovation-signal=10; capital-market-signal=10; ai-hardware-investment-signal=5; outside-core-exploration=5; china-startup-funding=4; china-vertical-agent-funding=4; china-ai-hardware-funding=3; china-local-project=3; china-policy-regulation=2; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=99; event=78; supporting_article=18; regulatory_or_procurement=10; research_or_report=9; official_index_or_directory=8; changelog_or_release=5; search_result_or_tool_directory=3; community_feedback=2; pricing_change=2
- pool_route_distribution: watchlist=102; core_pool=55; discard=41; index_only=34; emerging_pool=24
- pool_index_route_distribution: watchlist=102; core_pool=55; index_only=34; emerging_pool=24
- pool_index_count: 193
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 159
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 104
- index_only_pool_count: 34
- aihot_index_only_count: 10
- aihot_core_count: 17
- aihot_daily_index_only_count: 6
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 193
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 75 result(s): missing_ai_anchor_in_result=33; social_or_profile_source=25; broad_list_or_market_report=14; noise_term:hiring=2; directory_or_search_page=1; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=90; media=27; industry_media=21; product=18; news=16; operators=13; developer=12; official=11; funding=8; newsletter=8; builder=7; industry=2; listed_company_disclosure=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=74; fetched-readable-text-main=50; fetched-readable-text-article=29; blocked-http-403=19; fetched-readable-text-body-visible-text=16; fetched-readable-text-json-ld=16; no-url-summary-only=10; summary-only-low-readable-body=8; blocked-http-401=5; fetch-failed-fallback-visible-text=3; timeout-fallback-visible-text=2; binary-text-rejected=1; fetched-readable-text-meta-description=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 115
- A: 43
- ungraded: 22
- S: 41
- C: 13

## Evidence Object Type Distribution

- event: 78
- case_or_customer: 99
- changelog_or_release: 5
- research_or_report: 9
- supporting_article: 18
- regulatory_or_procurement: 10
- community_feedback: 2
- search_result_or_tool_directory: 3
- pricing_change: 2
- official_index_or_directory: 8

## Theme Distribution

- 早期信号 (early-direction-signal): 12
- 外围探索信号 (outside-core-exploration): 5
- 开发者生态信号 (developer-ecosystem-signal): 14
- 技术迭代信号 (technical-iteration-signal): 28
- 资本市场信号 (capital-market-signal): 10
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 23
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 10
- china-vertical-agent-funding (china-vertical-agent-funding): 4
- china-local-project (china-local-project): 3
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 10
- china-ai-hardware-funding (china-ai-hardware-funding): 3
- 成熟信号 (mature-commercial-signal): 20
- china-startup-funding (china-startup-funding): 4
- uncategorized (uncategorized): 80
- china-policy-regulation (china-policy-regulation): 2
- china-listed-disclosure (china-listed-disclosure): 1

## Keyword Group Distribution

- early-direction-signal: 12
- outside-core-exploration: 5
- developer-ecosystem-signal: 15
- technical-iteration-signal: 27
- capital-market-signal: 10
- enterprise-ai-implementation-signal: 23
- ai-hardware-investment-signal: 5
- ai-hardware-scenario-service-signal: 10
- china-vertical-agent-funding: 4
- china-local-project: 3
- ai-hardware-trend-innovation-signal: 10
- china-ai-hardware-funding: 3
- mature-commercial-signal: 20
- china-startup-funding: 4
- uncategorized: 80
- china-policy-regulation: 2
- china-listed-disclosure: 1

## Keyword Search Path Distribution

- a_media_gdelt: 6
- fde_customer_case: 5
- hardware_shipment_deployment: 10
- hardware_product_specs: 5
- china_vertical_agent_funding: 1
- hardware_capex: 3
- capital_startup: 1
- procurement_marketplace: 6
- fde_procurement_contract: 7
- china_ai_hardware_funding: 2
- fde_production_rollout: 8
- hardware_capacity_fab: 5
- fde_earnings_disclosure: 2
- hardware_oem_odm: 6
- official_original: 5
- industry_landing: 6
- developer_ecosystem: 1
- hardware_supply_agreement: 1

## Keyword Search Intent Distribution

- find_market_trend: 6
- find_customer_case: 23
- find_startups: 12
- verify_company_action: 4
- find_original_source: 25
- find_capacity_capex: 5
- find_procurement_signal: 4
- find_hardware_supply: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
