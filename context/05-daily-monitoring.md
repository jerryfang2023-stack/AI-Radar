---
status: retired_archive
scope: v3-daily-monitoring-history
last_updated: 2026-07-29
priority: historical
---

# V3 Daily Monitoring — Retired Archive

The Raw / Pool / Signal Card production route stopped writing in
`SITE-V4.3.0-compatibility-write-disabled`.

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
- Historical V3 artifacts are read-only under `archive/v3-compat/`.
- Historical recovery requires an explicit manual tool and must never be
  auto-discovered by production.

The optional read-only `compatibility_cards` projection is deprecated during
the observation release. Phase 4 removes that interface after seven consecutive
days and one weekly cycle pass without compatibility fallback.
