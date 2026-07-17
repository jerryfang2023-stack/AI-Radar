# 2026-07-17 Guanlan V4 Daily Monitor QC

- generated_at: 2026-07-17T10:35:00+08:00
- status: passed_after_repair
- downstream_decision: allow
- data_date: 2026-07-17

## Monitoring result

| Layer | Result | Gate |
|---|---:|---|
| Raw | 167 | passed; 9 source failures recovered by fallback, 0 unrecovered |
| Pool | 152 | passed; 114 routed, 52 core |
| Commercial events | 31 | passed; 100% Claim and source traceability |
| FDE | 2 | passed; enterprise implementation evidence required |
| AI hardware | 2 | passed; hardware component evidence required |
| Community intelligence | 68 items / 79 links | passed |
| First-line viewpoints | 20 remarks / 12 builders | passed; morning and afternoon lanes merged |
| Industry reports | active through 2026-07-16 | expected cadence; no daily report required |

## Problems found and repaired

1. The cloud run collected valid data but stopped during frontstage materialization because tests hard-coded 2026-07-16 records. The tests now use the current manifest and historical regression fixtures separately.
2. Event status extraction marked disputed funding as completed. Dispute evidence now takes precedence, while completed funding and acquisitions still outrank unrelated future-use wording.
3. Duplicate named releases were split by publisher wording or entity alias. Named release clustering now merges the same product identity across model, product, deployment, and hardware wording.
4. Partial English titles, HTML entities, publisher suffixes, and generic titles were entering the frontstage. New records are blocked by the title gate; inherited invalid records are quarantined instead of blocking the whole site.
5. Consumer feature updates, regulatory filing, and staff resignation were entering deployment or partnership groups. They now resolve to product release, policy/regulation, and organization/people respectively.
6. FDE accepted consumer and generic joint-venture records. Projection now requires both enterprise context and implementation evidence and records absent fields explicitly.
7. Hardware capacity treated price as capacity and missed Jetson modules and national AI infrastructure. Capacity, contract value, supplier role, component, and infrastructure detection are now separated.
8. Public source labels exposed discovery channels. Frontstage rows now display the resolved publisher/domain and preserve the daily batch date for event, FDE, and hardware filtering.

## Validation

- `test:data-center`: 37/37 passed.
- `test:data-center-site`: 21/21 passed.
- V4 integrity gate: passed with no failures or warnings.
- Current frontstage date: 2026-07-17.
- Current frontstage discovery-channel source labels: 0.
- Community intelligence gate: passed.
- First-line viewpoints dual-lane gate: passed.

## Non-blocking observations

- TAG-V4 assertions remain evidence-bounded. Events without an explicit taxonomy span remain untagged rather than receiving inferred tags.
- The report center follows weekly/monthly publication cadence; 2026-07-16 is the latest active application snapshot and is not a daily-monitor failure.
