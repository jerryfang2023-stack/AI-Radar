# 2026-07-16 Guanlan Daily Monitor Log

- generated_at: 2026-07-16T02:39:34.163Z
- raw_count: 157
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
- provider_fallback_notes: Historical Raw dedupe removed 226 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 35 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 133 fetched hash duplicate candidate(s) before Raw writing.; Same-run Raw dedupe removed 1 duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 6 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 12
- recovered_failed_sources_count: 10
- unrecovered_failed_sources_count: 2
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-16/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-16/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-16/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-16/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 8491
- historical_duplicates_removed_before_fetch: 226
- historical_duplicates_removed_after_fetch: 133
- same_run_duplicates_removed_after_fetch: 1
- raw_dedupe_buffer: 140
- adaptive_raw_candidate_pool_count: 335
- adaptive_raw_fetch_limit: 720
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 290
- adaptive_raw_expansion_candidates: 0
- aihot_count: 100
- keyword_search_count: 28
- keyword_search_non_community_count: 28
- keyword_search_path_distribution: capital_startup=8; ai_hardware_original=6; a_media_gdelt=5; procurement_marketplace=4; industry_landing=2; official_original=2; developer_ecosystem=1
- keyword_search_intent_distribution: find_startups=11; find_customer_case=6; find_original_source=6; find_market_trend=5
- source_distribution: aihot=100; keyword-search=28; rss-feed=28; gdelt=1
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 35
- enterprise_ai_transformation_stage_distribution: platform_enablement=21; production_rollout=6; ai_transformation=4; org_build=3; pilot=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=100; keyword-search=28; rss-feed=28; gdelt=1
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=46; developer-ecosystem-signal=27; uncategorized=27; mature-commercial-signal=21; early-direction-signal=11; outside-core-exploration=10; capital-market-signal=8; ai-hardware-scenario-service-signal=4; ai-hardware-trend-innovation-signal=2; targeted-pool-gap-refill=1
- theme_distribution: technical-iteration-signal=47; uncategorized=27; developer-ecosystem-signal=23; mature-commercial-signal=22; early-direction-signal=12; outside-core-exploration=10; capital-market-signal=9; ai-hardware-scenario-service-signal=4; ai-hardware-trend-innovation-signal=2; targeted-pool-gap-refill=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=63; case_or_customer=41; official_index_or_directory=15; regulatory_or_procurement=12; supporting_article=10; research_or_report=6; changelog_or_release=4; community_feedback=3; event_on_official_page=3
- pool_route_distribution: core_pool=55; watchlist=53; index_only=41; emerging_pool=20; discard=8
- pool_index_route_distribution: core_pool=55; watchlist=53; index_only=41; emerging_pool=20
- pool_index_count: 149
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 108
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 53
- index_only_pool_count: 41
- aihot_index_only_count: 32
- aihot_core_count: 35
- aihot_daily_index_only_count: 22
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 149
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 34 result(s): missing_ai_anchor_in_result=17; noise_term:career=6; job_or_salary_page=5; broad_list_or_market_report=2; noise_term:definition=1; noise_term:hiring=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS tigera-blog: HTTP 415; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 1 result(s): noise_term:avatar=1; targeted pool/core refill cycle 1 added 1 item(s) for important_case=3/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=87; media=23; news=19; developer=8; official=6; builder=3; operators=3; product=3; funding=2; marketplace=2; newsletter=1
- front_signal_sab_source_count: S=1; A=3; B=20; total=24
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=53; fetched-readable-text-body-visible-text=27; fetched-readable-text-main=27; no-url-summary-only=22; summary-only-low-readable-body=9; fetched-readable-text-article=8; fetched-readable-text-json-ld=5; blocked-http-403=4; blocked-http-401=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 42
- B: 98
- C: 3
- S: 14

## Evidence Object Type Distribution

- event: 63
- case_or_customer: 41
- community_feedback: 3
- supporting_article: 10
- regulatory_or_procurement: 12
- research_or_report: 6
- changelog_or_release: 4
- official_index_or_directory: 15
- event_on_official_page: 3

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 23
- 外围探索信号 (outside-core-exploration): 10
- 早期信号 (early-direction-signal): 12
- 技术迭代信号 (technical-iteration-signal): 47
- 资本市场信号 (capital-market-signal): 9
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 4
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 2
- 成熟信号 (mature-commercial-signal): 22
- targeted-pool-gap-refill (targeted-pool-gap-refill): 1
- uncategorized (uncategorized): 27

## Keyword Group Distribution

- developer-ecosystem-signal: 27
- outside-core-exploration: 10
- early-direction-signal: 11
- technical-iteration-signal: 46
- capital-market-signal: 8
- ai-hardware-scenario-service-signal: 4
- ai-hardware-trend-innovation-signal: 2
- mature-commercial-signal: 21
- targeted-pool-gap-refill: 1
- uncategorized: 27

## Keyword Search Path Distribution

- capital_startup: 8
- ai_hardware_original: 6
- a_media_gdelt: 5
- official_original: 2
- industry_landing: 2
- procurement_marketplace: 4
- developer_ecosystem: 1

## Keyword Search Intent Distribution

- find_startups: 11
- find_customer_case: 6
- find_original_source: 6
- find_market_trend: 5

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
