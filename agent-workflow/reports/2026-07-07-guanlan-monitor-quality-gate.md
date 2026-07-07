# 2026-07-07 Guanlan Monitor Quality Gate

- generated_at: 2026-07-07T03:23:27.923Z
- attempt: 3/3
- status: passed
- production_weekday: tuesday
- weekend_policy: inactive
- weekend_policy_note: not_applied
- total_score: 94.2
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- raw_count: 171
- raw_count_release_override: false
- raw_to_card_supply_release: true
- pool_count: 88
- pool_index_count: 88
- routed_pool_count: 60
- index_only_pool_count: 28
- aihot_index_only_count: 25
- aihot_core_count: 23
- keyword_search_non_community_count: 25
- non_community_paths_hit: official_original, capital_startup, industry_landing, a_media_gdelt
- ai_relevant_title_ratio: 0.813
- off_topic_title_count: 0
- core_pool_count: 32
- core_pool_min_effective: 30
- core_pool_min_default: 30
- usable_core_evidence_count: 32
- usable_core_evidence_min_effective: 30
- usable_core_evidence_min_default: 30
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
- core_non_large_vendor_min_effective: 20
- core_non_large_vendor_min_default: 20
- core_large_vendor_ratio: 0.219
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- recovered_failed_sources_count: 20
- unrecovered_failed_sources_count: 0
- failed_sources: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-07): 404 Not Found — {"error":"No daily report for 2026-07-07."}; keyword-search pre-gate filtered 52 result(s): social_or_profile_source=29; missing_ai_anchor_in_result=14; broad_list_or_market_report=6; noise_term:career=2; noise_term:hiring=1; Anysearch fallback for query "AI Agent funding enterprise customers (industry use case OR customer case OR vertical SaaS OR consulting report OR workflow OR adoption)": fetch failed; Anysearch documented-payload retry for query "open-source AI agent GitHub enterprise adoption (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": The operation was aborted due to timeout; RSS google-ai-blog-rss: The operation was aborted due to timeout; RSS latent-space-podcast: fetch failed; RSS mad-podcast: fetch failed; RSS ai-and-i-podcast: fetch failed; RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 9 result(s): broad_list_or_market_report=4; social_or_profile_source=4; noise_term:avatar=1; targeted pool/core refill cycle 1 added 7 item(s) for routed_pool=54/60; targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=3; social_or_profile_source=1; targeted pool/core refill cycle 2 added 0 item(s) for routed_pool=59/60
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.

## Score Breakdown

- source_integrity (25): 24
- content_quality (20): 20
- coverage_scope (15): 15
- keyword_compliance (15): 12.75
- strategic_alignment (15): 15
- importance_readiness (10): 7.45

## Hard Gates

- raw_count_min: passed (171/150)
- pool_count_min: passed (88/75)
- routed_pool_count_min: passed (60/60)
- keyword_search_non_community_min: passed (25/6)
- ai_relevant_title_ratio_min: passed (0.81/0.7)
- off_topic_title_max: passed (0/3)
- unrecovered_failed_sources_max: passed (0/0; total=20; recovered=20)
- importance_coverage_gaps_must_be_none: passed (none)
- pool_importance_coverage_gaps_must_be_none: passed (none)

## Risks

- recovered_source_failures=20

## Skill Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

## Downstream Recommendation

- level: allow
- action: Allow Signal Card asset generation and frontstage release.
- reasons: all hard gates passed

## Inputs

- raw_file: 01-SiteV2/content/01-raw/2026-07-07-raw-candidates.md
- pool_file: 01-SiteV2/content/02-pool/2026-07-07-pool-candidates.md
- monitor_log_file: agent-workflow/reports/2026-07-07-guanlan-daily-monitor-log.md
- config_file: 01-SiteV2/content/11-databases/monitor-quality-gate-v2.json

