---
status: current
scope: project-state
last_updated: 2026-06-09
use_when:
  - large task startup
  - dispatch planning
  - state recovery
priority: current
---

# 00 Current State - WaveSight AI

WaveSight AI is now in V3.3.3 column-independent production development.

## Current Positioning

- WaveSight AI is an Agent-driven AI business-intelligence system.
- The current public frontstage has four active columns: business signals, intelligence map, first-line viewpoints, and community intelligence.
- The current backend entry is the operations dashboard.
- The production core is not a content website. It turns daily external information into persistent intelligence assets.
- The daily business-signal target is the 10 most important product / service, funding, and case signals, covering big companies, vertical industries, and emerging-company funding.
- V3.3.3 keeps the unified frontstage and upgrades daily production into independent column lanes with shared site-level publication.

## Current Entries

| Entry | File | Role |
|---|---|---|
| Business Signals | `01-SiteV2/site/v3-data-observation.html` | Main V3.3 frontstage for daily Cards, relationship graph, and trend candidates |
| Intelligence Map | `01-SiteV2/site/intelligence-map.html` | Relationship graph and intelligence map entry |
| First-Line Viewpoints | `01-SiteV2/site/follow-builders.html` | Independent builders viewpoint page merged into V3.3 |
| Community Intelligence | `01-SiteV2/site/community-intelligence.html` | Community-sourced cases, AI tool tactics, commercial opportunities, and document links |
| Dashboard | `01-SiteV2/site/operations-console.html` | Operations backend and production-chain dashboard |

## Current Data Chain

```text
External sources
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
-> GitHub PR / merge
-> GitHub Pages
-> local Obsidian sync
```

First-line viewpoints use the follow-builders / builders data route as an independent page. They are not evidence for business-signal Cards, the relationship graph, or trend candidates. Their daily data build must not be blocked by Raw / Pool / Card failures in the business-signal chain.

Community Intelligence uses the logged-in scys.com / aipoju.com collection route as a separate frontstage column. Its materials are community-sourced leads and must not be treated as business-signal facts unless separately verified and promoted into the Raw / Pool / Card chain.

## Paused / Retired

These are not current V3.3 required outputs or execution truth:

- daily observation;
- business brief / business internal reference;
- trend report;
- old homepage, old business-signal page, old trend page, old opinion sidebar;
- Guanlan frontstage copy-style gate;
- publiccopy / cardcopy publication blockers.

Old V2 pages are retired. If old rules conflict with V3.3, remove or rebuild them instead of preserving compatibility.

## Current Hard Rules

- Raw only collects external materials. Search tools are discovery entrances and must resolve to original sources.
- Pool must keep source URL, readable body or enough excerpt, summary, evidence excerpt, hash, QC result, and importance reasoning.
- Pool type does not equal Card type.
- Card titles prefer traceable original event titles, not abstract judgments.
- Missing frontstage fields must not fallback to backend fields.
- Business signals must cover big-company product actions, vertical-industry cases, and emerging-company funding. Big-company news must not dominate the whole day.
- Trend candidates cannot be generated from a single article, single viewpoint, or trend essay.
- Builders viewpoints are independent first-line viewpoints only.

## Current Automation Goal

1. Run Business Signals through its own Raw / Pool / Card / Top10 lane.
2. Run First-Line Viewpoints through its own builders data lane.
3. Run Community Intelligence through its local logged-in collection lane.
4. Keep Intelligence Map and Dashboard aligned with the Business Signals data chain.
5. Persist each producing lane through its own commit / PR boundary.
6. Publish the site only after merged changes reach `main` and GitHub Pages runs.
7. Sync merged assets to local Obsidian when the local machine is online.
