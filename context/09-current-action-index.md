---
status: current
scope: v4-current-action-index
last_updated: 2026-08-10
priority: current
---

# WaveSight V4 Current Action Index

## Current

| Action | Owner / contract |
|---|---|
| Immutable source capture and structured intake | `SOURCE-INTAKE-V1.1` |
| Claim/Event normalization and canonical build | `RAW-V4.0`, `EVENT-V1.1` |
| Entity history and factual relations | `ENTITY-V1.0`, `RELATION-V2.1` |
| Taxonomy/facets | `TAG-V4.1` |
| Enterprise implementation projection | `FDE-V2.0` |
| Hardware projection | `HARDWARE-V1.0` |
| Opportunity Map evidence | `OMAP-V2.0.0-v4-evidence` |
| Trend Radar | `TRADAR-V1.1.0-tag-v4-1` |
| Funding Insights | `FUNDING-INSIGHT-V1.5.0-china-market` |
| AI financing site / weekly and monthly reports | `REPORTS-V1.3.0-funding-portal` |
| Operations telemetry and health | `OPS-V3.2.0-member-admin` |
| First-Line Viewpoints | independent `O` lane |
| Community Intelligence | independent `C` lane |

## Retired archive

These actions cannot run by default and cannot block publication:

- Raw candidate Markdown and Pool candidate Markdown generation;
- Signal Card generation and Card gates;
- V3 desk and intelligence graph generation;
- Card-derived relationships and legacy mapping generation;
- compatibility frontstage/data-lake/Obsidian staging;
- daily trend-candidate or no-decision generation.

Historical assets are available only through explicit Git-history recovery in
an isolated worktree. Current tools cannot discover them.

## Execution rules

- `E` facts require accepted Claim and SourceArtifact evidence.
- `O`, `C`, and `OPS` cannot create Events, Claims, or RELATION-V2.1 rows.
- Application projections cannot write judgment fields back to canonical V4.
- Report content generation is independent from Opportunity Map direction work.
- FDE/Hardware projection follows V4 materialization; the external Guanlan Vault refresh is local and downstream of `main`.
- `assert:no-active-v3` is release-blocking.
- `compatibility_cards` is deleted; its return is release-blocking.
