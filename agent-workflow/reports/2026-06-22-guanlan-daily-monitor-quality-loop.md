# 2026-06-22 Guanlan Monitor Quality Loop

- generated_at: 2026-06-22T03:52:56.449Z
- status: passed
- diagnostic_score_reference: 85
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
- monitor_raw_count: 226
- quality_status: passed
- quality_score: 93.89
- hard_failed: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 11 result(s): missing_ai_anchor_in_result=4; noise_term:career=4; job_or_salary_page=3; targeted pool/core refill cycle 1 added 3 item(s) for important_funding=4/5; core_pool=24/30; core_non_large=14/20; targeted-refill pre-gate filtered 12 result(s): directory_or_search_page=7; noise_term:affiliate=1; noise_term:avatar=1; noise_term:career=1; noise_term:hiring=1; noise_term:translation=1; targeted pool/core refill cycle 2 added 43 item(s) for core_pool=25/30; core_non_large=15/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-22-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Repair failed sources or document fallback paths before downstream use.

