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

# V3.3.2 Automation Loop

V3.3.2 automation must be persistent, deployable, and syncable to local Obsidian. It is not enough to create temporary artifacts.

## GitHub Daily Chain

Workflow: `.github/workflows/daily-persistent-assets-pr.yml`

Execution order:

1. Resolve the Beijing date.
2. Skip when the day's persistent assets or automation branch already exist.
3. Run Daily Monitor with QC.
4. Persist Raw / Pool assets.
5. Generate 10 business-signal Cards.
6. Run Pool-to-Card dedupe and gates.
7. Build business-signal data: `01-SiteV2/site/data/v3-data-observation-desk.json`, and the Hermes Agent intelligence entry: `01-SiteV2/site/data/intelligence-graph-index.json`.
8. Build first-line viewpoint data: `01-SiteV2/site/data/follow-builders-daily.json`. This route is independent and may persist even if the business-signal Raw / Pool / Card chain is blocked.
9. Run the first-line viewpoint data gate: `agent-workflow/tools/assert-follow-builders-data.mjs`.
10. Build operations dashboard data: `pipeline-dashboard.json/js`.
11. Build topic-center data.
12. Run source-first and frontstage regression gates.
13. Write the persistent asset manifest.
14. Push `automation/daily-assets-<date>`.
15. Create or update the PR.
16. Auto-merge or enable auto-merge after gates pass.
17. Deploy through GitHub Pages after `main` updates.
18. Send Hermes / Feishu brief when webhook is configured.

`intelligence-graph-index.json` is the stable machine-readable entry for Hermes Agent / data-officer analysis. It is generated from the same Card / Core Pool / relationship / trend-candidate dataset as the business-signal frontstage, and must be committed and deployed whenever `v3-data-observation-desk.json` is updated.

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
4. Merged Raw / Pool / Card / site data / builders data / ops data become visible in local Obsidian.
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
5. Validate that today's `community-intelligence.json` and daily Obsidian archive exist.
6. Write logs to `agent-workflow/reports/community-intelligence/community-intelligence-YYYYMMDD.log`.

## First-Line Viewpoint Data Sources

`01-SiteV2/site/scripts/build-follow-builders-page-data.mjs` uses this source order:

1. local `~/.skill-store/follow-builders/scripts/prepare-digest.js`;
2. local `~/.skill-store/follow-builders/feed-x.json` / `feed-podcasts.json`;
3. GitHub runner fallback: public follow-builders feeds.

If the follow-builders refresh fails but a previous generated `follow-builders-daily.json` exists, the builder keeps the previous data and records `fallbackUsed=true` in `meta`. This prevents the independent First-Line Viewpoints page from failing only because a feed endpoint is temporarily unavailable.

This lets both local runs and GitHub runners build the First-Line Viewpoints page.

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

The persistent workflow may stage `follow-builders-daily.json` only after this gate passes.

## Not Done

- Do not mix follow-builders / builders viewpoints into business signals, relationship graph, or trend candidates.
- Do not restore daily observation, trend report, or business brief as required outputs.
- Do not deploy directly from the automation branch.
- Do not force local Obsidian sync when local uncommitted changes exist.
