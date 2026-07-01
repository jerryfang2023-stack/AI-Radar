# 2026-06-26 Guanlan Daily Monitor Log

- generated_at: 2026-06-26T03:32:32.504Z
- raw_count: 188
- aihot_mode: source-artifacts
- aihot_since:
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 24
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 5095
- historical_duplicates_removed_before_fetch: 96
- historical_duplicates_removed_after_fetch: 2
- raw_dedupe_buffer: 40
- aihot_count: 86
- keyword_search_count: 102
- keyword_search_non_community_count: 102
- keyword_search_path_distribution: developer_ecosystem=20; official_original=17; a_media_gdelt=16; procurement_marketplace=15; industry_landing=14; capital_startup=12; fde_implementation=8
- keyword_search_intent_distribution: find_original_source=35; find_customer_case=27; find_startups=24; find_market_trend=16
- source_distribution: keyword-search=102; aihot=86
- enterprise_ai_transformation_column: 浼佷笟AI鍖?- enterprise_ai_transformation_candidate_count: 97
- enterprise_ai_transformation_stage_distribution: platform_enablement=33; pilot=23; production_rollout=23; ai_transformation=9; org_build=5; procurement=4
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: keyword-search=102; aihot=86
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: developer-ecosystem-signal=56; technical-iteration-signal=49; mature-commercial-signal=42; early-direction-signal=19; capital-market-signal=8; enterprise-ai-implementation-signal=8; outside-core-exploration=6
- theme_distribution: technical-iteration-signal=54; mature-commercial-signal=47; developer-ecosystem-signal=38; early-direction-signal=24; capital-market-signal=11; enterprise-ai-implementation-signal=8; outside-core-exploration=6
- theme_concentration_warning: none
- source_level_distribution: B=126; C=34; S=16; A=12
- evidence_object_type_distribution: case_or_customer=76; event=36; community_feedback=18; official_index_or_directory=18; regulatory_or_procurement=10; repo_readme_or_index=7; pricing_change=6; changelog_or_release=5; event_on_official_page=4; supporting_article=4; research_or_report=3; search_result_or_tool_directory=1
- pool_route_distribution: watchlist=68; discard=49; emerging_pool=44; index_only=36; core_pool=35; user_feedback_pool=4
- pool_index_route_distribution: core_pool=33; index_only=31; watchlist=30; emerging_pool=29; user_feedback_pool=3; discard=1
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 63
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 30
- index_only_pool_count: 31
- aihot_index_only_count: 24
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact agent-workflow/reports/source-runs/2026-06-26/gdelt-raw-source-candidates.json: invalid JSON; source-artifact keyword: keyword-search pre-gate filtered 34 result(s): noise_term:career=9; job_or_salary_page=6; missing_ai_anchor_in_result=4; noise_term:hiring=4; noise_term:job description=3; directory_or_search_page=2; noise_term:compensation=2; noise_term:salary=2; noise_term:affiliate=1; noise_term:definition=1; source-artifact rss: RSS latent-space-podcast: fetch failed; source-artifact rss: RSS mad-podcast: fetch failed; source-artifact rss: RSS ai-and-i-podcast: fetch failed
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=92; community=34; developer=26; official=11; media=7; marketplace=5; news=5; industry=3; funding=2; analysis=1; organization-capability=1; product=1
- front_signal_sab_source_count: S=2; A=4; B=15; total=21
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: timeout-fallback-visible-text=67; fetched-readable-text-main=38; fetched-readable-text-content-container=27; no-url-summary-only=24; fetched-readable-text-body-visible-text=8; fetched-readable-text-article=6; http-451-fallback-text=6; fetched-readable-text-json-ld=4; summary-only-low-readable-body=4; blocked-http-403=2; http-400-fallback-text=1; http-429-fallback-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 12
- B: 126
- S: 16
- C: 34

## Evidence Object Type Distribution

- event: 36
- pricing_change: 6
- supporting_article: 4
- case_or_customer: 76
- regulatory_or_procurement: 10
- event_on_official_page: 4
- changelog_or_release: 5
- search_result_or_tool_directory: 1
- repo_readme_or_index: 7
- research_or_report: 3
- official_index_or_directory: 18
- community_feedback: 18

## Theme Distribution

- 鏃╂湡淇″彿 (early-direction-signal): 24
- 澶栧洿鎺㈢储淇″彿 (outside-core-exploration): 6
- 鎶€鏈凯浠ｄ俊鍙?(technical-iteration-signal): 54
- 寮€鍙戣€呯敓鎬佷俊鍙?(developer-ecosystem-signal): 38
- 璧勬湰甯傚満淇″彿 (capital-market-signal): 11
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 8
- 鎴愮啛淇″彿 (mature-commercial-signal): 47

## Keyword Group Distribution

- early-direction-signal: 19
- outside-core-exploration: 6
- technical-iteration-signal: 49
- developer-ecosystem-signal: 56
- capital-market-signal: 8
- enterprise-ai-implementation-signal: 8
- mature-commercial-signal: 42

## Keyword Search Path Distribution

- a_media_gdelt: 16
- fde_implementation: 8
- official_original: 17
- industry_landing: 14
- developer_ecosystem: 20
- procurement_marketplace: 15
- capital_startup: 12

## Keyword Search Intent Distribution

- find_market_trend: 16
- find_customer_case: 27
- find_startups: 24
- find_original_source: 35

## Three-Lane Monitor Policy

Default strategy: AI HOT daily selected and full 24h are the primary Raw discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. paused-opinion-source / operators viewpoints are paused and must not enter business signals. HN / community is feedback only. Important cards must then resolve original text, page type and usable evidence object before publication.
