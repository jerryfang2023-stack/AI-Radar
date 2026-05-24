# WSD-20260524 Card Generation Closeout

- date: 2026-05-24
- harness: Raw / Pool / Card asset harness
- status: completed_with_notes
- downstream: cards generated; site sync not run

## Inputs

- Raw: `01-SiteV2/content/01-raw/2026-05-24-raw-candidates.md`
- Pool: `01-SiteV2/content/02-pool/2026-05-24-pool-candidates.md`
- Daily Monitor QC: `agent-workflow/reports/2026-05-24-guanlan-daily-monitor-qc.md`
- Asset readiness: passed, `asset_scope=eligible_core_pool_only`

## Outputs

| Asset | Count | Notes |
|---|---:|---|
| signal_card | 22 | 17 new stable card files + 5 merged updates into existing stable cards |
| funding | 10 | 5 new funding cards + 5 merged funding updates |
| case | 3 | under `knowledge/01-Signal-Cards/case/`; includes C.H. Robinson as case |
| product_service | 9 | under `knowledge/01-Signal-Cards/product-service/` |
| opinion intake/cards | 25 | under `knowledge/02-Opinion-Cards/` |
| frontstage opinion sidebar | 11 | translated and rated `sidebar` |
| opinion archive | 14 | retained internally, not frontstage |

## Notes

- The first cardcopy run failed on 4 generated signal cards.
- Two AWS Marketplace cards failed because the generated title kept a long English source title. The generator now normalizes the AWS Marketplace owner before writing card titles.
- Two Microsoft GitHub README-derived cards failed because README / documentation evidence must not be promoted to formal frontstage signal cards. The generated files for those two invalid cards were removed from this run.
- `generate-asset-cards-from-pool.mjs` had an early return in `isEligibleAutoSignal`, which prevented the later evidence-page exclusions from running. This was fixed so README / documentation / product-catalog style pages cannot slip into auto signal generation.
- Cross-day duplicate handling was added to `generate-asset-cards-from-pool.mjs`: same source URL, full-text hash, or same normalized signal fingerprint now upserts into the existing stable signal card instead of creating a new dated duplicate.
- 2026-05-24 duplicate updates merged into existing cards: Sycamore, Netomi, Nexus, Lio, Realm. Their 2026-05-24 duplicate files were not retained.
- C.H. Robinson owner/type inference was repaired so the card is `case` with owner `C.H. Robinson`, not a generic product-service card.

## Validation

- `assert-guanlan-automation-readiness --command=assets --date=2026-05-24`: passed
- `generate-asset-cards-from-pool --date=2026-05-24`: passed
- `node --check agent-workflow/tools/generate-asset-cards-from-pool.mjs`: passed
- `run-quality-gates cardcopy --date=2026-05-24 --require-gates=true`: passed
- duplicate audit after regeneration: 17 current-date signal files; 0 current-date duplicate groups by source URL; 0 current-date duplicate groups by full-text hash
- `sync-v2-site-data --date=2026-05-24`: passed; frontstage data no longer includes the removed dated duplicate filenames

## Not Done

- Site sync was not run in this task.
- Netlify deploy / GitHub push were not run.
