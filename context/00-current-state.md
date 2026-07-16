---
status: current
scope: project-state
last_updated: 2026-07-16
use_when:
  - large task startup
  - dispatch planning
  - state recovery
priority: current
---

# 00 Current State - WaveSight AI

WaveSight AI is now in `SITE-V4.0-data-center` dual-write migration.

## Current Positioning

- WaveSight AI is an AI industry data center and structured factual data foundation for downstream AIP, industry research, and startup decision-support products.
- The data center does not make decisions, judge commercial value, recommend actions, or educate readers toward a conclusion.
- The current public frontstage remains frozen on SITE-V3.4.5 during the V4 dual-write period.
- The current backend entry is the operations dashboard.
- The production core turns external sources into SourceArtifacts, RawDocuments, Claims, Entities, CanonicalEvents, domain projections, and queryable exports.
- Pool is an operational QA queue. Card, trend, opportunity, and report objects are legacy page compatibility outputs, not V4 truth assets.
- Current column versions: Business Signals `BSIG-V2.2.0-pipeline-stage-ownership`, Enterprise AI / FDE `EAI-V1.2.0-raw-card-ingestion-boundary`, First-Line Viewpoints `FLV-V1.0.2-supervision-idempotency`, Community Intelligence `CINT-V1.0.2-publication-waiting-gate`, Industry Reports `IMAP-V2.0.0-report-center-opportunity-system`.
- Current data versions: `RAW-V3.0`, `EVENT-V1.0`, `FDE-V2.0`, `HARDWARE-V1.0`, `TAG-V4.0`.

## Current Entries

| Entry | File | Role |
|---|---|---|
| Data Center | `01-SiteV2/site/data-center.html` | SITE-V4.0 internal data layer for Commercial Events, FDE, AI hardware, community intelligence, first-line viewpoints, and a shared company/product Entity Index |
| Business Signals | `01-SiteV2/site/v3-data-observation.html` | SITE-V3.4.5 main public page for unified daily Cards, independent AI Hardware lens, relationship graph, trend candidates, and the Enterprise AI / FDE secondary lens |
| Industry Reports | `01-SiteV2/site/intelligence-map.html` | V4 application-center entry with the shared sidebar; retains Monthly / Weekly reports and source-backed Entry Point Map and Product Pain Map |
| First-Line Viewpoints | `01-SiteV2/site/follow-builders.html` | Independent builders viewpoint page in the unified SITE-V3.4.5 frontstage |
| Community Intelligence | `01-SiteV2/site/community-intelligence.html` | Community-sourced cases, AI tool tactics, commercial opportunities, and document links |
| Dashboard | `01-SiteV2/site/operations-console.html` | Operations backend and production-chain dashboard |

## Current Data Chain

```text
External sources
-> SourceArtifact
-> RawDocument
-> Claim / Entity
-> CanonicalEvent
-> FDE / Hardware projections
-> JSON / JSONL / DuckDB data service
-> downstream applications
-> V3 Card / trend / page compatibility rendering
-> GitHub PR / merge
-> GitHub Pages
-> local Obsidian sync
```

First-line viewpoints use two independent builders monitoring lanes: the morning RSS/X lane produces translated, gated public remarks, while the afternoon follow-builders Skill lane preserves separate discovery intake and syncs person/date timelines to Obsidian. V4 merges both lanes by original URL into `01-SiteV2/site/data/first-line-viewpoints-v4.json`; afternoon-only intake remains in the data layer until it passes the same Chinese, source, formal-tag, and AI-relevance gates. Viewpoints are not evidence for business-signal Cards, the relationship graph, or trend candidates. Their daily data build must not be blocked by Raw / Pool / Card failures in the business-signal chain.

Community Intelligence uses the logged-in scys.com / aipoju.com collection route as a separate frontstage column. Its materials are community-sourced leads and must not be treated as business-signal facts unless separately verified and promoted into the Raw / Pool / Card chain.

## Paused / Retired

Legacy content-output routes, old page modules, and legacy copy gates are not current SITE-V3.4.5 required outputs or execution truth.

Old V2 pages are retired. If old rules conflict with SITE-V3.4.5, remove or rebuild them instead of preserving compatibility.

## Current Hard Rules

- Raw only collects external materials. Search tools are discovery entrances and accepted facts must resolve to original sources.
- Claims require exact RawDocument source spans. Events require Claim and SourceArtifact references.
- Pool is QA state; Card is compatibility rendering. Neither is a V4 fact layer.
- Missing and conflicting fields remain explicit; no source-bounded field may be invented.
- Technical Tags and structured Facets require Claim evidence and do not rank or admit events. Product form, use case, industry, deployment model, and target user remain Facets rather than technical Tags.
- Missing frontstage fields must not fallback to backend fields.
- V4 canonical outputs cannot contain importance, value, opportunity, pain, trend maturity, recommendation, advice, or interview-priority fields.
- Builders viewpoints are independent first-line viewpoints only.
- Git-tracked daily V4 bundles are the canonical normalized dataset. DuckDB and JSONL are rebuildable serving tables.

## Current Automation Goal

1. Run source capture and the V4 Raw / Claim / Event integrity chain.
2. Run First-Line Viewpoints through its own builders data lane.
3. Run Community Intelligence through its local logged-in collection lane and independent GitHub publish PR lane.
4. Keep existing Industry Reports and Dashboard running as frozen page compatibility consumers; do not write their judgments into V4.
   - Industry Reports opportunity maps update weekly from source-backed `opportunity_signals`, not old `formal_tags`.
   - Weekly report content must be sourced from `01-SiteV2/content/08-report/`; monthly report content must be sourced from `01-SiteV2/content/08-report/monthly/`.
5. Persist each producing lane through its own commit / PR boundary.
6. Publish the site only after merged changes reach `main` and GitHub Pages runs.
7. Sync merged assets to local Obsidian when the local machine is online.
8. Materialize V4 JSONL tables in GitHub and rebuild DuckDB locally for queries, cross-day statistics, contamination audits, and source-linkage checks.
