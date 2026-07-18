# WaveSight Data Center V4 Contract

Status: current  
Product version: `SITE-V4.0-data-center`  
Data versions: `RAW-V3.0`, `EVENT-V1.1`, `FDE-V2.0`, `HARDWARE-V1.0`, `TAG-V4.0`

## Boundary

WaveSight Data Center stores structured, source-traceable AI industry data. It does not make decisions, rank commercial value, recommend actions, judge opportunities, or teach readers what conclusion to reach.

Allowed operations are capture, cleaning, translation with the original preserved, claim extraction, entity linking, event normalization, deduplication, conflict recording, factual relationship construction, descriptive counts, filtering, querying, and export.

The V4 fact chain is:

```text
SourceArtifact -> RawDocument -> Claim / Entity -> CanonicalEvent
               -> FDE / Hardware projections -> database / exports
```

Legacy Signal Cards and page JSON are compatibility renderings. They are not V4 sources of truth.

## Storage

Daily canonical bundles are written to:

```text
01-SiteV2/content/11-databases/data-center-v4/<YYYY-MM-DD>/
```

Every bundle contains source artifacts, raw documents, claims, entities, entity mentions, canonical events, event-source and event-claim links, conflicts, factual relationships, technical tag assertions, structured facet assertions, FDE records, hardware records, a QA queue, legacy mappings, judgment-free compatibility Cards, and a manifest.

The public interface is defined by `data-center-v4.schema.json`. Stable identifiers are `source_artifact_id`, `raw_id`, `claim_id`, `entity_id`, `event_id`, and `tag_id`.

## Truth and evidence rules

- A Claim must quote an exact span of `RawDocument.body_clean`.
- A CanonicalEvent must reference at least one Claim and one SourceArtifact.
- `CanonicalEvent.display_title_zh` must be the exact `RawDocument.title_zh` associated with one of the event's sources, or the unchanged `title_original` when that source title is already Chinese. Event-field summaries and generated editorial headlines are not valid title fallbacks.
- CanonicalEvent eligibility requires source-bounded evidence that AI is the direct subject of the event. AI-themed publishers, feeds, discovery labels, queries, navigation text, and incidental page mentions do not qualify a record.
- Generic vertical-industry “智慧 / 大模型” publicity without an identifiable AI-industry actor, product identity, market action, or reusable technical release is routed to QA rather than normalized as a CanonicalEvent.
- Administrative support notices centered on 模型券、算力券、数据券、补贴申领或兑付平台 are routed to QA unless the source separately discloses a concrete AI product transaction, procurement contract, financing, or customer deployment event.
- Missing source fields remain empty and are listed under `missing_fields`; they are not inferred.
- Conflicting sources remain attached as conflicts. The data center does not select the more commercially useful version.
- FDE and hardware records are projections from accepted CanonicalEvents only.
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

## Compatibility

The public website uses the unified V4 frontstage. The legacy pipeline may continue producing internal Card, trend, graph, and opportunity objects for historical analytics, Obsidian sync, and downstream application adapters, but public pages cannot load V3 navigation, page assets, or the V3 desk JSON. Those compatibility objects cannot enter V4 tables. Historical files are not overwritten; mappings connect legacy Raw/Card identifiers to V4 events.

The daily data-center list uses bundle `data_date` as its grouping and filter date. Canonical `event_time` and `disclosed_at` retain the source-reported time and must not replace the daily batch date in default list selection. During dual-write, legacy factual Cards are a coverage comparison only; they are never promoted as V4 evidence.

Daily `legacy-asset-mappings.json` rows map legacy Raw snapshots to V4 RawDocuments and optional CanonicalEvents. The repository-level `legacy-card-event-mappings.json` is the separate Card-instance projection. It disambiguates duplicate legacy Card IDs and records whether each physical Markdown Card maps to one event, multiple events, Raw only, or remains unresolved. A legacy Markdown Card must never be treated as identical to a CanonicalEvent without this projection.
