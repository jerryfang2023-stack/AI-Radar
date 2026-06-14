# 2026-06-14 Guanlan Daily Monitor Log

- generated_at: 2026-06-14T08:10:01.018Z
- raw_count: 187
- aihot_mode: daily+all
- aihot_since: 2026-06-13T08:01:38.905Z
- aihot_discovered_count: 190
- aihot_daily_discovered_count: 11
- aihot_all_discovered_count: 179
- aihot_daily_included_count: 11
- aihot_daily_pool_count: 11
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 30
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 2743
- historical_duplicates_removed_before_fetch: 196
- historical_duplicates_removed_after_fetch: 3
- raw_dedupe_buffer: 40
- aihot_count: 152
- keyword_search_count: 23
- keyword_search_non_community_count: 23
- keyword_search_path_distribution: procurement_marketplace=8; a_media_gdelt=6; developer_ecosystem=4; official_original=3; capital_startup=2
- keyword_search_intent_distribution: find_startups=7; find_market_trend=6; find_customer_case=5; find_original_source=5
- source_distribution: aihot=152; keyword-search=23; gdelt=8; rss-feed=4
- raw_count_by_channel: aihot=152; keyword-search=23; gdelt=8; rss-feed=4
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=69; developer-ecosystem-signal=48; outside-core-exploration=32; mature-commercial-signal=21; early-direction-signal=11; capital-market-signal=6
- theme_distribution: technical-iteration-signal=70; developer-ecosystem-signal=46; outside-core-exploration=32; mature-commercial-signal=21; early-direction-signal=12; capital-market-signal=6
- theme_concentration_warning: none
- source_level_distribution: C=91; B=70; A=21; S=5
- evidence_object_type_distribution: event=76; community_feedback=44; case_or_customer=19; regulatory_or_procurement=16; official_index_or_directory=9; research_or_report=7; supporting_article=7; changelog_or_release=3; pricing_change=2; repo_readme_or_index=2; search_result_or_tool_directory=2
- pool_route_distribution: index_only=78; watchlist=76; user_feedback_pool=53; emerging_pool=41; core_pool=22; discard=8
- pool_index_route_distribution: watchlist=47; user_feedback_pool=30; emerging_pool=28; index_only=27; core_pool=18
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 68
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 50
- index_only_pool_count: 27
- aihot_index_only_count: 11
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5; important_funding=3/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 6 result(s): missing_ai_anchor_in_result=4; directory_or_search_page=1; job_or_salary_page=1; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.; RSS microsoft-ai-blog: HTTP 410; RSS import-ai-newsletter: HTTP 403; RSS tigera-blog: HTTP 415
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: community=91; web=60; news=11; media=10; developer=7; builder=2; product=2; industry=1; marketplace=1; newsletter=1; official=1
- front_signal_sab_source_count: S=0; A=7; B=5; total=12
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=95; fetched-readable-text-content-container=31; fetched-readable-text-body-visible-text=25; fetched-readable-text-json-ld=11; no-url-summary-only=11; summary-only-low-readable-body=6; http-404-fallback-text=3; blocked-http-401=2; blocked-http-403=1; fetched-readable-text-article=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 91
- S: 5
- A: 21
- B: 70

## Evidence Object Type Distribution

- event: 76
- case_or_customer: 19
- community_feedback: 44
- regulatory_or_procurement: 16
- changelog_or_release: 3
- repo_readme_or_index: 2
- research_or_report: 7
- supporting_article: 7
- search_result_or_tool_directory: 2
- pricing_change: 2
- official_index_or_directory: 9

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 70
- 外围探索信号 (outside-core-exploration): 32
- 开发者生态信号 (developer-ecosystem-signal): 46
- 资本市场信号 (capital-market-signal): 6
- 成熟信号 (mature-commercial-signal): 21
- 早期信号 (early-direction-signal): 12

## Keyword Group Distribution

- technical-iteration-signal: 69
- outside-core-exploration: 32
- developer-ecosystem-signal: 48
- capital-market-signal: 6
- mature-commercial-signal: 21
- early-direction-signal: 11

## Keyword Search Path Distribution

- procurement_marketplace: 8
- a_media_gdelt: 6
- official_original: 3
- developer_ecosystem: 4
- capital_startup: 2

## Keyword Search Intent Distribution

- find_startups: 7
- find_market_trend: 6
- find_customer_case: 5
- find_original_source: 5

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
