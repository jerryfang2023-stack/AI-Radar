# 2026-09-06 Guanlan Daily Monitor Log

- generated_at: 2026-09-06T00:25:53.980Z
- raw_count: 248
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 11
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 46 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 48 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 14
- recovered_failed_sources_count: 7
- unrecovered_failed_sources_count: 7
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-06/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-06/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-06/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-06/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-06/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 48
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 386
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 42
- keyword_search_count: 85
- keyword_search_non_community_count: 85
- keyword_search_path_distribution: official_original=12; hardware_shipment_deployment=8; fde_customer_case=7; fde_production_rollout=7; procurement_marketplace=7; hardware_product_specs=6; fde_earnings_disclosure=5; fde_procurement_contract=5; industry_landing=5; a_media_gdelt=3; china_ai_hardware_funding=3; developer_ecosystem=3; hardware_capacity_fab=3; hardware_capex=3; hardware_oem_odm=3; capital_startup=2; hardware_supply_agreement=2; china_vertical_agent_funding=1
- keyword_search_intent_distribution: find_original_source=30; find_startups=21; find_customer_case=17; find_procurement_signal=6; verify_company_action=4; find_market_trend=3; find_capacity_capex=2; find_hardware_supply=2
- source_distribution: keyword-search=85; rss-feed=81; aihot=42; gdelt=40
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 110
- enterprise_ai_transformation_stage_distribution: platform_enablement=59; production_rollout=19; pilot=14; ai_transformation=7; procurement=6; org_build=5
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=85; rss-feed=81; aihot=42; gdelt=40
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=76; technical-iteration-signal=26; mature-commercial-signal=23; enterprise-ai-implementation-signal=21; developer-ecosystem-signal=19; capital-market-signal=15; ai-hardware-trend-innovation-signal=13; outside-core-exploration=11; early-direction-signal=8; ai-hardware-scenario-service-signal=6; china-ai-hardware-funding=6; targeted-pool-gap-refill=6; ai-hardware-investment-signal=5; china-vertical-agent-funding=5; china-local-project=3; china-policy-regulation=2; china-startup-funding=2; china-listed-disclosure=1
- theme_distribution: uncategorized=76; technical-iteration-signal=27; mature-commercial-signal=24; enterprise-ai-implementation-signal=21; developer-ecosystem-signal=17; capital-market-signal=15; ai-hardware-trend-innovation-signal=13; outside-core-exploration=11; early-direction-signal=8; ai-hardware-scenario-service-signal=6; china-ai-hardware-funding=6; targeted-pool-gap-refill=6; ai-hardware-investment-signal=5; china-vertical-agent-funding=5; china-local-project=3; china-policy-regulation=2; china-startup-funding=2; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=98; event=80; regulatory_or_procurement=20; research_or_report=14; official_index_or_directory=11; supporting_article=10; changelog_or_release=7; community_feedback=4; search_result_or_tool_directory=3; event_on_official_page=1
- pool_route_distribution: watchlist=116; core_pool=50; index_only=45; discard=32; emerging_pool=32
- pool_index_route_distribution: watchlist=116; core_pool=50; index_only=45; emerging_pool=32
- pool_index_count: 216
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 171
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 121
- index_only_pool_count: 45
- aihot_index_only_count: 15
- aihot_core_count: 13
- aihot_daily_index_only_count: 11
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 216
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact funding: RSS cn-ithome-rss: fetch failed; source-artifact keyword: keyword-search pre-gate filtered 71 result(s): social_or_profile_source=32; missing_ai_anchor_in_result=27; broad_list_or_market_report=8; noise_term:hiring=2; noise_term:meme=2; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "applied AI deployment customer workflow announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 3 result(s): missing_ai_anchor_in_result=3; targeted pool/core refill cycle 1 added 6 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=99; industry_media=28; media=23; news=20; developer=13; operators=13; official=12; product=12; builder=11; newsletter=8; industry=5; funding=1; listed_company_disclosure=1; marketplace=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=91; fetched-readable-text-main=44; fetched-readable-text-article=30; fetched-readable-text-body-visible-text=20; blocked-http-403=16; fetched-readable-text-json-ld=14; no-url-summary-only=14; summary-only-low-readable-body=7; blocked-http-401=3; timeout-fallback-visible-text=3; binary-text-rejected=2; fetch-failed-fallback-visible-text=2; fetched-readable-text-meta-description=2
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 43
- B: 124
- S: 39
- C: 13
- ungraded: 29

## Evidence Object Type Distribution

- case_or_customer: 98
- event: 80
- event_on_official_page: 1
- regulatory_or_procurement: 20
- changelog_or_release: 7
- community_feedback: 4
- research_or_report: 14
- search_result_or_tool_directory: 3
- supporting_article: 10
- official_index_or_directory: 11

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 24
- 技术迭代信号 (technical-iteration-signal): 27
- 开发者生态信号 (developer-ecosystem-signal): 17
- 资本市场信号 (capital-market-signal): 15
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 6
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 13
- china-vertical-agent-funding (china-vertical-agent-funding): 5
- 早期信号 (early-direction-signal): 8
- china-ai-hardware-funding (china-ai-hardware-funding): 6
- china-local-project (china-local-project): 3
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 21
- 外围探索信号 (outside-core-exploration): 11
- targeted-pool-gap-refill (targeted-pool-gap-refill): 6
- uncategorized (uncategorized): 76
- china-policy-regulation (china-policy-regulation): 2
- china-startup-funding (china-startup-funding): 2
- china-listed-disclosure (china-listed-disclosure): 1

## Keyword Group Distribution

- mature-commercial-signal: 23
- technical-iteration-signal: 26
- developer-ecosystem-signal: 19
- capital-market-signal: 15
- ai-hardware-investment-signal: 5
- ai-hardware-scenario-service-signal: 6
- ai-hardware-trend-innovation-signal: 13
- china-vertical-agent-funding: 5
- early-direction-signal: 8
- china-ai-hardware-funding: 6
- china-local-project: 3
- enterprise-ai-implementation-signal: 21
- outside-core-exploration: 11
- targeted-pool-gap-refill: 6
- uncategorized: 76
- china-policy-regulation: 2
- china-startup-funding: 2
- china-listed-disclosure: 1

## Keyword Search Path Distribution

- a_media_gdelt: 3
- hardware_product_specs: 6
- hardware_supply_agreement: 2
- china_vertical_agent_funding: 1
- official_original: 12
- procurement_marketplace: 7
- hardware_shipment_deployment: 8
- china_ai_hardware_funding: 3
- hardware_capex: 3
- fde_procurement_contract: 5
- hardware_capacity_fab: 3
- developer_ecosystem: 3
- industry_landing: 5
- fde_production_rollout: 7
- fde_earnings_disclosure: 5
- hardware_oem_odm: 3
- fde_customer_case: 7
- capital_startup: 2

## Keyword Search Intent Distribution

- find_market_trend: 3
- find_startups: 21
- find_customer_case: 17
- find_hardware_supply: 2
- verify_company_action: 4
- find_capacity_capex: 2
- find_original_source: 30
- find_procurement_signal: 6

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
