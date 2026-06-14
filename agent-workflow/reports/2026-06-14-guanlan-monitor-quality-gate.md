# 2026-06-14 Guanlan Monitor Quality Gate

- generated_at: 2026-06-14T04:27:51.801Z
- attempt: 1/3
- status: passed
- production_weekday: sunday
- weekend_policy: active
- weekend_policy_note: light weekend quantity floors applied; evidence-quality gates and downstream card/frontstage gates remain required
- total_score: 88.94
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- raw_count: 188
- pool_count: 95
- pool_index_count: 95
- routed_pool_count: 66
- index_only_pool_count: 29
- aihot_index_only_count: 27
- aihot_core_count: 17
- keyword_search_non_community_count: 24
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: C=92; B=74; A=19; S=3
- ai_relevant_title_ratio: 0.835
- off_topic_title_count: 0
- core_pool_count: 23
- core_pool_min_effective: 18
- core_pool_min_default: 30
- usable_core_evidence_count: 23
- usable_core_evidence_min_effective: 18
- usable_core_evidence_min_default: 30
- homepage_directory_core_count: 0
- m_source_only_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 6
- core_non_large_vendor_count: 17
- core_non_large_vendor_min_effective: 12
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.261
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5; important_funding=4/5
- failed_sources: keyword-search pre-gate filtered 8 result(s): missing_ai_anchor_in_result=6; directory_or_search_page=1; job_or_salary_page=1; Historical Raw dedupe removed 2 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.; RSS microsoft-ai-blog: HTTP 410; RSS import-ai-newsletter: HTTP 403
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 18.38
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 5.57

## Hard Gates

- raw_count_min: passed (188/150)
- pool_count_min: passed (95/75)
- routed_pool_count_min: passed (66/60)
- keyword_search_non_community_min: passed (24/6)
- ai_relevant_title_ratio_min: passed (0.84/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (23/18; default=30)
- usable_core_evidence_min: passed (23/18; default=30)
- homepage_directory_core_max: passed (0/0)
- m_source_only_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- core_large_vendor_max: passed (6/10)
- core_large_vendor_ratio_max: passed (0.26/0.35)
- core_non_large_vendor_min: passed (17/12; default=20)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (important_case=3/5; important_funding=4/5; weekend_min=2)

## Risks

- failed_sources=7
- pool_importance_coverage_gaps=important_case=3/5; important_funding=4/5
- weekend_policy=passed; weekday=sunday; effective_core_pool_min=18; effective_usable_core_evidence_min=18; effective_core_non_large_vendor_min=12; pool_gap_min=2
- weekend_default_core_pool_shortfall=23/30
- weekend_default_usable_core_evidence_shortfall=23/30
- weekend_default_core_non_large_vendor_shortfall=17/20

## Skill Feedback

- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: allow
- action: Allow Signal Card asset generation and frontstage release.
- reasons: all hard gates passed

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-14-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-14-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-14-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

