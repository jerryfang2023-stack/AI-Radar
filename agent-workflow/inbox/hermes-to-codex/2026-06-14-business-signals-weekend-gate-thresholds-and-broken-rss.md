status: resolved
priority: urgent
lane: business_signals
category: business_signals_weekend_gate_thresholds_and_broken_rss
failed_gate: multiple_hard_gates
report_path: agent-workflow/reports/2026-06-14-hermes-0945-business-signals.md
data_generated: no_or_stale
needed_action: adjust weekend hard gate thresholds + fix broken RSS sources
created_at: 2026-06-14T10:35:00+08:00
updated_at: 2026-06-14T16:38:21+08:00
resolved_at: 2026-06-14T16:38:21+08:00
resolver: codex
fix_commit: b616dc4b
validation: node agent-workflow/tools/assert-v3-source-first-frontstage.mjs; node agent-workflow/tools/frontstage-regression-gate.mjs; npm run audit:skills
prevention_added: memory
source: hermes-manual

# Hermes Repair Request: Weekend Gate Thresholds & Broken RSS Sources

## Problem Summary

Today (2026-06-14, Sunday) the Business Signals pipeline failed twice:
1. **09:17 scheduled (#42)**: monitor passed (score 88~89) but hardFailed on `core_pool_min`, `usable_core_evidence_min`, `core_non_large_vendor_min`, `pool_importance_coverage_gaps_must_be_none`
2. **09:45 Hermes dispatch (#43)**: pass_score=85, but score dropped to 79~81 AND hardFailed on 6 gates including `core_large_vendor_ratio_max`, `importance_coverage_gaps_must_be_none`

This has been recurring since 2026-06-11 (4 consecutive days). The root cause is that **weekend/Sunday AI news volume is naturally lower**, but the hard gate thresholds remain at weekday levels.

## Failed Hard Gates (All 3 Cycles)

| Gate | Default Threshold | Weekend Problem |
|:-----|:-----------------|:----------------|
| `core_pool_min` | ≥30 (run-guanlan-daily-monitor.mjs:139) | Weekend have fewer items |
| `usable_core_evidence_min` | ≥5 (quality-gate.mjs:367, defaults to corePoolMinHard) | Chained from core_pool_min |
| `core_non_large_vendor_min` | ≥20 (run-guanlan-daily-monitor.mjs:140) | Weekend non-vendor content is sparse |
| `core_large_vendor_ratio_max` | ≤0.35 (quality-gate.mjs:374) | Weekend has disproportionately more large-vendor content |
| `importance_coverage_gaps_must_be_none` | true (quality-gate.mjs:376) | Coverage gaps appear when pool is thin |
| `pool_importance_coverage_gaps_must_be_none` | true (quality-gate.mjs:377) | Same |

## Evidence from Logs

```
#42 (09:17) — pass_score=80, score=88.94/88.33/89.56
  hardFailed cycle1: core_pool_min, usable_core_evidence_min, core_non_large_vendor_min, pool_importance_coverage_gaps_must_be_none
  hardFailed cycle2: core_pool_min, usable_core_evidence_min, core_non_large_vendor_min
  hardFailed cycle3: core_pool_min, usable_core_evidence_min, core_non_large_vendor_min, pool_importance_coverage_gaps_must_be_none

#43 (09:45 dispatch) — pass_score=85, score=81.16/79.31/79.31
  hardFailed cycle1: core_pool_min, usable_core_evidence_min, core_non_large_vendor_min, importance_coverage_gaps_must_be_none, pool_importance_coverage_gaps_must_be_none
  hardFailed cycle2: +core_large_vendor_ratio_max (6 gates total)
  hardFailed cycle3: +core_large_vendor_ratio_max (6 gates total)
```

## Broken RSS Sources

Two RSS feeds are failing and need investigation/replacement:

### 1. Microsoft AI Blog — HTTP 410 (Gone)
- Source: `source-registry-v2.json` → source_id: `microsoft-ai-blog`
- Current URL: `https://blogs.microsoft.com/ai/feed/`
- Error: HTTP 410 (Gone) — the feed URL no longer exists
- Impact: Every monitor run logs "RSS microsoft-ai-blog: HTTP 410"
- Suggested action: Find the current Microsoft AI blog RSS feed URL. It may have moved to a different endpoint.

### 2. Import AI Newsletter — HTTP 403 (Forbidden)
- Source: `source-registry-v2.json` → source_id: `import-ai-newsletter`
- Current URL: `https://importai.substack.com/feed`
- Error: HTTP 403 (Forbidden) — Substack may have blocked automated RSS fetching
- Impact: Every monitor run logs "RSS import-ai-newsletter: HTTP 403"
- Suggested action: Check if Substack changed RSS access policy. Consider alternative: direct page scraping, or find a mirror/archive.

## Also Notable

Keyword search pre-gate filters are also quite aggressive on weekends:
- Run #42: "keyword-search pre-gate filtered 12 result(s): missing_ai_anchor_in_result=9; directory_or_search_page=2; noise_term:career=1"
- Run #43: Similar pattern

This suggests that on low-news days (weekends/holidays), the combination of fewer total results + aggressive pre-gate filtering produces an empty or near-empty pool.

## Suggested Actions

### Short-term (immediate fix)
1. **Adjust hard gate thresholds for weekends**: Lower `core_pool_min`, `core_non_large_vendor_min`, and relax coverage gap requirements on Saturday/Sunday. Options:
   - Add a `dayOfWeek` check in `run-guanlan-daily-monitor.mjs` that reduces thresholds for weekends
   - Or add an `--allow-weekend-mode` flag to the pipeline
   - Or reduce `core_pool_min` from 30 to ~15 on weekends
   - Or reduce `core_non_large_vendor_min` from 20 to ~8 on weekends
   - Or relax `core_large_vendor_ratio_max` from 0.35 to 0.55 on weekends
2. **Fix or replace the two broken RSS sources**: Update URLs in `source-registry-v2.json`

### Medium-term
3. **Add weekend-specific monitoring strategy**: Consider that weekend AI news is primarily about product launches and research announcements (fewer enterprise case studies)
4. **Consider a "lightweight mode"** that accepts fewer but higher-quality signals on weekends

## Location of Key Files

- Hard gate defaults: `agent-workflow/tools/guanlan-monitor-quality-gate.mjs` (lines 360-377)
- Monitor core pool targets: `agent-workflow/tools/run-guanlan-daily-monitor.mjs` (lines 139-140)
- RSS source registry: `01-SiteV2/content/11-databases/source-registry-v2.json`
- Builder feed fetcher: `agent-workflow/tools/fetch-builder-blog-feed.mjs` (line 25)

## User Escalation

- no, unless Codex needs help locating the new RSS feed URLs for Microsoft AI Blog or Import AI

## Related Inbox History

- 2026-06-11-business-signals-top10-empty.md
- 2026-06-12-business-signals-top10-recurring.md
- 2026-06-12-business-signals-gate-failure-and-top10-empty.md
- 2026-06-13-business_signals-business-signals-top10-missing.md
- 2026-06-14-business_signals-business-signals-top10-missing.md (resolved by Codex but same root cause persists)

## Resolution - 2026-06-14T16:38:21+08:00

- fix_commit: b616dc4b
- validation: node agent-workflow/tools/assert-v3-source-first-frontstage.mjs; node agent-workflow/tools/frontstage-regression-gate.mjs; npm run audit:skills
- prevention_added: memory
