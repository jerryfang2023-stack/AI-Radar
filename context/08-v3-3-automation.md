---
status: current
scope: v3-3-automation
last_updated: 2026-06-09
use_when:
  - github automation
  - daily monitoring
  - site data sync
  - obsidian local sync
priority: current
---

# V3.3.3 Automation Loop

V3.3.3 automation is column-independent for production and site-unified for publication. It is not enough to create temporary artifacts.

## Business Signals GitHub Chain

Workflow: `.github/workflows/daily-persistent-assets-pr.yml`

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

## Business Signals Watchdog And Recovery

The 2026-06-09 morning incident report is treated as pre-V3.3.3 upgrade input. Its historical 08:00 failures should not restore the exact-hour schedule. Current Business Signals schedule truth is 09:07 Asia/Shanghai.

Operational rules:

1. If no same-date scheduled run is visible by about 09:20 Asia/Shanghai, Hermes may request a manual workflow dispatch.
2. If a downstream task starts while the Business Signals workflow is `in_progress`, wait for the upstream run instead of declaring data missing.
3. Auto-merge skip is not automatically a data-generation failure. It means publication may require PR / repository-permission handling.
4. The workflow must still publish through automation branch, PR, merge to `main`, then GitHub Pages. Direct `main` push is not the current policy.
5. A high-quality run blocked only by `raw_count_min` can enter manual recovery, but recovery must rebuild Cards and site data after restoring Raw / Pool. Do not copy stale pre-card site data from artifacts.
6. Watchlist aggregate material can guide source repair or Pool rerouting only. It is not direct Card evidence until source-backed entries pass the current Pool / Core Pool rules.

## First-Line Viewpoints GitHub Chain

Workflow: `.github/workflows/daily-first-line-viewpoints-pr.yml`

Execution order:

1. Resolve the Beijing date.
2. Refresh builder blog and podcast feeds when available.
3. Build first-line viewpoint data: `01-SiteV2/site/data/follow-builders-daily.json`.
4. Run the first-line viewpoint data gate: `agent-workflow/tools/assert-follow-builders-data.mjs`.
5. Write the first-line viewpoint manifest.
6. Push `automation/first-line-viewpoints-<date>`.
7. Create or update the PR.
8. Auto-merge or enable auto-merge after the first-line gate passes.
9. Deploy through GitHub Pages after `main` updates.

This workflow must not write business-signal Cards, relationship graph data, trend candidates, or community intelligence data.

## Monitoring Lane Ownership

| Lane | Primary runner | Main trigger | Success gate | Persistence |
|---|---|---|---|---|
| Business Signals | GitHub Actions + `skills/guanlan-business-signals-monitor/SKILL.md` | `.github/workflows/daily-persistent-assets-pr.yml` at 09:07 Asia/Shanghai | monitor QC, post-monitor Raw / Pool gate, Card generation, dedupe, source-first, frontstage regression, pre-commit freshness | independent automation PR to `main` |
| Intelligence Map | GitHub Actions | follows the Business Signals Card chain | source-first and frontstage regression gates from the business-signal chain | included in the Business Signals PR |
| First-Line Viewpoints | GitHub Actions + `skills/guanlan-first-line-viewpoints-monitor/SKILL.md`, with local fallback available | `.github/workflows/daily-first-line-viewpoints-pr.yml` at 09:17 Asia/Shanghai | `agent-workflow/tools/assert-follow-builders-data.mjs` | independent automation PR to `main` after builders gate passes |
| Community Intelligence | Local Windows scheduled task / Codex local run + `skills/guanlan-community-intelligence-monitor/SKILL.md` | `WaveSight Community Intelligence Daily` at 08:30 Asia/Shanghai | `agent-workflow/tools/assert-community-intelligence-data.mjs` | local files, local archive, then explicit Git commit / sync |

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

Sync behavior:

1. When the local machine is online, the scheduled task or loop runs.
2. The script fetches remote `main`.
3. If the local workspace is clean and local `main` can fast-forward, it pulls.
4. Merged Raw / Pool / Card / site data / first-line viewpoint data / community intelligence data / ops data become visible in local Obsidian as their independent PRs reach `main`.
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
6. Write logs to `agent-workflow/reports/community-intelligence/community-intelligence-YYYYMMDD.log`.

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

## First-Line Viewpoint Data Sources

`01-SiteV2/site/scripts/build-follow-builders-page-data.mjs` uses this source order:

1. local `~/.skill-store/follow-builders/scripts/prepare-digest.js`;
2. local `~/.skill-store/follow-builders/feed-x.json` / `feed-podcasts.json`;
3. GitHub runner fallback: public follow-builders feeds.

If the follow-builders refresh fails but a previous generated `follow-builders-daily.json` exists, the builder keeps the previous data and records `fallbackUsed=true` in `meta`. This prevents the independent First-Line Viewpoints page from failing only because a feed endpoint is temporarily unavailable.

This lets both local runs and GitHub runners build the First-Line Viewpoints page.

`01-SiteV2/content/05-frontier-opinions/*` is retired history for this lane. Current success must be judged from `01-SiteV2/site/data/follow-builders-daily.json` and the follow-builders data gate.

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

## Hermes / Codex Coordination

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

## Monitor Skill Self-Improvement

Each production lane has a current monitor skill:

- Business Signals: `skills/guanlan-business-signals-monitor/SKILL.md`
- First-Line Viewpoints: `skills/guanlan-first-line-viewpoints-monitor/SKILL.md`
- Community Intelligence: `skills/guanlan-community-intelligence-monitor/SKILL.md`

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
