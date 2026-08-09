# Business Signals Weekly Failure Audit — 2026-08-03 to 2026-08-09

## Result

Every scheduled first Business Signals run failed during the window, but the core factual chain was not broken every day. The final classifier incorrectly promoted independently versioned application-projection failures into fatal Business Signals failures. Health Dispatch then reported a successful dispatch, which proves recovery was requested but not that the downstream run completed.

## Daily evidence

| Date | First run | First fatal signature | Later result |
|---|---:|---|---|
| 2026-08-03 | 30773847896 | Data Center frontstage test rejected unreviewed entity `EN-44db9626b9be346d`; model assist also degraded on `qa_suggestion_incomplete` but deterministic V4 continued. | Recovered in later run 30778166723. |
| 2026-08-04 | 30864711615 | Data Center frontstage test rejected unreviewed entity `EN-25cdd04cf7fba6b1`. | Recovered in later run 30880796030. |
| 2026-08-05 | 30962421167 | Funding event `EV-2dea56b0e97c1685` had no valid Funding Insight card; the funding application gate failed. | Recovered in later run 30978185875. |
| 2026-08-06 | 31058801147 | Funding event `EV-60f219702a66bf38` had no valid Funding Insight card; the funding application gate failed. | Recovered on the second same-date run. |
| 2026-08-07 | 31133715651 | Funding frontstage queue failed `entity_review_candidate_count_mismatch`. | Recovered in later run 31147883970. |
| 2026-08-08 | 31229358793 | Funding event `EV-f5cf8dd390746de1` had no valid Funding Insight card; the funding application gate failed. | Same-date Business Signals retries remained failed; the funding data was repaired separately. |
| 2026-08-09 | 31285604581 | Opportunity test required retired shell version `SITE-V4.4.1-china-market-scope` while pages correctly used `SITE-V4.6.0-research-homepage`. | The stale assertion and today's funding card/data were repaired on main; later no-diff publication still exposed the classifier defect. |

## Code and rule roots

1. `classify-business-signals-production-state.mjs` grouped Opportunity Map, Trend Radar, and Funding Insights with fatal V4 production stages. This contradicted the current product boundary: V4 canonical facts are core; those three products are downstream application outputs and are independently versioned.
2. The Opportunity test hard-coded an obsolete site version instead of asserting the V4 shell contract, so a valid release-version update failed an unrelated projection lane.
3. Earlier entity publication admitted new company/product candidates before explicit catalog review. Current `buildEntityCollections` already fail-closes those candidates outside the public indexes; the historical failures prove why that prevention must remain.
4. Funding generation correctly fails closed when a verified financing event cannot produce a valid card. The rule defect was not that strict gate; it was allowing that application-only failure to discard an already accepted V4 daily bundle.
5. Before this repair, Business Signals Health Dispatch recorded `dispatched` when the GitHub request succeeded. That status was controller evidence, not downstream completion evidence; daily closure and the target workflow conclusion remain authoritative.

## Prevention added

- Final Business Signals classification now blocks only evidence supply, V4 build/integrity/materialization, operations/freshness, and publication.
- Opportunity Map, Trend Radar, and Funding Insights failures remain explicit `warnings` while the accepted V4 bundle can publish.
- The pipeline policy gate rejects any return of `application_projection` as a fatal classifier stage and requires all three downstream warnings to remain observable.
- The Opportunity route regression checks the generic V4 shell metadata contract instead of a retired release string.
- The split Data Center serving projection was rebuilt from the accepted 2026-08-09 monolithic adapter, closing the discovered 1962/1963 event-count drift and reducing the quarantined-title count from 17 to 16.
- Cloud Health Dispatch now waits for the selected workflow-dispatch run, requires a successful conclusion, then keeps polling through the asynchronous merge window until a fresh fetch proves healthy same-date V4 assets on `origin/main`; dispatch acceptance, a stale remote ref, or workflow success alone can no longer produce a green cloud health run. Local controller calls remain non-blocking liveness actions.
- Opportunity, Trend, and Funding staleness are reported as three independent application warnings. Core pre-commit freshness blocks only V4 materialization and operations staleness, while each application keeps its own strict gate and success-only staging rule.
