---
status: current
scope: data-center-v4
version: SITE-V4.0-data-center
last_updated: 2026-07-17
priority: current
---

# WaveSight Data Center V4

This is the current source of truth for the factual data layer. `context/07-v3-intelligence-generation-rules.md` remains active only for internal compatibility data and downstream application adapters.

## Positioning

WaveSight is an AI industry data center. It provides a structured, systematic, source-traceable data foundation for AIP products, industry research, and startup decision-support applications. It does not make decisions, judge commercial value, recommend actions, or teach readers what conclusion to reach.

## Canonical chain

```text
SourceArtifact
-> RawDocument
-> Claim / Entity
-> CanonicalEvent
-> Entity Registry / Entity Profile / RELATION-V2
-> FDE / Hardware projections
-> JSON / JSONL / DuckDB
-> downstream applications
```

Raw snapshots and exact Claim spans are the evidence layer. CanonicalEvent is the normalized fact layer. FDE and hardware are source-bounded projections. Pool is an operational QA queue. Card is a legacy page renderer, not a V4 truth asset.

## Versions and contracts

- Raw: `RAW-V3.0`
- Event: `EVENT-V1.0`
- Entity history: `ENTITY-V1.0`
- Factual relationships: `RELATION-V2.0`
- FDE: `FDE-V2.0`
- Hardware: `HARDWARE-V1.0`
- Tags and facets: `TAG-V4.0`
- Contract: `agent-workflow/product/data-center-v4-contract.md`
- JSON Schema: `agent-workflow/product/data-center-v4.schema.json`
- Entity history contract: `agent-workflow/product/entity-history-v1-contract.md`
- Entity history schema: `agent-workflow/product/entity-history-v1.schema.json`
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
- Named products are persisted as source-backed `product_candidate` Entities. Public pages may read persisted product entities only and must not recreate products through page-specific inference or a manual whitelist.
- Organizations, products/models/services, and people use stable `EN-*` IDs. Technology, use case, and industry remain `TX-*` classification nodes.
- Every RELATION-V2 row resolves typed endpoints and an accepted CanonicalEvent, Claim references, and SourceArtifact references. Candidate or quarantined entity endpoints cannot enter a formal relationship.
- Entity timelines may aggregate accepted events across data batches, but retain each event's factual date and source lineage. No daily completeness is implied.
- FDE and hardware records cannot be created directly from source artifacts or page caches.
- Importance, opportunity, trend maturity, business meaning, why-watch, recommendations, and advice are forbidden in V4 canonical outputs.

## Historical migration boundary

- Current and future daily builds use the persisted product-entity path.
- Historical bundles that predate product entities remain immutable until a dedicated product-only migrator passes dry-run parity checks.
- `npm run backfill:data-center` rebuilds Claims, Entities, events, projections, and related bundle assets. It must not be used to fill only historical product entities.

## Daily execution

```powershell
npm run build:data-center -- --date=YYYY-MM-DD
npm run assert:data-center -- --date=YYYY-MM-DD
npm run sync:data-center
npm run assert:entity-history
```

The daily GitHub workflow runs these steps after Raw evidence supply passes and before legacy Card/page compatibility work.

For a full historical reprojection of all accepted canonical data, run `npm run backfill:entity-history`. The generated coverage report must disclose boundary and source-batch gaps rather than manufacture records.

## Daily serving semantics

- The event list groups and filters daily records by the bundle `data_date`, because it represents the accepted daily data batch.
- `event_time` and `disclosed_at` remain separate factual timestamps and are shown only as auxiliary event metadata using the Asia/Shanghai calendar date.
- Search, type, and tag filters remain inside the current data batch unless the user explicitly supplies a date range.
- While the internal V3 compatibility lane remains active, a current V4 event batch unexpectedly smaller than the same-date factual legacy Card set is a coverage diagnostic that requires Raw-to-Event investigation.

## Page contract

The unified V4 Data Center and Industry Reports page system is governed by `context/frontstage-page-contracts.md`. Legacy V3 column URLs are redirects only. Existing trend, opportunity, report, and importance-sorted outputs may continue only as internal compatibility or downstream application data. They do not enter V4 tables.
