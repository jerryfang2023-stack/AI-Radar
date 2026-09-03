# 2026-09-03 Guanlan Daily Monitor Log

- generated_at: 2026-09-03T00:26:41.816Z
- raw_count: 241
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 8
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 63 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 57 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 10
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 2
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-03/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-03/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-03/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-03/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-03/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 57
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 600
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 36
- keyword_search_count: 89
- keyword_search_non_community_count: 89
- keyword_search_path_distribution: official_original=13; hardware_shipment_deployment=9; hardware_product_specs=8; fde_production_rollout=7; hardware_capacity_fab=7; industry_landing=7; developer_ecosystem=5; fde_customer_case=5; fde_procurement_contract=5; a_media_gdelt=4; hardware_oem_odm=4; procurement_marketplace=4; capital_startup=2; china_ai_hardware_funding=2; fde_earnings_disclosure=2; hardware_capex=2; hardware_supply_agreement=2; china_vertical_agent_funding=1
- keyword_search_intent_distribution: find_original_source=37; find_customer_case=18; find_startups=17; find_capacity_capex=5; find_market_trend=4; find_procurement_signal=3; verify_company_action=3; find_hardware_supply=2
- source_distribution: keyword-search=89; rss-feed=84; aihot=36; gdelt=32
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 109
- enterprise_ai_transformation_stage_distribution: platform_enablement=58; production_rollout=24; pilot=10; ai_transformation=7; org_build=5; procurement=5
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=89; rss-feed=84; aihot=36; gdelt=32
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=77; technical-iteration-signal=28; mature-commercial-signal=25; developer-ecosystem-signal=20; enterprise-ai-implementation-signal=20; ai-hardware-trend-innovation-signal=12; capital-market-signal=9; early-direction-signal=8; targeted-pool-gap-refill=8; china-ai-hardware-funding=7; ai-hardware-scenario-service-signal=6; ai-hardware-investment-signal=5; outside-core-exploration=5; china-vertical-agent-funding=4; china-startup-funding=3; china-local-project=2; china-listed-disclosure=1; china-policy-regulation=1
- theme_distribution: uncategorized=77; technical-iteration-signal=29; mature-commercial-signal=25; enterprise-ai-implementation-signal=20; developer-ecosystem-signal=18; ai-hardware-trend-innovation-signal=12; capital-market-signal=10; early-direction-signal=8; targeted-pool-gap-refill=8; china-ai-hardware-funding=7; ai-hardware-scenario-service-signal=6; ai-hardware-investment-signal=5; outside-core-exploration=5; china-vertical-agent-funding=4; china-startup-funding=3; china-local-project=2; china-listed-disclosure=1; china-policy-regulation=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=100; event=86; regulatory_or_procurement=16; research_or_report=10; supporting_article=8; official_index_or_directory=7; changelog_or_release=5; community_feedback=3; event_on_official_page=2; pricing_change=2; search_result_or_tool_directory=2
- pool_route_distribution: watchlist=121; core_pool=48; index_only=39; discard=30; emerging_pool=22
- pool_index_route_distribution: watchlist=121; core_pool=48; index_only=39; emerging_pool=22
- pool_index_count: 211
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 172
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 124
- index_only_pool_count: 39
- aihot_index_only_count: 11
- aihot_core_count: 13
- aihot_daily_index_only_count: 8
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 211
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 82 result(s): missing_ai_anchor_in_result=34; social_or_profile_source=26; broad_list_or_market_report=15; noise_term:hiring=4; directory_or_search_page=2; noise_term:salary=1; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 2 result(s): social_or_profile_source=2; targeted pool/core refill cycle 1 added 8 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=102; media=23; news=23; industry_media=16; product=16; operators=12; developer=11; builder=10; official=10; newsletter=9; funding=7; industry=1; listed_company_disclosure=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=89; fetched-readable-text-main=51; fetched-readable-text-article=24; fetched-readable-text-body-visible-text=20; blocked-http-403=15; fetched-readable-text-json-ld=14; no-url-summary-only=10; blocked-http-401=6; summary-only-low-readable-body=6; http-429-fallback-text=3; fetch-failed-fallback-visible-text=2; binary-text-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 46
- C: 12
- B: 127
- S: 39
- ungraded: 17

## Evidence Object Type Distribution

- event: 86
- case_or_customer: 100
- regulatory_or_procurement: 16
- community_feedback: 3
- research_or_report: 10
- changelog_or_release: 5
- supporting_article: 8
- pricing_change: 2
- search_result_or_tool_directory: 2
- event_on_official_page: 2
- official_index_or_directory: 7

## Theme Distribution

- 早期信号 (early-direction-signal): 8
- 开发者生态信号 (developer-ecosystem-signal): 18
- 成熟信号 (mature-commercial-signal): 25
- 技术迭代信号 (technical-iteration-signal): 29
- 资本市场信号 (capital-market-signal): 10
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 20
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 6
- china-ai-hardware-funding (china-ai-hardware-funding): 7
- china-local-project (china-local-project): 2
- china-vertical-agent-funding (china-vertical-agent-funding): 4
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 12
- targeted-pool-gap-refill (targeted-pool-gap-refill): 8
- 外围探索信号 (outside-core-exploration): 5
- uncategorized (uncategorized): 77
- china-startup-funding (china-startup-funding): 3
- china-listed-disclosure (china-listed-disclosure): 1
- china-policy-regulation (china-policy-regulation): 1

## Keyword Group Distribution

- early-direction-signal: 8
- developer-ecosystem-signal: 20
- mature-commercial-signal: 25
- technical-iteration-signal: 28
- capital-market-signal: 9
- enterprise-ai-implementation-signal: 20
- ai-hardware-investment-signal: 5
- ai-hardware-scenario-service-signal: 6
- china-ai-hardware-funding: 7
- china-local-project: 2
- china-vertical-agent-funding: 4
- ai-hardware-trend-innovation-signal: 12
- targeted-pool-gap-refill: 8
- outside-core-exploration: 5
- uncategorized: 77
- china-startup-funding: 3
- china-listed-disclosure: 1
- china-policy-regulation: 1

## Keyword Search Path Distribution

- a_media_gdelt: 4
- fde_production_rollout: 7
- hardware_product_specs: 8
- hardware_capacity_fab: 7
- china_ai_hardware_funding: 2
- hardware_capex: 2
- china_vertical_agent_funding: 1
- procurement_marketplace: 4
- hardware_shipment_deployment: 9
- hardware_supply_agreement: 2
- fde_procurement_contract: 5
- fde_customer_case: 5
- official_original: 13
- industry_landing: 7
- hardware_oem_odm: 4
- developer_ecosystem: 5
- fde_earnings_disclosure: 2
- capital_startup: 2

## Keyword Search Intent Distribution

- find_market_trend: 4
- find_customer_case: 18
- find_startups: 17
- find_capacity_capex: 5
- verify_company_action: 3
- find_original_source: 37
- find_hardware_supply: 2
- find_procurement_signal: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
