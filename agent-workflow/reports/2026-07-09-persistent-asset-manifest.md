# 2026-07-09 Business Signals Asset Manifest

- generated_at: 2026-07-09T11:05:46+08:00
- workflow_mode: business_signals_pr
- monitor: success
- monitor_readiness: success
- raw_pool_gate: success
- asset_generation: success
- pool_to_card_dedupe_gate: failure
- business_frontstage_data: skipped
- business_frontstage_gate: skipped
- operations_data_sync: skipped
- pre_commit_gate: skipped

## Persisted Asset State

| Asset | State |
|---|---|
| Raw candidates | present |
| Source raw artifacts | present |
| Raw originals | present |
| Pool candidates | present |
| Business signals | present |
| Signal card files | 18 |
| V3 data observation desk data | present |
| Intelligence graph index | present |
| Operations dashboard data | present |

## Persistence Rule

Raw / Pool must be committed once monitor and post-monitor gates pass.
Card assets must be committed once asset generation runs.
Business frontstage data is built and gated before operations dashboard data is generated.
Site data must be committed only when dedupe, Business frontstage gate, operations data sync and pre-commit gates pass.
First-line viewpoints data is produced by the independent first-line workflow.
