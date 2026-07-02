# 2026-07-02 Guanlan Monitor Quality Loop

- generated_at: 2026-07-02T02:28:35.682Z
- status: failed
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- max_cycles: 3
- final_cycle: 3
- manual_intervention_required: true
- downstream_action: Pause Signal Card asset generation and frontstage release until repair; only Watchlist / User Feedback use is allowed.
- downstream_reasons: Raw < hard minimum | unrecovered failed source paths

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 116
- quality_status: failed
- quality_score: 90.16
- hard_failed: raw_count_min, core_pool_min, usable_core_evidence_min, unrecovered_failed_sources_max, pool_importance_coverage_gaps_must_be_none
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 16 result(s): missing_ai_anchor_in_result=10; job_or_salary_page=2; noise_term:career=2; noise_term:definition=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 2 item(s) for important_case=3/5; important_funding=3/5; core_pool=24/30; core_non_large=14/20; targeted pool/core refill cycle 2 added 0 item(s) for important_case=3/5; important_funding=4/5; core_pool=25/30; core_non_large=15/20; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=2; targeted raw-volume refill cycle 1 added 8 item(s) for raw_count=112/150; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=2; targeted raw-volume refill cycle 2 added 4 item(s) for raw_count=116/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-02-guanlan-monitor-quality-gate.md

### Cycle 2
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 142
- quality_status: failed
- quality_score: 93.24
- hard_failed: unrecovered_failed_sources_max
- source_artifacts_refreshed: yes
- source_artifact_refresh_failures: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 33 result(s): missing_ai_anchor_in_result=10; job_or_salary_page=8; noise_term:career=7; noise_term:hiring=4; noise_term:job description=2; noise_term:definition=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; core_pool=29/30; core_non_large=19/20; targeted-refill pre-gate filtered 3 result(s): missing_ai_anchor_in_result=3; targeted raw-volume refill cycle 1 added 19 item(s) for raw_count=137/150; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=2; targeted raw-volume refill cycle 2 added 5 item(s) for raw_count=142/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-02-guanlan-monitor-quality-gate.md

### Cycle 3
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 147
- quality_status: failed
- quality_score: 93.27
- hard_failed: unrecovered_failed_sources_max
- source_artifacts_refreshed: yes
- source_artifact_refresh_failures: gdelt: source artifact refresh timed out
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 46 result(s): missing_ai_anchor_in_result=16; job_or_salary_page=11; noise_term:career=11; noise_term:hiring=5; noise_term:definition=2; directory_or_search_page=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=2; targeted raw-volume refill cycle 1 added 8 item(s) for raw_count=147/150; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted raw-volume refill cycle 2 added 0 item(s) for raw_count=147/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-02-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Increase usable original-evidence core items and avoid weak Pool-only leads.
- Repair core_pool items so they have full text, usable evidence object, non-index page type and Raw-QC allow status.
- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Repair unrecovered failed sources before downstream use.

