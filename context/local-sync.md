---
status: current
scope: local-sync
last_updated: 2026-06-02
---

# Local GitHub Sync

Purpose: after GitHub daily automation merges a PR into `main`, this local Windows task can pull the updated assets into the Obsidian workspace when the computer is on.

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

## Logs

Logs are written to:

```text
agent-workflow/reports/local-sync/
```
