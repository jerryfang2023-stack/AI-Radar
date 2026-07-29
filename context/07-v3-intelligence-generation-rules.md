---
status: retired_archive
scope: v3-compatibility-history
last_updated: 2026-07-29
priority: historical
---

# V3 Intelligence Generation Rules — Retired

V3 Raw / Pool / Signal Card, V3 desk, Card-derived graph, and legacy mapping
production and compatibility interfaces were removed in `SITE-V4.3.0-compatibility-retired`.

This file is a routing notice, not a production rule source.

## Current rule source

Use:

1. `context/12-data-center-v4.md`
2. `agent-workflow/product/data-center-v4-contract.md`
3. `agent-workflow/product/data-center-v4.schema.json`
4. the responsible V4 generator, projection, and gate

## Historical assets

No V3 payload directory remains in the current working tree. Production,
pages, gates, data-lake sync, Obsidian sync, supervision, and health recovery
cannot discover historical assets.

Historical/manual research may restore them only through an explicit Git ref in
an isolated worktree. It cannot publish them, mutate V4 canonical tables, or
re-enable compatibility writers.

## Phase boundary

Phase 4 is complete: compatibility writers, consumers, dormant implementations,
payload archives, and `compatibility_cards` are removed. The planned observation
window was superseded by the user's explicit final-retirement instruction on
2026-07-29 and is recorded as an exception rather than a completed observation.
