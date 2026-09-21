# 2026-09-21 Guanlan Daily Monitor Log

- generated_at: 2026-09-21T00:27:12.896Z
- raw_count: 269
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
- provider_fallback_notes: Search cross-entry dedupe removed 57 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 53 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 15
- recovered_failed_sources_count: 10
- unrecovered_failed_sources_count: 5
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-21/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-21/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-21/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-21/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-21/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 53
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 416
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 33
- keyword_search_count: 114
- keyword_search_non_community_count: 114
- keyword_search_path_distribution: capital_startup=25; official_original=17; hardware_shipment_deployment=10; hardware_capacity_fab=7; hardware_oem_odm=7; procurement_marketplace=6; a_media_gdelt=5; fde_production_rollout=5; hardware_product_specs=5; developer_ecosystem=4; fde_customer_case=4; fde_earnings_disclosure=4; fde_procurement_contract=4; industry_landing=4; hardware_capex=3; hardware_supply_agreement=2; china_ai_hardware_funding=1; china_vertical_agent_funding=1
- keyword_search_intent_distribution: find_startups=43; find_original_source=29; find_customer_case=22; find_capacity_capex=5; find_market_trend=5; find_procurement_signal=4; verify_company_action=4; find_hardware_supply=2
- source_distribution: keyword-search=114; rss-feed=83; gdelt=39; aihot=33
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 106
- enterprise_ai_transformation_stage_distribution: platform_enablement=48; production_rollout=25; ai_transformation=16; pilot=9; org_build=5; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=114; rss-feed=83; gdelt=39; aihot=33
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=79; targeted-pool-gap-refill=32; developer-ecosystem-signal=26; technical-iteration-signal=24; mature-commercial-signal=19; capital-market-signal=15; enterprise-ai-implementation-signal=15; ai-hardware-scenario-service-signal=13; ai-hardware-trend-innovation-signal=10; early-direction-signal=8; ai-hardware-investment-signal=6; outside-core-exploration=6; china-vertical-agent-funding=5; china-ai-hardware-funding=4; china-local-project=3; china-startup-funding=3; china-listed-disclosure=1
- theme_distribution: uncategorized=79; targeted-pool-gap-refill=32; technical-iteration-signal=25; developer-ecosystem-signal=23; mature-commercial-signal=20; capital-market-signal=16; enterprise-ai-implementation-signal=15; ai-hardware-scenario-service-signal=13; ai-hardware-trend-innovation-signal=10; early-direction-signal=8; ai-hardware-investment-signal=6; outside-core-exploration=6; china-vertical-agent-funding=5; china-ai-hardware-funding=4; china-local-project=3; china-startup-funding=3; china-listed-disclosure=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=97; event=93; regulatory_or_procurement=20; supporting_article=18; official_index_or_directory=11; research_or_report=10; community_feedback=6; event_on_official_page=6; changelog_or_release=5; search_result_or_tool_directory=2; repo_readme_or_index=1
- pool_route_distribution: watchlist=123; core_pool=54; index_only=49; emerging_pool=46; discard=39
- pool_index_route_distribution: watchlist=123; core_pool=54; index_only=49; emerging_pool=46
- pool_index_count: 230
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 181
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 127
- index_only_pool_count: 49
- aihot_index_only_count: 11
- aihot_core_count: 11
- aihot_daily_index_only_count: 4
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5; important_funding=1/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 230
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 74 result(s): social_or_profile_source=27; missing_ai_anchor_in_result=21; broad_list_or_market_report=18; directory_or_search_page=4; noise_term:career=2; noise_term:hiring=2; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 24 result(s): missing_ai_anchor_in_result=13; social_or_profile_source=9; broad_list_or_market_report=2; targeted pool/core refill cycle 1 added 32 item(s) for important_case=2/5; important_funding=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=112; media=23; news=23; industry_media=22; operators=14; developer=13; official=13; product=12; funding=11; newsletter=9; builder=8; industry=5; community=1; company_official=1; domestic_vendor=1; listed_company_disclosure=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=74; fetched-readable-text-main=56; fetched-readable-text-article=34; fetched-readable-text-body-visible-text=29; fetched-readable-text-json-ld=18; summary-only-low-readable-body=18; blocked-http-403=15; blocked-http-401=9; no-url-summary-only=8; fetched-readable-text-meta-description=4; binary-text-rejected=2; fetch-failed-fallback-visible-text=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 148
- S: 36
- C: 15
- A: 46
- ungraded: 24

## Evidence Object Type Distribution

- official_index_or_directory: 11
- event: 93
- case_or_customer: 97
- regulatory_or_procurement: 20
- changelog_or_release: 5
- repo_readme_or_index: 1
- event_on_official_page: 6
- community_feedback: 6
- supporting_article: 18
- research_or_report: 10
- search_result_or_tool_directory: 2

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 25
- 开发者生态信号 (developer-ecosystem-signal): 23
- 资本市场信号 (capital-market-signal): 16
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 15
- AI Hardware investment and financing (ai-hardware-investment-signal): 6
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 13
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 10
- 外围探索信号 (outside-core-exploration): 6
- china-vertical-agent-funding (china-vertical-agent-funding): 5
- china-local-project (china-local-project): 3
- 早期信号 (early-direction-signal): 8
- china-ai-hardware-funding (china-ai-hardware-funding): 4
- 成熟信号 (mature-commercial-signal): 20
- targeted-pool-gap-refill (targeted-pool-gap-refill): 32
- uncategorized (uncategorized): 79
- china-listed-disclosure (china-listed-disclosure): 1
- china-startup-funding (china-startup-funding): 3

## Keyword Group Distribution

- technical-iteration-signal: 24
- developer-ecosystem-signal: 26
- capital-market-signal: 15
- enterprise-ai-implementation-signal: 15
- ai-hardware-investment-signal: 6
- ai-hardware-scenario-service-signal: 13
- ai-hardware-trend-innovation-signal: 10
- outside-core-exploration: 6
- china-vertical-agent-funding: 5
- china-local-project: 3
- early-direction-signal: 8
- china-ai-hardware-funding: 4
- mature-commercial-signal: 19
- targeted-pool-gap-refill: 32
- uncategorized: 79
- china-listed-disclosure: 1
- china-startup-funding: 3

## Keyword Search Path Distribution

- capital_startup: 25
- fde_production_rollout: 5
- hardware_product_specs: 5
- hardware_shipment_deployment: 10
- hardware_supply_agreement: 2
- fde_earnings_disclosure: 4
- china_vertical_agent_funding: 1
- hardware_capex: 3
- hardware_oem_odm: 7
- hardware_capacity_fab: 7
- official_original: 17
- procurement_marketplace: 6
- a_media_gdelt: 5
- fde_customer_case: 4
- developer_ecosystem: 4
- industry_landing: 4
- fde_procurement_contract: 4
- china_ai_hardware_funding: 1

## Keyword Search Intent Distribution

- find_startups: 43
- find_customer_case: 22
- find_hardware_supply: 2
- find_procurement_signal: 4
- verify_company_action: 4
- find_original_source: 29
- find_market_trend: 5
- find_capacity_capex: 5

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
