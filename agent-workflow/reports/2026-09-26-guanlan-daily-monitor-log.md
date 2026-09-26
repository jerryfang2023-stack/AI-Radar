# 2026-09-26 Guanlan Daily Monitor Log

- generated_at: 2026-09-26T00:26:21.253Z
- raw_count: 256
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 10
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 68 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 48 duplicate candidate(s) before Raw writing.; Anysearch business fallback for query "vertical AI startup funding enterprise agents investor announcement 2026 (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 16
- recovered_failed_sources_count: 10
- unrecovered_failed_sources_count: 6
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-26/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-26/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-26/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-26/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-26/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 48
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 475
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 42
- keyword_search_count: 96
- keyword_search_non_community_count: 96
- keyword_search_path_distribution: capital_startup=17; hardware_shipment_deployment=12; fde_production_rollout=8; fde_customer_case=7; hardware_capacity_fab=7; industry_landing=7; procurement_marketplace=7; fde_earnings_disclosure=6; developer_ecosystem=5; a_media_gdelt=4; fde_procurement_contract=3; hardware_product_specs=3; hardware_supply_agreement=3; china_ai_hardware_funding=2; hardware_capex=2; official_original=2; hardware_oem_odm=1
- keyword_search_intent_distribution: find_startups=28; find_customer_case=24; find_original_source=22; find_procurement_signal=7; find_capacity_capex=5; find_market_trend=4; find_hardware_supply=3; verify_company_action=3
- source_distribution: keyword-search=96; rss-feed=85; aihot=42; gdelt=33
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 105
- enterprise_ai_transformation_stage_distribution: platform_enablement=46; production_rollout=25; ai_transformation=11; pilot=10; org_build=8; procurement=5
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=96; rss-feed=85; aihot=42; gdelt=33
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=82; mature-commercial-signal=29; enterprise-ai-implementation-signal=25; technical-iteration-signal=20; developer-ecosystem-signal=16; ai-hardware-trend-innovation-signal=14; targeted-pool-gap-refill=14; outside-core-exploration=12; ai-hardware-scenario-service-signal=9; capital-market-signal=8; china-ai-hardware-funding=6; ai-hardware-investment-signal=5; china-startup-funding=4; early-direction-signal=4; china-vertical-agent-funding=3; china-local-project=2; china-policy-regulation=2; china-listed-disclosure=1
- theme_distribution: uncategorized=82; mature-commercial-signal=30; enterprise-ai-implementation-signal=25; technical-iteration-signal=21; ai-hardware-trend-innovation-signal=14; targeted-pool-gap-refill=14; developer-ecosystem-signal=13; outside-core-exploration=12; ai-hardware-scenario-service-signal=9; capital-market-signal=8; china-ai-hardware-funding=6; ai-hardware-investment-signal=5; early-direction-signal=5; china-startup-funding=4; china-vertical-agent-funding=3; china-local-project=2; china-policy-regulation=2; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=98; case_or_customer=89; supporting_article=17; research_or_report=15; regulatory_or_procurement=12; official_index_or_directory=11; changelog_or_release=4; event_on_official_page=4; community_feedback=3; pricing_change=3
- pool_route_distribution: watchlist=125; index_only=56; emerging_pool=37; core_pool=36; discard=33
- pool_index_route_distribution: watchlist=125; index_only=56; emerging_pool=37; core_pool=36
- pool_index_count: 223
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 167
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 131
- index_only_pool_count: 56
- aihot_index_only_count: 17
- aihot_core_count: 13
- aihot_daily_index_only_count: 10
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5; important_funding=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 223
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 77 result(s): missing_ai_anchor_in_result=32; social_or_profile_source=22; broad_list_or_market_report=20; noise_term:career=1; noise_term:dictionary=1; noise_term:hiring=1; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "agent governance evals production rollout enterprise AI announced September 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; targeted-refill pre-gate filtered 29 result(s): missing_ai_anchor_in_result=17; social_or_profile_source=10; broad_list_or_market_report=2; targeted pool/core refill cycle 1 added 14 item(s) for important_case=3/5; important_funding=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=112; media=21; news=21; product=16; newsletter=15; operators=15; developer=13; industry_media=12; official=11; builder=9; funding=9; industry=1; listed_company_disclosure=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=78; fetched-readable-text-main=53; fetched-readable-text-article=27; fetched-readable-text-body-visible-text=24; blocked-http-403=20; fetched-readable-text-json-ld=14; no-url-summary-only=13; summary-only-low-readable-body=12; fetched-readable-text-meta-description=5; blocked-http-401=4; timeout-fallback-visible-text=2; binary-text-rejected=1; fetch-failed-fallback-visible-text=1; http-404-fallback-text=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 42
- B: 150
- S: 36
- C: 15
- ungraded: 13

## Evidence Object Type Distribution

- research_or_report: 15
- event: 98
- case_or_customer: 89
- regulatory_or_procurement: 12
- changelog_or_release: 4
- supporting_article: 17
- event_on_official_page: 4
- official_index_or_directory: 11
- community_feedback: 3
- pricing_change: 3

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 12
- 早期信号 (early-direction-signal): 5
- 成熟信号 (mature-commercial-signal): 30
- 技术迭代信号 (technical-iteration-signal): 21
- 资本市场信号 (capital-market-signal): 8
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 25
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 9
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 14
- china-ai-hardware-funding (china-ai-hardware-funding): 6
- 开发者生态信号 (developer-ecosystem-signal): 13
- targeted-pool-gap-refill (targeted-pool-gap-refill): 14
- china-vertical-agent-funding (china-vertical-agent-funding): 3
- uncategorized (uncategorized): 82
- china-startup-funding (china-startup-funding): 4
- china-local-project (china-local-project): 2
- china-policy-regulation (china-policy-regulation): 2
- china-listed-disclosure (china-listed-disclosure): 1

## Keyword Group Distribution

- outside-core-exploration: 12
- early-direction-signal: 4
- mature-commercial-signal: 29
- technical-iteration-signal: 20
- capital-market-signal: 8
- enterprise-ai-implementation-signal: 25
- ai-hardware-investment-signal: 5
- ai-hardware-scenario-service-signal: 9
- ai-hardware-trend-innovation-signal: 14
- china-ai-hardware-funding: 6
- developer-ecosystem-signal: 16
- targeted-pool-gap-refill: 14
- china-vertical-agent-funding: 3
- uncategorized: 82
- china-startup-funding: 4
- china-local-project: 2
- china-policy-regulation: 2
- china-listed-disclosure: 1

## Keyword Search Path Distribution

- a_media_gdelt: 4
- fde_customer_case: 7
- hardware_capacity_fab: 7
- hardware_product_specs: 3
- hardware_supply_agreement: 3
- capital_startup: 17
- hardware_shipment_deployment: 12
- fde_production_rollout: 8
- china_ai_hardware_funding: 2
- procurement_marketplace: 7
- fde_procurement_contract: 3
- developer_ecosystem: 5
- fde_earnings_disclosure: 6
- official_original: 2
- industry_landing: 7
- hardware_oem_odm: 1
- hardware_capex: 2

## Keyword Search Intent Distribution

- find_market_trend: 4
- find_customer_case: 24
- find_capacity_capex: 5
- find_hardware_supply: 3
- find_startups: 28
- find_original_source: 22
- find_procurement_signal: 7
- verify_company_action: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
