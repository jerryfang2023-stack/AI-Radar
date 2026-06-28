# 2026-06-28 Business Signals Asset Manifest

- generated_at: 2026-06-28T12:05:28+08:00
- workflow_mode: business_signals_pr
- monitor: failure
- monitor_readiness: failure
- raw_pool_gate: failure
- asset_generation: skipped
- pool_to_card_dedupe_gate: skipped
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
| Business signals | missing |
| Signal card files | 0 |
| Site content data | present |
| V3 data observation desk data | present |
| Intelligence graph index | present |
| Operations dashboard data | present |

## Persistence Rule

Raw / Pool must be committed once monitor and post-monitor gates pass.
Card assets must be committed once asset generation runs.
Business frontstage data is built and gated before operations dashboard / topic-center data is generated.
Site data must be committed only when dedupe, Business frontstage gate, operations data sync and pre-commit gates pass.
First-line viewpoints data is produced by the independent first-line workflow.
