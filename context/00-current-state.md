---
status: current
scope: project-state
last_updated: 2026-06-07
use_when:
  - large task startup
  - dispatch planning
  - state recovery
priority: current
---

# 00 Current State - WaveSight AI

WaveSight AI is now in V3.3.1 unified intelligence frontstage development.

## Current Positioning

- WaveSight AI is an Agent-driven AI business-intelligence system.
- The current public frontstage has two active columns: business signals and first-line viewpoints.
- The current backend entry is the operations dashboard.
- The production core is not a content website. It turns daily external information into persistent intelligence assets.
- The daily business-signal target is the 10 most important product / service, funding, and case signals, covering big companies, vertical industries, and emerging-company funding.
- V3.3.1 consolidates the frontstage version, formal tag taxonomy, business-signal release rules, and independent first-line viewpoint update route.

## Current Entries

| Entry | File | Role |
|---|---|---|
| Business Signals | `01-SiteV2/site/v3-data-observation.html` | Main V3.3 frontstage for daily Cards, relationship graph, and trend candidates |
| First-Line Viewpoints | `01-SiteV2/site/follow-builders.html` | Independent builders viewpoint page merged into V3.3 |
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

1. Run daily Raw / Pool monitoring.
2. Generate business-signal Cards.
3. Run dedupe, source-first, and regression checks.
4. Update business signals, first-line viewpoints, topic center, and operations dashboard data.
5. Open or update the automation PR.
6. Deploy after merge through GitHub Pages.
7. Sync merged assets to local Obsidian when the local machine is online.
