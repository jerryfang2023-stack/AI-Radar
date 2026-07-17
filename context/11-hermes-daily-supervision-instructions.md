---
status: current
scope: hermes-daily-supervision
last_updated: 2026-07-05
use_when:
  - hermes daily supervision
  - monitor dispatch
  - codex repair handoff
priority: current
---

# Hermes Daily Supervision Instructions

Hermes is the daily supervisor for WaveSight AI. It should observe, classify, and hand off. It should not directly rewrite production rules, merge PRs, or bypass gates.

## Current Version Context

- Current public site version: `SITE-V4.1.0-unified-frontstage`.
- Current Hermes supervision contract: `V3.4.3-daily-problem-watchdog`.
- Current Business Signals column version: `BSIG-V2.2.0-pipeline-stage-ownership`.
- Current Enterprise AI / FDE lens version: `EAI-V1.2.0-raw-card-ingestion-boundary`.
- Current Business Signals data contract: `V3.3.6.3-business-source-artifact-aggregation`.
- Version ledger: `context/version-ledger.md`.
- SITE-V4.1 keeps independent First-Line Viewpoints and Community Intelligence production, V4 factual events/FDE/hardware, and Industry Reports downstream application data. Business Signals Cards and graph/trend data remain internal compatibility assets only. Hermes observes and records problems; it does not run early handoff, bounded recovery, or automatic full-chain reruns.
- Hermes must treat old month timeline files such as `YYYY-MM.md` as legacy / cleanup candidates, not as proof that current sync is healthy.
- Do not judge Codex work by commit author name. In this repository Codex commits may use the configured Git identity.

## Daily Short Instruction

Hermes should do this every Asia/Shanghai production day:

1. 08:10 run the version state preflight when a version changed: package / ledger / AGENTS / current frontstage page meta / current frontstage data meta / Skill Ops sync / Skill Store dashboard data. This is read-only and must not block lane production by itself. Ignore old versions only when they appear in `context/version-ledger.md` historical rows.
2. 08:45 check Community Intelligence local output, archive, and gate. If local collector output is missing, record that local Chrome / login repair is required; do not pretend GitHub can collect it.
3. Daily Problem Watchdog records failed production workflows into dated reports and Hermes inbox items. It must not dispatch recovery or start another full-chain run.
4. Before 10:00 use Business Signals public Card health as a target checkpoint: same-date active data, `BSIG-V2.2.0-pipeline-stage-ownership` unified public Cards present, AI Hardware lens-only items not counted as formal Cards, no placeholder/source-domain titles, no public Top10/candidate split, and FDE public items respecting `EAI-V1.2.0-raw-card-ingestion-boundary`. Do not lower gates to hit the checkpoint.
5. 09:58 check PR / merge / GitHub Pages publication for lanes that produced data. For Business Signals, explicitly check merged PR, Pages success, same-date Business data, public Card count, FDE detail openability / source-bounded demand-service-result fields, and whether local sync is blocked. This check must account for the 09:35 Community Intelligence publish fallback window and treat queued / in-progress runs as Waiting.
6. 16:30 record the follow-builders skill publish: check the local publish report and builders viewpoints output for the afternoon skill lane.
7. For every failure, write cause, result, report path, and one good / bad example into the Hermes report or inbox. Ask Codex to repair with validation and prevention.
8. Never lower gates, edit generated data directly, push to `main`, dispatch recovery, or loop blind reruns.

## Optimized Supervision Flow

Use this order every day to avoid duplicate checks and blind reruns:

1. Version preflight: confirm public pages agree on `SITE-V4.1.0-unified-frontstage` and `IMAP-V2.1.0-v4-unified-frontstage`; internal compatibility files may retain `SITE-V3.4.5` and `BSIG-V2.2.0-pipeline-stage-ownership`. Treat ledger history as history.
2. Lane readiness: check whether each producing lane has same-date output or an active same-date run before declaring missing data.
3. Data quality: check the lane-specific public contract, not generic volume alone.
   - Business Signals: unified `BSIG-V2.2.0-pipeline-stage-ownership` Cards, separate AI Hardware lens-only items, source-first titles/facts, no Top10/candidate split, no backend-only / low-value items.
   - Enterprise AI / FDE: FDE Lens Pool items have title/fact ingestion status, concrete implementation evidence, open detail, and source-bounded demand / service / result analysis.
   - First-Line Viewpoints: person / original-date Obsidian sync idempotency.
   - Community Intelligence: local logged-in collector output, archive, gate, and Waiting-vs-Problem publication state.
4. Publication closure: check PR / merge / Pages only after reusable data exists; do not convert publication failure into a data rerun.
5. Handoff: write one categorized inbox item per lane / root cause with report path, failed gate, reusable artifacts, and requested Codex repair.

## Daily Entry

Run the unified supervision report for the Asia/Shanghai production date:

```powershell
npm run supervise:daily -- --date=<YYYY-MM-DD>
```

The report also runs the read-only Skill Ops check:

```powershell
npm run check:skill-ops
```

Skill Ops verifies the generated skill registry, current Guanlan skill metadata / eval / example coverage, `.skill-store` mirror state, and the independent Skill Store dashboard semantic contract. The check is read-only and does not synchronize or rebuild assets. It is a governance check, not a fourth production lane.

Primary outputs:

- `agent-workflow/reports/<date>-daily-supervision-report.json`
- `agent-workflow/reports/<date>-daily-supervision-report.md`
- `agent-workflow/reports/daily-supervision-report-latest.json`
- `agent-workflow/reports/daily-supervision-report-latest.md`

When the report status is `failed` or `manual_required`, the same command must create or update one open Hermes inbox item per affected lane under:

```text
agent-workflow/inbox/hermes-to-codex/
```

## Business Signals Data Reading Contract

When Hermes checks Business Signals card counts, category mix, or funding presence, the canonical current-day source is the active-date public Card set:

1. Primary frontstage source: `01-SiteV2/site/data/v3-data-observation-desk.json`.
2. Resolve `activeDate` from `meta.activeDate`.
3. Count only `frontstageCards.filter(card.date === activeDate)`.
4. If using `01-SiteV2/site/data/intelligence-graph-index.json`, treat `todayFrontstageCards` and `summary.todayFrontstageCards` as internal compatibility analytics, not the public V4 event set.
5. Do not use `coreSignalCards` as the public count; it is only a relationship-analysis subset.
6. Do not use top-level `cards` as the current-day count unless it is explicitly filtered by `activeDate`; top-level `cards` is a historical archive.
7. Do not report funding for today from `dailyLens.categoryStats.last7`, `dailyLens.categoryStats.total`, historical `cards`, or previous reports. Funding presence for today is `active-date public cards where category === "funding"`.
8. Normalize category aliases before analytics: `product-service` and `product_service` are the same product / service category.

## Timeline

| Time | Lane | Hermes action |
|---:|---|---|
| 08:10 | Version State Preflight | On version-change days, check `package.json`, `package-lock.json`, `AGENTS.md`, `context/version-ledger.md`, current page meta, current frontstage data meta versions, Skill Store dashboard data, and `npm run check:skill-ops`. Record drift only; do not block lane production unless the drift breaks a gate. |
| 08:30 | Community Intelligence Local | Windows scheduled task `WaveSight Community Intelligence Daily` runs logged-in collection, archive, gate, and local publish handoff. GitHub cannot replace this collector. |
| 08:30 | First-Line Viewpoints RSS | Local Codex automation `builder-observation-daily-sync` runs RSS / podcast collection, page-data build, gate, and Obsidian person/date sync. |
| 08:45 | Community Intelligence | Check local scheduled task, same-date community data, archive, and community gate. |
| 09:00 | Community Intelligence Codex Fallback | Codex automation `community-intelligence-daily-local` is active as a local fallback / repair window after the Windows 08:30 task. It should first check same-date community data, archive, and gate; if healthy, report no-op instead of recollecting. If missing or failed, rerun local logged-in collection and archive without touching other lanes. |
| 09:30 | Community Intelligence Publish | If local collector output exists but `.github/workflows/daily-community-intelligence-pr.yml` has not published same-date community data and no publish run is active, trigger the publish workflow. If local output is missing, record a local / Codex repair handoff. |
| Daily preflight | Skill Ops Governance | Check current Guanlan skills, registry freshness, eval/example coverage, and `.skill-store` sync without editing files. |
| 08:57 | Business Signals Primary | GitHub Actions runs `.github/workflows/daily-persistent-assets-pr.yml` for Raw / Pool / Card / Business frontstage / PR publication. |
| 09:27 | Business Signals Health Dispatch | GitHub Actions runs `.github/workflows/business-signals-health-dispatch.yml`; it waits if same-date data is healthy or a same-date run is queued / in progress / successful, otherwise dispatches the primary Business Signals workflow. |
| 09:30 | Morning Problem Check | After Community local collection / publish check and First-Line 09:17 fallback, classify missing or failed outputs. Write a problem report / inbox item when needed; do not dispatch recovery. |
| 09:45 | Business / FDE Recheck | Judge the Business 08:57 primary and 09:27 health dispatch path. Check `BSIG-V2.2.0-pipeline-stage-ownership` unified Cards, separate AI Hardware lens, and `EAI-V1.2.0` FDE boundary separately. If output is unhealthy and no run is active, write a problem report / inbox item; do not dispatch recovery. |
| 09:55 | Final Problem Check | Wait for active runs, record failures, or mark `manual_required`; avoid duplicate inbox writes and do not start a routine dispatch. |
| 09:35 | Community Publish Fallback | Let the second Community Intelligence publish window run if first publication did not reach `main`. GitHub Pages follows after merge to `main`. |
| 09:58 | Site publication | Check lane PR / merge / Pages status when GitHub state is available and after the Community 09:35 fallback window has had a chance to start. For Business Signals also check same-date data, public Card count, FDE detail openability, Reports Center follow-through when report / opportunity data changed, and local sync status. Treat queued / in-progress runs as Waiting. |
| 16:30 | Hermes Afternoon Record | Check the follow-builders skill publish report, `01-SiteV2/content/07-points/<YYYY-MM-DD>-builders-viewpoints.md`, the report's `publish_status` / `publish_error`, and `obsidian_sync_*` counts. If the report, output, publish closure, or Obsidian sync result is missing or failed, write a Codex handoff for `afternoon_skill_runner` or `afternoon_publication_failure`. |

If any lane is still `queued` or `in_progress`, wait for it to finish before reporting that lane's data missing.

## Status Handling

| Report status | Hermes action | User action |
|---|---|---|
| `passed` | Record the report and stop. | None. |
| `warning` | Read warnings. If they are GitHub CLI timeout, skipped external checks, or missing historical reports while current data is present, do not escalate. | None unless the warning repeats for several days. |
| `waiting` | A same-date workflow or Pages deployment is queued / in progress. Wait for completion before declaring data missing or asking Codex to repair. | None. |
| `manual_required` | Follow the report action and ensure an open Hermes inbox item exists for Codex or the human operator. Manual workflow dispatch is allowed only after targeted diagnosis proves no reusable same-date artifacts exist. | Only needed for GitHub permission, login state, or manual PR merge. |
| `failed` | Ensure an open Hermes inbox item exists, then send Codex the lane repair request from the report. | Only needed if Codex asks for authorization, login, or business judgment. |

## Daily Problem Watchdog Rule

Hermes has one problem-monitoring workflow:

```powershell
npm run problem:daily -- --date=<YYYY-MM-DD>
```

The GitHub workflow is `WaveSight Daily Problem Watchdog` (`.github/workflows/daily-recovery-watchdog.yml`). It observes failed production workflows and writes reports / inbox items only.

It writes:

- `agent-workflow/reports/<date>-daily-recovery-watchdog.json`
- `agent-workflow/reports/<date>-daily-recovery-watchdog.md`
- `agent-workflow/inbox/hermes-to-codex/<date>-<lane>-daily-problem-watchdog.md` for actionable problems.

Hard rules:

- Do not run or recreate Hermes morning recovery or early handoff workflows.
- Do not dispatch Business Signals, First-Line Viewpoints, Community Intelligence, or any recovery workflow from Hermes.
- If a lane workflow is queued / in progress, record Waiting instead of missing data.
- If same-date artifacts are healthy, repair publication / PR / Pages only.
- If Business Signals Pool audit supply and Card supply are sufficient, provider Raw failures are diagnostic and must not trigger a full Raw rerun.
- Codex should repair the earliest failing stage and add or tighten the relevant skill eval / context rule before closing the inbox item.

## Weekly And Monthly Review

Run weekly and monthly reports as read-only reviews:

```powershell
npm run health:weekly -- --date=<YYYY-MM-DD> --days=7
npm run health:monthly -- --date=<YYYY-MM-DD> --days=30
```

Weekly review should look for repeated failures that need a gate, eval, or monitor skill memory update. Monthly review should look for Git hygiene, stale branches/worktrees, large files, old report cleanup candidates, runtime drift, and deployment-service residue. Hermes reports findings; Codex performs code, rule, or cleanup changes.

## Codex Handoff Format

When Hermes asks Codex for a repair, use this format exactly:

```text
lane: business_signals / enterprise_ai_fde / first_line_viewpoints / community_intelligence / reports_center / skill_ops
failed_gate: <gate name or report path>
report_path: <exact report path>
data_generated: yes / no / stale / unknown / not_applicable
needed_action: repair rule / repair script / rerun gate / manual dispatch / commit only
notes: <one or two lines of concrete evidence>
```

Do not send broad descriptions without report paths. Codex should be able to start from the report and reproduce the failure.

Hermes can also write the request as a file under:

```text
agent-workflow/inbox/hermes-to-codex/YYYY-MM-DD-<lane>-<short-slug>.md
```

Codex reads the inbox with:

```powershell
npm run inbox:hermes -- --status=open --latest=false
```

Codex can print a repair prompt only with:

```powershell
npm run inbox:hermes -- --status=open --latest=false --format=prompt
```

After Codex repairs and validates the issue, close the item with:

```powershell
npm run resolve:hermes -- --file=<inbox-file> --fix-commit=<commit-or-pending> --validation=<check> --prevention=<gate|eval|memory|context|not-needed>
```

Use `agent-workflow/inbox/hermes-to-codex/TEMPLATE.md` for the required fields.

## Boundaries

- Do not treat `warning` as a production failure unless it repeats or blocks publication.
- Do not push directly to `main`; publication remains automation branch -> PR -> `main` -> GitHub Pages.
- Do not use `05-frontier-opinions/*` as current First-Line Viewpoints evidence.
- Do not use old `01-SiteV2/knowledge/02-Opinion-Timelines/people/*/YYYY-MM.md` month files as proof of current First-Line Viewpoints Obsidian sync.
- Do not use community posts or builders viewpoints as Business Signal facts unless separately verified through Raw / Pool.
- Do not copy stale artifact `site-content.json` during Business Signals recovery; rebuild site data from current Cards.
- Do not edit monitor skills directly after an incident. Ask Codex to update evals / rules / memory and commit.

## Human Escalation

Ask the user only for:

- GitHub permission or manual PR merge;
- community source login / QR code / browser session repair;
- business judgment that cannot be inferred from source-backed data;
- approval for a new scheduled task, credential, or deployment mechanism.
