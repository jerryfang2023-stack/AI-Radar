# 2026-05-23 Guanlan Daily Monitor Log

- generated_at: 2026-05-23T04:13:33.757Z
- raw_count: 120
- aihot_mode: daily+all
- aihot_since: 2026-05-22T04:03:55.164Z
- aihot_discovered_count: 188
- aihot_daily_discovered_count: 28
- aihot_all_discovered_count: 160
- aihot_daily_included_count: 28
- aihot_daily_pool_count: 28
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 42
- external_search_activated: true
- aihot_count: 32
- keyword_search_count: 68
- keyword_search_non_community_count: 64
- keyword_search_path_distribution: official_original=13; procurement_marketplace=13; capital_startup=11; developer_ecosystem=10; industry_landing=9; a_media_gdelt=8; community_feedback=4
- keyword_search_intent_distribution: find_startups=38; find_original_source=15; find_market_trend=8; find_user_feedback=4; find_customer_case=3
- follow_builders_count: 11
- source_distribution: keyword-search=68; aihot=32; follow-builders=11; gdelt=9
- raw_count_by_channel: keyword-search=68; aihot=32; follow-builders=11; gdelt=9
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: mature-commercial-signal=40; technical-iteration-signal=27; developer-ecosystem-signal=22; early-direction-signal=19; uncategorized=9; outside-core-exploration=2; capital-market-signal=1
- theme_distribution: mature-commercial-signal=44; technical-iteration-signal=29; early-direction-signal=23; developer-ecosystem-signal=12; uncategorized=9; outside-core-exploration=2; capital-market-signal=1
- theme_concentration_warning: none
- source_level_distribution: B=79; S=15; A=13; C=13
- evidence_object_type_distribution: case_or_customer=49; event=23; official_index_or_directory=23; community_feedback=7; supporting_article=7; search_result_or_tool_directory=3; changelog_or_release=2; event_on_official_page=2; regulatory_or_procurement=2; repo_readme_or_index=2
- pool_route_distribution: core_pool=36; index_only=30; discard=27; watchlist=27; emerging_pool=26
- pool_index_route_distribution: index_only=28; core_pool=11; emerging_pool=7; watchlist=4
- pool_index_count: 43
- routed_pool_count: 15
- non_core_pool_count: 4
- index_only_pool_count: 28
- aihot_index_only_count: 28
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 43
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 17 result(s): job_or_salary_page=11; noise_term:definition=2; noise_term:translation=2; noise_term:avatar=1; noise_term:dictionary=1; NewsAPI fallback for query "AI Agent funding enterprise customers": fetch failed; NewsAPI fallback for query "pre-seed AI startup vertical AI design partner": fetch failed; NewsAPI fallback for query "model release inference cost reduction enterprise adoption": fetch failed
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=65; news=13; builder=11; developer=10; official=10; industry=5; marketplace=3; community=2; product=1
- front_signal_sab_source_count: S=1; A=1; B=9; total=11
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=38; no-url-summary-only=28; fetched-readable-text-main=22; fetched-readable-text-content-container=12; blocked-http-403=10; http-404-fallback-text=7; fetched-readable-text-article=3
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 13
- B: 79
- S: 15
- C: 13

## Evidence Object Type Distribution

- case_or_customer: 49
- event: 23
- changelog_or_release: 2
- event_on_official_page: 2
- repo_readme_or_index: 2
- regulatory_or_procurement: 2
- community_feedback: 7
- supporting_article: 7
- official_index_or_directory: 23
- search_result_or_tool_directory: 3

## Theme Distribution

- 早期信号 (early-direction-signal): 23
- 技术迭代信号 (technical-iteration-signal): 29
- 成熟信号 (mature-commercial-signal): 44
- 开发者生态信号 (developer-ecosystem-signal): 12
- uncategorized (uncategorized): 9
- 外围探索信号 (outside-core-exploration): 2
- ?????? (capital-market-signal): 1

## Keyword Group Distribution

- early-direction-signal: 19
- technical-iteration-signal: 27
- mature-commercial-signal: 40
- developer-ecosystem-signal: 22
- uncategorized: 9
- outside-core-exploration: 2
- capital-market-signal: 1

## Keyword Search Path Distribution

- a_media_gdelt: 8
- capital_startup: 11
- official_original: 13
- procurement_marketplace: 13
- developer_ecosystem: 10
- industry_landing: 9
- community_feedback: 4

## Keyword Search Intent Distribution

- find_market_trend: 8
- find_startups: 38
- find_original_source: 15
- find_customer_case: 3
- find_user_feedback: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; follow-builders is fully scanned and fully written into the frontier-opinion library; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
