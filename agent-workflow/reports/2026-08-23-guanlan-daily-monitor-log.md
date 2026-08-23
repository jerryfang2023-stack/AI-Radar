# 2026-08-23 Guanlan Daily Monitor Log

- generated_at: 2026-08-23T03:40:38.085Z
- raw_count: 241
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 1
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 65 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 69 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 20
- recovered_failed_sources_count: 10
- unrecovered_failed_sources_count: 10
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-23/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-23/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-23/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-23/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-23/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 69
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 391
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 29
- keyword_search_count: 99
- keyword_search_non_community_count: 99
- keyword_search_path_distribution: official_original=28; hardware_shipment_deployment=10; developer_ecosystem=7; fde_procurement_contract=7; fde_earnings_disclosure=6; industry_landing=6; a_media_gdelt=5; fde_production_rollout=5; hardware_capacity_fab=5; hardware_oem_odm=5; procurement_marketplace=5; hardware_product_specs=4; capital_startup=3; fde_customer_case=3
- keyword_search_intent_distribution: find_original_source=46; find_startups=21; find_customer_case=17; find_market_trend=5; find_capacity_capex=4; find_procurement_signal=3; verify_company_action=3
- source_distribution: keyword-search=99; rss-feed=87; aihot=29; gdelt=26
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 120
- enterprise_ai_transformation_stage_distribution: platform_enablement=52; pilot=23; production_rollout=23; ai_transformation=11; org_build=6; procurement=5
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=99; rss-feed=87; aihot=29; gdelt=26
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=79; mature-commercial-signal=23; developer-ecosystem-signal=20; targeted-pool-gap-refill=20; enterprise-ai-implementation-signal=18; capital-market-signal=14; early-direction-signal=13; ai-hardware-trend-innovation-signal=11; outside-core-exploration=11; technical-iteration-signal=11; ai-hardware-scenario-service-signal=7; ai-hardware-investment-signal=5; china-listed-disclosure=3; china-policy-regulation=3; china-startup-funding=3
- theme_distribution: uncategorized=79; mature-commercial-signal=23; targeted-pool-gap-refill=20; enterprise-ai-implementation-signal=18; capital-market-signal=16; developer-ecosystem-signal=16; early-direction-signal=13; technical-iteration-signal=13; ai-hardware-trend-innovation-signal=11; outside-core-exploration=11; ai-hardware-scenario-service-signal=7; ai-hardware-investment-signal=5; china-listed-disclosure=3; china-policy-regulation=3; china-startup-funding=3
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=106; event=79; regulatory_or_procurement=14; research_or_report=11; changelog_or_release=9; pricing_change=7; supporting_article=7; official_index_or_directory=4; community_feedback=2; ecosystem_package_or_model_index=1; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=114; core_pool=62; index_only=38; emerging_pool=34; discard=22
- pool_index_route_distribution: watchlist=114; core_pool=62; index_only=38; emerging_pool=34
- pool_index_count: 219
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 181
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 119
- index_only_pool_count: 38
- aihot_index_only_count: 6
- aihot_core_count: 14
- aihot_daily_index_only_count: 1
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 219
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 55 result(s): social_or_profile_source=35; broad_list_or_market_report=8; missing_ai_anchor_in_result=7; noise_term:affiliate=2; noise_term:definition=1; noise_term:hiring=1; noise_term:translation=1; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "FDE AI implementation production rollout announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "enterprise AI transformation production rollout customer deployment announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "agent governance evals production rollout enterprise AI announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=2; social_or_profile_source=2; targeted pool/core refill cycle 1 added 20 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=94; media=22; news=19; operators=18; industry_media=17; developer=15; newsletter=14; builder=12; product=11; funding=10; official=6; industry=2; domestic_vendor=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=80; fetched-readable-text-main=50; fetched-readable-text-body-visible-text=37; fetched-readable-text-article=28; blocked-http-403=15; fetched-readable-text-json-ld=13; summary-only-low-readable-body=6; blocked-http-401=4; fetched-readable-text-meta-description=3; no-url-summary-only=3; binary-text-rejected=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 133
- A: 41
- C: 18
- S: 32
- ungraded: 17

## Evidence Object Type Distribution

- event: 79
- case_or_customer: 106
- changelog_or_release: 9
- regulatory_or_procurement: 14
- official_index_or_directory: 4
- pricing_change: 7
- ecosystem_package_or_model_index: 1
- research_or_report: 11
- community_feedback: 2
- supporting_article: 7
- search_result_or_tool_directory: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 13
- 开发者生态信号 (developer-ecosystem-signal): 16
- 技术迭代信号 (technical-iteration-signal): 13
- 资本市场信号 (capital-market-signal): 16
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 18
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 7
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 11
- china-listed-disclosure (china-listed-disclosure): 3
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- 外围探索信号 (outside-core-exploration): 11
- 成熟信号 (mature-commercial-signal): 23
- targeted-pool-gap-refill (targeted-pool-gap-refill): 20
- uncategorized (uncategorized): 79
- china-startup-funding (china-startup-funding): 3
- china-policy-regulation (china-policy-regulation): 3

## Keyword Group Distribution

- early-direction-signal: 13
- developer-ecosystem-signal: 20
- technical-iteration-signal: 11
- capital-market-signal: 14
- enterprise-ai-implementation-signal: 18
- ai-hardware-scenario-service-signal: 7
- ai-hardware-trend-innovation-signal: 11
- china-listed-disclosure: 3
- ai-hardware-investment-signal: 5
- outside-core-exploration: 11
- mature-commercial-signal: 23
- targeted-pool-gap-refill: 20
- uncategorized: 79
- china-startup-funding: 3
- china-policy-regulation: 3

## Keyword Search Path Distribution

- a_media_gdelt: 5
- fde_procurement_contract: 7
- hardware_capacity_fab: 5
- hardware_product_specs: 4
- fde_earnings_disclosure: 6
- capital_startup: 3
- hardware_shipment_deployment: 10
- hardware_oem_odm: 5
- procurement_marketplace: 5
- official_original: 28
- developer_ecosystem: 7
- fde_production_rollout: 5
- fde_customer_case: 3
- industry_landing: 6

## Keyword Search Intent Distribution

- find_market_trend: 5
- find_customer_case: 17
- find_capacity_capex: 4
- find_original_source: 46
- verify_company_action: 3
- find_startups: 21
- find_procurement_signal: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
