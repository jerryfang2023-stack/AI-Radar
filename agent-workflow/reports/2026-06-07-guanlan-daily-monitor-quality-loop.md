# 2026-06-07 Guanlan Monitor Quality Loop

- generated_at: 2026-06-07T05:57:23.374Z
- status: failed
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- max_cycles: 3
- final_cycle: 3
- manual_intervention_required: true
- downstream_action: Pause Signal Card asset generation and frontstage release until repair; only Watchlist / User Feedback use is allowed.
- downstream_reasons: Routed Pool < hard minimum | core_pool insufficient | usable core evidence insufficient | non-large-company core_pool insufficient

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 151
- quality_status: failed
- quality_score: 90.45
- hard_failed: routed_pool_count_min, core_pool_min, usable_core_evidence_min, core_non_large_vendor_min
- failed_sources: keyword-search pre-gate filtered 16 result(s): missing_ai_anchor_in_result=12; job_or_salary_page=4; Historical Raw dedupe removed 51 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.; Anysearch fallback for query "pre-seed AI startup vertical AI design partner (startup OR funding OR seed OR pre-seed OR YC OR venture OR Crunchbase OR Dealroom OR PitchBook OR Tracxn)": The operation was aborted due to timeout
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-07-guanlan-monitor-quality-gate.md

### Cycle 2
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 156
- quality_status: failed
- quality_score: 91.59
- hard_failed: routed_pool_count_min, core_pool_min, usable_core_evidence_min, m_source_only_core_max, core_readability_score_min, pool_importance_coverage_gaps_must_be_none
- failed_sources: keyword-search pre-gate filtered 15 result(s): missing_ai_anchor_in_result=11; job_or_salary_page=4; Historical Raw dedupe removed 51 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.; Anysearch fallback for query "model release inference cost reduction enterprise adoption (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)": The operation was aborted due to timeout
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-07-guanlan-monitor-quality-gate.md

### Cycle 3
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 153
- quality_status: failed
- quality_score: 89.97
- hard_failed: routed_pool_count_min, core_pool_min, usable_core_evidence_min, core_non_large_vendor_min
- failed_sources: keyword-search pre-gate filtered 13 result(s): missing_ai_anchor_in_result=10; job_or_salary_page=3; Historical Raw dedupe removed 51 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 2 duplicate provider hits before Raw selection.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-07-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Increase usable original-evidence core items and avoid weak Pool-only leads.
- Repair core_pool items so they have full text, usable evidence object, non-index page type and Raw-QC allow status.
- Expand Raw and Pool around emerging companies, customer deployments, vertical workflow cases, funding, procurement, pricing and regulatory evidence until non-large-company core_pool has enough depth.
- Repair failed sources or document fallback paths before downstream use.
- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Downgrade index-only/M-source/missing-full-text core items before any downstream card or article use.
- Repair or downgrade core_pool items with low readability_score; full_text must be readable article/body evidence, not navigation or fallback text.

