---
status: current
scope: data-center-v4
version: SITE-V4.0-data-center
last_updated: 2026-09-02
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

Private evidence objects and exact Claim spans are the evidence layer. Public RawDocuments carry body-free metadata plus `evidence://<content_hash>` locators. CanonicalEvent is the normalized fact layer. FDE and hardware are source-bounded projections. `qa_queue` is the only current review queue. Signal Card and V3 Pool interfaces are retired and absent.

## Versions and contracts

- Structured source intake: `SOURCE-INTAKE-V1.1`
- Raw: `RAW-V4.0`
- Private evidence: `PRIVATE-EVIDENCE-STORE-V2.0`
- Public evidence locator: `PUBLIC-EVIDENCE-LOCATOR-V1.0`
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
- Tags and facets: `TAG-V4.1`
- Contract: `agent-workflow/product/data-center-v4-contract.md`
- JSON Schema: `agent-workflow/product/data-center-v4.schema.json`
- Entity history contract: `agent-workflow/product/entity-history-v1-contract.md`
- Entity history schema: `agent-workflow/product/entity-history-v1.schema.json`
- Targeted backfill contract: `agent-workflow/product/targeted-backfill-v1-contract.md`
- Targeted backfill schema: `agent-workflow/product/targeted-backfill-v1.schema.json`
- Tag taxonomy: `agent-workflow/product/tag-taxonomy-v4.json`

Technical tag and facet matching is Claim-bound and sentence-local: an exclusion
may suppress only the evidence sentence where it occurs, not an independent
sentence in the same Claim quote. Coverage is descriptive, never a quota or
publication gate. Reproject all accepted historical Claims with
`npm run reproject:tag-taxonomy`, then run `npm run audit:tag-taxonomy` and the V4
integrity gates.

## Rules

- Every Claim quotes an exact span of the normalized body loaded from its private `evidence://<content_hash>` object.
- Every formal event has resolvable Claim and SourceArtifact references.
- Every accepted event also has at least one source-backed Entity reference. When an approved translated title uses a double dash or dash to separate a localized organization name from the event description, the exact leading title span may create a candidate organization mention only when the accepted Claim also supplies a valid organization subject; this repair must not promote a title fragment to a verified catalog entity.
- A registered organization alias found only in `title_original` remains a candidate mention. Set its Entity/EntityMention verification to `verified` only when an accepted Claim contains an exact registered alias for the same canonical organization; a headline prefix cannot substitute for Claim evidence.
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

## V4 data-lake contract

`data-lake/tables/` is a rebuildable machine-serving projection with exactly
24 JSONL tables. `npm run sync:data-lake` deletes JSONL files outside the V4
allowlist, rebuilds DuckDB from zero, writes `data-lake/manifest.json`, and runs
`npm run assert:data-lake-v4`.

The gate requires the JSONL and DuckDB table sets to match exactly and forbids
Card, Pool, compatibility, and legacy-mapping tables. The manifest records the
contract version, generation time, Git commit, table names, and row counts.
The Guanlan AI Vault remains a one-way readable projection and never reads or
modifies JSONL or DuckDB.

The local refresh runs inside the existing 16:45 Final Closure. No independent
data-lake scheduled task or Startup loop is supported.

The daily GitHub workflow captures ephemeral snapshots, writes `SOURCE-INTAKE-V1`, persists and pushes complete bodies to the private evidence repository, removes public body copies, and passes the public evidence boundary gate before these V4 steps. No legacy Card, desk, graph, or mapping writer follows them.

China-market collection remains part of this same daily intake and scheduler.
Each RawDocument may persist a `market_scope` object containing source-registry
identity, source region, content market region, and the explicit China-match
basis. `assert:china-market -- --date=<YYYY-MM-DD>` reads only the CN
source/content subset from the unified intake; it does not treat the entire
daily batch as China-specific and applies no source weights or ranking bonuses.
Accepted non-procurement CanonicalEvents may project the controlled bases
`actor_origin`, `event_market`, `regulatory_jurisdiction`, and
`deployment_location`, together with Claim and source-registry references.
Unmatched records omit the optional scope field; procurement and tender sources
and queries remain disabled for this upgrade.
China AI hardware financing and vertical-agent financing use dedicated localized
discovery paths with separate query limits. They remain non-weighted discovery
routes: they cannot add source weights, ranking bonuses, or bypass the same
SourceArtifact, exact-span Claim, eligibility, and publication gates.

For a full historical reprojection of all accepted canonical data, run `npm run backfill:entity-history`. The generated coverage report must disclose boundary and source-batch gaps rather than manufacture records.

## Targeted historical collection

`BACKFILL-V1.0` is the internal cross-day discovery queue for public company, product, and source-backed person relationship history sweeps plus explicit funding and deployment fact gaps. It routes deterministic `core` work first: factual gaps, person joins/leaves/founds, and company/product targets with repeated accepted activity inside the six-month window. Single-event company/product sweeps remain `standard`; neither tier implies commercial value.

```powershell
npm run build:targeted-backfill
npm run assert:targeted-backfill
npm run manage:targeted-backfill -- --action=next
```

Search queries, result snippets, candidates, and no-findings runs cannot create facts. A candidate must return through SourceArtifact -> RawDocument -> exact-span Claim and the responsible Event/FDE build and gate. A missing event type in an entity timeline is not proof that an event occurred.

`capture-targeted-backfill-sources.mjs` may append accepted captures to the existing same-date `SOURCE-INTAKE-V1.1` bundle with `--merge-intake=true`. The merged record must retain canonical extraction diagnostics, applicable China-market scope fields, and the private evidence locator; complete source bodies must be archived to the private evidence repository and removed from the public working tree before the V4 build.

The daily Event build has one bounded historical-admission exception: a verified company financing source may enter the canonical chain when its publication date is within the preceding three calendar months, even when it is outside the seven-day daily source window. Financing older than that remains in QA unless the operator explicitly passes `--allow-historical-funding=true` for a targeted backfill. Funding Insight generation then skips events already covered by any persisted card's event ID or canonical company-plus-normalized-round key before invoking search or DeepSeek.

The entity-history manifest reports accepted data-batch counts by month. Sparse months remain visible and are not converted into synthetic daily tasks.

## Daily serving semantics

- The event list groups and filters daily records by the bundle `data_date`, because it represents the accepted daily data batch.
- `event_time` and `disclosed_at` remain separate factual timestamps and are shown only as auxiliary event metadata using the Asia/Shanghai calendar date.
- Search, type, and tag filters remain inside the current data batch unless the user explicitly supplies a date range.
- Coverage diagnostics compare structured intake, accepted Claims/Events, conflicts, and QA state. Archived V3 counts are not production baselines.

## Page contract

The focused V4 shell for Data Center and Trend Radar is governed by `context/frontstage-page-contracts.md`. FDE is an Event Library theme; Opportunity Map is an unlisted internal lab. Financing cards and accepted reports publish to the independent AI financing site, while old Guanlan Research/funding/report URLs are redirects only. Trend, opportunity, funding, and report outputs remain downstream application data and do not enter V4 canonical tables.
