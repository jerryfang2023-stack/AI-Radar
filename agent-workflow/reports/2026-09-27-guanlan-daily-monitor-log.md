# 2026-09-27 Guanlan Daily Monitor Log

- generated_at: 2026-09-27T00:27:42.653Z
- raw_count: 250
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
- provider_fallback_notes: Search cross-entry dedupe removed 42 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 53 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 15
- recovered_failed_sources_count: 11
- unrecovered_failed_sources_count: 4
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-27/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-27/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-27/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-27/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-27/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 53
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 345
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 39
- keyword_search_count: 92
- keyword_search_non_community_count: 90
- keyword_search_path_distribution: official_original=15; capital_startup=10; consumer_ai_hardware_funding=7; developer_ecosystem=7; hardware_shipment_deployment=7; procurement_marketplace=7; a_media_gdelt=5; fde_procurement_contract=5; hardware_product_specs=5; industry_landing=5; fde_production_rollout=3; hardware_capacity_fab=3; hardware_oem_odm=3; community_feedback=2; fde_customer_case=2; fde_earnings_disclosure=2; hardware_capex=2; china_ai_hardware_funding=1; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_startups=33; find_original_source=26; find_customer_case=17; find_market_trend=5; find_procurement_signal=4; find_capacity_capex=2; find_user_feedback=2; verify_company_action=2; find_hardware_supply=1
- source_distribution: keyword-search=92; rss-feed=84; aihot=39; gdelt=35
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 93
- enterprise_ai_transformation_stage_distribution: platform_enablement=52; production_rollout=14; pilot=11; ai_transformation=9; procurement=4; org_build=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=92; rss-feed=84; aihot=39; gdelt=35
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=79; developer-ecosystem-signal=28; mature-commercial-signal=24; technical-iteration-signal=21; capital-market-signal=15; enterprise-ai-implementation-signal=14; targeted-pool-gap-refill=13; early-direction-signal=10; ai-hardware-scenario-service-signal=7; ai-hardware-trend-innovation-signal=7; important_funding=7; china-ai-hardware-funding=6; outside-core-exploration=6; china-startup-funding=4; china-vertical-agent-funding=4; ai-hardware-investment-signal=2; china-local-project=2; china-policy-regulation=1
- theme_distribution: uncategorized=79; mature-commercial-signal=25; developer-ecosystem-signal=23; technical-iteration-signal=23; capital-market-signal=17; enterprise-ai-implementation-signal=14; targeted-pool-gap-refill=13; early-direction-signal=10; ai-hardware-scenario-service-signal=7; ai-hardware-trend-innovation-signal=7; china-ai-hardware-funding=6; outside-core-exploration=6; china-startup-funding=4; china-vertical-agent-funding=4; ai-hardware-investment-signal=2; china-local-project=2; consumer-hardware-ai-glasses=2; consumer-hardware-ai-toys=2; china-policy-regulation=1; consumer-hardware-ai-audio-wearables=1; consumer-hardware-ai-home-devices=1; consumer-hardware-ai-phones=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=105; case_or_customer=80; supporting_article=17; research_or_report=11; regulatory_or_procurement=10; official_index_or_directory=8; changelog_or_release=5; event_on_official_page=4; pricing_change=4; community_feedback=3; repo_readme_or_index=3
- pool_route_distribution: watchlist=117; index_only=56; core_pool=45; emerging_pool=44; discard=21
- pool_index_route_distribution: watchlist=117; index_only=56; core_pool=45; emerging_pool=44
- pool_index_count: 229
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 173
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 128
- index_only_pool_count: 56
- aihot_index_only_count: 12
- aihot_core_count: 13
- aihot_daily_index_only_count: 4
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5; important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 229
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 55 result(s): missing_ai_anchor_in_result=32; social_or_profile_source=13; broad_list_or_market_report=8; noise_term:career=1; noise_term:dictionary=1; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 10 result(s): missing_ai_anchor_in_result=4; broad_list_or_market_report=2; social_or_profile_source=2; directory_or_search_page=1; noise_term:dictionary=1; targeted pool/core refill cycle 1 added 13 item(s) for important_case=2/5; important_funding=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=95; industry_media=26; media=21; developer=18; operators=18; news=15; product=14; funding=11; builder=9; newsletter=9; official=8; industry=3; research=2; company_official=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=74; fetched-readable-text-main=56; fetched-readable-text-article=40; fetched-readable-text-body-visible-text=26; blocked-http-403=12; fetched-readable-text-json-ld=12; summary-only-low-readable-body=10; no-url-summary-only=7; fetched-readable-text-meta-description=6; blocked-http-401=3; binary-text-rejected=2; fetch-failed-fallback-visible-text=1; non-text-source-rejected=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 135
- ungraded: 27
- S: 33
- A: 37
- C: 18

## Evidence Object Type Distribution

- case_or_customer: 80
- event: 105
- official_index_or_directory: 8
- regulatory_or_procurement: 10
- pricing_change: 4
- changelog_or_release: 5
- supporting_article: 17
- repo_readme_or_index: 3
- community_feedback: 3
- research_or_report: 11
- event_on_official_page: 4

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 25
- 开发者生态信号 (developer-ecosystem-signal): 23
- 技术迭代信号 (technical-iteration-signal): 23
- 资本市场信号 (capital-market-signal): 17
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 14
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 7
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 7
- china-ai-hardware-funding (china-ai-hardware-funding): 6
- consumer-hardware-ai-glasses (consumer-hardware-ai-glasses): 2
- consumer-hardware-ai-home-devices (consumer-hardware-ai-home-devices): 1
- 外围探索信号 (outside-core-exploration): 6
- china-local-project (china-local-project): 2
- targeted-pool-gap-refill (targeted-pool-gap-refill): 13
- uncategorized (uncategorized): 79
- consumer-hardware-ai-phones (consumer-hardware-ai-phones): 1
- consumer-hardware-ai-audio-wearables (consumer-hardware-ai-audio-wearables): 1
- 早期信号 (early-direction-signal): 10
- china-vertical-agent-funding (china-vertical-agent-funding): 4
- china-startup-funding (china-startup-funding): 4
- consumer-hardware-ai-toys (consumer-hardware-ai-toys): 2
- china-policy-regulation (china-policy-regulation): 1

## Keyword Group Distribution

- mature-commercial-signal: 24
- developer-ecosystem-signal: 28
- technical-iteration-signal: 21
- capital-market-signal: 15
- enterprise-ai-implementation-signal: 14
- ai-hardware-investment-signal: 2
- ai-hardware-scenario-service-signal: 7
- ai-hardware-trend-innovation-signal: 7
- china-ai-hardware-funding: 6
- important_funding: 7
- outside-core-exploration: 6
- china-local-project: 2
- targeted-pool-gap-refill: 13
- uncategorized: 79
- early-direction-signal: 10
- china-vertical-agent-funding: 4
- china-startup-funding: 4
- china-policy-regulation: 1

## Keyword Search Path Distribution

- capital_startup: 10
- fde_procurement_contract: 5
- hardware_product_specs: 5
- hardware_shipment_deployment: 7
- hardware_supply_agreement: 1
- china_ai_hardware_funding: 1
- consumer_ai_hardware_funding: 7
- procurement_marketplace: 7
- fde_earnings_disclosure: 2
- hardware_capex: 2
- fde_production_rollout: 3
- hardware_capacity_fab: 3
- fde_customer_case: 2
- a_media_gdelt: 5
- hardware_oem_odm: 3
- official_original: 15
- developer_ecosystem: 7
- industry_landing: 5
- community_feedback: 2

## Keyword Search Intent Distribution

- find_startups: 33
- find_customer_case: 17
- find_hardware_supply: 1
- find_original_source: 26
- find_procurement_signal: 4
- verify_company_action: 2
- find_capacity_capex: 2
- find_market_trend: 5
- find_user_feedback: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
