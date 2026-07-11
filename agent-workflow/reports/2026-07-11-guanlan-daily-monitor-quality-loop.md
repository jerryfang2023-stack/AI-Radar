# 2026-07-11 Guanlan Monitor Quality Loop

- generated_at: 2026-07-11T04:43:12.177Z
- status: passed
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- max_cycles: 3
- final_cycle: 1
- manual_intervention_required: false
- downstream_action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- downstream_reasons: Raw below diagnostic target | Pool importance coverage gaps remain

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 84
- quality_status: passed
- quality_score: 90.91
- hard_failed: none
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 32 result(s): missing_ai_anchor_in_result=15; job_or_salary_page=7; noise_term:career=4; broad_list_or_market_report=2; noise_term:affiliate=1; noise_term:hiring=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 1 result(s): broad_list_or_market_report=1; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; routed_pool=49/60; core_pool=23/30; core_non_large=13/20; targeted-refill pre-gate filtered 6 result(s): broad_list_or_market_report=2; missing_ai_anchor_in_result=2; noise_term:avatar=1; noise_term:career=1; targeted raw-volume refill cycle 1 added 7 item(s) for raw_count=84/150; targeted-refill pre-gate filtered 6 result(s): broad_list_or_market_report=2; missing_ai_anchor_in_result=2; noise_term:avatar=1; noise_term:career=1; targeted raw-volume refill cycle 2 added 0 item(s) for raw_count=84/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-11-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

