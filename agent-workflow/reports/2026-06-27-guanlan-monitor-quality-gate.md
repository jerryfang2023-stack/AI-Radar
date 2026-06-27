# 2026-06-27 Guanlan Monitor Quality Gate

- generated_at: 2026-06-27T03:15:06.557Z
- attempt: 1/3
- status: passed
- production_weekday: saturday
- weekend_policy: active
- weekend_policy_note: light weekend quantity floors applied; evidence-quality gates and downstream card/frontstage gates remain required
- total_score: 87.41
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 177
- pool_count: 95
- pool_index_count: 95
- routed_pool_count: 79
- index_only_pool_count: 15
- aihot_index_only_count: 12
- aihot_core_count: 0
- keyword_search_non_community_count: 53
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: B=164; A=7; S=6
- ai_relevant_title_ratio: 0.910
- off_topic_title_count: 0
- core_pool_count: 30
- core_pool_min_effective: 18
- core_pool_min_default: 30
- usable_core_evidence_count: 30
- usable_core_evidence_min_effective: 18
- usable_core_evidence_min_default: 30
- homepage_directory_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_text_contamination_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 5
- core_non_large_vendor_count: 25
- core_non_large_vendor_min_effective: 12
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.167
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 17 result(s): missing_ai_anchor_in_result=9; noise_term:career=5; job_or_salary_page=3; source-artifact keyword: Anysearch documented-payload retry for query "enterprise AI transformation production rollout customer deployment (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "agent governance evals production rollout enterprise AI (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.; targeted pool/core refill cycle 1 added 3 item(s) for important_funding=4/5; core_pool=26/30; core_non_large=16/20; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 2 added 10 item(s) for core_pool=28/30; core_non_large=18/20
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 21
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 9.15
- importance_readiness (10): 7.26

## Hard Gates

- raw_count_min: passed (177/150)
- pool_count_min: passed (95/75)
- routed_pool_count_min: passed (79/60)
- keyword_search_non_community_min: passed (53/6)
- ai_relevant_title_ratio_min: passed (0.91/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (30/18; default=30)
- usable_core_evidence_min: passed (30/18; default=30)
- homepage_directory_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- core_large_vendor_max: passed (5/10)
- core_large_vendor_ratio_max: passed (0.17/0.35)
- core_non_large_vendor_min: passed (25/12; default=20)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- failed_sources=11
- theme_concentration_warning=warning: uncategorized concentration 59.9% exceeds 40%; downstream Pool / cards / business signals must diversify or declare theme_day=true.
- weekend_policy=passed; weekday=saturday; effective_core_pool_min=18; effective_usable_core_evidence_min=18; effective_core_non_large_vendor_min=12; pool_gap_min=2

## Skill Feedback

- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: allow
- action: Allow Signal Card asset generation and frontstage release.
- reasons: all hard gates passed

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-27-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-27-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-27-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

