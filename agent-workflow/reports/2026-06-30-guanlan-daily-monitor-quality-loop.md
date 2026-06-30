# 2026-06-30 Guanlan Monitor Quality Loop

- generated_at: 2026-06-30T02:26:24.980Z
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
- monitor_raw_count: 114
- quality_status: failed
- quality_score: 81.15
- hard_failed: raw_count_min, core_pool_min, usable_core_evidence_min, core_non_large_vendor_min, unrecovered_failed_sources_max
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 17 result(s): missing_ai_anchor_in_result=10; noise_term:career=4; job_or_salary_page=1; noise_term:definition=1; noise_term:hiring=1; source-artifact rss: RSS tigera-blog: HTTP 415; targeted pool/core refill cycle 1 added 2 item(s) for important_funding=3/5; routed_pool=40/60; core_pool=9/30; core_non_large=8/20; targeted pool/core refill cycle 2 added 1 item(s) for important_funding=4/5; routed_pool=41/60; core_pool=9/30; core_non_large=8/20; targeted-refill pre-gate filtered 1 result(s): missing_ai_anchor_in_result=1; targeted pool/core refill cycle 3 added 22 item(s) for routed_pool=42/60; core_pool=10/30; core_non_large=9/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-30-guanlan-monitor-quality-gate.md

### Cycle 2
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 92
- quality_status: failed
- quality_score: 82.46
- hard_failed: raw_count_min, routed_pool_count_min, core_pool_min, usable_core_evidence_min, core_non_large_vendor_min, unrecovered_failed_sources_max, pool_importance_coverage_gaps_must_be_none
- source_artifacts_refreshed: yes
- source_artifact_refresh_failures: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 35 result(s): missing_ai_anchor_in_result=15; noise_term:career=11; job_or_salary_page=5; noise_term:hiring=3; noise_term:definition=1; source-artifact keyword: Anysearch documented-payload retry for query "AI implementation startup funding enterprise workflow (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "enterprise AI implementation customer story (FDE OR "forward deployed" OR "applied AI" OR "customer engineering" OR "technical scoping" OR "production rollout" OR "pilot customer" OR "customer story" OR "case study")": Anysearch Search service temporarily unavailable.; source-artifact rss: RSS tigera-blog: HTTP 415; targeted pool/core refill cycle 1 added 1 item(s) for important_funding=3/5; routed_pool=41/60; core_pool=16/30; core_non_large=9/20; targeted pool/core refill cycle 2 added 5 item(s) for important_funding=3/5; routed_pool=42/60; core_pool=16/30; core_non_large=9/20; targeted pool/core refill cycle 3 added 1 item(s) for important_funding=3/5; routed_pool=46/60; core_pool=17/30; core_non_large=10/20
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-30-guanlan-monitor-quality-gate.md

### Cycle 3
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 116
- quality_status: failed
- quality_score: 91.95
- hard_failed: raw_count_min, unrecovered_failed_sources_max
- source_artifacts_refreshed: yes
- source_artifact_refresh_failures: keyword: source artifact refresh timed out | gdelt: source artifact refresh timed out
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 35 result(s): missing_ai_anchor_in_result=15; noise_term:career=11; job_or_salary_page=5; noise_term:hiring=3; noise_term:definition=1; source-artifact keyword: Anysearch documented-payload retry for query "AI implementation startup funding enterprise workflow (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "enterprise AI implementation customer story (FDE OR "forward deployed" OR "applied AI" OR "customer engineering" OR "technical scoping" OR "production rollout" OR "pilot customer" OR "customer story" OR "case study")": Anysearch Search service temporarily unavailable.; source-artifact rss: RSS tigera-blog: HTTP 415; targeted pool/core refill cycle 1 added 3 item(s) for important_funding=3/5; routed_pool=41/60; core_pool=16/30; core_non_large=9/20; targeted-refill pre-gate filtered 2 result(s): missing_ai_anchor_in_result=2; targeted pool/core refill cycle 2 added 16 item(s) for routed_pool=43/60; core_pool=18/30; core_non_large=11/20; targeted-refill pre-gate filtered 4 result(s): missing_ai_anchor_in_result=2; noise_term:career=1; noise_term:hiring=1; targeted pool/core refill cycle 3 added 12 item(s) for routed_pool=58/60; core_pool=27/30
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-06-30-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Increase usable original-evidence core items and avoid weak Pool-only leads.
- Repair core_pool items so they have full text, usable evidence object, non-index page type and Raw-QC allow status.
- Expand Raw and Pool around emerging companies, customer deployments, vertical workflow cases, funding, procurement, pricing and regulatory evidence until non-large-company core_pool has enough depth.
- Repair unrecovered failed sources before downstream use.
- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.

