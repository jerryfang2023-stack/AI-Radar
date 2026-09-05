# 2026-09-05 Guanlan Daily Monitor Log

- generated_at: 2026-09-05T03:48:32.705Z
- raw_count: 228
- aihot_mode: source-artifacts
- aihot_since: none
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 8
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Search cross-entry dedupe removed 51 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 75 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 18
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 10
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-09-05/aihot-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-05/funding-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-05/gdelt-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-05/keyword-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-09-05/rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 75
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 484
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 33
- keyword_search_count: 114
- keyword_search_non_community_count: 112
- keyword_search_path_distribution: official_original=22; hardware_shipment_deployment=11; a_media_gdelt=8; developer_ecosystem=8; fde_production_rollout=8; fde_procurement_contract=7; hardware_capacity_fab=7; hardware_product_specs=7; procurement_marketplace=7; capital_startup=6; fde_customer_case=5; hardware_oem_odm=4; industry_landing=4; china_ai_hardware_funding=2; community_feedback=2; fde_earnings_disclosure=2; hardware_capex=2; hardware_supply_agreement=2
- keyword_search_intent_distribution: find_original_source=39; find_startups=30; find_customer_case=23; find_market_trend=8; find_capacity_capex=5; find_procurement_signal=3; find_hardware_supply=2; find_user_feedback=2; verify_company_action=2
- source_distribution: keyword-search=114; rss-feed=81; aihot=33
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 116
- enterprise_ai_transformation_stage_distribution: platform_enablement=52; production_rollout=27; pilot=20; ai_transformation=6; procurement=6; org_build=5
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: keyword-search=114; rss-feed=81; aihot=33
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=75; mature-commercial-signal=24; developer-ecosystem-signal=20; enterprise-ai-implementation-signal=18; technical-iteration-signal=18; capital-market-signal=16; targeted-pool-gap-refill=13; early-direction-signal=11; ai-hardware-scenario-service-signal=8; ai-hardware-trend-innovation-signal=8; china-ai-hardware-funding=7; outside-core-exploration=5; ai-hardware-investment-signal=3; china-local-project=2
- theme_distribution: uncategorized=75; mature-commercial-signal=25; technical-iteration-signal=21; enterprise-ai-implementation-signal=18; capital-market-signal=17; developer-ecosystem-signal=15; targeted-pool-gap-refill=13; early-direction-signal=11; ai-hardware-scenario-service-signal=8; ai-hardware-trend-innovation-signal=8; china-ai-hardware-funding=7; outside-core-exploration=5; ai-hardware-investment-signal=3; china-local-project=2
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=101; event=70; official_index_or_directory=11; regulatory_or_procurement=11; research_or_report=10; supporting_article=10; changelog_or_release=8; event_on_official_page=3; search_result_or_tool_directory=2; community_feedback=1; ecosystem_package_or_model_index=1
- pool_route_distribution: watchlist=104; core_pool=49; index_only=40; emerging_pool=34; discard=31
- pool_index_route_distribution: watchlist=104; core_pool=49; index_only=40; emerging_pool=34
- pool_index_count: 197
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 157
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 108
- index_only_pool_count: 40
- aihot_index_only_count: 12
- aihot_core_count: 12
- aihot_daily_index_only_count: 8
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 197
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact gdelt: source collection command failed; see gdelt-source-run.log; source-artifact keyword: keyword-search pre-gate filtered 81 result(s): missing_ai_anchor_in_result=31; social_or_profile_source=31; broad_list_or_market_report=15; noise_term:hiring=2; directory_or_search_page=1; noise_term:meme=1; source-artifact keyword: Anysearch business fallback for query "open-source AI agent GitHub enterprise adoption (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch tech fallback for query "open-source AI agent GitHub enterprise adoption (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "open-source AI agent GitHub enterprise adoption (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": business: Anysearch Search service temporarily unavailable.; tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch business fallback for query "agent governance evals production rollout enterprise AI (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; source-artifact rss: RSS venturebeat-ai: HTTP 429; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 1 result(s): social_or_profile_source=1; targeted pool/core refill cycle 1 added 13 item(s) for important_case=2/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=96; media=25; industry_media=20; developer=15; product=14; news=13; builder=12; newsletter=8; official=8; operators=8; industry=5; funding=4
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=66; fetched-readable-text-main=52; fetched-readable-text-body-visible-text=28; fetched-readable-text-article=25; blocked-http-403=19; fetched-readable-text-json-ld=12; no-url-summary-only=11; summary-only-low-readable-body=9; blocked-http-401=2; binary-text-rejected=1; fetch-failed-fallback-visible-text=1; http-404-fallback-text=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 124
- A: 38
- S: 38
- C: 8
- ungraded: 20

## Evidence Object Type Distribution

- event: 70
- research_or_report: 10
- case_or_customer: 101
- regulatory_or_procurement: 11
- changelog_or_release: 8
- event_on_official_page: 3
- supporting_article: 10
- ecosystem_package_or_model_index: 1
- search_result_or_tool_directory: 2
- official_index_or_directory: 11
- community_feedback: 1

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 21
- 成熟信号 (mature-commercial-signal): 25
- 资本市场信号 (capital-market-signal): 17
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 18
- AI Hardware investment and financing (ai-hardware-investment-signal): 3
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 8
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 8
- china-local-project (china-local-project): 2
- china-ai-hardware-funding (china-ai-hardware-funding): 7
- 早期信号 (early-direction-signal): 11
- 开发者生态信号 (developer-ecosystem-signal): 15
- targeted-pool-gap-refill (targeted-pool-gap-refill): 13
- uncategorized (uncategorized): 75
- 外围探索信号 (outside-core-exploration): 5

## Keyword Group Distribution

- technical-iteration-signal: 18
- mature-commercial-signal: 24
- capital-market-signal: 16
- enterprise-ai-implementation-signal: 18
- ai-hardware-investment-signal: 3
- ai-hardware-scenario-service-signal: 8
- ai-hardware-trend-innovation-signal: 8
- china-local-project: 2
- china-ai-hardware-funding: 7
- developer-ecosystem-signal: 20
- early-direction-signal: 11
- targeted-pool-gap-refill: 13
- uncategorized: 75
- outside-core-exploration: 5

## Keyword Search Path Distribution

- procurement_marketplace: 7
- fde_customer_case: 5
- hardware_capacity_fab: 7
- hardware_shipment_deployment: 11
- hardware_supply_agreement: 2
- hardware_capex: 2
- capital_startup: 6
- hardware_product_specs: 7
- china_ai_hardware_funding: 2
- developer_ecosystem: 8
- hardware_oem_odm: 4
- fde_procurement_contract: 7
- fde_production_rollout: 8
- official_original: 22
- a_media_gdelt: 8
- industry_landing: 4
- fde_earnings_disclosure: 2
- community_feedback: 2

## Keyword Search Intent Distribution

- find_startups: 30
- find_customer_case: 23
- find_capacity_capex: 5
- find_hardware_supply: 2
- verify_company_action: 2
- find_original_source: 39
- find_market_trend: 8
- find_procurement_signal: 3
- find_user_feedback: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
