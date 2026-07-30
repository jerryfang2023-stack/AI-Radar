---
title: WaveSight Obsidian Vault
date: 2026-07-30
status: current
version: VAULT-V1.0
---

# WaveSight Obsidian Vault

`vault/` is an independent Obsidian knowledge base. It is intentionally smaller than the repository and must never be replaced by opening the repository root or the parent `AI热点` directory as a vault.

## Directory Contract

```text
vault/
├── 00-Home/
├── 10-Data-Center/
│   ├── 01-Commercial-Events/
│   ├── 02-Enterprise-AI-FDE/
│   ├── 03-AI-Hardware/
│   ├── 04-First-Line-Viewpoints/
│   └── 05-Community-Intelligence/
├── 20-Application-Center/
│   ├── 01-Industry-Reports/
│   ├── 02-Funding-Insights/
│   ├── 03-Opportunity-Map/
│   └── 04-Trend-Radar/
├── 30-Operations/
├── 90-Reference/
└── 99-Archive/
```

Data Center contains human-readable factual or independent-lane projections. Application Center contains downstream reports and research. Operations contains runbooks and links, not generated run reports. `99-Archive` is reserved and ignored by Obsidian search; V1/V2/V3 history remains in Git rather than being copied there.

AI Startup Radar is retired and absent. It must not be confused with the active Application Center Opportunity Map.

## Refresh and Validate

```powershell
npm run sync:obsidian-vault
npm run assert:obsidian-vault
```

The sync command does not rebuild site or canonical data. The assertion checks required entries, retired output paths, configuration, old path literals, and internal Wiki links.

## Source Boundaries

- Canonical JSON, JSONL, DuckDB, raw snapshots, code, tests, workflow files, node modules, browser profiles, logs, and run reports stay outside the Vault.
- Site generators may read accepted Markdown from `vault/20-Application-Center/01-Industry-Reports/`.
- Vault generators write through `agent-workflow/tools/obsidian-vault-paths.mjs`; hard-coded retired targets are forbidden.
- Recovery of deleted history uses an explicit Git ref in an isolated worktree.
