# 2026-09-23 Guanlan Daily Monitor Log

- generated_at: 2026-09-23T00:25:36.098Z
- raw_count: 248
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 10
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 73 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 50 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 15
- recovered_failed_sources_count: 10
- unrecovered_failed_sources_count: 5
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-23/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-23/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-23/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-23/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-23/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 50
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 586
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 39
- keyword_search_count: 85
- keyword_search_non_community_count: 85
- keyword_search_path_distribution: official_original=10; hardware_shipment_deployment=9; capital_startup=7; fde_customer_case=7; hardware_oem_odm=6; a_media_gdelt=5; fde_procurement_contract=5; fde_production_rollout=5; hardware_capacity_fab=5; hardware_product_specs=5; industry_landing=5; procurement_marketplace=5; fde_earnings_disclosure=3; china_vertical_agent_funding=2; developer_ecosystem=2; hardware_supply_agreement=2; china_ai_hardware_funding=1; hardware_capex=1
- keyword_search_intent_distribution: find_original_source=32; find_customer_case=20; find_startups=19; find_market_trend=5; find_capacity_capex=3; find_hardware_supply=2; find_procurement_signal=2; verify_company_action=2
- source_distribution: keyword-search=85; rss-feed=82; gdelt=42; aihot=39
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 99
- enterprise_ai_transformation_stage_distribution: platform_enablement=54; production_rollout=22; pilot=13; ai_transformation=4; org_build=3; procurement=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=85; rss-feed=82; gdelt=42; aihot=39
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=77; technical-iteration-signal=34; mature-commercial-signal=25; enterprise-ai-implementation-signal=21; ai-hardware-trend-innovation-signal=15; developer-ecosystem-signal=11; early-direction-signal=11; capital-market-signal=10; ai-hardware-scenario-service-signal=9; targeted-pool-gap-refill=8; outside-core-exploration=7; china-vertical-agent-funding=6; ai-hardware-investment-signal=5; china-startup-funding=4; china-ai-hardware-funding=2; china-listed-disclosure=1; china-local-project=1; china-policy-regulation=1
- theme_distribution: uncategorized=77; technical-iteration-signal=34; mature-commercial-signal=25; enterprise-ai-implementation-signal=21; ai-hardware-trend-innovation-signal=15; developer-ecosystem-signal=11; early-direction-signal=11; capital-market-signal=10; ai-hardware-scenario-service-signal=9; targeted-pool-gap-refill=8; outside-core-exploration=7; china-vertical-agent-funding=6; ai-hardware-investment-signal=5; china-startup-funding=4; china-ai-hardware-funding=2; china-listed-disclosure=1; china-local-project=1; china-policy-regulation=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=91; case_or_customer=82; supporting_article=21; regulatory_or_procurement=14; official_index_or_directory=9; changelog_or_release=7; research_or_report=7; event_on_official_page=6; pricing_change=6; search_result_or_tool_directory=3; community_feedback=2
- pool_route_distribution: watchlist=111; index_only=46; core_pool=45; discard=40; emerging_pool=32
- pool_index_route_distribution: watchlist=111; index_only=46; core_pool=45; emerging_pool=32
- pool_index_count: 208
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 162
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 117
- index_only_pool_count: 46
- aihot_index_only_count: 17
- aihot_core_count: 8
- aihot_daily_index_only_count: 10
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 208
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact funding: RSS cn-qbitai-rss: fetch failed; source-artifact keyword: keyword-search pre-gate filtered 74 result(s): missing_ai_anchor_in_result=29; broad_list_or_market_report=26; social_or_profile_source=15; directory_or_search_page=2; noise_term:career=1; noise_term:hiring=1; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 13 result(s): missing_ai_anchor_in_result=7; social_or_profile_source=5; noise_term:hiring=1; targeted pool/core refill cycle 1 added 8 item(s) for important_case=4/5; important_funding=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=113; media=26; news=16; industry_media=15; product=15; operators=12; builder=11; official=11; developer=9; funding=9; newsletter=8; industry=2; listed_company_disclosure=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=76; fetched-readable-text-main=52; fetched-readable-text-article=31; blocked-http-403=27; fetched-readable-text-body-visible-text=18; no-url-summary-only=14; fetched-readable-text-json-ld=12; summary-only-low-readable-body=8; blocked-http-401=6; fetched-readable-text-meta-description=2; binary-text-rejected=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 42
- B: 138
- S: 40
- ungraded: 16
- C: 12

## Evidence Object Type Distribution

- event: 91
- research_or_report: 7
- community_feedback: 2
- pricing_change: 6
- regulatory_or_procurement: 14
- supporting_article: 21
- changelog_or_release: 7
- case_or_customer: 82
- event_on_official_page: 6
- search_result_or_tool_directory: 3
- official_index_or_directory: 9

## Theme Distribution

- 早期信号 (early-direction-signal): 11
- 外围探索信号 (outside-core-exploration): 7
- 成熟信号 (mature-commercial-signal): 25
- 开发者生态信号 (developer-ecosystem-signal): 11
- 技术迭代信号 (technical-iteration-signal): 34
- 资本市场信号 (capital-market-signal): 10
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 9
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 15
- china-local-project (china-local-project): 1
- china-vertical-agent-funding (china-vertical-agent-funding): 6
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 21
- targeted-pool-gap-refill (targeted-pool-gap-refill): 8
- uncategorized (uncategorized): 77
- china-listed-disclosure (china-listed-disclosure): 1
- china-ai-hardware-funding (china-ai-hardware-funding): 2
- china-policy-regulation (china-policy-regulation): 1
- china-startup-funding (china-startup-funding): 4

## Keyword Group Distribution

- early-direction-signal: 11
- outside-core-exploration: 7
- mature-commercial-signal: 25
- developer-ecosystem-signal: 11
- technical-iteration-signal: 34
- capital-market-signal: 10
- ai-hardware-investment-signal: 5
- ai-hardware-scenario-service-signal: 9
- ai-hardware-trend-innovation-signal: 15
- china-local-project: 1
- china-vertical-agent-funding: 6
- enterprise-ai-implementation-signal: 21
- targeted-pool-gap-refill: 8
- uncategorized: 77
- china-listed-disclosure: 1
- china-ai-hardware-funding: 2
- china-policy-regulation: 1
- china-startup-funding: 4

## Keyword Search Path Distribution

- a_media_gdelt: 5
- hardware_product_specs: 5
- hardware_shipment_deployment: 9
- hardware_supply_agreement: 2
- hardware_capex: 1
- china_vertical_agent_funding: 2
- procurement_marketplace: 5
- fde_procurement_contract: 5
- capital_startup: 7
- fde_earnings_disclosure: 3
- hardware_capacity_fab: 5
- fde_production_rollout: 5
- fde_customer_case: 7
- official_original: 10
- hardware_oem_odm: 6
- industry_landing: 5
- developer_ecosystem: 2
- china_ai_hardware_funding: 1

## Keyword Search Intent Distribution

- find_market_trend: 5
- find_startups: 19
- find_customer_case: 20
- find_hardware_supply: 2
- verify_company_action: 2
- find_original_source: 32
- find_capacity_capex: 3
- find_procurement_signal: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
