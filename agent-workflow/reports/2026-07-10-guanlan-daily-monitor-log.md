# 2026-07-10 Guanlan Daily Monitor Log

- generated_at: 2026-07-10T02:00:12.331Z
- raw_count: 127
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
- provider_fallback_notes: Historical Raw dedupe removed 508 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 37 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 180 fetched hash duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 42 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 42 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 55 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 3 fetched hash duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 55 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 3 fetched hash duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 23
- recovered_failed_sources_count: 23
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-10/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-10/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-10/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-10/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 7597
- historical_duplicates_removed_before_fetch: 508
- historical_duplicates_removed_after_fetch: 180
- raw_dedupe_buffer: 140
- aihot_count: 62
- keyword_search_count: 46
- keyword_search_non_community_count: 46
- keyword_search_path_distribution: official_original=20; industry_landing=7; capital_startup=5; developer_ecosystem=5; a_media_gdelt=4; ai_hardware_original=3; procurement_marketplace=2
- keyword_search_intent_distribution: find_original_source=18; find_customer_case=12; find_startups=12; find_market_trend=4
- source_distribution: aihot=62; keyword-search=46; rss-feed=12; gdelt=7
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 48
- enterprise_ai_transformation_stage_distribution: platform_enablement=26; production_rollout=10; ai_transformation=5; pilot=5; org_build=1; procurement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=62; keyword-search=46; rss-feed=12; gdelt=7
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=37; developer-ecosystem-signal=30; targeted-pool-gap-refill=17; mature-commercial-signal=12; uncategorized=11; early-direction-signal=8; ai-hardware-investment-signal=4; capital-market-signal=4; outside-core-exploration=3; enterprise-ai-implementation-signal=1
- theme_distribution: technical-iteration-signal=38; developer-ecosystem-signal=26; targeted-pool-gap-refill=17; mature-commercial-signal=13; uncategorized=11; early-direction-signal=9; capital-market-signal=5; ai-hardware-investment-signal=4; outside-core-exploration=3; enterprise-ai-implementation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=54; event=51; official_index_or_directory=8; regulatory_or_procurement=5; supporting_article=3; changelog_or_release=2; community_feedback=1; pricing_change=1; repo_readme_or_index=1; research_or_report=1
- pool_route_distribution: watchlist=59; core_pool=25; index_only=25; emerging_pool=24; discard=16; user_feedback_pool=3
- pool_index_route_distribution: watchlist=59; core_pool=25; index_only=25; emerging_pool=24; user_feedback_pool=3
- pool_index_count: 111
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 86
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 61
- index_only_pool_count: 25
- aihot_index_only_count: 19
- aihot_core_count: 9
- aihot_daily_index_only_count: 10
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 111
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 29 result(s): missing_ai_anchor_in_result=11; noise_term:career=6; job_or_salary_page=5; noise_term:hiring=5; noise_term:affiliate=1; noise_term:jobs at=1; source-artifact rss: RSS the-decoder-rss: fetch failed; source-artifact rss: RSS tigera-blog: HTTP 415; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=2; noise_term:career=2; targeted pool/core refill cycle 1 added 9 item(s) for core_pool=22/30; core_non_large=12/20; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=2; noise_term:career=2; targeted pool/core refill cycle 2 added 0 item(s) for core_pool=25/30; core_non_large=15/20; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=1; noise_term:avatar=1; targeted raw-volume refill cycle 1 added 8 item(s) for raw_count=127/150; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=1; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 0 item(s) for raw_count=127/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=52; media=23; news=17; official=10; product=10; developer=7; marketplace=3; builder=2; operators=2; funding=1
- front_signal_sab_source_count: S=7; A=2; B=13; total=22
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=49; fetched-readable-text-main=21; fetched-readable-text-body-visible-text=18; no-url-summary-only=10; blocked-http-403=9; timeout-fallback-visible-text=6; summary-only-low-readable-body=5; fetched-readable-text-article=4; fetched-readable-text-json-ld=3; fetch-failed-fallback-visible-text=1; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 40
- B: 62
- S: 23
- C: 2

## Evidence Object Type Distribution

- regulatory_or_procurement: 5
- event: 51
- case_or_customer: 54
- changelog_or_release: 2
- pricing_change: 1
- supporting_article: 3
- repo_readme_or_index: 1
- official_index_or_directory: 8
- community_feedback: 1
- research_or_report: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 9
- 成熟信号 (mature-commercial-signal): 13
- 开发者生态信号 (developer-ecosystem-signal): 26
- 技术迭代信号 (technical-iteration-signal): 38
- 资本市场信号 (capital-market-signal): 5
- AI Hardware investment and financing (ai-hardware-investment-signal): 4
- targeted-pool-gap-refill (targeted-pool-gap-refill): 17
- uncategorized (uncategorized): 11
- 外围探索信号 (outside-core-exploration): 3
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 1

## Keyword Group Distribution

- early-direction-signal: 8
- mature-commercial-signal: 12
- developer-ecosystem-signal: 30
- technical-iteration-signal: 37
- capital-market-signal: 4
- ai-hardware-investment-signal: 4
- targeted-pool-gap-refill: 17
- uncategorized: 11
- outside-core-exploration: 3
- enterprise-ai-implementation-signal: 1

## Keyword Search Path Distribution

- procurement_marketplace: 2
- official_original: 20
- ai_hardware_original: 3
- developer_ecosystem: 5
- capital_startup: 5
- industry_landing: 7
- a_media_gdelt: 4

## Keyword Search Intent Distribution

- find_startups: 12
- find_original_source: 18
- find_customer_case: 12
- find_market_trend: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
