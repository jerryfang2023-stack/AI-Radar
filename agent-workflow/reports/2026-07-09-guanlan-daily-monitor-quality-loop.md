# 2026-07-09 Guanlan Monitor Quality Loop

- generated_at: 2026-07-09T03:05:45.563Z
- status: passed
- diagnostic_score_reference: 80
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
- monitor_raw_count: 124
- quality_status: passed
- quality_score: 91.44
- hard_failed: none
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-09): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); source-artifact aihot: AI HOT (all): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); source-artifact aihot: AI HOT API unavailable; used fallback source search (18 item(s), 13 filtered); source-artifact keyword: keyword-search pre-gate filtered 34 result(s): missing_ai_anchor_in_result=12; noise_term:career=8; noise_term:hiring=7; job_or_salary_page=4; noise_term:compensation=1; noise_term:jobs at=1; social_or_profile_source=1; source-artifact rss: RSS dataiku-blog: HTTP 404; source-artifacts missing AI HOT daily candidates; live AI HOT fallback activated; AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-09): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); AI HOT (all): fetch failed (code=ENOTFOUND errno=-3008 syscall=getaddrinfo host=aihot.virxact.com); AI HOT API unavailable; used fallback source search (18 item(s), 13 filtered); targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=3; missing_ai_anchor_in_result=1; targeted pool/core refill cycle 1 added 15 item(s) for core_pool=24/30; core_non_large=14/20; targeted-refill pre-gate filtered 4 result(s): broad_list_or_market_report=3; missing_ai_anchor_in_result=1; targeted pool/core refill cycle 2 added 0 item(s) for core_pool=26/30; core_non_large=16/20; targeted-refill pre-gate filtered 3 result(s): broad_list_or_market_report=1; missing_ai_anchor_in_result=1; noise_term:career=1; targeted raw-volume refill cycle 1 added 12 item(s) for raw_count=124/150; targeted-refill pre-gate filtered 3 result(s): broad_list_or_market_report=1; missing_ai_anchor_in_result=1; noise_term:career=1; targeted raw-volume refill cycle 2 added 0 item(s) for raw_count=124/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-09-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

