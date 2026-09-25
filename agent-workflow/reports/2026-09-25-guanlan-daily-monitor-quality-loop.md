# 2026-09-25 Guanlan Monitor Quality Loop

- generated_at: 2026-09-25T00:27:34.965Z
- status: passed
- diagnostic_score_reference: 85
- score_mode: diagnostic_only
- max_cycles: 1
- final_cycle: 1
- manual_intervention_required: false
- downstream_action: Allow the V4 factual build to proceed with noted source-supply diagnostics.
- downstream_reasons: Pool importance coverage gaps remain | source-provider failures remain visible as supply diagnostics

## Single Monitor Attempt

- monitor_status: collected
- failed_stage: completed
- monitor_raw_count: 287
- quality_status: passed
- quality_score: 0
- hard_failed: none
- failed_sources: source-artifact funding: RSS venturebeat-ai: HTTP 429; source-artifact funding: RSS tldr-ai-newsletter: HTTP 429; source-artifact keyword: keyword-search pre-gate filtered 96 result(s): social_or_profile_source=35; missing_ai_anchor_in_result=34; broad_list_or_market_report=19; directory_or_search_page=4; noise_term:hiring=2; noise_term:avatar=1; noise_term:definition=1; source-artifact keyword: Anysearch fallback for query "AI agent startup raises procurement workflow announced September 2026 (AI procurement OR tender OR "contract awarded" OR "purchasing agreement") (official OR government OR newsroom)": Anysearch returned 0 usable results; source-artifact rss: RSS venturebeat-ai: HTTP 429; targeted-refill pre-gate filtered 16 result(s): broad_list_or_market_report=9; social_or_profile_source=5; missing_ai_anchor_in_result=2; targeted pool/core refill cycle 1 added 33 item(s) for important_case=3/5; important_funding=1/5
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: none
- report: agent-workflow/reports/2026-09-25-guanlan-monitor-quality-gate.md

## Retry Policy

- The production wrapper does not recollect all source lanes or rerun the full monitor automatically.
- Supply diagnostics remain in the report. A hard evidence-supply failure routes to targeted repair.
