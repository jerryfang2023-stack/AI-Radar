---
title: WaveSight Current Handoff
date: 2026-08-01
status: current
encoding: UTF-8
---

# WaveSight Current Handoff

This file keeps only the current handoff state needed by a new window. Historical closeouts and process notes are audit evidence, not current execution truth.

## Current Position

- Project: WaveSight AI / 观澜 AI.
- Current release: `V4.6.1-china-market-scope`; public website shell `SITE-V4.4.1-china-market-scope`.
- Product role: AI industry data center and structured factual data foundation for downstream products and research.
- Current public frontstage: Data Center (Event Library / Community Intelligence / First-Line Viewpoints / Entity Library) and Application Center (Trend Radar / Guanlan Research).
- Current backend: Dashboard / operations console.
- Current human-readable knowledge base: the physically independent Guanlan AI Vault (`GUANLAN-VAULT-V1.2-private-evidence-linked`), split into system state, Data Center, Application Center, Operations, contracts, knowledge assets, and workspace.
- Current machine-serving projection: `DATA-LAKE-V4.0-23-table`, rebuilt and gated by Final Closure.
- Current private evidence source: `PRIVATE-EVIDENCE-STORE-V2.0`, authoritative, content-addressed, and outside the public repository/Vault. Public RAW-V4 data and the Vault store evidence locators, not complete original bodies.
- Current local automation: exactly seven Windows tasks, including one combined Hermes watchdog/heartbeat control-plane task.
- Current Skill governance: Skill Store `v2.0.0`, with all 23 active governed Skills certified against `GPT-5.6-SKILL-V1.0`; use `npm run check:skill-ops` for the read-only release gate.
- Default truth sources: `AGENTS.md`, `context/00-current-state.md`, `context/version-ledger.md`, `context/12-data-center-v4.md`, and directly relevant task files.

## Current Entries

| Entry | File |
|---|---|
| Event Library / Community Intelligence / First-Line Viewpoints / Entity Library | `01-SiteV2/site/data-center.html` |
| Guanlan Research | `01-SiteV2/site/intelligence-map.html` |
| Trend Radar | `01-SiteV2/site/trend-radar.html` |
| Funding Insights (research subroute) | `01-SiteV2/site/funding-insights.html` |
| Opportunity Map (unlisted internal lab) | `01-SiteV2/site/opportunity-map.html` |
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
-> projection-only local refresh into the independent Guanlan AI Vault
```

V4 canonical tables contain factual evidence only. Trend, opportunity, funding-insight, report, recommendation, and value-judgment objects are downstream applications. V3 Card interfaces are removed. First-Line Viewpoints and Community Intelligence are independent columns and cannot become business-signal facts without separate original-source capture through the V4 evidence chain.

## Retired Routes

- `v3-data-observation.html`, `follow-builders.html`, `community-intelligence.html`, and `reports.html` are redirects only.
- V2 homepage and four-column public site content routes.
- Daily observation as required output.
- Business brief / internal reference as required output.
- Trend report prose as required output.
- Netlify deployment.
- Repository-root or removed repository `vault/` Obsidian indexing.

## Recovery

New windows should read:

1. `AGENTS.md`
2. `context/context-index.md`
3. `context/version-ledger.md`
4. `context/12-data-center-v4.md` for V4 work; historical V3 recovery requires an explicit Git ref and isolated worktree
5. The current task dispatch or closeout
6. One to three directly relevant task files or skills

For Obsidian work, read `docs/obsidian-vault.md`. V1/V2/V3 files, old Hermes handoffs, and dated May/June run reports are recovered from Git history rather than current production directories.
