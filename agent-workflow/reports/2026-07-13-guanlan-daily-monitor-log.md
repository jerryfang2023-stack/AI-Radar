# 2026-07-13 Guanlan Daily Monitor Log

- generated_at: 2026-07-13T03:44:54.692Z
- raw_count: 154
- aihot_mode: source-artifacts
- aihot_since:
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
- provider_fallback_notes: Historical Raw dedupe removed 702 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 11 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 269 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 7 duplicate candidate(s) before Raw writing.; Adaptive Raw fetch expanded by 140 candidate(s) across 2 batch(es) after post-fetch dedupe left active Raw below 150.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 8
- recovered_failed_sources_count: 7
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-13/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 8078
- historical_duplicates_removed_before_fetch: 702
- historical_duplicates_removed_after_fetch: 269
- same_run_duplicates_removed_after_fetch: 7
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 552
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 2
- adaptive_raw_fetched_candidates: 430
- adaptive_raw_expansion_candidates: 140
- aihot_count: 48
- keyword_search_count: 17
- keyword_search_non_community_count: 17
- keyword_search_path_distribution: capital_startup=9; official_original=3; fde_implementation=2; a_media_gdelt=1; developer_ecosystem=1; procurement_marketplace=1
- keyword_search_intent_distribution: find_startups=11; find_original_source=3; find_customer_case=2; find_market_trend=1
- source_distribution: rss-feed=89; aihot=48; keyword-search=17
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 41
- enterprise_ai_transformation_stage_distribution: platform_enablement=34; ai_transformation=2; org_build=2; pilot=2; production_rollout=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: rss-feed=89; aihot=48; keyword-search=17
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=88; technical-iteration-signal=20; developer-ecosystem-signal=12; capital-market-signal=11; outside-core-exploration=10; mature-commercial-signal=8; early-direction-signal=3; enterprise-ai-implementation-signal=2
- theme_distribution: uncategorized=88; technical-iteration-signal=20; capital-market-signal=11; developer-ecosystem-signal=11; outside-core-exploration=10; mature-commercial-signal=9; early-direction-signal=3; enterprise-ai-implementation-signal=2
- theme_concentration_warning: warning: uncategorized concentration 57.1% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- evidence_object_type_distribution: official_index_or_directory=44; event=42; case_or_customer=29; research_or_report=12; supporting_article=12; event_on_official_page=6; community_feedback=3; pricing_change=2; regulatory_or_procurement=2; changelog_or_release=1; repo_readme_or_index=1
- pool_route_distribution: discard=56; watchlist=43; index_only=35; core_pool=20; emerging_pool=17; user_feedback_pool=4
- pool_index_route_distribution: watchlist=43; index_only=35; core_pool=20; emerging_pool=17; user_feedback_pool=4
- pool_index_count: 98
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 63
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 43
- index_only_pool_count: 35
- aihot_index_only_count: 26
- aihot_core_count: 11
- aihot_daily_index_only_count: 10
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=1/5; important_funding=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 98
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 31 result(s): missing_ai_anchor_in_result=14; job_or_salary_page=6; noise_term:career=6; noise_term:affiliate=2; broad_list_or_market_report=1; noise_term:hiring=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=95; operators=18; media=12; newsletter=10; builder=4; funding=4; industry=3; developer=2; news=2; product=2; official=1; research=1
- front_signal_sab_source_count: S=0; A=0; B=10; total=10
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: no-url-summary-only=51; fetched-readable-text-main=24; fetched-readable-text-body-visible-text=19; fetched-readable-text-content-container=18; fetched-readable-text-article=14; summary-only-low-readable-body=13; blocked-http-403=6; fetched-readable-text-json-ld=6; http-404-fallback-text=2; fetch-failed-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 117
- A: 14
- C: 18
- S: 5

## Evidence Object Type Distribution

- community_feedback: 3
- event: 42
- regulatory_or_procurement: 2
- research_or_report: 12
- case_or_customer: 29
- supporting_article: 12
- repo_readme_or_index: 1
- pricing_change: 2
- changelog_or_release: 1
- official_index_or_directory: 44
- event_on_official_page: 6

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 20
- 开发者生态信号 (developer-ecosystem-signal): 11
- 资本市场信号 (capital-market-signal): 11
- 成熟信号 (mature-commercial-signal): 9
- 外围探索信号 (outside-core-exploration): 10
- 早期信号 (early-direction-signal): 3
- uncategorized (uncategorized): 88
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 2

## Keyword Group Distribution

- technical-iteration-signal: 20
- developer-ecosystem-signal: 12
- capital-market-signal: 11
- outside-core-exploration: 10
- early-direction-signal: 3
- mature-commercial-signal: 8
- uncategorized: 88
- enterprise-ai-implementation-signal: 2

## Keyword Search Path Distribution

- capital_startup: 9
- developer_ecosystem: 1
- official_original: 3
- fde_implementation: 2
- procurement_marketplace: 1
- a_media_gdelt: 1

## Keyword Search Intent Distribution

- find_startups: 11
- find_original_source: 3
- find_customer_case: 2
- find_market_trend: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
