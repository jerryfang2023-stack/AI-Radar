# 2026-07-18 Data Center V4 + Internal Compatibility Asset Manifest

- generated_at: 2026-07-18T10:58:38+08:00
- workflow_mode: business_signals_pr
- monitor: success
- raw_pool_gate: success
- data_center_v4_build: success
- data_center_v4_gate: success
- data_center_v4_materialize: success
- asset_generation: success
- pool_to_card_dedupe_gate: success
- card_editorial_gate: success
- trend_candidate_decision: success
- business_frontstage_data: success
- business_frontstage_gate: success
- operations_data_sync: success
- pre_commit_gate: success

## Persisted Asset State

| Asset | State |
|---|---|
| Raw candidates | present |
| Source raw artifacts | present |
| Raw originals | present |
| Pool candidates | present |
| Data Center V4 bundle | present |
| Business signals | present |
| Signal card files | 36 |
| V3 data observation desk data | present |
| Industry Reports application data | present |
| Intelligence graph index | present |
| Operations dashboard data | present |

## Persistence Rule

The Data Center V4 bundle must be committed only after its integrity gate passes.
Raw / Pool remain source-capture and compatibility artifacts.
Card assets must be committed once asset generation runs.
The operations dashboard records V4 and compatibility lane states independently; compatibility assets are published only after their own gate passes.
Accepted V4 facts persist after the V4 integrity/materialization gate; compatibility site data persists only when its own gates pass.
First-line viewpoints data is produced by the independent first-line workflow.
