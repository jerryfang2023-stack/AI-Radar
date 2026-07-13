# 2026-07-13 Guanlan Daily Monitor Log

- generated_at: 2026-07-13T08:51:53.196Z
- raw_count: 105
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
- provider_fallback_notes: Same-date rerun carried forward 16 already published formal Card source snapshot(s).; Historical Raw dedupe removed 248 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 23 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 105 fetched hash duplicate candidate(s) before Raw writing.; Adaptive Raw fetch stopped with 104/150 active candidate(s): candidate pool exhausted.; Historical Raw dedupe removed 19 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 13
- recovered_failed_sources_count: 11
- unrecovered_failed_sources_count: 2
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-13/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-13/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 8078
- historical_duplicates_removed_before_fetch: 248
- historical_duplicates_removed_after_fetch: 105
- same_run_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 209
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 209
- adaptive_raw_expansion_candidates: 0
- aihot_count: 54
- keyword_search_count: 22
- keyword_search_non_community_count: 22
- keyword_search_path_distribution: capital_startup=12; official_original=5; fde_implementation=2; a_media_gdelt=1; developer_ecosystem=1; industry_landing=1
- keyword_search_intent_distribution: find_startups=17; find_customer_case=3; find_market_trend=1; find_original_source=1
- source_distribution: aihot=54; rss-feed=28; keyword-search=22; gdelt=1
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 31
- enterprise_ai_transformation_stage_distribution: platform_enablement=19; pilot=5; ai_transformation=4; org_build=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=54; rss-feed=28; keyword-search=22; gdelt=1
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: uncategorized=36; technical-iteration-signal=19; developer-ecosystem-signal=14; mature-commercial-signal=13; capital-market-signal=10; early-direction-signal=5; outside-core-exploration=5; enterprise-ai-implementation-signal=2; targeted-pool-gap-refill=1
- theme_distribution: uncategorized=36; technical-iteration-signal=19; developer-ecosystem-signal=13; mature-commercial-signal=13; capital-market-signal=11; early-direction-signal=5; outside-core-exploration=5; enterprise-ai-implementation-signal=2; targeted-pool-gap-refill=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=48; case_or_customer=18; official_index_or_directory=10; research_or_report=9; supporting_article=8; community_feedback=4; regulatory_or_procurement=4; repo_readme_or_index=2; event_on_official_page=1; pricing_change=1
- pool_route_distribution: index_only=40; core_pool=29; watchlist=29; emerging_pool=17; discard=7; user_feedback_pool=4
- pool_index_route_distribution: index_only=40; core_pool=29; watchlist=29; emerging_pool=17; user_feedback_pool=4
- pool_index_count: 98
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 58
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 29
- index_only_pool_count: 40
- aihot_index_only_count: 26
- aihot_core_count: 14
- aihot_daily_index_only_count: 10
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5; important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 98
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 35 result(s): missing_ai_anchor_in_result=14; noise_term:career=8; job_or_salary_page=7; broad_list_or_market_report=2; noise_term:affiliate=1; noise_term:hiring=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 2 result(s): noise_term:avatar=1; noise_term:hiring=1; targeted pool/core refill cycle 1 added 1 item(s) for important_case=2/5; important_funding=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=59; media=13; newsletter=7; developer=6; builder=4; operators=4; funding=3; product=3; industry=2; news=2; domestic_vendor=1; research=1
- front_signal_sab_source_count: S=0; A=2; B=16; total=18
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=22; fetched-readable-text-body-visible-text=21; fetched-readable-text-carry-forward=16; fetched-readable-text-main=13; no-url-summary-only=11; fetched-readable-text-article=8; fetched-readable-text-json-ld=7; blocked-http-403=4; summary-only-low-readable-body=3
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 78
- S: 8
- C: 4
- A: 15

## Evidence Object Type Distribution

- event: 48
- case_or_customer: 18
- pricing_change: 1
- community_feedback: 4
- regulatory_or_procurement: 4
- official_index_or_directory: 10
- supporting_article: 8
- research_or_report: 9
- repo_readme_or_index: 2
- event_on_official_page: 1

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 13
- uncategorized (uncategorized): 36
- 技术迭代信号 (technical-iteration-signal): 19
- 开发者生态信号 (developer-ecosystem-signal): 13
- 资本市场信号 (capital-market-signal): 11
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 2
- targeted-pool-gap-refill (targeted-pool-gap-refill): 1
- 外围探索信号 (outside-core-exploration): 5
- 早期信号 (early-direction-signal): 5

## Keyword Group Distribution

- mature-commercial-signal: 13
- uncategorized: 36
- technical-iteration-signal: 19
- developer-ecosystem-signal: 14
- capital-market-signal: 10
- enterprise-ai-implementation-signal: 2
- targeted-pool-gap-refill: 1
- outside-core-exploration: 5
- early-direction-signal: 5

## Keyword Search Path Distribution

- capital_startup: 12
- official_original: 5
- fde_implementation: 2
- developer_ecosystem: 1
- industry_landing: 1
- a_media_gdelt: 1

## Keyword Search Intent Distribution

- find_startups: 17
- find_customer_case: 3
- find_market_trend: 1
- find_original_source: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
