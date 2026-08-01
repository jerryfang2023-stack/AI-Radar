---
name: guanlan-data-integrity-gate
description: Use when running or repairing the Data Center V4 release gate for Claim spans, event provenance, conflicts, TAG-V4 assertions, projection lineage, forbidden judgment fields, and serving-table integrity. Do not use as a monitor, Card editorial gate, value scorer, or page regression gate.
metadata:
  guanlan:
    version: "1.1.0"
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

## Inputs

Use the requested production date, its V4 bundle, the current schema/contracts, and the earliest failing gate evidence.

## Workflow

Run `npm run assert:data-center -- --date=YYYY-MM-DD`.

Block unresolved source/claim references, invalid spans, boilerplate Claims, CanonicalEvents without source-bounded AI-industry scope, unknown/deprecated tags, unsupported projections, disputed facts published as verified, or forbidden judgment fields. Publisher/feed/query/channel metadata never satisfies the AI-industry scope gate. Zero FDE or hardware records is a warning, not a reason to manufacture data. Repair the earliest owning stage and rerun the build and gate.

## Boundaries

- Read-only inspection and gate execution are allowed for an audit. Mutating an owning stage requires a requested repair; publication, external calls, and deployment require their owning workflow or explicit authorization.
- Keep this gate fail-closed for structural or evidence defects without turning diagnostics, volume targets, or sparse optional projections into new blockers.
- Do not edit generated output directly, lower a gate, create facts, or expand into page regression and publication work.

## Output

Return pass/fail, the exact violated contract, affected IDs, earliest owning stage, smallest repair route, and rerun command.

## Done When

Finish when all affected structural and lineage checks pass after repair at the owning stage, or when the remaining blocker is precisely identified with no unsafe guess or weakened rule.
