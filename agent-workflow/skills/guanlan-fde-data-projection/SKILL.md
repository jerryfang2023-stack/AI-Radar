---
name: guanlan-fde-data-projection
description: Use when generating or repairing FDE-V2 enterprise implementation records from accepted CanonicalEvents and Claims. Covers reported need, delivery components, outcomes, workflow, systems, controls, metrics, missing fields, and provenance. Do not infer customer needs, ROI, team composition, or recommendations.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Data Center FDE"
    status: "current sub-skill"
    order: 40
    responsibility: "Project explicit enterprise implementation facts into FDE-V2 records."
    upstream: "accepted CanonicalEvents and Claims"
    downstream: "fde_records serving table and downstream consumers"
    gates: "event lineage, explicit disclosure, metric attribution, missing-field visibility"
    recent_learning: "Undisclosed implementation detail is data and must not be filled with a plausible narrative."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan FDE Data Projection

Read the FDE section of the V4 schema and only accepted event Claims.

1. Project deployment, procurement, and implementation-linked partnership events.
2. Fill fields only when the Claim explicitly states them.
3. Preserve reported metrics and their source attribution.
4. List every undisclosed field; do not infer demand, vendor, delivery team, integrations, ROI, or outcomes.
5. Reject URL-specific templates and frontstage repair logic.
