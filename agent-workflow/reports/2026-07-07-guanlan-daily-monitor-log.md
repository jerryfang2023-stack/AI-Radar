# 2026-07-07 Guanlan Daily Monitor Log

- generated_at: 2026-07-07T02:47:00.730Z
- raw_count: 171
- aihot_mode: daily+all
- aihot_since: 2026-07-06T02:33:33.277Z
- aihot_discovered_count: 295
- aihot_daily_discovered_count: 24
- aihot_all_discovered_count: 271
- aihot_daily_included_count: 24
- aihot_daily_pool_count: 15
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 48
- external_search_activated: true
- historical_dedupe_enabled: true
- historical_raw_records_checked: 7043
- historical_duplicates_removed_before_fetch: 358
- historical_duplicates_removed_after_fetch: 126
- raw_dedupe_buffer: 140
- aihot_count: 131
- keyword_search_count: 25
- keyword_search_non_community_count: 25
- keyword_search_path_distribution: official_original=9; ai_hardware_original=7; capital_startup=7; a_media_gdelt=1; industry_landing=1
- keyword_search_intent_distribution: find_startups=14; find_original_source=9; find_customer_case=1; find_market_trend=1
- source_distribution: aihot=131; keyword-search=25; rss-feed=8; gdelt=7
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 26
- enterprise_ai_transformation_stage_distribution: platform_enablement=13; ai_transformation=5; pilot=4; production_rollout=4
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: aihot=131; keyword-search=25; rss-feed=8; gdelt=7
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: technical-iteration-signal=54; developer-ecosystem-signal=51; mature-commercial-signal=15; outside-core-exploration=14; early-direction-signal=11; ai-hardware-investment-signal=8; targeted-pool-gap-refill=7; uncategorized=7; ai-hardware-trend-innovation-signal=2; capital-market-signal=1; enterprise-ai-implementation-signal=1
- theme_distribution: technical-iteration-signal=55; developer-ecosystem-signal=50; mature-commercial-signal=15; outside-core-exploration=14; early-direction-signal=11; ai-hardware-investment-signal=8; targeted-pool-gap-refill=7; uncategorized=7; ai-hardware-trend-innovation-signal=2; capital-market-signal=1; enterprise-ai-implementation-signal=1
- theme_concentration_warning: none
- evidence_object_type_distribution: event=69; community_feedback=37; case_or_customer=32; official_index_or_directory=15; supporting_article=6; regulatory_or_procurement=4; changelog_or_release=3; research_or_report=3; pricing_change=1; repo_readme_or_index=1
- pool_route_distribution: discard=83; core_pool=31; index_only=29; watchlist=28; emerging_pool=13; user_feedback_pool=8
- pool_index_route_distribution: core_pool=31; index_only=29; watchlist=28; emerging_pool=13; user_feedback_pool=8
- pool_index_count: 88
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 59
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 28
- index_only_pool_count: 29
- aihot_index_only_count: 15
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 88
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-07): 404 Not Found — {"error":"No daily report for 2026-07-07."}; keyword-search pre-gate filtered 52 result(s): social_or_profile_source=29; missing_ai_anchor_in_result=14; broad_list_or_market_report=6; noise_term:career=2; noise_term:hiring=1; Anysearch fallback for query "AI Agent funding enterprise customers (industry use case OR customer case OR vertical SaaS OR consulting report OR workflow OR adoption)": fetch failed; Anysearch documented-payload retry for query "open-source AI agent GitHub enterprise adoption (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": The operation was aborted due to timeout; RSS google-ai-blog-rss: The operation was aborted due to timeout; RSS latent-space-podcast: fetch failed; RSS mad-podcast: fetch failed; RSS ai-and-i-podcast: fetch failed; RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 9 result(s): broad_list_or_market_report=4; social_or_profile_source=4; noise_term:avatar=1; targeted pool/core refill cycle 1 added 7 item(s) for routed_pool=54/60; targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=3; social_or_profile_source=1; targeted pool/core refill cycle 2 added 0 item(s) for routed_pool=59/60
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: operators=71; web=68; media=9; news=8; official=5; developer=3; builder=2; product=2; analysis=1; funding=1; industry=1
- front_signal_sab_source_count: S=1; A=4; B=7; total=12
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=81; fetched-readable-text-content-container=23; no-url-summary-only=18; fetched-readable-text-main=17; fetched-readable-text-body-visible-text=15; summary-only-low-readable-body=7; fetched-readable-text-article=4; fetched-readable-text-json-ld=3; blocked-http-403=1; http-429-fallback-text=1; http-451-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 17
- B: 74
- S: 9
- C: 71

## Evidence Object Type Distribution

- event: 69
- repo_readme_or_index: 1
- case_or_customer: 32
- regulatory_or_procurement: 4
- changelog_or_release: 3
- community_feedback: 37
- official_index_or_directory: 15
- supporting_article: 6
- research_or_report: 3
- pricing_change: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 11
- 开发者生态信号 (developer-ecosystem-signal): 50
- 成熟信号 (mature-commercial-signal): 15
- 技术迭代信号 (technical-iteration-signal): 55
- AI Hardware investment and financing (ai-hardware-investment-signal): 8
- targeted-pool-gap-refill (targeted-pool-gap-refill): 7
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 2
- uncategorized (uncategorized): 7
- 外围探索信号 (outside-core-exploration): 14
- 资本市场信号 (capital-market-signal): 1
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 1

## Keyword Group Distribution

- early-direction-signal: 11
- developer-ecosystem-signal: 51
- mature-commercial-signal: 15
- technical-iteration-signal: 54
- ai-hardware-investment-signal: 8
- targeted-pool-gap-refill: 7
- ai-hardware-trend-innovation-signal: 2
- uncategorized: 7
- outside-core-exploration: 14
- capital-market-signal: 1
- enterprise-ai-implementation-signal: 1

## Keyword Search Path Distribution

- ai_hardware_original: 7
- capital_startup: 7
- official_original: 9
- a_media_gdelt: 1
- industry_landing: 1

## Keyword Search Intent Distribution

- find_startups: 14
- find_original_source: 9
- find_market_trend: 1
- find_customer_case: 1

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
