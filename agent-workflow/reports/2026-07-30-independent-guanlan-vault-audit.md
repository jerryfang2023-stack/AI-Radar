---
title: Independent Guanlan AI Vault Migration Audit
date: 2026-07-30
status: passed
scope: vault-migration-v4-runtime-deployment
---

# Independent Guanlan AI Vault Migration Audit

## Outcome

- The active Obsidian knowledge base is the external `观澜AI` Vault, outside the original `AI热点` tree.
- The old repository-local `vault/` is absent.
- The parent `AI热点` Obsidian knowledge folders and client registration are removed; only the active Git repository remains in that parent directory.
- Obsidian Desktop registers the new Guanlan AI Vault and no longer registers `AI热点` or the removed repository Vault.
- GitHub Actions and site builds no longer read or write a machine-local Vault.
- Accepted weekly and monthly Markdown is repository-owned under `01-SiteV2/content/12-applications/industry-reports/`.

## New Vault Contract

```text
观澜AI/
├── 00-总览/
├── 10-系统现状/
├── 20-数据中心/
├── 30-应用中心/
├── 40-运营中心/
├── 50-规则与契约/
├── 60-知识资产/
└── 90-工作区/
```

The generated inventory contains 501 unique files, including 499 Markdown notes:

| Asset | Count |
|---|---:|
| Weekly and monthly reports | 10 |
| Enterprise AI / FDE cases | 101 |
| AI hardware records | 62 |
| Funding research records | 215 |
| Deduplicated person timelines | 34 |
| Community daily knowledge records | 53 |

The migration explicitly excludes V1/V2/V3 production rules, Card/Pool/desk/graph interfaces, AI Startup Radar, old opportunity scoring, V3-dependent skill cards, generic AI courses and tutorial PDFs, prompt experiments, QC/repair/diff archives, browser data, caches and temporary files.

## Runtime Audit

The local Vault refresh is one-way:

```text
WaveSight V4 repository
-> accepted facts and application assets
-> GitHub PR / main
-> GitHub Pages
-> local main fast-forward
-> Guanlan AI Vault refresh and assertion
```

- `local-sync-from-main.ps1` refreshes the external Vault after a clean fast-forward.
- `.guanlan-vault.json` is local and ignored; `GUANLAN_VAULT_ROOT` is the portable configuration boundary.
- The Vault assertion validates the external-root boundary, required directory contract, generated-file inventory, Wiki links, retired-path references and size ceiling.
- `90-工作区` is human-maintained and is never promoted into production automatically.

## Validation

Passed on 2026-07-30:

- `npm run sync:guanlan-vault`
- `npm run assert:guanlan-vault`
- `npm run assert:guanlan-vault -- --contract-only`
- `npm run assert:no-active-v3`
- `npm run assert:current-rule-hygiene`
- `npm run assert:compatibility-retirement`
- `npm run assert:pipeline-policy`
- `npm run assert:versions`
- `npm run validate:guanlan-skills`
- `npm run assert:skill-store-dashboard`
- `npm run test:data-center` — 155/155
- `npm run test:data-center-site:prepared` — 79/79 plus retirement preflight
- `npm run test:ops-v2` — 6/6
- `npm run test:skill-ops` — 20/20
- `npm run test:v4-frontstage-smoke` — all desktop, laptop and mobile routes passed with HTTP 200 or the expected compatibility redirect.

## Recovery And Remaining Boundary

- The removed repository Vault remains recoverable from Git history.
- Deleted non-Git material from the parent `AI热点` Vault is intentionally not retained because it was classified as unrelated, obsolete or V3-dependent.
- Generated Vault content is reproducible from repository sources. Human notes under `90-工作区` require a separate personal backup policy if they become valuable.
