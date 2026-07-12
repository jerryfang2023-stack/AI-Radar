# 2026-07-12 Guanlan Daily Monitor Log

- generated_at: 2026-07-12T06:10:52.390Z
- raw_count: 62
- aihot_mode: source-artifacts
- aihot_since: 
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
- provider_fallback_notes: Historical Raw dedupe removed 566 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 9 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 228 fetched hash duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 8
- recovered_failed_sources_count: 7
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-12/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-12/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-12/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-12/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 7809
- historical_duplicates_removed_before_fetch: 566
- historical_duplicates_removed_after_fetch: 228
- raw_dedupe_buffer: 140
- aihot_count: 43
- keyword_search_count: 13
- keyword_search_non_community_count: 13
- keyword_search_path_distribution: a_media_gdelt=4; developer_ecosystem=3; official_original=2; ai_hardware_original=1; capital_startup=1; fde_implementation=1; procurement_marketplace=1
- keyword_search_intent_distribution: find_original_source=5; find_market_trend=4; find_startups=4
- source_distribution: aihot=43; keyword-search=13; gdelt=3; rss-feed=3
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 19
- enterprise_ai_transformation_stage_distribution: platform_enablement=7; production_rollout=5; pilot=4; ai_transformation=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=43; keyword-search=13; gdelt=3; rss-feed=3
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=20; mature-commercial-signal=14; developer-ecosystem-signal=12; early-direction-signal=6; outside-core-exploration=5; uncategorized=2; ai-hardware-investment-signal=1; capital-market-signal=1; enterprise-ai-implementation-signal=1
- theme_distribution: technical-iteration-signal=20; mature-commercial-signal=15; developer-ecosystem-signal=9; early-direction-signal=7; outside-core-exploration=5; capital-market-signal=2; uncategorized=2; ai-hardware-investment-signal=1; enterprise-ai-implementation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=23; case_or_customer=15; official_index_or_directory=6; regulatory_or_procurement=5; changelog_or_release=3; event_on_official_page=3; research_or_report=3; supporting_article=2; community_feedback=1; repo_readme_or_index=1
- pool_route_distribution: watchlist=21; core_pool=20; index_only=19; emerging_pool=9; user_feedback_pool=4; discard=2
- pool_index_route_distribution: watchlist=21; core_pool=20; index_only=19; emerging_pool=9; user_feedback_pool=4
- pool_index_count: 60
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 41
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 21
- index_only_pool_count: 19
- aihot_index_only_count: 17
- aihot_core_count: 14
- aihot_daily_index_only_count: 8
- aihot_daily_core_count: 0
- importance_coverage_gaps: important_case=2/3; important_funding=2/3
- pool_importance_coverage_gaps: important_case=2/5; important_funding=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 60
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 32 result(s): missing_ai_anchor_in_result=13; noise_term:career=8; job_or_salary_page=7; broad_list_or_market_report=1; noise_term:hiring=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS dataiku-blog: HTTP 404
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=38; media=12; developer=4; news=3; marketplace=2; analysis=1; builder=1; official=1
- front_signal_sab_source_count: S=0; A=2; B=2; total=4
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=26; fetched-readable-text-body-visible-text=10; fetched-readable-text-main=9; no-url-summary-only=8; fetched-readable-text-article=3; fetched-readable-text-json-ld=3; blocked-http-403=2; summary-only-low-readable-body=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 43
- A: 15
- S: 4

## Evidence Object Type Distribution

- case_or_customer: 15
- event: 23
- research_or_report: 3
- regulatory_or_procurement: 5
- changelog_or_release: 3
- supporting_article: 2
- repo_readme_or_index: 1
- community_feedback: 1
- event_on_official_page: 3
- official_index_or_directory: 6

## Theme Distribution

- 早期信号 (early-direction-signal): 7
- 技术迭代信号 (technical-iteration-signal): 20
- 成熟信号 (mature-commercial-signal): 15
- 开发者生态信号 (developer-ecosystem-signal): 9
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 1
- AI Hardware investment and financing (ai-hardware-investment-signal): 1
- 外围探索信号 (outside-core-exploration): 5
- uncategorized (uncategorized): 2
- 资本市场信号 (capital-market-signal): 2

## Keyword Group Distribution

- early-direction-signal: 6
- technical-iteration-signal: 20
- mature-commercial-signal: 14
- developer-ecosystem-signal: 12
- enterprise-ai-implementation-signal: 1
- ai-hardware-investment-signal: 1
- outside-core-exploration: 5
- uncategorized: 2
- capital-market-signal: 1

## Keyword Search Path Distribution

- fde_implementation: 1
- ai_hardware_original: 1
- a_media_gdelt: 4
- capital_startup: 1
- official_original: 2
- developer_ecosystem: 3
- procurement_marketplace: 1

## Keyword Search Intent Distribution

- find_original_source: 5
- find_startups: 4
- find_market_trend: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
