---
name: guanlan-ai-hardware-data-projection
description: Use when generating or repairing HARDWARE-V1 product, capacity, supply, shipment, procurement, or deployment records from accepted hardware CanonicalEvents and Claims. Do not promote source-only artifacts, query themes, lawsuits with hardware background terms, market forecasts, or generic software events.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Data Center Hardware"
    status: "current sub-skill"
    order: 50
    responsibility: "Project explicit AI hardware event facts into HARDWARE-V1 records."
    upstream: "accepted hardware CanonicalEvents and Claims"
    downstream: "hardware_records serving table and downstream consumers"
    gates: "hardware event lineage, component evidence, source/claim refs, no source-artifact bypass"
    recent_learning: "Hardware keywords in background text do not turn another event into a hardware record."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan AI Hardware Data Projection

1. Accept only `hardware_product`, `hardware_capacity`, `hardware_supply`, and `hardware_deployment` events.
2. Require an explicit hardware component in accepted Claims.
3. Preserve disclosed capacity, unit, node, supplier, customer, site, value, region and shipment date; leave the rest empty.
4. Never use query theme, source-only artifacts, forecasts, rankings, litigation background, or generic product/software events.
5. Keep evidence references on every record.
