# 2026-07-07 Guanlan Monitor Quality Gate

- generated_at: 2026-07-07T02:01:23.898Z
- attempt: 1/3
- status: passed
- production_weekday: tuesday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 82.69
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- raw_count: 97
- raw_count_release_override: raw_to_card_supply
- raw_to_card_supply_release: true
- pool_count: 90
- pool_index_count: 90
- routed_pool_count: 65
- index_only_pool_count: 25
- aihot_index_only_count: 0
- aihot_core_count: 0
- keyword_search_non_community_count: 30
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.588
- off_topic_title_count: 0
- core_pool_count: 28
- core_pool_min_effective: 30
- core_pool_min_default: 30
- usable_core_evidence_count: 28
- usable_core_evidence_min_effective: 30
- usable_core_evidence_min_default: 30
- core_evidence_strength_distribution: rich_evidence=28
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 28
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 6
- core_non_large_vendor_count: 22
- core_non_large_vendor_min_effective: 20
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.214
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- recovered_failed_sources_count: 27
- unrecovered_failed_sources_count: 0
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-07): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT (all): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT API unavailable; used fallback source search (10 item(s), 21 filtered); source-artifact keyword: keyword-search pre-gate filtered 52 result(s): social_or_profile_source=26; missing_ai_anchor_in_result=16; broad_list_or_market_report=5; noise_term:career=4; noise_term:hiring=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 1 result(s): broad_list_or_market_report=1; targeted pool/core refill cycle 1 added 1 item(s) for important_case=3/5; routed_pool=55/60; core_pool=25/30; targeted pool/core refill cycle 2 added 0 item(s) for important_case=4/5; routed_pool=56/60; core_pool=25/30; targeted-refill pre-gate filtered 14 result(s): social_or_profile_source=6; broad_list_or_market_report=4; missing_ai_anchor_in_result=3; noise_term:avatar=1; targeted raw-volume refill cycle 1 added 6 item(s) for raw_count=92/150; targeted-refill pre-gate filtered 13 result(s): social_or_profile_source=7; broad_list_or_market_report=4; missing_ai_anchor_in_result=2; targeted raw-volume refill cycle 2 added 5 item(s) for raw_count=97/150
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 23.25
- content_quality (20): 17.59
- coverage_scope (15): 12.88
- keyword_compliance (15): 13.88
- strategic_alignment (15): 8.25
- importance_readiness (10): 6.84

## Hard Gates

- raw_count_min: passed (97/150; released_by_raw_to_card_supply=true)
- pool_count_min: passed (90/75)
- routed_pool_count_min: passed (65/60)
- keyword_search_non_community_min: passed (30/6)
- ai_relevant_title_ratio_min: passed (0.59/0.7; diagnostic_released_by_raw_to_card_supply=true)
- off_topic_title_max: passed (0/3)
- unrecovered_failed_sources_max: passed (0/0; total=27; recovered=27)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- recovered_source_failures=27
- theme_concentration_warning=warning: uncategorized concentration 59.8% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.

## Skill Feedback

- Tighten Raw AI relevance anchors and noise filters before accepting candidates.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- reasons: Raw < hard minimum | AI relevance insufficient

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-07-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-07-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-07-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

