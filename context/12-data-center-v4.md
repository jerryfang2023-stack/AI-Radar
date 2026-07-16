---
status: current
scope: data-center-v4
version: SITE-V4.0-data-center
last_updated: 2026-07-16
priority: current
---

# WaveSight Data Center V4

This is the current source of truth for the factual data layer. `context/07-v3-intelligence-generation-rules.md` remains active only for frozen V3 page compatibility during dual-write migration.

## Positioning

WaveSight is an AI industry data center. It provides a structured, systematic, source-traceable data foundation for AIP products, industry research, and startup decision-support applications. It does not make decisions, judge commercial value, recommend actions, or teach readers what conclusion to reach.

## Canonical chain

```text
SourceArtifact
-> RawDocument
-> Claim / Entity
-> CanonicalEvent
-> FDE / Hardware projections
-> JSON / JSONL / DuckDB
-> downstream applications
```

Raw snapshots and exact Claim spans are the evidence layer. CanonicalEvent is the normalized fact layer. FDE and hardware are source-bounded projections. Pool is an operational QA queue. Card is a legacy page renderer, not a V4 truth asset.

## Versions and contracts

- Raw: `RAW-V3.0`
- Event: `EVENT-V1.0`
- FDE: `FDE-V2.0`
- Hardware: `HARDWARE-V1.0`
- Tags and facets: `TAG-V4.0`
- Contract: `agent-workflow/product/data-center-v4-contract.md`
- JSON Schema: `agent-workflow/product/data-center-v4.schema.json`
- Tag taxonomy: `agent-workflow/product/tag-taxonomy-v4.json`

## Rules

- Every Claim quotes an exact `body_clean` span.
- Every formal event has resolvable Claim and SourceArtifact references.
- Every CanonicalEvent must pass the AI-industry scope gate: the source title or accepted Claims must show AI as the event's direct technology, product, capability, organization, policy, transaction, deployment, hardware, or research subject.
- Publisher names, feeds, discovery channels, search queries, navigation labels, and incidental mentions of AI do not establish event eligibility.
- Generic vertical-industry publicity that only labels a local operating system as “智慧” or “大模型”, without a source-bounded AI-industry actor, product identity, market action, or reusable technical release, remains in QA and does not enter CanonicalEvents.
- Administrative support notices centered on 模型券、算力券、数据券、补贴申领或兑付平台 do not enter the commercial-event dataset unless the same source discloses a separate, concrete AI product transaction, procurement contract, financing, or customer deployment event.
- Event status describes disclosed state: announced, planned, in progress, completed, rumored, disputed, or withdrawn.
- Extraction confidence describes reliability only; it is never a value score.
- Missing fields remain empty and are listed. Conflicts remain visible.
- Technical Tags are evidence assertions on accepted Claims and never determine eligibility, ranking, relationships, or truth.
- Product form, application scenario, industry, deployment model, and target user are evidence-backed structured Facets; they must not be duplicated into the technical Tag namespace.
- FDE and hardware records cannot be created directly from source artifacts or page caches.
- Importance, opportunity, trend maturity, business meaning, why-watch, recommendations, and advice are forbidden in V4 canonical outputs.

## Daily execution

```powershell
npm run build:data-center -- --date=YYYY-MM-DD
npm run assert:data-center -- --date=YYYY-MM-DD
npm run sync:data-center
```

The daily GitHub workflow runs these steps after Raw evidence supply passes and before legacy Card/page compatibility work.

## Daily serving semantics

- The event list groups and filters daily records by the bundle `data_date`, because it represents the accepted daily data batch.
- `event_time` and `disclosed_at` remain separate factual timestamps and are shown only as auxiliary event metadata using the Asia/Shanghai calendar date.
- Search, type, and tag filters remain inside the current data batch unless the user explicitly supplies a date range.
- During V3/V4 dual-write, a current V4 event batch unexpectedly smaller than the same-date factual legacy Card set is a coverage regression that requires Raw-to-Event investigation.

## Page contract

The V4 Data Center and Industry Reports sidebar plan is approved and governed by `context/frontstage-page-contracts.md`. Other SITE-V3.4.5 compatibility pages remain frozen until separately approved. Existing trend, opportunity, report, and importance-sorted outputs may continue only as legacy page compatibility data. They do not enter V4 tables.
