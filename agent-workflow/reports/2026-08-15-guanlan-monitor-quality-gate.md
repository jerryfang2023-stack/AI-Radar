# 2026-08-15 Guanlan Monitor Quality Gate

- generated_at: 2026-08-15T04:35:09.357Z
- attempt: 1/1
- status: passed
- production_weekday: saturday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 0
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 238
- structured_supply_healthy: true
- pool_count: 208
- pool_index_count: 208
- routed_pool_count: 21
- index_only_pool_count: 187
- aihot_index_only_count: 14
- aihot_core_count: 16
- keyword_search_non_community_count: 82
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.777
- off_topic_title_count: 0
- core_pool_count: 16
- core_pool_min_effective: 1
- core_pool_min_default: 1
- usable_core_evidence_count: 16
- usable_core_evidence_min_effective: 1
- usable_core_evidence_min_default: 1
- core_evidence_strength_distribution: rich_evidence=16
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 16
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 4
- core_non_large_vendor_count: 12
- core_non_large_vendor_min_effective: 0
- core_non_large_vendor_min_default: 0
- core_large_vendor_ratio: 0.250
- aihot_resolved_evidence_count: 16
- aihot_resolved_core_count: 16
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- source_provider_recovery_status: recovered_by_fallback
- recovered_failed_sources_count: 7
- unrecovered_failed_sources_count: 0
- source_provider_failures_block_release: false
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 41 result(s): missing_ai_anchor_in_result=21; broad_list_or_market_report=9; social_or_profile_source=9; noise_term:definition=1; noise_term:hiring=1; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted pool/core refill cycle 1 added 2 item(s) for important_case=4/5
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (undefined): 0
- content_quality (undefined): 0
- coverage_scope (undefined): 0
- keyword_compliance (undefined): 0
- strategic_alignment (undefined): 0
- importance_readiness (10): 6.31

## Hard Gates

- pool_count_min: passed (208/15)
- routed_pool_count_min: passed (21/10)
- core_pool_min: passed (16/1)
- usable_core_evidence_min: passed (16/1)
- homepage_directory_core_max: passed (0/0)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)

## Diagnostics

- raw_count_min: passed (238/150)
- keyword_search_non_community_min: passed (82/6)
- ai_relevant_title_ratio_min: passed (0.78/0.7)
- off_topic_title_max: passed (0/3)
- importance_coverage_gaps: passed (none)
- pool_importance_coverage_gaps: warning (important_case=4/5)

## Risks

- pool_importance_coverage_gaps=important_case=4/5

## Recovered Diagnostics

- recovered_source_failures=7; status=recovered_by_fallback

## Skill Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow the V4 factual build to proceed with noted source-supply diagnostics.
- reasons: Pool importance coverage gaps remain

## Inputs

- structured_intake_file: 01-SiteV2/content/11-databases/data-center-v4/intake-v1/2026-08-15.json
- monitor_log_file: agent-workflow/reports/2026-08-15-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/source-intake-gate-v1.json

