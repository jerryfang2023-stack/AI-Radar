---
status: current
scope: v3-3-automation
last_updated: 2026-06-13
use_when:
  - github automation
  - daily monitoring
  - site data sync
  - obsidian local sync
priority: current
---

# V3.3.6 Automation Loop

V3.3.6 automation is column-independent for production and site-unified for publication. It is not enough to create temporary artifacts. First-Line Viewpoints persists same-date Builder viewpoints into Obsidian person / date timeline files, Business Signals enforces public title / candidate dedupe gates, and Hermes supervises all three active lanes at 09:45 / 09:55.

## Business Signals GitHub Chain

Workflow: `.github/workflows/daily-persistent-assets-pr.yml`

Current monitor parameter baseline:

- diagnostic score reference: `85` only as report context; hard gates and final QC decide release;
- `--max-cycles=3`;
- `--search-limit=200`;
- `--search-path-query-limit=5`;
- `--gdelt-query-limit=12`;
- `--hn-limit=8`;
- `--fetch-timeout-ms=20000`;
- `--snapshot-timeout-ms=16000`;
- `--monitor-timeout-ms=840000`.

The production PR workflow, dry-run workflow, Hermes early handoff dispatch, recovery watchdog dispatch, and skill examples must stay aligned to this baseline. HN remains feedback-only discovery and should not be expanded to fix routed Pool or Core Pool shortages; those failures require better original-source capture and Pool routing.

Execution order:

1. Resolve the Beijing date.
2. Skip only the business-signal chain when the day's Raw / Pool / signal assets already exist on `main`.
3. Run Daily Monitor with QC.
4. Persist Raw / Pool assets.
5. Generate 10 business-signal Cards.
6. Run Pool-to-Card dedupe and gates.
7. Build business-signal data: `01-SiteV2/site/data/v3-data-observation-desk.json`, and the Hermes Agent intelligence entry: `01-SiteV2/site/data/intelligence-graph-index.json`.
8. Build operations dashboard data: `pipeline-dashboard.json/js`.
9. Build topic-center data.
10. Run source-first and frontstage regression gates.
11. Write the persistent asset manifest.
12. Push `automation/business-signals-<date>`.
13. Create or update the PR.
14. Auto-merge or enable auto-merge after gates pass.
15. Deploy through GitHub Pages after `main` updates.
16. Send Hermes / Feishu brief when webhook is configured.

An existing `automation/business-signals-<date>` branch must not block a scheduled rerun. The workflow should update the same branch and PR instead of skipping, because a previous delayed or partial run may have left the branch stale.

`intelligence-graph-index.json` is the stable machine-readable entry for Hermes Agent / data-officer analysis. It is generated from the same Card / Core Pool / relationship / trend-candidate dataset as the business-signal frontstage, and must be committed and deployed whenever `v3-data-observation-desk.json` is updated.

## Hermes Three-Lane Early Handoff

The 2026-06-09 morning incident report is treated as pre-V3.3.3 upgrade input. Its historical 08:00 failures should not restore the exact-hour schedule. Current morning schedule truth is:

- Business Signals primary production: 09:07 / 09:37 Asia/Shanghai.
- First-Line Viewpoints primary production: 09:17 / 09:47 / 10:17 Asia/Shanghai.
- Community Intelligence local collection: 08:30 Asia/Shanghai on the local Windows machine, then GitHub publish at 08:45 / 10:45 / 12:45.
- Hermes three-lane early handoff: 09:45 / 09:55 Asia/Shanghai.

Operational rules:

1. The primary Business Signals schedule is only 09:07 and 09:37 Asia/Shanghai.
2. If both Business Signals primary windows fail, or if same-date Business Signals assets are still missing / unhealthy and no run is active by 09:45 or 09:55, Hermes dispatches the Business Signals workflow.
3. Hermes also checks First-Line Viewpoints and Community Intelligence at 09:45 / 09:55. If either lane has no healthy same-date data and no active run, Hermes dispatches the relevant GitHub workflow.
4. The scheduled early handoff workflow is `.github/workflows/hermes-three-lane-early-handoff.yml`; the old `.github/workflows/hermes-business-signals-early-handoff.yml` is manual compatibility only and must not be scheduled in parallel.
5. Hermes three-lane early handoff writes `agent-workflow/reports/<date>-hermes-three-lane-early-handoff.json` and `.md`, plus latest aliases and a Codex inbox item for lanes that hit dispatch failure or bounded attempt caps.
6. The report must include lane, cause, attempted action, dispatch result, same-date run URLs, asset checks, and one good / bad example for the failed invariant.
7. If a lane workflow is `queued` or `in_progress`, Hermes waits for it instead of declaring missing data.
8. Auto-merge skip is not automatically a data-generation failure. It means publication may require PR / repository-permission handling.
9. All lanes must still publish through automation branch, PR, merge to `main`, then GitHub Pages. Direct `main` push is not the current policy.
10. A high-quality Business Signals run blocked only by `raw_count_min` can enter manual recovery, but recovery must rebuild Cards and site data after restoring Raw / Pool. Do not copy stale pre-card site data from artifacts.
11. Watchlist aggregate material can guide source repair or Pool rerouting only. It is not direct Card evidence until source-backed entries pass the current Pool / Core Pool rules.
12. Community Intelligence cannot be collected inside GitHub Actions because it depends on the local Chrome profile and logged-in community sessions. Hermes may dispatch the GitHub publish workflow, but missing local collector output remains a local / Codex repair handoff.

Manual command:

```powershell
npm run hermes:early-handoff -- --date=<YYYY-MM-DD>
```

## Daily Recovery Watchdog

Workflow: `.github/workflows/daily-recovery-watchdog.yml`

Script: `agent-workflow/tools/dispatch-daily-recovery.mjs`

The recovery watchdog provides bounded automatic second runs. It is not the primary Business Signals morning strategy; Business Signals should be handed to Hermes early handoff before 10:00 instead of waiting for repeated late-day schedule slots. The watchdog remains a generic late safety net for failed workflow runs and non-business lanes.

Recovery rules:

1. If Business Signals, First-Line Viewpoints, or Community Intelligence publish workflow fails, the watchdog checks whether a same-date successful run already exists.
2. If no same-date run is active or successful, and the lane has not reached its same-date failure cap, the watchdog dispatches the relevant workflow again with the same Asia/Shanghai production date.
3. Business Signals and First-Line Viewpoints may be recovered in GitHub Actions because their collectors run in GitHub.
4. Community Intelligence collection cannot be recovered in GitHub Actions because it depends on the local Chrome profile and logged-in browser state. GitHub can only retry the publish workflow when same-date community data and archive files are already present in the checkout.
5. When failure count reaches the cap, the watchdog writes a recovery report and requires manual or Codex root-cause repair. It must not create infinite workflow loops.

Manual command:

```powershell
npm run recover:daily -- --date=<YYYY-MM-DD> --lanes=business_signals,first_line_viewpoints,community_publish
```

## Hermes Morning Recovery

Workflow: `.github/workflows/hermes-morning-recovery.yml`

Script: `agent-workflow/tools/run-hermes-morning-recovery.mjs`

Package command:

```powershell
npm run hermes:morning-recovery -- --date=<YYYY-MM-DD>
```

Hermes Morning Recovery runs after the primary production windows and the first recovery-watchdog slot. It is the morning supervisor fallback, not a new production lane.

Execution order:

1. Run `write-daily-supervision-report.mjs` for the Asia/Shanghai production date.
2. Read the lane statuses and open Hermes inbox items from the supervision output.
3. Select only lanes with `failed` or `manual_required` status.
4. Dispatch bounded recovery through `dispatch-daily-recovery.mjs` for those lanes.
5. Write `agent-workflow/reports/<date>-hermes-morning-recovery.json` and `.md`, plus latest aliases.
6. Upload the Hermes recovery report, daily supervision report, recovery watchdog report, and Hermes inbox files as workflow artifacts.

Rules:

1. Morning failures should use Hermes Three-Lane Early Handoff before this generic recovery path.
2. Hermes Morning Recovery must not lower business-signal evidence thresholds or bypass Pool / Core Pool / Card / Top10 gates.
3. Business Signals recovery still rebuilds from current Raw / Pool / Card scripts and gates.
4. First-Line Viewpoints recovery still uses the independent builders workflow and Obsidian timeline sync gate.
5. Community Intelligence recovery can only publish already-collected same-date local files; it cannot run the browser collector in GitHub Actions because that requires the local Chrome profile and logged-in community sessions.
6. If all bounded retries fail, the required output is a repair handoff: lane, failing gate/report, reason, attempted recovery action, result, and the Codex inbox file path.

## First-Line Viewpoints GitHub Chain

Workflow: `.github/workflows/daily-first-line-viewpoints-pr.yml`

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

This workflow must not write business-signal Cards, relationship graph data, trend candidates, or community intelligence data.

## Monitoring Lane Ownership

| Lane | Primary runner | Main trigger | Success gate | Persistence |
|---|---|---|---|---|
| Business Signals | GitHub Actions + `agent-workflow/skills/guanlan-business-signals-monitor/SKILL.md` | `.github/workflows/daily-persistent-assets-pr.yml` at 09:07 / 09:37 Asia/Shanghai; `.github/workflows/hermes-three-lane-early-handoff.yml` at 09:45 / 09:55 | monitor QC, post-monitor Raw / Pool gate, Card generation, dedupe, source-first, frontstage regression, pre-commit freshness | independent automation PR to `main` |
| Intelligence Map | GitHub Actions | follows the Business Signals Card chain | source-first and frontstage regression gates from the business-signal chain | included in the Business Signals PR |
| First-Line Viewpoints | GitHub Actions + `agent-workflow/skills/guanlan-first-line-viewpoints-monitor/SKILL.md`, with local fallback available | `.github/workflows/daily-first-line-viewpoints-pr.yml` at 09:17 / 09:47 / 10:17 Asia/Shanghai; Hermes three-lane early handoff at 09:45 / 09:55 | `agent-workflow/tools/assert-follow-builders-data.mjs` + `agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs` idempotency | independent automation PR to `main` after builders gate and Obsidian timeline sync pass |
| Community Intelligence | Local Windows scheduled task / Codex local run + `agent-workflow/skills/guanlan-community-intelligence-monitor/SKILL.md` + GitHub publish workflow | local collection at 08:30 Asia/Shanghai; `.github/workflows/daily-community-intelligence-pr.yml` at 08:45 / 10:45 / 12:45 for publication; Hermes three-lane early handoff at 09:45 / 09:55 for publish supervision | `agent-workflow/tools/assert-community-intelligence-data.mjs` | local files and archive, then independent community PR to `main` |

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

## First-Line Viewpoints Obsidian Automation Plan

Trigger:

- GitHub scheduled First-Line Viewpoints workflow at 09:17 / 09:47 / 10:17 Asia/Shanghai.
- Hermes three-lane early handoff at 09:45 / 09:55 Asia/Shanghai dispatches this workflow if same-date data is still missing and no run is active.
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
- `agent-workflow/reports/<date>-hermes-daily-brief.json`
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

## Project Health Automation

Project maintenance is split into daily supervision, weekly retrospective, and monthly cleanup review. These commands are read-only report generators. They do not delete files, edit rules, merge PRs, or deploy.

Daily health uses the same unified supervision report as Hermes, including the read-only Skill Ops governance check:

```powershell
npm run health:daily -- --date=<YYYY-MM-DD>
```

Weekly health summarizes recent daily reports, repeated lane failures, GitHub Actions health, and historical wording that may conflict with the current V3.3 rules:

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
- Do not restore daily observation, trend report, or business brief as required outputs.
- Do not deploy directly from the automation branch.
- Do not force local Obsidian sync when local uncommitted changes exist.
