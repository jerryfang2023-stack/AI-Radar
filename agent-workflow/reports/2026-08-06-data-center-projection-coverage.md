# Data Center Projection Coverage - 2026-08-06

- status: failed

## Counts

- entities: 27
- entity_mentions: 46
- accepted_events: 22
- verified_event_organizations: 8
- verified_event_products: 2
- fde_records: 0
- hardware_records: 0
- fde_observations: 0
- hardware_facts: 5
- hardware_snapshots: 3
- monitoring_funnel_lenses: 2

## Coverage

- entity_mention_coverage: 100.0%
- accepted_event_entity_coverage: 90.9%
- entity_index_organization_coverage: 100.0%
- entity_index_product_coverage: 100.0%
- fde_frontstage_coverage: 100.0%
- hardware_frontstage_coverage: 100.0%
- fde_observation_frontstage_coverage: 100.0%
- hardware_fact_frontstage_coverage: 100.0%
- hardware_snapshot_frontstage_coverage: 66.7%
- monitoring_funnel_frontstage_coverage: 100.0%

## Failures

- EV-c7bd142e35ad2b19: accepted event has no entity reference
- EV-10c4f4db6c3f2d72: accepted event has no entity reference
- frontstage hardware catalog is missing 1 current-batch snapshot(s)

## Warnings

- No source-bounded FDE record was produced for the daily batch.
- No source-bounded hardware record was produced for the daily batch.
- No Claim-native FDE observation was produced for the daily batch.
