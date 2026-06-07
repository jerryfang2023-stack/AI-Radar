# 2026-06-07 Guanlan Monitor Quality Gate

- generated_at: 2026-06-07T02:44:54.991Z
- attempt: 1/3
- status: passed
- total_score: 94.8
- pass_score_threshold: 80
- raw_count: 117
- pool_count: 40
- pool_index_count: 40
- routed_pool_count: 28
- index_only_pool_count: 12
- aihot_index_only_count: 12
- aihot_core_count: 20
- keyword_search_non_community_count: 13
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: B=53; C=53; A=10; S=1
- ai_relevant_title_ratio: 0.803
- off_topic_title_count: 0
- core_pool_count: 28
- usable_core_evidence_count: 28
- homepage_directory_core_count: 0
- m_source_only_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- failed_sources: keyword-search pre-gate filtered 6 result(s): missing_ai_anchor_in_result=5; job_or_salary_page=1; Historical Raw dedupe removed 3 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 8.8

## Hard Gates

- raw_count_min: passed (117/50)
- pool_count_min: passed (40/15)
- routed_pool_count_min: passed (28/15)
- keyword_search_non_community_min: passed (13/6)
- ai_relevant_title_ratio_min: passed (0.80/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (28/5)
- usable_core_evidence_min: passed (28/5)
- homepage_directory_core_max: passed (0/0)
- m_source_only_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- failed_sources=4

## Skill Feedback

- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: degrade
- action: Allow downstream with explicit evidence gaps and lower claim strength.
- reasons: soft score below threshold

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-07-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-07-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-07-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

