# 2026-06-14 Guanlan Daily Monitor Log

- generated_at: 2026-06-14T04:27:51.757Z
- raw_count: 188
- aihot_mode: daily+all
- aihot_since: 2026-06-13T04:21:11.248Z
- aihot_discovered_count: 204
- aihot_daily_discovered_count: 11
- aihot_all_discovered_count: 193
- aihot_daily_included_count: 11
- aihot_daily_pool_count: 11
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 32
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 2743
- historical_duplicates_removed_before_fetch: 203
- historical_duplicates_removed_after_fetch: 2
- raw_dedupe_buffer: 40
- aihot_count: 159
- keyword_search_count: 24
- keyword_search_non_community_count: 24
- keyword_search_path_distribution: a_media_gdelt=6; procurement_marketplace=5; developer_ecosystem=4; official_original=4; capital_startup=3; industry_landing=2
- keyword_search_intent_distribution: find_startups=8; find_market_trend=6; find_customer_case=5; find_original_source=5
- source_distribution: aihot=159; keyword-search=24; gdelt=5
- raw_count_by_channel: aihot=159; keyword-search=24; gdelt=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=66; developer-ecosystem-signal=53; outside-core-exploration=33; mature-commercial-signal=24; early-direction-signal=8; capital-market-signal=4
- theme_distribution: technical-iteration-signal=66; developer-ecosystem-signal=49; outside-core-exploration=33; mature-commercial-signal=25; early-direction-signal=11; capital-market-signal=4
- theme_concentration_warning: none
- source_level_distribution: C=92; B=74; A=19; S=3
- evidence_object_type_distribution: event=76; community_feedback=46; case_or_customer=18; regulatory_or_procurement=17; official_index_or_directory=9; research_or_report=7; supporting_article=5; changelog_or_release=4; repo_readme_or_index=3; pricing_change=2; search_result_or_tool_directory=1
- pool_route_distribution: index_only=83; watchlist=71; user_feedback_pool=54; emerging_pool=42; core_pool=26; discard=5
- pool_index_route_distribution: watchlist=40; user_feedback_pool=30; index_only=29; emerging_pool=28; core_pool=23
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 66
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 43
- index_only_pool_count: 29
- aihot_index_only_count: 11
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5; important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 8 result(s): missing_ai_anchor_in_result=6; directory_or_search_page=1; job_or_salary_page=1; Historical Raw dedupe removed 2 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.; RSS microsoft-ai-blog: HTTP 410; RSS import-ai-newsletter: HTTP 403
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: community=92; web=64; media=11; developer=8; news=8; industry=2; builder=1; funding=1; official=1
- front_signal_sab_source_count: S=0; A=8; B=5; total=13
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=99; fetched-readable-text-body-visible-text=28; fetched-readable-text-content-container=28; no-url-summary-only=11; fetched-readable-text-json-ld=8; fetched-readable-text-article=3; summary-only-low-readable-body=3; blocked-http-403=2; fetched-readable-text-meta-description=2; http-404-fallback-text=2; blocked-http-401=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 92
- S: 3
- A: 19
- B: 74

## Evidence Object Type Distribution

- event: 76
- case_or_customer: 18
- community_feedback: 46
- regulatory_or_procurement: 17
- repo_readme_or_index: 3
- changelog_or_release: 4
- pricing_change: 2
- supporting_article: 5
- research_or_report: 7
- search_result_or_tool_directory: 1
- official_index_or_directory: 9

## Theme Distribution

- 技术迭代信号 (technical-iteration-signal): 66
- 开发者生态信号 (developer-ecosystem-signal): 49
- 外围探索信号 (outside-core-exploration): 33
- 资本市场信号 (capital-market-signal): 4
- 成熟信号 (mature-commercial-signal): 25
- 早期信号 (early-direction-signal): 11

## Keyword Group Distribution

- technical-iteration-signal: 66
- developer-ecosystem-signal: 53
- outside-core-exploration: 33
- capital-market-signal: 4
- mature-commercial-signal: 24
- early-direction-signal: 8

## Keyword Search Path Distribution

- procurement_marketplace: 5
- developer_ecosystem: 4
- a_media_gdelt: 6
- official_original: 4
- industry_landing: 2
- capital_startup: 3

## Keyword Search Intent Distribution

- find_startups: 8
- find_market_trend: 6
- find_customer_case: 5
- find_original_source: 5

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
