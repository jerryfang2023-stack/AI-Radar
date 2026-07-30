# Local Sync

## Boundary

- GitHub `main` remains the source for code, V4 facts, application data, accepted report Markdown, tests and deployment.
- The independent Guanlan AI Vault is configured outside the original `AI热点` tree through `GUANLAN_VAULT_ROOT` or `.guanlan-vault.json`.
- The repository-local `vault/` path is retired and must remain absent.
- GitHub Actions never read or write the external Vault.

## Refresh

```powershell
npm run sync:guanlan-vault
npm run assert:guanlan-vault
npm run register:guanlan-vault
```

The generated directory map is:

- `00-总览/`
- `10-系统现状/`
- `20-数据中心/`
- `30-应用中心/`
- `40-运营中心/`
- `50-规则与契约/`
- `60-知识资产/`
- `90-工作区/`

The refresh reconstructs current readable projections and curated knowledge assets from repository sources. It does not rebuild or overwrite frontstage JSON, raw snapshots, canonical bundles, code or tests. Files under `90-工作区/` are not production inputs.

## Automation

| Tool | Role |
|---|---|
| `agent-workflow/tools/local-sync-from-main.ps1` | Fast-forward local `main`, then refresh the external Vault. |
| `agent-workflow/tools/install-local-sync-task.ps1` | Register the Windows logon / interval sync task. |
| `agent-workflow/tools/uninstall-local-sync-task.ps1` | Remove the Windows sync task. |
| `agent-workflow/tools/build-guanlan-vault.mjs` | Build current pages and curated knowledge projections. |
| `agent-workflow/tools/assert-guanlan-vault.mjs` | Validate isolation, directory contract, links and retired content boundaries. |
| `agent-workflow/tools/register-guanlan-vault.mjs` | Register the new Vault and retire the old repository Vault entry in Obsidian Desktop. |

The Git sync runs only on local `main`. It fetches `origin/main`, pauses on local changes or divergence, and uses `git pull --ff-only`. It never force-pulls, resets, cleans, merges or overwrites local edits.

## Reports

Weekly and monthly accepted Markdown lives in `01-SiteV2/content/12-applications/industry-reports/`. Site generators read that repository source; the external Vault receives a readable copy during local refresh.

## Recovery

Retired V1/V2/V3 material, the removed repository Vault, old Hermes handoffs and dated run reports remain recoverable through explicit Git history only. Recover them from an explicit Git ref in an isolated worktree.
