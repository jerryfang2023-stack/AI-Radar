# 2026-07-20 Guanlan Monitor Quality Loop

- generated_at: 2026-07-20T03:57:16.163Z
- status: passed
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- max_cycles: 1
- final_cycle: 1
- manual_intervention_required: false
- downstream_action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- downstream_reasons: Raw below diagnostic target | Pool importance coverage gaps remain

## Single Monitor Attempt

- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 116
- quality_status: passed
- quality_score: 95.53
- hard_failed: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 43 result(s): missing_ai_anchor_in_result=12; noise_term:career=9; broad_list_or_market_report=7; job_or_salary_page=7; noise_term:hiring=3; social_or_profile_source=3; directory_or_search_page=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=1; missing_ai_anchor_in_result=1; noise_term:career=1; noise_term:hiring=1; targeted pool/core refill cycle 1 added 6 item(s) for important_case=3/5; important_funding=1/5; important_vertical_solution=4/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-20-guanlan-monitor-quality-gate.md

## Retry Policy

- The production wrapper does not recollect all source lanes or rerun the full monitor automatically.
- Supply diagnostics remain in the report. A hard evidence-supply failure routes to targeted repair.

