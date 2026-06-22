# 2026-06-22 Guanlan Monitor Quality Gate

- generated_at: 2026-06-22T06:23:07.370Z
- attempt: 1/1
- status: passed
- production_weekday: monday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 93.31
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 227
- pool_count: 95
- pool_index_count: 95
- routed_pool_count: 78
- index_only_pool_count: 12
- aihot_index_only_count: 7
- aihot_core_count: 16
- keyword_search_non_community_count: 85
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: B=123; C=81; A=14; S=9
- ai_relevant_title_ratio: 0.815
- off_topic_title_count: 0
- core_pool_count: 31
- core_pool_min_effective: 30
- core_pool_min_default: 30
- usable_core_evidence_count: 31
- usable_core_evidence_min_effective: 30
- usable_core_evidence_min_default: 30
- homepage_directory_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 9
- core_non_large_vendor_count: 22
- core_non_large_vendor_min_effective: 20
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.290
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_technical_trend=4/5
- failed_sources: keyword-search pre-gate filtered 21 result(s): missing_ai_anchor_in_result=9; job_or_salary_page=6; noise_term:career=4; noise_term:hiring=1; noise_term:jobs at=1; RSS the-verge-ai: fetch failed; RSS latent-space-podcast: fetch failed; RSS mad-podcast: fetch failed; RSS ai-and-i-podcast: fetch failed; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=1; noise_term:definition=1; targeted pool/core refill cycle 1 added 42 item(s) for routed_pool=54/60; core_pool=20/30; core_non_large=10/20; targeted pool/core refill cycle 2 added 1 item(s) for important_technical_trend=4/5; targeted pool/core refill cycle 3 added 0 item(s) for important_technical_trend=4/5
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 7.31

## Hard Gates

- raw_count_min: passed (227/150)
- pool_count_min: passed (95/75)
- routed_pool_count_min: passed (78/60)
- keyword_search_non_community_min: passed (85/6)
- ai_relevant_title_ratio_min: passed (0.81/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (31/30)
- usable_core_evidence_min: passed (31/30)
- homepage_directory_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- core_large_vendor_max: passed (9/10)
- core_large_vendor_ratio_max: passed (0.29/0.35)
- core_non_large_vendor_min: passed (22/20)
- importance_coverage_gaps_must_be_none: passed (none; raw_sufficient=227)
- pool_importance_coverage_gaps_must_be_none: passed (important_technical_trend=4/5; raw_sufficient=227)

## Risks

- failed_sources=16
- pool_importance_coverage_gaps=important_technical_trend=4/5

## Skill Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- reasons: Pool importance coverage gaps remain

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-22-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-22-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-22-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

