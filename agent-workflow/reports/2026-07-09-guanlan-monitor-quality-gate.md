# 2026-07-09 Guanlan Monitor Quality Gate

- generated_at: 2026-07-09T04:22:06.413Z
- attempt: 1/1
- status: passed
- production_weekday: thursday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 91.44
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 124
- raw_count_release_override: raw_to_card_supply
- raw_to_card_supply_release: true
- pool_count: 118
- pool_index_count: 118
- routed_pool_count: 104
- index_only_pool_count: 14
- aihot_index_only_count: 0
- aihot_core_count: 2
- keyword_search_non_community_count: 81
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.903
- off_topic_title_count: 0
- core_pool_count: 32
- core_pool_min_effective: 1
- core_pool_min_default: 1
- usable_core_evidence_count: 32
- usable_core_evidence_min_effective: 1
- usable_core_evidence_min_default: 1
- core_evidence_strength_distribution: rich_evidence=32
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 32
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 7
- core_non_large_vendor_count: 25
- core_non_large_vendor_min_effective: 0
- core_non_large_vendor_min_default: 0
- core_large_vendor_ratio: 0.219
- aihot_resolved_evidence_count: 6
- aihot_resolved_core_count: 2
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- source_provider_recovery_status: recovered_by_fallback
- recovered_failed_sources_count: 36
- unrecovered_failed_sources_count: 0
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-09): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); source-artifact aihot: AI HOT (all): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); source-artifact aihot: AI HOT API unavailable; used fallback source search (18 item(s), 13 filtered); source-artifact keyword: keyword-search pre-gate filtered 34 result(s): missing_ai_anchor_in_result=12; noise_term:career=8; noise_term:hiring=7; job_or_salary_page=4; noise_term:compensation=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS dataiku-blog: HTTP 404; source-artifacts missing AI HOT daily candidates; live AI HOT fallback activated; AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-09): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); AI HOT (all): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); AI HOT API unavailable; used fallback source search (18 item(s), 13 filtered); targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=3; missing_ai_anchor_in_result=1; targeted pool/core refill cycle 1 added 15 item(s) for core_pool=24/30; core_non_large=14/20; targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=3; missing_ai_anchor_in_result=1; targeted pool/core refill cycle 2 added 0 item(s) for core_pool=26/30; core_non_large=16/20; targeted-refill pre-gate filtered 3 result(s): broad_list_or_market_report=1; missing_ai_anchor_in_result=1; noise_term:career=1; targeted raw-volume refill cycle 1 added 12 item(s) for raw_count=124/150; targeted-refill pre-gate filtered 3 result(s): broad_list_or_market_report=1; missing_ai_anchor_in_result=1; noise_term:career=1; targeted raw-volume refill cycle 2 added 0 item(s) for raw_count=124/150
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 13.96
- keyword_compliance (15): 15
- strategic_alignment (15): 11.4
- importance_readiness (10): 7.08

## Hard Gates

- pool_count_min: passed (118/15)
- routed_pool_count_min: passed (104/10)
- core_pool_min: passed (32/1)
- usable_core_evidence_min: passed (32/1)
- homepage_directory_core_max: passed (0/0)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- unrecovered_failed_sources_max: passed (0/0; total=36; recovered=36)

## Diagnostics

- raw_count_min: passed (124/150; released_by_raw_to_card_supply=true)
- keyword_search_non_community_min: passed (81/6)
- ai_relevant_title_ratio_min: passed (0.90/0.7)
- off_topic_title_max: passed (0/3)
- importance_coverage_gaps: passed (none)
- pool_importance_coverage_gaps: passed (none)

## Risks

- none

## Recovered Diagnostics

- recovered_source_failures=36; status=recovered_by_fallback

## Skill Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- reasons: Raw below diagnostic target

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-09-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-09-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-09-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/business-signals-gate-v3.json

