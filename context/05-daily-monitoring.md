---
status: retired_archive
scope: v3-daily-monitoring-history
last_updated: 2026-07-29
priority: historical
---

# V3 Daily Monitoring — Retired Archive

The Raw / Pool / Signal Card production route stopped writing in
`SITE-V4.3.0-compatibility-retired`.

Current daily collection is governed by `context/12-data-center-v4.md`:

```text
external source
-> immutable original snapshot
-> SOURCE-INTAKE-V1
-> SourceArtifact / RawDocument
-> exact-span Claim
-> CanonicalEvent / Entity / FacetAssertion
-> V4 application projections and collection telemetry
```

Operational rules:

- Do not create new daily Raw candidate Markdown, Pool candidate Markdown, or
  Signal Cards.
- Do not use archived Cards, the V3 desk, or the old graph as collection,
  publication, health, or recovery inputs.
- Preserve original source snapshots. Their stable references remain valid V4
  evidence inputs.
- First-Line Viewpoints (`O`) and Community Intelligence (`C`) stay independent
  from factual events (`E`). Operations reports (`OPS`) stay outside all public
  evidence.
- Historical V3 artifacts are absent from the working tree.
- Historical recovery requires an explicit Git ref in an isolated worktree and
  must never be auto-discovered by production.

Phase 4 removed `compatibility_cards`, the historical payload archive, dormant
V3 producers, and compatibility-only gates. Git history is the only explicit
recovery route.
