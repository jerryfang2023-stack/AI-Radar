---
status: current
scope: version-ledger
last_updated: 2026-06-12
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
| Current version | V3.3.5-builder-obsidian-date-timelines |
| Version name | Builder Obsidian Date Timelines |
| Version layer | Patch |
| Release date | 2026-06-11 |
| Last modified at | 2026-06-11T19:12:07+08:00 |
| Product version | V3.3 |
| Skill Store version | v1.1.0 Lifecycle cleanup queue |
| Git tag | `v3.3.5-builder-obsidian-date-timelines` |
| Current entries | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence; Dashboard retained as backend |

## Current Product Baseline

- WaveSight AI is now a unified intelligence frontstage, not a V2 four-column content site.
- V3.3 public frontstage has four entries: Business Signals, Intelligence Map, First-Line Viewpoints, and Community Intelligence.
- Business Signals uses the Raw / Pool / Card / Relationship Graph / Trend Candidate chain.
- First-Line Viewpoints uses the follow-builders / builders data chain as an independent page.
- Community Intelligence uses the logged-in community collection route as an independent page and Obsidian archive stream.
- Builders content must not enter business-signal Cards, relationship-graph evidence, or trend-candidate evidence.
- Dashboard keeps the existing operations backend at `operations-console.html`, but is not exposed in the public frontstage navigation for this release.
- Daily automation is split by production lane: Business Signals, First-Line Viewpoints, and Community Intelligence each have independent monitoring / gate / persistence / PR publication boundaries.
- First-Line Viewpoints persists local Obsidian timelines as person / date files under `01-SiteV2/knowledge/02-Opinion-Timelines/people/<person>/<YYYY-MM-DD>.md`; old month files must not be reintroduced.
- Intelligence Map and Dashboard follow the Business Signals data chain.
- Site output remains unified on GitHub Pages, but each producing lane can independently pass gates, open a PR, merge to `main`, and trigger publication without waiting for other lanes.
- The three column monitor skills are current execution entries and must include self-improvement after recurring production failures.
- Hermes daily supervision is now routed through the unified supervision report and the Hermes -> Codex inbox.
- Project health automation now has daily, weekly, and monthly read-only report commands for supervision coverage, recurring issue review, Git hygiene, large-file review, runtime checks, and deployment-service residue.
- Skill Store governance is versioned separately as `v1.1.0`, with registry generation, current skill metadata, lifecycle fields, usage estimates, token footprint estimates, cleanup queue, `.skill-store` sync, and Daily Loop Skill Ops checks.
- Deployment path is GitHub Pages only. Netlify is retired and must not be used for future website deployment.

## Current Pages

| Page | File | Current Role |
|---|---|---|
| Business Signals | `01-SiteV2/site/v3-data-observation.html` | V3.3 main public page for daily Cards, relationship graph, trend candidates, and historical trend assets |
| Intelligence Map | `01-SiteV2/site/intelligence-map.html` | Relationship graph and intelligence map entry |
| First-Line Viewpoints | `01-SiteV2/site/follow-builders.html` | Builder Observation V1.0 merged into V3.3; shows builders public remarks, Chinese translations, people, and long-form interviews |
| Community Intelligence | `01-SiteV2/site/community-intelligence.html` | Community Intelligence V1.0; logged-in community cases, AI tool tactics, business opportunities, and document links |
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
| Skill Store version | `agent-workflow/skills/skill-store-version.json` |

## Must Not Return

- V2 four-column pages, old homepage, old trend page, old business-brief page.
- Daily observation, trend report, or business brief as required outputs.
- First-Line Viewpoints / follow-builders mixed into Business Signals, Relationship Graph, or Trend Candidates.
- Relationship Graph reverting to large prose cards instead of visual nodes and edges.
- Trend module reverting to trend-report prose; current trend candidates only explain what the pattern is, where it appears, and evidence boundaries.
- Business Signals and First-Line Viewpoints using different topbar structures or heights.
- Community Intelligence showing duplicate keyword-hit posts, backend diagnostic fields, placeholder tags such as `待确认`, or visible internal scores.
- GitHub daily chain only producing temporary artifacts without persisting Raw / Pool / Card / site data.
- Netlify configuration, Netlify deploy scripts, or Netlify as a fallback deployment path.

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

| Freeze Point | Pages | Date | Updated at | Version | Must Not Return | Gates |
|---|---|---|---|---|---|---|
| `V3.3.5-freeze-builder-obsidian-date-timelines-20260611` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence | 2026-06-11 | 2026-06-11T19:12:07+08:00 | V3.3.5-builder-obsidian-date-timelines | Builder Obsidian sync writing multiple days into one month file; old `YYYY-MM.md` timeline files returning; First-Line Viewpoints daily PRs skipping Obsidian persistence; main frontstage pages carrying stale V3.3.2.1 meta versions | `node --check agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs` + same-day dry-run sync + month-file absence check + builders syntax gates + GitHub Pages deploy |
| `V3.3.4-freeze-independent-lane-publication-20260610` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence | 2026-06-10 | 2026-06-10T13:40:44+08:00 | V3.3.4-independent-lane-publication | Community Intelligence local collection passing but publication blocked behind manual PR; Actions read-only permissions preventing PR creation; same-day rerun reusing merged PRs; a single lane failure blocking other lane publication | `npm run assert:community-intelligence -- --date=<DATE>` + `.github/workflows/daily-community-intelligence-pr.yml` + `npm run supervise:daily` |
| `V3.3.3.2-freeze-project-health-automation-20260610` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence | 2026-06-10 | 2026-06-10T00:44:49+08:00 | V3.3.3.2-project-health-automation | project maintenance only living in chat checklists; weekly recurring failures without a report; monthly cleanup performed before review; deletion-first Git cleanup; Netlify or artifact residue returning unnoticed | `npm run health:daily` + `npm run health:weekly` + `npm run health:monthly` |
| `V3.3.3.1-freeze-hermes-supervision-inbox-20260609` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence | 2026-06-09 | 2026-06-09T23:41:02+08:00 | V3.3.3.1-hermes-supervision-inbox | ad hoc Hermes-to-Codex handoff only in chat; daily supervision without a unified report; failed monitoring issues without inbox report path; Hermes directly editing monitor skills after incidents; Codex repairs without lane / failed_gate / report_path / data_generated / needed_action | `npm run supervise:daily` + `npm run inbox:hermes` + monitor skill evals |
| `V3.3.3-freeze-column-independent-production-skills-20260609` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence | 2026-06-09 | 2026-06-09T22:19:02+08:00 | V3.3.3-column-independent-production-skills | mixed-column production workflows; Business Signals PR staging builders or community data; First-Line Viewpoints depending on Raw / Pool / Card success; Community Intelligence treated as verified business facts; monitor skills without eval / memory self-improvement loops; direct deploy outside GitHub Pages | skill evals + workflow split + source-first + builders data gate + community gate + frontstage regression |
| `V3.3.2.1-freeze-public-frontstage-polish-20260609` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence | 2026-06-09 | 2026-06-09T21:50:57+08:00 | V3.3.2.1-public-frontstage-polish | Dashboard returning to public navigation; main column titles falling below column-page H1 tier; Core Pool/internal process tags leaking into card tags; weak/title-derived subjects in Top10/Core Pool; relationship network reverting to horizontal-drag zoom; untranslated builders blog titles | syntax + source-first + builders data gate + frontstage regression + visual smoke + GitHub Pages deploy |
| `V3.3.2-freeze-community-intelligence-v1-20260608` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence / Dashboard | 2026-06-08 | 2026-06-08 | V3.3.2-community-intelligence-v1 | Community Intelligence detached from navigation; repeated keyword-hit duplicates; visible internal scoring / diagnostic fields; placeholder tags like `待确认`; community posts treated as verified business-signal facts without source-first promotion; missing local Obsidian archive | syntax + collector syntax + archive syntax + nav consistency + visual smoke + GitHub Pages deploy |
| `V3.3.1-freeze-tag-business-builders-automation-20260607` | Business Signals / First-Line Viewpoints / Dashboard | 2026-06-07 | 2026-06-07 | V3.3.1-unified-intelligence-frontstage | V3.3.0 version drift; old non-taxonomy relation tags; Raw 80-150 / Pool 20-40 execution targets; builders data blocked behind business-signal gates; builders feed failure taking down the independent page | syntax + site data build + builders data build + tag gate + source-first + frontstage regression |
| `V3.3.0-freeze-unified-intelligence-frontstage-20260606` | Business Signals / First-Line Viewpoints / Dashboard | 2026-06-06 | 2026-06-06 | V3.3.0-unified-intelligence-frontstage | builders detached from navigation; mismatched topbars; builders mixed into business signals; automation not updating builders or ops data; missing local Obsidian sync loop | syntax + site data build + builders data build + ops data sync + source-first + frontstage regression |
| `V3.2.0-freeze-intelligence-graph-trend-20260606` | Data Observation Desk | 2026-06-06 | 2026-06-06 | V3.2.0-intelligence-graph-trend | viewpoints entering graph; prose-stacked relation cards; trend-report prose; internal status as trend; V2 page logic | upgraded |
| `V3.1.1-freeze-source-first-frontstage-20260605` | Data Observation Desk / daily asset chain | 2026-06-05 | 2026-06-05 | V3.1.1-source-first-frontstage | Card / trend / relation content generated from old summaries, tag explanations, or backend fields | upgraded |
| `V3.0.0-freeze-data-observation-desk-20260604` | Data Observation Desk | 2026-06-04 | 2026-06-04 | V3.0.0-data-observation-desk | V2 four-column pages, old homepage, tag-count pseudo trends, internal status language | upgraded |
| `V2.2.1-freeze-frontstage-20260601` | Homepage / Trend Tracking / Trend Detail | 2026-06-01 | 2026-06-01 | V2.2.1 | old trend module, synthetic trend, indirectly related content, V2.1 copy | retired |

## Version Summary

| Version | Updated at | Summary | Current Status |
|---|---|---|---|
| V3.3.5-builder-obsidian-date-timelines | 2026-06-11T19:12:07+08:00 | Converts First-Line Viewpoints Obsidian persistence from month files to person / date timeline files, adds the sync step to daily Builder automation, and aligns main frontstage version metadata | current |
| V3.3.4-independent-lane-publication | 2026-06-10T13:40:44+08:00 | Completes independent lane publication by adding the Community Intelligence PR workflow, extending daily supervision to watch the community publish lane, fixing Actions PR permissions, and preventing same-day reruns from reusing merged PRs | upgraded |
| V3.3.3.2-project-health-automation | 2026-06-10T00:44:49+08:00 | Adds read-only project health commands: `health:daily` for unified supervision, `health:weekly` for recurring issue / workflow / conflict review, and `health:monthly` for Git hygiene, repository size, large-file, old-report, runtime, and deployment residue review | upgraded |
| V3.3.3.1-hermes-supervision-inbox | 2026-06-09T23:41:02+08:00 | Adds unified daily supervision automation and the Hermes -> Codex inbox protocol. Hermes now supervises with `daily-supervision-report`, sends actionable repair requests through `agent-workflow/inbox/hermes-to-codex/`, and Codex reads them with `npm run inbox:hermes` | upgraded |
| V3.3.3-column-independent-production-skills | 2026-06-09T22:19:02+08:00 | Splits daily production into independent Business Signals, First-Line Viewpoints, and Community Intelligence monitor skills, with lane-specific gates, commit boundaries, and self-improvement eval / memory loops while preserving unified GitHub Pages publication | upgraded |
| V3.3.2.1-public-frontstage-polish | 2026-06-09T21:50:57+08:00 | Polishes the public four-column frontstage: hides Dashboard from public navigation, restores column-page H1 hierarchy, fixes Core Pool/internal tag leakage, repairs weak subjects, translates builders blog titles, and changes the intelligence map network to true zoom | upgraded |
| V3.3.2-community-intelligence-v1 | 2026-06-08 | Adds Community Intelligence V1.0 as a frontstage column; includes logged-in community collection, dedupe, value sorting, clean card display, document links, and local Obsidian archive; navigation is unified across frontstage pages | upgraded |
| V3.3.1-unified-intelligence-frontstage | 2026-06-07 | Consolidates frontstage version, formal tag taxonomy, business-signal rules and independent builders automation; builders data no longer waits behind business-signal gates | upgraded |
| V3.3.0-unified-intelligence-frontstage | 2026-06-06 | Merged V3.2 Business Signals and Builder Observation V1.0; unified navigation as Business Signals / First-Line Viewpoints / Dashboard; daily automation updates business signals, first-line viewpoints, operations backend, and local sync loop | upgraded |
| V3.2.0-intelligence-graph-trend | 2026-06-06 | Relationship graph became node-based; trend candidates explain pattern, evidence, and boundary | upgraded |
| V3.1.1-source-first-frontstage | 2026-06-05 | Frontstage content must return to Raw / Pool / original source | upgraded |
| V3.0.0-data-observation-desk | 2026-06-04 | Frontstage became Data Observation Desk; V2 public pages were retired while operations dashboard stayed | upgraded |
| V2.2.x | 2026-06-01 | Four-column content site and regression governance | retired |
