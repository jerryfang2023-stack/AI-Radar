# 2026-06-24 Guanlan Monitor Quality Gate

- generated_at: 2026-06-24T01:53:52.716Z
- attempt: 1/3
- status: passed
- production_weekday: wednesday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 92.06
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- raw_count: 190
- pool_count: 95
- pool_index_count: 95
- routed_pool_count: 60
- index_only_pool_count: 30
- aihot_index_only_count: 28
- aihot_core_count: 20
- keyword_search_non_community_count: 21
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: C=85; B=81; S=15; A=9
- ai_relevant_title_ratio: 0.789
- off_topic_title_count: 1
- core_pool_count: 31
- core_pool_min_effective: 30
- core_pool_min_default: 30
- usable_core_evidence_count: 31
- usable_core_evidence_min_effective: 30
- usable_core_evidence_min_default: 30
- homepage_directory_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_text_contamination_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 8
- core_non_large_vendor_count: 23
- core_non_large_vendor_min_effective: 20
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.258
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 15 result(s): noise_term:career=5; job_or_salary_page=4; missing_ai_anchor_in_result=4; noise_term:definition=1; noise_term:hiring=1; targeted pool/core refill cycle 1 added 2 item(s) for important_funding=4/5; core_pool=29/30; core_non_large=19/20
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21
- content_quality (20): 18.75
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 7.31

## Hard Gates

- raw_count_min: passed (190/150)
- pool_count_min: passed (95/75)
- routed_pool_count_min: passed (60/60)
- keyword_search_non_community_min: passed (21/6)
- ai_relevant_title_ratio_min: passed (0.79/0.7)
- off_topic_title_max: passed (1/3)
- core_pool_min: passed (31/30)
- usable_core_evidence_min: passed (31/30)
- homepage_directory_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- core_large_vendor_max: passed (8/10)
- core_large_vendor_ratio_max: passed (0.26/0.35)
- core_non_large_vendor_min: passed (23/20)
- importance_coverage_gaps_must_be_none: passed (none; raw_sufficient=190)
- pool_importance_coverage_gaps_must_be_none: passed (none; raw_sufficient=190)

## Risks

- failed_sources=8

## Skill Feedback

- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: allow
- action: Allow Signal Card asset generation and frontstage release.
- reasons: all hard gates passed

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-24-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-24-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-24-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

