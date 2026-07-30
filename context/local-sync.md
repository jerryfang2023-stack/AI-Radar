---
status: current
scope: local-sync
last_updated: 2026-07-30
---

# Local GitHub and Obsidian Sync

The repository and the Obsidian knowledge base are deliberately separate.

- Repository root: code, source snapshots, canonical V4 data, site data, tests, workflows, and operational reports.
- Obsidian root: `vault/`, containing only current human-readable Data Center, Application Center, Operations, and Reference material.

The old parent `AI热点` vault must not be used for WaveSight. It indexes unrelated repositories and generated files.

## Vault Refresh

Run from the repository root:

```powershell
npm run sync:obsidian-vault
npm run assert:obsidian-vault
```

The refresh is projection-only. It reads existing accepted V4 and application data and writes:

- `vault/10-Data-Center/01-Commercial-Events/`
- `vault/10-Data-Center/02-Enterprise-AI-FDE/`
- `vault/10-Data-Center/03-AI-Hardware/`
- `vault/10-Data-Center/04-First-Line-Viewpoints/`
- `vault/10-Data-Center/05-Community-Intelligence/`
- `vault/20-Application-Center/01-Industry-Reports/`
- `vault/20-Application-Center/02-Funding-Insights/`

It does not rebuild or overwrite frontstage JSON, pipeline dashboards, raw snapshots, or canonical bundles.

## GitHub Sync

| Script | Purpose |
|---|---|
| `agent-workflow/tools/local-sync-from-main.ps1` | Safely fast-forward local `main` from GitHub. |
| `agent-workflow/tools/local-sync-loop.ps1` | Repeat the safe sync while Windows is logged in. |
| `agent-workflow/tools/install-local-sync-task.ps1` | Register the Windows logon / interval sync task. |
| `agent-workflow/tools/uninstall-local-sync-task.ps1` | Remove the Windows sync task. |
| `agent-workflow/tools/sync-obsidian-vault.mjs` | Refresh current human-readable Vault projections. |

The Git sync only runs on local `main`. It fetches `origin/main`, pauses on local changes or divergence, and uses `git pull --ff-only`. It never force-pulls, resets, cleans, merges, or overwrites local edits.

Install the local task once:

```powershell
powershell -ExecutionPolicy Bypass -File agent-workflow/tools/install-local-sync-task.ps1
```

Manual fast-forward:

```powershell
powershell -ExecutionPolicy Bypass -File agent-workflow/tools/local-sync-from-main.ps1
```

After the merge is present locally, refresh and validate `vault/` with the two npm commands above.

## Recovery

Retired V1/V2/V3 material, old Hermes handoffs, and dated run reports are not copied into `vault/` or kept in current production paths. Recover them from an explicit Git ref in an isolated worktree when historical investigation is required.
