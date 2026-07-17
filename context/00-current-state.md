---
status: current
scope: project-state
last_updated: 2026-07-17
use_when:
  - large task startup
  - dispatch planning
  - state recovery
priority: current
---

# 00 Current State - WaveSight AI

WaveSight AI is now on the `SITE-V4.1.0-unified-frontstage` public website baseline.

## Current Positioning

- WaveSight AI is an AI industry data center and structured factual data foundation for downstream AIP, industry research, and startup decision-support products.
- The data center does not make decisions, judge commercial value, recommend actions, or educate readers toward a conclusion.
- The public frontstage uses the V4 Data Center / Application Center shell. V3 page routes are redirects only.
- The current backend entry is the operations dashboard.
- The production core turns external sources into SourceArtifacts, RawDocuments, Claims, Entities, CanonicalEvents, domain projections, and queryable exports.
- Pool is an operational QA queue. Card, trend, opportunity, and report objects are internal compatibility or downstream application assets, not V4 truth assets.
- Current column versions: First-Line Viewpoints `FLV-V1.0.2-supervision-idempotency`, Community Intelligence `CINT-V1.0.2-publication-waiting-gate`, Industry Reports `IMAP-V2.1.0-v4-unified-frontstage`.
- Current data versions: `RAW-V3.0`, `EVENT-V1.0`, `FDE-V2.0`, `HARDWARE-V1.0`, `TAG-V4.0`.

## Current Entries

| Entry | File | Role |
|---|---|---|
| Data Center | `01-SiteV2/site/data-center.html` | V4 public data layer for Commercial Events, FDE, AI hardware, community intelligence, first-line viewpoints, and a shared company/product Entity Index |
| Industry Reports | `01-SiteV2/site/intelligence-map.html` | V4 application-center entry with the shared sidebar; retains Monthly / Weekly reports and source-backed Entry Point Map and Product Pain Map |
| First-Line Viewpoints | `01-SiteV2/site/data-center.html?view=viewpoints` | Independent builders viewpoint feed, people index, and person timeline |
| Community Intelligence | `01-SiteV2/site/data-center.html?view=community` | Community-sourced cases, AI tool tactics, commercial opportunities, and document links |
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
-> downstream application projections, including Industry Reports
-> GitHub PR / merge
-> GitHub Pages
-> local Obsidian sync
```

First-line viewpoints use two independent builders monitoring lanes: the morning RSS/X lane produces translated, gated public remarks, while the afternoon follow-builders Skill lane preserves separate discovery intake and syncs person/date timelines to Obsidian. V4 merges both lanes by original URL into `01-SiteV2/site/data/first-line-viewpoints-v4.json`; afternoon-only intake remains in the data layer until it passes the same Chinese, source, formal-tag, and AI-relevance gates. Viewpoints are not evidence for business-signal Cards, the relationship graph, or trend candidates. Their daily data build must not be blocked by Raw / Pool / Card failures in the business-signal chain.

Community Intelligence uses the logged-in scys.com / aipoju.com collection route as a separate frontstage column. Its materials are community-sourced leads and must not be treated as business-signal facts unless separately verified and promoted into the Raw / Pool / Card chain.

## Paused / Retired

The V3 column pages and old Reports page are retired as content surfaces and remain only as redirects into V4.

Old V2 and V3 public page rules are retired. If they conflict with SITE-V4.1.0, remove or rebuild them.

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
4. Keep Industry Reports as a downstream V4 application and Dashboard as an independent backend; do not write their judgments into V4 canonical data.
   - Industry Reports opportunity maps update weekly from source-backed `opportunity_signals`, not old `formal_tags`.
   - Weekly report content must be sourced from `01-SiteV2/content/08-report/`; monthly report content must be sourced from `01-SiteV2/content/08-report/monthly/`.
5. Persist each producing lane through its own commit / PR boundary.
6. Publish the site only after merged changes reach `main` and GitHub Pages runs.
7. Sync merged assets to local Obsidian when the local machine is online.
8. Materialize V4 JSONL tables in GitHub and rebuild DuckDB locally for queries, cross-day statistics, contamination audits, and source-linkage checks.
