# 2026-07-05 Guanlan Monitor Quality Loop

- generated_at: 2026-07-05T04:56:15.604Z
- status: passed
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- max_cycles: 3
- final_cycle: 1
- manual_intervention_required: false
- downstream_action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- downstream_reasons: Raw < hard minimum

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 82
- quality_status: passed
- quality_score: 90.22
- hard_failed: none
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 18 result(s): missing_ai_anchor_in_result=14; noise_term:career=3; noise_term:hiring=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 1 added 0 item(s) for important_funding=1/5; routed_pool=47/60; core_pool=18/30; core_non_large=8/20; targeted-refill pre-gate filtered 3 result(s): missing_ai_anchor_in_result=2; noise_term:avatar=1; targeted raw-volume refill cycle 1 added 13 item(s) for raw_count=79/150; targeted-refill pre-gate filtered 5 result(s): missing_ai_anchor_in_result=4; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 3 item(s) for raw_count=82/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-05-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

