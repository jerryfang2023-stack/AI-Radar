# 2026-09-17 Guanlan Daily Monitor Log

- generated_at: 2026-09-17T00:26:25.016Z
- raw_count: 233
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 5
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 66 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 60 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 10
- recovered_failed_sources_count: 6
- unrecovered_failed_sources_count: 4
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-17/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-17/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-17/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-17/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-17/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 60
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 557
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 32
- keyword_search_count: 83
- keyword_search_non_community_count: 83
- keyword_search_path_distribution: hardware_shipment_deployment=10; official_original=10; procurement_marketplace=8; hardware_capacity_fab=7; capital_startup=6; fde_customer_case=6; industry_landing=6; hardware_product_specs=5; a_media_gdelt=4; fde_earnings_disclosure=4; china_ai_hardware_funding=3; developer_ecosystem=3; fde_procurement_contract=3; fde_production_rollout=3; hardware_supply_agreement=3; china_vertical_agent_funding=1; hardware_oem_odm=1
- keyword_search_intent_distribution: find_original_source=27; find_startups=20; find_customer_case=17; find_capacity_capex=7; find_market_trend=4; find_procurement_signal=4; find_hardware_supply=3; verify_company_action=1
- source_distribution: keyword-search=83; rss-feed=82; gdelt=36; aihot=32
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 92
- enterprise_ai_transformation_stage_distribution: platform_enablement=44; production_rollout=22; pilot=11; org_build=6; procurement=6; ai_transformation=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=83; rss-feed=82; gdelt=36; aihot=32
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=78; mature-commercial-signal=24; technical-iteration-signal=21; capital-market-signal=16; enterprise-ai-implementation-signal=15; ai-hardware-trend-innovation-signal=13; ai-hardware-scenario-service-signal=12; developer-ecosystem-signal=11; early-direction-signal=11; outside-core-exploration=9; china-ai-hardware-funding=7; ai-hardware-investment-signal=5; china-startup-funding=3; china-vertical-agent-funding=3; targeted-pool-gap-refill=3; china-listed-disclosure=1; china-policy-regulation=1
- theme_distribution: uncategorized=78; mature-commercial-signal=24; technical-iteration-signal=22; capital-market-signal=16; enterprise-ai-implementation-signal=15; ai-hardware-trend-innovation-signal=13; ai-hardware-scenario-service-signal=12; early-direction-signal=11; developer-ecosystem-signal=10; outside-core-exploration=9; china-ai-hardware-funding=7; ai-hardware-investment-signal=5; china-startup-funding=3; china-vertical-agent-funding=3; targeted-pool-gap-refill=3; china-listed-disclosure=1; china-policy-regulation=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=90; event=86; regulatory_or_procurement=17; supporting_article=14; research_or_report=11; official_index_or_directory=6; event_on_official_page=3; changelog_or_release=2; search_result_or_tool_directory=2; community_feedback=1; pricing_change=1
- pool_route_distribution: watchlist=102; core_pool=56; index_only=37; emerging_pool=35; discard=34
- pool_index_route_distribution: watchlist=102; core_pool=56; index_only=37; emerging_pool=35
- pool_index_count: 199
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 162
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 106
- index_only_pool_count: 37
- aihot_index_only_count: 7
- aihot_core_count: 17
- aihot_daily_index_only_count: 5
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 199
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 73 result(s): missing_ai_anchor_in_result=34; social_or_profile_source=27; broad_list_or_market_report=11; noise_term:hiring=1; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 13 result(s): missing_ai_anchor_in_result=13; targeted pool/core refill cycle 1 added 3 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=100; media=24; product=16; industry_media=15; news=15; official=12; operators=12; developer=11; funding=10; newsletter=8; builder=6; industry=3; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=74; fetched-readable-text-main=44; fetched-readable-text-article=35; blocked-http-403=21; fetched-readable-text-body-visible-text=17; fetched-readable-text-json-ld=17; no-url-summary-only=9; summary-only-low-readable-body=7; blocked-http-401=5; fetched-readable-text-meta-description=3; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 39
- B: 128
- S: 39
- C: 12
- ungraded: 15

## Evidence Object Type Distribution

- pricing_change: 1
- case_or_customer: 90
- event: 86
- research_or_report: 11
- regulatory_or_procurement: 17
- changelog_or_release: 2
- official_index_or_directory: 6
- supporting_article: 14
- event_on_official_page: 3
- search_result_or_tool_directory: 2
- community_feedback: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 11
- 技术迭代信号 (technical-iteration-signal): 22
- 外围探索信号 (outside-core-exploration): 9
- 开发者生态信号 (developer-ecosystem-signal): 10
- 成熟信号 (mature-commercial-signal): 24
- 资本市场信号 (capital-market-signal): 16
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 15
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 13
- china-ai-hardware-funding (china-ai-hardware-funding): 7
- china-vertical-agent-funding (china-vertical-agent-funding): 3
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 12
- targeted-pool-gap-refill (targeted-pool-gap-refill): 3
- uncategorized (uncategorized): 78
- china-startup-funding (china-startup-funding): 3
- china-policy-regulation (china-policy-regulation): 1
- china-listed-disclosure (china-listed-disclosure): 1

## Keyword Group Distribution

- early-direction-signal: 11
- technical-iteration-signal: 21
- outside-core-exploration: 9
- developer-ecosystem-signal: 11
- mature-commercial-signal: 24
- capital-market-signal: 16
- enterprise-ai-implementation-signal: 15
- ai-hardware-trend-innovation-signal: 13
- china-ai-hardware-funding: 7
- china-vertical-agent-funding: 3
- ai-hardware-investment-signal: 5
- ai-hardware-scenario-service-signal: 12
- targeted-pool-gap-refill: 3
- uncategorized: 78
- china-startup-funding: 3
- china-policy-regulation: 1
- china-listed-disclosure: 1

## Keyword Search Path Distribution

- a_media_gdelt: 4
- fde_customer_case: 6
- hardware_supply_agreement: 3
- china_ai_hardware_funding: 3
- china_vertical_agent_funding: 1
- capital_startup: 6
- hardware_shipment_deployment: 10
- procurement_marketplace: 8
- hardware_capacity_fab: 7
- fde_production_rollout: 3
- hardware_product_specs: 5
- fde_earnings_disclosure: 4
- fde_procurement_contract: 3
- official_original: 10
- developer_ecosystem: 3
- industry_landing: 6
- hardware_oem_odm: 1

## Keyword Search Intent Distribution

- find_market_trend: 4
- find_customer_case: 17
- find_hardware_supply: 3
- find_startups: 20
- find_capacity_capex: 7
- find_original_source: 27
- find_procurement_signal: 4
- verify_company_action: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
