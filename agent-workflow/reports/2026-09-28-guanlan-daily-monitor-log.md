# 2026-09-28 Guanlan Daily Monitor Log

- generated_at: 2026-09-28T00:28:17.812Z
- raw_count: 241
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
- provider_fallback_notes: Search cross-entry dedupe removed 37 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 45 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 10
- recovered_failed_sources_count: 5
- unrecovered_failed_sources_count: 5
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-28/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-28/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-28/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-28/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-28/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 45
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 284
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 284
- adaptive_raw_expansion_candidates: 0
- aihot_count: 34
- keyword_search_count: 88
- keyword_search_non_community_count: 85
- keyword_search_path_distribution: capital_startup=8; fde_customer_case=7; fde_production_rollout=7; official_original=7; consumer_ai_hardware_funding=6; developer_ecosystem=6; industry_landing=6; procurement_marketplace=6; a_media_gdelt=5; hardware_capacity_fab=5; fde_procurement_contract=4; hardware_oem_odm=4; community_feedback=3; fde_earnings_disclosure=3; hardware_shipment_deployment=3; china_ai_hardware_funding=2; hardware_capex=2; hardware_product_specs=2; china_vertical_agent_funding=1; hardware_supply_agreement=1
- keyword_search_intent_distribution: find_original_source=27; find_startups=26; find_customer_case=16; find_market_trend=5; verify_company_action=4; find_capacity_capex=3; find_procurement_signal=3; find_user_feedback=3; find_hardware_supply=1
- source_distribution: rss-feed=90; keyword-search=88; aihot=34; funding-search=29
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 97
- enterprise_ai_transformation_stage_distribution: platform_enablement=48; production_rollout=17; ai_transformation=11; pilot=9; org_build=7; procurement=5
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: rss-feed=90; keyword-search=88; aihot=34; funding-search=29
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=85; important_funding=35; mature-commercial-signal=29; technical-iteration-signal=20; enterprise-ai-implementation-signal=19; developer-ecosystem-signal=14; capital-market-signal=13; ai-hardware-trend-innovation-signal=6; china-ai-hardware-funding=4; early-direction-signal=4; ai-hardware-scenario-service-signal=2; china-listed-disclosure=2; china-local-project=2; outside-core-exploration=2; targeted-pool-gap-refill=2; ai-hardware-investment-signal=1; china-vertical-agent-funding=1
- theme_distribution: uncategorized=85; mature-commercial-signal=30; funding-dedicated=29; technical-iteration-signal=21; enterprise-ai-implementation-signal=19; capital-market-signal=14; developer-ecosystem-signal=11; ai-hardware-trend-innovation-signal=6; china-ai-hardware-funding=4; early-direction-signal=4; ai-hardware-scenario-service-signal=2; china-listed-disclosure=2; china-local-project=2; consumer-hardware-ai-audio-wearables=2; outside-core-exploration=2; targeted-pool-gap-refill=2; ai-hardware-investment-signal=1; china-vertical-agent-funding=1; consumer-hardware-ai-home-devices=1; consumer-hardware-ai-pendants=1; consumer-hardware-ai-phones=1; consumer-hardware-ai-toys=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=119; case_or_customer=67; regulatory_or_procurement=13; supporting_article=13; research_or_report=10; community_feedback=6; official_index_or_directory=6; pricing_change=4; changelog_or_release=2; event_on_official_page=1
- pool_route_distribution: watchlist=120; index_only=46; core_pool=45; emerging_pool=44; discard=24
- pool_index_route_distribution: watchlist=120; index_only=46; core_pool=45; emerging_pool=44
- pool_index_count: 217
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 171
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 126
- index_only_pool_count: 46
- aihot_index_only_count: 10
- aihot_core_count: 13
- aihot_daily_index_only_count: 2
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 217
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact gdelt: source collection command failed; see gdelt-source-run.log; source-artifact keyword: keyword-search pre-gate filtered 57 result(s): missing_ai_anchor_in_result=25; social_or_profile_source=20; broad_list_or_market_report=11; noise_term:career=1; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted pool/core refill cycle 1 added 2 item(s) for important_case=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=92; industry_media=28; media=23; operators=14; developer=13; news=13; funding=12; product=12; builder=9; newsletter=8; industry=7; official=6; listed_company_disclosure=2; community=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=84; fetched-readable-text-main=52; fetched-readable-text-body-visible-text=29; fetched-readable-text-article=28; blocked-http-403=14; fetched-readable-text-json-ld=12; summary-only-low-readable-body=8; no-url-summary-only=6; http-429-fallback-text=3; timeout-fallback-visible-text=3; binary-text-rejected=1; fetch-failed-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 132
- A: 36
- S: 28
- ungraded: 30
- C: 15

## Evidence Object Type Distribution

- research_or_report: 10
- event: 119
- regulatory_or_procurement: 13
- case_or_customer: 67
- changelog_or_release: 2
- pricing_change: 4
- event_on_official_page: 1
- supporting_article: 13
- community_feedback: 6
- official_index_or_directory: 6

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 30
- 技术迭代信号 (technical-iteration-signal): 21
- 资本市场信号 (capital-market-signal): 14
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 19
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 2
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 6
- consumer-hardware-ai-audio-wearables (consumer-hardware-ai-audio-wearables): 2
- consumer-hardware-ai-home-devices (consumer-hardware-ai-home-devices): 1
- 早期信号 (early-direction-signal): 4
- china-ai-hardware-funding (china-ai-hardware-funding): 4
- china-local-project (china-local-project): 2
- 开发者生态信号 (developer-ecosystem-signal): 11
- targeted-pool-gap-refill (targeted-pool-gap-refill): 2
- funding-dedicated (funding-dedicated): 29
- uncategorized (uncategorized): 85
- china-vertical-agent-funding (china-vertical-agent-funding): 1
- consumer-hardware-ai-toys (consumer-hardware-ai-toys): 1
- consumer-hardware-ai-phones (consumer-hardware-ai-phones): 1
- 外围探索信号 (outside-core-exploration): 2
- AI Hardware investment and financing (ai-hardware-investment-signal): 1
- consumer-hardware-ai-pendants (consumer-hardware-ai-pendants): 1
- china-listed-disclosure (china-listed-disclosure): 2

## Keyword Group Distribution

- mature-commercial-signal: 29
- technical-iteration-signal: 20
- capital-market-signal: 13
- enterprise-ai-implementation-signal: 19
- ai-hardware-scenario-service-signal: 2
- ai-hardware-trend-innovation-signal: 6
- important_funding: 35
- early-direction-signal: 4
- china-ai-hardware-funding: 4
- china-local-project: 2
- developer-ecosystem-signal: 14
- targeted-pool-gap-refill: 2
- uncategorized: 85
- china-vertical-agent-funding: 1
- outside-core-exploration: 2
- ai-hardware-investment-signal: 1
- china-listed-disclosure: 2

## Keyword Search Path Distribution

- capital_startup: 8
- fde_production_rollout: 7
- hardware_product_specs: 2
- hardware_supply_agreement: 1
- consumer_ai_hardware_funding: 6
- a_media_gdelt: 5
- fde_procurement_contract: 4
- hardware_capacity_fab: 5
- hardware_shipment_deployment: 3
- china_ai_hardware_funding: 2
- hardware_capex: 2
- developer_ecosystem: 6
- fde_earnings_disclosure: 3
- procurement_marketplace: 6
- fde_customer_case: 7
- industry_landing: 6
- hardware_oem_odm: 4
- official_original: 7
- china_vertical_agent_funding: 1
- community_feedback: 3

## Keyword Search Intent Distribution

- find_startups: 26
- find_customer_case: 16
- find_hardware_supply: 1
- find_market_trend: 5
- find_capacity_capex: 3
- find_original_source: 27
- verify_company_action: 4
- find_procurement_signal: 3
- find_user_feedback: 3

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
