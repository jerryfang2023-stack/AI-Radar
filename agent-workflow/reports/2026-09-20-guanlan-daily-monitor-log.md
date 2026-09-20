# 2026-09-20 Guanlan Daily Monitor Log

- generated_at: 2026-09-20T00:27:36.020Z
- raw_count: 226
- aihot_mode: source-artifacts
- aihot_since: none
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
- provider_fallback_notes: Search cross-entry dedupe removed 50 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 69 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 15
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 6
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-20/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-20/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-20/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-20/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-20/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 69
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 394
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 36
- keyword_search_count: 96
- keyword_search_non_community_count: 96
- keyword_search_path_distribution: hardware_shipment_deployment=10; capital_startup=9; industry_landing=9; procurement_marketplace=9; official_original=8; developer_ecosystem=7; a_media_gdelt=6; fde_customer_case=6; hardware_product_specs=6; fde_earnings_disclosure=5; fde_production_rollout=5; hardware_oem_odm=5; hardware_capacity_fab=4; fde_procurement_contract=3; china_ai_hardware_funding=2; china_vertical_agent_funding=1; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_startups=32; find_original_source=29; find_customer_case=19; find_market_trend=6; find_capacity_capex=4; find_procurement_signal=4; find_hardware_supply=1; verify_company_action=1
- source_distribution: keyword-search=96; rss-feed=94; aihot=36
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 96
- enterprise_ai_transformation_stage_distribution: platform_enablement=43; production_rollout=25; pilot=16; ai_transformation=5; org_build=4; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=96; rss-feed=94; aihot=36
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=91; mature-commercial-signal=23; developer-ecosystem-signal=19; enterprise-ai-implementation-signal=18; technical-iteration-signal=13; capital-market-signal=12; early-direction-signal=11; outside-core-exploration=9; ai-hardware-scenario-service-signal=8; ai-hardware-trend-innovation-signal=8; targeted-pool-gap-refill=5; ai-hardware-investment-signal=4; china-ai-hardware-funding=3; china-listed-disclosure=1; china-vertical-agent-funding=1
- theme_distribution: uncategorized=91; mature-commercial-signal=23; enterprise-ai-implementation-signal=18; developer-ecosystem-signal=16; technical-iteration-signal=14; early-direction-signal=13; capital-market-signal=12; outside-core-exploration=9; ai-hardware-scenario-service-signal=8; ai-hardware-trend-innovation-signal=8; targeted-pool-gap-refill=5; ai-hardware-investment-signal=4; china-ai-hardware-funding=3; china-listed-disclosure=1; china-vertical-agent-funding=1
- theme_concentration_warning: warning: uncategorized concentration 40.3% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- evidence_object_type_distribution: event=84; case_or_customer=80; regulatory_or_procurement=16; supporting_article=14; changelog_or_release=10; research_or_report=10; official_index_or_directory=7; community_feedback=3; event_on_official_page=2
- pool_route_distribution: watchlist=97; core_pool=60; emerging_pool=51; index_only=39; discard=25
- pool_index_route_distribution: watchlist=97; core_pool=60; emerging_pool=51; index_only=39
- pool_index_count: 201
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 162
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 102
- index_only_pool_count: 39
- aihot_index_only_count: 4
- aihot_core_count: 20
- aihot_daily_index_only_count: 2
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 201
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact gdelt: source collection command failed; see gdelt-source-run.log; source-artifact keyword: keyword-search pre-gate filtered 74 result(s): missing_ai_anchor_in_result=26; broad_list_or_market_report=19; social_or_profile_source=19; noise_term:hiring=5; directory_or_search_page=2; noise_term:meme=2; noise_term:dictionary=1; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; targeted-refill pre-gate filtered 2 result(s): directory_or_search_page=2; targeted pool/core refill cycle 1 added 5 item(s) for important_funding=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=88; media=25; industry_media=24; developer=15; newsletter=14; product=14; funding=10; news=9; builder=8; industry=6; operators=6; official=4; research=2; listed_company_disclosure=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=66; fetched-readable-text-main=50; fetched-readable-text-article=39; fetched-readable-text-body-visible-text=22; blocked-http-403=17; fetched-readable-text-json-ld=16; no-url-summary-only=7; summary-only-low-readable-body=5; binary-text-rejected=1; blocked-http-401=1; http-404-fallback-text=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 6
- B: 130
- ungraded: 25
- S: 31
- A: 34

## Evidence Object Type Distribution

- case_or_customer: 80
- event_on_official_page: 2
- event: 84
- regulatory_or_procurement: 16
- supporting_article: 14
- changelog_or_release: 10
- community_feedback: 3
- research_or_report: 10
- official_index_or_directory: 7

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 16
- 技术迭代信号 (technical-iteration-signal): 14
- 资本市场信号 (capital-market-signal): 12
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 18
- AI Hardware investment and financing (ai-hardware-investment-signal): 4
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 8
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 8
- china-ai-hardware-funding (china-ai-hardware-funding): 3
- china-vertical-agent-funding (china-vertical-agent-funding): 1
- 成熟信号 (mature-commercial-signal): 23
- 外围探索信号 (outside-core-exploration): 9
- 早期信号 (early-direction-signal): 13
- targeted-pool-gap-refill (targeted-pool-gap-refill): 5
- uncategorized (uncategorized): 91
- china-listed-disclosure (china-listed-disclosure): 1

## Keyword Group Distribution

- developer-ecosystem-signal: 19
- technical-iteration-signal: 13
- capital-market-signal: 12
- enterprise-ai-implementation-signal: 18
- ai-hardware-investment-signal: 4
- ai-hardware-scenario-service-signal: 8
- ai-hardware-trend-innovation-signal: 8
- china-ai-hardware-funding: 3
- china-vertical-agent-funding: 1
- mature-commercial-signal: 23
- outside-core-exploration: 9
- early-direction-signal: 11
- targeted-pool-gap-refill: 5
- uncategorized: 91
- china-listed-disclosure: 1

## Keyword Search Path Distribution

- capital_startup: 9
- fde_procurement_contract: 3
- hardware_product_specs: 6
- hardware_shipment_deployment: 10
- hardware_supply_agreement: 1
- china_ai_hardware_funding: 2
- china_vertical_agent_funding: 1
- fde_earnings_disclosure: 5
- hardware_capacity_fab: 4
- official_original: 8
- fde_customer_case: 6
- industry_landing: 9
- hardware_oem_odm: 5
- procurement_marketplace: 9
- fde_production_rollout: 5
- a_media_gdelt: 6
- developer_ecosystem: 7

## Keyword Search Intent Distribution

- find_startups: 32
- find_customer_case: 19
- find_hardware_supply: 1
- find_capacity_capex: 4
- find_original_source: 29
- find_procurement_signal: 4
- find_market_trend: 6
- verify_company_action: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
