# 2026-07-04 Guanlan Monitor Quality Gate

- generated_at: 2026-07-04T04:35:48.462Z
- attempt: 1/3
- status: passed
- production_weekday: saturday
- weekend_policy: active
- weekend_policy_note: light weekend quantity floors applied; evidence-quality gates and downstream card/frontstage gates remain required
- total_score: 82.86
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 139
- raw_count_release_override: false
- raw_to_card_supply_release: true
- pool_count: 92
- pool_index_count: 92
- routed_pool_count: 82
- index_only_pool_count: 10
- aihot_index_only_count: 0
- aihot_core_count: 0
- keyword_search_non_community_count: 19
- non_community_paths_hit: official_original, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.849
- off_topic_title_count: 0
- core_pool_count: 21
- core_pool_min_effective: 18
- core_pool_min_default: 30
- usable_core_evidence_count: 21
- usable_core_evidence_min_effective: 18
- usable_core_evidence_min_default: 30
- homepage_directory_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_text_contamination_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 4
- core_non_large_vendor_count: 17
- core_non_large_vendor_min_effective: 12
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.190
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=2/5
- recovered_failed_sources_count: 26
- unrecovered_failed_sources_count: 0
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-04): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (all): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact keyword: keyword-search pre-gate filtered 21 result(s): missing_ai_anchor_in_result=11; noise_term:career=4; job_or_salary_page=3; noise_term:compensation=1; noise_term:hiring=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 1 added 1 item(s) for important_case=2/5; core_pool=17/30; core_non_large=13/20; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 2 added 1 item(s) for important_case=2/5; core_pool=18/30; core_non_large=13/20; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 3 added 0 item(s) for important_case=2/5; core_pool=18/30; core_non_large=13/20; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=5; targeted raw-volume refill cycle 1 added 9 item(s) for raw_count=139/150; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted raw-volume refill cycle 2 added 0 item(s) for raw_count=139/150
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 20.63
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 13.88
- strategic_alignment (15): 8.25
- importance_readiness (10): 5.11

## Hard Gates

- raw_count_min: passed (139/120; default=150)
- pool_count_min: passed (92/75)
- routed_pool_count_min: passed (82/60)
- keyword_search_non_community_min: passed (19/6)
- ai_relevant_title_ratio_min: passed (0.85/0.7)
- off_topic_title_max: passed (0/3)
- unrecovered_failed_sources_max: passed (0/0; total=26; recovered=26)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (important_case=2/5; raw_sufficient=139)

## Risks

- recovered_source_failures=26
- theme_concentration_warning=warning: uncategorized concentration 66.9% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- pool_importance_coverage_gaps=important_case=2/5
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

