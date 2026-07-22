---
title: WaveSight Current Handoff
date: 2026-07-22
status: current
encoding: UTF-8
---

# WaveSight Current Handoff

This file keeps only the current handoff state needed by a new window. Historical closeouts and process notes are audit evidence, not current execution truth.

## Current Position

- Project: WaveSight AI / 观澜 AI.
- Current stage: `SITE-V4.2.0-entity-history` public website and data-service baseline.
- Product role: AI industry data center and structured factual data foundation for downstream products and research.
- Current public frontstage: Data Center / Trend Radar / Industry Reports / Opportunity Map.
- Current backend: Dashboard / operations console.
- Default truth sources: `AGENTS.md`, `context/00-current-state.md`, `context/version-ledger.md`, `context/12-data-center-v4.md`, and directly relevant task files.

## Current Entries

| Entry | File |
|---|---|
| Commercial Events / FDE / AI Hardware | `01-SiteV2/site/data-center.html` |
| Industry Reports | `01-SiteV2/site/intelligence-map.html` |
| Opportunity Map | `01-SiteV2/site/opportunity-map.html` |
| Trend Radar | `01-SiteV2/site/trend-radar.html` |
| First-Line Viewpoints | `01-SiteV2/site/data-center.html?view=viewpoints` |
| Community Intelligence | `01-SiteV2/site/data-center.html?view=community` |
| Dashboard | `01-SiteV2/site/operations-console.html` |

## Current Production Chain

```text
External sources
-> SourceArtifacts + RawDocuments
-> exact-span Claims + Entities
-> CanonicalEvents
-> FDE / hardware / tag projections
-> queryable V4 exports + entity history
-> split frontstage indexes and downstream applications
-> operations data
-> GitHub PR / merge
-> GitHub Pages
-> local Obsidian sync
```

V4 canonical tables contain factual evidence only. Card, trend, opportunity, report, recommendation, and value-judgment objects remain downstream compatibility outputs. First-Line Viewpoints and Community Intelligence are independent columns and cannot become business-signal facts without source-backed recapture.

## Retired Routes

- `v3-data-observation.html`, `follow-builders.html`, `community-intelligence.html`, and `reports.html` are redirects only.
- V2 homepage and four-column public site content routes.
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
