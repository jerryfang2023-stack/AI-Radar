# WaveSight Data Center V4 Contract

Status: current  
Product version: `SITE-V4.0-data-center`  
Data versions: `SOURCE-INTAKE-V1.1`, `RAW-V4.0`, `EVENT-V1.1`, `FDE-V2.0`, `FDE-OBSERVATION-V1.0`, `HARDWARE-V1.0`, `HARDWARE-FACT-V1.0`, `HARDWARE-SNAPSHOT-V1.0`, `LENS-FUNNEL-V1.0`, `TAG-V4.0`

## Boundary

WaveSight Data Center stores structured, source-traceable AI industry data. It does not make decisions, rank commercial value, recommend actions, judge opportunities, or teach readers what conclusion to reach.

Allowed operations are capture, cleaning, translation with the original preserved, claim extraction, entity linking, event normalization, deduplication, conflict recording, factual relationship construction, descriptive counts, filtering, querying, and export.

The V4 fact chain is:

```text
SourceArtifact -> RawDocument -> Claim / Entity
               -> CanonicalEvent -> FDERecord / HardwareRecord publication projections
               -> FDEObservation / HardwareFact -> HardwareSnapshot
               -> database / exports
```

Signal Cards, V3 page JSON, legacy mappings, and compatibility interfaces are absent from the working tree. Historical recovery is possible only from an explicit Git ref in an isolated worktree; recovered assets cannot enter current production or Pages.

## Storage

Daily canonical bundles are written to:

```text
01-SiteV2/content/11-databases/data-center-v4/<YYYY-MM-DD>/
```

Every bundle contains source artifacts, raw documents, claims, entities, entity mentions, canonical events, event-source and event-claim links, conflicts, factual relationships, technical tag assertions, structured facet assertions, FDE records, FDE observations, hardware records, hardware facts, hardware snapshots, monitoring-funnel rows, a QA queue, and a manifest. V3 Cards, legacy mappings, and `compatibility_cards` are not part of the V4 interface.

Complete original bodies are stored only in the configured `PRIVATE-EVIDENCE-STORE-V2.0` repository. Public RawDocuments contain body-free metadata, body length, and an `evidence://<content_hash>` locator. The public source index, Guanlan AI Vault, data lake, and website must not contain complete source bodies.

The public interface is defined by `data-center-v4.schema.json`. Stable identifiers are `source_artifact_id`, `raw_id`, `claim_id`, `entity_id`, `event_id`, and `tag_id`.

## China-market scope

- China-market collection reuses the unified daily `aihot`, keyword, GDELT, and RSS intake; it does not create a separate scheduled task.
- Registered source types are descriptive only. No source weight, confidence bonus, ranking bonus, or source-tier algorithm is allowed.
- Procurement and tender sources/queries remain disabled and `procurement_contract` events cannot enter this scope.
- A matched RawDocument may carry `market_scope` with the source registry identity, source region, `market_region: "CN"`, and its explicit match basis.
- A matched CanonicalEvent may carry `market_scope` with controlled bases (`actor_origin`, `event_market`, `regulatory_jurisdiction`, `deployment_location`), source registry references, and Claim references.
- Unmatched RawDocuments, events, and entities omit the optional market-scope fields instead of receiving empty placeholders.

## Truth and evidence rules

- A Claim must quote an exact span of the normalized private evidence body resolved through `RawDocument.body_ref`.
- A CanonicalEvent must reference at least one Claim and one SourceArtifact.
- `CanonicalEvent.display_title_zh` must be the exact `RawDocument.title_zh` associated with one of the event's sources, or the unchanged `title_original` when that source title is already Chinese or is itself a versioned technical title. Event-field summaries and generated editorial headlines are not valid title fallbacks. A versioned technical title remains subject to event-source eligibility and cannot turn a developer-package release into a commercial event.
- CanonicalEvent eligibility requires source-bounded evidence that AI is the direct subject of the event. AI-themed publishers, feeds, discovery labels, queries, navigation text, and incidental page mentions do not qualify a record.
- Generic vertical-industry “智慧 / 大模型” publicity without an identifiable AI-industry actor, product identity, market action, or reusable technical release is routed to QA rather than normalized as a CanonicalEvent.
- Administrative support notices centered on 模型券、算力券、数据券、补贴申领或兑付平台 are routed to QA unless the source separately discloses a concrete AI product transaction, procurement contract, financing, or customer deployment event.
- Missing source fields remain empty and are listed under `missing_fields`; they are not inferred.
- Conflicting sources remain attached as conflicts. The data center does not select the more commercially useful version.
- FDERecord and HardwareRecord remain publication projections from accepted CanonicalEvents only.
- FDEObservation and HardwareFact are Claim-native factual records. Their optional event references add a timeline link but do not determine admission.
- HardwareSnapshot aggregates accepted HardwareFacts for one subject/product state on one data date. Cross-day state differences create a factual change timeline; they do not create a CanonicalEvent without a new accepted Claim.
- Lens monitoring funnels expose original-source, valid-Claim, observation and event-conversion rates plus blocker counts. These are operational diagnostics, not value scores.
- A TagAssertion must reference a Claim and its exact source span.
- Technical Tags describe cross-cutting AI technology semantics only. Product form, use case, industry, deployment model, and target user are stored as evidence-backed FacetAssertions.
- A FacetAssertion must reference the same accepted Claim and exact source span that supports the structured value.
- Source pages, search snippets, navigation, publisher names, query text, legacy scores, and legacy summaries cannot independently create facts or tags.

## Core exclusions

The following fields and concepts are forbidden in V4 canonical outputs:

- importance, value, impact, opportunity, pain, trend maturity, and interview priority scores;
- `business_meaning`, `why_selected`, `why_watch`, recommendations, and advice;
- `usable_for`, commercial Pool routes, and early/mature signal labels;
- tag-derived eligibility, ranking, relationship direction, or truth.

Opinion and community material may be stored as source datasets, but it is not promoted to a factual event without a separate source-bounded event claim.

## Retired compatibility boundary

The public website uses the unified V4 frontstage. Current production does not generate or consume V3 Card, desk, graph, archive payload, or legacy mapping assets. Current opportunity, trend, funding, and report adapters read accepted V4 evidence.

The daily data-center list uses bundle `data_date` as its grouping and filter date. Canonical `event_time` and `disclosed_at` retain the source-reported time and must not replace the daily batch date in default list selection.

No dual-write, compatibility comparison, or legacy mapping stage remains. Reintroducing one is a release-blocking regression.
