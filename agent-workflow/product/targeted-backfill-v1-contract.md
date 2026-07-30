# WaveSight Targeted Backfill V1 Contract

Status: current operational contract
Version: `BACKFILL-V1.0`

## Purpose

The targeted backfill queue schedules source discovery for five bounded scopes:

- company history;
- product/model/service history;
- incomplete funding facts;
- incomplete deployment/FDE facts.
- source-backed person joins, leaves, and founding history.

The queue is an operational dataset. It is not a factual table and is not exposed on the public website.

Gap detection rebuilds its input from the Git-tracked canonical daily bundles and their ENTITY/FDE projections. It must not read frontstage JSON, legacy Cards, or report copy as source truth.

## Evidence boundary

Search queries, result snippets, discovery summaries, publisher names, legacy Cards, and frontstage copy are discovery metadata only. They cannot complete a fact-gap task or create an Entity, CanonicalEvent, FDE record, relationship, TagAssertion, or FacetAssertion.

A candidate can enter the V4 chain only after the original page is persisted in the private evidence store and represented by a SourceArtifact and body-free RAW-V4 document. Any factual update requires an exact-span Claim and the normal responsible build and integrity gate.

## Task types

| Task type | Trigger | Completion |
|---|---|---|
| `company_history` | a public verified company has accepted events in the six-month window | every planned query has an auditable run; candidates still require original-source capture; a no-findings result closes only the current review cycle |
| `product_history` | a public persisted product has accepted events in the six-month window | same recurring coverage-sweep rule as company history |
| `funding_detail` | an accepted funding event lacks amount, round, or investor evidence | the source is captured, a Claim is accepted, the event is rebuilt, and the detected gap disappears |
| `deployment_case` | an accepted deployment lacks an FDE record or the FDE record has undisclosed implementation fields | the source is captured, a Claim is accepted, the event/FDE projection is rebuilt, and the detected gap disappears |
| `person_history` | an accepted event already establishes a reviewed `joins`, `leaves`, or `founds` relationship | every planned query has an auditable run; candidates still require original-source capture and exact-span Claims |

Absence of a funding, product, or deployment event is never itself treated as proof that an event occurred.

## Routing priority

The queue is sorted by a transparent operational tier, not by commercial value. Funding/deployment fact gaps and person relationship sweeps are always `core`. Company and product sweeps are `core` when the target has at least two accepted events inside the six-month window; single-event targets remain `standard`. The queue keeps both tiers, while `manage:targeted-backfill -- --action=next` returns open core work first.

Only events whose factual date falls inside the declared six-month window can create an active task. The queue never creates one task per calendar day and does not treat a quiet day as a gap.

## State lifecycle

```text
open -> in_progress -> candidates_found -> evidence_captured
                                      \-> accepted_pending_rebuild -> resolved
                    \-> no_findings -> open on the next review date
                    \-> blocked
canonical target removed -> retired (not resolved)
target moves outside the rolling six-month window -> retired (not resolved)
```

Task IDs are stable across rebuilds. Rebuilding the queue preserves attempts, candidates, capture references, and accepted Claim references. A fact-gap task moves to `resolvedTasks` only when its canonical target still exists inside the active window and the source-backed gap disappears. If an upstream rebuild removes the target itself, the task moves to `retiredTasks` with `target_no_longer_canonical`; if the target simply ages out of the rolling window, it moves with `outside_coverage_window`. Neither condition is reported as successful backfill.

## Storage

```text
01-SiteV2/content/11-databases/targeted-backfill-v1/
  queue.json
  runs/<run-id>.json
```

Discovery runs are immutable audit records. The queue may be regenerated, but run files must not be overwritten.

## Commands

```powershell
npm run build:targeted-backfill
npm run assert:targeted-backfill
npm run manage:targeted-backfill -- --action=next
npm run manage:targeted-backfill -- --action=claim --task=BFQ-... --worker=<name>
npm run manage:targeted-backfill -- --action=record --task=BFQ-... --input=<discovery-run.json>
npm run manage:targeted-backfill -- --action=attach --task=BFQ-... --source-artifact-id=SA-... --raw-id=RAW-... --claim-ids=CL-...
```
