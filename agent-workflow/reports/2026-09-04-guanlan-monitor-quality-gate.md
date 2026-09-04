# 2026-09-04 Guanlan Monitor Quality Gate

- generated_at: 2026-09-04T04:39:09.463Z
- attempt: 1/1
- status: passed
- production_weekday: friday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 0
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 277
- structured_supply_healthy: true
- pool_count: 166
- pool_index_count: 166
- routed_pool_count: 134
- legacy_origin_fetch_status_inferred_count: 0
- index_only_pool_count: 32
- aihot_index_only_count: 13
- aihot_core_count: 9
- keyword_search_non_community_count: 91
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.780
- off_topic_title_count: 0
- core_pool_count: 133
- core_pool_min_effective: 1
- core_pool_min_default: 1
- usable_core_evidence_count: 133
- usable_core_evidence_min_effective: 1
- usable_core_evidence_min_default: 1
- core_evidence_strength_distribution: rich_evidence=133
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 133
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 41
- core_non_large_vendor_count: 92
- core_non_large_vendor_min_effective: 0
- core_non_large_vendor_min_default: 0
- core_large_vendor_ratio: 0.308
- aihot_resolved_evidence_count: 9
- aihot_resolved_core_count: 9
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- source_provider_recovery_status: unrecovered
- recovered_failed_sources_count: 6
- unrecovered_failed_sources_count: 6
- source_provider_failures_block_release: false
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact gdelt: source collection command failed; see gdelt-source-run.log; source-artifact keyword: keyword-search pre-gate filtered 86 result(s): missing_ai_anchor_in_result=37; social_or_profile_source=28; broad_list_or_market_report=16; noise_term:hiring=3; directory_or_search_page=1; noise_term:dictionary=1; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced September 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (undefined): 0
- content_quality (undefined): 0
- coverage_scope (undefined): 0
- keyword_compliance (undefined): 0
- strategic_alignment (undefined): 0
- importance_readiness (10): 9.2

## Hard Gates

- pool_count_min: passed (166/15)
- routed_pool_count_min: passed (134/10)
- core_pool_min: passed (133/1)
- usable_core_evidence_min: passed (133/1)
- homepage_directory_core_max: passed (0/0)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)

## Diagnostics

- raw_count_min: passed (277/150)
- keyword_search_non_community_min: passed (91/6)
- ai_relevant_title_ratio_min: passed (0.78/0.7)
- off_topic_title_max: passed (0/3)
- importance_coverage_gaps: passed (none)
- pool_importance_coverage_gaps: warning (important_case=2/5)

## Risks

- unrecovered_failed_sources=6
- pool_importance_coverage_gaps=important_case=2/5
- core_large_vendor=41/10; ratio=0.31/0.35

## Recovered Diagnostics

- none

## Skill Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Keep provider failures diagnostic; repair the deficient evidence-supply bucket through any available source channel.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow the V4 factual build to proceed with noted source-supply diagnostics.
- reasons: Pool importance coverage gaps remain | source-provider failures remain visible as supply diagnostics

## Inputs

- structured_intake_file: 01-SiteV2/content/11-databases/data-center-v4/intake-v1/2026-09-04.json
- monitor_log_file: agent-workflow/reports/2026-09-04-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/source-intake-gate-v1.json
