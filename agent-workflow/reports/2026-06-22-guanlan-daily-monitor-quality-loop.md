# 2026-06-22 Guanlan Monitor Quality Loop

- generated_at: 2026-06-22T03:34:08.465Z
- status: failed
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- max_cycles: 3
- final_cycle: 3
- manual_intervention_required: true
- downstream_action: Pause Signal Card asset generation and frontstage release until repair; only Watchlist / User Feedback use is allowed.
- downstream_reasons: Routed Pool < hard minimum | core_pool insufficient | usable core evidence insufficient | Pool importance coverage gaps remain | discovery-entrance-only items promoted to core_pool | non-large-company core_pool insufficient

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 180
- quality_status: failed
- quality_score: 89.77
- hard_failed: routed_pool_count_min, core_pool_min, usable_core_evidence_min, m_source_only_core_max, core_non_large_vendor_min
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 11 result(s): missing_ai_anchor_in_result=4; noise_term:career=4; job_or_salary_page=3; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; core_pool=25/30; core_non_large=15/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-22-guanlan-monitor-quality-gate.md

### Cycle 2
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 180
- quality_status: failed
- quality_score: 89.73
- hard_failed: routed_pool_count_min, core_pool_min, usable_core_evidence_min, m_source_only_core_max, core_non_large_vendor_min
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 11 result(s): missing_ai_anchor_in_result=4; noise_term:career=4; job_or_salary_page=3; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; core_pool=25/30; core_non_large=15/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-22-guanlan-monitor-quality-gate.md

### Cycle 3
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 180
- quality_status: failed
- quality_score: 89.73
- hard_failed: routed_pool_count_min, core_pool_min, usable_core_evidence_min, m_source_only_core_max, core_non_large_vendor_min
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 11 result(s): missing_ai_anchor_in_result=4; noise_term:career=4; job_or_salary_page=3; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; core_pool=25/30; core_non_large=15/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-22-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Increase usable original-evidence core items and avoid weak Pool-only leads.
- Repair core_pool items so they have full text, usable evidence object, non-index page type and Raw-QC allow status.
- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Downgrade index-only/M-source/missing-full-text core items before any downstream card or article use.
- Expand Raw and Pool around emerging companies, customer deployments, vertical workflow cases, funding, procurement, pricing and regulatory evidence until non-large-company core_pool has enough depth.
- Repair failed sources or document fallback paths before downstream use.
