# 2026-07-08 Guanlan Daily Monitor Log

- generated_at: 2026-07-08T04:39:26.704Z
- raw_count: 162
- aihot_mode: daily+all
- aihot_since: 2026-07-07T04:23:52.600Z
- aihot_discovered_count: 313
- aihot_daily_discovered_count: 24
- aihot_all_discovered_count: 289
- aihot_daily_included_count: 24
- aihot_daily_pool_count: 19
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 50
- external_search_activated: true
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Anysearch business fallback for query "AI platform launch enterprise customers (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; Historical Raw dedupe removed 445 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 29 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 84 fetched hash duplicate candidate(s) before Raw writing.; Anysearch business fallback for query "AI agent startup raises seed Series A funding 2026 (startup OR funding OR seed OR pre-seed OR YC OR venture OR Crunchbase OR Dealroom OR PitchBook OR Tracxn)": The operation was aborted due to timeout; Historical Raw dedupe removed 44 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 1 fetched hash duplicate candidate(s) before Raw writing.
- source_artifacts_used: false
- source_artifact_files: 
- historical_dedupe_enabled: true
- historical_raw_records_checked: 7311
- historical_duplicates_removed_before_fetch: 445
- historical_duplicates_removed_after_fetch: 84
- raw_dedupe_buffer: 80
- aihot_count: 82
- keyword_search_count: 70
- keyword_search_non_community_count: 70
- keyword_search_path_distribution: developer_ecosystem=15; official_original=12; capital_startup=11; industry_landing=11; procurement_marketplace=7; fde_implementation=6; a_media_gdelt=5; ai_hardware_original=3
- keyword_search_intent_distribution: find_startups=18; find_customer_case=17; find_original_source=17; find_workflow_change=13; find_market_trend=5
- source_distribution: aihot=82; keyword-search=70; gdelt=5; rss-feed=5
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 52
- enterprise_ai_transformation_stage_distribution: platform_enablement=22; production_rollout=16; pilot=6; ai_transformation=3; org_build=3; procurement=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=82; keyword-search=70; gdelt=5; rss-feed=5
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=47; developer-ecosystem-signal=38; mature-commercial-signal=23; early-direction-signal=13; ai-hardware-scenario-service-signal=11; ai-hardware-investment-signal=6; enterprise-ai-implementation-signal=6; targeted-pool-gap-refill=6; uncategorized=5; outside-core-exploration=4; capital-market-signal=2; ai-hardware-trend-innovation-signal=1
- theme_distribution: technical-iteration-signal=51; mature-commercial-signal=24; developer-ecosystem-signal=21; ai-hardware-scenario-service-signal=15; early-direction-signal=15; ai-hardware-investment-signal=10; enterprise-ai-implementation-signal=8; targeted-pool-gap-refill=6; uncategorized=5; outside-core-exploration=4; capital-market-signal=2; ai-hardware-trend-innovation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=57; case_or_customer=54; official_index_or_directory=13; regulatory_or_procurement=13; community_feedback=7; changelog_or_release=6; supporting_article=5; pricing_change=3; event_on_official_page=2; repo_readme_or_index=1; research_or_report=1
- pool_route_distribution: watchlist=54; discard=39; index_only=39; core_pool=30; emerging_pool=21; user_feedback_pool=1
- pool_index_route_distribution: watchlist=54; index_only=39; core_pool=30; emerging_pool=21; user_feedback_pool=1
- pool_index_count: 123
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 84
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 54
- index_only_pool_count: 39
- aihot_index_only_count: 19
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 123
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: keyword-search pre-gate filtered 68 result(s): missing_ai_anchor_in_result=25; social_or_profile_source=22; broad_list_or_market_report=5; job_or_salary_page=5; noise_term:career=5; noise_term:hiring=2; noise_term:avatar=1; noise_term:compensation=1; noise_term:job description=1; noise_term:jobs at=1; Search cross-entry dedupe removed 1 duplicate provider hits before Raw selection.; Anysearch business fallback for query "enterprise AI transformation production rollout customer deployment (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; Anysearch fallback for query "forward deployed engineer AI customer deployment (FDE OR "forward deployed" OR "applied AI" OR "customer engineering" OR "technical scoping" OR "production rollout" OR "pilot customer" OR "customer story" OR "case study")": fetch failed; Anysearch business fallback for query "AI implementation customer engineering production deployment (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; RSS latent-space-podcast: fetch failed; RSS mad-podcast: fetch failed; RSS ai-and-i-podcast: fetch failed; RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=2; directory_or_search_page=1; noise_term:career=1; targeted pool/core refill cycle 1 added 6 item(s) for core_pool=27/30; core_non_large=17/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=70; operators=31; developer=21; media=15; news=14; marketplace=5; official=2; product=2; funding=1; newsletter=1
- front_signal_sab_source_count: S=0; A=3; B=11; total=14
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=50; timeout-fallback-visible-text=35; fetched-readable-text-content-container=29; no-url-summary-only=19; fetched-readable-text-body-visible-text=9; blocked-http-403=6; summary-only-low-readable-body=5; fetched-readable-text-article=4; fetched-readable-text-json-ld=3; http-429-fallback-text=1; http-451-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 90
- A: 29
- S: 12
- C: 31

## Evidence Object Type Distribution

- event: 57
- supporting_article: 5
- case_or_customer: 54
- repo_readme_or_index: 1
- pricing_change: 3
- changelog_or_release: 6
- regulatory_or_procurement: 13
- event_on_official_page: 2
- research_or_report: 1
- community_feedback: 7
- official_index_or_directory: 13

## Theme Distribution

- 早期信号 (early-direction-signal): 15
- 外围探索信号 (outside-core-exploration): 4
- 开发者生态信号 (developer-ecosystem-signal): 21
- 技术迭代信号 (technical-iteration-signal): 51
- 资本市场信号 (capital-market-signal): 2
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 8
- AI Hardware investment and financing (ai-hardware-investment-signal): 10
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 15
- 成熟信号 (mature-commercial-signal): 24
- targeted-pool-gap-refill (targeted-pool-gap-refill): 6
- uncategorized (uncategorized): 5
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 1

## Keyword Group Distribution

- early-direction-signal: 13
- outside-core-exploration: 4
- developer-ecosystem-signal: 38
- technical-iteration-signal: 47
- capital-market-signal: 2
- enterprise-ai-implementation-signal: 6
- ai-hardware-investment-signal: 6
- ai-hardware-scenario-service-signal: 11
- mature-commercial-signal: 23
- targeted-pool-gap-refill: 6
- uncategorized: 5
- ai-hardware-trend-innovation-signal: 1

## Keyword Search Path Distribution

- procurement_marketplace: 7
- fde_implementation: 6
- official_original: 12
- ai_hardware_original: 3
- a_media_gdelt: 5
- developer_ecosystem: 15
- capital_startup: 11
- industry_landing: 11

## Keyword Search Intent Distribution

- find_startups: 18
- find_customer_case: 17
- find_market_trend: 5
- find_workflow_change: 13
- find_original_source: 17

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
