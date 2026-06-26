# 2026-06-26 Guanlan Monitor Quality Gate

- generated_at: 2026-06-26T07:13:35.122Z
- attempt: 1/3
- status: passed
- production_weekday: friday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 86.51
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 190
- pool_count: 95
- pool_index_count: 95
- routed_pool_count: 70
- index_only_pool_count: 25
- aihot_index_only_count: 24
- aihot_core_count: 0
- keyword_search_non_community_count: 45
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: B=167; S=13; A=10
- ai_relevant_title_ratio: 0.879
- off_topic_title_count: 0
- core_pool_count: 30
- core_pool_min_effective: 30
- core_pool_min_default: 30
- usable_core_evidence_count: 30
- usable_core_evidence_min_effective: 30
- usable_core_evidence_min_default: 30
- homepage_directory_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_text_contamination_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 7
- core_non_large_vendor_count: 23
- core_non_large_vendor_min_effective: 20
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.233
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 12 result(s): missing_ai_anchor_in_result=5; noise_term:career=3; job_or_salary_page=2; noise_term:hiring=1; noise_term:jobs at=1; targeted-refill pre-gate filtered 3 result(s): missing_ai_anchor_in_result=3; targeted pool/core refill cycle 1 added 27 item(s) for core_pool=22/30; core_non_large=14/20
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 8.25
- importance_readiness (10): 7.26

## Hard Gates

- raw_count_min: passed (190/150)
- pool_count_min: passed (95/75)
- routed_pool_count_min: passed (70/60)
- keyword_search_non_community_min: passed (45/6)
- ai_relevant_title_ratio_min: passed (0.88/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (30/30)
- usable_core_evidence_min: passed (30/30)
- homepage_directory_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- core_large_vendor_max: passed (7/10)
- core_large_vendor_ratio_max: passed (0.23/0.35)
- core_non_large_vendor_min: passed (23/20)
- importance_coverage_gaps_must_be_none: passed (none; raw_sufficient=190)
- pool_importance_coverage_gaps_must_be_none: passed (none; raw_sufficient=190)

## Risks

- failed_sources=8
- theme_concentration_warning=warning: uncategorized concentration 55.3% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.

## Skill Feedback

- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: allow
- action: Allow Signal Card asset generation and frontstage release.
- reasons: all hard gates passed

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-26-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-26-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-26-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json
