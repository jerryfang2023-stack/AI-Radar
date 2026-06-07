---
status: current
scope: frontstage-page-contracts
last_updated: 2026-06-07
use_when:
  - page change
  - navigation change
  - copy change
  - data sync
  - release check
priority: current
---

# Frontstage Page Contracts

Read `context/version-ledger.md` first. This file defines what each current frontstage page must keep and what must not contaminate it.

## Current Pages

| Page | Current Role | Must Keep | Must Not Contain | Gates |
|---|---|---|---|---|
| Business Signals | `01-SiteV2/site/v3-data-observation.html` | V3.3 main business-signal desk; date selection; product / funding / case Cards; visual relationship graph; trend candidates; source-first details | V2 homepage modules; daily observation; business brief; trend-report prose; follow-builders evidence; backend fields such as Raw / Pool / threshold / gate in frontstage copy | syntax + source-first gate + frontstage regression |
| First-Line Viewpoints | `01-SiteV2/site/follow-builders.html` | Builders page merged from GitHub; public builders viewpoints; Chinese translation; person / title / timeline style where available; same global nav height as business signals | Business-signal Card generation; relationship-graph evidence; trend-candidate evidence; V2 opinion sidebar logic | syntax + builders data build + builders data gate + frontstage regression |
| Dashboard | `01-SiteV2/site/operations-console.html` | Existing operations backend; production chain, source quality, topic center, content factory, release status | Accidental deletion; frontstage restyling that breaks operations UI; V2 public navigation takeover | syntax + manual smoke |

## Unified Navigation

The business-signal and first-line viewpoint pages must share the same global navigation:

- business signals: `v3-data-observation.html`
- first-line viewpoints: `follow-builders.html`
- dashboard: `operations-console.html#dashboard`

The two public pages must use `assets/wavesight-nav.css` and keep the same topbar structure and height.

First-Line Viewpoints is visually part of the same frontstage, but its data build is independent. Raw / Pool / Card failures in Business Signals must not block the builders page from refreshing or preserving its previous good data. The builders JSON may be persisted only after `assert-follow-builders-data.mjs` confirms freshness, minimum counts, original URLs, formal tags, and fallback safety.

## Change Types

| Type | Meaning | Required Checks |
|---|---|---|
| Patch | Small fix without structure change | syntax + regression |
| Page Change | Layout, module, or visual structure change | syntax + visual smoke + regression |
| Data Change | Field, data sync, generation rule, or automation change | syntax + source-first + regression |
| Release Change | Version, GitHub Action, deployment, or sync loop change | syntax + release checklist + regression |

## Freeze Rule

When a page is accepted, record the freeze point in `context/version-ledger.md` with:

- page name;
- accepted date;
- version;
- content that must not return;
- gates passed;
- Git commit or tag that can be rolled back to.
