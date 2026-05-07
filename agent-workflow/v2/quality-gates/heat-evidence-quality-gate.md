# Heat Evidence Quality Gate

Status: isolation gate.

## Required Checks

- Every HeatEvidence item has `id`, `sourceType`, `sourceId`, `evidenceRole`, `period`, and `productionReadiness`.
- Every item maps to at least one industry tag and at least one job or workflow tag.
- Every item records impact modes or business value tags.
- Every item has evidence and confidence scores.
- Point-derived evidence is not marked as `fact` unless backed by S/A/B source references.
- Counter-evidence exists for `mixed`, `down`, or controversial cases.

## Blocking Failures

- Missing source trace.
- Point-only fact evidence.
- HeatContribution without source and confidence explanation.
- HeatCard referencing non-existent HeatEvidence.

