# 2026-07-04 Guanlan Daily Monitor Log

- generated_at: 2026-07-04T04:50:51.771Z
- raw_count: 231
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 15
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 6346
- historical_duplicates_removed_before_fetch: 211
- historical_duplicates_removed_after_fetch: 59
- raw_dedupe_buffer: 140
- aihot_count: 139
- keyword_search_count: 12
- keyword_search_non_community_count: 12
- keyword_search_path_distribution: developer_ecosystem=5; capital_startup=4; procurement_marketplace=2; industry_landing=1
- keyword_search_intent_distribution: find_startups=7; find_original_source=4; find_customer_case=1
- source_distribution: aihot=139; rss-feed=80; keyword-search=12
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 52
- enterprise_ai_transformation_stage_distribution: platform_enablement=37; pilot=7; production_rollout=5; org_build=3
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=139; rss-feed=80; keyword-search=12
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=59; uncategorized=58; early-direction-signal=38; developer-ecosystem-signal=32; outside-core-exploration=23; mature-commercial-signal=20; enterprise-ai-implementation-signal=1
- theme_distribution: technical-iteration-signal=61; uncategorized=58; early-direction-signal=39; developer-ecosystem-signal=29; outside-core-exploration=23; mature-commercial-signal=20; enterprise-ai-implementation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=75; case_or_customer=42; community_feedback=41; official_index_or_directory=28; research_or_report=13; supporting_article=12; changelog_or_release=6; event_on_official_page=4; search_result_or_tool_directory=4; regulatory_or_procurement=3; low_quality_chinese_official_or_seo=1; pricing_change=1; repo_readme_or_index=1
- pool_route_distribution: discard=104; watchlist=48; index_only=46; core_pool=33; emerging_pool=14; user_feedback_pool=3
- pool_index_route_distribution: watchlist=48; index_only=46; core_pool=33; emerging_pool=14; user_feedback_pool=3
- pool_index_count: 127
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 81
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 48
- index_only_pool_count: 46
- aihot_index_only_count: 15
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 127
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 12 result(s): missing_ai_anchor_in_result=7; job_or_salary_page=2; noise_term:career=1; noise_term:hiring=1; noise_term:jobs at=1; source-artifact rss: RSS latent-space-podcast: fetch failed; source-artifact rss: RSS training-data-podcast: fetch failed; source-artifact rss: RSS mad-podcast: fetch failed; source-artifact rss: RSS ai-and-i-podcast: fetch failed; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_case=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=85; operators=74; product=16; builder=14; media=13; developer=8; news=8; analysis=7; official=2; domestic_vendor=1; industry=1; marketplace=1; newsletter=1
- front_signal_sab_source_count: S=1; A=3; B=9; total=13
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=72; fetched-readable-text-content-container=37; no-url-summary-only=37; fetched-readable-text-main=26; summary-only-low-readable-body=19; fetched-readable-text-body-visible-text=18; fetched-readable-text-json-ld=11; fetched-readable-text-article=5; http-429-fallback-text=3; blocked-http-403=2; http-451-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 21
- B: 109
- S: 27
- C: 74

## Evidence Object Type Distribution

- research_or_report: 13
- case_or_customer: 42
- changelog_or_release: 6
- event: 75
- repo_readme_or_index: 1
- search_result_or_tool_directory: 4
- regulatory_or_procurement: 3
- supporting_article: 12
- community_feedback: 41
- pricing_change: 1
- official_index_or_directory: 28
- event_on_official_page: 4
- low_quality_chinese_official_or_seo: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 39
- 技术迭代信号 (technical-iteration-signal): 61
- 开发者生态信号 (developer-ecosystem-signal): 29
- 成熟信号 (mature-commercial-signal): 20
- uncategorized (uncategorized): 58
- 外围探索信号 (outside-core-exploration): 23
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 1

## Keyword Group Distribution

- early-direction-signal: 38
- technical-iteration-signal: 59
- developer-ecosystem-signal: 32
- mature-commercial-signal: 20
- uncategorized: 58
- outside-core-exploration: 23
- enterprise-ai-implementation-signal: 1

## Keyword Search Path Distribution

- capital_startup: 4
- developer_ecosystem: 5
- procurement_marketplace: 2
- industry_landing: 1

## Keyword Search Intent Distribution

- find_original_source: 4
- find_customer_case: 1
- find_startups: 7

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
