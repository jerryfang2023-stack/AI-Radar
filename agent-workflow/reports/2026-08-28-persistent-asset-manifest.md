# 2026-08-28 Data Center V4 Asset Manifest

- generated_at: 2026-08-28T10:47:48+08:00
- workflow_mode: business_signals_pr
- monitor: restored
- resumed_from_run: 33135216435
- structured_intake_gate: success
- data_center_v4_build: success
- data_center_v4_gate: success
- data_center_v4_materialize: success
- trend_radar_projection: success
- funding_insights: failure
- operations_data_sync: success
- pre_commit_gate: success

## Persisted Asset State

| Asset | State |
|---|---|
| Structured SourceArtifact / RawDocument intake | present |
| Source raw artifacts | present |
| Public evidence locator index | present |
| Data Center V4 bundle | present |
| Funding Insights application bundle | present |
| Funding Insights frontstage | present |
| Opportunity Map V4 evidence | present |
| Operations dashboard data | present |

## Persistence Rule

The Data Center V4 bundle must be committed only after its integrity gate passes.
Structured intake and private evidence objects replace new candidate-index Markdown; the public repository retains only body-free locators.
Accepted V4 facts persist after the V4 integrity/materialization gate.
Compatibility writers are disabled; frozen compatibility output remains read-only in the archive.
First-line viewpoints data is produced by the independent first-line workflow.
