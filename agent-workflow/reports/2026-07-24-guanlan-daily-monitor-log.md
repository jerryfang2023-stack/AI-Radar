# 2026-07-24 Guanlan Daily Monitor Log

- generated_at: 2026-07-24T01:26:19.730Z
- raw_count: 166
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 14
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 225 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 23 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 192 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 2 duplicate candidate(s) before Raw writing.; Adaptive Raw fetch expanded by 70 candidate(s) across 2 batch(es) after post-fetch dedupe left active Raw below 150.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 9
- recovered_failed_sources_count: 9
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-24/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-24/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-24/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-24/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 9651
- historical_duplicates_removed_before_fetch: 225
- historical_duplicates_removed_after_fetch: 192
- same_run_duplicates_removed_after_fetch: 2
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 360
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 2
- adaptive_raw_fetched_candidates: 360
- adaptive_raw_expansion_candidates: 70
- aihot_count: 98
- keyword_search_count: 36
- keyword_search_non_community_count: 35
- keyword_search_path_distribution: ai_hardware_original=14; capital_startup=7; official_original=6; industry_landing=5; a_media_gdelt=2; community_feedback=1; developer_ecosystem=1
- keyword_search_intent_distribution: find_customer_case=14; find_original_source=10; find_startups=9; find_market_trend=2; find_user_feedback=1
- source_distribution: aihot=98; keyword-search=36; rss-feed=32
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 41
- enterprise_ai_transformation_stage_distribution: platform_enablement=20; pilot=7; production_rollout=7; ai_transformation=5; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=98; keyword-search=36; rss-feed=32
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: early-direction-signal=29; technical-iteration-signal=29; uncategorized=29; mature-commercial-signal=28; developer-ecosystem-signal=21; outside-core-exploration=9; ai-hardware-trend-innovation-signal=8; capital-market-signal=7; ai-hardware-scenario-service-signal=6
- theme_distribution: early-direction-signal=29; technical-iteration-signal=29; uncategorized=29; mature-commercial-signal=28; developer-ecosystem-signal=21; outside-core-exploration=9; ai-hardware-trend-innovation-signal=8; capital-market-signal=7; ai-hardware-scenario-service-signal=6
- theme_concentration_warning: none
- evidence_object_type_distribution: event=69; case_or_customer=57; official_index_or_directory=10; regulatory_or_procurement=8; research_or_report=7; supporting_article=6; changelog_or_release=3; event_on_official_page=2; repo_readme_or_index=2; community_feedback=1; pricing_change=1
- pool_route_distribution: watchlist=57; core_pool=54; index_only=37; emerging_pool=28; discard=15
- pool_index_route_distribution: watchlist=57; core_pool=54; index_only=37; emerging_pool=28
- pool_index_count: 151
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 114
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 60
- index_only_pool_count: 37
- aihot_index_only_count: 28
- aihot_core_count: 33
- aihot_daily_index_only_count: 14
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 151
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 39 result(s): missing_ai_anchor_in_result=13; noise_term:career=10; job_or_salary_page=8; broad_list_or_market_report=4; directory_or_search_page=1; noise_term:affiliate=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS dataiku-blog: HTTP 404
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=106; media=24; news=12; developer=7; operators=6; industry=2; marketplace=2; newsletter=2; official=2; analysis=1; builder=1; funding=1
- front_signal_sab_source_count: S=0; A=6; B=31; total=37
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=69; fetched-readable-text-body-visible-text=26; fetched-readable-text-main=24; no-url-summary-only=15; blocked-http-403=9; fetched-readable-text-article=8; fetched-readable-text-json-ld=7; summary-only-low-readable-body=7; blocked-http-401=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 120
- A: 36
- C: 6
- S: 4

## Evidence Object Type Distribution

- event: 69
- case_or_customer: 57
- changelog_or_release: 3
- repo_readme_or_index: 2
- research_or_report: 7
- regulatory_or_procurement: 8
- supporting_article: 6
- community_feedback: 1
- pricing_change: 1
- official_index_or_directory: 10
- event_on_official_page: 2

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 21
- 成熟信号 (mature-commercial-signal): 28
- 早期信号 (early-direction-signal): 29
- 技术迭代信号 (technical-iteration-signal): 29
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 6
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 8
- 资本市场信号 (capital-market-signal): 7
- 外围探索信号 (outside-core-exploration): 9
- uncategorized (uncategorized): 29

## Keyword Group Distribution

- developer-ecosystem-signal: 21
- mature-commercial-signal: 28
- early-direction-signal: 29
- technical-iteration-signal: 29
- ai-hardware-scenario-service-signal: 6
- ai-hardware-trend-innovation-signal: 8
- capital-market-signal: 7
- outside-core-exploration: 9
- uncategorized: 29

## Keyword Search Path Distribution

- ai_hardware_original: 14
- capital_startup: 7
- a_media_gdelt: 2
- industry_landing: 5
- official_original: 6
- developer_ecosystem: 1
- community_feedback: 1

## Keyword Search Intent Distribution

- find_customer_case: 14
- find_original_source: 10
- find_startups: 9
- find_market_trend: 2
- find_user_feedback: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
