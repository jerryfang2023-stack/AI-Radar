# 2026-06-06 Guanlan Monitor Quality Loop

- generated_at: 2026-06-06T05:51:22.641Z
- status: passed
- pass_score_threshold: 80
- max_cycles: 3
- final_cycle: 2
- manual_intervention_required: false
- downstream_action: Allow downstream with explicit evidence gaps and lower claim strength.
- downstream_reasons: soft score below threshold

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 116
- quality_status: failed
- quality_score: 82.94
- hard_failed: importance_coverage_gaps_must_be_none
- failed_sources: keyword-search pre-gate filtered 5 result(s): missing_ai_anchor_in_result=5; Historical Raw dedupe removed 22 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 1 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: important_case=2/3
- report: agent-workflow/reports/2026-06-06-guanlan-monitor-quality-gate.md

### Cycle 2
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 115
- quality_status: passed
- quality_score: 90.66
- hard_failed: none
- failed_sources: keyword-search pre-gate filtered 7 result(s): missing_ai_anchor_in_result=6; job_or_salary_page=1; Historical Raw dedupe removed 17 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 1 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-06-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Repair Raw importance coverage before downstream use.
- Repair failed sources or document fallback paths before downstream use.

