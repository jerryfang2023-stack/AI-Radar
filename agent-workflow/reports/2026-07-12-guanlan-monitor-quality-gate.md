# 2026-07-12 Guanlan Monitor Quality Gate

- generated_at: 2026-07-12T06:10:52.428Z
- attempt: 1/1
- status: passed
- production_weekday: sunday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 83.29
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 62
- raw_count_release_override: raw_to_card_supply
- raw_to_card_supply_release: true
- pool_count: 60
- pool_index_count: 60
- routed_pool_count: 41
- index_only_pool_count: 19
- aihot_index_only_count: 17
- aihot_core_count: 14
- keyword_search_non_community_count: 13
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.806
- off_topic_title_count: 0
- core_pool_count: 20
- core_pool_min_effective: 1
- core_pool_min_default: 1
- usable_core_evidence_count: 20
- usable_core_evidence_min_effective: 1
- usable_core_evidence_min_default: 1
- core_evidence_strength_distribution: rich_evidence=20
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 20
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 8
- core_non_large_vendor_count: 12
- core_non_large_vendor_min_effective: 0
- core_non_large_vendor_min_default: 0
- core_large_vendor_ratio: 0.400
- aihot_resolved_evidence_count: 24
- aihot_resolved_core_count: 14
- importance_coverage_gaps: important_case=2/3; important_funding=2/3
- pool_importance_coverage_gaps: important_case=2/5; important_funding=2/5
- source_provider_recovery_status: recovered_by_fallback
- recovered_failed_sources_count: 8
- unrecovered_failed_sources_count: 0
- source_provider_failures_block_release: false
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 32 result(s): missing_ai_anchor_in_result=13; noise_term:career=8; job_or_salary_page=7; broad_list_or_market_report=1; noise_term:hiring=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS dataiku-blog: HTTP 404
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 8.48
- keyword_compliance (15): 13.88
- strategic_alignment (15): 9.6
- importance_readiness (10): 7.33

## Hard Gates

- pool_count_min: passed (60/15)
- routed_pool_count_min: passed (41/10)
- core_pool_min: passed (20/1)
- usable_core_evidence_min: passed (20/1)
- homepage_directory_core_max: passed (0/0)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)

## Diagnostics

- raw_count_min: passed (62/150; released_by_raw_to_card_supply=true)
- keyword_search_non_community_min: passed (13/6)
- ai_relevant_title_ratio_min: passed (0.81/0.7)
- off_topic_title_max: passed (0/3)
- importance_coverage_gaps: warning (important_case=2/3; important_funding=2/3)
- pool_importance_coverage_gaps: warning (important_case=2/5; important_funding=2/5)

## Risks

- importance_coverage_gaps=important_case=2/3; important_funding=2/3
- pool_importance_coverage_gaps=important_case=2/5; important_funding=2/5
- core_large_vendor=8/10; ratio=0.40/0.35

## Recovered Diagnostics

- recovered_source_failures=8; status=recovered_by_fallback

## Skill Feedback

- Repair Raw importance coverage before downstream use.
- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- reasons: Raw below diagnostic target | Raw importance coverage gaps remain | Pool importance coverage gaps remain

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-12-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-12-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-12-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/business-signals-gate-v3.json

