---
status: current
scope: hermes-daily-supervision
last_updated: 2026-06-14
use_when:
  - hermes daily supervision
  - monitor dispatch
  - codex repair handoff
priority: current
---

# Hermes Daily Supervision Instructions

Hermes is the daily supervisor for WaveSight AI. It should observe, classify, and hand off. It should not directly rewrite production rules, merge PRs, or bypass gates.

## Current Version Context

- Current version: `V3.3.6.1-automation-timeline-skill-alignment`.
- Version ledger: `context/version-ledger.md`.
- V3.3.6.1 keeps First-Line Viewpoints person / date Obsidian persistence, adds Business Signals title / candidate dedupe gates, and aligns the Business Signals, First-Line Viewpoints, and Community Intelligence timing / monitor skill ownership for Hermes early handoff.
- Hermes must treat old month timeline files such as `YYYY-MM.md` as legacy / cleanup candidates, not as proof that current sync is healthy.
- Do not judge Codex work by commit author name. In this repository Codex commits may use the configured Git identity.

## Daily Short Instruction

Hermes should do this every Asia/Shanghai production day:

1. 08:10 run the version state preflight when a version changed: package / ledger / AGENTS / current frontstage data meta / Skill Ops sync. This is read-only and must not block lane production by itself.
2. 08:45 check Community Intelligence local output, archive, and gate. If local collector output is missing, record that local Chrome / login repair is required; do not pretend GitHub can collect it.
3. 09:30 / 09:45 / 09:55 run the three-lane early handoff: `npm run hermes:early-handoff -- --date=<YYYY-MM-DD>`. At 09:30, First-Line Viewpoints RSS may be dispatched if the 09:17 fallback failed, same-date data is still unhealthy, and no same-date run is active. Dispatch other missing or failed lanes only after that lane's remaining scheduled monitoring window has passed and no same-date run is active.
4. Before 10:00 use Business Signals Top10 health as a target checkpoint: same-date active data, exactly 10 items, no placeholder/source-domain titles, and no public candidate duplicate flood. Do not lower gates to hit the checkpoint.
5. 10:20 read and report the Topic Center / Hermes Daily Brief only after Business Signals data is healthy or the upstream workflow has finished. If Business Signals is still queued or `in_progress`, wait instead of reporting missing topic data.
6. 10:50 check PR / merge / GitHub Pages publication for lanes that produced data. For Business Signals, explicitly check merged PR, Pages success, same-date Business data, Top10 count, and whether local sync is blocked. This check must account for the 10:45 Community Intelligence publish fallback window.
7. 10:55 run bounded morning recovery only for lanes still `failed` or `manual_required`. Do not run a second routine morning recovery pass.
8. 16:30 record the follow-builders skill publish: check the local publish report and builders viewpoints output for the afternoon skill lane.
9. For every failure, write cause, attempted action, result, report path, and one good / bad example into the Hermes report or inbox. Ask Codex to repair with validation and prevention.
10. Never lower gates, edit generated data directly, push to `main`, or loop blind reruns.

## Daily Entry

Run the unified supervision report for the Asia/Shanghai production date:

```powershell
npm run supervise:daily -- --date=<YYYY-MM-DD>
```

The report also runs the read-only Skill Ops check:

```powershell
npm run check:skill-ops
```

Skill Ops verifies the generated skill registry, current Guanlan skill metadata / eval / example coverage, and `.skill-store` mirror state. It is a governance check, not a fourth production lane.

Primary outputs:

- `agent-workflow/reports/<date>-daily-supervision-report.json`
- `agent-workflow/reports/<date>-daily-supervision-report.md`
- `agent-workflow/reports/daily-supervision-report-latest.json`
- `agent-workflow/reports/daily-supervision-report-latest.md`

## Topic Center Input

Hermes should read the complete boss-topic table from GitHub, not a Top 3 summary:

```text
01-SiteV2/site/data/topic-center-hermes.json
01-SiteV2/site/data/topic-center-hermes.md
```

The JSON contract is `readMode: all_topics`. Hermes should consume every item in `topics[]`, preserving `rank`, `score`, `sourceName`, `title`, `bossPain`, `moneyLine`, `actionHint`, and `evidenceBoundary`.

Each topic also carries source material for follow-up processing:

```text
topics[].rawMaterials[]
```

Hermes should preserve `materialId`, `kind`, `id`, `role`, `title`, `source`, `url`, `note`, `localDataPath`, and `verificationUse`.

- `role: fact_base` / `verificationUse: fact_base`: can be used as the factual base.
- `role: viewpoint_lead` or `community_lead`: only use as demand, scene, or spreadability leads unless separately verified.
- `localDataPath` points Hermes back to the GitHub data file and item id that supplied the material.

When the Hermes Daily Brief is generated, the same complete topic table is also embedded under:

```text
agent-workflow/reports/<date>-hermes-daily-brief.json -> topic_center.topics[]
```

When the report status is `failed` or `manual_required`, the same command must create or update one open Hermes inbox item per affected lane under:

```text
agent-workflow/inbox/hermes-to-codex/
```

## Timeline

| Time | Lane | Hermes action |
|---:|---|---|
| 08:10 | Version State Preflight | On version-change days, check `package.json`, `package-lock.json`, `AGENTS.md`, `context/version-ledger.md`, current frontstage data meta versions, and `npm run check:skill-ops`. Record drift only; do not block lane production unless the drift breaks a gate. |
| 08:30 | Community Intelligence Local | Windows scheduled task `WaveSight Community Intelligence Daily` runs logged-in collection, archive, gate, and local publish handoff. GitHub cannot replace this collector. |
| 08:30 | First-Line Viewpoints RSS | Local Codex automation `builder-observation-daily-sync` runs RSS / podcast collection, page-data build, gate, and Obsidian person/date sync. |
| 08:45 | Community Intelligence | Check local scheduled task, same-date community data, archive, and community gate. |
| 09:00 | Community Intelligence Codex Fallback | Codex automation `community-intelligence-daily-local` is active as a local fallback / repair window after the Windows 08:30 task. It should first check same-date community data, archive, and gate; if healthy, report no-op instead of recollecting. If missing or failed, rerun local logged-in collection and archive without touching other lanes. |
| 09:30 | Community Intelligence Publish | If local collector output exists but `.github/workflows/daily-community-intelligence-pr.yml` has not published same-date community data and no publish run is active, trigger the publish workflow. If local output is missing, record a local / Codex repair handoff. |
| Daily preflight | Skill Ops Governance | Check current Guanlan skills, registry freshness, eval/example coverage, and `.skill-store` sync without editing files. |
| 08:57 | Business Signals Primary | GitHub Actions runs `.github/workflows/daily-persistent-assets-pr.yml` for Raw / Pool / Card / Business frontstage / PR publication. |
| 09:27 | Business Signals Health Dispatch | GitHub Actions runs `.github/workflows/business-signals-health-dispatch.yml`; it waits if same-date data is healthy or a same-date run is queued / in progress / successful, otherwise dispatches the primary Business Signals workflow. |
| 09:45 | Hermes Three-Lane Early Handoff | Check Business Signals after the 08:57 primary production and 09:27 conditional health dispatch, and re-check Community Intelligence publication. Dispatch only lanes whose takeover window has passed and no same-date run is active. |
| 09:30 | Hermes Three-Lane Early Handoff | Check First-Line Viewpoints RSS after the 08:30 local Codex `builder-observation-daily-sync` collection/build/sync run and the single 09:17 GitHub fallback window. If the 09:17 fallback failed, same-date data is still missing, and no run is active, dispatch the RSS route and write the early-handoff report / Codex handoff artifacts. Also check Community Intelligence publication. |
| 10:20 | Topic Center / Hermes Daily Brief | Read `topic-center-hermes.json` / `.md` and the Hermes daily brief topic table after Business Signals has finished. This is a report checkpoint, not a separate topic-generation cron. |
| 10:45 | Community Publish Fallback | Let the second Community Intelligence publish window run if first publication did not reach `main`. GitHub Pages follows after merge to `main`. |
| 10:50 | Site publication | Check lane PR / merge / Pages status when GitHub state is available and after the Community 10:45 fallback window has had a chance to start. For Business Signals also check same-date data, Top10 count, and local sync status. |
| 10:55 | Hermes Morning Recovery | Run `npm run hermes:morning-recovery -- --date=<YYYY-MM-DD>` or the GitHub workflow `.github/workflows/hermes-morning-recovery.yml`. If any lane is `failed` or `manual_required`, dispatch bounded recovery, then write the action/result report and Codex handoff artifacts. Do not run a second routine morning recovery pass. |
| 16:30 | Hermes Afternoon Record | Check the follow-builders skill publish report and `01-SiteV2/content/07-points/<YYYY-MM-DD>-builders-viewpoints.md`. If the report or output is missing, write a Codex handoff for the afternoon skill lane. |

If any lane is still `queued` or `in_progress`, wait for it to finish before reporting that lane's data missing.

## Status Handling

| Report status | Hermes action | User action |
|---|---|---|
| `passed` | Record the report and stop. | None. |
| `warning` | Read warnings. If they are GitHub CLI timeout, skipped external checks, or missing historical reports while current data is present, do not escalate. | None unless the warning repeats for several days. |
| `waiting` | A same-date workflow or Pages deployment is queued / in progress. Wait for completion before declaring data missing or asking Codex to repair. | None. |
| `manual_required` | Follow the report action and ensure an open Hermes inbox item exists for Codex or the human operator. Usually this means manual workflow dispatch, bounded recovery, or asking Codex to inspect a lane. | Only needed for GitHub permission, login state, or manual PR merge. |
| `failed` | Ensure an open Hermes inbox item exists, then send Codex the lane repair request from the report. | Only needed if Codex asks for authorization, login, or business judgment. |

## Three-Lane Early Handoff Rule

Hermes has an earlier three-lane handoff rule because the daily monitoring target is before 10:00 Asia/Shanghai:

```powershell
npm run hermes:early-handoff -- --date=<YYYY-MM-DD>
```

Hermes must use this rule at 09:30 / 09:45 / 09:55. It supervises:

- Business Signals: if the 08:57 primary production or 09:27 conditional health dispatch fails, or if same-date Top10 assets are still missing / unhealthy and no run is active, dispatch `.github/workflows/daily-persistent-assets-pr.yml`.
- First-Line Viewpoints RSS: after the 08:30 local Codex `builder-observation-daily-sync` collection/build/sync attempt and the single 09:17 GitHub fallback attempt, if the 09:17 fallback failed, same-date builders data / Obsidian person-date timelines are missing, and no run is active by 09:30, dispatch `.github/workflows/daily-first-line-viewpoints-pr.yml`.
- First-Line Viewpoints skill publish: after the 16:10 local skill run, if the local publish report or builders viewpoints file is missing and no run is active, dispatch the local follow-builders skill publisher and record the failure in Hermes.
- Community Intelligence: after local 08:30 Windows collection, the 08:45 publish check, and the 09:00 Codex local fallback / repair window, if same-date local collector output exists but archive / publish state is missing and no run is active, dispatch `.github/workflows/daily-community-intelligence-pr.yml` for publish verification. GitHub cannot run the logged-in Chrome collector; missing local data remains a local / Codex repair handoff.

The rule writes:

- `agent-workflow/reports/<date>-hermes-three-lane-early-handoff.json`
- `agent-workflow/reports/<date>-hermes-three-lane-early-handoff.md`
- `agent-workflow/reports/hermes-three-lane-early-handoff-latest.json`
- `agent-workflow/reports/hermes-three-lane-early-handoff-latest.md`
- `agent-workflow/inbox/hermes-to-codex/<date>-<lane>-early-handoff.md` when dispatch fails or the bounded attempt cap is reached.

The report must preserve cause, issue, corrective action, result, and good / bad examples per lane. This rule is for fast handoff and diagnosis. Hermes must not directly edit production rules, lower evidence gates, push generated data to `main`, or hide failures by repeated blind reruns. If the handoff run fails, Codex should repair the earliest failing stage and add or tighten the relevant skill eval / example before closing the inbox item.

Hermes must run the morning recovery rule after the primary production windows if any of the three active lanes are still missing, `failed`, or `manual_required`:

```powershell
npm run hermes:morning-recovery -- --date=<YYYY-MM-DD>
```

The command runs the daily supervision report first, then dispatches only the failed or manual lanes through the bounded recovery dispatcher. It must not lower quality gates, rewrite production rules, directly edit generated data, or push directly to `main`.

Morning recovery writes:

- `agent-workflow/reports/<date>-hermes-morning-recovery.json`
- `agent-workflow/reports/<date>-hermes-morning-recovery.md`
- `agent-workflow/reports/hermes-morning-recovery-latest.json`
- `agent-workflow/reports/hermes-morning-recovery-latest.md`
- matching daily supervision and recovery watchdog reports;
- open Hermes inbox files under `agent-workflow/inbox/hermes-to-codex/` when Codex repair is still needed.

The GitHub workflow uploads those files as artifacts. Local Hermes runs leave them in the repository workspace for Codex. If recovery dispatches a workflow but same-date data still fails after the bounded retry cap, Hermes should stop retrying and hand Codex the exact report path, lane, cause, attempted action, and result.

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
lane: business_signals / first_line_viewpoints / community_intelligence / skill_ops
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
