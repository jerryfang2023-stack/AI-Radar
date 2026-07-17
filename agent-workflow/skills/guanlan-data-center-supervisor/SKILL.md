---
name: guanlan-data-center-supervisor
description: Use when supervising, running, repairing, or changing the WaveSight Data Center V4 factual data lane. Covers SourceArtifact, RawDocument, Claim, Entity, CanonicalEvent, ENTITY-V1 history profiles, RELATION-V2 factual links, BACKFILL-V1 targeted historical collection, TAG-V4 assertions, FDE and hardware projections, database materialization, historical reprojection, and integrity gates. Do not use for page design, opportunity judgment, trend judgment, recommendations, or legacy Card editorial work.
metadata:
  guanlan:
    version: "1.2.0"
    lane: "Data Center"
    status: "current lane owner"
    order: 5
    responsibility: "Own the source-traceable WaveSight Data Center V4 production and repair chain."
    upstream: "external source capture and immutable Raw snapshots"
    downstream: "canonical events, entity profiles, factual relationships, domain projections, DuckDB/JSONL exports, downstream applications"
    gates: "claim traceability, event evidence, verified relationship endpoints, conflict preservation, taxonomy assertions, projection provenance"
    recent_learning: "Cross-day backfill must separate recurring coverage sweeps from explicit fact gaps and return every candidate through the canonical evidence chain."
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
5. Run `npm run sync:data-center` to rebuild split frontstage indexes, ENTITY-V1 profiles, RELATION-V2 rows, and serving tables; require `npm run assert:entity-history` to pass.
6. For an explicit historical reprojection, run `npm run backfill:entity-history` and preserve declared coverage gaps. Keep legacy page output isolated as compatibility data.
7. Run `npm run build:targeted-backfill` and `npm run assert:targeted-backfill` when maintaining company, product, funding, or deployment coverage. A fact-gap task closes only after the responsible canonical rebuild removes the gap.

## Boundary

- Extraction confidence describes reliability, never commercial value.
- Missing and conflicting fields remain visible.
- No decision, recommendation, importance, opportunity, pain, or trend-maturity field may enter the V4 bundle.
- LLM use is limited to evidence-linked extraction, translation with the original preserved, and ambiguity candidates.
- Formal relationships require verified endpoints, one accepted event, Claim references, SourceArtifact references, and an explicit supported action. Entity or Tag co-occurrence is insufficient.
- Historical reprojection aggregates accepted facts only; it cannot manufacture missing dates or use legacy page copy as evidence.
- A recurring company/product sweep may record `no_findings`; it cannot infer that no event occurred. Funding/deployment tasks require original-source capture and exact-span Claims before canonical repair.
