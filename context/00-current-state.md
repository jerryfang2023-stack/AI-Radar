---
status: current
scope: project-state
last_updated: 2026-06-30
use_when:
  - large task startup
  - dispatch planning
  - state recovery
priority: current
---

# 00 Current State - WaveSight AI

WaveSight AI is now in SITE-V3.4.2 Business Signals Quality Boundary Release.

## Current Positioning

- WaveSight AI is an Agent-driven AI business-intelligence system.
- The current public frontstage has four active columns: business signals, report center, first-line viewpoints, and community intelligence.
- The current backend entry is the operations dashboard.
- The production core is not a content website. It turns daily external information into persistent intelligence assets.
- The daily business-signal frontstage presents all qualified Raw / Pool business signals that pass raw-to-card cardability and can become Cards, sorted by importance / impact from high to low. Pool remains a backend audit index and repair surface, not a required manual selection layer.
- SITE-V3.4.2 keeps the unified frontstage and Reports Center opportunity system, and hardens Business Signals quality boundaries for raw-to-card cardability and public Card release.
- Current column versions: Business Signals `BSIG-V1.2.1-quality-boundary`, First-Line Viewpoints `FLV-V1.0.2-supervision-idempotency`, Community Intelligence `CINT-V1.0.2-publication-waiting-gate`, Reports Center `IMAP-V2.0.0-report-center-opportunity-system`.
- Current tag taxonomy version: `TAG-V1.1.0-v34-layered-taxonomy`.

## Current Entries

| Entry | File | Role |
|---|---|---|
| Business Signals | `01-SiteV2/site/v3-data-observation.html` | Main V3.3 frontstage for daily Cards, relationship graph, trend candidates, and the 企业AI化 secondary lens |
| Reports Center | `01-SiteV2/site/intelligence-map.html` | Monthly / weekly report entry, source-backed Entry Point Map and Product Pain Map, and relation paths |
| First-Line Viewpoints | `01-SiteV2/site/follow-builders.html` | Independent builders viewpoint page merged into V3.3 |
| Community Intelligence | `01-SiteV2/site/community-intelligence.html` | Community-sourced cases, AI tool tactics, commercial opportunities, and document links |
| Dashboard | `01-SiteV2/site/operations-console.html` | Operations backend and production-chain dashboard |

## Current Data Chain

```text
External sources
-> source artifacts
-> Raw candidates
-> Pool evidence
-> signal_card assets
   - product_service
   - funding
   - case
-> knowledge base
-> relationship graph
-> trend candidates
-> V3.3 frontstage + operations data
-> local DuckDB data-lake index
-> GitHub PR / merge
-> GitHub Pages
-> local Obsidian sync
```

First-line viewpoints use the follow-builders / builders data route as an independent page. They are not evidence for business-signal Cards, the relationship graph, or trend candidates. Their daily data build must not be blocked by Raw / Pool / Card failures in the business-signal chain.

Community Intelligence uses the logged-in scys.com / aipoju.com collection route as a separate frontstage column. Its materials are community-sourced leads and must not be treated as business-signal facts unless separately verified and promoted into the Raw / Pool / Card chain.

## Paused / Retired

Legacy content-output routes, old page modules, and legacy copy gates are not current SITE-V3.4.0 required outputs or execution truth.

Old V2 pages are retired. If old rules conflict with SITE-V3.4.0, remove or rebuild them instead of preserving compatibility.

## Current Hard Rules

- Raw only collects external materials. Search tools are discovery entrances and must resolve to original sources.
- Pool must keep source URL, readable body or enough excerpt, summary, evidence excerpt, hash, QC result, and importance reasoning.
- Pool type does not equal Card type.
- Card titles prefer traceable original event titles, not abstract judgments.
- Missing frontstage fields must not fallback to backend fields.
- Business signals must cover big-company product actions, vertical-industry cases, and emerging-company funding. Big-company news must not dominate the whole day.
- Trend candidates cannot be generated from a single article, single viewpoint, or trend essay.
- Builders viewpoints are independent first-line viewpoints only.
- `data-lake/wavesight.duckdb` is a local generated analytical index, not a source of truth. Rebuild it from Git-tracked Raw / Pool / Card / site data and keep generated tables / database files out of Git.

## Current Automation Goal

1. Run Business Signals through its own Raw / Pool / Card lane.
2. Run First-Line Viewpoints through its own builders data lane.
3. Run Community Intelligence through its local logged-in collection lane and independent GitHub publish PR lane.
4. Keep Reports Center and Dashboard aligned with the Business Signals data chain.
   - Reports Center opportunity maps update weekly from source-backed `opportunity_signals`, not old `formal_tags`.
   - Weekly report content must be sourced from `01-SiteV2/content/08-report/`; monthly report content must be sourced from `01-SiteV2/content/08-report/monthly/`.
5. Persist each producing lane through its own commit / PR boundary.
6. Publish the site only after merged changes reach `main` and GitHub Pages runs.
7. Sync merged assets to local Obsidian when the local machine is online.
8. Regenerate the local DuckDB data-lake index through the local `WaveSight Data Lake Sync` scheduled task after daily monitoring output is available; use it for cross-day statistics, contamination audits, source linkage checks, and column-level production diagnostics.
