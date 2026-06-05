# 2026-06-05 Guanlan Monitor Quality Gate

- generated_at: 2026-06-05T00:46:30.214Z
- attempt: 2/3
- status: passed
- total_score: 93.36
- pass_score_threshold: 80
- raw_count: 111
- pool_count: 44
- pool_index_count: 44
- routed_pool_count: 15
- index_only_pool_count: 29
- aihot_index_only_count: 29
- aihot_core_count: 5
- keyword_search_non_community_count: 32
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: B=68; S=22; C=15; A=6
- ai_relevant_title_ratio: 0.847
- off_topic_title_count: 0
- core_pool_count: 15
- usable_core_evidence_count: 15
- homepage_directory_core_count: 0
- m_source_only_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- failed_sources: keyword-search pre-gate filtered 5 result(s): missing_ai_anchor_in_result=5; Historical Raw dedupe removed 23 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 7.36

## Hard Gates

- raw_count_min: passed (111/50)
- pool_count_min: passed (44/15)
- routed_pool_count_min: passed (15/15)
- keyword_search_non_community_min: passed (32/6)
- ai_relevant_title_ratio_min: passed (0.85/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (15/5)
- usable_core_evidence_min: passed (15/5)
- homepage_directory_core_max: passed (0/0)
- m_source_only_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- failed_sources=3

## Skill Feedback

- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: degrade
- action: Allow downstream with explicit evidence gaps and lower claim strength.
- reasons: soft score below threshold

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-05-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-05-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-05-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

