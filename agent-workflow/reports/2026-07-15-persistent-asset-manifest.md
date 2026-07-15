# 2026-07-15 Business Signals Asset Manifest

- generated_at: 2026-07-15T16:20:58+08:00
- workflow_mode: business_signals_direct_card_publication_from_reused_raw_pool
- source_artifact_reuse: reused same-date Raw/Pool artifacts from failed workflow run 29388717407
- raw_active_count: 171
- pool_count: 157
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
| Signal card files | 25 |
| V3 data observation desk data | present |
| Intelligence graph index | present |
| Operations dashboard data | present |

## Persistence Rule

Raw / Pool were reused from same-date production artifacts because evidence supply had already passed. Card assets, Business frontstage data, operations data, and pre-commit freshness all passed before publication.
