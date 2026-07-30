---
status: current
scope: v4-execution-harness
last_updated: 2026-07-29
priority: current
---

# V4 Execution Harness

Use this harness for production, repair, deployment, and no-compatibility
validation.

## Production order

1. Capture ephemeral source snapshots, write `SOURCE-INTAKE-V1`, persist complete bodies in the private evidence store, and remove public body copies.
2. Build SourceArtifact, RawDocument, exact-span Claim, Entity, CanonicalEvent,
   relationship, FDE, hardware, tag, and facet tables.
3. Pass V4 integrity and materialization gates.
4. Build Opportunity Map, Trend Radar, Funding Insights, Reports, and other
   lane-independent application projections.
5. Write `COLLECTION-TELEMETRY-V1.0` and OPS-only supervision records.
6. Pass `assert:no-active-v3` and the V4 production-readiness gate.
7. Stage only current V4/source/application/OPS assets.

## Evidence namespaces

- `E`: accepted V4 fact evidence.
- `O`: First-Line Viewpoints; interpretation only.
- `C`: Community Intelligence; leads, cases, and corroboration only.
- `OPS`: collection and execution telemetry only.

`O`, `C`, and `OPS` cannot create CanonicalEvents, Claims, or RELATION-V2.1
records.

## Compatibility boundary

- V3 payloads are absent from the working tree; historical recovery requires
  an explicit Git ref in an isolated worktree.
- No daily or dry-run workflow may invoke Card generation, Pool-to-Card,
  editorial Card gates, the V3 desk builder, the old graph builder, or legacy
  mappings.
- `compatibility_cards` and dormant V3 implementations are deleted. Any return
  of those interfaces is a release-blocking regression.

## Required validation

```powershell
npm run assert:no-active-v3
npm run assert:compatibility-retirement
npm run assert:pipeline-policy
npm run test:data-center
npm run test:data-center-site
npm run test:ops-v2
npm run assert:versions
```

The release is not ready if removing all active V3 paths breaks collection,
V4 build, application projection, supervision, or publication.
