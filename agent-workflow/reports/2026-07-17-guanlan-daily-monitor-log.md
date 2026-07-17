# 2026-07-17 Guanlan Daily Monitor Log

- generated_at: 2026-07-17T01:57:09.188Z
- raw_count: 167
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 21
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 220 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 37 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 121 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 2 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 9
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-17/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-17/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-17/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-17/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 8648
- historical_duplicates_removed_before_fetch: 220
- historical_duplicates_removed_after_fetch: 121
- same_run_duplicates_removed_after_fetch: 2
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 378
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 91
- keyword_search_count: 35
- keyword_search_non_community_count: 34
- keyword_search_path_distribution: ai_hardware_original=10; capital_startup=7; official_original=7; a_media_gdelt=5; developer_ecosystem=3; community_feedback=1; industry_landing=1; procurement_marketplace=1
- keyword_search_intent_distribution: find_startups=15; find_customer_case=8; find_original_source=6; find_market_trend=5; find_user_feedback=1
- source_distribution: aihot=91; rss-feed=36; keyword-search=35; gdelt=5
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 47
- enterprise_ai_transformation_stage_distribution: platform_enablement=21; pilot=10; production_rollout=10; ai_transformation=5; org_build=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=91; rss-feed=36; keyword-search=35; gdelt=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=38; developer-ecosystem-signal=32; uncategorized=32; mature-commercial-signal=25; capital-market-signal=12; outside-core-exploration=10; early-direction-signal=8; ai-hardware-scenario-service-signal=6; ai-hardware-investment-signal=2; ai-hardware-trend-innovation-signal=2
- theme_distribution: technical-iteration-signal=39; uncategorized=32; developer-ecosystem-signal=27; mature-commercial-signal=26; capital-market-signal=12; early-direction-signal=11; outside-core-exploration=10; ai-hardware-scenario-service-signal=6; ai-hardware-investment-signal=2; ai-hardware-trend-innovation-signal=2
- theme_concentration_warning: none
- evidence_object_type_distribution: event=70; case_or_customer=40; official_index_or_directory=18; supporting_article=15; regulatory_or_procurement=10; research_or_report=6; changelog_or_release=4; pricing_change=2; community_feedback=1; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=61; core_pool=52; index_only=38; emerging_pool=24; discard=15
- pool_index_route_distribution: watchlist=61; core_pool=52; index_only=38; emerging_pool=24
- pool_index_count: 152
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 114
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 62
- index_only_pool_count: 38
- aihot_index_only_count: 28
- aihot_core_count: 30
- aihot_daily_index_only_count: 21
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 152
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 36 result(s): missing_ai_anchor_in_result=13; noise_term:career=8; job_or_salary_page=6; broad_list_or_market_report=4; social_or_profile_source=2; noise_term:affiliate=1; noise_term:avatar=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=95; media=22; news=20; operators=7; developer=6; official=6; product=5; builder=2; newsletter=2; analysis=1; industry=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=54; fetched-readable-text-body-visible-text=29; fetched-readable-text-main=28; no-url-summary-only=21; summary-only-low-readable-body=13; fetched-readable-text-article=8; blocked-http-403=6; http-429-fallback-text=4; fetched-readable-text-json-ld=3; blocked-http-401=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 103
- S: 15
- A: 42
- C: 7

## Evidence Object Type Distribution

- regulatory_or_procurement: 10
- pricing_change: 2
- changelog_or_release: 4
- event: 70
- case_or_customer: 40
- research_or_report: 6
- supporting_article: 15
- community_feedback: 1
- search_result_or_tool_directory: 1
- official_index_or_directory: 18

## Theme Distribution

- 早期信号 (early-direction-signal): 11
- 技术迭代信号 (technical-iteration-signal): 39
- 成熟信号 (mature-commercial-signal): 26
- 开发者生态信号 (developer-ecosystem-signal): 27
- 资本市场信号 (capital-market-signal): 12
- AI Hardware investment and financing (ai-hardware-investment-signal): 2
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 6
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 2
- 外围探索信号 (outside-core-exploration): 10
- uncategorized (uncategorized): 32

## Keyword Group Distribution

- early-direction-signal: 8
- technical-iteration-signal: 38
- developer-ecosystem-signal: 32
- mature-commercial-signal: 25
- capital-market-signal: 12
- ai-hardware-investment-signal: 2
- ai-hardware-scenario-service-signal: 6
- ai-hardware-trend-innovation-signal: 2
- outside-core-exploration: 10
- uncategorized: 32

## Keyword Search Path Distribution

- capital_startup: 7
- ai_hardware_original: 10
- a_media_gdelt: 5
- official_original: 7
- procurement_marketplace: 1
- developer_ecosystem: 3
- community_feedback: 1
- industry_landing: 1

## Keyword Search Intent Distribution

- find_startups: 15
- find_customer_case: 8
- find_original_source: 6
- find_market_trend: 5
- find_user_feedback: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
