# 2026-07-31 Guanlan Daily Monitor Log

- generated_at: 2026-07-31T08:39:20.926Z
- raw_count: 288
- aihot_mode: source-artifacts
- aihot_since:
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 0
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- anysearch_configured: false
- anysearch_disabled_for_run: false
- provider_fallback_notes: none
- source_provider_recovery_status: none
- source_provider_failure_count: 0
- recovered_failed_sources_count: 0
- unrecovered_failed_sources_count: 0
- source_artifacts_used: true
- source_artifact_files: agent-workflow/reports/source-runs/2026-07-31-cn-repair/china-recovery-source-intake-candidates.json, agent-workflow/reports/source-runs/2026-07-31-cn-repair/china-rss-source-intake-candidates.json
- historical_dedupe_enabled: true
- historical_raw_records_checked: 0
- historical_duplicates_removed_before_fetch: 0
- historical_duplicates_removed_after_fetch: 0
- same_run_duplicates_removed_after_fetch: 0
- raw_dedupe_buffer: 0
- adaptive_raw_candidate_pool_count: 5
- adaptive_raw_fetch_limit: 80
- adaptive_raw_fetch_batches: 1
- adaptive_raw_fetched_candidates: 1
- adaptive_raw_expansion_candidates: 0
- aihot_count: 0
- keyword_search_count: 0
- keyword_search_non_community_count: 0
- keyword_search_path_distribution:
- keyword_search_intent_distribution:
- source_distribution: rss-feed=1
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 0
- enterprise_ai_transformation_stage_distribution:
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens; FDE / Applied AI role pages are organization-capability signals and require accepted source-backed Claims and CanonicalEvents before factual projection.
- raw_count_by_channel: rss-feed=1
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: early-direction-signal=1
- theme_distribution: early-direction-signal=1
- theme_concentration_warning: warning: 早期信号 concentration 100.0% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- evidence_object_type_distribution: case_or_customer=1
- pool_route_distribution: core_pool=1
- pool_index_route_distribution: core_pool=1
- pool_index_count: 221
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 1
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 0
- index_only_pool_count: 0
- aihot_index_only_count: 0
- aihot_core_count: 0
- aihot_daily_index_only_count: 0
- aihot_daily_core_count: 0
- importance_coverage_gaps: important_case=0/3; important_funding=0/3; important_product_or_service=0/3; important_vertical_solution=0/3
- pool_importance_coverage_gaps: important_case=0/5; important_funding=0/5; important_product_or_service=0/5; important_vertical_solution=0/5
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 219
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: none
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: industry_media=1
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- china_market_source_registry_config: 01-SiteV2/content/11-databases/china-market-source-registry-v1.json
- china_market_monitoring_config: 01-SiteV2/content/11-databases/china-market-monitoring-v1.json
- raw_snapshot_status_distribution: fetched-readable-text-content-container=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- ungraded: 1

## Evidence Object Type Distribution

- case_or_customer: 1

## Theme Distribution

- 早期信号 (early-direction-signal): 1

## Keyword Group Distribution

- early-direction-signal: 1

## Keyword Search Path Distribution

- none

## Keyword Search Intent Distribution

- none

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from factual events. HN / community is feedback only. CanonicalEvents require captured original text, exact-span accepted Claims, SourceArtifact references, and the V4 integrity gate.
