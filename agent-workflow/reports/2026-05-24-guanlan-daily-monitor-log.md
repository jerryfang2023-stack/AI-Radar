# 2026-05-24 Guanlan Daily Monitor Log

- generated_at: 2026-05-24T04:09:11.217Z
- raw_count: 80
- aihot_mode: daily+all
- aihot_since: 2026-05-23T04:04:35.676Z
- aihot_discovered_count: 135
- aihot_daily_discovered_count: 12
- aihot_all_discovered_count: 123
- aihot_daily_included_count: 12
- aihot_daily_pool_count: 12
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 32
- external_search_activated: true
- aihot_count: 20
- keyword_search_count: 42
- keyword_search_non_community_count: 38
- keyword_search_path_distribution: capital_startup=8; developer_ecosystem=7; industry_landing=7; procurement_marketplace=7; official_original=6; community_feedback=4; a_media_gdelt=3
- keyword_search_intent_distribution: find_startups=35; find_user_feedback=4; find_market_trend=3
- follow_builders_count: 13
- source_distribution: keyword-search=42; aihot=20; follow-builders=13; gdelt=5
- raw_count_by_channel: keyword-search=42; aihot=20; follow-builders=13; gdelt=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: mature-commercial-signal=42; developer-ecosystem-signal=12; uncategorized=12; technical-iteration-signal=10; early-direction-signal=3; outside-core-exploration=1
- theme_distribution: mature-commercial-signal=49; uncategorized=12; technical-iteration-signal=10; developer-ecosystem-signal=5; early-direction-signal=3; outside-core-exploration=1
- theme_concentration_warning: warning: 成熟信号 concentration 61.3% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- source_level_distribution: B=48; C=19; A=7; S=6
- evidence_object_type_distribution: case_or_customer=27; event=23; community_feedback=8; official_index_or_directory=6; changelog_or_release=3; event_on_official_page=3; regulatory_or_procurement=3; supporting_article=3; search_result_or_tool_directory=2; repo_readme_or_index=1; research_or_report=1
- pool_route_distribution: core_pool=30; discard=24; emerging_pool=22; watchlist=14; index_only=12; user_feedback_pool=1
- pool_index_route_distribution: core_pool=25; emerging_pool=19; index_only=12; watchlist=3
- pool_index_count: 40
- routed_pool_count: 28
- non_core_pool_count: 3
- index_only_pool_count: 12
- aihot_index_only_count: 12
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 40
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 5 result(s): job_or_salary_page=4; noise_term:avatar=1; NewsAPI fallback for query "AI Agent funding enterprise customers": fetch failed
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=36; builder=13; developer=7; news=7; community=6; industry=5; marketplace=4; official=1; product=1
- front_signal_sab_source_count: S=3; A=1; B=18; total=22
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=31; fetched-readable-text-main=17; no-url-summary-only=12; fetched-readable-text-content-container=11; blocked-http-403=4; http-404-fallback-text=3; fetched-readable-text-article=2
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 48
- A: 7
- S: 6
- C: 19

## Evidence Object Type Distribution

- case_or_customer: 27
- event: 23
- event_on_official_page: 3
- changelog_or_release: 3
- regulatory_or_procurement: 3
- supporting_article: 3
- community_feedback: 8
- official_index_or_directory: 6
- repo_readme_or_index: 1
- search_result_or_tool_directory: 2
- research_or_report: 1

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 5
- 成熟信号 (mature-commercial-signal): 49
- uncategorized (uncategorized): 12
- 技术迭代信号 (technical-iteration-signal): 10
- 早期信号 (early-direction-signal): 3
- 外围探索信号 (outside-core-exploration): 1

## Keyword Group Distribution

- developer-ecosystem-signal: 12
- mature-commercial-signal: 42
- uncategorized: 12
- technical-iteration-signal: 10
- early-direction-signal: 3
- outside-core-exploration: 1

## Keyword Search Path Distribution

- official_original: 6
- capital_startup: 8
- industry_landing: 7
- procurement_marketplace: 7
- developer_ecosystem: 7
- a_media_gdelt: 3
- community_feedback: 4

## Keyword Search Intent Distribution

- find_startups: 35
- find_market_trend: 3
- find_user_feedback: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; follow-builders is fully scanned and fully written into the frontier-opinion library; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
