# 2026-07-17 Guanlan Monitor Quality Loop

- generated_at: 2026-07-17T01:57:09.248Z
- status: passed
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- max_cycles: 1
- final_cycle: 1
- manual_intervention_required: false
- downstream_action: Allow Signal Card asset generation and frontstage release.
- downstream_reasons: all hard gates passed

## Single Monitor Attempt

- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 167
- quality_status: passed
- quality_score: 96.37
- hard_failed: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 36 result(s): missing_ai_anchor_in_result=13; noise_term:career=8; job_or_salary_page=6; broad_list_or_market_report=4; social_or_profile_source=2; noise_term:affiliate=1; noise_term:avatar=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-17-guanlan-monitor-quality-gate.md

## Retry Policy

- The production wrapper does not recollect all source lanes or rerun the full monitor automatically.
- Supply diagnostics remain in the report. A hard evidence-supply failure routes to targeted repair.

