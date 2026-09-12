# 2026-09-12 Guanlan Daily Monitor Log

- generated_at: 2026-09-12T06:49:05.829Z
- raw_count: 166
- aihot_mode: source-artifacts
- aihot_since: none
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
- provider_fallback_notes: Same-run Raw dedupe removed 4 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 1
- recovered_failed_sources_count: 0
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/china-funding-history/2026-01-01_2026-09-12/china-funding-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 4
- raw_dedupe_buffer: 40
- adaptive_raw_candidate_pool_count: 170
- adaptive_raw_fetch_limit: 2520
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 170
- adaptive_raw_expansion_candidates: 0
- aihot_count: 0
- keyword_search_count: 0
- keyword_search_non_community_count: 0
- keyword_search_path_distribution:
- keyword_search_intent_distribution:
- source_distribution: china-funding=166
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 2
- enterprise_ai_transformation_stage_distribution: pilot=1; platform_enablement=1
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: china-funding=166
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: important_funding=166
- theme_distribution: china-funding-history=166
- theme_concentration_warning: warning: china-funding-history concentration 100.0% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- evidence_object_type_distribution: event=131; case_or_customer=30; regulatory_or_procurement=3; changelog_or_release=1; pricing_change=1
- pool_route_distribution: watchlist=99; core_pool=59; index_only=8
- pool_index_route_distribution: watchlist=99; core_pool=59; index_only=8
- pool_index_count: 400
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 158
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 99
- index_only_pool_count: 8
- aihot_index_only_count: 0
- aihot_core_count: 0
- aihot_daily_index_only_count: 0
- aihot_daily_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5; important_vertical_solution=2/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 400
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact china-funding: site:qbitai.com (具身智能 OR 机器人 OR AI芯片 OR 算力 OR AI硬件) (融资 OR 天使轮 OR Pre-A) 2026年07月 after:2026-07-01 before:2026-08-01: Anysearch HTTP 502
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: industry_media=166
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=68; summary-only-low-readable-body=53; fetched-readable-text-article=44; fetched-readable-text-body-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- ungraded: 166

## Evidence Object Type Distribution

- case_or_customer: 30
- regulatory_or_procurement: 3
- event: 131
- pricing_change: 1
- changelog_or_release: 1

## Theme Distribution

- china-funding-history (china-funding-history): 166

## Keyword Group Distribution

- important_funding: 166

## Keyword Search Path Distribution

- none

## Keyword Search Intent Distribution

- none

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
