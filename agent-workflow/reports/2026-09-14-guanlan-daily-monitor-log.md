# 2026-09-14 Guanlan Daily Monitor Log

- generated_at: 2026-09-14T02:56:24.660Z
- raw_count: 232
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 3
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 33 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 65 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 13
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 4
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-14/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-14/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-14/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-14/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-14/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 65
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 405
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 27
- keyword_search_count: 84
- keyword_search_non_community_count: 84
- keyword_search_path_distribution: official_original=12; fde_procurement_contract=7; fde_production_rollout=7; hardware_shipment_deployment=7; fde_customer_case=6; hardware_product_specs=6; a_media_gdelt=5; developer_ecosystem=5; hardware_capacity_fab=5; procurement_marketplace=5; industry_landing=4; capital_startup=3; hardware_capex=3; hardware_oem_odm=3; fde_earnings_disclosure=2; hardware_supply_agreement=2; china_ai_hardware_funding=1; china_vertical_agent_funding=1
- keyword_search_intent_distribution: find_original_source=30; find_startups=24; find_customer_case=12; find_market_trend=5; find_capacity_capex=4; find_procurement_signal=4; verify_company_action=3; find_hardware_supply=2
- source_distribution: keyword-search=84; rss-feed=82; gdelt=39; aihot=27
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 101
- enterprise_ai_transformation_stage_distribution: platform_enablement=53; production_rollout=29; pilot=10; ai_transformation=5; org_build=2; procurement=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=84; rss-feed=82; gdelt=39; aihot=27
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=76; mature-commercial-signal=22; enterprise-ai-implementation-signal=19; capital-market-signal=17; early-direction-signal=16; technical-iteration-signal=14; developer-ecosystem-signal=12; ai-hardware-scenario-service-signal=9; ai-hardware-trend-innovation-signal=8; china-ai-hardware-funding=7; outside-core-exploration=7; targeted-pool-gap-refill=7; ai-hardware-investment-signal=5; china-policy-regulation=4; china-local-project=3; china-startup-funding=3; china-vertical-agent-funding=3
- theme_distribution: uncategorized=76; mature-commercial-signal=22; enterprise-ai-implementation-signal=19; capital-market-signal=17; early-direction-signal=16; technical-iteration-signal=15; developer-ecosystem-signal=11; ai-hardware-scenario-service-signal=9; ai-hardware-trend-innovation-signal=8; china-ai-hardware-funding=7; outside-core-exploration=7; targeted-pool-gap-refill=7; ai-hardware-investment-signal=5; china-policy-regulation=4; china-local-project=3; china-startup-funding=3; china-vertical-agent-funding=3
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=86; event=81; regulatory_or_procurement=19; supporting_article=15; research_or_report=14; official_index_or_directory=7; community_feedback=4; search_result_or_tool_directory=3; changelog_or_release=1; pricing_change=1; repo_readme_or_index=1
- pool_route_distribution: watchlist=94; core_pool=58; index_only=46; discard=32; emerging_pool=23
- pool_index_route_distribution: watchlist=94; core_pool=58; index_only=46; emerging_pool=23
- pool_index_count: 200
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 154
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 96
- index_only_pool_count: 46
- aihot_index_only_count: 8
- aihot_core_count: 10
- aihot_daily_index_only_count: 3
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 200
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 97 result(s): missing_ai_anchor_in_result=46; social_or_profile_source=34; broad_list_or_market_report=12; noise_term:hiring=2; noise_term:meme=2; noise_term:translation=1; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 11 result(s): missing_ai_anchor_in_result=10; social_or_profile_source=1; targeted pool/core refill cycle 1 added 7 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=110; industry_media=22; media=21; operators=17; news=14; product=14; developer=10; newsletter=8; builder=7; official=5; funding=3; industry=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=84; fetched-readable-text-main=46; fetched-readable-text-article=30; blocked-http-403=19; fetched-readable-text-body-visible-text=18; fetched-readable-text-json-ld=14; no-url-summary-only=7; summary-only-low-readable-body=6; blocked-http-401=4; fetched-readable-text-meta-description=2; binary-text-rejected=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 129
- ungraded: 22
- A: 35
- S: 29
- C: 17

## Evidence Object Type Distribution

- event: 81
- regulatory_or_procurement: 19
- research_or_report: 14
- repo_readme_or_index: 1
- case_or_customer: 86
- changelog_or_release: 1
- pricing_change: 1
- supporting_article: 15
- community_feedback: 4
- search_result_or_tool_directory: 3
- official_index_or_directory: 7

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 22
- 早期信号 (early-direction-signal): 16
- 技术迭代信号 (technical-iteration-signal): 15
- 开发者生态信号 (developer-ecosystem-signal): 11
- 资本市场信号 (capital-market-signal): 17
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 19
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 9
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 8
- 外围探索信号 (outside-core-exploration): 7
- china-vertical-agent-funding (china-vertical-agent-funding): 3
- china-local-project (china-local-project): 3
- china-ai-hardware-funding (china-ai-hardware-funding): 7
- targeted-pool-gap-refill (targeted-pool-gap-refill): 7
- china-policy-regulation (china-policy-regulation): 4
- uncategorized (uncategorized): 76
- china-startup-funding (china-startup-funding): 3

## Keyword Group Distribution

- mature-commercial-signal: 22
- early-direction-signal: 16
- technical-iteration-signal: 14
- developer-ecosystem-signal: 12
- capital-market-signal: 17
- enterprise-ai-implementation-signal: 19
- ai-hardware-investment-signal: 5
- ai-hardware-scenario-service-signal: 9
- ai-hardware-trend-innovation-signal: 8
- outside-core-exploration: 7
- china-vertical-agent-funding: 3
- china-local-project: 3
- china-ai-hardware-funding: 7
- targeted-pool-gap-refill: 7
- china-policy-regulation: 4
- uncategorized: 76
- china-startup-funding: 3

## Keyword Search Path Distribution

- a_media_gdelt: 5
- fde_customer_case: 6
- hardware_product_specs: 6
- hardware_shipment_deployment: 7
- hardware_supply_agreement: 2
- fde_earnings_disclosure: 2
- china_vertical_agent_funding: 1
- hardware_capex: 3
- capital_startup: 3
- hardware_capacity_fab: 5
- procurement_marketplace: 5
- fde_procurement_contract: 7
- fde_production_rollout: 7
- hardware_oem_odm: 3
- developer_ecosystem: 5
- official_original: 12
- industry_landing: 4
- china_ai_hardware_funding: 1

## Keyword Search Intent Distribution

- find_market_trend: 5
- find_customer_case: 12
- find_startups: 24
- find_hardware_supply: 2
- find_procurement_signal: 4
- verify_company_action: 3
- find_capacity_capex: 4
- find_original_source: 30

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
