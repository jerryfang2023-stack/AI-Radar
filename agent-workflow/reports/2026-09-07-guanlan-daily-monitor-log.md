# 2026-09-07 Guanlan Daily Monitor Log

- generated_at: 2026-09-07T00:27:09.649Z
- raw_count: 243
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
- provider_fallback_notes: Search cross-entry dedupe removed 35 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 58 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 17
- recovered_failed_sources_count: 6
- unrecovered_failed_sources_count: 11
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-07/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-07/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-07/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-07/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-07/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 58
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 327
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 32
- keyword_search_count: 123
- keyword_search_non_community_count: 119
- keyword_search_path_distribution: official_original=21; industry_landing=10; procurement_marketplace=10; hardware_shipment_deployment=9; capital_startup=8; fde_customer_case=8; hardware_capacity_fab=8; hardware_product_specs=8; developer_ecosystem=7; a_media_gdelt=6; fde_procurement_contract=6; community_feedback=4; fde_production_rollout=4; hardware_oem_odm=4; fde_earnings_disclosure=3; china_ai_hardware_funding=2; hardware_capex=2; hardware_supply_agreement=2; china_vertical_agent_funding=1
- keyword_search_intent_distribution: find_original_source=39; find_startups=33; find_customer_case=30; find_market_trend=6; find_capacity_capex=4; find_user_feedback=4; find_procurement_signal=3; find_hardware_supply=2; verify_company_action=2
- source_distribution: keyword-search=123; rss-feed=85; aihot=32; funding-search=3
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 115
- enterprise_ai_transformation_stage_distribution: platform_enablement=52; production_rollout=27; ai_transformation=14; pilot=10; org_build=6; procurement=6
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=123; rss-feed=85; aihot=32; funding-search=3
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=81; mature-commercial-signal=31; capital-market-signal=21; enterprise-ai-implementation-signal=20; developer-ecosystem-signal=17; technical-iteration-signal=15; targeted-pool-gap-refill=11; ai-hardware-trend-innovation-signal=9; outside-core-exploration=9; ai-hardware-scenario-service-signal=8; early-direction-signal=6; china-ai-hardware-funding=5; ai-hardware-investment-signal=4; important_funding=3; china-local-project=2; china-vertical-agent-funding=1
- theme_distribution: uncategorized=81; mature-commercial-signal=31; capital-market-signal=21; enterprise-ai-implementation-signal=20; technical-iteration-signal=16; developer-ecosystem-signal=15; targeted-pool-gap-refill=11; ai-hardware-trend-innovation-signal=9; outside-core-exploration=9; ai-hardware-scenario-service-signal=8; early-direction-signal=7; china-ai-hardware-funding=5; ai-hardware-investment-signal=4; funding-dedicated=3; china-local-project=2; china-vertical-agent-funding=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=106; event=81; supporting_article=15; regulatory_or_procurement=12; research_or_report=11; changelog_or_release=7; official_index_or_directory=5; community_feedback=2; search_result_or_tool_directory=2; event_on_official_page=1; pricing_change=1
- pool_route_distribution: watchlist=113; core_pool=57; emerging_pool=42; index_only=39; discard=30
- pool_index_route_distribution: watchlist=113; core_pool=57; emerging_pool=42; index_only=39
- pool_index_count: 213
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 174
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 117
- index_only_pool_count: 39
- aihot_index_only_count: 11
- aihot_core_count: 12
- aihot_daily_index_only_count: 3
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 213
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact gdelt: source collection command failed; see gdelt-source-run.log; source-artifact keyword: keyword-search pre-gate filtered 82 result(s): social_or_profile_source=36; missing_ai_anchor_in_result=26; broad_list_or_market_report=17; noise_term:hiring=3; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "enterprise AI transformation production rollout customer deployment announced September 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch business fallback for query "AI implementation startup design partner pilot customer (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch tech fallback for query "AI implementation startup design partner pilot customer (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "AI implementation startup design partner pilot customer (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": business: Anysearch Search service temporarily unavailable.; tech: Anysearch Search service temporarily unavailable.; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=2; targeted pool/core refill cycle 1 added 11 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=93; industry_media=30; media=25; product=16; developer=14; news=14; official=11; builder=10; operators=10; industry=8; newsletter=8; funding=4
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=87; fetched-readable-text-main=54; fetched-readable-text-article=28; fetched-readable-text-body-visible-text=24; blocked-http-403=21; fetched-readable-text-json-ld=13; summary-only-low-readable-body=7; no-url-summary-only=6; binary-text-rejected=1; blocked-http-401=1; fetch-failed-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- ungraded: 30
- A: 39
- B: 123
- C: 10
- S: 41

## Evidence Object Type Distribution

- case_or_customer: 106
- supporting_article: 15
- changelog_or_release: 7
- event: 81
- regulatory_or_procurement: 12
- pricing_change: 1
- research_or_report: 11
- search_result_or_tool_directory: 2
- community_feedback: 2
- event_on_official_page: 1
- official_index_or_directory: 5

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 15
- 外围探索信号 (outside-core-exploration): 9
- 成熟信号 (mature-commercial-signal): 31
- 技术迭代信号 (technical-iteration-signal): 16
- 早期信号 (early-direction-signal): 7
- 资本市场信号 (capital-market-signal): 21
- AI Hardware investment and financing (ai-hardware-investment-signal): 4
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 8
- china-vertical-agent-funding (china-vertical-agent-funding): 1
- china-local-project (china-local-project): 2
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 9
- china-ai-hardware-funding (china-ai-hardware-funding): 5
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 20
- targeted-pool-gap-refill (targeted-pool-gap-refill): 11
- funding-dedicated (funding-dedicated): 3
- uncategorized (uncategorized): 81

## Keyword Group Distribution

- developer-ecosystem-signal: 17
- outside-core-exploration: 9
- mature-commercial-signal: 31
- technical-iteration-signal: 15
- early-direction-signal: 6
- capital-market-signal: 21
- ai-hardware-investment-signal: 4
- ai-hardware-scenario-service-signal: 8
- china-vertical-agent-funding: 1
- china-local-project: 2
- ai-hardware-trend-innovation-signal: 9
- china-ai-hardware-funding: 5
- enterprise-ai-implementation-signal: 20
- targeted-pool-gap-refill: 11
- important_funding: 3
- uncategorized: 81

## Keyword Search Path Distribution

- a_media_gdelt: 6
- capital_startup: 8
- hardware_product_specs: 8
- hardware_capacity_fab: 8
- china_vertical_agent_funding: 1
- hardware_capex: 2
- hardware_shipment_deployment: 9
- hardware_supply_agreement: 2
- china_ai_hardware_funding: 2
- procurement_marketplace: 10
- fde_procurement_contract: 6
- hardware_oem_odm: 4
- fde_production_rollout: 4
- fde_earnings_disclosure: 3
- developer_ecosystem: 7
- fde_customer_case: 8
- official_original: 21
- industry_landing: 10
- community_feedback: 4

## Keyword Search Intent Distribution

- find_market_trend: 6
- find_startups: 33
- find_capacity_capex: 4
- verify_company_action: 2
- find_customer_case: 30
- find_hardware_supply: 2
- find_original_source: 39
- find_procurement_signal: 3
- find_user_feedback: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
