# 2026-06-10 Business Signals Asset Manifest

- generated_at: 2026-06-10T10:25:38+08:00
- workflow_mode: business_signals_pr
- monitor: failure
- monitor_readiness: failure
- raw_pool_gate: failure
- asset_generation: skipped
- pool_to_card_dedupe_gate: skipped
- site_data_sync: skipped
- source_first_frontstage_gate: skipped
- frontstage_regression_gate: skipped
- pre_commit_gate: skipped

## Persisted Asset State

| Asset | State |
|---|---|
| Raw candidates | present |
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
Site data must be committed only when dedupe, site sync, source-first frontstage, frontstage regression and pre-commit gates pass.
First-line viewpoints data is produced by the independent first-line workflow.
