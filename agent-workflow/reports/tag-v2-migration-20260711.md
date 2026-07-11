# TAG-V2.0.0 Migration Report

Date: 2026-07-11
From: `TAG-V1.1.0-v34-layered-taxonomy`
To: `TAG-V2.0.0-semantic-boundaries`

## Decision

Business Signals `formal_tags` now contains only five source-backed semantic groups:

- `track`
- `function`
- `scenario`
- `customer`
- `evidence`

The following dimensions moved out of the business tag system:

- `source-*` -> `source_type` or existing source fields;
- `region-*` -> `market_regions` when explicitly supported;
- `stage-*` -> `trend_state` on trend candidates only;
- First-Line `formalTags` -> private `columnTags` plus `sourceType` metadata.

`customer-enterprise` was deleted without replacement. `track-ai-agent` is removed when it only accompanies a more specific track. Formal groups are capped at two values.

## Taxonomy Change

| metric | before | after |
|---|---:|---:|
| Registry tags | 74 | 60 |
| Registry groups | 9 | 6 (5 business + 1 private opinion) |
| Business formal groups | 8 | 5 |
| Signal Cards audited | 820 | 820 |
| Deprecated tags on Signal Cards | 1,291 assignments across source / stage / region / `customer-enterprise` | 0 |
| Signal Cards with more than two tracks | 22 | 0 |
| Track cleanup candidates | 104 | 0 |

The first migration pass normalized 864 Markdown asset files. A second pass removed deprecated IDs that had been stored under the wrong group in 37 overlapping historical assets. Fifty-four First-Line rows were moved from `formalTags` to `columnTags`; 41 product-strategy rows were remapped from the misleading enterprise-workflow track to `track-ai-applications`.

## Runtime Changes

- Card generation no longer assigns `track-ai-agent`, `customer-enterprise`, `stage-rising`, source tags, or region tags by default.
- Raw theme hints no longer mix lifecycle and provenance values into semantic tags.
- First-Line generation, quality checks, rendering, and Obsidian timeline sync use `columnTags` and `sourceType`.
- Frontstage aggregation reads only the five Business Signal formal groups.
- The quality gate fails on unknown IDs, deprecated IDs, retired groups, wrong-group placement, more than two tags per group, or missing Signal Card track/evidence.

## Validation

- Tag quality gate: passed; 60 active tags; 0 unknown, deprecated, missing, or contract violations.
- Tag system audit: 820 Signal Cards; 0 multi-track overflow; 0 deprecated tags; 0 frontstage display/aggregation violations; 0 First-Line private-tag violations.
- Business Signals frontstage gate: passed.
- Source-first frontstage gate: passed for 520 Cards.
- Frontstage regression gate: passed.
- First-Line data gate: passed with 0 issues and 0 warnings.
- JavaScript syntax checks: passed for taxonomy tools, generators, builders, sync, and frontstage assets.

## Boundary

No Card body facts, titles, source URLs, or `opportunity_signals` were rewritten by the tag migration. Historical V3.4 tag reports named `tag-v34-*-latest` were removed so they cannot be mistaken for current execution truth.
