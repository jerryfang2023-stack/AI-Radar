# 2026-08-08 Guanlan Monitor Quality Gate

- generated_at: 2026-08-08T00:22:10.893Z
- attempt: 1/1
- status: passed
- production_weekday: saturday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 0
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 261
- structured_supply_healthy: true
- pool_count: 227
- pool_index_count: 227
- routed_pool_count: 26
- index_only_pool_count: 201
- aihot_index_only_count: 24
- aihot_core_count: 21
- keyword_search_non_community_count: 95
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.751
- off_topic_title_count: 0
- core_pool_count: 21
- core_pool_min_effective: 1
- core_pool_min_default: 1
- usable_core_evidence_count: 21
- usable_core_evidence_min_effective: 1
- usable_core_evidence_min_default: 1
- core_evidence_strength_distribution: rich_evidence=21
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 21
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 6
- core_non_large_vendor_count: 15
- core_non_large_vendor_min_effective: 0
- core_non_large_vendor_min_default: 0
- core_large_vendor_ratio: 0.286
- aihot_resolved_evidence_count: 21
- aihot_resolved_core_count: 21
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- source_provider_recovery_status: recovered_by_fallback
- recovered_failed_sources_count: 13
- unrecovered_failed_sources_count: 0
- source_provider_failures_block_release: false
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 31 result(s): social_or_profile_source=8; missing_ai_anchor_in_result=7; noise_term:affiliate=6; noise_term:hiring=5; broad_list_or_market_report=4; noise_term:translation=1; source-artifact keyword: Anysearch business fallback for query "AI transformation workflow automation ROI customer case announced August 2026 (official customer story OR case study OR production deployment OR procurement contract OR workflow rollout OR adoption)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch tech fallback for query "AI transformation workflow automation ROI customer case announced August 2026 (official customer story OR case study OR production deployment OR procurement contract OR workflow rollout OR adoption)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "AI transformation workflow automation ROI customer case announced August 2026 (official customer story OR case study OR production deployment OR procurement contract OR workflow rollout OR adoption)": business: Anysearch Search service temporarily unavailable.; tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "AI transformation workflow automation ROI customer case announced August 2026 (official customer story OR case study OR production deployment OR procurement contract OR workflow rollout OR adoption)": Anysearch Search service temporarily unavailable.; targeted-refill pre-gate filtered 3 result(s): missing_ai_anchor_in_result=3; targeted pool/core refill cycle 1 added 14 item(s) for important_case=2/5
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (undefined): 0
- content_quality (undefined): 0
- coverage_scope (undefined): 0
- keyword_compliance (undefined): 0
- strategic_alignment (undefined): 0
- importance_readiness (10): 6.37

## Hard Gates

- pool_count_min: passed (227/15)
- routed_pool_count_min: passed (26/10)
- core_pool_min: passed (21/1)
- usable_core_evidence_min: passed (21/1)
- homepage_directory_core_max: passed (0/0)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)

## Diagnostics

- raw_count_min: passed (261/150)
- keyword_search_non_community_min: passed (95/6)
- ai_relevant_title_ratio_min: passed (0.75/0.7)
- off_topic_title_max: passed (0/3)
- importance_coverage_gaps: passed (none)
- pool_importance_coverage_gaps: warning (important_case=2/5)

## Risks

- pool_importance_coverage_gaps=important_case=2/5

## Recovered Diagnostics

- recovered_source_failures=13; status=recovered_by_fallback

## Skill Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow the V4 factual build to proceed with noted source-supply diagnostics.
- reasons: Pool importance coverage gaps remain

## Inputs

- structured_intake_file: 01-SiteV2/content/11-databases/data-center-v4/intake-v1/2026-08-08.json
- monitor_log_file: agent-workflow/reports/2026-08-08-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/source-intake-gate-v1.json

