# 2026-09-22 Guanlan Daily Monitor Log

- generated_at: 2026-09-22T00:28:27.380Z
- raw_count: 240
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 3
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 59 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 68 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 18
- recovered_failed_sources_count: 10
- unrecovered_failed_sources_count: 8
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-22/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-22/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-22/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-22/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-22/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 68
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 516
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 37
- keyword_search_count: 108
- keyword_search_non_community_count: 108
- keyword_search_path_distribution: official_original=20; hardware_shipment_deployment=11; capital_startup=9; fde_customer_case=9; procurement_marketplace=8; hardware_capacity_fab=7; hardware_product_specs=7; hardware_oem_odm=6; industry_landing=6; fde_production_rollout=5; a_media_gdelt=4; developer_ecosystem=4; fde_procurement_contract=4; china_ai_hardware_funding=3; hardware_supply_agreement=3; fde_earnings_disclosure=1; hardware_capex=1
- keyword_search_intent_distribution: find_original_source=40; find_startups=24; find_customer_case=23; find_capacity_capex=7; find_procurement_signal=6; find_market_trend=4; find_hardware_supply=3; verify_company_action=1
- source_distribution: keyword-search=108; rss-feed=95; aihot=37
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 110
- enterprise_ai_transformation_stage_distribution: platform_enablement=52; production_rollout=28; pilot=11; ai_transformation=10; procurement=6; org_build=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=108; rss-feed=95; aihot=37
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=91; developer-ecosystem-signal=22; mature-commercial-signal=22; technical-iteration-signal=19; targeted-pool-gap-refill=18; enterprise-ai-implementation-signal=16; capital-market-signal=12; ai-hardware-scenario-service-signal=10; ai-hardware-trend-innovation-signal=10; ai-hardware-investment-signal=6; early-direction-signal=6; china-ai-hardware-funding=4; outside-core-exploration=3; china-local-project=1
- theme_distribution: uncategorized=91; mature-commercial-signal=22; developer-ecosystem-signal=20; technical-iteration-signal=20; targeted-pool-gap-refill=18; enterprise-ai-implementation-signal=16; capital-market-signal=13; ai-hardware-scenario-service-signal=10; ai-hardware-trend-innovation-signal=10; ai-hardware-investment-signal=6; early-direction-signal=6; china-ai-hardware-funding=4; outside-core-exploration=3; china-local-project=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=90; event=89; regulatory_or_procurement=22; supporting_article=14; official_index_or_directory=8; research_or_report=6; changelog_or_release=5; event_on_official_page=3; community_feedback=1; pricing_change=1; repo_readme_or_index=1
- pool_route_distribution: watchlist=114; core_pool=55; emerging_pool=43; index_only=36; discard=30
- pool_index_route_distribution: watchlist=114; core_pool=55; emerging_pool=43; index_only=36
- pool_index_count: 210
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 174
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 119
- index_only_pool_count: 36
- aihot_index_only_count: 8
- aihot_core_count: 17
- aihot_daily_index_only_count: 3
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5; important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 210
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-09-22): 404 Not Found — {"error":"No daily report for 2026-09-22."}; source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact gdelt: source collection command failed; see gdelt-source-run.log; source-artifact keyword: keyword-search pre-gate filtered 70 result(s): broad_list_or_market_report=23; social_or_profile_source=23; missing_ai_anchor_in_result=18; directory_or_search_page=2; noise_term:career=2; noise_term:avatar=1; noise_term:hiring=1; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=3; social_or_profile_source=2; targeted pool/core refill cycle 1 added 18 item(s) for important_case=2/5; important_funding=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=100; media=22; product=19; industry_media=16; newsletter=15; developer=13; news=13; funding=11; official=11; builder=9; operators=7; industry=2; domestic_vendor=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=71; fetched-readable-text-main=58; fetched-readable-text-article=31; fetched-readable-text-body-visible-text=26; blocked-http-403=22; fetched-readable-text-json-ld=10; no-url-summary-only=8; summary-only-low-readable-body=8; non-text-source-rejected=2; binary-text-rejected=1; fetch-failed-fallback-visible-text=1; http-404-fallback-text=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- S: 43
- A: 36
- C: 7
- B: 138
- ungraded: 16

## Evidence Object Type Distribution

- event: 89
- case_or_customer: 90
- pricing_change: 1
- research_or_report: 6
- repo_readme_or_index: 1
- official_index_or_directory: 8
- regulatory_or_procurement: 22
- changelog_or_release: 5
- supporting_article: 14
- community_feedback: 1
- event_on_official_page: 3

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 20
- 外围探索信号 (outside-core-exploration): 3
- 成熟信号 (mature-commercial-signal): 22
- 早期信号 (early-direction-signal): 6
- 技术迭代信号 (technical-iteration-signal): 20
- 资本市场信号 (capital-market-signal): 13
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 16
- AI Hardware investment and financing (ai-hardware-investment-signal): 6
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 10
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 10
- china-local-project (china-local-project): 1
- china-ai-hardware-funding (china-ai-hardware-funding): 4
- targeted-pool-gap-refill (targeted-pool-gap-refill): 18
- uncategorized (uncategorized): 91

## Keyword Group Distribution

- developer-ecosystem-signal: 22
- outside-core-exploration: 3
- mature-commercial-signal: 22
- early-direction-signal: 6
- technical-iteration-signal: 19
- capital-market-signal: 12
- enterprise-ai-implementation-signal: 16
- ai-hardware-investment-signal: 6
- ai-hardware-scenario-service-signal: 10
- ai-hardware-trend-innovation-signal: 10
- china-local-project: 1
- china-ai-hardware-funding: 4
- targeted-pool-gap-refill: 18
- uncategorized: 91

## Keyword Search Path Distribution

- capital_startup: 9
- fde_customer_case: 9
- hardware_product_specs: 7
- hardware_shipment_deployment: 11
- hardware_supply_agreement: 3
- hardware_capex: 1
- china_ai_hardware_funding: 3
- procurement_marketplace: 8
- fde_earnings_disclosure: 1
- hardware_capacity_fab: 7
- a_media_gdelt: 4
- fde_production_rollout: 5
- developer_ecosystem: 4
- official_original: 20
- industry_landing: 6
- hardware_oem_odm: 6
- fde_procurement_contract: 4

## Keyword Search Intent Distribution

- find_startups: 24
- find_customer_case: 23
- find_hardware_supply: 3
- verify_company_action: 1
- find_original_source: 40
- find_procurement_signal: 6
- find_capacity_capex: 7
- find_market_trend: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
