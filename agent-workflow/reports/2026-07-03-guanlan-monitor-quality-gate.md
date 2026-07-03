# 2026-07-03 Guanlan Monitor Quality Gate

- generated_at: 2026-07-03T01:59:31.667Z
- attempt: 1/3
- status: passed
- production_weekday: friday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 95.43
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- raw_count: 136
- raw_count_release_override: raw_to_card_supply
- raw_to_card_supply_release: true
- pool_count: 125
- pool_index_count: 125
- routed_pool_count: 93
- index_only_pool_count: 32
- aihot_index_only_count: 29
- aihot_core_count: 20
- keyword_search_non_community_count: 37
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.816
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
- recovered_failed_sources_count: 16
- unrecovered_failed_sources_count: 0
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 23 result(s): missing_ai_anchor_in_result=14; noise_term:career=4; job_or_salary_page=2; noise_term:hiring=2; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 3 result(s): missing_ai_anchor_in_result=3; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=2/5; core_pool=26/30; core_non_large=16/20; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=1; noise_term:avatar=1; targeted raw-volume refill cycle 1 added 14 item(s) for raw_count=127/150; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=1; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 9 item(s) for raw_count=136/150
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 14.44
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 6.99

## Hard Gates

- raw_count_min: passed (136/150; released_by_raw_to_card_supply=true)
- pool_count_min: passed (125/75)
- routed_pool_count_min: passed (93/60)
- keyword_search_non_community_min: passed (37/6)
- ai_relevant_title_ratio_min: passed (0.82/0.7)
- off_topic_title_max: passed (0/3)
- unrecovered_failed_sources_max: passed (0/0; total=16; recovered=16)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- recovered_source_failures=16

## Skill Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- reasons: Raw < hard minimum

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-03-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-03-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-03-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

