# 2026-07-08 Guanlan Monitor Quality Loop

- generated_at: 2026-07-08T02:16:36.849Z
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
- monitor_raw_count: 99
- quality_status: failed
- quality_score: 87.46
- hard_failed: raw_count_min, unrecovered_failed_sources_max, pool_importance_coverage_gaps_must_be_none
- source_artifacts_refreshed: no
- source_artifact_refresh_failures: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-08): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact keyword: keyword-search pre-gate filtered 55 result(s): social_or_profile_source=31; missing_ai_anchor_in_result=13; broad_list_or_market_report=4; noise_term:career=4; noise_term:hiring=2; noise_term:affiliate=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 2 result(s): broad_list_or_market_report=2; targeted pool/core refill cycle 1 added 0 item(s) for important_case=2/5; routed_pool=50/60; core_pool=23/30; core_non_large=13/20; targeted-refill pre-gate filtered 14 result(s): broad_list_or_market_report=7; social_or_profile_source=5; missing_ai_anchor_in_result=1; noise_term:meme=1; targeted raw-volume refill cycle 1 added 11 item(s) for raw_count=98/150; targeted-refill pre-gate filtered 15 result(s): broad_list_or_market_report=9; social_or_profile_source=6; targeted raw-volume refill cycle 2 added 1 item(s) for raw_count=99/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-08-guanlan-monitor-quality-gate.md

### Cycle 2
- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 115
- quality_status: passed
- quality_score: 86.48
- hard_failed: none
- source_artifacts_refreshed: yes
- source_artifact_refresh_failures: none
- failed_sources: source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily/2026-07-08): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT (daily endpoint https://aihot.virxact.com/api/public/daily): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT (all): fetch failed (code=UND_ERR_CONNECT_TIMEOUT); source-artifact aihot: AI HOT API unavailable; used fallback source search (13 item(s), 18 filtered); source-artifact keyword: keyword-search pre-gate filtered 66 result(s): social_or_profile_source=33; missing_ai_anchor_in_result=17; noise_term:career=6; broad_list_or_market_report=3; job_or_salary_page=3; noise_term:hiring=2; noise_term:avatar=1; noise_term:jobs at=1; source-artifact rss: RSS dataiku-blog: HTTP 404; targeted-refill pre-gate filtered 14 result(s): broad_list_or_market_report=8; social_or_profile_source=6; targeted pool/core refill cycle 1 added 6 item(s) for routed_pool=58/60; core_pool=21/30; core_non_large=12/20; targeted-refill pre-gate filtered 13 result(s): broad_list_or_market_report=8; social_or_profile_source=5; targeted pool/core refill cycle 2 added 0 item(s) for core_pool=25/30; core_non_large=15/20; targeted-refill pre-gate filtered 19 result(s): broad_list_or_market_report=10; social_or_profile_source=7; noise_term:avatar=1; noise_term:hiring=1; targeted raw-volume refill cycle 1 added 3 item(s) for raw_count=113/150; targeted-refill pre-gate filtered 16 result(s): broad_list_or_market_report=11; social_or_profile_source=4; noise_term:avatar=1; targeted raw-volume refill cycle 2 added 2 item(s) for raw_count=115/150
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-07-08-guanlan-monitor-quality-gate.md

## Skill Optimization Feedback

- Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.
- Repair unrecovered failed sources before downstream use.
- Tighten Raw AI relevance anchors and noise filters before accepting candidates.
- Source-provider failures were recovered by fallback coverage; keep them in Hermes supply-risk review without blocking release.

