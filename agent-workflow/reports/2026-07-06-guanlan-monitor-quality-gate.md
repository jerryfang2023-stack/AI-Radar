# 2026-07-06 Guanlan Monitor Quality Gate

- generated_at: 2026-07-06T02:21:27.246Z
- attempt: 3/3
- status: passed
- production_weekday: monday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 95.09
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- raw_count: 111
- raw_count_release_override: raw_to_card_supply
- raw_to_card_supply_release: true
- pool_count: 102
- pool_index_count: 102
- routed_pool_count: 81
- index_only_pool_count: 21
- aihot_index_only_count: 15
- aihot_core_count: 12
- keyword_search_non_community_count: 63
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.847
- off_topic_title_count: 0
- core_pool_count: 42
- core_pool_min_effective: 30
- core_pool_min_default: 30
- usable_core_evidence_count: 42
- usable_core_evidence_min_effective: 30
- usable_core_evidence_min_default: 30
- core_evidence_strength_distribution: rich_evidence=42
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 42
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 10
- core_non_large_vendor_count: 32
- core_non_large_vendor_min_effective: 20
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.238
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- recovered_failed_sources_count: 17
- unrecovered_failed_sources_count: 0
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 53 result(s): missing_ai_anchor_in_result=28; noise_term:career=10; job_or_salary_page=9; noise_term:hiring=3; noise_term:job description=2; noise_term:jobs at=1; source-artifact keyword: Anysearch documented-payload retry for query "forward deployed engineer AI customer deployment (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; source-artifact rss: RSS tigera-blog: HTTP 415; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=3; noise_term:avatar=1; noise_term:career=1; targeted raw-volume refill cycle 1 added 13 item(s) for raw_count=108/150; targeted-refill pre-gate filtered 6 result(s): missing_ai_anchor_in_result=5; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 3 item(s) for raw_count=111/150
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 13.44
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 7.65

## Hard Gates

- raw_count_min: passed (111/150; released_by_raw_to_card_supply=true)
- pool_count_min: passed (102/75)
- routed_pool_count_min: passed (81/60)
- keyword_search_non_community_min: passed (63/6)
- ai_relevant_title_ratio_min: passed (0.85/0.7)
- off_topic_title_max: passed (0/3)
- unrecovered_failed_sources_max: passed (0/0; total=17; recovered=17)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- recovered_source_failures=17

## Skill Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- reasons: Raw < hard minimum

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-06-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-06-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-06-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

