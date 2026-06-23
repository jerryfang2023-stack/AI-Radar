# 2026-06-23 Guanlan Monitor Quality Gate

- generated_at: 2026-06-23T02:03:46.929Z
- attempt: 1/3
- status: passed
- production_weekday: tuesday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 92.77
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 190
- pool_count: 95
- pool_index_count: 95
- routed_pool_count: 72
- index_only_pool_count: 23
- aihot_index_only_count: 23
- aihot_core_count: 41
- keyword_search_non_community_count: 15
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, procurement_marketplace, a_media_gdelt
- source_level_distribution: C=86; B=68; A=21; S=15
- ai_relevant_title_ratio: 0.805
- off_topic_title_count: 0
- core_pool_count: 45
- core_pool_min_effective: 30
- core_pool_min_default: 30
- usable_core_evidence_count: 45
- usable_core_evidence_min_effective: 30
- usable_core_evidence_min_default: 30
- homepage_directory_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 9
- core_non_large_vendor_count: 36
- core_non_large_vendor_min_effective: 20
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.200
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 12 result(s): missing_ai_anchor_in_result=4; noise_term:career=4; job_or_salary_page=2; noise_term:hiring=2
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 13.88
- strategic_alignment (15): 15
- importance_readiness (10): 7.89

## Hard Gates

- raw_count_min: passed (190/150)
- pool_count_min: passed (95/75)
- routed_pool_count_min: passed (72/60)
- keyword_search_non_community_min: passed (15/6)
- ai_relevant_title_ratio_min: passed (0.81/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (45/30)
- usable_core_evidence_min: passed (45/30)
- homepage_directory_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- core_large_vendor_max: passed (9/10)
- core_large_vendor_ratio_max: passed (0.20/0.35)
- core_non_large_vendor_min: passed (36/20)
- importance_coverage_gaps_must_be_none: passed (none; raw_sufficient=190)
- pool_importance_coverage_gaps_must_be_none: passed (none; raw_sufficient=190)

## Risks

- failed_sources=4

## Skill Feedback

- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: allow
- action: Allow Signal Card asset generation and frontstage release.
- reasons: all hard gates passed

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-23-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-23-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-23-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

