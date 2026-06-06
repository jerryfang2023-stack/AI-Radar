---
status: current
scope: product-map
last_updated: 2026-06-06
use_when:
  - product planning
  - page or navigation decisions
  - data structure changes
priority: current
---

# 01 Product Map - V3.3

## Current Product Structure

| Module | Role | Status |
|---|---|---|
| Business Signals | Daily product / service, funding, and case Cards | Active frontstage |
| First-Line Viewpoints | Builders public viewpoints, translated and organized independently | Active frontstage |
| Relationship Graph | Visual graph built from accepted business-signal Cards | Active analysis layer |
| Trend Candidates | Potential trend patterns based on multiple same-direction business signals | Active analysis layer |
| Dashboard | Production-chain, source quality, topic center, and release status | Active backend |

## Current Navigation

```text
Business Signals
First-Line Viewpoints
Dashboard
```

Business Signals and First-Line Viewpoints must share the same global topbar structure and height. Dashboard links to the existing operations backend and is not redesigned as a public content page.

## Asset Flow

```text
Monitor / Search / Source discovery
-> Raw candidate
-> Pool evidence
-> signal_card
   - product_service
   - funding
   - case
-> knowledge base
-> relationship graph
-> trend candidate
-> V3.3 frontstage / operations data
```

First-line viewpoints are built by the builders route and displayed in `follow-builders.html`. They are not mixed into the asset flow above.

## Asset Boundaries

- `01-SiteV2/content/01-raw/`: daily Raw candidates and original materials.
- `01-SiteV2/content/02-pool/`: screened evidence pool.
- `01-SiteV2/content/04-business-signals/`: daily business-signal indexes.
- `01-SiteV2/knowledge/01-Signal-Cards/`: persistent formal Card assets.
- `01-SiteV2/knowledge/03-Asset-Candidates/`: relationship and trend-candidate assets.
- `01-SiteV2/site/data/follow-builders-daily.json`: first-line viewpoints data.
- `01-SiteV2/site/data/pipeline-dashboard.json`: operations dashboard data.

## Current Card Types

Business-signal Cards only use three types:

- `product_service`: products, services, platforms, models, tools, APIs, capability releases.
- `funding`: single-company funding events, especially emerging-company and SME funding.
- `case`: customer adoption, vertical-industry deployment, workflow change, and implementation cases.

Pool type is not Card type. Card type must be judged again from source facts.

## Frontstage Release Conditions

A Card can enter the frontstage only when it has:

- original source URL;
- readable full text or enough source excerpt;
- original title or traceable event title;
- source-based news fact, original key points, concise value description, and visible source excerpt;
- no backend-field fallback;
- no follow-builders or opinion material.

## Relationship And Trend Boundaries

- The relationship graph only shows traceable subjects, scenes, actions, and commercial variables between accepted business-signal Cards.
- The relationship graph should be visual and compact, not long prose.
- Trend candidates must come from multiple same-direction Cards, multiple sources, and clear commercial variables.
- Trend candidates explain what the trend is, where it appears, and what the evidence boundary is. They do not provide advice or direction.

## Retired Outputs

The following are not current V3.3 production goals:

- daily observation;
- trend report;
- business brief / internal reference;
- old four-column V2 website pages;
- opinion sidebar mixed into business signals.
