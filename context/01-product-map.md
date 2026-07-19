---
status: current
scope: product-map
last_updated: 2026-07-17
use_when:
  - product planning
  - page or navigation decisions
  - data structure changes
priority: current
---

# 01 Product Map - SITE-V4.2 Entity History

## Current Product Structure

| Module | Role | Status |
|---|---|---|
| Data Center Core | SourceArtifact, RawDocument, Claim, Entity, CanonicalEvent, QA and serving tables | Active product core |
| Event Database | Normalized factual events with status, evidence, conflicts and revisions | Active data layer |
| Entity Registry | Stable company/organization, product/model/service, and person IDs with aliases and verification state | Active data layer |
| Entity Profiles | Cross-day factual timelines and grouped event histories for stable entities | Active serving layer |
| FDE Database | Source-bounded enterprise implementation projections | Active domain projection |
| AI Hardware Database | Source-bounded hardware product, capacity, supply and deployment projections | Active domain projection |
| Business Signals | V3 Raw / Pool / Card / graph / trend-candidate chain | Internal compatibility data only; no public page |
| First-Line Viewpoints | Builders public viewpoints, translated and organized independently | Active frontstage |
| Relationship data | RELATION-V2 typed endpoints backed by event, Claim, and source references only | Active factual data layer |
| Targeted Backfill | BACKFILL-V1 recurring company/product sweeps and explicit funding/deployment fact-gap tasks | Active internal operations layer |
| Trend Radar | Accepted-event daily, weekly and monthly factual change projection with evidence links and coverage disclosure | Active downstream application; excluded from V4 core |
| Opportunity outputs | Downstream interpretation, excluded from V4 core | Active downstream application / legacy compatibility inputs |
| Dashboard | Production-chain, source traceability, data quality, version governance, Skill Store, and release status | Active backend |

## Current Navigation

```text
Data Center
|- Commercial Events
|- First-Line Viewpoints
|- Community Intelligence
`- Entity Index
Application Center
|- Trend Radar
|- Industry Reports
`- Opportunity Map
```

The V4 Data Center and Industry Reports sidebar in `context/frontstage-page-contracts.md` is the only current public navigation contract. Dashboard remains an operations backend and is not part of public navigation.

## Asset Flow

```text
Daily monitor / BACKFILL-V1 targeted discovery
-> SourceArtifact
-> RawDocument
-> Claim / Entity
-> CanonicalEvent
-> Entity Registry / Entity Profiles / RELATION-V2
-> FDE / Hardware projection
-> JSON / JSONL / DuckDB
-> Trend Radar factual change projection / downstream AIP / insight / decision-support applications
-> frozen V3 page compatibility outputs
```

First-line viewpoints are built by the independent builders lanes and displayed in `data-center.html?view=viewpoints`. They are not mixed into the factual event flow above.
Legacy page data remains isolated from the canonical flow. Page JSON cannot be used as a V4 source of truth.

## Asset Boundaries

- `01-SiteV2/content/01-raw/`: daily Raw candidates and original materials.
- `01-SiteV2/content/11-databases/data-center-v4/`: daily canonical V4 bundles.
- `01-SiteV2/content/11-databases/targeted-backfill-v1/`: internal backfill queue and immutable discovery-run records; never a factual source.
- `data-lake/tables/`: materialized V4 and legacy JSONL serving tables.
- `01-SiteV2/site/data/data-center-v4/`: split frontstage indexes, details, entity profiles, taxonomy nodes, and manifest.
- `01-SiteV2/content/02-pool/`: screened evidence pool.
- `01-SiteV2/content/04-business-signals/`: daily business-signal indexes.
- `01-SiteV2/knowledge/01-Signal-Cards/`: persistent formal Card assets.
- `01-SiteV2/knowledge/03-Asset-Candidates/`: relationship and trend-candidate assets.
- `01-SiteV2/site/data/follow-builders-daily.json`: first-line viewpoints data.
- `01-SiteV2/site/data/pipeline-dashboard.json`: operations dashboard data.

## Compatibility Card Types

Business-signal Cards only use three types:

- `product_service`: products, services, platforms, models, tools, APIs, capability releases.
- `funding`: single-company funding events, especially emerging-company and SME funding.
- `case`: customer adoption, vertical-industry deployment, workflow change, and implementation cases.

These types remain for frozen pages only. V4 uses the CanonicalEvent enum in `data-center-v4.schema.json`.

## Compatibility Card Generation Conditions

A Card can enter internal compatibility outputs only when it has:

- original source URL;
- readable full text or enough source excerpt;
- original title or traceable event title;
- source-based news fact, original key points, concise value description, and visible source excerpt;
- no backend-field fallback;
- no follow-builders or opinion material.

## Relationship And Interpretation Boundaries

- Core relationships are factual links with event, claim, and source references.
- Formal entities are company/organization, product/model/service, and person. Technology, use case, and industry are classification nodes.
- Tag co-occurrence cannot create relationship direction or hypotheses.
- Trend, opportunity, value, advice, and recommendation logic belongs to downstream applications and legacy page compatibility only.

## Retired Outputs

Legacy content-output routes, V2/V3 column pages, and old opinion sidebar logic are not current SITE-V4.2 public production goals.
