# 2026-06-30 Guanlan Monitor Quality Gate

- generated_at: 2026-06-30T06:49:11.340Z
- attempt: 1/1
- status: passed
- production_weekday: tuesday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 94.95
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 116
- raw_count_release_override: pool_core_supply
- pool_core_supply_release: true
- pool_count: 95
- pool_index_count: 95
- routed_pool_count: 65
- index_only_pool_count: 25
- aihot_index_only_count: 22
- aihot_core_count: 0
- keyword_search_non_community_count: 68
- non_community_paths_hit: official_original, developer_ecosystem, capital_startup, industry_landing, procurement_marketplace, a_media_gdelt
- source_level_distribution: B=80; C=16; S=11; A=9
- ai_relevant_title_ratio: 0.862
- off_topic_title_count: 0
- core_pool_count: 31
- core_pool_min_effective: 30
- core_pool_min_default: 30
- usable_core_evidence_count: 31
- usable_core_evidence_min_effective: 30
- usable_core_evidence_min_default: 30
- homepage_directory_core_count: 0
- core_missing_full_text_count: 0
- core_low_readability_count: 0
- core_text_contamination_count: 0
- core_readability_score_min: 24
- core_raw_qc_block_count: 0
- core_raw_qc_degraded_count: 0
- core_large_vendor_count: 5
- core_non_large_vendor_count: 26
- core_non_large_vendor_min_effective: 20
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.161
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- recovered_failed_sources_count: 21
- unrecovered_failed_sources_count: 0
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 35 result(s): missing_ai_anchor_in_result=15; noise_term:career=11; job_or_salary_page=5; noise_term:hiring=3; noise_term:definition=1; source-artifact keyword: Anysearch documented-payload retry for query "AI implementation startup funding enterprise workflow (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "enterprise AI implementation customer story (FDE OR "forward deployed" OR "applied AI" OR "customer engineering" OR "technical scoping" OR "production rollout" OR "pilot customer" OR "customer story" OR "case study")": Anysearch Search service temporarily unavailable.; source-artifact rss: RSS tigera-blog: HTTP 415; targeted pool/core refill cycle 1 added 3 item(s) for important_funding=3/5; routed_pool=41/60; core_pool=16/30; core_non_large=9/20; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=2; targeted pool/core refill cycle 2 added 16 item(s) for routed_pool=43/60; core_pool=18/30; core_non_large=11/20; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=2; noise_term:career=1; noise_term:hiring=1; targeted pool/core refill cycle 3 added 12 item(s) for routed_pool=58/60; core_pool=27/30
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 13.64
- keyword_compliance (15): 15
- strategic_alignment (15): 15
- importance_readiness (10): 7.31

## Hard Gates

- raw_count_min: passed (116/150; released_by_pool_core_supply=true)
- pool_count_min: passed (95/75)
- routed_pool_count_min: passed (65/60)
- keyword_search_non_community_min: passed (68/6)
- ai_relevant_title_ratio_min: passed (0.86/0.7)
- off_topic_title_max: passed (0/3)
- core_pool_min: passed (31/30)
- usable_core_evidence_min: passed (31/30)
- homepage_directory_core_max: passed (0/0)
- core_missing_full_text_max: passed (0/0)
- core_readability_score_min: passed (low=0/0; min=24)
- core_text_contamination_max: passed (0/0)
- core_raw_qc_block_max: passed (0/0)
- core_raw_qc_degraded_max: passed (0/0)
- core_large_vendor_max: passed (5/10)
- core_large_vendor_ratio_max: passed (0.16/0.35)
- core_non_large_vendor_min: passed (26/20)
- unrecovered_failed_sources_max: passed (0/0; total=21; recovered=21)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- recovered_source_failures=21

## Skill Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow_with_notes
- action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- reasons: Raw < hard minimum

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-06-30-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-06-30-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-06-30-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

