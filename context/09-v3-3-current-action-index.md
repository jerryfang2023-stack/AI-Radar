---
status: current
scope: v3-3-current-action-index
last_updated: 2026-07-16
use_when:
  - choose current action
  - recover missing actions
  - dispatch SITE-V4.1 production and internal compatibility work
  - distinguish current actions from historical tasks
priority: current
---

# SITE-V4.0 Data Center Current Action Index

This file is the current action registry for WaveSight Data Center V4. Existing V3 actions below are internal compatibility routes unless explicitly identified as V4 core or downstream application work.

Use it before historical dispatch boards, feature lists, closeouts, or V2 action records. Historical files can explain why a rule exists, but they must not add actions back into the current production system.

## Action Status Classes

Every action, old or new, must be treated as one of these classes:

| Status | Meaning | Codex Behavior |
|---|---|---|
| `current` | Active SITE-V4.1 or internal compatibility production action. | May be used as a default execution route. |
| `compatibility/downstream` | Frozen page support or interpretation outside the V4 data core. | May run only for its downstream consumer and must not write V4 canonical tables. |
| `manual/archive` | Historical or diagnostic action with reference value. | May be read or manually consulted, but must not run by default. |
| `retired` | Explicitly stopped action or output. | Must not be restored, required, or used as a blocker. |

Do not mark an old action as `current` just because it existed before. Only a route that serves the current V4 asset system or an explicitly retained internal adapter can be `current`.

## Current Actions

Only these actions are `current` for SITE-V4.1 and retained compatibility lanes:

| Action | Status | Current Role |
|---|---|---|
| Daily Data Center V4 production | `current` | Build and gate SourceArtifact, RawDocument, Claim, Entity, CanonicalEvent, TAG-V4, FDE-V2 and HARDWARE-V1 data. |
| Data Center JSONL / DuckDB materialization | `current` | Materialize accepted canonical bundles into queryable serving tables. |
| AI Hardware data projection | `current` | Project explicit hardware product, capacity, supply and deployment events; no source-artifact bypass. |
| Enterprise AI / FDE data projection | `current` | Project explicitly disclosed implementation facts and preserve undisclosed fields. |
| Column monitor skills | `current` | Run and improve independent Business Signals, First-Line Viewpoints, and Community Intelligence monitoring skills. |
| Hermes feedback loop automation | `current` | Convert daily supervision failures into Codex repair items and close them only after validation and prevention are recorded. |
| Source / Raw / Claim / Event chain | `current` | Separate provenance, documents, exact-span Claims, entities and canonical facts. |
| Source-first check | `current` | Ensure frontstage facts are original-source backed. |
| Pool-to-Card dedupe | `current` | Prevent duplicate evidence from becoming duplicate Cards. |
| Factual relationship build | `current` | Build event/claim/entity/source links without tag-derived direction or hypotheses. |
| Industry Reports opportunity maps | `compatibility/downstream` | Feed the V4 Industry Reports application projection; outputs cannot enter V4 canonical data. |
| Industry Reports reports | `compatibility/downstream` | Keep V4 report pages working as downstream interpretation. |
| Trend candidate judgment | `compatibility/downstream` | Keep frozen pages working; trend judgment cannot enter V4 canonical data. |
| First-line viewpoints RSS update | `current` | Update builders viewpoints from the morning RSS / podcast route independently from business signals. |
| First-line viewpoints skill publish | `current` | Update builders viewpoints from the afternoon local follow-builders skill route independently from business signals. |
| First-Line Viewpoints Obsidian timeline sync | `current` | Persist Builder viewpoints into person / date Obsidian timelines. |
| Community intelligence independent update | `current` | Update logged-in community intelligence independently from business signals and builders viewpoints. |
| Frontstage data build | `current` | Build each column's frontstage data through its owning production lane. |
| Dashboard sync | `current` | Update operations console data. |
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
| Old Raw / Pool / Card governance notes | `manual/archive` | Consult only when they do not conflict with the current V3 source-first rules. |
| Historical provider benchmarks | `manual/archive` | Consult for source-provider diagnosis, not as current sourcing policy. |
| Past handoff / progress notes | `manual/archive` | Use for context recovery only when current `context/` files are insufficient. |

Manual/archive material can explain why a current rule exists. It cannot override `AGENTS.md`, `context/00-current-state.md`, `context/version-ledger.md`, or `context/07-v3-intelligence-generation-rules.md`.

## Action Details

### 1. Daily Business-Signal Production

Purpose:

- Produce qualified business-signal Card assets, then publish every active-date business signal that passes raw-to-card cardability for the Business Signals frontstage.

Primary route:

- Local consolidated controller: `WaveSight Morning Production Dispatch` at 08:10 Asia/Shanghai conditionally dispatches `.github/workflows/daily-persistent-assets-pr.yml` after a non-blocking preflight.
- Targeted recovery: `WaveSight Daily Recovery Controller` at 09:15 checks accepted V4, active runs, First-Line, and Community health. Accepted V4 prevents a full-chain rerun even when compatibility data needs repair.
- Cloud fallback: `.github/workflows/business-signals-health-dispatch.yml` remains a late conditional safety check; the primary production workflow itself is dispatch-only.
- Daily Problem Watchdog: `.github/workflows/daily-recovery-watchdog.yml` records Business Signals failures to Hermes inbox without dispatching recovery or rerunning the full chain.
- Dry run workflow: `.github/workflows/daily-production-chain-dry-run.yml`.

Reads:

- `context/05-daily-monitoring.md`.
- `context/07-v3-intelligence-generation-rules.md`.
- `context/08-v3-3-automation.md`.
- `agent-workflow/skills/guanlan-business-signals-monitor/SKILL.md`.

Runs:

- `agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`.
- `agent-workflow/tools/assert-daily-production-chain.mjs`.
- `agent-workflow/tools/generate-asset-cards-from-pool.mjs`.

Outputs:

- Raw candidates.
- Pool candidates.
- qualified Signal Card assets plus the active-date unified frontstage Card set.
- production-chain reports.

Current stage order: one source-capture/evidence-supply attempt -> Card generation/dedupe/editorial quality -> frontstage contract -> publication. Provider and diagnostic quantity notes do not start another full monitor attempt.

Boundaries:

- Do not produce legacy content-output routes or opinion-lane output from the Business Signals chain.
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

- Do not use near-duplicate articles to inflate the active-date public Card set.
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

### 5.1 Industry Reports Opportunity Maps

Purpose:

- Refresh the Industry Reports page's two startup-oriented opportunity maps once per week:
  - Entry Point Map / 切入点图: buyer or user x concrete task.
  - Product Pain Map / 产品痛点图: pain or constraint x product form / delivery model.

Primary route:

- `agent-workflow/skills/guanlan-opportunity-radar-updater/SKILL.md`.

Reads:

- accepted Business Signal Cards.
- original source excerpts.
- `agent-workflow/product/opportunity-signal-taxonomy.json`.
- `01-SiteV2/site/data/v3-data-observation-desk.json`.

Cadence:

- Run inside the consolidated weekly report task every Monday at 10:30 Asia/Shanghai, after the previous Monday-Sunday Business Signals window is complete.
- Use latest 7 days for current heat, 30 days for baseline, and 90 days only as persistence context.

Outputs:

- refreshed `opportunity_signals` when source-near fields need repair.
- updated Industry Reports opportunity map panels.
- validation report from frontstage regression when page or data output changes.

Boundaries:

- Do not use old `formal_tags` aggregation for these maps.
- Do not use First-Line Viewpoints or Community Intelligence as direct map evidence unless separately promoted through Raw / Pool / Card.
- Do not modify relationship graph tag logic from this route.
- Do not create a separate opportunity-map scheduled task; the weekly report controller owns the refresh.

### 6. Industry Reports

Purpose:

- Publish monthly / weekly AI business reports as Industry Reports entries and V4 detail pages.

Primary route:

- Weekly report source: `01-SiteV2/content/08-report/`.
- Frontstage pages: `01-SiteV2/site/intelligence-map.html`, `01-SiteV2/site/monthly-business-structure-2026-06.html`, and weekly report detail pages; `reports.html` is a redirect only.
- Weekly generation: Monday 10:30 for the previous complete Monday-Sunday window.
- Monthly generation: 14:00 on the first Monday-Friday weekday for the previous calendar month, together with monthly maintenance.
- Controller: `agent-workflow/tools/run-periodic-automation-controller.mjs`.
- Gate order: report content gate first; weekly/monthly page-generator skill and frontstage regression second.

Boundaries:

- Reports are site publication layers, not the Business Signals Card source of truth.
- Opinions and Community Intelligence can support interpretation and demand cross-checks, but they must not become business-signal facts, relationship-graph evidence, or trend-candidate evidence.
- The periodic controller creates a local `codex/automation-*` branch only. Push, merge, and deployment remain explicit follow-up actions.

### 7. Trend Candidate Judgment

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

- Trend candidate is an internal candidate object, not a long-form publication route.
- A single article, viewpoint, funding event, or tag count cannot form a trend.
- Builders viewpoints are not evidence for trend candidates.

### 8. First-Line Viewpoints RSS Update

Purpose:

- Update the First-Line Viewpoints page from the morning RSS / podcast builders route without depending on the business-signal chain.

Primary route:

- Local Codex automation: `builder-observation-daily-sync` at 08:30 Asia/Shanghai. The local automation config stores this as `FREQ=DAILY;BYHOUR=0;BYMINUTE=30;BYSECOND=0` because the observed Codex scheduler interprets `rrule` hours as UTC. This is a collection-first task: fetch builder blog RSS, fetch builder podcast RSS, build `follow-builders-daily.json`, validate, then sync Obsidian.
- Conditional GitHub fallback: the 09:15 consolidated recovery controller dispatches `.github/workflows/daily-first-line-viewpoints-pr.yml` only when the local gate is unhealthy and no same-date run exists.
- Daily Problem Watchdog records failed publication runs; routine recovery performs at most the single 09:15 fallback.

Reads:

- `agent-workflow/skills/guanlan-first-line-viewpoints-monitor/SKILL.md`.

Runs:

- `agent-workflow/tools/fetch-builder-blog-feed.mjs`.
- `agent-workflow/tools/fetch-builder-podcast-feed.mjs`.
- `01-SiteV2/site/scripts/build-follow-builders-page-data.mjs`.
- `agent-workflow/tools/assert-follow-builders-data.mjs`.
- `agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs`.

Outputs:

- `01-SiteV2/site/data/follow-builders-daily.json`.
- `01-SiteV2/knowledge/02-Opinion-Timelines/`.
- `01-SiteV2/site/data-center.html?view=viewpoints`; `follow-builders.html` is a redirect only.

Boundaries:

- First-line viewpoints are independent public viewpoints.
- They must not enter business-signal Cards, relationship graph evidence, or trend-candidate evidence.
- If refresh fails but previous fresh data exists, fallback may preserve the page with fallback metadata.
- Every successful daily update must also sync same-date Builder viewpoints into the Obsidian person / date timelines and verify the sync is idempotent.

### 8.1 Follow-Builders Skill Publish

Purpose:

- Update the First-Line Viewpoints builders digest from the afternoon local `follow-builders` skill route.

Primary route:

- Local Windows scheduled task: `agent-workflow/tools/install-follow-builders-skill-task.ps1` at 16:10 Asia/Shanghai.

Timing truth:

- The afternoon skill lane follows the upstream `zarazhangrui/follow-builders` feed update.
- Recent upstream feed evidence landed between 15:33 and 16:02 Asia/Shanghai, so local publication runs at 16:10 instead of 13:30.

Reads:

- `agent-workflow/tools/generate-builders-viewpoints-from-follow-builders-skill.mjs`.
- `agent-workflow/tools/publish-follow-builders-skill-local.mjs`.

Outputs:

- `01-SiteV2/content/07-points/<YYYY-MM-DD>-builders-viewpoints.md`.
- `01-SiteV2/knowledge/02-Opinion-Timelines/` person / date timeline updates from the generated skill viewpoints.
- `agent-workflow/reports/<date>-follow-builders-skill-local-publish.md`.

Boundaries:

- The afternoon skill publish is independent from the morning RSS route.
- It must still publish through a branch and PR instead of pushing generated files directly to `main`.
- Hermes records the afternoon run from the local publish report at 16:30 and checks the Obsidian sync counts in that report.

### 9. Frontstage Data Build

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

- Business Signals keeps one active-date unified Card set as the primary view.
- Industry Reports maps follow the internal compatibility Card chain. Report pages update through V4 Industry Reports page work.
- First-Line Viewpoints keeps the same topbar height and structure.
- First-Line Viewpoints data must be produced and gated by its independent workflow, not by the Business Signals PR.
- First-Line Viewpoints Obsidian timelines must be produced from the same gated `follow-builders-daily.json`, not from retired `05-frontier-opinions`.
- Do not restore V2 homepage modules or legacy content-output prose.

### 10. Dashboard Sync

Purpose:

- Keep the operations console aligned with the latest production-chain state.

Runs:

- `01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs`.

Outputs:

- `01-SiteV2/site/data/pipeline-dashboard.json`.
- `01-SiteV2/site/data/pipeline-dashboard.js`.

Boundaries:

- Dashboard is an operations backend, not a public content column.
- Do not let dashboard status fields leak into frontstage Card copy.

### 11. GitHub PR / Pages Publish

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
- `automation/follow-builders-skill-<date>` branch for the afternoon follow-builders skill publish.
- `automation/community-intelligence-<date>` branch for Community Intelligence data.
- independent column PRs.
- merged assets on `main`.
- GitHub Pages deployment from `01-SiteV2/site`.

Boundaries:

- Do not deploy directly from the automation branch.
- Do not push generated assets directly to `main`.
- Do not create temporary-only daily assets without persistence.

### 12. Community Intelligence Independent Update

Purpose:

- Update the Community Intelligence page and local Obsidian archive from logged-in community sources.

Primary route:

- Primary local Windows task: `WaveSight Community Intelligence Daily` at 08:30 Asia/Shanghai for logged-in collection, archive, gate validation, and local publish handoff.
- Successful local collection owns the publish handoff. The 09:15 consolidated recovery controller validates same-date data, archive, and gate health and records local repair when Chrome/login collection is missing.
- GitHub workflow: `.github/workflows/daily-community-intelligence-pr.yml` is dispatch-only for targeted publication repair after local data exists.

Reads:

- `agent-workflow/skills/guanlan-community-intelligence-monitor/SKILL.md`.

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

### 13. Local Obsidian Sync

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

The following action groups are `retired` for SITE-V4.1:

| Action Group | Status | Reason |
|---|---|---|
| legacy content-output routes | `retired` | SITE-V4.1 is a factual data center, not an old content-production lane. |
| V2 four-column website page production | `retired` | V2 homepage and four-column public site routes are retired. |
| legacy copy gates | `retired` | Not current publication blockers. |
| opinion lane as business-signal evidence | `retired` | First-line viewpoints are independent and cannot feed signal, graph, or trend evidence. |
| builders / follow-builders mixed into Cards | `retired` | Builders content must remain outside business-signal Cards. |
| builders / follow-builders mixed into relationship graph | `retired` | Graph evidence must come from accepted business-signal Cards. |
| builders / follow-builders mixed into trend candidates | `retired` | Trend candidates require multiple business-signal Cards, not viewpoints. |
| old V2/V3 frontstage modules as current pages | `retired` | Current pages are Data Center, Industry Reports, V4 report details, compatibility redirects, and Dashboard. |
| temporary-only daily asset generation | `retired` | Current V4 automation must persist assets through PR / deploy / sync. |

If a script or old task requires one of these as a blocker for current production, treat it as historical contamination and update the route.

## Dispatch Rule

When a task mentions "actions", "automation", "daily production", "frontstage update", "dashboard", "PR", or "local sync", read this file first, then read only the matching current context file and directly relevant script.
