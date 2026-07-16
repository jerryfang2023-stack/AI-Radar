---
status: current
scope: product-map
last_updated: 2026-07-16
use_when:
  - product planning
  - page or navigation decisions
  - data structure changes
priority: current
---

# 01 Product Map - SITE-V4.0 Data Center

## Current Product Structure

| Module | Role | Status |
|---|---|---|
| Data Center Core | SourceArtifact, RawDocument, Claim, Entity, CanonicalEvent, QA and serving tables | Active product core |
| Event Database | Normalized factual events with status, evidence, conflicts and revisions | Active data layer |
| FDE Database | Source-bounded enterprise implementation projections | Active domain projection |
| AI Hardware Database | Source-bounded hardware product, capacity, supply and deployment projections | Active domain projection |
| Business Signals | V3 Cards plus separate hardware/FDE lenses | Frozen compatibility frontstage |
| First-Line Viewpoints | Builders public viewpoints, translated and organized independently | Active frontstage |
| Relationship data | Source-backed event/claim/entity links only | Active factual data layer |
| Trend / opportunity outputs | Downstream interpretation, excluded from V4 core | Legacy page compatibility |
| Dashboard | Production-chain, source traceability, data quality, version governance, Skill Store, and release status | Active backend |

## Current Navigation

```text
Business Signals
First-Line Viewpoints
Dashboard
```

Navigation and page information architecture are frozen pending a separate approved page plan.

## Asset Flow

```text
Monitor / Search / Source discovery
-> SourceArtifact
-> RawDocument
-> Claim / Entity
-> CanonicalEvent
-> FDE / Hardware projection
-> JSON / JSONL / DuckDB
-> downstream AIP / insight / decision-support applications
-> frozen V3 page compatibility outputs
```

First-line viewpoints are built by the builders route and displayed in `follow-builders.html`. They are not mixed into the asset flow above.
Legacy page data remains isolated from the canonical flow. Page JSON cannot be used as a V4 source of truth.

## Asset Boundaries

- `01-SiteV2/content/01-raw/`: daily Raw candidates and original materials.
- `01-SiteV2/content/11-databases/data-center-v4/`: daily canonical V4 bundles.
- `data-lake/tables/`: materialized V4 and legacy JSONL serving tables.
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

## Frontstage Release Conditions

A Card can enter the frontstage only when it has:

- original source URL;
- readable full text or enough source excerpt;
- original title or traceable event title;
- source-based news fact, original key points, concise value description, and visible source excerpt;
- no backend-field fallback;
- no follow-builders or opinion material.

## Relationship And Interpretation Boundaries

- Core relationships are factual links with event, claim, and source references.
- Tag co-occurrence cannot create relationship direction or hypotheses.
- Trend, opportunity, value, advice, and recommendation logic belongs to downstream applications and legacy page compatibility only.

## Retired Outputs

Legacy content-output routes, old four-column V2 website pages, and old opinion sidebar logic are not current SITE-V3.4.5 production goals.
