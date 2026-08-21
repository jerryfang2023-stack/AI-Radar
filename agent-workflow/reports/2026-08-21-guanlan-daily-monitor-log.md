# 2026-08-21 Guanlan Daily Monitor Log

- generated_at: 2026-08-21T00:24:36.380Z
- raw_count: 252
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 14
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 77 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 46 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 22
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 13
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-08-21/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-21/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-21/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-21/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-08-21/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 46
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 547
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 50
- keyword_search_count: 89
- keyword_search_non_community_count: 88
- keyword_search_path_distribution: official_original=19; hardware_shipment_deployment=11; hardware_product_specs=8; industry_landing=7; fde_procurement_contract=6; fde_production_rollout=6; procurement_marketplace=5; developer_ecosystem=4; hardware_capacity_fab=4; a_media_gdelt=3; capital_startup=3; fde_earnings_disclosure=3; hardware_oem_odm=3; hardware_supply_agreement=3; fde_customer_case=2; community_feedback=1; hardware_capex=1
- keyword_search_intent_distribution: find_original_source=30; find_customer_case=23; find_startups=20; find_procurement_signal=4; find_capacity_capex=3; find_hardware_supply=3; find_market_trend=3; verify_company_action=2; find_user_feedback=1
- source_distribution: keyword-search=89; rss-feed=86; aihot=50; gdelt=27
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 102
- enterprise_ai_transformation_stage_distribution: platform_enablement=59; production_rollout=19; ai_transformation=9; pilot=9; org_build=3; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=89; rss-feed=86; aihot=50; gdelt=27
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=74; mature-commercial-signal=26; technical-iteration-signal=26; developer-ecosystem-signal=25; early-direction-signal=16; capital-market-signal=14; enterprise-ai-implementation-signal=14; ai-hardware-trend-innovation-signal=12; outside-core-exploration=12; ai-hardware-scenario-service-signal=9; ai-hardware-investment-signal=8; targeted-pool-gap-refill=8; china-startup-funding=4; china-policy-regulation=2; china-listed-disclosure=1; china-local-project=1
- theme_distribution: uncategorized=74; mature-commercial-signal=27; technical-iteration-signal=27; developer-ecosystem-signal=23; early-direction-signal=16; capital-market-signal=14; enterprise-ai-implementation-signal=14; ai-hardware-trend-innovation-signal=12; outside-core-exploration=12; ai-hardware-scenario-service-signal=9; ai-hardware-investment-signal=8; targeted-pool-gap-refill=8; china-startup-funding=4; china-policy-regulation=2; china-listed-disclosure=1; china-local-project=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=104; event=88; supporting_article=16; official_index_or_directory=14; regulatory_or_procurement=14; research_or_report=7; changelog_or_release=5; community_feedback=2; event_on_official_page=1; pricing_change=1
- pool_route_distribution: watchlist=119; core_pool=57; index_only=51; emerging_pool=50; discard=19
- pool_index_route_distribution: watchlist=119; core_pool=57; index_only=51; emerging_pool=50
- pool_index_count: 233
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 182
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 125
- index_only_pool_count: 51
- aihot_index_only_count: 19
- aihot_core_count: 17
- aihot_daily_index_only_count: 14
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 233
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS cn-qbitai-rss: fetch failed; source-artifact keyword: keyword-search pre-gate filtered 46 result(s): social_or_profile_source=25; missing_ai_anchor_in_result=7; noise_term:hiring=5; noise_term:affiliate=4; broad_list_or_market_report=3; noise_term:career=1; noise_term:definition=1; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "applied AI engineer enterprise customer case announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch tech fallback for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": Anysearch Search service temporarily unavailable.; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; source-artifact rss: RSS cn-qbitai-rss: fetch failed; targeted-refill pre-gate filtered 1 result(s): social_or_profile_source=1; targeted pool/core refill cycle 1 added 8 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=104; media=24; operators=19; industry_media=18; news=17; developer=15; product=15; builder=13; funding=10; newsletter=7; official=5; industry=2; analysis=1; domestic_vendor=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=84; fetched-readable-text-main=49; fetched-readable-text-body-visible-text=29; fetched-readable-text-article=27; fetched-readable-text-json-ld=23; no-url-summary-only=16; blocked-http-403=12; summary-only-low-readable-body=5; blocked-http-401=4; binary-text-rejected=1; fetched-readable-text-meta-description=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 19
- A: 41
- B: 138
- S: 36
- ungraded: 18

## Evidence Object Type Distribution

- regulatory_or_procurement: 14
- event: 88
- changelog_or_release: 5
- case_or_customer: 104
- supporting_article: 16
- community_feedback: 2
- research_or_report: 7
- pricing_change: 1
- official_index_or_directory: 14
- event_on_official_page: 1

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 27
- 开发者生态信号 (developer-ecosystem-signal): 23
- 成熟信号 (mature-commercial-signal): 27
- 外围探索信号 (outside-core-exploration): 12
- 资本市场信号 (capital-market-signal): 14
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 14
- AI Hardware investment and financing (ai-hardware-investment-signal): 8
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 9
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 12
- china-local-project (china-local-project): 1
- china-listed-disclosure (china-listed-disclosure): 1
- 早期信号 (early-direction-signal): 16
- targeted-pool-gap-refill (targeted-pool-gap-refill): 8
- uncategorized (uncategorized): 74
- china-policy-regulation (china-policy-regulation): 2
- china-startup-funding (china-startup-funding): 4

## Keyword Group Distribution

- technical-iteration-signal: 26
- developer-ecosystem-signal: 25
- mature-commercial-signal: 26
- outside-core-exploration: 12
- capital-market-signal: 14
- enterprise-ai-implementation-signal: 14
- ai-hardware-investment-signal: 8
- ai-hardware-scenario-service-signal: 9
- ai-hardware-trend-innovation-signal: 12
- china-local-project: 1
- china-listed-disclosure: 1
- early-direction-signal: 16
- targeted-pool-gap-refill: 8
- uncategorized: 74
- china-policy-regulation: 2
- china-startup-funding: 4

## Keyword Search Path Distribution

- a_media_gdelt: 3
- fde_production_rollout: 6
- hardware_product_specs: 8
- hardware_shipment_deployment: 11
- hardware_supply_agreement: 3
- hardware_capex: 1
- fde_earnings_disclosure: 3
- procurement_marketplace: 5
- fde_procurement_contract: 6
- hardware_capacity_fab: 4
- official_original: 19
- hardware_oem_odm: 3
- developer_ecosystem: 4
- industry_landing: 7
- capital_startup: 3
- fde_customer_case: 2
- community_feedback: 1

## Keyword Search Intent Distribution

- find_market_trend: 3
- find_customer_case: 23
- find_startups: 20
- find_hardware_supply: 3
- verify_company_action: 2
- find_capacity_capex: 3
- find_original_source: 30
- find_procurement_signal: 4
- find_user_feedback: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
