# 2026-06-10 Guanlan Daily Monitor Log

- generated_at: 2026-06-10T02:25:37.893Z
- raw_count: 185
- aihot_mode: daily+all
- aihot_since: 2026-06-09T02:18:53.528Z
- aihot_discovered_count: 444
- aihot_daily_discovered_count: 30
- aihot_all_discovered_count: 414
- aihot_daily_included_count: 30
- aihot_daily_pool_count: 29
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 77
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 2002
- historical_duplicates_removed_before_fetch: 201
- historical_duplicates_removed_after_fetch: 5
- raw_dedupe_buffer: 40
- aihot_count: 163
- keyword_search_count: 16
- keyword_search_non_community_count: 16
- keyword_search_path_distribution: industry_landing=5; a_media_gdelt=4; capital_startup=2; official_original=2; procurement_marketplace=2; developer_ecosystem=1
- keyword_search_intent_distribution: find_startups=8; find_market_trend=4; find_workflow_change=2; find_customer_case=1; find_original_source=1
- source_distribution: aihot=163; keyword-search=16; gdelt=6
- raw_count_by_channel: aihot=163; keyword-search=16; gdelt=6
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=79; developer-ecosystem-signal=45; mature-commercial-signal=30; outside-core-exploration=18; early-direction-signal=11; capital-market-signal=2
- theme_distribution: technical-iteration-signal=79; developer-ecosystem-signal=44; mature-commercial-signal=31; outside-core-exploration=18; early-direction-signal=11; capital-market-signal=2
- theme_concentration_warning: warning: 技术迭代信号 concentration 42.7% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- source_level_distribution: C=85; B=74; A=13; S=13
- evidence_object_type_distribution: event=101; case_or_customer=21; community_feedback=21; official_index_or_directory=21; regulatory_or_procurement=5; changelog_or_release=4; pricing_change=4; supporting_article=4; event_on_official_page=3; research_or_report=1
- pool_route_distribution: core_pool=82; user_feedback_pool=72; index_only=54; emerging_pool=32; watchlist=16; discard=6
- pool_index_route_distribution: user_feedback_pool=36; core_pool=30; index_only=29; emerging_pool=12; watchlist=4
- pool_index_count: 89
- pool_target: 75
- routed_pool_count: 60
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 30
- index_only_pool_count: 29
- aihot_index_only_count: 29
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 89
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 11 result(s): missing_ai_anchor_in_result=7; job_or_salary_page=2; noise_term:compensation=1; noise_term:hiring=1; Search cross-entry dedupe removed 5 duplicate provider hits before Raw selection.; RSS import-ai-newsletter: HTTP 403
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: community=85; web=66; official=10; news=7; developer=6; media=6; marketplace=2; product=2; funding=1
- front_signal_sab_source_count: S=0; A=6; B=12; total=18
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=95; no-url-summary-only=29; fetched-readable-text-content-container=22; fetched-readable-text-body-visible-text=16; fetched-readable-text-json-ld=9; blocked-http-403=6; summary-only-low-readable-body=5; fetched-readable-text-article=3
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 85
- A: 13
- B: 74
- S: 13

## Evidence Object Type Distribution

- event: 101
- case_or_customer: 21
- changelog_or_release: 4
- community_feedback: 21
- pricing_change: 4
- regulatory_or_procurement: 5
- supporting_article: 4
- official_index_or_directory: 21
- event_on_official_page: 3
- research_or_report: 1

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 18
- 早期信号 (early-direction-signal): 11
- 成熟信号 (mature-commercial-signal): 31
- 技术迭代信号 (technical-iteration-signal): 79
- 开发者生态信号 (developer-ecosystem-signal): 44
- 资本市场信号 (capital-market-signal): 2

## Keyword Group Distribution

- outside-core-exploration: 18
- early-direction-signal: 11
- mature-commercial-signal: 30
- technical-iteration-signal: 79
- developer-ecosystem-signal: 45
- capital-market-signal: 2

## Keyword Search Path Distribution

- developer_ecosystem: 1
- industry_landing: 5
- procurement_marketplace: 2
- a_media_gdelt: 4
- official_original: 2
- capital_startup: 2

## Keyword Search Intent Distribution

- find_startups: 8
- find_workflow_change: 2
- find_market_trend: 4
- find_original_source: 1
- find_customer_case: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
