# 2026-08-22 Guanlan Monitor Quality Gate

- generated_at: 2026-08-22T00:21:24.597Z
- attempt: 1/1
- status: passed
- production_weekday: saturday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 0
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 252
- structured_supply_healthy: true
- pool_count: 228
- pool_index_count: 228
- routed_pool_count: 17
- index_only_pool_count: 211
- aihot_index_only_count: 17
- aihot_core_count: 17
- keyword_search_non_community_count: 103
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.742
- off_topic_title_count: 0
- core_pool_count: 17
- core_pool_min_effective: 1
- core_pool_min_default: 1
- usable_core_evidence_count: 17
- usable_core_evidence_min_effective: 1
- usable_core_evidence_min_default: 1
- core_evidence_strength_distribution: rich_evidence=17
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 17
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 8
- core_non_large_vendor_count: 9
- core_non_large_vendor_min_effective: 0
- core_non_large_vendor_min_default: 0
- core_large_vendor_ratio: 0.471
- aihot_resolved_evidence_count: 17
- aihot_resolved_core_count: 17
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_case=1/5
- source_provider_recovery_status: recovered_by_fallback
- recovered_failed_sources_count: 23
- unrecovered_failed_sources_count: 0
- source_provider_failures_block_release: false
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 53 result(s): social_or_profile_source=26; broad_list_or_market_report=7; missing_ai_anchor_in_result=7; noise_term:affiliate=5; noise_term:hiring=5; noise_term:career=1; noise_term:definition=1; noise_term:translation=1; source-artifact keyword: Anysearch fallback for query "forward deployed engineer AI customer deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "FDE AI implementation production rollout announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "customer engineering AI production deployment announced August 2026 ("customer story" OR "case study" OR implementation OR workflow) (AI OR agent) (official OR customer OR company blog)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch tech fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "AI workflow rollout procurement pilot announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI workflow automation procurement announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch fallback for query "AI procurement startup funding enterprise workflow announced August 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact keyword: Anysearch tech fallback for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": tech: Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch fallback for query "(site:cninfo.com.cn OR site:sse.com.cn OR site:szse.cn) (人工智能 OR 大模型 OR 智算) (公告 OR 投资 OR 合同 OR 营收) announced August 2026 (AI implementation OR AI deployment OR AI operations) (earnings OR "annual report" OR "quarterly report" OR 10-K OR 10-Q)": Anysearch Search service temporarily unavailable.; targeted-refill pre-gate filtered 5 result(s): social_or_profile_source=3; missing_ai_anchor_in_result=2; targeted pool/core refill cycle 1 added 20 item(s) for important_case=1/5
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (undefined): 0
- content_quality (undefined): 0
- coverage_scope (undefined): 0
- keyword_compliance (undefined): 0
- strategic_alignment (undefined): 0
- importance_readiness (10): 6.3

## Hard Gates

- pool_count_min: passed (228/15)
- routed_pool_count_min: passed (17/10)
- core_pool_min: passed (17/1)
- usable_core_evidence_min: passed (17/1)
- homepage_directory_core_max: passed (0/0)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)

## Diagnostics

- raw_count_min: passed (252/150)
- keyword_search_non_community_min: passed (103/6)
- ai_relevant_title_ratio_min: passed (0.74/0.7)
- off_topic_title_max: passed (0/3)
- importance_coverage_gaps: passed (none)
- pool_importance_coverage_gaps: warning (important_case=1/5)

## Risks

- pool_importance_coverage_gaps=important_case=1/5
- core_large_vendor=8/10; ratio=0.47/0.35

## Recovered Diagnostics

- recovered_source_failures=23; status=recovered_by_fallback

## Skill Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow the V4 factual build to proceed with noted source-supply diagnostics.
- reasons: Pool importance coverage gaps remain

## Inputs

- structured_intake_file: 01-SiteV2/content/11-databases/data-center-v4/intake-v1/2026-08-22.json
- monitor_log_file: agent-workflow/reports/2026-08-22-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/source-intake-gate-v1.json

