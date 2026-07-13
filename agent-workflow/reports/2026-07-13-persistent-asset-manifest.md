# 2026-07-13 Business Signals Asset Manifest

- generated_at: 2026-07-13T16:27:07+08:00
- workflow_mode: business_signals_pr
- monitor: success
- raw_pool_gate: success
- asset_generation: success
- pool_to_card_dedupe_gate: success
- card_editorial_gate: success
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
| Business signals | present |
| Signal card files | 16 |
| V3 data observation desk data | present |
| Intelligence graph index | present |
| Operations dashboard data | present |

## Persistence Rule

Raw / Pool must be committed once monitor and post-monitor gates pass.
Card assets must be committed once asset generation runs.
Business frontstage data is built and gated before operations dashboard data is generated.
Site data must be committed only when dedupe, Card editorial quality, Business frontstage gate, operations data sync and pre-commit gates pass.
First-line viewpoints data is produced by the independent first-line workflow.
