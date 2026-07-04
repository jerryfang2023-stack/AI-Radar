# 2026-07-04 Guanlan Monitor Quality Gate

- generated_at: 2026-07-04T04:50:55.480Z
- attempt: 1/1
- status: passed
- production_weekday: saturday
- weekend_policy: active
- weekend_policy_note: light weekend quantity floors applied; evidence-quality gates and downstream card/frontstage gates remain required
- total_score: 93.79
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 231
- raw_count_release_override: false
- raw_to_card_supply_release: true
- pool_count: 127
- pool_index_count: 127
- routed_pool_count: 81
- index_only_pool_count: 46
- aihot_index_only_count: 31
- aihot_core_count: 17
- keyword_search_non_community_count: 12
- non_community_paths_hit: developer_ecosystem, capital_startup, industry_landing, procurement_marketplace
- ai_relevant_title_ratio: 0.814
- off_topic_title_count: 0
- core_pool_count: 33
- core_pool_min_effective: 18
- core_pool_min_default: 30
- usable_core_evidence_count: 33
- usable_core_evidence_min_effective: 18
- usable_core_evidence_min_default: 30
- core_evidence_strength_distribution: rich_evidence=33
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 33
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 8
- core_non_large_vendor_count: 25
- core_non_large_vendor_min_effective: 12
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.242
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=4/5
- recovered_failed_sources_count: 11
- unrecovered_failed_sources_count: 0
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 12 result(s): missing_ai_anchor_in_result=7; job_or_salary_page=2; noise_term:career=1; noise_term:hiring=1; noise_term:jobs at=1; source-artifact rss: RSS latent-space-podcast: fetch failed; source-artifact rss: RSS training-data-podcast: fetch failed; source-artifact rss: RSS mad-podcast: fetch failed; source-artifact rss: RSS ai-and-i-podcast: fetch failed; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_case=4/5
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 12.75
- strategic_alignment (15): 15
- importance_readiness (10): 7.04

## Hard Gates

- raw_count_min: passed (231/120; default=150)
- pool_count_min: passed (127/75)
- routed_pool_count_min: passed (81/60)
- keyword_search_non_community_min: passed (12/6)
- ai_relevant_title_ratio_min: passed (0.81/0.7)
- off_topic_title_max: passed (0/3)
- unrecovered_failed_sources_max: passed (0/0; total=11; recovered=11)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (important_case=4/5; raw_sufficient=231)

## Risks

- recovered_source_failures=11
- pool_importance_coverage_gaps=important_case=4/5
- weekend_policy=passed; weekday=saturday; pool_gap_min=2

## Skill Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow
- action: Allow Signal Card asset generation and frontstage release.
- reasons: all hard gates passed

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-04-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-04-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-04-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

