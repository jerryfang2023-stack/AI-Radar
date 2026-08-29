# 2026-08-29 Guanlan Daily Monitor Log

- generated_at: 2026-08-29T03:34:26.300Z
- raw_count: 257
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 12
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 70 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 59 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 18
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 10
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-29/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-29/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-29/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-29/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-29/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 59
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 514
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 37
- keyword_search_count: 107
- keyword_search_non_community_count: 107
- keyword_search_path_distribution: official_original=30; developer_ecosystem=11; hardware_shipment_deployment=11; capital_startup=8; fde_procurement_contract=6; fde_production_rollout=6; hardware_product_specs=6; hardware_capacity_fab=5; industry_landing=5; procurement_marketplace=5; a_media_gdelt=4; fde_earnings_disclosure=4; hardware_oem_odm=3; fde_customer_case=2; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=48; find_startups=26; find_customer_case=21; find_capacity_capex=4; find_market_trend=4; find_procurement_signal=2; find_hardware_supply=1; verify_company_action=1
- source_distribution: keyword-search=107; rss-feed=87; aihot=37; gdelt=26
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 119
- enterprise_ai_transformation_stage_distribution: platform_enablement=56; pilot=26; production_rollout=21; ai_transformation=11; org_build=4; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=107; rss-feed=87; aihot=37; gdelt=26
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=80; targeted-pool-gap-refill=26; developer-ecosystem-signal=24; mature-commercial-signal=22; technical-iteration-signal=22; enterprise-ai-implementation-signal=19; ai-hardware-trend-innovation-signal=14; capital-market-signal=12; early-direction-signal=12; ai-hardware-scenario-service-signal=10; outside-core-exploration=6; ai-hardware-investment-signal=4; china-startup-funding=3; china-policy-regulation=2; china-listed-disclosure=1
- theme_distribution: uncategorized=80; targeted-pool-gap-refill=26; technical-iteration-signal=25; mature-commercial-signal=22; developer-ecosystem-signal=19; enterprise-ai-implementation-signal=19; ai-hardware-trend-innovation-signal=14; capital-market-signal=14; early-direction-signal=12; ai-hardware-scenario-service-signal=10; outside-core-exploration=6; ai-hardware-investment-signal=4; china-startup-funding=3; china-policy-regulation=2; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=112; event=86; official_index_or_directory=14; regulatory_or_procurement=14; research_or_report=10; changelog_or_release=7; supporting_article=6; search_result_or_tool_directory=3; pricing_change=2; community_feedback=1; ecosystem_package_or_model_index=1; event_on_official_page=1
- pool_route_distribution: watchlist=136; index_only=48; emerging_pool=42; core_pool=41; discard=26
- pool_index_route_distribution: watchlist=136; index_only=48; emerging_pool=42; core_pool=41
- pool_index_count: 231
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 183
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 142
- index_only_pool_count: 48
- aihot_index_only_count: 13
- aihot_core_count: 10
- aihot_daily_index_only_count: 12
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5; important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 231
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 49 result(s): social_or_profile_source=22; missing_ai_anchor_in_result=15; broad_list_or_market_report=11; noise_term:definition=1; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "agent governance evals production rollout enterprise AI announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "open-source AI agent GitHub enterprise adoption announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; targeted-refill pre-gate filtered 6 result(s): missing_ai_anchor_in_result=3; social_or_profile_source=2; broad_list_or_market_report=1; targeted pool/core refill cycle 1 added 26 item(s) for important_case=0/5; important_funding=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=107; media=23; news=22; developer=16; operators=16; product=14; industry_media=13; newsletter=13; official=12; builder=10; funding=9; company_official=1; industry=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=76; fetched-readable-text-main=53; fetched-readable-text-body-visible-text=33; fetched-readable-text-article=24; fetched-readable-text-json-ld=23; blocked-http-403=16; no-url-summary-only=15; summary-only-low-readable-body=6; blocked-http-401=4; http-429-fallback-text=3; binary-text-rejected=1; fetch-failed-fallback-visible-text=1; fetched-readable-text-meta-description=1; http-405-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 143
- A: 45
- S: 39
- C: 16
- ungraded: 14

## Evidence Object Type Distribution

- event: 86
- case_or_customer: 112
- changelog_or_release: 7
- regulatory_or_procurement: 14
- pricing_change: 2
- official_index_or_directory: 14
- ecosystem_package_or_model_index: 1
- event_on_official_page: 1
- community_feedback: 1
- research_or_report: 10
- supporting_article: 6
- search_result_or_tool_directory: 3

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 22
- 开发者生态信号 (developer-ecosystem-signal): 19
- 技术迭代信号 (technical-iteration-signal): 25
- 资本市场信号 (capital-market-signal): 14
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 19
- AI Hardware investment and financing (ai-hardware-investment-signal): 4
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 10
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 14
- china-listed-disclosure (china-listed-disclosure): 1
- 早期信号 (early-direction-signal): 12
- 外围探索信号 (outside-core-exploration): 6
- targeted-pool-gap-refill (targeted-pool-gap-refill): 26
- uncategorized (uncategorized): 80
- china-startup-funding (china-startup-funding): 3
- china-policy-regulation (china-policy-regulation): 2

## Keyword Group Distribution

- mature-commercial-signal: 22
- developer-ecosystem-signal: 24
- technical-iteration-signal: 22
- capital-market-signal: 12
- enterprise-ai-implementation-signal: 19
- ai-hardware-investment-signal: 4
- ai-hardware-scenario-service-signal: 10
- ai-hardware-trend-innovation-signal: 14
- china-listed-disclosure: 1
- early-direction-signal: 12
- outside-core-exploration: 6
- targeted-pool-gap-refill: 26
- uncategorized: 80
- china-startup-funding: 3
- china-policy-regulation: 2

## Keyword Search Path Distribution

- a_media_gdelt: 4
- fde_procurement_contract: 6
- hardware_shipment_deployment: 11
- hardware_capacity_fab: 5
- hardware_product_specs: 6
- fde_earnings_disclosure: 4
- fde_production_rollout: 6
- hardware_supply_agreement: 1
- capital_startup: 8
- procurement_marketplace: 5
- hardware_oem_odm: 3
- developer_ecosystem: 11
- official_original: 30
- fde_customer_case: 2
- industry_landing: 5

## Keyword Search Intent Distribution

- find_market_trend: 4
- find_customer_case: 21
- find_startups: 26
- find_capacity_capex: 4
- find_original_source: 48
- verify_company_action: 1
- find_hardware_supply: 1
- find_procurement_signal: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
