---
status: current
scope: site-v4-automation
last_updated: 2026-07-17
use_when:
  - github automation
  - daily monitoring
  - site data sync
  - obsidian local sync
priority: current
---

# SITE-V4.1 Data Center Automation Loop

The daily production workflow builds the Data Center V4 factual bundle after Raw evidence supply, then builds frozen V3 Card / graph / trend assets only as internal compatibility and downstream-application input. V4 build, integrity gate, and JSONL materialization are release-blocking. Retired V3 page assets are not generated or deployed.

SITE-V4.1 automation is lane-independent for production and site-unified for publication. First-Line Viewpoints and Community Intelligence keep independent data gates and are projected into the V4 Data Center shell. Business Signals continues as an internal V3.3.6.3 compatibility lane after the V4 integrity gate. Reports Center (`REPORTS-V1.0.0-periodic-report-center`) publishes monthly / weekly reports through the periodic content gate and deterministic renderer. Opportunity Map (`OMAP-V1.0.0-independent-column`) independently reads source-backed opportunity signals from `industry-reports-frontstage.json`; no public page reads the V3 desk JSON. Hermes remains a problem monitor: failed production runs are recorded by Daily Problem Watchdog for targeted Codex repair.

## Business Signals GitHub Chain

Workflow: `.github/workflows/daily-persistent-assets-pr.yml`

Source-only diagnostic workflow: `.github/workflows/business-signals-source-raw.yml`

The source-only workflow runs `--source-only=aihot|keyword|gdelt|rss` and uploads source Raw artifacts under `agent-workflow/reports/source-runs/<date>/`. It is a diagnostic and source-repair aid only: it does not generate formal Raw originals, Pool, Cards, PRs, site data, Obsidian sync, or deployment. Use it to isolate a broken source lane before rerunning the unified Business Signals chain.

Second-stage source aggregation is the default Business Signals production path. The workflow first collects `aihot`, `keyword`, `gdelt`, and `rss` source-only JSON artifacts independently, preserving each lane's source-discovered items before global normalization, then runs `--use-source-artifacts=true` / `--source-artifact-dir=<dir>` through the existing monitor normalize / enrich / refill / Raw / Pool path. If one source lane fails, the workflow writes a failed source artifact and lets the unified Raw / Pool / Card quality gates decide whether release can continue.

Current monitor parameter baseline:

- diagnostic score reference: `85` only as report context; evidence-supply, Card/editorial and frontstage gates decide release;
- `--max-cycles=1`; production does not recollect every source lane or rerun the full monitor automatically;
- post-fetch historical hash dedupe may adaptively consume more candidates from the same source-artifact aggregation, up to the configured adaptive limit; it does not trigger another source collection cycle;
- `--search-limit=200`;
- `--search-path-query-limit=5`;
- `--gdelt-query-limit=12`;
- `--hn-limit=8`;
- `--fetch-timeout-ms=20000`;
- `--snapshot-timeout-ms=16000`;
- `--monitor-timeout-ms=900000`.

The production PR workflow, dry-run workflow, Daily Problem Watchdog, and skill examples must stay aligned to this baseline. HN remains feedback-only discovery and should not be expanded to fix routed Pool or cardable-signal shortages; those failures require better original-source capture and Pool routing.

Execution order:

1. Resolve the Beijing date.
2. Skip only the business-signal chain when the day's Raw / Pool / signal assets already exist on `main`.
3. Run one Daily Monitor attempt and the executable evidence-supply gate.
4. Persist Raw / Pool assets.
5. Build SourceArtifact / RawDocument / Claim / Entity / CanonicalEvent and FDE / hardware / TAG-V4 projections.
6. Run the Data Center V4 integrity gate and materialize V4 JSONL tables.
7. Generate Signal Card, relationship, and trend assets only for V3 internal compatibility, then run their existing gates.
8. Build and gate V4 frontstage projections, Industry Reports application data, and operations data.
9. Run the pre-commit freshness gate and write the persistent asset manifest.
10. Push the automation branch, create or update the PR, merge after gates pass, and deploy through GitHub Pages.

The four production states are `evidence_supply`, `card_quality`, `frontstage_contract`, and `publication`. A failure must be owned by exactly one state. Publication conflict or an open automation PR is `publication_waiting`; it must not dispatch another monitor run.

An existing `automation/business-signals-<date>` branch must not block a scheduled rerun. The workflow should update the same branch and PR instead of skipping, because a previous delayed or partial run may have left the branch stale.

`intelligence-graph-index.json` is the stable machine-readable entry for Hermes Agent / data-officer analysis. It is generated from the same Card / backend audit / relationship / trend-candidate compatibility dataset and must be committed whenever `v3-data-observation-desk.json` is updated. Both files stay out of the GitHub Pages artifact.

Hermes may use `v3-data-observation-desk.json.meta.activeDate` and `frontstageCards.filter(card.date === activeDate)`, or `intelligence-graph-index.json.todayFrontstageCards` / `summary.todayFrontstageCards`, only to measure the internal Card compatibility lane. These counts are not the public V4 event set. `intelligence-graph-index.json.cards` is a historical archive, and `coreSignalCards` is a relationship-analysis subset. Normalize `product-service` to `product_service` for compatibility analytics.

## Morning Production And Problem Monitoring

The 2026-06-09 morning incident report is treated as pre-V3.3.3 upgrade input. Its historical 08:00 failures should not restore the exact-hour schedule. Current morning schedule truth is:

- Consolidated morning controller: local Windows task `WaveSight Morning Production Dispatch` runs at 08:10 Asia/Shanghai, performs the non-blocking Skill Ops preflight, and conditionally dispatches `.github/workflows/daily-persistent-assets-pr.yml`.
- Business cloud fallback: `.github/workflows/business-signals-health-dispatch.yml` remains a late safety check. It must not dispatch when same-date Data Center V4 already passed, even if frozen compatibility assets still need repair.
- First-Line Viewpoints RSS primary production: 08:30 local Codex `builder-observation-daily-sync` for RSS collection, page-data build, and Obsidian sync; the 09:15 consolidated recovery controller dispatches the GitHub workflow only when the local gate is unhealthy and no same-date run exists.
- First-Line Viewpoints skill publish: local follow-builders skill at 16:10 Asia/Shanghai; supervision records it at 16:30.
- Community Intelligence local collection: 08:30 Asia/Shanghai on the local Windows machine via Windows task `WaveSight Community Intelligence Daily`; successful local collection owns its publish handoff. The 09:15 controller validates the lane and records local repair when login/browser collection is missing; GitHub cannot replace it.
- Daily Problem Watchdog: observes failed production workflows and writes reports / Hermes inbox items. It must not dispatch recovery or start another full-chain run.
- Consolidated recovery: local Windows task `WaveSight Daily Recovery Controller` runs at 09:15, routes Business, First-Line, and Community failures to the earliest responsible stage, and never reruns accepted V4 evidence for a compatibility-only defect.
- Consolidated closure: local Windows task `WaveSight Daily Automation Closure` runs at 09:50, runs the safe self-check and invokes Codex only for unresolved targeted tasks.

Operational rules:

1. The primary Data Center production dispatch is the local 08:10 controller; GitHub cron is not the morning SLA clock.
2. The 09:15 controller checks same-date V4 data and active/successful runs before dispatching. Accepted V4 plus unhealthy compatibility data is targeted repair, not a new source run.
3. If a lane workflow is `queued` or `in_progress`, supervision waits for it instead of declaring missing data.
4. Auto-merge skip is not automatically a data-generation failure. It means publication may require PR / repository-permission handling.
5. All lanes must still publish through automation branch, PR, merge to `main`, then GitHub Pages. Direct `main` push is not the current policy.
6. If Business Signals is blocked only by `raw_count_min`, a source-channel/provider quota note, keyword-only floor, AI-title ratio, or off-topic raw-title diagnostic while Pool audit supply and Card supply are sufficient, do not rerun Raw. Treat it as diagnostic and repair the exact downstream blocker.
7. Watchlist aggregate material can guide source repair or Pool rerouting only. It is not direct Card evidence until source-backed entries pass the current raw-to-card rules.
8. Community Intelligence cannot be collected inside GitHub Actions because it depends on the local Chrome profile and logged-in community sessions. GitHub may publish already-validated community files, but missing local collector output remains a local / Codex repair handoff.
9. Daily Problem Watchdog writes `agent-workflow/reports/<date>-daily-recovery-watchdog.json`, `.md`, and `agent-workflow/inbox/hermes-to-codex/<date>-<lane>-daily-problem-watchdog.md` for actionable problems.
10. The 09:50 closure should complete before 10:00 when production state is observable. If a same-date workflow is still queued or in progress, classify the lane as waiting rather than failed.

## Daily Problem Watchdog

Workflow: `.github/workflows/daily-recovery-watchdog.yml`

Script: `agent-workflow/tools/dispatch-daily-recovery.mjs`

The problem watchdog records production failures after failed workflow events or manual dispatch. It never dispatches recovery workflows. Its job is to write a dated report and, when needed, a Hermes inbox item for targeted Codex repair.

Problem-monitoring rules:

1. If Business Signals, First-Line Viewpoints, or Community Intelligence publish workflow fails, the watchdog checks whether a same-date successful run already exists.
2. If no same-date run is active or successful, the watchdog writes `agent-workflow/reports/<date>-daily-recovery-watchdog.*` and, for actionable problems, `agent-workflow/inbox/hermes-to-codex/<date>-<lane>-daily-problem-watchdog.md`.
3. It must not dispatch Business Signals, First-Line Viewpoints, Community Intelligence, or any Hermes recovery workflow.
4. Community Intelligence collection still cannot run in GitHub Actions because it depends on the local Chrome profile and logged-in browser state.
5. The expected follow-up is targeted diagnosis from the inbox report, reusing same-date artifacts whenever Pool audit supply, Card supply, or lane-specific healthy outputs are already sufficient.

Manual command:

```powershell
npm run problem:daily -- --date=<YYYY-MM-DD> --lanes=business_signals,first_line_viewpoints,community_publish
```

## Retired Hermes Recovery / Early Handoff

The Hermes morning recovery and early handoff workflows are retired. Do not recreate or run:

- `.github/workflows/hermes-morning-recovery.yml`
- `.github/workflows/hermes-business-signals-early-handoff.yml`
- `.github/workflows/hermes-three-lane-early-handoff.yml`
- `npm run hermes:morning-recovery`
- `npm run hermes:business-early-handoff`
- `npm run hermes:early-handoff`

If a lane fails after its production window, use the Daily Problem Watchdog report / inbox item to drive targeted repair. Do not use Hermes as a full-chain rerun trigger.

## First-Line Viewpoints RSS Chain

Workflow:

- Local Codex automation: `builder-observation-daily-sync` at 08:30 Asia/Shanghai, expressed as `FREQ=DAILY;BYHOUR=0;BYMINUTE=30;BYSECOND=0` in the local Codex automation config because the observed scheduler interprets `rrule` hours as UTC. This is a collection-first task: fetch builder blog RSS, fetch builder podcast RSS, then build `follow-builders-daily.json`, validate, and sync Obsidian.
- Conditional GitHub fallback: the 09:15 consolidated recovery controller dispatches `.github/workflows/daily-first-line-viewpoints-pr.yml` only when the local gate is unhealthy and no same-date run exists.

Execution order:

1. Resolve the Beijing date.
2. Refresh builder blog and podcast feeds when available.
3. Build first-line viewpoint data: `01-SiteV2/site/data/follow-builders-daily.json`.
4. Run the first-line viewpoint data gate: `agent-workflow/tools/assert-follow-builders-data.mjs`.
5. Sync the same production date into the local Obsidian viewpoint timelines: `agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs --from=<date> --to=<date>`.
6. Write the first-line viewpoint manifest.
7. Push `automation/first-line-viewpoints-<date>`.
8. Create or update the PR.
9. Auto-merge or enable auto-merge after the first-line gate and Obsidian sync pass.
10. Deploy through GitHub Pages after `main` updates.

Problem supervision:

- Treat the 08:30 local Codex automation as the first morning RSS collection/build/sync attempt.
- Treat the 09:15 conditional dispatch as the only fallback attempt when same-date data and Obsidian timelines are still missing.
- At 09:50, closure checks same-date `follow-builders-daily.json` and Obsidian person/date timeline files. If the fallback failed, same-date data is still missing, and no run is active, record a targeted repair task instead of dispatching another workflow.

This workflow must not write business-signal Cards, relationship graph data, trend candidates, or community intelligence data.

## First-Line Viewpoints Skill Chain

Workflow:

- Local Windows scheduled task: `agent-workflow/tools/install-follow-builders-skill-task.ps1`.

Timing truth:

- The local `follow-builders` skill reads central feed files from `zarazhangrui/follow-builders`.
- Recent feed `generatedAt` / feed commit evidence on 2026-06-09 through 2026-06-13 landed between 15:33 and 16:02 Asia/Shanghai.
- The local scheduled task therefore runs after that upstream window at 16:10 Asia/Shanghai; 13:30 is too early for the afternoon skill feed.

Execution order:

1. Resolve the Beijing date.
2. Run the local `follow-builders` skill publisher.
3. Generate `01-SiteV2/content/07-points/<YYYY-MM-DD>-builders-viewpoints.md`.
4. Sync the generated skill viewpoints into `01-SiteV2/knowledge/02-Opinion-Timelines/`.
5. Record the local publish report at `agent-workflow/reports/<date>-follow-builders-skill-local-publish.md`, including Obsidian sync counts.
6. Commit and push the publish branch through `automation/follow-builders-skill-<date>` from an isolated temporary Git index based on `origin/main`, staging only First-Line owned outputs. Other lane dirty files in the main workspace and Windows long-path checkout limits must not block the afternoon builders publish.
7. Create or update the PR.
8. Auto-merge or enable auto-merge after the skill publish and Obsidian sync pass.
9. Hermes records the run at 16:30 from the local publish report.

This skill lane does not write business-signal Cards, relationship graph data, trend candidates, or community intelligence data, and it stays independent from the morning RSS route.

## Monitoring Lane Ownership

| Lane | Primary runner | Main trigger | Success gate | Persistence |
|---|---|---|---|---|
| Data Center V4 / Business compatibility | local consolidated controller + GitHub Actions + Data Center / Business lane skills | 08:10 local conditional dispatch; 09:15 targeted recovery; cloud health workflow is late safety fallback only | V4 evidence, Claim/Event integrity, materialization; compatibility Card/frontstage gates remain downstream and cannot invalidate accepted V4 | V4 assets persist after V4 gate; compatibility assets persist only after their own gates |
| Reports Center / Opportunity Map | GitHub Actions + monthly/weekly report page-generator Skills + `agent-workflow/skills/guanlan-opportunity-radar-updater/SKILL.md` | report content passes acceptance before `render-periodic-report-pages.mjs` writes HTML; map evidence follows the compatibility Card chain and is projected independently | periodic content gate + deterministic report renderer + report page-generator Skill rules + compatibility Card gate + opportunity radar skill rules | included in periodic-report or Business PRs according to the changed application |
| First-Line Viewpoints | Local Codex morning RSS collection/build/sync + conditional GitHub fallback + local afternoon follow-builders skill lane | 08:30 local primary; 09:15 controller fallback only when unhealthy; 16:10 afternoon skill | builders data gate + Obsidian sync idempotency + local publish report | independent automation PR to `main` |
| Community Intelligence | Windows local collection + local publish handoff + controller supervision | 08:30 local collection/publish; 09:15 controller validates or records local repair | `agent-workflow/tools/assert-community-intelligence-data.mjs` | local files and archive, then independent community PR to `main` |

The lanes share the same public frontstage but do not share the same blocking conditions. A failure in Business Signals must not prevent First-Line Viewpoints from refreshing. Community Intelligence depends on local logged-in browser state and is supervised separately. Site-level publication remains unified through GitHub Pages after `main` updates.

## GitHub Pages Deployment

Workflow: `.github/workflows/github-pages.yml`

Triggers:

- `main` branch updates;
- changed paths under `01-SiteV2/site/**`, `01-SiteV2/content/**`, `01-SiteV2/knowledge/**`, or the Pages workflow itself.

Deploy directory:

- `01-SiteV2/site`

## Local Obsidian Sync

Local sync scripts:

- `agent-workflow/tools/local-sync-from-main.ps1`
- `agent-workflow/tools/install-local-sync-task.ps1`
- `agent-workflow/tools/local-sync-loop.ps1`
- `agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs`

Sync behavior:

1. When the local machine is online, the scheduled task or loop runs.
2. The script fetches remote `main`.
3. If the local workspace is clean and local `main` can fast-forward, it pulls.
4. Merged Raw / Pool / Card / site data / first-line viewpoint data / first-line Obsidian timelines / community intelligence data / ops data become visible in local Obsidian as their independent PRs reach `main`.
5. If local uncommitted changes exist, sync pauses to avoid overwriting local work.

Install command:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File agent-workflow/tools/install-local-sync-task.ps1 -RunOnceNow
```

Manual sync command:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File agent-workflow/tools/local-sync-from-main.ps1
```

## Community Intelligence Local Task

Local community intelligence scripts:

- `agent-workflow/tools/run-community-intelligence.ps1`
- `agent-workflow/tools/install-community-intelligence-task.ps1`
- `agent-workflow/tools/uninstall-community-intelligence-task.ps1`

Install command:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File agent-workflow/tools/install-community-intelligence-task.ps1
```

Manual run command:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File agent-workflow/tools/run-community-intelligence.ps1
```

Runtime behavior:

1. Check `http://127.0.0.1:9333/json/version`.
2. Start Chrome with `.codex-browser-profile/community-scan` when the CDP endpoint is unavailable.
3. Run `npm run collect:community-intelligence`.
4. Run `npm run archive:community-intelligence`.
5. Run `npm run assert:community-intelligence -- --date=<YYYY-MM-DD>`.
6. Retry once after a delay when the installed scheduled task is configured with the default `-MaxAttempts 2`.
7. Publish the validated local files through an automation branch and PR when the installed scheduled task is configured with the default publish-after-success behavior.
8. Write logs to `agent-workflow/reports/community-intelligence/community-intelligence-YYYYMMDD.log`.

Local publish script:

```powershell
node agent-workflow/tools/publish-community-intelligence-local.mjs --date=<YYYY-MM-DD>
```

The local publisher stages only Community Intelligence data, daily snapshots, Obsidian archive files, category views, and community gate reports. It must not stage business-signal Cards, relationship graph data, trend candidates, or first-line viewpoint data.

Community Intelligence gate script:

```powershell
node agent-workflow/tools/assert-community-intelligence-data.mjs --date=<YYYY-MM-DD>
```

The gate checks that:

- `01-SiteV2/site/data/community-intelligence.json` exists and was generated for the Asia/Shanghai date;
- item count and deduped links meet minimum floors;
- selected keyword rotation and collector errors are recorded;
- the daily Obsidian archive, index, and category views exist;
- `agent-workflow/reports/<date>-community-intelligence-gate.md` and `community-intelligence-gate-latest.md` are written.

## Community Intelligence GitHub Publish

Workflow: `.github/workflows/daily-community-intelligence-pr.yml`

This workflow publishes community data already produced by the local collector. It does not run the local browser collector.

Execution order:

1. Resolve the Asia/Shanghai date.
2. Run `npm run assert:community-intelligence -- --date=<date>`.
3. Write the community manifest.
4. Stage only Community Intelligence data, daily snapshots, archive files, views, and gate reports.
5. Push `automation/community-intelligence-<date>`.
6. Create or update the PR.
7. Auto-merge or enable auto-merge after the community gate passes.
8. Deploy through GitHub Pages after `main` updates.

Hermes should treat local collection success without the community publish workflow / PR / merge as incomplete publication, not as a completed lane.

## First-Line Viewpoint Data Sources

`01-SiteV2/site/scripts/build-follow-builders-page-data.mjs` uses this source order:

1. local `~/.skill-store/follow-builders/scripts/prepare-digest.js`;
2. local `~/.skill-store/follow-builders/feed-x.json` / `feed-podcasts.json`;
3. GitHub runner fallback: public follow-builders feeds.

If the follow-builders refresh fails but a previous generated `follow-builders-daily.json` exists, the builder keeps the previous data and records `fallbackUsed=true` in `meta`. This prevents the independent First-Line Viewpoints page from failing only because a feed endpoint is temporarily unavailable.

This lets both local runs and GitHub runners build the First-Line Viewpoints page.

The afternoon follow-builders skill route writes its own knowledge output to `01-SiteV2/content/07-points/<YYYY-MM-DD>-builders-viewpoints.md`, syncs that output into `01-SiteV2/knowledge/02-Opinion-Timelines/`, and records the run in `agent-workflow/reports/<date>-follow-builders-skill-local-publish.md`.

`01-SiteV2/knowledge/02-Opinion-Timelines/` is the current Obsidian reading view for this lane. It must be generated from `follow-builders-daily.json` with original remark dates, person / date files such as `people/<person>/2026-06-11.md`, and URL / id dedupe:

```powershell
node agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs --from=<YYYY-MM-DD> --to=<YYYY-MM-DD>
```

`01-SiteV2/content/05-frontier-opinions/*` is retired history for this lane. Current success must be judged from `01-SiteV2/site/data/follow-builders-daily.json`, the follow-builders data gate, and the Obsidian timeline sync.

## First-Line Viewpoint Quality Gate

Gate script:

```powershell
node agent-workflow/tools/assert-follow-builders-data.mjs --date=<YYYY-MM-DD>
```

The gate checks:

- builders data JSON exists and is fresh;
- remarks and builders counts meet the daily floor;
- every remark has an original URL and no duplicate id / URL;
- every remark has a complete Chinese translation for primary frontstage display;
- every remark has `translationStatus=translated`; untranslated English copied into `translation` is a blocking failure;
- every remark has at least one `opinion`, one `track`, and one `source` formal tag from `agent-workflow/product/tag-taxonomy.md`;
- fallback data is allowed only when it remains fresh and records `fallbackReason`;
- business-signal fields such as Raw / Pool refs, relationship graph, or trend candidates are not present.

The first-line workflow may stage `follow-builders-daily.json` only after this gate passes.

After the gate passes, the workflow must stage `01-SiteV2/knowledge/02-Opinion-Timelines/` only if `sync-follow-builders-to-opinion-timelines.mjs` succeeds. A second run for the same date should add `0` entries; otherwise treat it as a duplicate / idempotency failure.

Do not treat a zero count of `### <run-date>` headings as missing sync by itself. Opinion timeline files are keyed by each remark's original source date, so a same-day production run can legitimately write only earlier original-date files. The skip / health check must use same-date `follow-builders-daily.json` plus `sync-follow-builders-to-opinion-timelines.mjs --from=<date> --to=<date> --dry-run=true` reporting `added: 0`.

## First-Line Viewpoints Obsidian Automation Plan

Trigger:

- The 09:15 consolidated recovery controller conditionally dispatches the First-Line workflow when same-date data is missing and no run is active.
- Daily Problem Watchdog records failed publication workflows; it does not start another fallback.
- Manual `workflow_dispatch` with `date=<YYYY-MM-DD>`.
- Local repair run after a failed GitHub workflow or after backfill.

Daily execution:

1. Resolve the Asia/Shanghai production date.
2. If same-date frontstage JSON and same-date Obsidian timeline entries already exist on `main`, skip scheduled reruns.
3. Refresh builder blog and podcast feeds when available.
4. Rebuild `01-SiteV2/site/data/follow-builders-daily.json`.
5. Run `assert-follow-builders-data.mjs --date=<date>`.
6. Run `sync-follow-builders-to-opinion-timelines.mjs --from=<date> --to=<date>`.
7. Upload gate, build, and Obsidian sync logs as artifacts.
8. Stage only first-line owned files: frontstage JSON, builder feed JSON, first-line reports, and `01-SiteV2/knowledge/02-Opinion-Timelines/`.
9. Open or update `automation/first-line-viewpoints-<date>` PR.
10. Merge only after both the data gate and Obsidian sync pass.

Validation:

```powershell
node --check agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs
node agent-workflow/tools/assert-follow-builders-data.mjs --date=<YYYY-MM-DD>
node agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs --from=<YYYY-MM-DD> --to=<YYYY-MM-DD>
node agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs --from=<YYYY-MM-DD> --to=<YYYY-MM-DD> --dry-run=true
```

The dry-run / second run must report `added: 0`.

Failure handling:

- If the data gate fails, do not run or stage Obsidian timeline changes.
- If Obsidian sync fails, do not open / merge the First-Line Viewpoints PR.
- If the workflow skipped because frontstage data exists but Obsidian entries are missing, rerun with `workflow_dispatch`.
- If local uncommitted work exists, do not force pull, stash, reset, or overwrite; repair locally and report the dirty worktree.

## Hermes / Codex Coordination

Daily Hermes operating instructions live in `context/11-hermes-daily-supervision-instructions.md`.

Hermes is the daily supervisor, not the writer of every fix. It should read these stable machine outputs before asking Codex to modify code:

- `agent-workflow/reports/<date>-daily-supervision-report.json`
- `agent-workflow/reports/<date>-persistent-asset-manifest.json`
- `agent-workflow/reports/<date>-follow-builders-data-gate.md`
- `agent-workflow/reports/<date>-community-intelligence-gate.md`

Generate the unified supervision report with:

```powershell
npm run supervise:daily -- --date=<YYYY-MM-DD>
```

The report is read-only supervision. It does not trigger production, edit data, merge PRs, or deploy the site. It returns `passed`, `warning`, `manual_required`, or `failed` per lane and writes a compact repair request for Hermes to send Codex.

Hermes should send Codex a compact repair request containing:

1. lane: `business_signals`, `first_line_viewpoints`, or `community_intelligence`;
2. failing gate and exact report path;
3. whether data generation already ran;
4. desired boundary: repair rule, repair script, rerun gate, or commit only.

Codex should make code / rule changes, run the smallest relevant validation, commit the repair, and report the commit hash back. Hermes should then use the next run or a manual dispatch to verify production behavior instead of editing the same files independently.

### Daily Supervision Evidence Precedence

Daily supervision must classify lane health in this order:

1. same-date data and required gate health;
2. same-date PR / publication evidence;
3. latest workflow run status;
4. local scheduled-task history or observability warnings.

Do not let a red latest workflow, missing GitHub run, or non-zero Windows task result override newer same-date data that already passed the lane gate. If a later local repair writes the same-date data and gate after an earlier supervision report, rerun daily supervision or resolve the stale Hermes inbox instead of leaving the old report as the active truth.

Lane-specific rules:

- Business Signals compatibility is data-healthy when activeDate matches the production date, compatibility Cards exist, `intelligence-graph-index.json` exists, and the Card / monitor gates pass. `frontstageSelection.supplyConstrained=true` is warning-only when compatibility Cards and gates pass. A red workflow after healthy same-date data is a publication / branch / PR repair.
- First-Line Viewpoints is public-lane healthy when same-date `follow-builders-daily.json` exists, remarks / builders meet floors, and the follow-builders data gate passes. Missing GitHub fallback state is observability only when local data is healthy.
- Community Intelligence local collection is healthy when same-date `community-intelligence.json` exists, items / links meet floors, collector errors are zero, archive outputs exist, and the community gate passes. A non-zero scheduled-task `LastTaskResult` is warning-only after healthy local data; a red GitHub publish workflow after healthy local data is a publish workflow / PR repair.

## Project Health Automation

Project maintenance is split into daily supervision, weekly retrospective, and monthly cleanup review. The health commands below are read-only report generators. They do not delete files, edit rules, merge PRs, or deploy.

Daily health uses the same unified supervision report as Hermes, including the read-only Skill Ops governance check:

```powershell
npm run health:daily -- --date=<YYYY-MM-DD>
```

Weekly health summarizes recent daily reports, repeated lane failures, GitHub Actions health, and historical wording that may conflict with the current V3.4 rules:

```powershell
npm run health:weekly -- --date=<YYYY-MM-DD> --days=7
```

Monthly maintenance reviews local Git hygiene, worktrees, branch state, repository size, large tracked files, old report cleanup candidates, runtime versions, and deployment-service residue:

```powershell
npm run health:monthly -- --date=<YYYY-MM-DD> --days=30
```

Primary outputs:

- `agent-workflow/reports/<date>-weekly-health.md`
- `agent-workflow/reports/<date>-weekly-health.json`
- `agent-workflow/reports/<date>-monthly-maintenance.md`
- `agent-workflow/reports/<date>-monthly-maintenance.json`
- matching `*-latest.*` report aliases.

Weekly and monthly reports should produce a recommended action list. Codex performs any cleanup or code change after review; Hermes may use these reports to decide whether a recurring issue should become a gate, eval, or monitor skill memory update.

### Consolidated Periodic Report Automation

Install the Windows tasks with:

```powershell
npm run install:periodic-automation-tasks
```

| Schedule (Asia/Shanghai) | Controller phase | Result |
|---|---|---|
| Monday 10:30 | `weekly-report` | Refresh source-backed opportunity signals, rebuild the compatibility projection, generate the weekly report for the previous Monday-Sunday window, pass the content gate, then generate and test the weekly page. |
| Sunday 18:00 | `weekly-health` | Run `health:weekly`; when repeated failures are present, create a Hermes inbox item requiring a durable gate, eval, or MEMORY prevention artifact. |
| Daily 14:00 with first-weekday guard | `monthly` | On the first Monday-Friday weekday only, generate the previous calendar month's structure report and monthly maintenance report, pass the content gate, then generate and test the monthly page. |

Weekly and monthly production is owned by `.github/workflows/periodic-reports-pr.yml` under `REPORTS-V1.0.0-periodic-report-center`. DeepSeek Pro writes source-ID-cited Markdown only; `assert-periodic-report-content.mjs` accepts or rejects it; `render-periodic-report-pages.mjs` is the sole HTML, navigation, and report-version writer; and the monthly/weekly report page-generator Skills define page structure and validation. The workflow opens and merges a PR; GitHub Pages deploys from `main`. Local periodic tasks are disabled by default to avoid duplicate production and may be installed only as an explicit recovery lane.

Historical model-assisted extraction is owned by `.github/workflows/model-assist-historical-backfill-pr.yml`. It scans every Raw batch in the selected range, sends only eligible gaps to DeepSeek Pro, auto-promotes exact-span Claim/FDE/hardware candidates after deterministic gates, and keeps entity resolution plus QA repair review-only.

The daily 09:50 closure also runs `assert-data-center-projection-coverage.mjs`. It checks Entity/EntityMention references, accepted-event entity references, Entity Index organization/product projection, and current-batch FDE/hardware projection. A batch with zero FDE or hardware records is warning-only; the gate never invents records to satisfy a quota.

## No-Hermes Daily Self Check And Safe Repair

When the daily monitor should run without Hermes inbox, use the self-check wrapper. It calls daily supervision with `--hermes=off`, writes a non-Hermes repair report, and can run only deterministic safe repairs.

Check only:

```powershell
npm run selfcheck:daily -- --date=<YYYY-MM-DD>
```

Check plus safe repairs:

```powershell
npm run selfrepair:daily -- --date=<YYYY-MM-DD>
```

Safe repair means:

- rebuild the stale skill registry and Skill Store dashboard, then run the dashboard semantic contract;
- synchronize the `.skill-store` mirror only when `--allow-skill-store-sync=true` is explicitly supplied and the project copy has been confirmed authoritative;
- rerun existing data gates when the source data already exists;
- rerun Business Signals frontstage gate when frontstage data already exists;
- write `agent-workflow/reports/<date>-daily-self-check.md/json` and `daily-self-check-latest.*`;
- produce Codex repair tasks for unresolved problems.

Safe repair must not:

- lower evidence gates;
- promote weak Business Signal evidence;
- use First-Line Viewpoints or Community Intelligence as Business Signal facts;
- run the full Business Signals production chain blindly;
- force local sync over dirty worktrees;
- deploy directly from an automation branch.

Install the consolidated morning, recovery, and closure tasks:

```powershell
npm run install:daily-automation-tasks
```

This installs 08:10 production dispatch, 09:15 targeted recovery, and 09:50 closure. It disables the separate 09:40 self-repair, 09:50 Codex handoff, and expired agent-review trial tasks after the replacements are registered.

## No-Hermes Codex Self Repair Handoff

When the daily self-check leaves `codex_repair_tasks`, use the Codex handoff wrapper. It reruns the non-Hermes self-check, writes a task-specific prompt, and can optionally invoke the local Codex CLI through `codex exec`.

Generate a prompt / report only:

```powershell
npm run codex:selfrepair -- --date=<YYYY-MM-DD>
```

Invoke Codex directly:

```powershell
npm run codex:selfrepair:invoke -- --date=<YYYY-MM-DD>
```

The separate Codex scheduled-task installer remains for manual recovery only. Routine automation uses the 09:50 consolidated closure task.

Codex handoff rules:

- read `agent-workflow/reports/<date>-daily-self-check.*` and the linked daily supervision report;
- handle only the unresolved `codex_repair_tasks`;
- keep generated report artifacts out of the final diff unless they are required prevention artifacts;
- block direct invocation on a dirty worktree unless `--allow-dirty=true` / `-AllowDirty` is intentionally set;
- run the smallest relevant validation after a code, rule, gate, or skill repair.

The intended morning flow is: 08:10 conditional production dispatch, 08:30 independent local collectors, 09:15 one targeted recovery window, and 09:50 self-check plus Codex closure. Do not add another routine full-chain dispatch between these checkpoints.

## Data Observation Multi-Agent Review Trial

The data observation agent layer is a one-week sidecar review for the whole observation desk. It does not replace the three production lanes or Industry Reports, and it must not edit Raw, Pool, Cards, frontstage data, PRs, scheduled tasks, or deployment state.

Run manually:

```powershell
npm run agentreview:data-observation -- --date=<YYYY-MM-DD>
```

The one-week scheduled trial is retired after its configured window. Run a new trial manually only when a new dated evaluation window is explicitly approved:

```powershell
npm run install:agent-review-task -- -At 10:05 -TrialStart <YYYY-MM-DD> -TrialDays 7
```

Default outputs:

- `agent-workflow/reports/<date>-data-observation-agent-review.json`
- `agent-workflow/reports/<date>-data-observation-agent-review.md`
- `agent-workflow/reports/<date>-data-observation-agent-review-prompts.md`
- `agent-workflow/reports/data-observation-agent-review-latest.*`

The five agents are horizontal review roles, not lane owners:

| Agent | Business Compatibility | First-Line Viewpoints | Community Intelligence | Industry Reports |
|---|---|---|---|---|
| Source Scout | source coverage gaps, category gaps, source diversity | remarks / builder coverage | item / link coverage | relationship-map coverage |
| Evidence Verifier | six Signal Card gates and source URL checks | original URL, translation, formal tags | lead evidence and URL presence | Card reference integrity |
| Business Analyst | high-value commercial actions and priorities | light context only | high-value opportunity leads only | opportunity-signal readiness |
| Trend / Graph Agent | same-direction Card clusters | viewpoint context only | community lead clusters only | relationship and trend candidate checks |
| Red-Team QA | weak evidence, wrong type, duplicates, cross-lane contamination | untranslated / missing URL risks | lead-not-fact boundary | unsupported graph / trend references |

Agent review gate:

- `pass`: no blockers and no warnings;
- `warning`: no blockers, but source diversity, opportunity-signal coverage, trend thinness, or lead evidence needs review;
- `fail`: a compatibility Card lacks source auditability, has invalid Card type, uses social/community/opinion material as direct evidence, or otherwise violates the current six-gate boundary.

An explicitly approved new agent-review trial should run after the 09:50 closure. A `fail` status in the report is an analysis result, not a production rerun trigger. Expired trials remain disabled.

## Monitor Skill Self-Improvement

Each production lane has a current monitor skill:

- Business Signals: `agent-workflow/skills/guanlan-business-signals-monitor/SKILL.md`
- First-Line Viewpoints: `agent-workflow/skills/guanlan-first-line-viewpoints-monitor/SKILL.md`
- Community Intelligence: `agent-workflow/skills/guanlan-community-intelligence-monitor/SKILL.md`

After a real production failure, the responsible skill must run its self-improvement loop:

1. identify the failed lane, gate, report path, and invariant;
2. classify the root cause;
3. add or tighten one eval before adding long prose;
4. update `MEMORY.md` only for durable recurring lessons;
5. rerun the smallest relevant gate.

Do not use self-improvement to broaden lane ownership. A Business Signals fix must not cause that skill to stage First-Line Viewpoints or Community Intelligence data.

## Not Done

- Do not mix follow-builders / builders viewpoints into business signals, relationship graph, or trend candidates.
- Do not restore legacy content-output routes as required outputs.
- Do not deploy directly from the automation branch.
- Do not force local Obsidian sync when local uncommitted changes exist.
