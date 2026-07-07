# 2026-07-07 Guanlan Monitor Quality Loop

- generated_at: 2026-07-07T02:01:24.219Z
- status: passed
- diagnostic_score_reference: 80
- score_mode: diagnostic_only
- max_cycles: 3
- final_cycle: 1
- manual_intervention_required: false
- downstream_action: Allow Signal Card asset generation and frontstage release with noted soft risks.
- downstream_reasons: Raw < hard minimum | AI relevance insufficient

## Cycle Details

### Cycle 1
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 97
- quality_status: passed
- quality_score: 82.69
- hard_failed: none
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-07): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT (all): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT API unavailable; used fallback source search (10 item(s), 21 filtered); source-artifact keyword: keyword-search pre-gate filtered 52 result(s): social_or_profile_source=26; missing_ai_anchor_in_result=16; broad_list_or_market_report=5; noise_term:career=4; noise_term:hiring=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 1 result(s): broad_list_or_market_report=1; targeted pool/core refill cycle 1 added 1 item(s) for important_case=3/5; routed_pool=55/60; core_pool=25/30; targeted pool/core refill cycle 2 added 0 item(s) for important_case=4/5; routed_pool=56/60; core_pool=25/30; targeted-refill pre-gate filtered 14 result(s): social_or_profile_source=6; broad_list_or_market_report=4; missing_ai_anchor_in_result=3; noise_term:avatar=1; targeted raw-volume refill cycle 1 added 6 item(s) for raw_count=92/150; targeted-refill pre-gate filtered 13 result(s): social_or_profile_source=7; broad_list_or_market_report=4; missing_ai_anchor_in_result=2; targeted raw-volume refill cycle 2 added 5 item(s) for raw_count=97/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-07-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Tighten Raw AI relevance anchors and noise filters before accepting candidates.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

