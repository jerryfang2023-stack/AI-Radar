# 2026-07-29 Guanlan Monitor Quality Gate

- generated_at: 2026-07-29T04:44:17.827Z
- attempt: 1/1
- status: passed
- production_weekday: wednesday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 94.5
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 159
- raw_count_release_override: false
- raw_to_card_supply_release: true
- pool_count: 147
- pool_index_count: 147
- routed_pool_count: 107
- index_only_pool_count: 40
- aihot_index_only_count: 32
- aihot_core_count: 33
- keyword_search_non_community_count: 34
- non_community_paths_hit: official_original, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.818
- off_topic_title_count: 0
- core_pool_count: 56
- core_pool_min_effective: 1
- core_pool_min_default: 1
- usable_core_evidence_count: 56
- usable_core_evidence_min_effective: 1
- usable_core_evidence_min_default: 1
- core_evidence_strength_distribution: rich_evidence=56
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 56
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 9
- core_non_large_vendor_count: 47
- core_non_large_vendor_min_effective: 0
- core_non_large_vendor_min_default: 0
- core_large_vendor_ratio: 0.161
- aihot_resolved_evidence_count: 47
- aihot_resolved_core_count: 33
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5
- source_provider_recovery_status: recovered_by_fallback
- recovered_failed_sources_count: 6
- unrecovered_failed_sources_count: 0
- source_provider_failures_block_release: false
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 15 result(s): missing_ai_anchor_in_result=10; broad_list_or_market_report=3; noise_term:career=1; noise_term:hiring=1; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=5; targeted pool/core refill cycle 1 added 3 item(s) for important_case=2/5
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 13.88
- strategic_alignment (15): 14.1
- importance_readiness (10): 7.52

## Hard Gates

- pool_count_min: passed (147/15)
- routed_pool_count_min: passed (107/10)
- core_pool_min: passed (56/1)
- usable_core_evidence_min: passed (56/1)
- homepage_directory_core_max: passed (0/0)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)

## Diagnostics

- raw_count_min: passed (159/150)
- keyword_search_non_community_min: passed (34/6)
- ai_relevant_title_ratio_min: passed (0.82/0.7)
- off_topic_title_max: passed (0/3)
- importance_coverage_gaps: passed (none)
- pool_importance_coverage_gaps: warning (important_case=3/5)

## Risks

- pool_importance_coverage_gaps=important_case=3/5

## Recovered Diagnostics

- recovered_source_failures=6; status=recovered_by_fallback

## Skill Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- reasons: Pool importance coverage gaps remain

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-29-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-29-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-29-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/business-signals-gate-v3.json

