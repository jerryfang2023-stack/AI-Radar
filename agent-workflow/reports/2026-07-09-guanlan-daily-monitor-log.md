# 2026-07-09 Guanlan Daily Monitor Log

- generated_at: 2026-07-09T03:05:45.474Z
- raw_count: 124
- aihot_mode: daily+all
- aihot_since: 2026-07-08T03:04:09.409Z
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 0
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: true
- anysearch_disabled_for_run: false
- provider_fallback_notes: Historical Raw dedupe removed 491 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 28 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 193 fetched hash duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 32 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 1 fetched hash duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 32 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 1 fetched hash duplicate candidate(s) before Raw writing.; Historical Raw dedupe removed 42 URL duplicate candidate(s) before Raw selection.; Historical Raw dedupe removed 42 URL duplicate candidate(s) before Raw selection.
- source_provider_recovery_status: recovered_by_fallback
- source_provider_failure_count: 36
- recovered_failed_sources_count: 36
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-09/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-09/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-09/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-09/rss-raw-source-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 7473
- historical_duplicates_removed_before_fetch: 491
- historical_duplicates_removed_after_fetch: 193
- raw_dedupe_buffer: 140
- aihot_count: 7
- keyword_search_count: 81
- keyword_search_non_community_count: 81
- keyword_search_path_distribution: official_original=27; a_media_gdelt=19; capital_startup=12; developer_ecosystem=8; industry_landing=7; ai_hardware_original=4; procurement_marketplace=3; fde_implementation=1
- keyword_search_intent_distribution: find_original_source=29; find_market_trend=19; find_startups=18; find_customer_case=15
- source_distribution: keyword-search=81; rss-feed=20; gdelt=16; aihot=7
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 73
- enterprise_ai_transformation_stage_distribution: platform_enablement=25; production_rollout=18; pilot=14; ai_transformation=11; procurement=3; org_build=2
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: keyword-search=81; rss-feed=20; gdelt=16; aihot=7
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: targeted-pool-gap-refill=27; developer-ecosystem-signal=20; mature-commercial-signal=15; uncategorized=15; technical-iteration-signal=11; early-direction-signal=9; capital-market-signal=8; ai-hardware-investment-signal=5; aihot-fallback-market-structure=4; ai-hardware-scenario-service-signal=2; ai-hardware-trend-innovation-signal=2; aihot-fallback-case=2; enterprise-ai-implementation-signal=2; aihot-fallback-product=1; outside-core-exploration=1
- theme_distribution: targeted-pool-gap-refill=27; mature-commercial-signal=17; uncategorized=15; technical-iteration-signal=14; developer-ecosystem-signal=13; early-direction-signal=10; capital-market-signal=9; ai-hardware-investment-signal=5; aihot-fallback-market-structure=4; ai-hardware-scenario-service-signal=2; ai-hardware-trend-innovation-signal=2; aihot-fallback-case=2; enterprise-ai-implementation-signal=2; aihot-fallback-product=1; outside-core-exploration=1
- theme_concentration_warning: none
- evidence_object_type_distribution: case_or_customer=65; event=36; regulatory_or_procurement=8; changelog_or_release=7; event_on_official_page=3; research_or_report=2; supporting_article=2; repo_readme_or_index=1
- pool_route_distribution: watchlist=71; core_pool=32; emerging_pool=29; index_only=14; discard=6
- pool_index_route_distribution: watchlist=71; core_pool=32; emerging_pool=29; index_only=14
- pool_index_count: 118
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 104
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 72
- index_only_pool_count: 14
- aihot_index_only_count: 0
- aihot_core_count: 2
- aihot_daily_index_only_count: 0
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 118
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-09): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); source-artifact aihot: AI HOT (all): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); source-artifact aihot: AI HOT API unavailable; used fallback source search (18 item(s), 13 filtered); source-artifact keyword: keyword-search pre-gate filtered 34 result(s): missing_ai_anchor_in_result=12; noise_term:career=8; noise_term:hiring=7; job_or_salary_page=4; noise_term:compensation=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS dataiku-blog: HTTP 404; source-artifacts missing AI HOT daily candidates; live AI HOT fallback activated; AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-09): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); AI HOT (all): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); AI HOT API unavailable; used fallback source search (18 item(s), 13 filtered); targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=3; missing_ai_anchor_in_result=1; targeted pool/core refill cycle 1 added 15 item(s) for core_pool=24/30; core_non_large=14/20; targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=3; missing_ai_anchor_in_result=1; targeted pool/core refill cycle 2 added 0 item(s) for core_pool=26/30; core_non_large=16/20; targeted-refill pre-gate filtered 3 result(s): broad_list_or_market_report=1; missing_ai_anchor_in_result=1; noise_term:career=1; targeted raw-volume refill cycle 1 added 12 item(s) for raw_count=124/150; targeted-refill pre-gate filtered 3 result(s): broad_list_or_market_report=1; missing_ai_anchor_in_result=1; noise_term:career=1; targeted raw-volume refill cycle 2 added 0 item(s) for raw_count=124/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=36; media=27; news=25; developer=12; official=9; operators=6; product=4; funding=3; builder=1; marketplace=1
- front_signal_sab_source_count: S=1; A=6; B=9; total=16
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=66; fetched-readable-text-main=31; fetched-readable-text-article=10; blocked-http-403=6; fetched-readable-text-body-visible-text=6; fetched-readable-text-json-ld=5
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 47
- A: 52
- C: 6
- S: 19

## Evidence Object Type Distribution

- changelog_or_release: 7
- case_or_customer: 65
- regulatory_or_procurement: 8
- event: 36
- event_on_official_page: 3
- research_or_report: 2
- repo_readme_or_index: 1
- supporting_article: 2

## Theme Distribution

- aihot-fallback-product (aihot-fallback-product): 1
- aihot-fallback-case (aihot-fallback-case): 2
- aihot-fallback-market-structure (aihot-fallback-market-structure): 4
- 成熟信号 (mature-commercial-signal): 17
- 早期信号 (early-direction-signal): 10
- 技术迭代信号 (technical-iteration-signal): 14
- 开发者生态信号 (developer-ecosystem-signal): 13
- 资本市场信号 (capital-market-signal): 9
- AI Hardware investment and financing (ai-hardware-investment-signal): 5
- targeted-pool-gap-refill (targeted-pool-gap-refill): 27
- AI Hardware trend and innovation (ai-hardware-trend-innovation-signal): 2
- 外围探索信号 (outside-core-exploration): 1
- uncategorized (uncategorized): 15
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 2
- AI Hardware scenario and service (ai-hardware-scenario-service-signal): 2

## Keyword Group Distribution

- aihot-fallback-product: 1
- aihot-fallback-case: 2
- aihot-fallback-market-structure: 4
- mature-commercial-signal: 15
- early-direction-signal: 9
- technical-iteration-signal: 11
- developer-ecosystem-signal: 20
- capital-market-signal: 8
- ai-hardware-investment-signal: 5
- targeted-pool-gap-refill: 27
- ai-hardware-trend-innovation-signal: 2
- outside-core-exploration: 1
- uncategorized: 15
- enterprise-ai-implementation-signal: 2
- ai-hardware-scenario-service-signal: 2

## Keyword Search Path Distribution

- capital_startup: 12
- a_media_gdelt: 19
- procurement_marketplace: 3
- ai_hardware_original: 4
- official_original: 27
- developer_ecosystem: 8
- industry_landing: 7
- fde_implementation: 1

## Keyword Search Intent Distribution

- find_original_source: 29
- find_market_trend: 19
- find_customer_case: 15
- find_startups: 18

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
