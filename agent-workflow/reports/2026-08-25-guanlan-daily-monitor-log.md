# 2026-08-25 Guanlan Daily Monitor Log

- generated_at: 2026-08-25T03:01:58.724Z
- raw_count: 259
- aihot_mode: source-artifacts
- aihot_since: 
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
- provider_fallback_notes: Search cross-entry dedupe removed 68 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 51 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 22
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 13
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-25/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-25/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-25/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-25/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-25/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 51
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 539
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 46
- keyword_search_count: 98
- keyword_search_non_community_count: 98
- keyword_search_path_distribution: official_original=28; hardware_shipment_deployment=10; a_media_gdelt=8; procurement_marketplace=7; hardware_capacity_fab=6; industry_landing=6; developer_ecosystem=5; fde_procurement_contract=5; fde_production_rollout=5; fde_earnings_disclosure=4; hardware_oem_odm=4; hardware_product_specs=4; capital_startup=3; fde_customer_case=3
- keyword_search_intent_distribution: find_original_source=43; find_startups=20; find_customer_case=17; find_market_trend=8; find_capacity_capex=5; find_procurement_signal=4; verify_company_action=1
- source_distribution: keyword-search=98; rss-feed=86; aihot=46; gdelt=29
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 116
- enterprise_ai_transformation_stage_distribution: platform_enablement=56; production_rollout=24; pilot=21; ai_transformation=9; procurement=4; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=98; rss-feed=86; aihot=46; gdelt=29
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=78; technical-iteration-signal=27; mature-commercial-signal=25; developer-ecosystem-signal=21; targeted-pool-gap-refill=20; enterprise-ai-implementation-signal=16; capital-market-signal=15; early-direction-signal=14; ai-hardware-trend-innovation-signal=11; outside-core-exploration=10; ai-hardware-investment-signal=7; ai-hardware-scenario-service-signal=7; china-startup-funding=4; china-policy-regulation=3; china-listed-disclosure=1
- theme_distribution: uncategorized=78; technical-iteration-signal=28; mature-commercial-signal=25; targeted-pool-gap-refill=20; developer-ecosystem-signal=19; enterprise-ai-implementation-signal=16; capital-market-signal=15; early-direction-signal=15; ai-hardware-trend-innovation-signal=11; outside-core-exploration=10; ai-hardware-investment-signal=7; ai-hardware-scenario-service-signal=7; china-startup-funding=4; china-policy-regulation=3; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=114; event=86; regulatory_or_procurement=16; official_index_or_directory=10; supporting_article=10; research_or_report=9; changelog_or_release=5; pricing_change=4; community_feedback=2; event_on_official_page=2; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=121; core_pool=60; index_only=48; emerging_pool=35; discard=24
- pool_index_route_distribution: watchlist=121; core_pool=60; index_only=48; emerging_pool=35
- pool_index_count: 235
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 187
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 127
- index_only_pool_count: 48
- aihot_index_only_count: 15
- aihot_core_count: 20
- aihot_daily_index_only_count: 11
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 235
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 59 result(s): social_or_profile_source=34; broad_list_or_market_report=10; missing_ai_anchor_in_result=10; noise_term:hiring=2; noise_term:affiliate=1; noise_term:career=1; noise_term:definition=1; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch tech fallback for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch tech fallback for query "enterprise AI transformation production rollout customer deployment announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "enterprise AI transformation production rollout customer deployment announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "enterprise AI transformation production rollout customer deployment announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "agent governance evals production rollout enterprise AI announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 1 added 20 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=109; industry_media=21; media=21; news=19; operators=19; newsletter=13; product=13; developer=11; official=11; builder=10; funding=10; industry=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=93; fetched-readable-text-main=52; fetched-readable-text-body-visible-text=36; fetched-readable-text-article=24; blocked-http-403=15; no-url-summary-only=13; summary-only-low-readable-body=11; fetched-readable-text-json-ld=10; blocked-http-401=4; binary-text-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- ungraded: 21
- C: 19
- S: 35
- B: 143
- A: 41

## Evidence Object Type Distribution

- event: 86
- case_or_customer: 114
- research_or_report: 9
- pricing_change: 4
- changelog_or_release: 5
- regulatory_or_procurement: 16
- community_feedback: 2
- supporting_article: 10
- event_on_official_page: 2
- search_result_or_tool_directory: 1
- official_index_or_directory: 10

## Theme Distribution

- 早期信号 (early-direction-signal): 15
- 外围探索信号 (outside-core-exploration): 10
- 开发者生态信号 (developer-ecosystem-signal): 19
- 技术迭代信号 (technical-iteration-signal): 28
- 资本市场信号 (capital-market-signal): 15
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 16
- AI Hardware investment and financing (ai-hardware-investment-signal): 7
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 7
- china-listed-disclosure (china-listed-disclosure): 1
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 11
- 成熟信号 (mature-commercial-signal): 25
- targeted-pool-gap-refill (targeted-pool-gap-refill): 20
- uncategorized (uncategorized): 78
- china-startup-funding (china-startup-funding): 4
- china-policy-regulation (china-policy-regulation): 3

## Keyword Group Distribution

- early-direction-signal: 14
- outside-core-exploration: 10
- developer-ecosystem-signal: 21
- technical-iteration-signal: 27
- capital-market-signal: 15
- enterprise-ai-implementation-signal: 16
- ai-hardware-investment-signal: 7
- ai-hardware-scenario-service-signal: 7
- china-listed-disclosure: 1
- ai-hardware-trend-innovation-signal: 11
- mature-commercial-signal: 25
- targeted-pool-gap-refill: 20
- uncategorized: 78
- china-startup-funding: 4
- china-policy-regulation: 3

## Keyword Search Path Distribution

- a_media_gdelt: 8
- fde_customer_case: 3
- hardware_product_specs: 4
- hardware_capacity_fab: 6
- fde_earnings_disclosure: 4
- fde_production_rollout: 5
- hardware_shipment_deployment: 10
- capital_startup: 3
- developer_ecosystem: 5
- hardware_oem_odm: 4
- procurement_marketplace: 7
- fde_procurement_contract: 5
- official_original: 28
- industry_landing: 6

## Keyword Search Intent Distribution

- find_market_trend: 8
- find_customer_case: 17
- find_startups: 20
- find_capacity_capex: 5
- verify_company_action: 1
- find_original_source: 43
- find_procurement_signal: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
