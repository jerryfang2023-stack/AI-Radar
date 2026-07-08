# 2026-07-08 Guanlan Monitor Quality Gate

- generated_at: 2026-07-08T07:46:17.003Z
- attempt: 1/1
- status: passed
- production_weekday: wednesday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 95.08
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 162
- raw_count_release_override: false
- raw_to_card_supply_release: true
- pool_count: 123
- pool_index_count: 123
- routed_pool_count: 84
- index_only_pool_count: 39
- aihot_index_only_count: 27
- aihot_core_count: 11
- keyword_search_non_community_count: 70
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- ai_relevant_title_ratio: 0.821
- off_topic_title_count: 0
- core_pool_count: 30
- core_pool_min_effective: 30
- core_pool_min_default: 30
- usable_core_evidence_count: 30
- usable_core_evidence_min_effective: 30
- usable_core_evidence_min_default: 30
- core_evidence_strength_distribution: rich_evidence=30
- core_blocked_evidence_count: 0
- core_traceable_summary_count: 0
- core_source_backed_event_count: 0
- core_rich_evidence_count: 30
- homepage_directory_core_count: 0
- core_text_contamination_count: 0
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 9
- core_non_large_vendor_count: 21
- core_non_large_vendor_min_effective: 20
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.300
- aihot_resolved_evidence_count: 21
- aihot_resolved_core_count: 11
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- source_provider_recovery_status: recovered_by_fallback
- recovered_failed_sources_count: 23
- unrecovered_failed_sources_count: 0
- failed_sources: keyword-search pre-gate filtered 68 result(s): missing_ai_anchor_in_result=25; social_or_profile_source=22; broad_list_or_market_report=5; job_or_salary_page=5; noise_term:career=5; noise_term:hiring=2; noise_term:avatar=1; noise_term:compensation=1; noise_term:job description=1; noise_term:jobs at=1; Search cross-entry dedupe removed 1 duplicate provider hits before Raw selection.; Anysearch business fallback for query "enterprise AI transformation production rollout customer deployment (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; Anysearch fallback for query "forward deployed engineer AI customer deployment (FDE OR "forward deployed" OR "applied AI" OR "customer engineering" OR "technical scoping" OR "production rollout" OR "pilot customer" OR "customer story" OR "case study")": fetch failed; Anysearch business fallback for query "AI implementation customer engineering production deployment (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; RSS latent-space-podcast: fetch failed; RSS mad-podcast: fetch failed; RSS ai-and-i-podcast: fetch failed; RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=2; directory_or_search_page=1; noise_term:career=1; targeted pool/core refill cycle 1 added 6 item(s) for core_pool=27/30; core_non_large=17/20
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 14.1
- importance_readiness (10): 6.98

## Hard Gates

- raw_count_min: passed (162/150)
- pool_count_min: passed (123/75)
- routed_pool_count_min: passed (84/60)
- keyword_search_non_community_min: passed (70/6)
- ai_relevant_title_ratio_min: passed (0.82/0.7)
- off_topic_title_max: passed (0/3)
- unrecovered_failed_sources_max: passed (0/0; total=23; recovered=23)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- none

## Recovered Diagnostics

- recovered_source_failures=23; status=recovered_by_fallback

## Skill Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow
- action: Allow Signal Card asset generation and frontstage release.
- reasons: all hard gates passed

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-08-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-08-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-08-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

