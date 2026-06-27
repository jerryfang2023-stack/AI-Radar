# 2026-06-27 Guanlan Monitor Quality Loop

- generated_at: 2026-06-27T03:15:06.985Z
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
- monitor_raw_count: 177
- quality_status: passed
- quality_score: 87.41
- hard_failed: none
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 17 result(s): missing_ai_anchor_in_result=9; noise_term:career=5; job_or_salary_page=3; source-artifact keyword: Anysearch documented-payload retry for query "enterprise AI transformation production rollout customer deployment (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "agent governance evals production rollout enterprise AI (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.; targeted pool/core refill cycle 1 added 3 item(s) for important_funding=4/5; core_pool=26/30; core_non_large=16/20; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 2 added 10 item(s) for core_pool=28/30; core_non_large=18/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-27-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Repair failed sources or document fallback paths before downstream use.

