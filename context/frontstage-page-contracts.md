---
status: current
scope: frontstage-page-contracts
last_updated: 2026-06-08
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
| Intelligence Map | `01-SiteV2/site/intelligence-map.html` | Relationship graph and intelligence-map entry; weekly report subcolumn below the relationship network; weekly reports sourced from `01-SiteV2/content/08-report/`; same topbar as other frontstage pages | Orphaned relationship demo navigation; V2 graph prose cards; detached page style; Trend Candidates / History blocks returning to Intelligence Map; weekly reports generated only from `agent-workflow/reports/` | syntax + visual smoke + frontstage regression |
| First-Line Viewpoints | `01-SiteV2/site/follow-builders.html` | Builders page merged from GitHub; public builders viewpoints; Chinese translation; person / title / timeline style where available; same global nav height as business signals | Business-signal Card generation; relationship-graph evidence; trend-candidate evidence; V2 opinion sidebar logic | syntax + builders data build + builders data gate + frontstage regression |
| Community Intelligence | `01-SiteV2/site/community-intelligence.html` | Community Intelligence V1.0; logged-in community cases, AI tool tactics, commercial opportunities, document links; deduped and value-sorted; local Obsidian archive route | Raw duplicate keyword hits; internal scoring/diagnostic fields exposed as card content; community posts treated as verified business-signal facts without promotion | syntax + collector syntax + archive syntax + visual smoke + frontstage regression |
| Dashboard | `01-SiteV2/site/operations-console.html` | Existing operations backend; production chain, source quality, topic center, content factory, release status | Accidental deletion; frontstage restyling that breaks operations UI; V2 public navigation takeover | syntax + manual smoke |

Business Signals must keep the daily Top10 as the default primary view. It may provide a secondary "All Core Pool" view for the same date, sorted by importance, but that secondary view must not replace the editorial Top10 entry.

## Unified Navigation

The business-signal and first-line viewpoint pages must share the same global navigation:

- business signals: `v3-data-observation.html`
- intelligence map: `intelligence-map.html`
- first-line viewpoints: `follow-builders.html`
- community intelligence: `community-intelligence.html`

The dashboard remains an operations backend page, but it is not exposed in the public frontstage navigation while the product is in this public-column review phase. The public frontstage pages must use `assets/wavesight-nav.css`, keep the same topbar structure and height, and align the four public column links to the right.

First-Line Viewpoints is visually part of the same frontstage, but its data build is independent. Raw / Pool / Card failures in Business Signals must not block the builders page from refreshing or preserving its previous good data. The builders JSON may be persisted only after `assert-follow-builders-data.mjs` confirms freshness, minimum counts, original URLs, complete Chinese translations, formal tags, and fallback safety.

First-Line Viewpoints must show Chinese as the primary visible viewpoint text. Original English may be retained only in the detail view or source link for traceability. A remark with missing Chinese translation, untranslated English copied into `translation`, or `translationStatus` other than `translated` must not enter frontstage data.

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
