# 2026-06-11 Business Signals Asset Manifest

- generated_at: 2026-06-11T09:30:07+08:00
- workflow_mode: business_signals_pr
- monitor: success
- monitor_readiness: success
- raw_pool_gate: success
- asset_generation: success
- pool_to_card_dedupe_gate: success
- site_data_sync: success
- source_first_frontstage_gate: success
- frontstage_regression_gate: success
- pre_commit_gate: success

## Persisted Asset State

| Asset | State |
|---|---|
| Raw candidates | present |
| Raw originals | present |
| Pool candidates | present |
| Business signals | present |
| Signal card files | 13 |
| Site content data | present |
| V3 data observation desk data | present |
| Intelligence graph index | present |
| Operations dashboard data | present |

## Persistence Rule

Raw / Pool must be committed once monitor and post-monitor gates pass.
Card assets must be committed once asset generation runs.
Site data must be committed only when dedupe, site sync, source-first frontstage, frontstage regression and pre-commit gates pass.
First-line viewpoints data is produced by the independent first-line workflow.
