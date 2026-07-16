---
name: guanlan-data-center-supervisor
description: Use when supervising, running, repairing, or changing the WaveSight Data Center V4 factual data lane. Covers SourceArtifact, RawDocument, Claim, Entity, CanonicalEvent, TAG-V3 assertions, FDE and hardware projections, database materialization, and integrity gates. Do not use for page design, opportunity judgment, trend judgment, recommendations, or legacy Card editorial work.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Data Center"
    status: "current lane owner"
    order: 5
    responsibility: "Own the source-traceable WaveSight Data Center V4 production and repair chain."
    upstream: "external source capture and immutable Raw snapshots"
    downstream: "canonical events, domain projections, DuckDB/JSONL exports, downstream applications"
    gates: "claim traceability, event evidence, conflict preservation, taxonomy assertions, projection provenance"
    recent_learning: "A data center publishes auditable facts and uncertainty; commercial interpretation belongs to downstream applications."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Data Center Supervisor

Read `agent-workflow/product/data-center-v4-contract.md`, the relevant schema, the failed integrity report, and only the responsible generator or projection.

## Workflow

1. Resolve the production date and verify immutable source snapshots exist.
2. Run `npm run build:data-center -- --date=YYYY-MM-DD`.
3. Run `npm run assert:data-center -- --date=YYYY-MM-DD`.
4. If the gate fails, repair the earliest responsible source, claim, event, taxonomy, or projection stage and rerun only that build and gate.
5. Materialize the accepted bundle to JSONL/DuckDB. Keep legacy page output isolated as compatibility data.

## Boundary

- Extraction confidence describes reliability, never commercial value.
- Missing and conflicting fields remain visible.
- No decision, recommendation, importance, opportunity, pain, or trend-maturity field may enter the V4 bundle.
- LLM use is limited to evidence-linked extraction, translation with the original preserved, and ambiguity candidates.
