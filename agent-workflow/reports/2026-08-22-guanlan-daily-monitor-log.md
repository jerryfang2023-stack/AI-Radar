# 2026-08-22 Guanlan Daily Monitor Log

- generated_at: 2026-08-22T00:21:24.556Z
- raw_count: 252
- aihot_mode: source-artifacts
- aihot_since: 
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
- provider_fallback_notes: Search cross-entry dedupe removed 62 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 58 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 23
- recovered_failed_sources_count: 11
- unrecovered_failed_sources_count: 12
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-22/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-22/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-22/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-22/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-22/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 58
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 520
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 34
- keyword_search_count: 103
- keyword_search_non_community_count: 103
- keyword_search_path_distribution: official_original=29; hardware_shipment_deployment=13; hardware_product_specs=8; developer_ecosystem=7; industry_landing=7; fde_procurement_contract=6; hardware_oem_odm=5; a_media_gdelt=4; capital_startup=4; fde_customer_case=4; fde_earnings_disclosure=4; fde_production_rollout=3; hardware_capacity_fab=3; hardware_supply_agreement=3; procurement_marketplace=3
- keyword_search_intent_distribution: find_original_source=42; find_customer_case=23; find_startups=22; find_market_trend=4; find_procurement_signal=4; find_capacity_capex=3; find_hardware_supply=3; verify_company_action=2
- source_distribution: keyword-search=103; rss-feed=85; aihot=34; gdelt=30
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 121
- enterprise_ai_transformation_stage_distribution: platform_enablement=57; production_rollout=28; pilot=17; ai_transformation=10; org_build=6; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=103; rss-feed=85; aihot=34; gdelt=30
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=76; developer-ecosystem-signal=28; mature-commercial-signal=21; targeted-pool-gap-refill=20; technical-iteration-signal=17; capital-market-signal=15; enterprise-ai-implementation-signal=14; ai-hardware-trend-innovation-signal=13; early-direction-signal=12; ai-hardware-scenario-service-signal=10; outside-core-exploration=10; ai-hardware-investment-signal=8; china-startup-funding=4; china-listed-disclosure=2; china-policy-regulation=2
- theme_distribution: uncategorized=76; developer-ecosystem-signal=25; mature-commercial-signal=21; targeted-pool-gap-refill=20; technical-iteration-signal=19; capital-market-signal=16; enterprise-ai-implementation-signal=14; ai-hardware-trend-innovation-signal=13; early-direction-signal=12; ai-hardware-scenario-service-signal=10; outside-core-exploration=10; ai-hardware-investment-signal=8; china-startup-funding=4; china-listed-disclosure=2; china-policy-regulation=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=114; event=80; regulatory_or_procurement=13; official_index_or_directory=11; changelog_or_release=8; research_or_report=8; supporting_article=7; community_feedback=4; pricing_change=4; event_on_official_page=2; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=113; core_pool=67; emerging_pool=55; index_only=42; discard=24
- pool_index_route_distribution: watchlist=113; core_pool=67; emerging_pool=55; index_only=42
- pool_index_count: 228
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 186
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 119
- index_only_pool_count: 42
- aihot_index_only_count: 15
- aihot_core_count: 12
- aihot_daily_index_only_count: 10
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=1/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 228
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 53 result(s): social_or_profile_source=26; broad_list_or_market_report=7; missing_ai_anchor_in_result=7; noise_term:affiliate=5; noise_term:hiring=5; noise_term:career=1; noise_term:definition=1; noise_term:translation=1; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "FDE AI implementation production rollout announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch tech fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch tech fallback for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": Anysearch Search service temporarily unavailable.; targeted-refill pre-gate filtered 5 result(s): social_or_profile_source=3; missing_ai_anchor_in_result=2; targeted pool/core refill cycle 1 added 20 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=124; media=20; operators=16; developer=14; news=14; newsletter=14; builder=13; funding=11; industry_media=10; product=9; official=6; domestic_vendor=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=78; fetched-readable-text-main=48; fetched-readable-text-body-visible-text=38; fetched-readable-text-article=27; blocked-http-403=18; fetched-readable-text-json-ld=17; no-url-summary-only=12; http-429-fallback-text=4; summary-only-low-readable-body=4; blocked-http-401=3; fetched-readable-text-meta-description=2; binary-text-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 163
- A: 34
- S: 29
- ungraded: 10
- C: 16

## Evidence Object Type Distribution

- case_or_customer: 114
- event: 80
- research_or_report: 8
- official_index_or_directory: 11
- regulatory_or_procurement: 13
- event_on_official_page: 2
- changelog_or_release: 8
- community_feedback: 4
- pricing_change: 4
- supporting_article: 7
- search_result_or_tool_directory: 1

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 21
- 早期信号 (early-direction-signal): 12
- 技术迭代信号 (technical-iteration-signal): 19
- 外围探索信号 (outside-core-exploration): 10
- 开发者生态信号 (developer-ecosystem-signal): 25
- 资本市场信号 (capital-market-signal): 16
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 14
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 10
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 13
- china-listed-disclosure (china-listed-disclosure): 2
- AI Hardware investment and financing (ai-hardware-investment-signal): 8
- targeted-pool-gap-refill (targeted-pool-gap-refill): 20
- uncategorized (uncategorized): 76
- china-startup-funding (china-startup-funding): 4
- china-policy-regulation (china-policy-regulation): 2

## Keyword Group Distribution

- mature-commercial-signal: 21
- early-direction-signal: 12
- technical-iteration-signal: 17
- outside-core-exploration: 10
- developer-ecosystem-signal: 28
- capital-market-signal: 15
- enterprise-ai-implementation-signal: 14
- ai-hardware-scenario-service-signal: 10
- ai-hardware-trend-innovation-signal: 13
- china-listed-disclosure: 2
- ai-hardware-investment-signal: 8
- targeted-pool-gap-refill: 20
- uncategorized: 76
- china-startup-funding: 4
- china-policy-regulation: 2

## Keyword Search Path Distribution

- capital_startup: 4
- fde_customer_case: 4
- hardware_product_specs: 8
- hardware_supply_agreement: 3
- fde_earnings_disclosure: 4
- developer_ecosystem: 7
- hardware_shipment_deployment: 13
- fde_production_rollout: 3
- procurement_marketplace: 3
- fde_procurement_contract: 6
- hardware_capacity_fab: 3
- hardware_oem_odm: 5
- a_media_gdelt: 4
- official_original: 29
- industry_landing: 7

## Keyword Search Intent Distribution

- find_startups: 22
- find_customer_case: 23
- find_hardware_supply: 3
- verify_company_action: 2
- find_procurement_signal: 4
- find_capacity_capex: 3
- find_original_source: 42
- find_market_trend: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
