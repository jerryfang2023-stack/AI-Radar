# 2026-06-10 Guanlan Monitor Quality Gate

- generated_at: 2026-06-10T02:25:37.931Z
- attempt: 3/3
- status: failed
- total_score: 91.1
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- raw_count: 185
- pool_count: 89
- pool_index_count: 89
- routed_pool_count: 60
- index_only_pool_count: 29
- aihot_index_only_count: 29
- aihot_core_count: 21
- keyword_search_non_community_count: 16
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: C=85; B=74; A=13; S=13
- ai_relevant_title_ratio: 0.897
- off_topic_title_count: 0
- core_pool_count: 30
- usable_core_evidence_count: 30
- homepage_directory_core_count: 0
- m_source_only_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 5
- core_non_large_vendor_count: 25
- core_large_vendor_ratio: 0.167
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- failed_sources: keyword-search pre-gate filtered 11 result(s): missing_ai_anchor_in_result=7; job_or_salary_page=2; noise_term:compensation=1; noise_term:hiring=1; Search cross-entry dedupe removed 5 duplicate provider hits before Raw selection.; RSS import-ai-newsletter: HTTP 403
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 12.75
- importance_readiness (10): 7.35

## Hard Gates

- raw_count_min: passed (185/150)
- pool_count_min: passed (89/75)
- routed_pool_count_min: passed (60/60)
- keyword_search_non_community_min: passed (16/6)
- ai_relevant_title_ratio_min: passed (0.90/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (30/30)
- usable_core_evidence_min: passed (30/30)
- homepage_directory_core_max: passed (0/0)
- m_source_only_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- core_large_vendor_max: passed (5/10)
- core_large_vendor_ratio_max: passed (0.17/0.35)
- core_non_large_vendor_min: passed (25/20)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: failed (important_case=2/5)

## Risks

- hard_gates_failed=pool_importance_coverage_gaps_must_be_none
- failed_sources=6
- theme_concentration_warning=warning: 技术迭代信号 concentration 42.7% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- pool_importance_coverage_gaps=important_case=2/5

## Skill Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: pause
- action: Pause Signal Card asset generation and frontstage release until repair; only Watchlist / User Feedback use is allowed.
- reasons: Pool importance coverage gaps remain

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-10-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-10-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-10-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

