# 2026-08-04 Guanlan Monitor Quality Gate

- generated_at: 2026-08-04T00:22:24.038Z
- attempt: 1/1
- status: passed
- production_weekday: tuesday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 0
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 250
- structured_supply_healthy: true
- pool_count: 223
- pool_index_count: 223
- routed_pool_count: 18
- index_only_pool_count: 205
- aihot_index_only_count: 26
- aihot_core_count: 15
- keyword_search_non_community_count: 83
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.840
- off_topic_title_count: 0
- core_pool_count: 15
- core_pool_min_effective: 1
- core_pool_min_default: 1
- usable_core_evidence_count: 15
- usable_core_evidence_min_effective: 1
- usable_core_evidence_min_default: 1
- core_evidence_strength_distribution: rich_evidence=15
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 15
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 4
- core_non_large_vendor_count: 11
- core_non_large_vendor_min_effective: 0
- core_non_large_vendor_min_default: 0
- core_large_vendor_ratio: 0.267
- aihot_resolved_evidence_count: 15
- aihot_resolved_core_count: 15
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- source_provider_recovery_status: recovered_by_fallback
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 0
- source_provider_failures_block_release: false
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 33 result(s): missing_ai_anchor_in_result=13; broad_list_or_market_report=9; social_or_profile_source=6; noise_term:hiring=2; directory_or_search_page=1; noise_term:career=1; noise_term:definition=1; source-artifact keyword: Anysearch business fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch Search service temporarily unavailable.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (undefined): 0
- content_quality (undefined): 0
- coverage_scope (undefined): 0
- keyword_compliance (undefined): 0
- strategic_alignment (undefined): 0
- importance_readiness (10): 6.27

## Hard Gates

- pool_count_min: passed (223/15)
- routed_pool_count_min: passed (18/10)
- core_pool_min: passed (15/1)
- usable_core_evidence_min: passed (15/1)
- homepage_directory_core_max: passed (0/0)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)

## Diagnostics

- raw_count_min: passed (250/150)
- keyword_search_non_community_min: passed (83/6)
- ai_relevant_title_ratio_min: passed (0.84/0.7)
- off_topic_title_max: passed (0/3)
- importance_coverage_gaps: passed (none)
- pool_importance_coverage_gaps: passed (none)

## Risks

- none

## Recovered Diagnostics

- recovered_source_failures=8; status=recovered_by_fallback

## Skill Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow
- action: Allow the V4 factual build to proceed.
- reasons: all hard gates passed

## Inputs

- structured_intake_file: 01-SiteV2/content/11-databases/data-center-v4/intake-v1/2026-08-04.json
- monitor_log_file: agent-workflow/reports/2026-08-04-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/source-intake-gate-v1.json

