---
title: WaveSight Current Handoff
date: 2026-07-16
status: current
encoding: UTF-8
---

# WaveSight Current Handoff

This file keeps only the current handoff state needed by a new window. Historical closeouts and process notes are audit evidence, not current execution truth.

## Current Position

- Project: WaveSight AI / 观澜 AI.
- Current stage: `SITE-V4.0-data-center` dual-write migration.
- Frozen compatibility frontstage: `SITE-V3.4.5`.
- Product role: AI industry data center and structured factual data foundation for downstream products and research.
- Current public frontstage: Business Signals / Reports Center / First-Line Viewpoints / Community Intelligence.
- Current backend: Dashboard / operations console.
- Default truth sources: `AGENTS.md`, `context/00-current-state.md`, `context/version-ledger.md`, `context/12-data-center-v4.md`, and directly relevant task files.

## Current Entries

| Entry | File |
|---|---|
| Business Signals | `01-SiteV2/site/v3-data-observation.html` |
| Reports Center | `01-SiteV2/site/intelligence-map.html` |
| First-Line Viewpoints | `01-SiteV2/site/follow-builders.html` |
| Community Intelligence | `01-SiteV2/site/community-intelligence.html` |
| Dashboard | `01-SiteV2/site/operations-console.html` |

## Current Production Chain

```text
External sources
-> SourceArtifacts + RawDocuments
-> exact-span Claims + Entities
-> CanonicalEvents
-> FDE / hardware / tag projections
-> queryable V4 exports
-> frozen V3 compatibility projection (Pool / Cards / graph / trend candidates)
-> frontstage + operations data
-> GitHub PR / merge
-> GitHub Pages
-> local Obsidian sync
```

V4 canonical tables contain factual evidence only. Card, trend, opportunity, report, recommendation, and value-judgment objects remain downstream compatibility outputs. First-Line Viewpoints and Community Intelligence are independent columns and cannot become business-signal facts without source-backed recapture.

## Retired Routes

- V2 homepage and four-column public site routes.
- Daily observation as required output.
- Business brief / internal reference as required output.
- Trend report prose as required output.
- Netlify deployment.

## Recovery

New windows should read:

1. `AGENTS.md`
2. `context/context-index.md`
3. `context/version-ledger.md`
4. `context/12-data-center-v4.md` for V4 work, or the routed V3 compatibility context for frozen-page work
5. The current task dispatch or closeout
6. One to three directly relevant task files or skills
