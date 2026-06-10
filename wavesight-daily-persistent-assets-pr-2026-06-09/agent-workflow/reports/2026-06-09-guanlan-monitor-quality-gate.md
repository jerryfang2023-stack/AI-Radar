# 2026-06-09 Guanlan Monitor Quality Gate

- generated_at: 2026-06-09T02:33:36.779Z
- attempt: 2/3
- status: passed
- total_score: 93.38
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- raw_count: 186
- pool_count: 90
- pool_index_count: 90
- routed_pool_count: 60
- index_only_pool_count: 30
- aihot_index_only_count: 30
- aihot_core_count: 20
- keyword_search_non_community_count: 19
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: B=100; C=61; A=14; S=11
- ai_relevant_title_ratio: 0.828
- off_topic_title_count: 0
- core_pool_count: 31
- usable_core_evidence_count: 31
- homepage_directory_core_count: 0
- m_source_only_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 8
- core_non_large_vendor_count: 23
- core_large_vendor_ratio: 0.258
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- failed_sources: keyword-search pre-gate filtered 9 result(s): missing_ai_anchor_in_result=6; job_or_salary_page=2; noise_term:hiring=1; Search cross-entry dedupe removed 6 duplicate provider hits before Raw selection.; RSS import-ai-newsletter: HTTP 403
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 7.38

## Hard Gates

- raw_count_min: passed (186/150)
- pool_count_min: passed (90/75)
- routed_pool_count_min: passed (60/60)
- keyword_search_non_community_min: passed (19/6)
- ai_relevant_title_ratio_min: passed (0.83/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (31/30)
- usable_core_evidence_min: passed (31/30)
- homepage_directory_core_max: passed (0/0)
- m_source_only_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- core_large_vendor_max: passed (8/10)
- core_large_vendor_ratio_max: passed (0.26/0.35)
- core_non_large_vendor_min: passed (23/20)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- failed_sources=5

## Skill Feedback

- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: allow
- action: Allow Signal Card asset generation and frontstage release.
- reasons: all hard gates passed

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-09-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-09-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-09-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

