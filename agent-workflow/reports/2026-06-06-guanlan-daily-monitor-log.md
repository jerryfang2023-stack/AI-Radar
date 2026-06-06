# 2026-06-06 Guanlan Daily Monitor Log

- generated_at: 2026-06-06T05:51:13.207Z
- raw_count: 115
- aihot_mode: daily+all
- aihot_since: 2026-06-05T05:39:56.374Z
- aihot_discovered_count: 330
- aihot_daily_discovered_count: 30
- aihot_all_discovered_count: 300
- aihot_daily_included_count: 30
- aihot_daily_pool_count: 29
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 56
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 1334
- historical_duplicates_removed_before_fetch: 120
- historical_duplicates_removed_after_fetch: 5
- raw_dedupe_buffer: 40
- aihot_count: 67
- keyword_search_count: 30
- keyword_search_non_community_count: 29
- keyword_search_path_distribution: a_media_gdelt=9; developer_ecosystem=9; capital_startup=4; official_original=3; industry_landing=2; procurement_marketplace=2; community_feedback=1
- keyword_search_intent_distribution: find_startups=10; find_market_trend=9; find_customer_case=5; find_original_source=5; find_user_feedback=1
- follow_builders_count: 4
- source_distribution: aihot=67; keyword-search=30; gdelt=14; follow-builders=4
- raw_count_by_channel: aihot=67; keyword-search=30; gdelt=14; follow-builders=4
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=36; mature-commercial-signal=29; technical-iteration-signal=28; early-direction-signal=20; outside-core-exploration=2
- theme_distribution: developer-ecosystem-signal=33; mature-commercial-signal=31; technical-iteration-signal=29; early-direction-signal=20; outside-core-exploration=2
- theme_concentration_warning: none
- source_level_distribution: B=66; C=20; S=19; A=10
- evidence_object_type_distribution: event=41; official_index_or_directory=27; case_or_customer=18; community_feedback=16; regulatory_or_procurement=5; supporting_article=3; changelog_or_release=2; research_or_report=2; ecosystem_package_or_model_index=1
- pool_route_distribution: core_pool=47; index_only=30; watchlist=28; emerging_pool=15; discard=10; user_feedback_pool=6
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
- failed_sources: keyword-search pre-gate filtered 7 result(s): missing_ai_anchor_in_result=6; job_or_salary_page=1; Historical Raw dedupe removed 17 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 1 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=55; community=16; official=15; developer=7; news=6; builder=4; industry=4; media=4; domestic_vendor=2; product=2
- front_signal_sab_source_count: S=4; A=2; B=8; total=14
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: no-url-summary-only=29; summary-only-low-readable-body=28; fetched-readable-text-main=19; fetched-readable-text-content-container=14; blocked-http-403=7; fetched-readable-text-body-visible-text=7; fetched-readable-text-json-ld=6; blocked-http-401=2; fetched-readable-text-meta-description=2; fetched-readable-text-article=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 66
- S: 19
- A: 10
- C: 20

## Evidence Object Type Distribution

- community_feedback: 16
- regulatory_or_procurement: 5
- case_or_customer: 18
- changelog_or_release: 2
- event: 41
- research_or_report: 2
- supporting_article: 3
- official_index_or_directory: 27
- ecosystem_package_or_model_index: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 20
- 技术迭代信号 (technical-iteration-signal): 29
- 开发者生态信号 (developer-ecosystem-signal): 33
- 成熟信号 (mature-commercial-signal): 31
- 外围探索信号 (outside-core-exploration): 2

## Keyword Group Distribution

- early-direction-signal: 20
- technical-iteration-signal: 28
- developer-ecosystem-signal: 36
- mature-commercial-signal: 29
- outside-core-exploration: 2

## Keyword Search Path Distribution

- a_media_gdelt: 9
- procurement_marketplace: 2
- industry_landing: 2
- developer_ecosystem: 9
- capital_startup: 4
- official_original: 3
- community_feedback: 1

## Keyword Search Intent Distribution

- find_market_trend: 9
- find_startups: 10
- find_original_source: 5
- find_customer_case: 5
- find_user_feedback: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; follow-builders is fully scanned and fully written into the frontier-opinion library; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
