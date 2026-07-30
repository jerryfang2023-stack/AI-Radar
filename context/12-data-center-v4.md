---
status: current
scope: data-center-v4
version: SITE-V4.0-data-center
last_updated: 2026-07-29
priority: current
---

# WaveSight Data Center V4

This is the current source of truth for the factual data layer. `context/07-v3-intelligence-generation-rules.md` is retired historical guidance and is not a production route.

## Positioning

WaveSight is an AI industry data center. It provides a structured, systematic, source-traceable data foundation for AIP products, industry research, and startup decision-support applications. It does not make decisions, judge commercial value, recommend actions, or teach readers what conclusion to reach.

DeepSeek is the sole production model provider. Model assistance is restricted to exact-span Claim extraction, evidence-linked FDE/hardware candidate fields, reviewed entity-resolution candidates, source-hashed translation, and QA repair suggestions. Claim/FDE/hardware candidates may auto-promote only after deterministic source-hash, exact-span, protected-number, and contract gates; entity resolution and QA repair always require explicit review.

## Canonical chain

```text
SourceArtifact
-> RawDocument
-> Claim / Entity
-> CanonicalEvent -> Entity Registry / Entity Profile / RELATION-V2
-> Claim-native FDEObservation / HardwareFact
-> event-backed FDERecord / HardwareRecord publication views
-> HardwareSnapshot and factual change timeline
-> JSON / JSONL / DuckDB
-> downstream applications
```

Raw snapshots and exact Claim spans are the evidence layer. CanonicalEvent is the normalized fact layer. FDE and hardware are source-bounded projections. `qa_queue` is the only current review queue. Signal Card and V3 Pool interfaces are retired and absent.

## Versions and contracts

- Raw: `RAW-V3.0`
- Event: `EVENT-V1.1`
- Entity history: `ENTITY-V1.0`
- Factual relationships: `RELATION-V2.1`
- Targeted historical collection: `BACKFILL-V1.0`
- FDE: `FDE-V2.0`
- FDE observation: `FDE-OBSERVATION-V1.0`
- Hardware: `HARDWARE-V1.0`
- Hardware fact: `HARDWARE-FACT-V1.0`
- Hardware snapshot: `HARDWARE-SNAPSHOT-V1.0`
- Lens monitoring funnel: `LENS-FUNNEL-V1.0`
- Tags and facets: `TAG-V4.0`
- Contract: `agent-workflow/product/data-center-v4-contract.md`
- JSON Schema: `agent-workflow/product/data-center-v4.schema.json`
- Entity history contract: `agent-workflow/product/entity-history-v1-contract.md`
- Entity history schema: `agent-workflow/product/entity-history-v1.schema.json`
- Targeted backfill contract: `agent-workflow/product/targeted-backfill-v1-contract.md`
- Targeted backfill schema: `agent-workflow/product/targeted-backfill-v1.schema.json`
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
- FDERecord and HardwareRecord remain event-backed publication projections.
- FDEObservation and HardwareFact require accepted exact-span Claims and resolvable SourceArtifacts; they cannot be created from source artifacts, search snippets, or page caches alone.
- HardwareSnapshot may aggregate accepted facts and expose cross-day differences, but a state difference cannot become a CanonicalEvent without a new accepted Claim.
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

The daily GitHub workflow first captures immutable source snapshots and writes `SOURCE-INTAKE-V1`, then runs these V4 steps. No legacy Card, desk, graph, or mapping writer follows them.

For a full historical reprojection of all accepted canonical data, run `npm run backfill:entity-history`. The generated coverage report must disclose boundary and source-batch gaps rather than manufacture records.

## Targeted historical collection

`BACKFILL-V1.0` is the internal cross-day discovery queue for public company, product, and source-backed person relationship history sweeps plus explicit funding and deployment fact gaps. It routes deterministic `core` work first: factual gaps, person joins/leaves/founds, and company/product targets with repeated accepted activity inside the six-month window. Single-event company/product sweeps remain `standard`; neither tier implies commercial value.

```powershell
npm run build:targeted-backfill
npm run assert:targeted-backfill
npm run manage:targeted-backfill -- --action=next
```

Search queries, result snippets, candidates, and no-findings runs cannot create facts. A candidate must return through SourceArtifact -> RawDocument -> exact-span Claim and the responsible Event/FDE build and gate. A missing event type in an entity timeline is not proof that an event occurred.

The entity-history manifest reports accepted data-batch counts by month. Sparse months remain visible and are not converted into synthetic daily tasks.

## Daily serving semantics

- The event list groups and filters daily records by the bundle `data_date`, because it represents the accepted daily data batch.
- `event_time` and `disclosed_at` remain separate factual timestamps and are shown only as auxiliary event metadata using the Asia/Shanghai calendar date.
- Search, type, and tag filters remain inside the current data batch unless the user explicitly supplies a date range.
- Coverage diagnostics compare structured intake, accepted Claims/Events, conflicts, and QA state. Archived V3 counts are not production baselines.

## Page contract

The unified V4 shell for Data Center, Industry Reports, and the independent Opportunity Map is governed by `context/frontstage-page-contracts.md`. Legacy V3 column URLs are redirects only. Trend, opportunity, funding, and report outputs are downstream application data and do not enter V4 canonical tables.
