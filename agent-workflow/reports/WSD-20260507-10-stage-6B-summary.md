---
task_id: WSD-20260507-10-v2-directory-migration-autopilot
stage: V2-6B
status: completed
encoding: UTF-8
---

# V2-6B Stage Summary

Created V2 schema, rules, and quality gate directories:

- `agent-workflow/v2/schemas/`
- `agent-workflow/v2/rules/`
- `agent-workflow/v2/migration/`
- `agent-workflow/v2/quality-gates/`

Created schemas:

- `raw-candidate.schema.md`
- `structured-signal.schema.md`
- `heat-evidence.schema.md`
- `heat-card.schema.md`
- `ai-brief-issue.schema.md`
- `source-registry.schema.md`

Created rules:

- `v2-ingestion-rules.md`
- `v2-source-level-rules.md`
- `v2-counter-evidence-rules.md`
- `v2-tag-mapping-rules.md`
- `v2-frontstage-backstage-boundary.md`

Created quality gates:

- `v2-content-quality-gate.md`
- `heat-evidence-quality-gate.md`
- `ai-brief-quality-gate.md`

The rules preserve core boundaries: Point is calibration, not fact evidence; Opportunity titles should avoid company names; formal tags must be governed; V2 data does not enter V1 sync by default.

