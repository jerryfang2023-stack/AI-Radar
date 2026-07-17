# 2026-07-17 Guanlan Daily Monitor Log

- generated_at: 2026-07-17T04:40:17.523Z
- raw_count: 160
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 22
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 222 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 38 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 128 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 2 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 9
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-17/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-17/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-17/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-17/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 8648
- historical_duplicates_removed_before_fetch: 222
- historical_duplicates_removed_after_fetch: 128
- same_run_duplicates_removed_after_fetch: 2
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 353
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 90
- keyword_search_count: 31
- keyword_search_non_community_count: 30
- keyword_search_path_distribution: ai_hardware_original=8; capital_startup=8; official_original=5; a_media_gdelt=3; industry_landing=3; fde_implementation=2; community_feedback=1; procurement_marketplace=1
- keyword_search_intent_distribution: find_customer_case=12; find_startups=12; find_market_trend=3; find_original_source=3; find_user_feedback=1
- source_distribution: aihot=90; rss-feed=36; keyword-search=31; gdelt=3
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 44
- enterprise_ai_transformation_stage_distribution: platform_enablement=23; production_rollout=8; ai_transformation=5; org_build=4; pilot=4
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=90; rss-feed=36; keyword-search=31; gdelt=3
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=40; uncategorized=32; developer-ecosystem-signal=29; mature-commercial-signal=23; capital-market-signal=10; outside-core-exploration=10; early-direction-signal=6; ai-hardware-scenario-service-signal=5; ai-hardware-investment-signal=2; enterprise-ai-implementation-signal=2; ai-hardware-trend-innovation-signal=1
- theme_distribution: technical-iteration-signal=41; uncategorized=32; developer-ecosystem-signal=27; mature-commercial-signal=24; capital-market-signal=10; outside-core-exploration=10; early-direction-signal=6; ai-hardware-scenario-service-signal=5; ai-hardware-investment-signal=2; enterprise-ai-implementation-signal=2; ai-hardware-trend-innovation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=65; case_or_customer=39; official_index_or_directory=19; regulatory_or_procurement=11; supporting_article=11; research_or_report=6; changelog_or_release=3; pricing_change=3; community_feedback=2; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=59; core_pool=48; index_only=40; emerging_pool=21; discard=12
- pool_index_route_distribution: watchlist=59; core_pool=48; index_only=40; emerging_pool=21
- pool_index_count: 148
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 108
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 60
- index_only_pool_count: 40
- aihot_index_only_count: 30
- aihot_core_count: 28
- aihot_daily_index_only_count: 22
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 148
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 40 result(s): missing_ai_anchor_in_result=14; noise_term:career=9; broad_list_or_market_report=5; job_or_salary_page=4; noise_term:hiring=3; social_or_profile_source=3; noise_term:avatar=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=96; media=21; news=16; official=5; operators=5; developer=4; product=4; funding=3; builder=2; newsletter=2; analysis=1; industry=1
- front_signal_sab_source_count: S=1; A=4; B=23; total=28
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=51; fetched-readable-text-main=29; fetched-readable-text-body-visible-text=25; no-url-summary-only=22; summary-only-low-readable-body=12; blocked-http-403=6; fetched-readable-text-article=6; http-429-fallback-text=5; fetched-readable-text-json-ld=4
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 106
- A: 37
- C: 5
- S: 12

## Evidence Object Type Distribution

- regulatory_or_procurement: 11
- event: 65
- pricing_change: 3
- case_or_customer: 39
- changelog_or_release: 3
- research_or_report: 6
- supporting_article: 11
- community_feedback: 2
- search_result_or_tool_directory: 1
- official_index_or_directory: 19

## Theme Distribution

- 早期信号 (early-direction-signal): 6
- 技术迭代信号 (technical-iteration-signal): 41
- 成熟信号 (mature-commercial-signal): 24
- 开发者生态信号 (developer-ecosystem-signal): 27
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 2
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 5
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 1
- 资本市场信号 (capital-market-signal): 10
- 外围探索信号 (outside-core-exploration): 10
- uncategorized (uncategorized): 32

## Keyword Group Distribution

- early-direction-signal: 6
- technical-iteration-signal: 40
- mature-commercial-signal: 23
- developer-ecosystem-signal: 29
- enterprise-ai-implementation-signal: 2
- ai-hardware-investment-signal: 2
- ai-hardware-scenario-service-signal: 5
- ai-hardware-trend-innovation-signal: 1
- capital-market-signal: 10
- outside-core-exploration: 10
- uncategorized: 32

## Keyword Search Path Distribution

- fde_implementation: 2
- ai_hardware_original: 8
- a_media_gdelt: 3
- capital_startup: 8
- official_original: 5
- industry_landing: 3
- procurement_marketplace: 1
- community_feedback: 1

## Keyword Search Intent Distribution

- find_customer_case: 12
- find_startups: 12
- find_original_source: 3
- find_market_trend: 3
- find_user_feedback: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
