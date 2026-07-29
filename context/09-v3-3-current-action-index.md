---
status: current
scope: v4-current-action-index
last_updated: 2026-07-29
priority: current
---

# SITE-V4.3 Current Action Index

## Current

| Action | Owner / contract |
|---|---|
| Immutable source capture and structured intake | `SOURCE-INTAKE-V1` |
| Claim/Event normalization and canonical build | `RAW-V3.0`, `EVENT-V1.1` |
| Entity history and factual relations | `ENTITY-V1.0`, `RELATION-V2.1` |
| Taxonomy/facets | `TAG-V4.0` |
| Enterprise implementation projection | `FDE-V2.0` |
| Hardware projection | `HARDWARE-V1.0` |
| Opportunity Map evidence | `OMAP-V2.0.0-v4-evidence` |
| Trend Radar | `TRADAR-V1.0.0-factual-change-explorer` |
| Funding Insights | `FUNDING-INSIGHT-V1.0-auto-published-research` |
| Weekly/monthly Reports | `REPORTS-V1.1.0-lane-independent` |
| Operations telemetry and health | `OPS-V2.0.0-v4-telemetry` |
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

Historical assets live under `archive/v3-compat/`. Only explicit historical
tools may read them.

## Execution rules

- `E` facts require accepted Claim and SourceArtifact evidence.
- `O`, `C`, and `OPS` cannot create Events, Claims, or RELATION-V2.1 rows.
- Application projections cannot write judgment fields back to canonical V4.
- Report content generation is independent from Opportunity Map direction work.
- FDE/Hardware sync follows V4 materialization.
- `assert:no-active-v3` is release-blocking.
- `compatibility_cards` is optional/read-only/deprecated until the Phase 4 gate.
