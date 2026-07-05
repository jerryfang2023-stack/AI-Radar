# 2026-07-05 Guanlan Monitor Quality Loop

- generated_at: 2026-07-05T02:07:33.399Z
- status: passed
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- max_cycles: 3
- final_cycle: 2
- manual_intervention_required: false
- downstream_action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- downstream_reasons: Raw < hard minimum | AI relevance insufficient

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 100
- quality_status: failed
- quality_score: 75.09
- hard_failed: raw_count_min, routed_pool_count_min, ai_relevant_title_ratio_min, unrecovered_failed_sources_max
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-05): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (all): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact keyword: keyword-search pre-gate filtered 23 result(s): missing_ai_anchor_in_result=16; noise_term:career=3; noise_term:hiring=2; job_or_salary_page=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 2 item(s) for important_case=4/5; important_funding=1/5; routed_pool=45/60; core_pool=15/30; core_non_large=7/20; targeted pool/core refill cycle 2 added 1 item(s) for important_case=4/5; important_funding=3/5; routed_pool=47/60; core_pool=16/30; core_non_large=8/20; targeted pool/core refill cycle 3 added 0 item(s) for important_case=4/5; important_funding=3/5; routed_pool=48/60; core_pool=16/30; core_non_large=8/20; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=3; noise_term:avatar=1; targeted raw-volume refill cycle 1 added 5 item(s) for raw_count=97/150; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=1; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 3 item(s) for raw_count=100/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-05-guanlan-monitor-quality-gate.md

### Cycle 2
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 116
- quality_status: passed
- quality_score: 86.92
- hard_failed: none
- source_artifacts_refreshed: yes
- source_artifact_refresh_failures: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-05): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact aihot: AI HOT (all): fetch failed (code=ECONNREFUSED errno=-111 syscall=connect port=443); source-artifact keyword: keyword-search pre-gate filtered 39 result(s): missing_ai_anchor_in_result=17; noise_term:career=9; job_or_salary_page=6; noise_term:hiring=4; noise_term:job description=2; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=3/5; routed_pool=55/60; core_pool=16/30; core_non_large=9/20; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=2; noise_term:avatar=1; noise_term:career=1; noise_term:hiring=1; targeted raw-volume refill cycle 1 added 7 item(s) for raw_count=110/150; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=3; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 6 item(s) for raw_count=116/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-05-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Tighten Raw AI relevance anchors and noise filters before accepting candidates.
- Repair unrecovered failed sources before downstream use.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

