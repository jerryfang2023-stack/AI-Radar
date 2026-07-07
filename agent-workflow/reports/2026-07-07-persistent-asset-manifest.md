# 2026-07-07 Business Signals Asset Manifest

- generated_at: 2026-07-07T03:25:26.972Z
- workflow_mode: local_business_signals_repair
- monitor: local_repair_completed
- monitor_readiness: passed
- raw_pool_gate: passed
- asset_generation: passed
- pool_to_card_dedupe_gate: passed
- business_frontstage_data: passed
- business_frontstage_gate: passed
- operations_data_sync: not_run_local_repair
- pre_commit_gate: passed

## Persisted Asset State

| Asset | State |
|---|---|
| Raw candidates | present |
| Source raw artifacts | missing |
| Raw originals | present |
| Pool candidates | present |
| Business signals | present |
| Signal card files | 12 |
| V3 data observation desk data | present |
| Intelligence graph index | present |
| Operations dashboard data | present |

## Persistence Rule

Local repair regenerated Raw / Pool, Signal Cards, Business frontstage data, graph index, and gates. Publication still follows branch / PR / GitHub Pages policy.
