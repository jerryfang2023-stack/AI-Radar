---
name: guanlan-fde-data-projection
description: Use when generating or repairing Claim-native FDE observations, implementation dossiers, or the event-backed FDE-V2 publication view. Covers customer, vendor, workflow, systems, lifecycle, outcomes, completeness, missing fields, and provenance. Do not infer customer needs, ROI, team composition, or recommendations.
metadata:
  guanlan:
    version: "1.1.0"
    lane: "Data Center FDE"
    status: "current sub-skill"
    order: 40
    responsibility: "Build Claim-native FDE observations and aggregate them into implementation dossiers while retaining the event-backed FDE-V2 view."
    upstream: "accepted exact-span Claims and optional accepted CanonicalEvents"
    downstream: "fde_observations, implementation dossiers, fde_records, and downstream consumers"
    gates: "Claim/source lineage, explicit disclosure, completeness consistency, optional event lineage"
    recent_learning: "Undisclosed implementation detail is data and must not be filled with a plausible narrative."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan FDE Data Projection

Read the FDE observation and FDE record sections of the V4 schema and only accepted exact-span Claims.

1. Build `FDEObservation` directly from accepted Claims; CanonicalEvent is an optional timeline reference, not the admission gate.
2. Aggregate observations with the same implementation key into one dossier and preserve every observation date, Claim, source, and event reference.
3. Keep `FDERecord` as the event-backed publication view for deployment, procurement, and implementation-linked partnership events.
4. Fill fields only when the Claim explicitly states them and preserve reported metrics with source attribution.
5. Publish factual completeness and every undisclosed field; do not infer demand, vendor, delivery team, integrations, ROI, or outcomes.
6. Reject URL-specific templates and frontstage repair logic.
