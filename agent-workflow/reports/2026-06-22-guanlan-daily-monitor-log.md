# 2026-06-22 Guanlan Daily Monitor Log

- generated_at: 2026-06-22T03:45:56.837Z
- raw_count: 184
- aihot_mode: daily+all
- aihot_since: 2026-06-21T03:32:56.206Z
- aihot_discovered_count: 136
- aihot_daily_discovered_count: 4
- aihot_all_discovered_count: 132
- aihot_daily_included_count: 4
- aihot_daily_pool_count: 4
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 32
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 4244
- historical_duplicates_removed_before_fetch: 4
- historical_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 40
- aihot_count: 103
- keyword_search_count: 35
- keyword_search_non_community_count: 34
- keyword_search_path_distribution: procurement_marketplace=9; developer_ecosystem=6; industry_landing=5; capital_startup=4; official_original=4; a_media_gdelt=3; fde_implementation=3; community_feedback=1
- keyword_search_intent_distribution: find_original_source=17; find_startups=10; find_customer_case=4; find_market_trend=3; find_user_feedback=1
- source_distribution: aihot=103; rss-feed=39; keyword-search=35; gdelt=7
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 47
- enterprise_ai_transformation_stage_distribution: platform_enablement=22; ai_transformation=8; pilot=8; production_rollout=7; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=103; rss-feed=39; keyword-search=35; gdelt=7
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=43; uncategorized=39; mature-commercial-signal=31; outside-core-exploration=29; developer-ecosystem-signal=23; early-direction-signal=11; capital-market-signal=5; enterprise-ai-implementation-signal=3
- theme_distribution: technical-iteration-signal=43; uncategorized=39; mature-commercial-signal=31; outside-core-exploration=29; developer-ecosystem-signal=20; early-direction-signal=14; capital-market-signal=5; enterprise-ai-implementation-signal=3
- theme_concentration_warning: none
- source_level_distribution: B=94; C=72; A=10; S=8
- evidence_object_type_distribution: community_feedback=49; event=42; case_or_customer=35; official_index_or_directory=29; supporting_article=9; regulatory_or_procurement=5; event_on_official_page=4; search_result_or_tool_directory=4; research_or_report=3; changelog_or_release=2; low_quality_chinese_official_or_seo=1; marketplace_listing=1
- pool_route_distribution: discard=119; watchlist=26; core_pool=18; index_only=17; emerging_pool=16; user_feedback_pool=8
- pool_index_route_distribution: discard=36; watchlist=26; core_pool=18; emerging_pool=16; index_only=11; user_feedback_pool=8
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 48
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 30
- index_only_pool_count: 11
- aihot_index_only_count: 4
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_funding=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 13 result(s): missing_ai_anchor_in_result=5; job_or_salary_page=4; noise_term:career=3; noise_term:hiring=1; Anysearch fallback for query "AI implementation customer engineering production deployment (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": fetch failed; RSS latent-space-podcast: fetch failed; RSS mad-podcast: fetch failed; RSS ai-and-i-podcast: fetch failed; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; core_pool=18/30; core_non_large=8/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=79; community=72; media=7; builder=5; official=4; product=4; developer=3; industry=2; marketplace=2; news=2; newsletter=2; analysis=1; research=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=85; no-url-summary-only=36; fetched-readable-text-main=18; fetched-readable-text-content-container=13; fetched-readable-text-body-visible-text=12; fetched-readable-text-json-ld=6; blocked-http-403=5; http-451-fallback-text=4; fetched-readable-text-article=2; summary-only-low-readable-body=2; fetched-readable-text-plain-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 10
- B: 94
- S: 8
- C: 72

## Evidence Object Type Distribution

- event: 42
- case_or_customer: 35
- regulatory_or_procurement: 5
- supporting_article: 9
- research_or_report: 3
- event_on_official_page: 4
- changelog_or_release: 2
- community_feedback: 49
- official_index_or_directory: 29
- marketplace_listing: 1
- low_quality_chinese_official_or_seo: 1
- search_result_or_tool_directory: 4

## Theme Distribution

- 外围探索信号 (outside-core-exploration): 29
- 开发者生态信号 (developer-ecosystem-signal): 20
- 技术迭代信号 (technical-iteration-signal): 43
- 早期信号 (early-direction-signal): 14
- 成熟信号 (mature-commercial-signal): 31
- uncategorized (uncategorized): 39
- 资本市场信号 (capital-market-signal): 5
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 3

## Keyword Group Distribution

- outside-core-exploration: 29
- developer-ecosystem-signal: 23
- technical-iteration-signal: 43
- early-direction-signal: 11
- mature-commercial-signal: 31
- uncategorized: 39
- capital-market-signal: 5
- enterprise-ai-implementation-signal: 3

## Keyword Search Path Distribution

- procurement_marketplace: 9
- industry_landing: 5
- developer_ecosystem: 6
- capital_startup: 4
- fde_implementation: 3
- official_original: 4
- a_media_gdelt: 3
- community_feedback: 1

## Keyword Search Intent Distribution

- find_startups: 10
- find_original_source: 17
- find_customer_case: 4
- find_market_trend: 3
- find_user_feedback: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
