# 2026-05-23 Guanlan Monitor Quality Gate

- generated_at: 2026-05-23T04:13:42.199Z
- attempt: 1/1
- status: passed
- total_score: 90.32
- pass_score_threshold: 80
- raw_count: 120
- pool_count: 43
- pool_index_count: 43
- routed_pool_count: 15
- index_only_pool_count: 28
- aihot_index_only_count: 28
- aihot_core_count: 0
- keyword_search_non_community_count: 64
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: B=79; S=15; A=13; C=13
- ai_relevant_title_ratio: 0.808
- off_topic_title_count: 0
- core_pool_count: 11
- usable_core_evidence_count: 11
- homepage_directory_core_count: 0
- m_source_only_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- failed_sources: keyword-search pre-gate filtered 17 result(s): job_or_salary_page=11; noise_term:definition=2; noise_term:translation=2; noise_term:avatar=1; noise_term:dictionary=1; NewsAPI fallback for query "AI Agent funding enterprise customers": fetch failed; NewsAPI fallback for query "pre-seed AI startup vertical AI design partner": fetch failed; NewsAPI fallback for query "model release inference cost reduction enterprise adoption": fetch failed
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 12.3
- importance_readiness (10): 7.02

## Hard Gates

- raw_count_min: passed (120/50)
- pool_count_min: passed (43/15)
- routed_pool_count_min: passed (15/15)
- keyword_search_non_community_min: passed (64/6)
- ai_relevant_title_ratio_min: passed (0.81/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (11/5)
- usable_core_evidence_min: passed (11/5)
- homepage_directory_core_max: passed (0/0)
- m_source_only_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- failed_sources=8

## Skill Feedback

- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: degrade
- action: Allow downstream with explicit evidence gaps and lower claim strength.
- reasons: soft score below threshold

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-05-23-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-05-23-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-05-23-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

