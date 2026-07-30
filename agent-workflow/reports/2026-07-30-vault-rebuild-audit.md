# WaveSight Vault Rebuild Audit — 2026-07-30

## Result

- status: passed
- vault_version: VAULT-V1.0
- vault_root: `vault/`
- markdown_notes: 1379
- vault_size: 6.21 MB
- unresolved_production_incidents: 0

The repository and Obsidian knowledge base are now separate. Obsidian opens `vault/` directly; the parent `AI热点` vault is no longer active for WaveSight.

## Migration

- Data Center projections moved to `vault/10-Data-Center/`.
- Application Center reports and research moved to `vault/20-Application-Center/`.
- Operations and reference entries moved to dedicated current-only directories.
- AI Startup Radar is absent and remains distinct from the active Opportunity Map.
- All active generators, workflows, tests, page metadata, Skills, and documentation use the centralized Vault path contract.

## Cleanup

- Removed 394 dated May/June run reports.
- Removed 53 retired Hermes handoff records and their compatibility readers/writers.
- Removed the legacy closeout queue and empty old knowledge root.
- Removed 413.6 MB of rebuildable local browser-profile cache.
- Preserved V4 source snapshots, Claims, Events, entity history, current July reports, application data, structured action logs, data-lake sources, and site assets.

Deleted tracked history remains recoverable through an explicit Git ref. No Git history rewrite was performed.

## Findings Repaired

1. Periodic-report discovery, generation, rendering, and tests still constructed the retired report path in segments.
2. Funding Insights custom-Vault tests still generated links from a retired knowledge prefix.
3. Community publication, recovery, assertion, and viewpoint translation backfill retained segmented retired targets.
4. OPS still read and displayed deleted Hermes history and old report links.
5. Vault sync initially rebuilt unrelated frontstage data and logged an absolute local workspace path.

Each finding was repaired at its owning generator or gate. The Vault assertion now detects literal and segmented retired paths, unresolved Wiki links, missing entry files, legacy roots, and retired incident interfaces.

## Validation

- `npm run assert:obsidian-vault`: 17 required assets, 1379 Markdown notes, zero problems.
- `npm run test:data-center`: 155/155 passed.
- `npm run test:data-center-site:core`: 52/52 passed.
- `npm run test:trend-radar`: 8/8 passed.
- `npm run test:funding-insights`: 22/22 passed.
- `npm run test:data-center-site:opportunity`: 11/11 passed.
- `npm run test:ops-v2`: 6/6 passed.
- `npm run test:skill-ops`: 20/20 passed.
- `npm run test:v4-frontstage-smoke`: 60/60 route and viewport checks passed with no console errors.
- `npm run assert:no-active-v3`: active V1–V3 consumers = 0.
- Compatibility retirement, pipeline policy, version consistency, current-rule hygiene, frontstage regression, community gate, Skill validation, and Skill mirror audits passed.
- `git diff --check`: passed.

## Release Boundary

GitHub Pages remains the only deployment route. The production deployment must run from merged `main`; the local Vault is not a public-site artifact.
