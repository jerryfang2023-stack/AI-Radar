# 2026-07-06 Guanlan Monitor Quality Loop

- generated_at: 2026-07-06T02:21:27.247Z
- status: passed
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- max_cycles: 3
- final_cycle: 3
- manual_intervention_required: false
- downstream_action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- downstream_reasons: Raw < hard minimum

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 66
- quality_status: failed
- quality_score: 85.17
- hard_failed: raw_count_min, pool_count_min, routed_pool_count_min, unrecovered_failed_sources_max, pool_importance_coverage_gaps_must_be_none
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 20 result(s): missing_ai_anchor_in_result=13; noise_term:career=4; job_or_salary_page=2; noise_term:hiring=1; source-artifact rss: RSS tigera-blog: HTTP 415; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 1 item(s) for important_funding=2/5; routed_pool=35/60; core_pool=22/30; core_non_large=15/20; targeted pool/core refill cycle 2 added 1 item(s) for important_funding=3/5; routed_pool=36/60; core_pool=22/30; core_non_large=15/20; targeted pool/core refill cycle 3 added 0 item(s) for important_funding=3/5; routed_pool=37/60; core_pool=22/30; core_non_large=15/20; targeted-refill pre-gate filtered 7 result(s): missing_ai_anchor_in_result=5; noise_term:avatar=1; noise_term:career=1; targeted raw-volume refill cycle 1 added 9 item(s) for raw_count=64/150; targeted-refill pre-gate filtered 6 result(s): missing_ai_anchor_in_result=4; noise_term:avatar=1; noise_term:career=1; targeted raw-volume refill cycle 2 added 2 item(s) for raw_count=66/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-06-guanlan-monitor-quality-gate.md

### Cycle 2
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 74
- quality_status: failed
- quality_score: 86.92
- hard_failed: raw_count_min, pool_count_min, routed_pool_count_min, unrecovered_failed_sources_max, pool_importance_coverage_gaps_must_be_none
- source_artifacts_refreshed: yes
- source_artifact_refresh_failures: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 38 result(s): missing_ai_anchor_in_result=19; noise_term:career=8; job_or_salary_page=5; noise_term:hiring=5; noise_term:jobs at=1; source-artifact rss: RSS tigera-blog: HTTP 415; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 3 item(s) for important_funding=2/5; routed_pool=38/60; core_pool=18/30; core_non_large=13/20; targeted pool/core refill cycle 2 added 0 item(s) for important_funding=3/5; routed_pool=41/60; core_pool=19/30; core_non_large=14/20; targeted-refill pre-gate filtered 6 result(s): missing_ai_anchor_in_result=4; noise_term:avatar=1; noise_term:career=1; targeted raw-volume refill cycle 1 added 12 item(s) for raw_count=74/150; targeted-refill pre-gate filtered 6 result(s): missing_ai_anchor_in_result=4; noise_term:avatar=1; noise_term:career=1; targeted raw-volume refill cycle 2 added 0 item(s) for raw_count=74/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-06-guanlan-monitor-quality-gate.md

### Cycle 3
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 111
- quality_status: passed
- quality_score: 95.09
- hard_failed: none
- source_artifacts_refreshed: yes
- source_artifact_refresh_failures: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 53 result(s): missing_ai_anchor_in_result=28; noise_term:career=10; job_or_salary_page=9; noise_term:hiring=3; noise_term:job description=2; noise_term:jobs at=1; source-artifact keyword: Anysearch documented-payload retry for query "forward deployed engineer AI customer deployment (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": Anysearch Search service temporarily unavailable.; source-artifact rss: RSS tigera-blog: HTTP 415; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=4/5; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=3; noise_term:avatar=1; noise_term:career=1; targeted raw-volume refill cycle 1 added 13 item(s) for raw_count=108/150; targeted-refill pre-gate filtered 6 result(s): missing_ai_anchor_in_result=5; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 3 item(s) for raw_count=111/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-06-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Repair unrecovered failed sources before downstream use.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

