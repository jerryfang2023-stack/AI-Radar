# 2026-06-08 Guanlan Monitor Quality Loop

- generated_at: 2026-06-08T00:36:49.207Z
- status: failed
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- max_cycles: 3
- final_cycle: 3
- manual_intervention_required: true
- downstream_action: Pause Signal Card asset generation and frontstage release until repair; only Watchlist / User Feedback use is allowed.
- downstream_reasons: Raw < hard minimum

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 131
- quality_status: failed
- quality_score: 92.95
- hard_failed: raw_count_min
- failed_sources: keyword-search pre-gate filtered 16 result(s): missing_ai_anchor_in_result=12; job_or_salary_page=3; noise_term:definition=1; Historical Raw dedupe removed 33 URL duplicate candidate(s) before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-08-guanlan-monitor-quality-gate.md

### Cycle 2
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 141
- quality_status: failed
- quality_score: 93.35
- hard_failed: raw_count_min
- failed_sources: keyword-search pre-gate filtered 11 result(s): missing_ai_anchor_in_result=7; job_or_salary_page=3; noise_term:definition=1; Historical Raw dedupe removed 33 URL duplicate candidate(s) before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-08-guanlan-monitor-quality-gate.md

### Cycle 3
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 139
- quality_status: failed
- quality_score: 93.21
- hard_failed: raw_count_min
- failed_sources: keyword-search pre-gate filtered 15 result(s): missing_ai_anchor_in_result=11; job_or_salary_page=3; noise_term:definition=1; Historical Raw dedupe removed 33 URL duplicate candidate(s) before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-08-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Repair failed sources or document fallback paths before downstream use.

