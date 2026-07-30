---
name: guanlan-ai-hardware-data-projection
description: Use when generating or repairing Claim-native hardware facts, daily subject/product snapshots, snapshot differences, or the event-backed HARDWARE-V1 publication view. Do not promote source-only artifacts, query themes, lawsuits with hardware background terms, market forecasts, or generic software events.
metadata:
  guanlan:
    version: "1.1.0"
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

1. Build `HardwareFact` directly from accepted Claims when the same span names an explicit component and a product, specification, OEM/ODM, capacity, supply, shipment/deployment, or capex fact.
2. Aggregate facts by subject/product into one dated `HardwareSnapshot`; compare consecutive snapshots to produce a factual change timeline.
3. A snapshot difference is not a CanonicalEvent unless a new accepted Claim supports that event.
4. Keep `HardwareRecord` limited to accepted `hardware_product`, `hardware_capacity`, `hardware_supply`, and `hardware_deployment` events.
5. Preserve disclosed capacity, unit, node, supplier, customer, site, value, region and shipment date; leave the rest empty.
6. Never use query theme, source-only artifacts, forecasts, rankings, litigation background, or generic product/software events.
7. Keep evidence references on every fact, snapshot, and event-backed record.
