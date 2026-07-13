# 2026-07-13 Guanlan Monitor Quality Gate

- generated_at: 2026-07-13T08:26:47.766Z
- attempt: 1/1
- status: passed
- production_weekday: monday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 93.08
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 101
- raw_count_release_override: raw_to_card_supply
- raw_to_card_supply_release: true
- pool_count: 93
- pool_index_count: 93
- routed_pool_count: 57
- index_only_pool_count: 36
- aihot_index_only_count: 24
- aihot_core_count: 13
- keyword_search_non_community_count: 20
- non_community_paths_hit: official_original, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.842
- off_topic_title_count: 0
- core_pool_count: 27
- core_pool_min_effective: 1
- core_pool_min_default: 1
- usable_core_evidence_count: 27
- usable_core_evidence_min_effective: 1
- usable_core_evidence_min_default: 1
- core_evidence_strength_distribution: rich_evidence=27
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 27
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 6
- core_non_large_vendor_count: 21
- core_non_large_vendor_min_effective: 0
- core_non_large_vendor_min_default: 0
- core_large_vendor_ratio: 0.222
- aihot_resolved_evidence_count: 24
- aihot_resolved_core_count: 13
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5; important_funding=3/5; important_vertical_solution=4/5
- source_provider_recovery_status: recovered_by_fallback
- recovered_failed_sources_count: 14
- unrecovered_failed_sources_count: 0
- source_provider_failures_block_release: false
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 33 result(s): missing_ai_anchor_in_result=13; job_or_salary_page=7; noise_term:career=6; broad_list_or_market_report=2; noise_term:affiliate=2; noise_term:hiring=2; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 3 result(s): broad_list_or_market_report=1; missing_ai_anchor_in_result=1; noise_term:hiring=1; targeted pool/core refill cycle 1 added 2 item(s) for important_case=2/5; important_funding=3/5; important_vertical_solution=4/5
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 13.04
- keyword_compliance (15): 13.88
- strategic_alignment (15): 15
- importance_readiness (10): 7.16

## Hard Gates

- pool_count_min: passed (93/15)
- routed_pool_count_min: passed (57/10)
- core_pool_min: passed (27/1)
- usable_core_evidence_min: passed (27/1)
- homepage_directory_core_max: passed (0/0)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)

## Diagnostics

- raw_count_min: passed (101/150; released_by_raw_to_card_supply=true)
- keyword_search_non_community_min: passed (20/6)
- ai_relevant_title_ratio_min: passed (0.84/0.7)
- off_topic_title_max: passed (0/3)
- importance_coverage_gaps: passed (none)
- pool_importance_coverage_gaps: warning (important_case=2/5; important_funding=3/5; important_vertical_solution=4/5)

## Risks

- pool_importance_coverage_gaps=important_case=2/5; important_funding=3/5; important_vertical_solution=4/5

## Recovered Diagnostics

- recovered_source_failures=14; status=recovered_by_fallback

## Skill Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- reasons: Raw below diagnostic target | Pool importance coverage gaps remain

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-13-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-13-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-13-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/business-signals-gate-v3.json

