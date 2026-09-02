# 2026-09-02 Guanlan Daily Monitor Log

- generated_at: 2026-09-02T00:23:57.667Z
- raw_count: 197
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
- provider_fallback_notes: Search cross-entry dedupe removed 54 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 93 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 28
- recovered_failed_sources_count: 7
- unrecovered_failed_sources_count: 21
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-02/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-02/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-02/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-02/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-02/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 93
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 499
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 38
- keyword_search_count: 61
- keyword_search_non_community_count: 57
- keyword_search_path_distribution: fde_procurement_contract=9; hardware_oem_odm=8; fde_customer_case=6; fde_production_rollout=5; a_media_gdelt=4; community_feedback=4; developer_ecosystem=4; hardware_shipment_deployment=4; hardware_capacity_fab=3; hardware_capex=3; hardware_supply_agreement=3; fde_earnings_disclosure=2; hardware_product_specs=2; official_original=2; industry_landing=1; procurement_marketplace=1
- keyword_search_intent_distribution: find_original_source=18; find_customer_case=14; find_startups=10; find_market_trend=4; find_user_feedback=4; verify_company_action=4; find_capacity_capex=3; find_hardware_supply=3; find_procurement_signal=1
- source_distribution: rss-feed=92; keyword-search=61; aihot=38; gdelt=6
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 73
- enterprise_ai_transformation_stage_distribution: platform_enablement=42; production_rollout=12; pilot=9; ai_transformation=5; org_build=4; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: rss-feed=92; keyword-search=61; aihot=38; gdelt=6
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=85; technical-iteration-signal=24; developer-ecosystem-signal=18; enterprise-ai-implementation-signal=15; mature-commercial-signal=13; capital-market-signal=11; ai-hardware-trend-innovation-signal=8; outside-core-exploration=6; ai-hardware-scenario-service-signal=5; early-direction-signal=5; china-local-project=3; china-policy-regulation=2; china-listed-disclosure=1; china-startup-funding=1
- theme_distribution: uncategorized=85; technical-iteration-signal=25; developer-ecosystem-signal=15; enterprise-ai-implementation-signal=15; mature-commercial-signal=14; capital-market-signal=12; ai-hardware-trend-innovation-signal=8; outside-core-exploration=6; ai-hardware-scenario-service-signal=5; early-direction-signal=5; china-local-project=3; china-policy-regulation=2; china-listed-disclosure=1; china-startup-funding=1
- theme_concentration_warning: warning: uncategorized concentration 43.1% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- evidence_object_type_distribution: event=83; case_or_customer=57; regulatory_or_procurement=12; supporting_article=12; official_index_or_directory=11; research_or_report=8; changelog_or_release=5; pricing_change=3; community_feedback=2; search_result_or_tool_directory=2; ecosystem_package_or_model_index=1; event_on_official_page=1
- pool_route_distribution: watchlist=87; core_pool=43; index_only=39; emerging_pool=34; discard=22
- pool_index_route_distribution: watchlist=87; core_pool=43; index_only=39; emerging_pool=34
- pool_index_count: 175
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 136
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 93
- index_only_pool_count: 39
- aihot_index_only_count: 15
- aihot_core_count: 10
- aihot_daily_index_only_count: 8
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 175
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 117 result(s): missing_ai_anchor_in_result=100; social_or_profile_source=7; broad_list_or_market_report=6; noise_term:dictionary=2; noise_term:career=1; noise_term:hiring=1; source-artifact keyword: Anysearch fallback for query "FDE AI implementation production rollout announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "applied AI engineer enterprise customer case announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "public sector AI procurement pilot announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced September 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced September 2026 ("production rollout" OR "go live" OR "in production" OR pilot OR deployment) (AI OR agent) (official OR newsroom OR customer)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "FDE AI implementation production rollout announced September 2026 ("production rollout" OR "go live" OR "in production" OR pilot OR deployment) (AI OR agent) (official OR newsroom OR customer)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "enterprise AI production rollout case study announced September 2026 ("production rollout" OR "go live" OR "in production" OR pilot OR deployment) (AI OR agent) (official OR newsroom OR customer)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "enterprise AI transformation production rollout customer deployment announced September 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "agent governance evals production rollout enterprise AI announced September 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "open-source AI agent GitHub enterprise adoption announced September 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI implementation startup funding enterprise workflow announced September 2026 (AI server OR AI hardware) (OEM OR ODM OR "contract manufacturer" OR "manufacturing partner") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI accelerator supply agreement data center announced September 2026 (GPU OR accelerator OR HBM OR AI server) ("supply agreement" OR "supply contract" OR supplier OR "purchasing agreement") (official OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "site:supermicro.com/en/pressreleases "Supermicro Simplifies Edge AI Deployments" Red Hat Everpure announced September 2026 (GPU OR accelerator OR AI server OR cluster) (shipment OR ships OR delivery OR install OR deployment) (customer OR site OR official)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "(人工智能产业园 OR 大模型项目 OR 智算中心) (签约 OR 落地 OR 开工 OR 投产) (市政府 OR 区政府 OR 管委会) announced September 2026 (AI infrastructure OR data center OR fab) (capex OR "capital expenditure" OR "capital spending" OR investment) (earnings OR official)": Anysearch returned 0 usable results; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 10 result(s): missing_ai_anchor_in_result=10; targeted pool/core refill cycle 1 returned 0 usable result(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=67; media=25; product=18; news=15; developer=14; industry_media=12; official=12; builder=10; newsletter=8; operators=8; funding=7; marketplace=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=75; fetched-readable-text-main=31; fetched-readable-text-body-visible-text=21; fetched-readable-text-article=19; blocked-http-403=14; fetched-readable-text-json-ld=13; no-url-summary-only=10; summary-only-low-readable-body=7; http-429-fallback-text=5; binary-text-rejected=1; blocked-http-401=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 45
- B: 92
- A: 40
- ungraded: 12
- C: 8

## Evidence Object Type Distribution

- event: 83
- supporting_article: 12
- case_or_customer: 57
- research_or_report: 8
- regulatory_or_procurement: 12
- changelog_or_release: 5
- ecosystem_package_or_model_index: 1
- official_index_or_directory: 11
- community_feedback: 2
- pricing_change: 3
- search_result_or_tool_directory: 2
- event_on_official_page: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 5
- 外围探索信号 (outside-core-exploration): 6
- 成熟信号 (mature-commercial-signal): 14
- 开发者生态信号 (developer-ecosystem-signal): 15
- 技术迭代信号 (technical-iteration-signal): 25
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 15
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 8
- china-local-project (china-local-project): 3
- 资本市场信号 (capital-market-signal): 12
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 5
- uncategorized (uncategorized): 85
- china-policy-regulation (china-policy-regulation): 2
- china-listed-disclosure (china-listed-disclosure): 1
- china-startup-funding (china-startup-funding): 1

## Keyword Group Distribution

- early-direction-signal: 5
- outside-core-exploration: 6
- mature-commercial-signal: 13
- developer-ecosystem-signal: 18
- technical-iteration-signal: 24
- enterprise-ai-implementation-signal: 15
- ai-hardware-trend-innovation-signal: 8
- china-local-project: 3
- capital-market-signal: 11
- ai-hardware-scenario-service-signal: 5
- uncategorized: 85
- china-policy-regulation: 2
- china-listed-disclosure: 1
- china-startup-funding: 1

## Keyword Search Path Distribution

- fde_procurement_contract: 9
- hardware_supply_agreement: 3
- hardware_capex: 3
- developer_ecosystem: 4
- hardware_oem_odm: 8
- fde_production_rollout: 5
- hardware_shipment_deployment: 4
- hardware_capacity_fab: 3
- a_media_gdelt: 4
- official_original: 2
- fde_customer_case: 6
- community_feedback: 4
- fde_earnings_disclosure: 2
- industry_landing: 1
- procurement_marketplace: 1
- hardware_product_specs: 2

## Keyword Search Intent Distribution

- find_customer_case: 14
- find_hardware_supply: 3
- verify_company_action: 4
- find_startups: 10
- find_original_source: 18
- find_capacity_capex: 3
- find_market_trend: 4
- find_user_feedback: 4
- find_procurement_signal: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
