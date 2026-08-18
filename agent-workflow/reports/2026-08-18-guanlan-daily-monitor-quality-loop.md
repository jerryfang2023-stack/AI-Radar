# 2026-08-18 Guanlan Monitor Quality Loop

- generated_at: 2026-08-18T00:23:10.641Z
- status: passed
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- max_cycles: 1
- final_cycle: 1
- manual_intervention_required: false
- downstream_action: Allow the V4 factual build to proceed with noted source-supply diagnostics.
- downstream_reasons: Pool importance coverage gaps remain

## Single Monitor Attempt

- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 260
- quality_status: passed
- quality_score: 0
- hard_failed: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 36 result(s): broad_list_or_market_report=12; missing_ai_anchor_in_result=12; social_or_profile_source=8; noise_term:definition=1; noise_term:hiring=1; noise_term:meme=1; noise_term:translation=1; source-artifact rss: RSS tldr-ai-newsletter: HTTP 429; targeted-refill pre-gate filtered 5 result(s): directory_or_search_page=2; missing_ai_anchor_in_result=2; social_or_profile_source=1; targeted pool/core refill cycle 1 added 16 item(s) for important_case=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-08-18-guanlan-monitor-quality-gate.md

## Retry Policy

- The production wrapper does not recollect all source lanes or rerun the full monitor automatically.
- Supply diagnostics remain in the report. A hard evidence-supply failure routes to targeted repair.

