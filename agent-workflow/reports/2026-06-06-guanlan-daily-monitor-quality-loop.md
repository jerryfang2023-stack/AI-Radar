# 2026-06-06 Guanlan Monitor Quality Loop

- generated_at: 2026-06-07T04:07:13.898Z
- status: passed
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- max_cycles: 1
- final_cycle: 1
- manual_intervention_required: false
- downstream_action: Allow downstream with explicit evidence gaps and lower claim strength.
- downstream_reasons: soft score below threshold

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 190
- quality_status: passed
- quality_score: 93.57
- hard_failed: none
- failed_sources: keyword-search pre-gate filtered 17 result(s): missing_ai_anchor_in_result=11; job_or_salary_page=4; directory_or_search_page=2; Search cross-entry dedupe removed 1 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-06-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Repair failed sources or document fallback paths before downstream use.

