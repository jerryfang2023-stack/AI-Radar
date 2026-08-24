# 2026-08-24 Guanlan Daily Monitor Log

- generated_at: 2026-08-24T00:23:19.657Z
- raw_count: 244
- aihot_mode: source-artifacts
- aihot_since: 
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
- provider_fallback_notes: Search cross-entry dedupe removed 63 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 68 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 22
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 13
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-24/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-24/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-24/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-24/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-24/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 68
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 388
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 31
- keyword_search_count: 99
- keyword_search_non_community_count: 99
- keyword_search_path_distribution: official_original=31; hardware_shipment_deployment=12; fde_procurement_contract=6; industry_landing=6; developer_ecosystem=5; fde_production_rollout=5; hardware_capacity_fab=5; hardware_oem_odm=5; hardware_product_specs=5; procurement_marketplace=5; a_media_gdelt=4; fde_earnings_disclosure=4; capital_startup=3; fde_customer_case=3
- keyword_search_intent_distribution: find_original_source=46; find_customer_case=21; find_startups=20; find_capacity_capex=4; find_market_trend=4; find_procurement_signal=3; verify_company_action=1
- source_distribution: keyword-search=99; rss-feed=86; aihot=31; gdelt=28
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 115
- enterprise_ai_transformation_stage_distribution: platform_enablement=51; production_rollout=25; pilot=22; ai_transformation=10; org_build=4; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=99; rss-feed=86; aihot=31; gdelt=28
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=79; targeted-pool-gap-refill=22; technical-iteration-signal=19; mature-commercial-signal=18; developer-ecosystem-signal=17; enterprise-ai-implementation-signal=17; capital-market-signal=14; early-direction-signal=13; outside-core-exploration=12; ai-hardware-trend-innovation-signal=11; ai-hardware-scenario-service-signal=10; ai-hardware-investment-signal=6; china-startup-funding=3; china-policy-regulation=2; china-listed-disclosure=1
- theme_distribution: uncategorized=79; targeted-pool-gap-refill=22; technical-iteration-signal=19; mature-commercial-signal=18; enterprise-ai-implementation-signal=17; capital-market-signal=15; developer-ecosystem-signal=15; early-direction-signal=14; outside-core-exploration=12; ai-hardware-trend-innovation-signal=11; ai-hardware-scenario-service-signal=10; ai-hardware-investment-signal=6; china-startup-funding=3; china-policy-regulation=2; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=110; event=69; research_or_report=16; regulatory_or_procurement=14; supporting_article=13; pricing_change=7; changelog_or_release=6; community_feedback=4; official_index_or_directory=3; event_on_official_page=1; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=114; core_pool=54; index_only=50; emerging_pool=31; discard=21
- pool_index_route_distribution: watchlist=114; core_pool=54; index_only=50; emerging_pool=31
- pool_index_count: 223
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 173
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 119
- index_only_pool_count: 50
- aihot_index_only_count: 10
- aihot_core_count: 11
- aihot_daily_index_only_count: 2
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 223
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 47 result(s): social_or_profile_source=31; broad_list_or_market_report=7; missing_ai_anchor_in_result=6; noise_term:affiliate=1; noise_term:career=1; noise_term:definition=1; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch tech fallback for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "agent governance evals production rollout enterprise AI announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "open-source AI agent GitHub enterprise adoption announced August 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch tech fallback for query "(人工智能产业园 OR 大模型项目 OR 智算中心) (签约 OR 落地 OR 开工 OR 投产) (市政府 OR 区政府 OR 管委会) announced August 2026 (AI infrastructure OR data center OR fab) (capex OR "capital expenditure" OR "capital spending" OR investment) (earnings OR official)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "(人工智能产业园 OR 大模型项目 OR 智算中心) (签约 OR 落地 OR 开工 OR 投产) (市政府 OR 区政府 OR 管委会) announced August 2026 (AI infrastructure OR data center OR fab) (capex OR "capital expenditure" OR "capital spending" OR investment) (earnings OR official)": tech: Anysearch Search service temporarily unavailable.; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=1; social_or_profile_source=1; targeted pool/core refill cycle 1 added 22 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=97; industry_media=25; media=23; news=18; operators=17; product=13; developer=12; builder=10; funding=10; newsletter=7; official=7; analysis=2; industry=2; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=82; fetched-readable-text-main=50; fetched-readable-text-body-visible-text=36; fetched-readable-text-article=27; fetched-readable-text-json-ld=16; blocked-http-403=12; summary-only-low-readable-body=7; blocked-http-401=6; no-url-summary-only=4; fetched-readable-text-meta-description=2; binary-text-rejected=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 42
- B: 128
- S: 32
- C: 17
- ungraded: 25

## Evidence Object Type Distribution

- research_or_report: 16
- community_feedback: 4
- case_or_customer: 110
- event: 69
- pricing_change: 7
- regulatory_or_procurement: 14
- changelog_or_release: 6
- supporting_article: 13
- event_on_official_page: 1
- official_index_or_directory: 3
- search_result_or_tool_directory: 1

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 19
- 资本市场信号 (capital-market-signal): 15
- AI Hardware investment and financing (ai-hardware-investment-signal): 6
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 11
- china-listed-disclosure (china-listed-disclosure): 1
- 早期信号 (early-direction-signal): 14
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 17
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 10
- 成熟信号 (mature-commercial-signal): 18
- 外围探索信号 (outside-core-exploration): 12
- 开发者生态信号 (developer-ecosystem-signal): 15
- targeted-pool-gap-refill (targeted-pool-gap-refill): 22
- uncategorized (uncategorized): 79
- china-policy-regulation (china-policy-regulation): 2
- china-startup-funding (china-startup-funding): 3

## Keyword Group Distribution

- technical-iteration-signal: 19
- capital-market-signal: 14
- ai-hardware-investment-signal: 6
- ai-hardware-trend-innovation-signal: 11
- china-listed-disclosure: 1
- early-direction-signal: 13
- enterprise-ai-implementation-signal: 17
- ai-hardware-scenario-service-signal: 10
- mature-commercial-signal: 18
- outside-core-exploration: 12
- developer-ecosystem-signal: 17
- targeted-pool-gap-refill: 22
- uncategorized: 79
- china-policy-regulation: 2
- china-startup-funding: 3

## Keyword Search Path Distribution

- a_media_gdelt: 4
- hardware_product_specs: 5
- fde_earnings_disclosure: 4
- hardware_oem_odm: 5
- capital_startup: 3
- procurement_marketplace: 5
- official_original: 31
- fde_customer_case: 3
- hardware_shipment_deployment: 12
- hardware_capacity_fab: 5
- fde_procurement_contract: 6
- fde_production_rollout: 5
- developer_ecosystem: 5
- industry_landing: 6

## Keyword Search Intent Distribution

- find_market_trend: 4
- find_startups: 20
- find_original_source: 46
- verify_company_action: 1
- find_customer_case: 21
- find_capacity_capex: 4
- find_procurement_signal: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
