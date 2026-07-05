# 2026-07-05 Guanlan Monitor Quality Gate

- generated_at: 2026-07-05T02:07:33.398Z
- attempt: 2/3
- status: passed
- production_weekday: sunday
- weekend_policy: active
- weekend_policy_note: light weekend quantity floors applied; evidence-quality gates and downstream card/frontstage gates remain required
- total_score: 86.92
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- raw_count: 116
- raw_count_release_override: raw_to_card_supply
- raw_to_card_supply_release: true
- pool_count: 111
- pool_index_count: 111
- routed_pool_count: 68
- index_only_pool_count: 43
- aihot_index_only_count: 0
- aihot_core_count: 0
- keyword_search_non_community_count: 37
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.586
- off_topic_title_count: 0
- core_pool_count: 23
- core_pool_min_effective: 18
- core_pool_min_default: 30
- usable_core_evidence_count: 23
- usable_core_evidence_min_effective: 18
- usable_core_evidence_min_default: 30
- core_evidence_strength_distribution: rich_evidence=23
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 23
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 6
- core_non_large_vendor_count: 17
- core_non_large_vendor_min_effective: 12
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.261
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- recovered_failed_sources_count: 22
- unrecovered_failed_sources_count: 0
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-05): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (all): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact keyword: keyword-search pre-gate filtered 39 result(s): missing_ai_anchor_in_result=17; noise_term:career=9; job_or_salary_page=6; noise_term:hiring=4; noise_term:job description=2; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=3/5; routed_pool=55/60; core_pool=16/30; core_non_large=9/20; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=2; noise_term:avatar=1; noise_term:career=1; noise_term:hiring=1; targeted raw-volume refill cycle 1 added 7 item(s) for raw_count=110/150; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=3; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 6 item(s) for raw_count=116/150
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21.38
- content_quality (20): 17.56
- coverage_scope (15): 14.8
- keyword_compliance (15): 15
- strategic_alignment (15): 12.75
- importance_readiness (10): 5.43

## Hard Gates

- raw_count_min: passed (116/120; default=150; released_by_raw_to_card_supply=true)
- pool_count_min: passed (111/75)
- routed_pool_count_min: passed (68/60)
- keyword_search_non_community_min: passed (37/6)
- ai_relevant_title_ratio_min: passed (0.59/0.7; diagnostic_released_by_raw_to_card_supply=true)
- off_topic_title_max: passed (0/3)
- unrecovered_failed_sources_max: passed (0/0; total=22; recovered=22)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- recovered_source_failures=22
- theme_concentration_warning=warning: uncategorized concentration 59.5% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- weekend_policy=passed; weekday=sunday; pool_gap_min=2

## Skill Feedback

- Tighten Raw AI relevance anchors and noise filters before accepting candidates.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- reasons: Raw < hard minimum | AI relevance insufficient

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-05-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-05-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-05-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

