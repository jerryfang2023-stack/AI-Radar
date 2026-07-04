# 2026-07-04 Guanlan Monitor Quality Loop

- generated_at: 2026-07-04T01:57:00.684Z
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
- monitor_raw_count: 133
- quality_status: passed
- quality_score: 81.57
- hard_failed: none
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-04): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (all): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact keyword: keyword-search pre-gate filtered 18 result(s): missing_ai_anchor_in_result=13; noise_term:career=4; job_or_salary_page=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_case=4/5; important_funding=4/5; core_pool=14/30; core_non_large=10/20; targeted-refill pre-gate filtered 6 result(s): missing_ai_anchor_in_result=6; targeted raw-volume refill cycle 1 added 7 item(s) for raw_count=128/150; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=5; targeted raw-volume refill cycle 2 added 5 item(s) for raw_count=133/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-04-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

