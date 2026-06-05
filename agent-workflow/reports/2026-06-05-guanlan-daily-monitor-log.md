# 2026-06-05 Guanlan Daily Monitor Log

- generated_at: 2026-06-05T00:46:23.358Z
- raw_count: 111
- aihot_mode: daily+all
- aihot_since: 2026-06-04T00:38:26.287Z
- aihot_discovered_count: 359
- aihot_daily_discovered_count: 29
- aihot_all_discovered_count: 330
- aihot_daily_included_count: 29
- aihot_daily_pool_count: 29
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 66
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 1223
- historical_duplicates_removed_before_fetch: 118
- historical_duplicates_removed_after_fetch: 9
- raw_dedupe_buffer: 40
- aihot_count: 50
- keyword_search_count: 32
- keyword_search_non_community_count: 32
- keyword_search_path_distribution: developer_ecosystem=12; industry_landing=7; official_original=5; a_media_gdelt=4; procurement_marketplace=3; capital_startup=1
- keyword_search_intent_distribution: find_startups=10; find_customer_case=8; find_original_source=6; find_market_trend=4; find_workflow_change=4
- follow_builders_count: 5
- source_distribution: aihot=50; keyword-search=32; gdelt=24; follow-builders=5
- raw_count_by_channel: aihot=50; keyword-search=32; gdelt=24; follow-builders=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=34; mature-commercial-signal=29; technical-iteration-signal=27; early-direction-signal=14; outside-core-exploration=5; capital-market-signal=2
- theme_distribution: developer-ecosystem-signal=32; mature-commercial-signal=29; technical-iteration-signal=29; early-direction-signal=14; outside-core-exploration=5; capital-market-signal=2
- theme_concentration_warning: none
- source_level_distribution: B=68; S=22; C=15; A=6
- evidence_object_type_distribution: case_or_customer=34; event=27; official_index_or_directory=25; community_feedback=9; regulatory_or_procurement=4; changelog_or_release=3; event_on_official_page=2; research_or_report=2; supporting_article=2; pricing_change=1; repo_readme_or_index=1; search_result_or_tool_directory=1
- pool_route_distribution: core_pool=58; index_only=34; emerging_pool=19; watchlist=12; discard=7; user_feedback_pool=5
- pool_index_route_distribution: index_only=29; core_pool=15; emerging_pool=6; user_feedback_pool=2
- pool_index_count: 44
- routed_pool_count: 15
- non_core_pool_count: 0
- index_only_pool_count: 29
- aihot_index_only_count: 29
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 44
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 5 result(s): missing_ai_anchor_in_result=5; Historical Raw dedupe removed 23 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=59; official=17; community=10; developer=9; builder=5; media=5; product=2; industry=1; marketplace=1; news=1; research=1
- front_signal_sab_source_count: S=3; A=1; B=10; total=14
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: no-url-summary-only=29; fetched-readable-text-main=25; fetched-readable-text-content-container=23; summary-only-low-readable-body=12; blocked-http-403=7; fetched-readable-text-body-visible-text=7; fetched-readable-text-article=5; fetched-readable-text-meta-description=2; fetched-readable-text-json-ld=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 15
- A: 6
- S: 22
- B: 68

## Evidence Object Type Distribution

- event: 27
- repo_readme_or_index: 1
- changelog_or_release: 3
- case_or_customer: 34
- regulatory_or_procurement: 4
- pricing_change: 1
- community_feedback: 9
- supporting_article: 2
- research_or_report: 2
- official_index_or_directory: 25
- event_on_official_page: 2
- search_result_or_tool_directory: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 14
- 外围探索信号 (outside-core-exploration): 5
- 开发者生态信号 (developer-ecosystem-signal): 32
- 技术迭代信号 (technical-iteration-signal): 29
- 成熟信号 (mature-commercial-signal): 29
- ?????? (capital-market-signal): 2

## Keyword Group Distribution

- early-direction-signal: 14
- outside-core-exploration: 5
- developer-ecosystem-signal: 34
- technical-iteration-signal: 27
- mature-commercial-signal: 29
- capital-market-signal: 2

## Keyword Search Path Distribution

- developer_ecosystem: 12
- industry_landing: 7
- official_original: 5
- a_media_gdelt: 4
- capital_startup: 1
- procurement_marketplace: 3

## Keyword Search Intent Distribution

- find_startups: 10
- find_customer_case: 8
- find_workflow_change: 4
- find_market_trend: 4
- find_original_source: 6

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; follow-builders is fully scanned and fully written into the frontier-opinion library; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
