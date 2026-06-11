---
status: current
scope: v3-3-current-action-index
last_updated: 2026-06-11
use_when:
  - choose current action
  - recover missing actions
  - dispatch V3.3.5 production work
  - distinguish current actions from historical tasks
priority: current
---

# V3.3.5 Current Action Index

This file is the current action registry for WaveSight AI V3.3.5.

Use it before historical dispatch boards, feature lists, closeouts, or V2 action records. Historical files can explain why a rule exists, but they must not add actions back into the current production system.

## Action Status Classes

Every action, old or new, must be treated as one of these classes:

| Status | Meaning | Codex Behavior |
|---|---|---|
| `current` | Active V3.3.5 production action. | May be used as a default execution route. |
| `manual/archive` | Historical or diagnostic action with reference value. | May be read or manually consulted, but must not run by default. |
| `retired` | Explicitly stopped action or output. | Must not be restored, required, or used as a blocker. |

Do not mark an old action as `current` just because it existed before. Only a V3.3.5-compatible route that serves the current asset system can be `current`.

## Current Actions

Only these actions are `current` for V3.3.5:

| Action | Status | Current Role |
|---|---|---|
| Daily business-signal production | `current` | Produce the day's 10 most important business-signal Cards. |
| Column monitor skills | `current` | Run and improve independent Business Signals, First-Line Viewpoints, and Community Intelligence monitoring skills. |
| Raw / Pool / Card asset chain | `current` | Separate source capture, evidence screening, and formal Cards. |
| Source-first check | `current` | Ensure frontstage facts are original-source backed. |
| Pool-to-Card dedupe | `current` | Prevent duplicate evidence from becoming duplicate Cards. |
| Relationship graph build | `current` | Build Card-derived nodes, edges, and evidence links. |
| Trend candidate judgment | `current` | Judge repeated same-direction signals, not trend reports. |
| First-line viewpoints independent update | `current` | Update builders viewpoints independently from business signals. |
| First-Line Viewpoints Obsidian timeline sync | `current` | Persist Builder viewpoints into person / date Obsidian timelines. |
| Community intelligence independent update | `current` | Update logged-in community intelligence independently from business signals and builders viewpoints. |
| Frontstage data build | `current` | Build each column's frontstage data through its owning production lane. |
| Dashboard sync | `current` | Update operations console and topic-center data. |
| GitHub PR / Pages publish | `current` | Persist generated assets through PR and deploy through Pages. |
| Local Obsidian sync | `current` | Sync merged remote assets back into the local workspace. |

## Manual / Archive Actions

These actions or records may be useful for diagnosis, audit, or historical recovery, but they are `manual/archive` and must not become default execution routes:

| Action Or Record | Status | Allowed Use |
|---|---|---|
| Historical dispatch boards | `manual/archive` | Read to understand past task sequencing or acceptance history. |
| Historical closeout reports | `manual/archive` | Read as evidence of what happened, not as current rules. |
| Historical feature list | `manual/archive` | Read only to identify old action names, owners, or status drift. |
| Old page diagnostics and redesign specs | `manual/archive` | Consult when explaining past UI choices or avoiding regressions. |
| Old V2 quality-gate reports | `manual/archive` | Use as audit evidence when comparing historical failures. |
| Old Raw / Pool / Card governance notes | `manual/archive` | Consult only when they do not conflict with V3.3.5 source-first rules. |
| Historical provider benchmarks | `manual/archive` | Consult for source-provider diagnosis, not as current sourcing policy. |
| Past handoff / progress notes | `manual/archive` | Use for context recovery only when current `context/` files are insufficient. |

Manual/archive material can explain why a current rule exists. It cannot override `AGENTS.md`, `context/00-current-state.md`, `context/version-ledger.md`, or `context/07-v3-intelligence-generation-rules.md`.

## Action Details

### 1. Daily Business-Signal Production

Purpose:

- Produce the day's 10 most important business-signal Cards for the Business Signals frontstage.

Primary route:

- GitHub workflow: `.github/workflows/daily-persistent-assets-pr.yml` at 09:07 / 09:37 / 10:07 Asia/Shanghai.
- Dry run workflow: `.github/workflows/daily-production-chain-dry-run.yml`.

Reads:

- `context/05-daily-monitoring.md`.
- `context/07-v3-intelligence-generation-rules.md`.
- `context/08-v3-3-automation.md`.
- `skills/guanlan-business-signals-monitor/SKILL.md`.

Runs:

- `agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`.
- `agent-workflow/tools/assert-guanlan-automation-readiness.mjs`.
- `agent-workflow/tools/assert-daily-production-chain.mjs`.
- `agent-workflow/tools/generate-asset-cards-from-pool.mjs`.

Outputs:

- Raw candidates.
- Pool candidates.
- 10 business-signal Cards.
- production-chain reports.

Boundaries:

- Do not produce daily observation, business brief, trend report, or opinion lane output.
- Do not allow big-company product news to dominate the whole day.

### 2. Raw / Pool / Card Asset Chain

Purpose:

- Keep materials, screened evidence, and frontstage Cards separated.

Reads:

- Raw source material.
- Pool evidence.
- `context/07-v3-intelligence-generation-rules.md`.

Runs:

- `agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`.
- `agent-workflow/tools/generate-asset-cards-from-pool.mjs`.

Outputs:

- `01-SiteV2/content/01-raw/`.
- `01-SiteV2/content/02-pool/`.
- `01-SiteV2/content/04-business-signals/signals/`.
- `01-SiteV2/knowledge/01-Signal-Cards/`.

Boundaries:

- Raw is discovery and source capture only.
- Pool is screened evidence, not frontstage content.
- Card types are only `product_service`, `funding`, and `case`.
- Card facts must come from original source text, not old summaries or backend fields.

### 3. Source-First Check

Purpose:

- Ensure frontstage facts, details, titles, and visible source fragments are source-backed.

Runs:

- `agent-workflow/tools/assert-v3-source-first-frontstage.mjs`.

Checks:

- Card body does not use old summary fields as facts.
- Frontstage details do not fall back to backend-only fields.
- Search snippets, directories, homepages, and tool listings do not become formal evidence without a dated event page.

Boundaries:

- If source evidence is missing, repair the source chain instead of relaxing the gate.

### 4. Pool-to-Card Dedupe

Purpose:

- Prevent duplicate Pool evidence from becoming repeated Cards or duplicate frontstage facts.

Runs:

- `agent-workflow/tools/assert-pool-to-card-dedupe.mjs`.

Outputs:

- `agent-workflow/reports/<date>-pool-to-card-dedupe-gate.md`.

Boundaries:

- Do not use near-duplicate articles to inflate daily Top 10.
- Do not split one company action into multiple Cards unless the source-backed business actions are clearly different.

### 5. Relationship Graph Build

Purpose:

- Build compact relationship graph inputs from accepted business-signal Cards.

Primary builder:

- `01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs`.

Outputs:

- relationship graph data inside `01-SiteV2/site/data/v3-data-observation-desk.json`.
- machine-readable intelligence entry in `01-SiteV2/site/data/intelligence-graph-index.json`.

Boundaries:

- Use Card nodes and source-backed edges only.
- Do not include builders viewpoints or opinion-only materials.
- Do not replace the graph with long prose cards.

### 6. Trend Candidate Judgment

Purpose:

- Decide whether multiple same-direction business signals are forming a trend candidate.

Runs:

- `agent-workflow/tools/run-trend-candidate-decision.mjs`.

Reads:

- accepted business-signal Cards.
- relationship graph inputs.

Outputs:

- trend candidate asset, or a no-decision shell when evidence is insufficient.

Boundaries:

- Trend candidate is not trend report.
- A single article, viewpoint, funding event, or tag count cannot form a trend.
- Builders viewpoints are not evidence for trend candidates.

### 7. First-Line Viewpoints Independent Update

Purpose:

- Update the First-Line Viewpoints page from builders / follow-builders sources without depending on the business-signal chain.

Primary route:

- GitHub workflow: `.github/workflows/daily-first-line-viewpoints-pr.yml` at 09:17 / 09:47 / 10:17 Asia/Shanghai.

Reads:

- `skills/guanlan-first-line-viewpoints-monitor/SKILL.md`.

Runs:

- `agent-workflow/tools/fetch-builder-blog-feed.mjs`.
- `agent-workflow/tools/fetch-builder-podcast-feed.mjs`.
- `01-SiteV2/site/scripts/build-follow-builders-page-data.mjs`.
- `agent-workflow/tools/assert-follow-builders-data.mjs`.
- `agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs`.

Outputs:

- `01-SiteV2/site/data/follow-builders-daily.json`.
- `01-SiteV2/knowledge/02-Opinion-Timelines/`.
- `01-SiteV2/site/follow-builders.html`.

Boundaries:

- First-line viewpoints are independent public viewpoints.
- They must not enter business-signal Cards, relationship graph evidence, or trend-candidate evidence.
- If refresh fails but previous fresh data exists, fallback may preserve the page with fallback metadata.
- Every successful daily update must also sync same-date Builder viewpoints into the Obsidian person / date timelines and verify the sync is idempotent.

### 8. Frontstage Data Build

Purpose:

- Build each public column's frontstage data after its own gate passes.

Runs:

- `01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs`.
- `01-SiteV2/site/scripts/build-follow-builders-page-data.mjs`.
- `agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs`.
- `agent-workflow/tools/frontstage-regression-gate.mjs`.

Outputs:

- `01-SiteV2/site/data/v3-data-observation-desk.json`.
- `01-SiteV2/site/data/intelligence-graph-index.json`.
- `01-SiteV2/site/data/follow-builders-daily.json`.
- `01-SiteV2/knowledge/02-Opinion-Timelines/`.

Boundaries:

- Business Signals keeps daily Top 10 as the primary view.
- Intelligence Map follows the Business Signals Card chain and does not open a separate PR.
- First-Line Viewpoints keeps the same topbar height and structure.
- First-Line Viewpoints data must be produced and gated by its independent workflow, not by the Business Signals PR.
- First-Line Viewpoints Obsidian timelines must be produced from the same gated `follow-builders-daily.json`, not from retired `05-frontier-opinions`.
- Do not restore V2 homepage modules, daily observation, business brief, or trend-report prose.

### 9. Dashboard Sync

Purpose:

- Keep the operations console aligned with the latest production-chain state.

Runs:

- `01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs`.
- `agent-workflow/tools/build-topic-center-data.mjs`.

Outputs:

- `01-SiteV2/site/data/pipeline-dashboard.json`.
- `01-SiteV2/site/data/pipeline-dashboard.js`.
- `01-SiteV2/site/data/topic-center.json`.
- `01-SiteV2/site/data/topic-center.js`.

Boundaries:

- Dashboard is an operations backend, not a public content column.
- Do not let dashboard status fields leak into frontstage Card copy.

### 10. GitHub PR / Pages Publish

Purpose:

- Persist generated assets through a PR and publish the frontstage through GitHub Pages.

Runs:

- `.github/workflows/daily-persistent-assets-pr.yml`.
- `.github/workflows/daily-first-line-viewpoints-pr.yml`.
- `.github/workflows/daily-community-intelligence-pr.yml`.
- `.github/workflows/github-pages.yml`.
- local Community Intelligence collection / archive before the community publish workflow.

Outputs:

- `automation/business-signals-<date>` branch for Business Signals / Intelligence Map / Dashboard data.
- `automation/first-line-viewpoints-<date>` branch for First-Line Viewpoints data.
- `automation/community-intelligence-<date>` branch for Community Intelligence data.
- independent column PRs.
- merged assets on `main`.
- GitHub Pages deployment from `01-SiteV2/site`.

Boundaries:

- Do not deploy directly from the automation branch.
- Do not push generated assets directly to `main`.
- Do not create temporary-only daily assets without persistence.

### 11. Community Intelligence Independent Update

Purpose:

- Update the Community Intelligence page and local Obsidian archive from logged-in community sources.

Primary route:

- Local Windows task: `WaveSight Community Intelligence Daily` at 08:30 Asia/Shanghai for collection.
- GitHub workflow: `.github/workflows/daily-community-intelligence-pr.yml` for same-date publication after local data exists.

Reads:

- `skills/guanlan-community-intelligence-monitor/SKILL.md`.

Runs:

- `agent-workflow/tools/run-community-intelligence.ps1`.
- `npm run collect:community-intelligence`.
- `npm run archive:community-intelligence`.
- `npm run assert:community-intelligence -- --date=<YYYY-MM-DD>`.
- `.github/workflows/daily-community-intelligence-pr.yml`.

Outputs:

- `01-SiteV2/site/data/community-intelligence.json`.
- `01-SiteV2/site/data/community-intelligence-daily/<date>.json`.
- `01-SiteV2/content/07-community-intelligence/`.
- `agent-workflow/reports/<date>-community-intelligence-gate.md`.
- `automation/community-intelligence-<date>` PR.

Boundaries:

- Community posts are leads, not verified Business Signals.
- Do not stage Business Signals or First-Line Viewpoints data from this lane.
- Do not treat local collection success as publication success until the community PR reaches `main` and GitHub Pages runs.

### 12. Local Obsidian Sync

Purpose:

- Bring merged remote assets back into the local Obsidian workspace.

Runs:

- `agent-workflow/tools/local-sync-from-main.ps1`.
- `agent-workflow/tools/install-local-sync-task.ps1`.
- `agent-workflow/tools/local-sync-loop.ps1`.
- `agent-workflow/tools/sync-local-obsidian-assets.mjs`.

Outputs:

- local workspace updated from `origin/main`.
- local reports under `agent-workflow/reports/`.

Boundaries:

- Do not force sync when local uncommitted changes exist.
- Do not overwrite local work to make automation look green.

## Retired Actions

The following actions are `retired` for V3.3.5:

| Action | Status | Reason |
|---|---|---|
| daily observation writing | `retired` | V3.3.5 does not require article-style daily observation output. |
| business brief / internal reference | `retired` | The current product is an asset system, not a brief-production lane. |
| trend report writing | `retired` | Current trend output is trend candidate only. |
| V2 four-column website page production | `retired` | V2 homepage and four-column public site routes are retired. |
| publiccopy gate | `retired` | Not a current publication blocker. |
| cardcopy gate | `retired` | Not a current publication blocker. |
| Guanlan copy-style gate | `retired` | Not a current publication blocker. |
| opinion lane as business-signal evidence | `retired` | First-line viewpoints are independent and cannot feed signal, graph, or trend evidence. |
| builders / follow-builders mixed into Cards | `retired` | Builders content must remain outside business-signal Cards. |
| builders / follow-builders mixed into relationship graph | `retired` | Graph evidence must come from accepted business-signal Cards. |
| builders / follow-builders mixed into trend candidates | `retired` | Trend candidates require multiple business-signal Cards, not viewpoints. |
| old V2 frontstage modules as current pages | `retired` | Current pages are Business Signals, Intelligence Map, First-Line Viewpoints, Community Intelligence, and Dashboard. |
| temporary-only daily asset generation | `retired` | V3.3.5 automation must persist assets through PR / deploy / sync. |

If a script or old task requires one of these as a blocker for current production, treat it as historical contamination and update the route.

## Dispatch Rule

When a task mentions "actions", "automation", "daily production", "frontstage update", "dashboard", "PR", or "local sync", read this file first, then read only the matching current context file and directly relevant script.
