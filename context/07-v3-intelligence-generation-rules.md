---
status: retired_archive
scope: v3-compatibility-history
last_updated: 2026-07-29
priority: historical
---

# V3 Intelligence Generation Rules — Retired

V3 Raw / Pool / Signal Card, V3 desk, Card-derived graph, and legacy mapping
production stopped in `SITE-V4.3.0-compatibility-write-disabled`.

This file is a routing notice, not a production rule source.

## Current rule source

Use:

1. `context/12-data-center-v4.md`
2. `agent-workflow/product/data-center-v4-contract.md`
3. `agent-workflow/product/data-center-v4.schema.json`
4. the responsible V4 generator, projection, and gate

## Historical assets

Frozen assets are stored under:

- `archive/v3-compat/signal-cards/`
- `archive/v3-compat/frontstage/`
- `archive/v3-compat/legacy-mappings/`

They are read-only, excluded from deployment, and cannot be auto-discovered by
current workflows, pages, gates, data-lake sync, Obsidian sync, supervision, or
health recovery.

Historical/manual research may access them only through an explicit archive
path. It cannot publish them, mutate V4 canonical tables, or re-enable daily
compatibility writers.

## Phase boundary

The compatibility writers and consumers are disabled in Phase 3. Dormant
implementation files and the optional read-only `compatibility_cards`
projection remain for one observation release. Phase 4 deletes those interfaces
only after seven consecutive days and one weekly cycle pass without fallback.
