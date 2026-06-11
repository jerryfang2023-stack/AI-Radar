# 2026-06-11 Guanlan Monitor Quality Loop

- generated_at: 2026-06-11T01:29:53.184Z
- status: passed
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- max_cycles: 3
- final_cycle: 1
- manual_intervention_required: false
- downstream_action: Allow Signal Card asset generation and frontstage release.
- downstream_reasons: all hard gates passed

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 183
- quality_status: passed
- quality_score: 93.41
- hard_failed: none
- failed_sources: keyword-search pre-gate filtered 13 result(s): missing_ai_anchor_in_result=10; noise_term:hiring=2; job_or_salary_page=1; Historical Raw dedupe removed 2 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 5 duplicate provider hits before Raw selection.; RSS microsoft-ai-blog: HTTP 410; RSS import-ai-newsletter: HTTP 403
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-11-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Repair failed sources or document fallback paths before downstream use.

