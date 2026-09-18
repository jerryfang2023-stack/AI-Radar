# 2026-09-18 Guanlan Daily Monitor Log

- generated_at: 2026-09-18T00:26:37.696Z
- raw_count: 256
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
- provider_fallback_notes: Search cross-entry dedupe removed 57 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 48 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 14
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 5
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-18/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-18/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-18/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-18/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-18/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 48
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 568
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 41
- keyword_search_count: 99
- keyword_search_non_community_count: 99
- keyword_search_path_distribution: official_original=20; hardware_shipment_deployment=12; industry_landing=10; hardware_product_specs=8; procurement_marketplace=7; fde_customer_case=6; hardware_capacity_fab=6; a_media_gdelt=5; fde_production_rollout=5; capital_startup=3; developer_ecosystem=3; hardware_capex=3; hardware_supply_agreement=3; china_vertical_agent_funding=2; fde_earnings_disclosure=2; fde_procurement_contract=2; china_ai_hardware_funding=1; hardware_oem_odm=1
- keyword_search_intent_distribution: find_original_source=40; find_customer_case=23; find_startups=15; find_capacity_capex=5; find_market_trend=5; find_procurement_signal=5; find_hardware_supply=3; verify_company_action=3
- source_distribution: keyword-search=99; rss-feed=83; aihot=41; gdelt=33
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 105
- enterprise_ai_transformation_stage_distribution: platform_enablement=51; production_rollout=32; pilot=8; ai_transformation=5; procurement=5; org_build=4
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=99; rss-feed=83; aihot=41; gdelt=33
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=81; mature-commercial-signal=29; developer-ecosystem-signal=21; technical-iteration-signal=20; enterprise-ai-implementation-signal=19; ai-hardware-trend-innovation-signal=17; targeted-pool-gap-refill=14; ai-hardware-scenario-service-signal=11; early-direction-signal=11; capital-market-signal=9; outside-core-exploration=6; ai-hardware-investment-signal=5; china-ai-hardware-funding=4; china-vertical-agent-funding=4; china-local-project=3; china-startup-funding=2
- theme_distribution: uncategorized=81; mature-commercial-signal=30; technical-iteration-signal=21; enterprise-ai-implementation-signal=19; developer-ecosystem-signal=18; ai-hardware-trend-innovation-signal=17; targeted-pool-gap-refill=14; early-direction-signal=12; ai-hardware-scenario-service-signal=11; capital-market-signal=9; outside-core-exploration=6; ai-hardware-investment-signal=5; china-ai-hardware-funding=4; china-vertical-agent-funding=4; china-local-project=3; china-startup-funding=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=97; event=95; supporting_article=14; regulatory_or_procurement=13; research_or_report=11; official_index_or_directory=8; changelog_or_release=6; community_feedback=4; event_on_official_page=3; pricing_change=2; search_result_or_tool_directory=2; repo_readme_or_index=1
- pool_route_distribution: watchlist=124; core_pool=52; discard=40; index_only=37; emerging_pool=31
- pool_index_route_distribution: watchlist=124; core_pool=52; index_only=37; emerging_pool=31
- pool_index_count: 216
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 179
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 127
- index_only_pool_count: 37
- aihot_index_only_count: 8
- aihot_core_count: 13
- aihot_daily_index_only_count: 4
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 216
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 78 result(s): missing_ai_anchor_in_result=30; broad_list_or_market_report=20; social_or_profile_source=20; noise_term:hiring=6; directory_or_search_page=1; noise_term:meme=1; source-artifact keyword: Anysearch business fallback for query "AI implementation startup funding enterprise workflow (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 3 result(s): missing_ai_anchor_in_result=2; social_or_profile_source=1; targeted pool/core refill cycle 1 added 14 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=104; media=28; product=21; news=19; industry_media=16; operators=16; developer=14; official=12; newsletter=9; builder=8; funding=7; industry=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=82; fetched-readable-text-main=48; fetched-readable-text-article=27; fetched-readable-text-body-visible-text=24; blocked-http-403=20; fetched-readable-text-json-ld=18; summary-only-low-readable-body=11; no-url-summary-only=8; blocked-http-401=7; fetch-failed-fallback-visible-text=2; fetched-readable-text-meta-description=2; http-429-fallback-text=2; timeout-fallback-visible-text=2; binary-text-rejected=1; http-521-fallback-text=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 16
- A: 48
- B: 129
- S: 47
- ungraded: 16

## Evidence Object Type Distribution

- event: 95
- case_or_customer: 97
- official_index_or_directory: 8
- changelog_or_release: 6
- research_or_report: 11
- repo_readme_or_index: 1
- regulatory_or_procurement: 13
- supporting_article: 14
- event_on_official_page: 3
- pricing_change: 2
- search_result_or_tool_directory: 2
- community_feedback: 4

## Theme Distribution

- 早期信号 (early-direction-signal): 12
- 成熟信号 (mature-commercial-signal): 30
- 外围探索信号 (outside-core-exploration): 6
- 开发者生态信号 (developer-ecosystem-signal): 18
- 技术迭代信号 (technical-iteration-signal): 21
- 资本市场信号 (capital-market-signal): 9
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 11
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 17
- china-vertical-agent-funding (china-vertical-agent-funding): 4
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 19
- targeted-pool-gap-refill (targeted-pool-gap-refill): 14
- china-ai-hardware-funding (china-ai-hardware-funding): 4
- uncategorized (uncategorized): 81
- china-local-project (china-local-project): 3
- china-startup-funding (china-startup-funding): 2

## Keyword Group Distribution

- early-direction-signal: 11
- mature-commercial-signal: 29
- outside-core-exploration: 6
- developer-ecosystem-signal: 21
- technical-iteration-signal: 20
- capital-market-signal: 9
- ai-hardware-investment-signal: 5
- ai-hardware-scenario-service-signal: 11
- ai-hardware-trend-innovation-signal: 17
- china-vertical-agent-funding: 4
- enterprise-ai-implementation-signal: 19
- targeted-pool-gap-refill: 14
- china-ai-hardware-funding: 4
- uncategorized: 81
- china-local-project: 3
- china-startup-funding: 2

## Keyword Search Path Distribution

- a_media_gdelt: 5
- hardware_product_specs: 8
- hardware_capacity_fab: 6
- hardware_supply_agreement: 3
- china_vertical_agent_funding: 2
- capital_startup: 3
- fde_production_rollout: 5
- hardware_shipment_deployment: 12
- procurement_marketplace: 7
- fde_customer_case: 6
- fde_earnings_disclosure: 2
- official_original: 20
- developer_ecosystem: 3
- industry_landing: 10
- fde_procurement_contract: 2
- hardware_capex: 3
- china_ai_hardware_funding: 1
- hardware_oem_odm: 1

## Keyword Search Intent Distribution

- find_market_trend: 5
- find_startups: 15
- find_capacity_capex: 5
- find_hardware_supply: 3
- find_customer_case: 23
- find_original_source: 40
- find_procurement_signal: 5
- verify_company_action: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
