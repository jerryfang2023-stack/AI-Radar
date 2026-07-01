# 2026-07-01 Guanlan Monitor Quality Gate

- generated_at: 2026-07-01T02:33:05.760Z
- attempt: 3/3
- status: passed
- production_weekday: wednesday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 96.26
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- raw_count: 159
- raw_count_release_override: false
- pool_core_supply_release: true
- pool_count: 95
- pool_index_count: 95
- routed_pool_count: 74
- index_only_pool_count: 20
- aihot_index_only_count: 19
- aihot_core_count: 15
- keyword_search_non_community_count: 82
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: B=91; S=27; A=22; C=19
- ai_relevant_title_ratio: 0.792
- off_topic_title_count: 0
- core_pool_count: 30
- core_pool_min_effective: 30
- core_pool_min_default: 30
- usable_core_evidence_count: 30
- usable_core_evidence_min_effective: 30
- usable_core_evidence_min_default: 30
- homepage_directory_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_text_contamination_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 10
- core_non_large_vendor_count: 20
- core_non_large_vendor_min_effective: 20
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.333
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- recovered_failed_sources_count: 12
- unrecovered_failed_sources_count: 0
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 44 result(s): missing_ai_anchor_in_result=15; job_or_salary_page=11; noise_term:career=9; noise_term:hiring=5; noise_term:coupon=1; noise_term:definition=1; noise_term:jobs at=1; noise_term:meme=1; source-artifact keyword: Anysearch documented-payload retry for query "Applied AI architect enterprise customer workflow (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "forward deployed engineer AI customer deployment (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "enterprise AI transformation workflow change customer case (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "Applied AI architect enterprise customer workflow (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 7.26

## Hard Gates

- raw_count_min: passed (159/150)
- pool_count_min: passed (95/75)
- routed_pool_count_min: passed (74/60)
- keyword_search_non_community_min: passed (82/6)
- ai_relevant_title_ratio_min: passed (0.79/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (30/30)
- usable_core_evidence_min: passed (30/30)
- homepage_directory_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- core_large_vendor_max: passed (10/10)
- core_large_vendor_ratio_max: passed (0.33/0.35)
- core_non_large_vendor_min: passed (20/20)
- unrecovered_failed_sources_max: passed (0/0; total=12; recovered=12)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- recovered_source_failures=12

## Skill Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow
- action: Allow Signal Card asset generation and frontstage release.
- reasons: all hard gates passed

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-01-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-01-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-01-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

