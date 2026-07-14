---
status: current
scope: version-ledger
last_updated: 2026-06-23
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
| Overall content center version | Guanlan Content Center V1.0 |
| Overall content center code | GCC-V1.0 |
| Current version | V3.3.8.3-intelligence-map-opportunity-radar |
| Version name | Intelligence Map Opportunity Radar |
| Version layer | Minor |
| Release date | 2026-07-14 |
| Last modified at | 2026-07-14T14:19:13+08:00 |
| Product version | V3.3 |
| Main website version | SITE-V3.3.8.3 |
| Business Signals column version | BSIG-V1.1.1-core-source-hygiene |
| Enterprise AI lens version | EAI-V1.1.0-fde-lens-pool |
| Intelligence Map column version | IMAP-V1.2.0-opportunity-radar |
| Business Signals data contract | V3.3.6.3-business-source-artifact-aggregation |
| Weekly Report content source | `01-SiteV2/content/08-report/` |
| Operations backend version | OPS-V1.0.1 |
| Skill Store version | v1.3.2 Cleanup management cache and common-action fix |
| Git tag | guanlan-content-center-v1.0 |
| Current entries | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence; Dashboard retained as backend |

## Current Product Baseline

- Guanlan Content Center V1.0 is the current whole-column release baseline. It does not replace the existing sub-version codes; it names the complete content center made of Business Signals, Intelligence Map, First-Line Viewpoints, Community Intelligence, and the retained operations backend.
- WaveSight AI is now a unified intelligence frontstage, not a V2 four-column content site.
- V3.3 public frontstage has four entries: Business Signals, Intelligence Map, First-Line Viewpoints, and Community Intelligence.
- Business Signals uses the Raw / Pool / Card / Relationship Graph / Trend Candidate chain.
- Business Signals is versioned as `BSIG-V1.1.1-core-source-hygiene` in this release. Its public page keeps Top10 as the primary desk, preserves the `EAI-V1.1.0-fde-lens-pool` secondary lens, and blocks generic FDE role/service pages, generic funding commentary, funding roundups, broad lists, stale sources, and search-query artifacts from Core Pool / Card promotion.
- Enterprise AI / FDE is a frontstage interpretation and monitoring lens backed by an independent FDE Lens Pool. It is not a fourth Card type, and it must not expose backend-only fields.
- Business Signals now defaults to independent source artifact collection before unified Raw / Pool normalization: `aihot`, `keyword`, `gdelt`, and `rss` each preserve source-discovered items, while the unified monitor decides final eligibility and release gates.
- First-Line Viewpoints uses the follow-builders / builders data chain as an independent page, split into a morning RSS route and an afternoon local follow-builders skill route.
- Community Intelligence uses the logged-in community collection route as an independent page and Obsidian archive stream.
- Builders content must not enter business-signal Cards, relationship-graph evidence, or trend-candidate evidence.
- Dashboard keeps the existing operations backend at `operations-console.html`, but is not exposed in the public frontstage navigation for this release.
- Daily automation is split by production lane: Business Signals, First-Line Viewpoints, and Community Intelligence each have independent monitoring / gate / persistence / PR publication boundaries.
- First-Line Viewpoints persists local Obsidian timelines as person / date files under `01-SiteV2/knowledge/02-Opinion-Timelines/people/<person>/<YYYY-MM-DD>.md`; old month files must not be reintroduced.
- Business Signals blocks social/community posts, repo/catalog pages, marketplace/package/model pages, generic funding lists, funding roundups, generic funding commentary, generic FDE role/service pages, job posts, role explainers, consulting/service landing pages, old evergreen technical posts, and search-query artifacts from formal Card promotion unless the same original source contains a concrete dated product/service, funding, customer deployment, procurement, partnership, or production rollout event.
- Hermes early handoff supervises the three lanes with lane-specific takeover windows: Community Intelligence publish at 09:30 after the 08:30 Windows collector, 08:45 publish check, and 09:00 Codex local fallback / repair window; First-Line Viewpoints RSS at 09:30 after the 08:30 local `builder-observation-daily-sync` collection/build/sync attempt and single 09:17 GitHub fallback; and Business Signals at 09:45 / 09:55. Hermes also records the afternoon follow-builders skill publish at 16:30.
- Hermes early handoff is staged: 09:30 may dispatch Community publish and First-Line RSS while Business waits; 09:45 may dispatch Business while Community / First-Line only recheck; 09:55 is final review only and cannot start a new routine dispatch.
- Intelligence Map and Dashboard follow the Business Signals data chain.
- Intelligence Map is versioned independently as `IMAP-V1.2.0-opportunity-radar`. Its relationship graph keeps graph tags, while the standalone Entry Point Map and Product Pain Map use source-backed `opportunity_signals`. Its weekly report subcolumn still reads future weekly report content from `01-SiteV2/content/08-report/`, shows the current issue plus archive entries, and keeps unpublished archive slots visibly marked instead of linking to missing reports.
- Site output remains unified on GitHub Pages, but each producing lane can independently pass gates, open a PR, merge to `main`, and trigger publication without waiting for other lanes.
- The three column monitor skills are current execution entries and must include self-improvement after recurring production failures.
- Hermes daily supervision is now routed through the unified supervision report and the Hermes -> Codex inbox.
- Project health automation now has daily, weekly, and monthly read-only report commands for supervision coverage, recurring issue review, Git hygiene, large-file review, runtime checks, and deployment-service residue.
- Skill Store governance is versioned separately as `v1.3.2`, with operations-console integration, split catalog/cleanup views, registry generation, current skill metadata, usage overrides, 30-day cleanup observation, reliable mark-common behavior, cache-busted embedded catalog/cleanup views, manual add-to-cleanup / mark-common actions, trash staging, permanent trash deletion, local Skill Store ops service, `.skill-store` sync, Daily Loop Skill Ops checks, clearer catalog metric/search wording, and simplified catalog sort/group controls.
- Deployment path is GitHub Pages only. Netlify is retired and must not be used for future website deployment.

## Current Pages

| Page | File | Current Role |
|---|---|---|
| Business Signals | `01-SiteV2/site/v3-data-observation.html` | V3.3 main public page for daily Cards, relationship graph, trend candidates, and the 企业AI化 secondary lens |
| Intelligence Map | `01-SiteV2/site/intelligence-map.html` | Relationship graph, intelligence map entry, and weekly report subcolumn |
| First-Line Viewpoints | `01-SiteV2/site/follow-builders.html` | Builder Observation V1.0 merged into V3.3; shows builders public remarks, Chinese translations, people, and long-form interviews |
| Community Intelligence | `01-SiteV2/site/community-intelligence.html` | Community Intelligence V1.0; logged-in community cases, AI tool tactics, business opportunities, and document links |
| Dashboard | `01-SiteV2/site/operations-console.html` | Existing operations backend |
| Pipeline Dashboard | `01-SiteV2/site/pipeline-dashboard.html` | Production-chain dashboard, kept |
| Admin | `01-SiteV2/site/admin.html` | Admin entry, kept |
| Root | `01-SiteV2/site/index.html` | Redirects to Business Signals |

Local V2 archive: `agent-workflow/backups/v2-static-pages-20260604.zip`. It is for traceability only and is not current execution truth.

## Current Backend Versions

| Scope | Version | Automation status | Source | Outputs |
|---|---|---|---|---|
| Operations Backend / 运营大后台 | `OPS-V1.0.1` | Unified backend shell version for `operations-console.html`; released through GitHub Pages after merge | Operations console shell, navigation, module entry contracts, and backend-facing version ledger | HTML meta `wavesight-ops-console-version`, visible sidebar version, version ledger |
| Topic Center / 选题中心 module | `V2.2.2-source-title` | Automated in the Business Signals daily PR chain at 08:57 Asia/Shanghai; regenerated after the Business frontstage gate passes and deployed through GitHub Pages after auto-merge | `business-signals + first-line-viewpoints + community-intelligence` | `topic-center.json/js`, `topic-center-hermes.json/md`, and local `04-AIP/01-选题库/<date>-每日选题.md` when local sync can run |
| Business Signals / 商业信号 column | `BSIG-V1.1.1-core-source-hygiene` | Published through the main GitHub Pages frontstage; keeps Top10 as the primary desk and adds the 企业AI化 secondary lens | V3.3.6.3 Card data contract plus Enterprise AI lens rendering plus Core Pool source hygiene gates | `v3-data-observation.html`, `v3-data-observation-desk.json` meta, version ledger |
| Intelligence Map / 情报地图 column | `IMAP-V1.2.0-opportunity-radar` | Published through the main GitHub Pages frontstage. The relationship graph remains tag/edge based; the Entry Point Map and Product Pain Map are standalone opportunity radar panels backed by `opportunity_signals` and the weekly radar updater skill. Future weekly report issues must still be sourced from `01-SiteV2/content/08-report/` before page generation. | Business Signals relationship graph + source-backed opportunity_signals + Weekly Business Change Radar content | `intelligence-map.html`, `weekly-ai-business-change-radar.html`, `weekly-ai-business-change-radar-2026-06-15.html`, `assets/weekly-report.css`, `assets/v3-data-observation-desk.css`, `agent-workflow/skills/guanlan-opportunity-radar-updater/`, `01-SiteV2/content/08-report/*.md` |

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
| `guanlan-content-center-v1.0-freeze-20260714` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence / Operations Backend | 2026-07-14 | 2026-07-14T14:19:13+08:00 | Guanlan Content Center V1.0 / GCC-V1.0 / SITE-V3.3.8.3 | Treating the whole content center as only one subcolumn; removing the existing sub-version boundaries; creating a new GitHub repository while the existing `AI-Radar` remote is active | version ledger consistency + git tag `guanlan-content-center-v1.0` |
| `SITE-V3.3.8.3-freeze-intelligence-map-opportunity-radar-20260623` | Intelligence Map / Opportunity Radar / Skill Ops | 2026-06-23 | 2026-06-23T19:35:00+08:00 | SITE-V3.3.8.3 / IMAP-V1.2.0-opportunity-radar | Signal Candidates, 时间聚集, or Tag 聚合 modules returning; Entry Point Map or Product Pain Map being driven by old `formal_tags` or generic AI-generated labels; relationship graph being converted to `opportunity_signals`; weekly opportunity radar updates running without the `guanlan-opportunity-radar-updater` skill rules | `node --check 01-SiteV2/site/assets/v3-data-observation-desk.js` + `node agent-workflow/tools/frontstage-regression-gate.mjs` + `npm run validate:guanlan-skills` + GitHub Pages deploy |
| `V3.3.8.2-freeze-business-core-source-hygiene-20260622` | Business Signals / Core Pool / Card generation | 2026-06-22 | 2026-06-22T14:35:00+08:00 | SITE-V3.3.8.2 / BSIG-V1.1.1-core-source-hygiene / EAI-V1.1.0-fde-lens-pool | `source_level` or `acquisition_source_level` used as ranking/gating/downgrade criteria; generic FDE role/service pages, job posts, role explainers, funding roundups, generic funding commentary, broad lists, stale sources, or search-query artifacts promoted into Core Pool or Cards; fixing daily quantity gaps by relaxing Core Pool quality gates | monitor quality loop + daily production chain post-monitor/pre-commit + pool-to-card dedupe + business frontstage gate + source-first/frontstage regression |
| `V3.3.8-freeze-enterprise-ai-transformation-20260617` | Business Signals / 企业AI化 | 2026-06-17 | 2026-06-17T16:00:05+08:00 | SITE-V3.3.8-enterprise-ai-transformation / BSIG-V1.1.0-enterprise-ai-transformation / EAI-V1.0.0-enterprise-ai-transformation | 企业AI化 reverting to the old FDE Lens name; multi-column case cards; visible "落地判断" / "老板追问" diagnostic fields; backend-only fields exposed in the public table; treating Enterprise AI as a fourth Card type | business frontstage gate + syntax quality gate + visual smoke + GitHub Pages deploy |
| `topic-center-v2.2.2-freeze-source-title-20260616` | Dashboard / Topic Center | 2026-06-16 | 2026-06-16T21:35:00+08:00 | V2.2.2-source-title / OPS-V1.0.1 | Topic Center list titles being generated boss judgments; `title` / `spreadTitle` storing AI interpretation instead of original source titles; Obsidian daily topic files carrying judgment titles as headings | `node --check agent-workflow/tools/build-topic-center-data.mjs` + same-date title scan + `node agent-workflow/tools/frontstage-regression-gate.mjs` + GitHub Pages deploy |
| `V3.3.7-freeze-weekly-report-intelligence-map-20260615` | Business Signals / Intelligence Map / Weekly Report | 2026-06-15 | 2026-06-15T18:44:17+08:00 | SITE-V3.3.7-weekly-report-intelligence-map / IMAP-V1.1.0-weekly-report | weekly report detached from Intelligence Map; weekly report generated from `agent-workflow/reports/` only instead of `01-SiteV2/content/08-report/`; Trend Candidates or History modules returning to Intelligence Map; table-heavy weekly report detail pages; stale frontstage meta version `V3.3.5-builder-obsidian-date-timelines` | syntax + source-first + frontstage regression + visual smoke + GitHub Pages deploy |
| `ops-v1.0.0-freeze-unified-backend-version-20260615` | Dashboard / Operations Backend | 2026-06-15 | 2026-06-15T17:40:00+08:00 | OPS-V1.0.0 | module versions being treated as the whole backend version; hidden or inconsistent operations-console version metadata; backend shell changes without updating the version ledger | `node agent-workflow/tools/frontstage-regression-gate.mjs` + HTML version check + GitHub Pages deploy |
| `topic-center-v2.2.1-freeze-daily-title-polish-20260615` | Dashboard / Topic Center | 2026-06-15 | 2026-06-15T17:25:00+08:00 | V2.2.1-title-polish | fixed template titles reused across dates; awkward generated connectors such as `背后` / `撞上`; duplicated funding wording; Hermes topic handoff missing raw material references; manual-only daily Topic Center refresh | `node --check agent-workflow/tools/build-topic-center-data.mjs` + Topic Center duplicate-title scan + `node agent-workflow/tools/frontstage-regression-gate.mjs` + GitHub Pages deploy |
| `V3.3.6.3-freeze-business-source-artifact-aggregation-20260615` | Business Signals / Intelligence Map | 2026-06-15 | 2026-06-15T16:05:34+08:00 | V3.3.6.3-business-source-artifact-aggregation | Business Signals source artifacts storing only prematurely normalized / compressed items; one source lane failure directly stopping all source capture; public Core Pool candidates with untranslated titles or garbled visible text entering frontstage JSON; artifact aggregation bypassing Raw / Pool / Card / source-first gates | source-only artifact workflow success + unified Business Signals PR workflow success + frontstage Top10 gate + GitHub Pages deploy |
| `V3.3.6.2-freeze-hermes-staged-handoff-20260614` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence | 2026-06-14 | 2026-06-14T20:10:00+08:00 | V3.3.6.2-hermes-staged-handoff | 09:55 starting a new routine dispatch; Community or First-Line being re-dispatched at 09:45 after their 09:30 handoff window; Business being judged as failed at 09:30 while 09:27 health dispatch may still be queued or running; second routine morning recovery pass returning after 10:55 | three-lane handoff syntax + staged dry-run checks + no second recovery cron |
| `V3.3.6.1-freeze-automation-timeline-skill-alignment-20260614` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence | 2026-06-14 | 2026-06-14T19:45:00+08:00 | V3.3.6.1-automation-timeline-skill-alignment | Business Signals reverting to blind 09:07 / 09:37 production windows; First-Line Viewpoints reverting to 09:47 / 09:55 RSS fallback language; Community Intelligence docs saying Codex automation is paused while the local automation is active at 09:00; Hermes treating GitHub Actions as able to run the logged-in community collector; lane failures blocking unrelated lanes | workflow cron syntax + `npm run supervise:daily -- --date=<DATE>` + monitor skill timing review |
| `V3.3.6-freeze-business-title-hermes-handoff-20260613` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence | 2026-06-13 | 2026-06-13T16:00:31+08:00 | V3.3.6-business-title-hermes-handoff | Top10 titles using source-domain placeholders such as `linkedin financing`, `github original title`, or `purpose see original`; public Core Pool candidate duplicates for the same event; social/community, repo/catalog, package/model, marketplace, or generic list sources promoted directly to formal Business Signal Cards; Business-only Hermes early handoff scheduled in parallel with three-lane handoff | title/candidate data assertion + Card promotion gate syntax + three-lane Hermes workflow syntax + Skill Ops + GitHub Pages deploy |
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
| Guanlan Content Center V1.0 / GCC-V1.0 | 2026-07-14T14:19:13+08:00 | Defines the current whole-column baseline for the unified Guanlan content center while preserving the existing SITE / Business Signals / Enterprise AI / Intelligence Map / backend sub-version contracts. | current overall content center baseline |
| SITE-V3.3.8.3 / IMAP-V1.2.0-opportunity-radar | 2026-06-23T19:35:00+08:00 | Rebuilds the Intelligence Map opportunity area around two source-backed startup radar panels: Entry Point Map and Product Pain Map. Relationship graph stays on graph tags; heat and opportunity panels use `opportunity_signals`; the new `guanlan-opportunity-radar-updater` skill defines weekly update cadence and evidence boundaries. | current |
| IMAP-V1.1.1-weekly-report-archive-list | 2026-06-23T15:25:00+08:00 | Updates the Intelligence Map weekly report subcolumn from a single current report card to a three-entry weekly archive list, adds stable selector routing and a 2026-06-15 archive detail page, and marks missing archive weeks as pending instead of linking to nonexistent reports. | upgraded |
| SITE-V3.3.8.2 / BSIG-V1.1.1-core-source-hygiene / EAI-V1.1.0-fde-lens-pool | 2026-06-22T14:35:00+08:00 | Tightens Business Signals Core Pool source hygiene: source labels are traceability-only; generic FDE role/service pages, job posts, role explainers, broad lists, funding roundups, generic funding commentary, stale sources, and search-query artifacts cannot satisfy Core Pool / Card quantity gaps. | current Business Signals baseline; site upgraded |
| SITE-V3.3.8.1 / BSIG-V1.1.0-enterprise-ai-transformation / EAI-V1.1.0-fde-lens-pool | 2026-06-19T16:10:00+08:00 | Splits Enterprise AI / FDE into an independent Lens Pool fed by Raw / Pool evidence while preserving Business Signals Top10 and Card rules. Adds `enterprise-ai-fde.json`, source-backed FDE detail checks, and Obsidian `content/09-fde` sync from the new pool. | upgraded |
| SITE-V3.3.8-enterprise-ai-transformation / BSIG-V1.1.0-enterprise-ai-transformation / EAI-V1.0.0-enterprise-ai-transformation | 2026-06-17T16:00:05+08:00 | Adds the 企业AI化 secondary lens to Business Signals for FDE-style implementation monitoring and consulting-relevant reading. The public table uses one case per row, keeps `AI化动作` and `Tags`, and hides diagnostic fields that do not help boss-facing decisions. | upgraded |
| OPS-V1.0.1 / V2.2.2-source-title | 2026-06-16T21:35:00+08:00 | Fixes Topic Center title semantics: public list titles and Obsidian daily headings now use the primary original source title; boss-facing judgment remains only in core judgment, pain point, money line, angles, and action fields. | current operations backend / current backend column |
| SITE-V3.3.7-weekly-report-intelligence-map / IMAP-V1.1.0-weekly-report | 2026-06-15T18:44:17+08:00 | Adds the weekly report subcolumn to Intelligence Map, removes Trend Candidates and History from the Intelligence Map page, publishes the first weekly report detail page, and defines `01-SiteV2/content/08-report/` as the future weekly report source path. | upgraded |
| OPS-V1.0.0 | 2026-06-15T17:40:00+08:00 | Defines the unified Operations Backend version for `operations-console.html`. The backend shell now has one visible and machine-readable version, while modules such as Topic Center keep separate module versions. | upgraded |
| V2.2.1-title-polish | 2026-06-15T17:25:00+08:00 | Defines the previous Topic Center column version. Daily topic generation runs inside the Business Signals daily PR chain, writes all Topic Center and Hermes files, keeps raw material references, but still allowed generated boss-facing judgment titles to enter the public title field. | upgraded |
| V3.3.6.3-business-source-artifact-aggregation | 2026-06-15T16:05:34+08:00 | Makes Business Signals source artifact aggregation the default production path, preserving per-source discovered items before global normalization; keeps failed source lanes isolated behind unified quality gates; filters untranslated / garbled Core Pool public candidates; validated with source-only artifact workflow, official Business Signals PR workflow, auto-merge, and GitHub Pages deploy on 2026-06-15. | current business signals data contract |
| V3.3.6.2-hermes-staged-handoff | 2026-06-14T20:10:00+08:00 | Implements staged Hermes handoff behavior: 09:30 can dispatch Community publish and First-Line RSS while Business waits; 09:45 can dispatch Business and only rechecks the other lanes; 09:55 is final review only and cannot start a new routine dispatch. Removes the second routine morning recovery pass after 10:55. | upgraded |
| V3.3.6.1-automation-timeline-skill-alignment | 2026-06-14T19:45:00+08:00 | Aligns Business Signals, First-Line Viewpoints, and Community Intelligence timing across workflow cron, local Windows tasks, Codex automations, monitor skills, and Hermes instructions. Business runs 08:57 plus 09:27 conditional health dispatch; First-Line runs 08:30 local RSS, 09:17 GitHub fallback, and 16:10 local skill publish; Community runs 08:30 Windows collection, 09:00 Codex local fallback / repair window, 08:45 / 10:45 GitHub publish, and 09:30 / 09:45 / 09:55 Hermes publish supervision. | upgraded |
| V3.3.6-business-title-hermes-handoff | 2026-06-13T17:34:22+08:00 | Fixes Business Signals public title and Core Pool candidate dedupe failures, splits First-Line Viewpoints into morning RSS and afternoon follow-builders skill routes, and makes Hermes supervise the three active lanes while recording the afternoon skill publish | upgraded |
| V3.3.5-builder-obsidian-date-timelines | 2026-06-11T19:12:07+08:00 | Converts First-Line Viewpoints Obsidian persistence from month files to person / date timeline files, adds the sync step to daily Builder automation, and aligns main frontstage version metadata | upgraded |
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
