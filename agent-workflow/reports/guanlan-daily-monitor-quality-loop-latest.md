# 2026-06-26 Guanlan Monitor Quality Loop

- generated_at: 2026-06-26T03:32:35.116Z
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
- monitor_raw_count: 188
- quality_status: passed
- quality_score: 93.39
- hard_failed: none
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact agent-workflow/reports/source-runs/2026-06-26/gdelt-raw-source-candidates.json: invalid JSON; source-artifact keyword: keyword-search pre-gate filtered 34 result(s): noise_term:career=9; job_or_salary_page=6; missing_ai_anchor_in_result=4; noise_term:hiring=4; noise_term:job description=3; directory_or_search_page=2; noise_term:compensation=2; noise_term:salary=2; noise_term:affiliate=1; noise_term:definition=1; source-artifact rss: RSS latent-space-podcast: fetch failed; source-artifact rss: RSS mad-podcast: fetch failed; source-artifact rss: RSS ai-and-i-podcast: fetch failed
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-26-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Repair failed sources or document fallback paths before downstream use.
