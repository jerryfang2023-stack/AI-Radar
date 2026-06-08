---
status: current
scope: local-sync
last_updated: 2026-06-02
---

# Local GitHub Sync

Purpose: after GitHub daily automation merges a PR into `main`, this local Windows task can pull the updated assets into the Obsidian workspace when the computer is on.

## What Syncs Into Obsidian

The local workspace is the Obsidian vault. After a fast-forward sync from `origin/main`, the following updated assets become visible locally:

- business-signal Raw / Pool / Card assets under `01-SiteV2/content/`
- persistent business-signal Cards under `01-SiteV2/knowledge/01-Signal-Cards/`
- first-line viewpoint data under `01-SiteV2/site/data/follow-builders-daily.json`
- first-line viewpoint source notes under `01-SiteV2/content/07-points/`
- frontstage and dashboard data under `01-SiteV2/site/data/`

Business Signals and First-Line Viewpoints are synced as separate data streams. Builders content stays in the builders route and must not be treated as business-signal evidence.

## Scripts

| Script | Purpose |
|---|---|
| `agent-workflow/tools/local-sync-from-main.ps1` | Safely sync local `main` from GitHub. |
| `agent-workflow/tools/local-sync-loop.ps1` | Repeat safe sync while Windows is logged in. |
| `agent-workflow/tools/install-local-sync-task.ps1` | Register the Windows logon / interval sync task. |
| `agent-workflow/tools/uninstall-local-sync-task.ps1` | Remove the Windows sync task. |

## Safety Rules

- The sync only runs on local `main`.
- It fetches `origin/main` first.
- If local uncommitted changes exist, it pauses and writes a log.
- If local commits are ahead or divergent, it pauses.
- It only fast-forwards with `git pull --ff-only`.
- It does not force pull, reset, clean, merge, or overwrite local edits.

## Install

Run once from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File agent-workflow/tools/install-local-sync-task.ps1
```

If Windows blocks Task Scheduler registration, the installer falls back to a Startup-folder sync loop that runs after login.

Optional immediate test:

```powershell
powershell -ExecutionPolicy Bypass -File agent-workflow/tools/install-local-sync-task.ps1 -RunOnceNow
```

## Manual Sync

```powershell
powershell -ExecutionPolicy Bypass -File agent-workflow/tools/local-sync-from-main.ps1
```

If you need to refresh the local workspace immediately after a merge, run the manual sync command above. It only fast-forwards local `main`; it does not regenerate assets.

## If New Data Sources Were Added

When online monitoring adds or changes source pools, the local sync path still remains the same:

1. The online automation ingests the new source.
2. It generates or updates the corresponding `content/`, `knowledge/`, or `site/data/` assets.
3. The merge lands on `main`.
4. Local sync pulls the updated files into Obsidian.

For the current V3.3 routes:

- commercial signal sources are expected to land in the Raw / Pool / Card chain and then into `01-SiteV2/content/04-business-signals/` and `01-SiteV2/knowledge/01-Signal-Cards/`
- builders sources are expected to land in the independent follow-builders chain and then into `01-SiteV2/site/data/follow-builders-daily.json` and `01-SiteV2/content/07-points/`

If you need to refresh data locally before merge, run the relevant generation script first, then sync the merged `main` state afterward.

## Logs

Logs are written to:

```text
agent-workflow/reports/local-sync/
```
