---
task_id: WSD-20260507-11-v2-preflight-governance-autopilot
report_type: v2-schema-quality-review
date: 2026-05-07
status: reviewed-with-gaps
owner: data / qa / workflow
encoding: UTF-8
automation_impact: none
---

# V2 Schema / Rules / Quality Gate Review

## 0. Conclusion

The V2 isolation skeleton is sufficient to start a limited 7-day content validation run, provided the run is explicitly scoped as isolation-only and does not modify production automation, sync scripts, `content-paths.json`, Netlify config, or V1 content directories.

It is not sufficient for production cutover or full V2 product implementation yet.

Main gaps:

- V2-4 is still `revised / ready-for-dispatch-review`, not fully accepted in the dispatch board.
- Revised V2 PRD introduces `Point Calibration`, `Trend Context`, and `Opportunity Report`, but there are no dedicated minimal schemas for those assets yet.
- `v2-frontstage-backstage-boundary.md` still contains an older navigation string using `Home / Daily Brief / Signals / Opportunities / AI商业内参`; it should be aligned to the revised PRD names `今日要点 / 关键信号 / 机会解码 / 商业内参` before UI / Dev.
- Source Registry schema is structurally adequate, but the actual registry content file is only a README placeholder; no real source list exists yet.
- Quality gates are document-level rules, not executable validators yet.

## 1. Required File Review Table

| File | Enough for 7-day isolation validation | Gap | Risk | Recommended Action |
|---|---|---|---|---|
| `raw-candidate.schema.md` | Yes | No duplicate key / canonical URL fields | Duplicates may enter Pool | Add duplicate fingerprint before production |
| `structured-signal.schema.md` | Yes | No explicit `structured_id` / `pool_id` backlink | Weaker Raw -> Pool -> Structured trace | Add backlink during V2-7 template design |
| `heat-evidence.schema.md` | Yes | No explicit `pointCalibrationRole` or source quote boundary | Point material could be over-weighted | Add Point Calibration role before heat scoring implementation |
| `heat-card.schema.md` | Yes | Score formula fields are named but not defined mathematically | Heat scores may vary by editor | Accept for isolation, define scoring math before production |
| `ai-brief-issue.schema.md` | Yes | Lacks public/member split fields for product rendering | Future page rendering may mix summary and paid content | Add `publicSummary` / `memberSections` before Dev |
| `source-registry.schema.md` | Partial | Schema exists, actual registry data is not populated | Source levels cannot be audited across 7 days unless manually recorded | Create `06-content/v2/11-source-registry/source-registry.md` before or during V2-7 |
| `v2-ingestion-rules.md` | Yes | Pipeline omits explicit Opportunity Report object | Opportunity analysis may be treated as loose Deep Dive | Add Opportunity Report mapping in V2-7 instructions |
| `v2-source-level-rules.md` | Yes | Source examples are broad; no platform-specific caveats | X / LinkedIn / Product Hunt may be overused | Add source examples after first 2 validation days |
| `v2-counter-evidence-rules.md` | Yes | No minimum per asset beyond Front Signal and AI Brief | Deep Dive / Opportunity Report could under-report counter-evidence | Require counter-evidence in Opportunity Report template |
| `v2-tag-mapping-rules.md` | Yes | Seed dictionary not yet materialized | Tags may drift during 7-day run | Use candidate tags, defer formalization until review |
| `v2-frontstage-backstage-boundary.md` | Partial | Navigation names are stale vs revised V2 PRD | UI / Copy may revive old channel names | Update before UI / Dev; isolation content can proceed |
| `v2-content-quality-gate.md` | Yes | Not executable | Human QA required for V2-7 | Use manual checklist for each validation day |
| `heat-evidence-quality-gate.md` | Yes | Not executable | HeatEvidence breaks may be missed without table check | Use daily manual relation table |
| `ai-brief-quality-gate.md` | Yes | Does not require weekly sample page outline | Weekly issue may be content-only, not product-like | Add weekly sample structure before Day 7 |
| `ai-2-v2-ingestion-plan.md` | Yes | Future-only and not installed | Needs manual execution instructions for V2-7 | Use as runbook, not automation |
| `ai-3-v2-sync-gate-plan.md` | Partial | Future plan only; no parser exists | No automated V2 data output validation | Accept for isolation, not production |
| `content-paths-v2-draft.md` | Yes | Draft only, not runtime JSON | None if not copied into production | Keep as draft until V2-13 |
| `v2-sync-relation-check-plan.md` | Partial | Plan only; no executable relation checker | Manual QA needed | V2-7 should produce relation matrix manually |
| `rollback-plan.md` | Yes | High-level only | Production cutover still needs file-level backups | Enough for isolation; expand before V2-13 |

## 2. Pipeline Coverage

The skeleton covers the main V2 path:

```text
Raw -> Pool -> Structured -> Front Signal -> Deep Dive / Trend -> HeatEvidence -> HeatCard -> AIBriefIssue
```

Coverage status:

| Stage | Covered | Notes |
|---|---|---|
| Raw | Yes | `00-raw/` and raw candidate schema exist |
| Pool | Yes | Directory and ingestion rules exist; no schema yet, but acceptable for 7-day manual validation |
| Structured | Yes | Structured Signal schema exists |
| Front Signal | Yes | Captured by structured schema and content gate |
| Deep Dive | Partial | Directory exists, but no dedicated schema |
| Trend / Trend Context | Partial | Directory exists; revised PRD treats Trends as context, but no `trend-context.schema.md` |
| HeatEvidence | Yes | Schema and quality gate exist |
| HeatCard | Yes | Schema exists, scoring math still future |
| AIBriefIssue | Yes | Schema and quality gate exist |
| Opportunity Report / 机会解码 | Partial | Revised PRD requires it, but no dedicated schema yet |
| Point Calibration | Partial | Rules say Point is calibration, but no dedicated schema yet |

## 3. Source Registry Coverage

The Source Registry schema is adequate for source levels and source roles:

- It supports S/A/B/C.
- It supports source type, coverage, allowed roles, blocked roles, reliability notes, watch frequency, archive rule, and status.
- It can model official sources, media, VC reports, ecosystem sources, X, LinkedIn, Product Hunt, YC, GitHub, podcasts, and builder points.

Gap:

- `06-content/v2/11-source-registry/` currently has only `README.md`.
- There is no actual `source-registry.md`, `source-levels.md`, `source-watchlist.md`, or `blocked-sources.md` content yet.

Recommendation:

- V2-7 may start if each day records source metadata in the daily Raw / Pool files.
- Before production cutover, create a real Source Registry file and audit recurring sources.

## 4. HeatEvidence Traceability

HeatEvidence can reverse trace to V1 / V2 assets through:

- `sourceType`
- `sourceId`
- `relatedSignalIds`
- `relatedPointIds`
- `relatedOpportunityIds`
- `relatedTrendIds`
- `sourceLevel`
- `period`

This is enough for 7-day isolation validation.

Hard rule already present:

- Point-only evidence cannot enter `evidenceRole: fact`.

Gap:

- The revised PRD wants Point Calibration and Trend Context as embedded modules. HeatEvidence rules can reference them, but those intermediate assets do not yet have their own schema.

Recommendation:

- In V2-7, record Point Calibration and Trend Context as sections inside daily validation files.
- Add dedicated schemas before any website data parser is built.

## 5. AI Brief Weekly MVP Coverage

The AI Brief Issue schema can carry a weekly MVP:

- weekly / monthly issue type.
- executive summary.
- top industries / jobs / workflows / triples.
- rising / cooling / controversial heat points.
- key judgments.
- evidence summary.
- counter-evidence summary.
- evidence gaps.

This is enough for a Day 7 weekly sample.

Gap:

- Public summary versus member content split is not modeled yet.
- The issue structure does not yet encode section order for a page or member product.

Recommendation:

- V2-7 Day 7 should output one weekly issue sample in Markdown.
- UI / Dev should not start from this schema alone; product rendering needs a later page spec.

## 6. Quality Gate Strength

The gates are strong enough to block:

- V2 content written into V1 production directories.
- Front Signals with fewer than 3 S/A/B sources.
- Missing six-part opportunity decomposition.
- Missing source trace.
- Point-only fact evidence.
- HeatCard references without HeatEvidence.
- AI Brief that is only a ranking list.
- Certainty language or action commands.

Not yet automated:

- Duplicate detection.
- Relation checking.
- Source Registry validation.
- Tag taxonomy enforcement.
- Heat score calculation verification.

Recommendation:

- V2-7 should run as a manual QA validation with daily review tables.
- Executable validators can wait until V2-13 or a dedicated V2 parser / relation checker task.

## 7. V2-7 Readiness Decision

Recommended status:

```text
ready-for-limited-isolation-validation
```

Meaning:

- Yes, start `V2-7` as a 7-day isolated content validation.
- No, do not treat this as production cutover.
- No, do not modify production `ai-2`, `ai-3`, `content-paths.json`, sync scripts, Netlify, or V1 content directories.

Required V2-7 scope:

1. Use `06-content/v2/` only.
2. Manually produce or collect Raw / Pool / Structured / Front Signal outputs.
3. Require exactly 3 Front Signals per validation day when evidence allows.
4. Require 3 S/A/B sources for each Front Signal.
5. Record Point Calibration as calibration only.
6. Record Trend Context and Opportunity Report candidates, but mark them as candidates if schemas are not yet added.
7. Generate one weekly AI Brief sample on Day 7.
8. Produce a daily manual relation table for Raw -> Pool -> Structured -> Front Signal -> HeatEvidence.

## 8. Follow-Up Before Production

Before V2 production or page Dev:

1. Accept or revise V2-4 in the dispatch hub.
2. Create minimal schemas for:
   - `point-calibration.schema.md`
   - `trend-context.schema.md`
   - `opportunity-report.schema.md`
3. Align `v2-frontstage-backstage-boundary.md` with revised V2 navigation names.
4. Create actual Source Registry content, not only schema.
5. Build executable V2 relation checks before any sync output.
6. Keep production automation stopped until a dedicated cutover task.
