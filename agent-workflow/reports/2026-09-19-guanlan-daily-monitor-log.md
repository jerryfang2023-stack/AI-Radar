# 2026-09-19 Guanlan Daily Monitor Log

- generated_at: 2026-09-19T00:26:56.217Z
- raw_count: 259
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
- provider_fallback_notes: Search cross-entry dedupe removed 69 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 53 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 15
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 6
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-19/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-19/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-19/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-19/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-19/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 53
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 512
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 40
- keyword_search_count: 103
- keyword_search_non_community_count: 103
- keyword_search_path_distribution: official_original=20; capital_startup=11; procurement_marketplace=10; hardware_product_specs=9; hardware_shipment_deployment=9; fde_customer_case=7; industry_landing=7; developer_ecosystem=5; fde_procurement_contract=4; fde_production_rollout=4; hardware_oem_odm=4; hardware_capex=3; a_media_gdelt=2; fde_earnings_disclosure=2; hardware_capacity_fab=2; hardware_supply_agreement=2; china_ai_hardware_funding=1; china_vertical_agent_funding=1
- keyword_search_intent_distribution: find_original_source=46; find_startups=24; find_customer_case=21; find_procurement_signal=3; verify_company_action=3; find_capacity_capex=2; find_hardware_supply=2; find_market_trend=2
- source_distribution: keyword-search=103; rss-feed=81; aihot=40; gdelt=35
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 104
- enterprise_ai_transformation_stage_distribution: platform_enablement=49; production_rollout=29; pilot=11; ai_transformation=10; procurement=3; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=103; rss-feed=81; aihot=40; gdelt=35
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=78; mature-commercial-signal=28; developer-ecosystem-signal=23; enterprise-ai-implementation-signal=23; targeted-pool-gap-refill=22; technical-iteration-signal=18; ai-hardware-trend-innovation-signal=14; capital-market-signal=12; early-direction-signal=11; ai-hardware-scenario-service-signal=8; outside-core-exploration=6; ai-hardware-investment-signal=5; china-local-project=3; china-startup-funding=3; china-vertical-agent-funding=3; china-ai-hardware-funding=2
- theme_distribution: uncategorized=78; mature-commercial-signal=29; enterprise-ai-implementation-signal=23; targeted-pool-gap-refill=22; developer-ecosystem-signal=20; technical-iteration-signal=19; ai-hardware-trend-innovation-signal=14; capital-market-signal=13; early-direction-signal=11; ai-hardware-scenario-service-signal=8; outside-core-exploration=6; ai-hardware-investment-signal=5; china-local-project=3; china-startup-funding=3; china-vertical-agent-funding=3; china-ai-hardware-funding=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=104; event=96; regulatory_or_procurement=17; supporting_article=14; research_or_report=11; official_index_or_directory=7; changelog_or_release=4; event_on_official_page=3; community_feedback=2; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=127; core_pool=52; index_only=39; emerging_pool=38; discard=35
- pool_index_route_distribution: watchlist=127; core_pool=52; index_only=39; emerging_pool=38
- pool_index_count: 224
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 185
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 133
- index_only_pool_count: 39
- aihot_index_only_count: 6
- aihot_core_count: 19
- aihot_daily_index_only_count: 4
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5; important_funding=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 224
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 79 result(s): broad_list_or_market_report=30; missing_ai_anchor_in_result=23; social_or_profile_source=22; noise_term:hiring=3; noise_term:salary=1; source-artifact keyword: Anysearch business fallback for query "open-source AI agent GitHub enterprise adoption (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch business fallback for query "AI finance operations procurement software announced September 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": Anysearch Search service temporarily unavailable.; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 12 result(s): broad_list_or_market_report=5; social_or_profile_source=5; missing_ai_anchor_in_result=2; targeted pool/core refill cycle 1 added 22 item(s) for important_case=2/5; important_funding=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=113; media=25; industry_media=20; news=19; product=18; developer=15; official=12; operators=10; funding=9; newsletter=8; builder=6; research=3; industry=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=83; fetched-readable-text-main=45; fetched-readable-text-article=34; fetched-readable-text-body-visible-text=31; blocked-http-403=23; fetched-readable-text-json-ld=16; no-url-summary-only=9; summary-only-low-readable-body=8; blocked-http-401=4; fetched-readable-text-meta-description=3; binary-text-rejected=1; http-429-fallback-text=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 45
- S: 42
- B: 142
- C: 10
- ungraded: 20

## Evidence Object Type Distribution

- event: 96
- research_or_report: 11
- regulatory_or_procurement: 17
- case_or_customer: 104
- changelog_or_release: 4
- supporting_article: 14
- event_on_official_page: 3
- community_feedback: 2
- search_result_or_tool_directory: 1
- official_index_or_directory: 7

## Theme Distribution

- 早期信号 (early-direction-signal): 11
- 开发者生态信号 (developer-ecosystem-signal): 20
- 外围探索信号 (outside-core-exploration): 6
- 技术迭代信号 (technical-iteration-signal): 19
- 成熟信号 (mature-commercial-signal): 29
- 资本市场信号 (capital-market-signal): 13
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 23
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 8
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 14
- china-vertical-agent-funding (china-vertical-agent-funding): 3
- china-local-project (china-local-project): 3
- targeted-pool-gap-refill (targeted-pool-gap-refill): 22
- china-ai-hardware-funding (china-ai-hardware-funding): 2
- china-startup-funding (china-startup-funding): 3
- uncategorized (uncategorized): 78

## Keyword Group Distribution

- early-direction-signal: 11
- developer-ecosystem-signal: 23
- outside-core-exploration: 6
- technical-iteration-signal: 18
- mature-commercial-signal: 28
- capital-market-signal: 12
- enterprise-ai-implementation-signal: 23
- ai-hardware-investment-signal: 5
- ai-hardware-scenario-service-signal: 8
- ai-hardware-trend-innovation-signal: 14
- china-vertical-agent-funding: 3
- china-local-project: 3
- targeted-pool-gap-refill: 22
- china-ai-hardware-funding: 2
- china-startup-funding: 3
- uncategorized: 78

## Keyword Search Path Distribution

- fde_procurement_contract: 4
- fde_customer_case: 7
- hardware_product_specs: 9
- hardware_shipment_deployment: 9
- hardware_supply_agreement: 2
- china_vertical_agent_funding: 1
- capital_startup: 11
- fde_earnings_disclosure: 2
- hardware_capacity_fab: 2
- hardware_capex: 3
- procurement_marketplace: 10
- developer_ecosystem: 5
- a_media_gdelt: 2
- official_original: 20
- fde_production_rollout: 4
- hardware_oem_odm: 4
- industry_landing: 7
- china_ai_hardware_funding: 1

## Keyword Search Intent Distribution

- find_startups: 24
- find_customer_case: 21
- find_hardware_supply: 2
- find_capacity_capex: 2
- verify_company_action: 3
- find_original_source: 46
- find_procurement_signal: 3
- find_market_trend: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
