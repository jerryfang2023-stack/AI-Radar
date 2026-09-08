# 2026-09-08 Guanlan Daily Monitor Log

- generated_at: 2026-09-08T01:31:01.174Z
- raw_count: 235
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 2
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 45 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 69 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 17
- recovered_failed_sources_count: 11
- unrecovered_failed_sources_count: 6
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-08/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-08/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-08/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-08/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-08/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 69
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 384
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 24
- keyword_search_count: 91
- keyword_search_non_community_count: 91
- keyword_search_path_distribution: official_original=18; hardware_shipment_deployment=9; fde_customer_case=7; hardware_product_specs=7; procurement_marketplace=7; a_media_gdelt=6; industry_landing=6; fde_procurement_contract=5; fde_production_rollout=5; hardware_capacity_fab=5; developer_ecosystem=4; hardware_oem_odm=4; hardware_capex=2; hardware_supply_agreement=2; capital_startup=1; china_ai_hardware_funding=1; china_vertical_agent_funding=1; fde_earnings_disclosure=1
- keyword_search_intent_distribution: find_original_source=38; find_startups=19; find_customer_case=18; find_market_trend=6; find_procurement_signal=4; find_capacity_capex=2; find_hardware_supply=2; verify_company_action=2
- source_distribution: keyword-search=91; rss-feed=80; gdelt=40; aihot=24
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 103
- enterprise_ai_transformation_stage_distribution: platform_enablement=45; production_rollout=30; pilot=14; org_build=5; procurement=5; ai_transformation=4
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=91; rss-feed=80; gdelt=40; aihot=24
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=76; mature-commercial-signal=26; enterprise-ai-implementation-signal=19; technical-iteration-signal=15; targeted-pool-gap-refill=14; developer-ecosystem-signal=13; ai-hardware-trend-innovation-signal=12; capital-market-signal=10; china-ai-hardware-funding=8; early-direction-signal=8; outside-core-exploration=8; ai-hardware-scenario-service-signal=7; ai-hardware-investment-signal=6; china-startup-funding=4; china-vertical-agent-funding=4; china-policy-regulation=3; china-local-project=2
- theme_distribution: uncategorized=76; mature-commercial-signal=26; enterprise-ai-implementation-signal=19; technical-iteration-signal=16; targeted-pool-gap-refill=14; ai-hardware-trend-innovation-signal=12; capital-market-signal=11; developer-ecosystem-signal=11; china-ai-hardware-funding=8; early-direction-signal=8; outside-core-exploration=8; ai-hardware-scenario-service-signal=7; ai-hardware-investment-signal=6; china-startup-funding=4; china-vertical-agent-funding=4; china-policy-regulation=3; china-local-project=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=97; event=76; regulatory_or_procurement=17; supporting_article=17; research_or_report=12; official_index_or_directory=6; changelog_or_release=4; community_feedback=3; search_result_or_tool_directory=3
- pool_route_distribution: watchlist=107; core_pool=51; discard=38; index_only=34; emerging_pool=30
- pool_index_route_distribution: watchlist=107; core_pool=51; index_only=34; emerging_pool=30
- pool_index_count: 197
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 163
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 112
- index_only_pool_count: 34
- aihot_index_only_count: 6
- aihot_core_count: 13
- aihot_daily_index_only_count: 2
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=1/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 197
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 74 result(s): social_or_profile_source=32; missing_ai_anchor_in_result=29; broad_list_or_market_report=8; noise_term:hiring=3; directory_or_search_page=1; noise_term:definition=1; source-artifact keyword: Anysearch fallback for query "FDE AI implementation production rollout announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 12 result(s): missing_ai_anchor_in_result=9; broad_list_or_market_report=1; noise_term:definition=1; social_or_profile_source=1; targeted pool/core refill cycle 1 added 14 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=100; media=25; industry_media=21; product=17; news=16; developer=12; operators=10; newsletter=9; builder=7; official=7; funding=3; government_regulator=3; industry=3; community=1; marketplace=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=77; fetched-readable-text-main=43; fetched-readable-text-article=31; blocked-http-403=23; fetched-readable-text-body-visible-text=23; fetched-readable-text-json-ld=17; summary-only-low-readable-body=6; no-url-summary-only=5; blocked-http-401=3; binary-text-rejected=2; fetch-failed-fallback-visible-text=1; fetched-readable-text-meta-description=1; http-404-fallback-text=1; http-521-fallback-text=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 124
- A: 41
- S: 35
- ungraded: 24
- C: 11

## Evidence Object Type Distribution

- event: 76
- case_or_customer: 97
- regulatory_or_procurement: 17
- changelog_or_release: 4
- research_or_report: 12
- supporting_article: 17
- search_result_or_tool_directory: 3
- community_feedback: 3
- official_index_or_directory: 6

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 8
- 开发者生态信号 (developer-ecosystem-signal): 11
- 早期信号 (early-direction-signal): 8
- 资本市场信号 (capital-market-signal): 11
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 19
- AI Hardware investment and financing (ai-hardware-investment-signal): 6
- china-local-project (china-local-project): 2
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 7
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 12
- china-ai-hardware-funding (china-ai-hardware-funding): 8
- 成熟信号 (mature-commercial-signal): 26
- 技术迭代信号 (technical-iteration-signal): 16
- targeted-pool-gap-refill (targeted-pool-gap-refill): 14
- china-startup-funding (china-startup-funding): 4
- uncategorized (uncategorized): 76
- china-policy-regulation (china-policy-regulation): 3
- china-vertical-agent-funding (china-vertical-agent-funding): 4

## Keyword Group Distribution

- outside-core-exploration: 8
- developer-ecosystem-signal: 13
- early-direction-signal: 8
- capital-market-signal: 10
- enterprise-ai-implementation-signal: 19
- ai-hardware-investment-signal: 6
- china-local-project: 2
- ai-hardware-scenario-service-signal: 7
- ai-hardware-trend-innovation-signal: 12
- china-ai-hardware-funding: 8
- mature-commercial-signal: 26
- technical-iteration-signal: 15
- targeted-pool-gap-refill: 14
- china-startup-funding: 4
- uncategorized: 76
- china-policy-regulation: 3
- china-vertical-agent-funding: 4

## Keyword Search Path Distribution

- hardware_oem_odm: 4
- a_media_gdelt: 6
- fde_customer_case: 7
- hardware_product_specs: 7
- hardware_capex: 2
- capital_startup: 1
- hardware_shipment_deployment: 9
- hardware_supply_agreement: 2
- procurement_marketplace: 7
- hardware_capacity_fab: 5
- official_original: 18
- developer_ecosystem: 4
- fde_procurement_contract: 5
- fde_earnings_disclosure: 1
- industry_landing: 6
- fde_production_rollout: 5
- china_ai_hardware_funding: 1
- china_vertical_agent_funding: 1

## Keyword Search Intent Distribution

- find_startups: 19
- find_market_trend: 6
- find_customer_case: 18
- verify_company_action: 2
- find_hardware_supply: 2
- find_original_source: 38
- find_procurement_signal: 4
- find_capacity_capex: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
