---
name: guanlan-ai-hardware-data-projection
description: Use when generating or repairing Claim-native hardware facts, daily subject/product snapshots, snapshot differences, or the event-backed HARDWARE-V1 publication view. Do not use to promote source-only artifacts, query themes, litigation background, market forecasts, or generic software events.
metadata:
  guanlan:
    version: "1.2.0"
    lane: "Data Center Hardware"
    status: "current sub-skill"
    order: 50
    responsibility: "Build Claim-native hardware facts and daily state snapshots while retaining the event-backed HARDWARE-V1 view."
    upstream: "accepted exact-span Claims and optional accepted hardware CanonicalEvents"
    downstream: "hardware_facts, hardware_snapshots, hardware_records, and downstream consumers"
    gates: "component evidence, Claim/source refs, snapshot fact refs, optional event lineage, no source-artifact bypass"
    recent_learning: "Hardware keywords in background text do not turn another event into a hardware record."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan AI Hardware Data Projection

## Inputs

Use the hardware fact/snapshot sections of the V4 schema, accepted exact-span Claims, and optional accepted hardware CanonicalEvents.

## Workflow

1. Build `HardwareFact` directly from accepted Claims when the same span names an explicit component and a product, specification, OEM/ODM, capacity, supply, shipment/deployment, or capex fact.
2. Aggregate facts by subject/product into one dated `HardwareSnapshot`; compare consecutive snapshots to produce a factual change timeline.
3. A snapshot difference is not a CanonicalEvent unless a new accepted Claim supports that event.
4. Keep `HardwareRecord` limited to accepted `hardware_product`, `hardware_capacity`, `hardware_supply`, and `hardware_deployment` events.
5. Preserve disclosed capacity, unit, node, supplier, customer, site, value, region and shipment date; leave the rest empty.
6. Never use query theme, source-only artifacts, forecasts, rankings, litigation background, or generic product/software events.
7. Keep evidence references on every fact, snapshot, and event-backed record.

## Execution

Hardware facts, snapshots, and records are deterministic sections of the daily V4 bundle; do not hand-edit their JSON. For the resolved date, run:

```powershell
npm run build:data-center -- --date=YYYY-MM-DD
npm run assert:data-center -- --date=YYYY-MM-DD
npm run build:data-center-site
npm run assert:projection-coverage -- --date=YYYY-MM-DD
```

Inspect `hardware-facts.json`, `hardware-snapshots.json`, `hardware-records.json`, and the manifest under `01-SiteV2/content/11-databases/data-center-v4/YYYY-MM-DD/`.

## Boundaries

- Resolve the date and accepted Claim set from the requested V4 build; ask before selecting among materially different candidates. Stop the affected projection when lineage cannot resolve.
- Leave undisclosed capacity, unit, supplier, customer, site, value, region, and dates empty.
- Do not convert snapshot differences into events without a new accepted Claim or patch generated/frontstage data by hand.
- Local deterministic build and gates are allowed for a requested projection repair. External model calls, publication, deployment, and unrelated data writes require their owning workflow or explicit authorization.

## Output

Produce Claim-linked HardwareFacts, dated HardwareSnapshots, factual snapshot differences, and eligible event-backed HardwareRecords.

## Done When

Finish when the deterministic bundle and projection-coverage gates pass, every fact and snapshot resolves to accepted evidence, product/component scope is explicit in the same span, optional event lineage is valid, and rejected background-only material remains outside the projection.
