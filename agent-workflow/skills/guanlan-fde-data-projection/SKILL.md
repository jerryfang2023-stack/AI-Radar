---
name: guanlan-fde-data-projection
description: Use when generating or repairing Claim-native FDE observations, implementation dossiers, or the event-backed FDE-V2 publication view. Do not use to infer customer needs, ROI, team composition, undisclosed implementation details, or recommendations.
metadata:
  guanlan:
    version: "1.2.0"
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

## Inputs

Read the FDE observation and FDE record sections of the V4 schema and only accepted exact-span Claims.

## Workflow

1. Build `FDEObservation` directly from accepted Claims; CanonicalEvent is an optional timeline reference, not the admission gate.
2. Aggregate observations with the same implementation key into one dossier and preserve every observation date, Claim, source, and event reference.
3. Keep `FDERecord` as the event-backed publication view for deployment, procurement, and implementation-linked partnership events.
4. Fill fields only when the Claim explicitly states them and preserve reported metrics with source attribution.
5. Publish factual completeness and every undisclosed field; do not infer demand, vendor, delivery team, integrations, ROI, or outcomes.
6. Reject URL-specific templates and frontstage repair logic.

## Execution

FDE observations, dossiers, and records are deterministic sections of the daily V4 bundle; do not hand-edit their JSON. For the resolved date, run:

```powershell
npm run build:data-center -- --date=YYYY-MM-DD
npm run assert:data-center -- --date=YYYY-MM-DD
npm run build:data-center-site
npm run assert:projection-coverage -- --date=YYYY-MM-DD
```

Inspect `fde-observations.json`, `fde-records.json`, and the manifest under `01-SiteV2/content/11-databases/data-center-v4/YYYY-MM-DD/`.

## Boundaries

- Resolve the date and accepted Claim set from the requested V4 build; ask before selecting among materially different candidates. Stop the affected projection when lineage cannot resolve.
- Keep missing implementation detail explicit and stop the affected field rather than completing a plausible narrative.
- Do not create canonical facts, modify frontstage layout, or use model judgment as evidence.
- Local deterministic build and gates are allowed for a requested projection repair. External model calls, publication, deployment, and unrelated data writes require their owning workflow or explicit authorization.

## Output

Produce Claim-linked FDE observations, implementation dossiers, and eligible event-backed FDE records with completeness and provenance.

## Done When

Finish when the deterministic bundle and projection-coverage gates pass, each populated field is explicitly supported by an accepted Claim, dossiers preserve all observations and dates, optional event links resolve, and undisclosed fields remain visible and empty.
