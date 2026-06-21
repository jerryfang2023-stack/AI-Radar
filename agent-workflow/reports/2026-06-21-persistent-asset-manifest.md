# 2026-06-21 Business Signals Asset Manifest

- generated_at: 2026-06-21T12:58:47.0894052+08:00
- workflow_mode: codex_hermes_repair
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
| Source raw artifacts | present |
| Raw originals | present |
| Pool candidates | present |
| Business signals | present |
| Signal card files | 23 |
| Site content data | present |
| V3 data observation desk data | present |
| Intelligence graph index | present |
| Operations dashboard data | present |

## Persistence Rule

Raw / Pool are replayed from the failed GitHub workflow artifacts. Card assets and Business frontstage data were regenerated locally after the generator repair, then validated with the unified Business frontstage gate and pre-commit freshness gate.
