# 2026-09-12 Guanlan Daily Monitor Log

- generated_at: 2026-09-12T08:35:48.516Z
- raw_count: 6
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
- provider_fallback_notes: Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.; Same-run Raw dedupe removed 23 duplicate candidate(s) before Raw writing.
- source_provider_recovery_status: unrecovered
- source_provider_failure_count: 1
- recovered_failed_sources_count: 0
- unrecovered_failed_sources_count: 1
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/china-funding-history/2026-01-01_2026-09-12/capture-delta/china-funding-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 23
- raw_dedupe_buffer: 40
- adaptive_raw_candidate_pool_count: 29
- adaptive_raw_fetch_limit: 2520
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 29
- adaptive_raw_expansion_candidates: 0
- aihot_count: 0
- keyword_search_count: 0
- keyword_search_non_community_count: 0
- keyword_search_path_distribution:
- keyword_search_intent_distribution:
- source_distribution: china-funding=6
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 0
- enterprise_ai_transformation_stage_distribution:
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: china-funding=6
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: important_funding=6
- theme_distribution: china-funding-independent=5; china-funding-secondary-original=1
- theme_concentration_warning: warning: china-funding-independent concentration 83.3% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- evidence_object_type_distribution: event=5; case_or_customer=1
- pool_route_distribution: core_pool=3; watchlist=2; index_only=1
- pool_index_route_distribution: core_pool=3; watchlist=2; index_only=1
- pool_index_count: 1645
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 5
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 2
- index_only_pool_count: 1
- aihot_index_only_count: 0
- aihot_core_count: 0
- aihot_daily_index_only_count: 0
- aihot_daily_core_count: 0
- importance_coverage_gaps: important_case=1/3; important_product_or_service=0/3; important_vertical_solution=0/3
- pool_importance_coverage_gaps: important_case=1/5; important_funding=1/5; important_product_or_service=0/5; important_vertical_solution=0/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 1645
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact china-funding: site:qbitai.com (具身智能 OR 机器人 OR AI芯片 OR 算力 OR AI硬件) (融资 OR 天使轮 OR Pre-A) 2026年07月 after:2026-07-01 before:2026-08-01: Anysearch HTTP 502
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=4; industry_media=2
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-body-visible-text=2; summary-only-low-readable-body=2; binary-text-rejected=1; fetched-readable-text-content-container=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- B: 4
- ungraded: 2

## Evidence Object Type Distribution

- event: 5
- case_or_customer: 1

## Theme Distribution

- china-funding-independent (china-funding-independent): 5
- china-funding-secondary-original (china-funding-secondary-original): 1

## Keyword Group Distribution

- important_funding: 6

## Keyword Search Path Distribution

- none

## Keyword Search Intent Distribution

- none

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
