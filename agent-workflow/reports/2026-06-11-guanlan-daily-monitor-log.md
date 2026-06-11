# 2026-06-11 Guanlan Daily Monitor Log

- generated_at: 2026-06-11T01:29:53.094Z
- raw_count: 183
- aihot_mode: daily+all
- aihot_since: 2026-06-10T01:23:41.615Z
- aihot_discovered_count: 397
- aihot_daily_discovered_count: 28
- aihot_all_discovered_count: 369
- aihot_daily_included_count: 28
- aihot_daily_pool_count: 28
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 79
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 2187
- historical_duplicates_removed_before_fetch: 194
- historical_duplicates_removed_after_fetch: 7
- raw_dedupe_buffer: 40
- aihot_count: 156
- keyword_search_count: 21
- keyword_search_non_community_count: 21
- keyword_search_path_distribution: a_media_gdelt=7; industry_landing=4; procurement_marketplace=4; capital_startup=3; developer_ecosystem=2; official_original=1
- keyword_search_intent_distribution: find_startups=9; find_market_trend=7; find_customer_case=2; find_original_source=2; find_workflow_change=1
- source_distribution: aihot=156; keyword-search=21; gdelt=6
- raw_count_by_channel: aihot=156; keyword-search=21; gdelt=6
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=57; technical-iteration-signal=56; mature-commercial-signal=31; early-direction-signal=18; outside-core-exploration=17; capital-market-signal=4
- theme_distribution: developer-ecosystem-signal=56; technical-iteration-signal=56; mature-commercial-signal=32; early-direction-signal=18; outside-core-exploration=17; capital-market-signal=4
- theme_concentration_warning: none
- source_level_distribution: B=78; C=70; A=18; S=17
- evidence_object_type_distribution: event=94; case_or_customer=34; official_index_or_directory=23; community_feedback=16; pricing_change=5; regulatory_or_procurement=3; event_on_official_page=2; research_or_report=2; supporting_article=2; changelog_or_release=1; repo_readme_or_index=1
- pool_route_distribution: core_pool=82; user_feedback_pool=64; index_only=52; emerging_pool=43; watchlist=17; discard=7
- pool_index_route_distribution: user_feedback_pool=32; core_pool=31; index_only=28; emerging_pool=24; watchlist=8
- pool_index_count: 88
- pool_target: 75
- routed_pool_count: 60
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 29
- index_only_pool_count: 28
- aihot_index_only_count: 28
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 88
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 13 result(s): missing_ai_anchor_in_result=10; noise_term:hiring=2; job_or_salary_page=1; Historical Raw dedupe removed 2 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 5 duplicate provider hits before Raw selection.; RSS microsoft-ai-blog: HTTP 410; RSS import-ai-newsletter: HTTP 403
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=73; community=70; news=10; official=9; media=8; developer=4; product=4; domestic_vendor=3; builder=1; funding=1
- front_signal_sab_source_count: S=2; A=4; B=7; total=13
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=69; fetched-readable-text-body-visible-text=28; fetched-readable-text-content-container=28; no-url-summary-only=28; fetched-readable-text-json-ld=12; blocked-http-403=6; fetched-readable-text-article=4; http-404-fallback-text=3; summary-only-low-readable-body=3; fetched-readable-text-meta-description=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 18
- C: 70
- B: 78
- S: 17

## Evidence Object Type Distribution

- event: 94
- case_or_customer: 34
- community_feedback: 16
- changelog_or_release: 1
- research_or_report: 2
- regulatory_or_procurement: 3
- pricing_change: 5
- supporting_article: 2
- repo_readme_or_index: 1
- official_index_or_directory: 23
- event_on_official_page: 2

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 32
- 早期信号 (early-direction-signal): 18
- 外围探索信号 (outside-core-exploration): 17
- 技术迭代信号 (technical-iteration-signal): 56
- 开发者生态信号 (developer-ecosystem-signal): 56
- 资本市场信号 (capital-market-signal): 4

## Keyword Group Distribution

- mature-commercial-signal: 31
- early-direction-signal: 18
- outside-core-exploration: 17
- technical-iteration-signal: 56
- developer-ecosystem-signal: 57
- capital-market-signal: 4

## Keyword Search Path Distribution

- procurement_marketplace: 4
- a_media_gdelt: 7
- industry_landing: 4
- official_original: 1
- capital_startup: 3
- developer_ecosystem: 2

## Keyword Search Intent Distribution

- find_startups: 9
- find_market_trend: 7
- find_workflow_change: 1
- find_original_source: 2
- find_customer_case: 2

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
