# 2026-07-20 Guanlan Monitor Quality Gate

- generated_at: 2026-07-20T03:57:16.162Z
- attempt: 1/1
- status: passed
- production_weekday: monday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 95.53
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 116
- raw_count_release_override: raw_to_card_supply
- raw_to_card_supply_release: true
- pool_count: 108
- pool_index_count: 108
- routed_pool_count: 89
- index_only_pool_count: 19
- aihot_index_only_count: 16
- aihot_core_count: 37
- keyword_search_non_community_count: 31
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.767
- off_topic_title_count: 0
- core_pool_count: 51
- core_pool_min_effective: 1
- core_pool_min_default: 1
- usable_core_evidence_count: 51
- usable_core_evidence_min_effective: 1
- usable_core_evidence_min_default: 1
- core_evidence_strength_distribution: rich_evidence=51
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 51
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 4
- core_non_large_vendor_count: 47
- core_non_large_vendor_min_effective: 0
- core_non_large_vendor_min_default: 0
- core_large_vendor_ratio: 0.078
- aihot_resolved_evidence_count: 41
- aihot_resolved_core_count: 37
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=3/5; important_funding=2/5
- source_provider_recovery_status: recovered_by_fallback
- recovered_failed_sources_count: 16
- unrecovered_failed_sources_count: 0
- source_provider_failures_block_release: false
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 43 result(s): missing_ai_anchor_in_result=12; noise_term:career=9; broad_list_or_market_report=7; job_or_salary_page=7; noise_term:hiring=3; social_or_profile_source=3; directory_or_search_page=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=1; missing_ai_anchor_in_result=1; noise_term:career=1; noise_term:hiring=1; targeted pool/core refill cycle 1 added 6 item(s) for important_case=3/5; important_funding=1/5; important_vertical_solution=4/5
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 13.64
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 7.89

## Hard Gates

- pool_count_min: passed (108/15)
- routed_pool_count_min: passed (89/10)
- core_pool_min: passed (51/1)
- usable_core_evidence_min: passed (51/1)
- homepage_directory_core_max: passed (0/0)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)

## Diagnostics

- raw_count_min: passed (116/150; released_by_raw_to_card_supply=true)
- keyword_search_non_community_min: passed (31/6)
- ai_relevant_title_ratio_min: passed (0.77/0.7)
- off_topic_title_max: passed (0/3)
- importance_coverage_gaps: passed (none)
- pool_importance_coverage_gaps: warning (important_case=3/5; important_funding=2/5)

## Risks

- pool_importance_coverage_gaps=important_case=3/5; important_funding=2/5

## Recovered Diagnostics

- recovered_source_failures=16; status=recovered_by_fallback

## Skill Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- reasons: Raw below diagnostic target | Pool importance coverage gaps remain

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-20-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-20-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-20-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/business-signals-gate-v3.json

