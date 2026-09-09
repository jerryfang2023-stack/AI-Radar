# 2026-09-09 Guanlan Daily Monitor Log

- generated_at: 2026-09-09T00:26:42.749Z
- raw_count: 239
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 4
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 66 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 57 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 18
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 10
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-09/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-09/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-09/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-09/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-09/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 57
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 581
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 36
- keyword_search_count: 85
- keyword_search_non_community_count: 85
- keyword_search_path_distribution: official_original=12; hardware_shipment_deployment=9; procurement_marketplace=7; fde_procurement_contract=6; hardware_product_specs=6; fde_customer_case=5; fde_production_rollout=5; hardware_capacity_fab=5; hardware_oem_odm=5; a_media_gdelt=4; developer_ecosystem=4; fde_earnings_disclosure=4; hardware_capex=3; hardware_supply_agreement=3; capital_startup=2; china_ai_hardware_funding=2; industry_landing=2; china_vertical_agent_funding=1
- keyword_search_intent_distribution: find_original_source=28; find_customer_case=20; find_startups=15; find_procurement_signal=7; find_capacity_capex=5; find_market_trend=4; find_hardware_supply=3; verify_company_action=3
- source_distribution: keyword-search=85; rss-feed=83; aihot=36; gdelt=35
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 91
- enterprise_ai_transformation_stage_distribution: platform_enablement=43; production_rollout=21; pilot=14; org_build=5; procurement=5; ai_transformation=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=85; rss-feed=83; aihot=36; gdelt=35
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=78; mature-commercial-signal=25; technical-iteration-signal=21; enterprise-ai-implementation-signal=19; early-direction-signal=15; developer-ecosystem-signal=14; ai-hardware-scenario-service-signal=11; ai-hardware-trend-innovation-signal=10; capital-market-signal=8; outside-core-exploration=8; china-ai-hardware-funding=7; ai-hardware-investment-signal=6; targeted-pool-gap-refill=6; china-startup-funding=4; china-local-project=3; china-vertical-agent-funding=3; china-policy-regulation=1
- theme_distribution: uncategorized=78; mature-commercial-signal=26; technical-iteration-signal=22; enterprise-ai-implementation-signal=19; early-direction-signal=15; developer-ecosystem-signal=12; ai-hardware-scenario-service-signal=11; ai-hardware-trend-innovation-signal=10; capital-market-signal=8; outside-core-exploration=8; china-ai-hardware-funding=7; ai-hardware-investment-signal=6; targeted-pool-gap-refill=6; china-startup-funding=4; china-local-project=3; china-vertical-agent-funding=3; china-policy-regulation=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=102; event=80; regulatory_or_procurement=15; supporting_article=15; changelog_or_release=7; research_or_report=7; official_index_or_directory=6; community_feedback=3; event_on_official_page=2; pricing_change=1; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=110; core_pool=52; index_only=41; discard=34; emerging_pool=23
- pool_index_route_distribution: watchlist=110; core_pool=52; index_only=41; emerging_pool=23
- pool_index_count: 205
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 164
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 112
- index_only_pool_count: 41
- aihot_index_only_count: 9
- aihot_core_count: 15
- aihot_daily_index_only_count: 4
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 205
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 59 result(s): social_or_profile_source=29; broad_list_or_market_report=19; missing_ai_anchor_in_result=8; noise_term:hiring=2; noise_term:meme=1; source-artifact keyword: Anysearch business fallback for query "AI implementation startup design partner pilot customer (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch business fallback for query "open-source AI agent GitHub enterprise adoption (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch tech fallback for query "open-source AI agent GitHub enterprise adoption (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "open-source AI agent GitHub enterprise adoption (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": business: Anysearch Search service temporarily unavailable.; tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "applied AI deployment customer workflow announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=3; social_or_profile_source=1; targeted pool/core refill cycle 1 added 6 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=98; media=22; industry_media=19; news=18; newsletter=16; developer=14; product=14; official=11; operators=11; builder=9; funding=5; industry=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=72; fetched-readable-text-main=50; fetched-readable-text-article=28; fetched-readable-text-body-visible-text=27; blocked-http-403=19; fetched-readable-text-json-ld=18; blocked-http-401=8; no-url-summary-only=7; summary-only-low-readable-body=7; binary-text-rejected=1; fetch-failed-fallback-visible-text=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 41
- S: 39
- B: 129
- ungraded: 19
- C: 11

## Evidence Object Type Distribution

- event: 80
- changelog_or_release: 7
- regulatory_or_procurement: 15
- case_or_customer: 102
- supporting_article: 15
- community_feedback: 3
- event_on_official_page: 2
- pricing_change: 1
- research_or_report: 7
- search_result_or_tool_directory: 1
- official_index_or_directory: 6

## Theme Distribution

- 早期信号 (early-direction-signal): 15
- 技术迭代信号 (technical-iteration-signal): 22
- 外围探索信号 (outside-core-exploration): 8
- 开发者生态信号 (developer-ecosystem-signal): 12
- 成熟信号 (mature-commercial-signal): 26
- 资本市场信号 (capital-market-signal): 8
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 11
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 10
- china-vertical-agent-funding (china-vertical-agent-funding): 3
- china-local-project (china-local-project): 3
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 19
- AI Hardware investment and financing (ai-hardware-investment-signal): 6
- china-ai-hardware-funding (china-ai-hardware-funding): 7
- targeted-pool-gap-refill (targeted-pool-gap-refill): 6
- china-startup-funding (china-startup-funding): 4
- uncategorized (uncategorized): 78
- china-policy-regulation (china-policy-regulation): 1

## Keyword Group Distribution

- early-direction-signal: 15
- technical-iteration-signal: 21
- outside-core-exploration: 8
- developer-ecosystem-signal: 14
- mature-commercial-signal: 25
- capital-market-signal: 8
- ai-hardware-scenario-service-signal: 11
- ai-hardware-trend-innovation-signal: 10
- china-vertical-agent-funding: 3
- china-local-project: 3
- enterprise-ai-implementation-signal: 19
- ai-hardware-investment-signal: 6
- china-ai-hardware-funding: 7
- targeted-pool-gap-refill: 6
- china-startup-funding: 4
- uncategorized: 78
- china-policy-regulation: 1

## Keyword Search Path Distribution

- a_media_gdelt: 4
- hardware_product_specs: 6
- hardware_supply_agreement: 3
- china_vertical_agent_funding: 1
- hardware_capex: 3
- fde_procurement_contract: 6
- hardware_shipment_deployment: 9
- china_ai_hardware_funding: 2
- capital_startup: 2
- fde_earnings_disclosure: 4
- hardware_capacity_fab: 5
- fde_production_rollout: 5
- procurement_marketplace: 7
- fde_customer_case: 5
- developer_ecosystem: 4
- hardware_oem_odm: 5
- official_original: 12
- industry_landing: 2

## Keyword Search Intent Distribution

- find_market_trend: 4
- find_customer_case: 20
- find_hardware_supply: 3
- find_startups: 15
- verify_company_action: 3
- find_capacity_capex: 5
- find_original_source: 28
- find_procurement_signal: 7

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
