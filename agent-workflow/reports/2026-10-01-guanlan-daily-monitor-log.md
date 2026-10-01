# 2026-10-01 Guanlan Daily Monitor Log

- generated_at: 2026-10-01T09:26:18.945Z
- raw_count: 238
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 12
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 61 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 59 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 13
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 4
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-10-01/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-10-01/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-10-01/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-10-01/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-10-01/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 59
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 602
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 38
- keyword_search_count: 84
- keyword_search_non_community_count: 84
- keyword_search_path_distribution: official_original=10; consumer_ai_hardware_funding=8; capital_startup=7; developer_ecosystem=6; hardware_oem_odm=6; hardware_product_specs=6; hardware_shipment_deployment=6; procurement_marketplace=6; fde_customer_case=5; a_media_gdelt=4; fde_procurement_contract=4; fde_earnings_disclosure=3; hardware_capacity_fab=3; industry_landing=3; china_ai_hardware_funding=2; fde_production_rollout=2; hardware_capex=2; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_startups=34; find_original_source=24; find_customer_case=14; find_market_trend=4; verify_company_action=3; find_capacity_capex=2; find_procurement_signal=2; find_hardware_supply=1
- source_distribution: rss-feed=85; keyword-search=84; aihot=38; gdelt=31
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 91
- enterprise_ai_transformation_stage_distribution: platform_enablement=47; production_rollout=16; pilot=14; ai_transformation=8; org_build=5; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: rss-feed=85; keyword-search=84; aihot=38; gdelt=31
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=81; technical-iteration-signal=24; mature-commercial-signal=21; enterprise-ai-implementation-signal=16; developer-ecosystem-signal=15; capital-market-signal=13; early-direction-signal=13; outside-core-exploration=9; important_funding=8; ai-hardware-scenario-service-signal=7; targeted-pool-gap-refill=7; ai-hardware-trend-innovation-signal=6; china-ai-hardware-funding=4; china-startup-funding=4; china-vertical-agent-funding=4; ai-hardware-investment-signal=2; china-local-project=2; china-listed-disclosure=1; china-policy-regulation=1
- theme_distribution: uncategorized=81; technical-iteration-signal=26; mature-commercial-signal=21; enterprise-ai-implementation-signal=16; early-direction-signal=15; capital-market-signal=13; developer-ecosystem-signal=11; outside-core-exploration=9; ai-hardware-scenario-service-signal=7; targeted-pool-gap-refill=7; ai-hardware-trend-innovation-signal=6; china-ai-hardware-funding=4; china-startup-funding=4; china-vertical-agent-funding=4; ai-hardware-investment-signal=2; china-local-project=2; consumer-hardware-ai-pendants=2; consumer-hardware-ai-phones=2; china-listed-disclosure=1; china-policy-regulation=1; consumer-hardware-ai-audio-wearables=1; consumer-hardware-ai-glasses=1; consumer-hardware-ai-home-devices=1; consumer-hardware-ai-toys=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=101; case_or_customer=73; supporting_article=17; official_index_or_directory=14; regulatory_or_procurement=12; research_or_report=8; changelog_or_release=7; pricing_change=3; event_on_official_page=2; repo_readme_or_index=1
- pool_route_distribution: watchlist=116; index_only=50; core_pool=41; emerging_pool=39; discard=25
- pool_index_route_distribution: watchlist=116; index_only=50; core_pool=41; emerging_pool=39
- pool_index_count: 213
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 163
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 122
- index_only_pool_count: 50
- aihot_index_only_count: 17
- aihot_core_count: 14
- aihot_daily_index_only_count: 12
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 213
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 43 result(s): social_or_profile_source=16; missing_ai_anchor_in_result=13; broad_list_or_market_report=11; directory_or_search_page=1; noise_term:career=1; noise_term:hiring=1; source-artifact rss: RSS venturebeat-ai: HTTP 429; targeted-refill pre-gate filtered 3 result(s): broad_list_or_market_report=2; social_or_profile_source=1; targeted pool/core refill cycle 1 added 7 item(s) for important_case=4/5; important_funding=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=84; media=25; news=20; newsletter=16; industry_media=15; operators=15; developer=13; product=13; builder=11; funding=9; official=9; industry=3; research=2; company_official=1; listed_company_disclosure=1; marketplace=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=78; fetched-readable-text-main=39; fetched-readable-text-article=31; fetched-readable-text-body-visible-text=22; fetched-readable-text-json-ld=18; no-url-summary-only=15; blocked-http-403=14; summary-only-low-readable-body=8; blocked-http-401=5; fetched-readable-text-meta-description=4; binary-text-rejected=1; http-404-fallback-text=1; non-text-source-rejected=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 47
- B: 125
- S: 34
- ungraded: 17
- C: 15

## Evidence Object Type Distribution

- event: 101
- regulatory_or_procurement: 12
- repo_readme_or_index: 1
- changelog_or_release: 7
- case_or_customer: 73
- research_or_report: 8
- supporting_article: 17
- pricing_change: 3
- event_on_official_page: 2
- official_index_or_directory: 14

## Theme Distribution

- 早期信号 (early-direction-signal): 15
- 开发者生态信号 (developer-ecosystem-signal): 11
- 外围探索信号 (outside-core-exploration): 9
- 技术迭代信号 (technical-iteration-signal): 26
- 成熟信号 (mature-commercial-signal): 21
- 资本市场信号 (capital-market-signal): 13
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 16
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 7
- consumer-hardware-ai-glasses (consumer-hardware-ai-glasses): 1
- china-local-project (china-local-project): 2
- consumer-hardware-ai-phones (consumer-hardware-ai-phones): 2
- consumer-hardware-ai-audio-wearables (consumer-hardware-ai-audio-wearables): 1
- consumer-hardware-ai-home-devices (consumer-hardware-ai-home-devices): 1
- china-ai-hardware-funding (china-ai-hardware-funding): 4
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 6
- targeted-pool-gap-refill (targeted-pool-gap-refill): 7
- china-vertical-agent-funding (china-vertical-agent-funding): 4
- uncategorized (uncategorized): 81
- consumer-hardware-ai-toys (consumer-hardware-ai-toys): 1
- china-startup-funding (china-startup-funding): 4
- consumer-hardware-ai-pendants (consumer-hardware-ai-pendants): 2
- china-listed-disclosure (china-listed-disclosure): 1
- china-policy-regulation (china-policy-regulation): 1

## Keyword Group Distribution

- early-direction-signal: 13
- developer-ecosystem-signal: 15
- outside-core-exploration: 9
- technical-iteration-signal: 24
- mature-commercial-signal: 21
- capital-market-signal: 13
- enterprise-ai-implementation-signal: 16
- ai-hardware-investment-signal: 2
- ai-hardware-scenario-service-signal: 7
- important_funding: 8
- china-local-project: 2
- china-ai-hardware-funding: 4
- ai-hardware-trend-innovation-signal: 6
- targeted-pool-gap-refill: 7
- china-vertical-agent-funding: 4
- uncategorized: 81
- china-startup-funding: 4
- china-listed-disclosure: 1
- china-policy-regulation: 1

## Keyword Search Path Distribution

- capital_startup: 7
- fde_customer_case: 5
- hardware_product_specs: 6
- hardware_capacity_fab: 3
- consumer_ai_hardware_funding: 8
- hardware_capex: 2
- a_media_gdelt: 4
- fde_procurement_contract: 4
- hardware_shipment_deployment: 6
- china_ai_hardware_funding: 2
- hardware_oem_odm: 6
- procurement_marketplace: 6
- official_original: 10
- fde_production_rollout: 2
- fde_earnings_disclosure: 3
- developer_ecosystem: 6
- hardware_supply_agreement: 1
- industry_landing: 3

## Keyword Search Intent Distribution

- find_startups: 34
- find_customer_case: 14
- find_capacity_capex: 2
- verify_company_action: 3
- find_market_trend: 4
- find_original_source: 24
- find_procurement_signal: 2
- find_hardware_supply: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
