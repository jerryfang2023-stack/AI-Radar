---
status: current
scope: product-map
last_updated: 2026-08-09
use_when:
  - product planning
  - page or navigation decisions
  - data structure changes
priority: current
---

# 01 Product Map - Internal Data Foundation and Independent Applications

## Current Product Structure

| Module | Role | Status |
|---|---|---|
| Data Center Core | SourceArtifact, RawDocument, Claim, Entity, CanonicalEvent, QA and serving tables | Active product core |
| Event Database | Normalized factual events with status, evidence, conflicts and revisions | Active data layer |
| Entity Registry | Stable company/organization, product/model/service, and person IDs with aliases and verification state | Active data layer |
| Entity Profiles | Cross-day factual timelines and grouped event histories for stable entities | Active serving layer |
| FDE Database | Claim-native implementation observations aggregated into multi-source dossiers and lifecycle timelines | Active domain projection |
| AI Hardware Database | Claim-native hardware facts aggregated into dated product, capacity, supply and deployment snapshots | Active domain projection |
| Business Signals | Structured intake, accepted V4 commercial events, and downstream evidence projections | Active V4-native production |
| First-Line Viewpoints | Builders public viewpoints, translated and organized independently | Active frontstage |
| Relationship data | RELATION-V2 typed endpoints backed by event, Claim, and source references only | Active factual data layer |
| Targeted Backfill | BACKFILL-V1 recurring company/product sweeps and explicit funding/deployment fact-gap tasks | Active internal operations layer |
| Trend Radar | Accepted-event daily, weekly and monthly factual change projection with evidence links and coverage disclosure | Active downstream application; excluded from V4 core |
| Opportunity outputs | V4 evidence-backed downstream interpretation, excluded from V4 core | Internal lab; not public navigation |
| Guanlan Research | Periodic reports plus capital/funding and enterprise AI deployment research topics | Active downstream application hub |
| Dashboard | Production-chain, source traceability, data quality, version governance, Skill Store, and release status | Active backend |

## Current Product Boundary

```text
Internal foundation
|- Data Center / entity and event projections
|- Application Center / research projections
`- Operations dashboard
Public applications
`- Funding Insights
```

FDE, AI Hardware, entity relationships, Trend Radar, Guanlan Research, Opportunity Map, and the dashboard remain internal supporting surfaces. Funding Insights is an independent public application backed by the governed financing and investment-institution projections; it does not expose Data Center / Application Center as public columns.

## Asset Flow

```text
Daily monitor / BACKFILL-V1 targeted discovery
-> immutable original snapshot / SOURCE-INTAKE-V1
-> SourceArtifact
-> RawDocument
-> Claim / Entity
|-> CanonicalEvent -> Entity Registry / Entity Profiles / RELATION-V2
|-> FDEObservation -> implementation dossier / lifecycle
`-> HardwareFact -> dated snapshot -> factual change timeline
-> JSON / JSONL / DuckDB
-> Trend Radar / Guanlan Research
-> downstream AIP / insight / decision-support applications
```

First-line viewpoints are built by the independent builders lanes and displayed in `data-center.html?view=viewpoints`. They are not mixed into the factual event flow above.
Legacy page data remains isolated from the canonical flow. Page JSON cannot be used as a V4 source of truth.

## Asset Boundaries

- `01-SiteV2/content/01-raw/source-index.jsonl`: public body-free source metadata and `evidence://<content_hash>` locators.
- Configured private `WaveSight-private-evidence`: the only complete-original store; never published to the website or Vault.
- `01-SiteV2/content/11-databases/data-center-v4/intake-v1/`: structured SourceArtifact / RawDocument intake.
- `01-SiteV2/content/11-databases/data-center-v4/`: daily canonical V4 bundles.
- `01-SiteV2/content/11-databases/targeted-backfill-v1/`: internal backfill queue and immutable discovery-run records; never a factual source.
- `data-lake/tables/`: materialized V4 JSONL serving tables.
- `01-SiteV2/site/data/data-center-v4/`: split frontstage indexes, details, entity profiles, taxonomy nodes, and manifest.
- Historical V3 Cards, desk/graph, and mappings are absent from the working tree and recoverable only through an explicit Git ref.
- `01-SiteV2/site/data/follow-builders-daily.json`: first-line viewpoints data.
- `01-SiteV2/site/data/pipeline-dashboard.json`: operations dashboard data.

## Archived Compatibility Cards

Historical business-signal Cards used three types:

- `product_service`: products, services, platforms, models, tools, APIs, capability releases.
- `funding`: single-company funding events, especially emerging-company and SME funding.
- `case`: customer adoption, vertical-industry deployment, workflow change, and implementation cases.

These types are frozen history only. Current production does not generate Cards. V4 uses the CanonicalEvent enum in `data-center-v4.schema.json`.

## Relationship And Interpretation Boundaries

- Core relationships are factual links with event, claim, and source references.
- Formal entities are company/organization, product/model/service, and person. Technology, use case, and industry are classification nodes.
- Tag co-occurrence cannot create relationship direction or hypotheses.
- Trend, opportunity, value, advice, and recommendation logic belongs to downstream applications only.

## Retired Outputs

Legacy content-output routes, V2/V3 column pages, and old opinion sidebar logic are not current SITE-V4.4 public production goals.
