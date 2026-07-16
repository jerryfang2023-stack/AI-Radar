---
name: guanlan-data-integrity-gate
description: Use when running or repairing the Data Center V4 release gate for Claim spans, event provenance, conflicts, TAG-V4 assertions, projection lineage, forbidden judgment fields, and serving-table integrity. Do not use as a monitor, Card editorial gate, value scorer, or page regression gate.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Data Center"
    status: "current sub-skill"
    order: 30
    responsibility: "Block non-traceable, contaminated, judgment-bearing, or structurally invalid V4 data."
    upstream: "daily Data Center V4 bundle"
    downstream: "accepted JSONL/DuckDB materialization"
    gates: "source and claim traceability, AI-industry scope, taxonomy evidence, projection lineage, forbidden fields"
    recent_learning: "The gate validates factual AI-industry scope without creating importance or value scores."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Data Integrity Gate

Run `npm run assert:data-center -- --date=YYYY-MM-DD`.

Block unresolved source/claim references, invalid spans, boilerplate Claims, CanonicalEvents without source-bounded AI-industry scope, unknown/deprecated tags, unsupported projections, disputed facts published as verified, or forbidden judgment fields. Publisher/feed/query/channel metadata never satisfies the AI-industry scope gate. Zero FDE or hardware records is a warning, not a reason to manufacture data. Repair the earliest owning stage and rerun the build and gate.
