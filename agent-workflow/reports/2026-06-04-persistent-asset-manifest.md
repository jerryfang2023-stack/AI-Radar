# 2026-06-04 Persistent Asset Manifest

- generated_at: 2026-06-04T08:38:53+08:00
- workflow_mode: persistent_assets_pr
- monitor: success
- monitor_readiness: success
- raw_pool_gate: success
- asset_generation: success
- pool_to_card_dedupe_gate: success
- site_data_sync: success
- publiccopy_gate: success
- frontstage_regression_gate: success
- pre_commit_gate: success

## Persisted Asset State

| Asset | State |
|---|---|
| Raw candidates | present |
| Raw originals | present |
| Pool candidates | present |
| Business signals | present |
| Opinion candidates | present |
| Opinion cards list | present |
| Signal card files | 12 |
| Opinion card files | 9 |
| Site content data | present |

## Persistence Rule

Raw / Pool must be committed once monitor and post-monitor gates pass.
Card assets must be committed once asset generation runs.
Site data must be committed only when dedupe, site sync, public copy, frontstage regression and pre-commit gates pass.
