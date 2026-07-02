# 2026-07-02 Business Signals Asset Manifest

- generated_at: 2026-07-02T02:53:30Z
- workflow_mode: business_signals_targeted_repair
- monitor: success
- monitor_readiness: success
- raw_pool_gate: success
- asset_generation: success
- pool_to_card_dedupe_gate: success
- business_frontstage_data: success
- business_frontstage_gate: success
- operations_data_sync: success
- pre_commit_gate: success

## Persisted Asset State

| Asset | State |
|---|---|
| Raw candidates | present |
| Source raw artifacts | not_committed_artifact_replay |
| Raw originals | present |
| Pool candidates | present |
| Business signals | present |
| Signal card files | 8 |
| Site content data | present |
| V3 data observation desk data | present |
| Intelligence graph index | present |
| Operations dashboard data | present |

## Persistence Rule

Raw / Pool were reused from the same-date failed production artifact after the monitor quality gate was repaired. Card assets, Business frontstage data, operations dashboard data, and pre-commit freshness were regenerated locally without rerunning source Raw collection.
