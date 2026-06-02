# 2026-06-02 Persistent Asset Manifest

- generated_at: 2026-06-02T11:49:22+08:00
- workflow_mode: persistent_assets_pr
- monitor: success
- monitor_readiness: success
- raw_pool_gate: success
- asset_generation: success
- cardcopy_gate: failure
- pool_to_card_dedupe_gate: success
- site_data_sync: skipped
- pre_commit_gate: skipped

## Persisted Asset State

| Asset | State |
|---|---|
| Raw candidates | present |
| Raw originals | present |
| Pool candidates | present |
| Business signals | present |
| Opinion candidates | present |
| Opinion cards list | present |
| Signal card files | 11 |
| Opinion card files | 26 |
| Site content data | present |

## Persistence Rule

Raw / Pool must be committed once monitor and post-monitor gates pass.
Card assets must be committed once asset generation runs.
Site data must be committed only when cardcopy, dedupe, site sync and pre-commit gates pass.
