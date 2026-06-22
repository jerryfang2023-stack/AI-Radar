# 2026-06-22 Guanlan Monitor Quality Gate

- generated_at: 2026-06-22T03:46:00.474Z
- attempt: 1/3
- status: failed
- production_weekday: monday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 85.41
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 184
- pool_count: 95
- pool_index_count: 95
- routed_pool_count: 48
- index_only_pool_count: 11
- aihot_index_only_count: 7
- aihot_core_count: 10
- keyword_search_non_community_count: 34
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: B=94; C=72; A=10; S=8
- ai_relevant_title_ratio: 0.810
- off_topic_title_count: 0
- core_pool_count: 18
- core_pool_min_effective: 30
- core_pool_min_default: 30
- usable_core_evidence_count: 18
- usable_core_evidence_min_effective: 30
- usable_core_evidence_min_default: 30
- homepage_directory_core_count: 0
- m_source_only_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 8
- core_non_large_vendor_count: 10
- core_non_large_vendor_min_effective: 20
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.444
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: important_funding=4/5
- failed_sources: keyword-search pre-gate filtered 13 result(s): missing_ai_anchor_in_result=5; job_or_salary_page=4; noise_term:career=3; noise_term:hiring=1; Anysearch fallback for query "AI implementation customer engineering production deployment (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": fetch failed; RSS latent-space-podcast: fetch failed; RSS mad-podcast: fetch failed; RSS ai-and-i-podcast: fetch failed; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; core_pool=18/30; core_non_large=8/20
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 16.5
- content_quality (20): 20
- coverage_scope (15): 14.55
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 4.36

## Hard Gates

- raw_count_min: passed (184/150)
- pool_count_min: passed (95/75)
- routed_pool_count_min: failed (48/60)
- keyword_search_non_community_min: passed (34/6)
- ai_relevant_title_ratio_min: passed (0.81/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: failed (18/30)
- usable_core_evidence_min: failed (18/30)
- homepage_directory_core_max: passed (0/0)
- m_source_only_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- core_large_vendor_max: passed (8/10)
- core_large_vendor_ratio_max: failed (0.44/0.35)
- core_non_large_vendor_min: failed (10/20)
- importance_coverage_gaps_must_be_none: passed (none; raw_sufficient=184)
- pool_importance_coverage_gaps_must_be_none: passed (important_funding=4/5; raw_sufficient=184)

## Risks

- hard_gates_failed=routed_pool_count_min, core_pool_min, usable_core_evidence_min, core_large_vendor_ratio_max, core_non_large_vendor_min
- routed_pool_insufficient=48/60
- failed_sources=11
- pool_importance_coverage_gaps=important_funding=4/5
- core_large_vendor=8/10; ratio=0.44/0.35
- core_non_large_vendor_insufficient=10/20

## Skill Feedback

- Increase usable original-evidence core items and avoid weak Pool-only leads.
- Repair core_pool items so they have full text, usable evidence object, non-index page type and Raw-QC allow status.
- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Demote repeated large-company product/lab items from core_pool and replenish funding, customer deployment, vertical workflow, pricing, procurement, regulatory, or emerging-company evidence.
- Expand Raw and Pool around emerging companies, customer deployments, vertical workflow cases, funding, procurement, pricing and regulatory evidence until non-large-company core_pool has enough depth.
- Repair failed sources or document fallback paths before downstream use.

## Downstream Recommendation

- level: pause
- action: Pause Signal Card asset generation and frontstage release until repair; only Watchlist / User Feedback use is allowed.
- reasons: Routed Pool < hard minimum | core_pool insufficient | usable core evidence insufficient | Pool importance coverage gaps remain | large-company items dominate core_pool | non-large-company core_pool insufficient

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-22-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-22-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-22-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json
