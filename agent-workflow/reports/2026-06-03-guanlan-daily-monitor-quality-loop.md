# 2026-06-03 Guanlan Monitor Quality Loop

- generated_at: 2026-06-03T03:23:04.639Z
- status: passed
- pass_score_threshold: 80
- max_cycles: 3
- final_cycle: 1
- manual_intervention_required: false
- downstream_action: Allow downstream with explicit evidence gaps and lower claim strength.
- downstream_reasons: soft score below threshold

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 120
- quality_status: passed
- quality_score: 90.44
- hard_failed: none
- failed_sources: keyword-search pre-gate filtered 1 result(s): job_or_salary_page=1; Historical Raw dedupe removed 5 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 13 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then follow-builders + keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-03-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Repair failed sources or document fallback paths before downstream use.

