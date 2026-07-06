# 2026-07-06 Guanlan Daily Monitor Log

- generated_at: 2026-07-06T02:21:27.207Z
- raw_count: 111
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 6
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 6932
- historical_duplicates_removed_before_fetch: 669
- historical_duplicates_removed_after_fetch: 235
- raw_dedupe_buffer: 180
- aihot_count: 37
- keyword_search_count: 63
- keyword_search_non_community_count: 63
- keyword_search_path_distribution: capital_startup=17; official_original=14; industry_landing=12; procurement_marketplace=6; developer_ecosystem=5; fde_implementation=5; a_media_gdelt=4
- keyword_search_intent_distribution: find_customer_case=29; find_original_source=14; find_startups=14; find_market_trend=4; find_workflow_change=2
- source_distribution: keyword-search=63; aihot=37; gdelt=11
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 66
- enterprise_ai_transformation_stage_distribution: production_rollout=19; platform_enablement=18; ai_transformation=15; pilot=7; procurement=5; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: keyword-search=63; aihot=37; gdelt=11
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: mature-commercial-signal=29; developer-ecosystem-signal=19; targeted-pool-gap-refill=16; technical-iteration-signal=15; early-direction-signal=10; outside-core-exploration=9; enterprise-ai-implementation-signal=8; capital-market-signal=5
- theme_distribution: mature-commercial-signal=31; developer-ecosystem-signal=16; targeted-pool-gap-refill=16; technical-iteration-signal=15; early-direction-signal=10; enterprise-ai-implementation-signal=9; outside-core-exploration=9; capital-market-signal=5
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=50; event=32; supporting_article=6; official_index_or_directory=5; regulatory_or_procurement=4; changelog_or_release=3; pricing_change=3; research_or_report=3; event_on_official_page=2; repo_readme_or_index=2; community_feedback=1
- pool_route_distribution: core_pool=42; watchlist=39; emerging_pool=24; index_only=21; discard=9; user_feedback_pool=9
- pool_index_route_distribution: core_pool=42; watchlist=39; emerging_pool=24; index_only=21; user_feedback_pool=9
- pool_index_count: 102
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 81
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 39
- index_only_pool_count: 21
- aihot_index_only_count: 6
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 102
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 53 result(s): missing_ai_anchor_in_result=28; noise_term:career=10; job_or_salary_page=9; noise_term:hiring=3; noise_term:job description=2; noise_term:jobs at=1; source-artifact keyword: Anysearch documented-payload retry for query "forward deployed engineer AI customer deployment (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; source-artifact rss: RSS tigera-blog: HTTP 415; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=3; noise_term:avatar=1; noise_term:career=1; targeted raw-volume refill cycle 1 added 13 item(s) for raw_count=108/150; targeted-refill pre-gate filtered 6 result(s): missing_ai_anchor_in_result=5; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 3 item(s) for raw_count=111/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=71; operators=12; media=6; product=6; developer=5; news=4; industry=2; official=2; research=2; funding=1
- front_signal_sab_source_count: S=1; A=1; B=8; total=10
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=37; fetched-readable-text-content-container=21; fetched-readable-text-body-visible-text=16; fetched-readable-text-json-ld=8; blocked-http-403=7; fetched-readable-text-article=6; no-url-summary-only=6; summary-only-low-readable-body=5; fetched-readable-text-meta-description=4; http-404-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- C: 12
- B: 79
- A: 11
- S: 9

## Evidence Object Type Distribution

- event: 32
- case_or_customer: 50
- regulatory_or_procurement: 4
- repo_readme_or_index: 2
- pricing_change: 3
- changelog_or_release: 3
- research_or_report: 3
- supporting_article: 6
- event_on_official_page: 2
- community_feedback: 1
- official_index_or_directory: 5

## Theme Distribution

- 开发者生态信号 (developer-ecosystem-signal): 16
- 资本市场信号 (capital-market-signal): 5
- 外围探索信号 (outside-core-exploration): 9
- 成熟信号 (mature-commercial-signal): 31
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 9
- 技术迭代信号 (technical-iteration-signal): 15
- targeted-pool-gap-refill (targeted-pool-gap-refill): 16
- 早期信号 (early-direction-signal): 10

## Keyword Group Distribution

- developer-ecosystem-signal: 19
- capital-market-signal: 5
- outside-core-exploration: 9
- mature-commercial-signal: 29
- technical-iteration-signal: 15
- enterprise-ai-implementation-signal: 8
- targeted-pool-gap-refill: 16
- early-direction-signal: 10

## Keyword Search Path Distribution

- official_original: 14
- capital_startup: 17
- procurement_marketplace: 6
- developer_ecosystem: 5
- industry_landing: 12
- fde_implementation: 5
- a_media_gdelt: 4

## Keyword Search Intent Distribution

- find_startups: 14
- find_customer_case: 29
- find_original_source: 14
- find_workflow_change: 2
- find_market_trend: 4

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
