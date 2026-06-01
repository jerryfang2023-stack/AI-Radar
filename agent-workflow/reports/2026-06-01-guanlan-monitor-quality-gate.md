# 2026-06-01 Guanlan Monitor Quality Gate

- generated_at: 2026-06-01T07:38:18.955Z
- attempt: 1/3
- status: passed
- total_score: 95.2
- pass_score_threshold: 80
- raw_count: 120
- pool_count: 40
- pool_index_count: 40
- routed_pool_count: 32
- index_only_pool_count: 8
- aihot_index_only_count: 8
- aihot_core_count: 14
- keyword_search_non_community_count: 21
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: B=38; C=38; A=28; S=16
- ai_relevant_title_ratio: 0.783
- off_topic_title_count: 0
- core_pool_count: 32
- usable_core_evidence_count: 32
- homepage_directory_core_count: 0
- m_source_only_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- failed_sources: keyword-search pre-gate filtered 12 result(s): job_or_salary_page=9; noise_term:definition=2; noise_term:translation=1; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 9.2

## Hard Gates

- raw_count_min: passed (120/50)
- pool_count_min: passed (40/15)
- routed_pool_count_min: passed (32/15)
- keyword_search_non_community_min: passed (21/6)
- ai_relevant_title_ratio_min: passed (0.78/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (32/5)
- usable_core_evidence_min: passed (32/5)
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

- raw_file: 01-SiteV2/content/01-raw/2026-06-01-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-01-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-01-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

