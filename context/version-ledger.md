---
status: current
scope: version-ledger
last_updated: 2026-06-06
use_when:
  - task startup
  - page change
  - data sync
  - release check
priority: current
---

# Version Ledger

This file is the current version baseline. Closeout files prove what happened; they do not replace this ledger, page contracts, current skills, or gates.

## Current Version

| Field | Value |
|---|---|
| Current version | V3.3.0-unified-intelligence-frontstage |
| Version name | Unified Intelligence Frontstage |
| Version layer | Minor |
| Release date | 2026-06-06 |
| Product version | V3.3 |
| Git tag | `v3.3.0-unified-intelligence-frontstage` |
| Current entries | Business Signals / First-Line Viewpoints / Dashboard |

## Current Product Baseline

- WaveSight AI is now a unified intelligence frontstage, not a V2 four-column content site.
- V3.3 has three entries: Business Signals, First-Line Viewpoints, and Dashboard.
- Business Signals uses the Raw / Pool / Card / Relationship Graph / Trend Candidate chain.
- First-Line Viewpoints uses the follow-builders / builders data chain as an independent page.
- Builders content must not enter business-signal Cards, relationship-graph evidence, or trend-candidate evidence.
- Dashboard links to `operations-console.html` and keeps the existing operations backend.
- Daily automation chain: Raw / Pool monitoring -> business-signal Cards -> business-signal data -> first-line viewpoint data -> operations data -> PR / merge -> GitHub Pages -> local Obsidian sync.

## Current Pages

| Page | File | Current Role |
|---|---|---|
| Business Signals | `01-SiteV2/site/v3-data-observation.html` | V3.3 main public page for daily Cards, relationship graph, trend candidates, and historical trend assets |
| First-Line Viewpoints | `01-SiteV2/site/follow-builders.html` | Builder Observation V1.0 merged into V3.3; shows builders public remarks, Chinese translations, people, and long-form interviews |
| Dashboard | `01-SiteV2/site/operations-console.html` | Existing operations backend |
| Pipeline Dashboard | `01-SiteV2/site/pipeline-dashboard.html` | Production-chain dashboard, kept |
| Admin | `01-SiteV2/site/admin.html` | Admin entry, kept |
| Root | `01-SiteV2/site/index.html` | Redirects to Business Signals |

Local V2 archive: `agent-workflow/backups/v2-static-pages-20260604.zip`. It is for traceability only and is not current execution truth.

## Current Sources Of Truth

| Type | File |
|---|---|
| V3 generation rules | `context/07-v3-intelligence-generation-rules.md` |
| Product map | `context/01-product-map.md` |
| V3.3 automation loop | `context/08-v3-3-automation.md` |
| VI / typography | `context/02-vi-style.md` |
| Page contracts | `context/frontstage-page-contracts.md` |
| Quality gates | `context/04-qc-rules.md` |
| Execution harness | `context/06-execution-harness.md` |

## Must Not Return

- V2 four-column pages, old homepage, old trend page, old business-brief page.
- Daily observation, trend report, or business brief as required outputs.
- First-Line Viewpoints / follow-builders mixed into Business Signals, Relationship Graph, or Trend Candidates.
- Relationship Graph reverting to large prose cards instead of visual nodes and edges.
- Trend module reverting to trend-report prose; current trend candidates only explain what the pattern is, where it appears, and evidence boundaries.
- Business Signals and First-Line Viewpoints using different topbar structures or heights.
- GitHub daily chain only producing temporary artifacts without persisting Raw / Pool / Card / site data.

## Required Checks

For page, data, or generation-rule changes, run at minimum:

```powershell
node --check 01-SiteV2/site/assets/v3-data-observation-desk.js
node --check 01-SiteV2/site/assets/follow-builders.js
node --check 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs
node --check 01-SiteV2/site/scripts/build-follow-builders-page-data.mjs
node --check 01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs
node 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs
node 01-SiteV2/site/scripts/build-follow-builders-page-data.mjs
node 01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs
node agent-workflow/tools/assert-v3-source-first-frontstage.mjs
node agent-workflow/tools/frontstage-regression-gate.mjs
```

## Freeze Points

| Freeze Point | Pages | Date | Version | Must Not Return | Gates |
|---|---|---|---|---|---|
| `V3.3.0-freeze-unified-intelligence-frontstage-20260606` | Business Signals / First-Line Viewpoints / Dashboard | 2026-06-06 | V3.3.0-unified-intelligence-frontstage | builders detached from navigation; mismatched topbars; builders mixed into business signals; automation not updating builders or ops data; missing local Obsidian sync loop | syntax + site data build + builders data build + ops data sync + source-first + frontstage regression |
| `V3.2.0-freeze-intelligence-graph-trend-20260606` | Data Observation Desk | 2026-06-06 | V3.2.0-intelligence-graph-trend | viewpoints entering graph; prose-stacked relation cards; trend-report prose; internal status as trend; V2 page logic | upgraded |
| `V3.1.1-freeze-source-first-frontstage-20260605` | Data Observation Desk / daily asset chain | 2026-06-05 | V3.1.1-source-first-frontstage | Card / trend / relation content generated from old summaries, tag explanations, or backend fields | upgraded |
| `V3.0.0-freeze-data-observation-desk-20260604` | Data Observation Desk | 2026-06-04 | V3.0.0-data-observation-desk | V2 four-column pages, old homepage, tag-count pseudo trends, internal status language | upgraded |
| `V2.2.1-freeze-frontstage-20260601` | Homepage / Trend Tracking / Trend Detail | 2026-06-01 | V2.2.1 | old trend module, synthetic trend, indirectly related content, V2.1 copy | retired |

## Version Summary

| Version | Summary | Current Status |
|---|---|---|
| V3.3.0-unified-intelligence-frontstage | Merged V3.2 Business Signals and Builder Observation V1.0; unified navigation as Business Signals / First-Line Viewpoints / Dashboard; daily automation updates business signals, first-line viewpoints, operations backend, and local sync loop | current |
| V3.2.0-intelligence-graph-trend | Relationship graph became node-based; trend candidates explain pattern, evidence, and boundary | upgraded |
| V3.1.1-source-first-frontstage | Frontstage content must return to Raw / Pool / original source | upgraded |
| V3.0.0-data-observation-desk | Frontstage became Data Observation Desk; V2 public pages were retired while operations dashboard stayed | upgraded |
| V2.2.x | Four-column content site and regression governance | retired |
