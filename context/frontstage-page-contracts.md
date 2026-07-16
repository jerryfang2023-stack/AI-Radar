---
status: current
scope: frontstage-page-contracts
last_updated: 2026-07-16
use_when:
  - page change
  - navigation change
  - copy change
  - data sync
  - release check
priority: current
---

# Frontstage Page Contracts

SITE-V3.4.5 compatibility pages remain frozen during the SITE-V4.0 data-center migration except for the separately approved V4 navigation migration. The approved migration covers `data-center.html` and `intelligence-map.html`: both use the V4 logo header and sidebar, and the application center exposes Industry Reports as its single entry. These page contracts do not define V4 canonical data truth.

Read `context/version-ledger.md` first. This file defines what each current frontstage page must keep and what must not contaminate it.

## Current Pages

| Page | Current Role | Must Keep | Must Not Contain | Gates |
|---|---|---|---|---|
| Business Signals | `01-SiteV2/site/v3-data-observation.html` | SITE-V3.4.5 main business-signal desk; date selection; unified product / funding / case Cards; separate AI Hardware lens; Enterprise AI / FDE secondary lens; visual relationship graph; trend candidates; source-first details | V2 homepage modules; legacy content-output prose; follow-builders evidence; backend fields such as Raw / Pool / threshold / gate in frontstage copy | syntax + source-first gate + frontstage regression |
| Industry Reports | `01-SiteV2/site/intelligence-map.html` | V4 compact title and subtitle; Industry Reports as the sole application-center entry; Monthly / Weekly report entry; source-backed Entry Point Map and Product Pain Map as separate full-width opportunity maps; map cells open evidence in a modal instead of a persistent right-side evidence panel; weekly reports sourced from `01-SiteV2/content/08-report/`; monthly reports sourced from `01-SiteV2/content/08-report/monthly/` | Retired `报告中心` / `Reports Center` naming; Relation Paths / 关联路径; retired V3 top navigation; separate sidebar entries for Opportunity Map, Weekly Report, or Monthly Report; orphaned relationship demo navigation; V2 graph prose cards; detached page style; Trend Candidates / History blocks returning; Signal Candidates / 时间聚集 / Tag 聚合 modules returning; map toggle buttons replacing the two standalone maps; persistent right-side Cell Evidence panel returning; weekly reports generated only from `agent-workflow/reports/`; monthly report detail pages reduced to summary-only cards or raw unstyled tables | syntax + visual smoke + frontstage regression |
| First-Line Viewpoints | `01-SiteV2/site/follow-builders.html` | Builders page merged from GitHub; public builders viewpoints; Chinese translation; person / title / timeline style where available; same global nav height as business signals | Business-signal Card generation; relationship-graph evidence; trend-candidate evidence; V2 opinion sidebar logic | syntax + builders data build + builders data gate + frontstage regression |
| Community Intelligence | `01-SiteV2/site/community-intelligence.html` | Community Intelligence V1.0; logged-in community cases, AI tool tactics, commercial opportunities, document links; deduped and value-sorted; local Obsidian archive route | Raw duplicate keyword hits; internal scoring/diagnostic fields exposed as card content; community posts treated as verified business-signal facts without promotion | syntax + collector syntax + archive syntax + visual smoke + frontstage regression |
| Dashboard | `01-SiteV2/site/operations-console.html` | Data Observation operations governance backend; issue center; task chain; data quality; version governance; independent Skill Store; settings; generated ops data from daily supervision, Hermes inbox, production funnel, and version ledger | Accidental deletion; Skill Store deletion or merge into version governance; frontstage restyling that breaks operations UI; V2 public navigation takeover; content-production workspace modules returning to the operations backend | syntax + generated ops data build + manual smoke |

Business Signals must present one unified Card view for the active date. Every qualified Raw / Pool business signal that passes raw-to-card cardability and can become a Card should be rendered as a frontstage Card, sorted by importance / impact from high to low. The page must not split the public experience into Top10 versus candidate-pool modes, and it must not show sorting reasons as visible copy. Pool remains a backend audit index and repair surface, not a required public selection layer. The Enterprise AI / FDE lens remains a secondary lens backed by the independent FDE Lens Pool and does not introduce a fourth Card type.

## Current Frontstage Versions

| Scope | Version | Meaning |
|---|---|---|
| Main website | `SITE-V3.4.5` | Current release baseline; keeps Industry Reports / Opportunity System, unified Business Signal Cards, the upgraded Enterprise AI / FDE ingestion boundary, the separate AI Hardware observation lens, and the V3-only Business Signals release gate. |
| Business Signals column | `BSIG-V2.2.0-pipeline-stage-ownership` | Presents all qualified Raw / Pool business signals that pass raw-to-card cardability as Cards in one importance-sorted view, keeps Enterprise AI / FDE as a secondary lens, adds `aiHardwareSignals` as a separate lens-only module, treats Raw-channel/provider diagnostics as non-blocking when Pool/Card supply is sufficient, and keeps Card eligibility channel-neutral by judging original-source evidence. |
| First-Line Viewpoints column | `FLV-V1.0.2-supervision-idempotency` | Keeps morning RSS page-data production and afternoon follow-builders skill publication independent, with Obsidian person/date timeline sync idempotency and publication closure checks. |
| Community Intelligence column | `CINT-V1.0.2-publication-waiting-gate` | Keeps local logged-in collection separate from GitHub publication and treats open PR / queued workflow states after healthy same-date data as Waiting, not Problems. |
| Enterprise AI / FDE lens | `EAI-V1.2.0-raw-card-ingestion-boundary` | Boss-facing implementation lens backed by the independent FDE Lens Pool; title translation and fact extraction belong to Raw/Card/FDE asset generation, not generic frontstage blocking; not a fourth Card type. |
| Industry Reports column | `IMAP-V2.0.0-report-center-opportunity-system` | Hosts Monthly / Weekly reports, renders source-backed Entry Point Map and Product Pain Map as separate full-width maps from `opportunity_signals`, and opens cell evidence in a modal. |

## Navigation

The approved SITE-V4.0 navigation has two sidebar groups:

- Data Center: Commercial Events, FDE, AI Hardware, Community Intelligence, First-Line Viewpoints, Entity Index.
- Application Center: Industry Reports.

Entity Index is the single list entrance for companies, organizations, models, products, and services. It must appear after First-Line Viewpoints; Company and Product must not return as separate sidebar entries. Company and product detail records remain independent and are opened from the shared index.

`data-center.html` and `intelligence-map.html` must use `assets/data-center-v4.css`, the official logo header, and the same sidebar structure. Weekly reports, monthly reports, and opportunity maps remain inside Industry Reports and must not return as separate application-center sidebar entries. Relation Paths has been removed and must not return.

The remaining SITE-V3.4.5 compatibility pages retain `assets/wavesight-nav.css` until they are separately migrated. The dashboard remains an operations backend page and is not exposed in frontstage navigation.

Commercial Events uses the TAG-V4 classification system. Its primary classification filter combines technical Tags with product form, application scenario, industry, deployment model, and target-user Facets, while the underlying data keeps those namespaces separate. List rows may show a compact subset, but event details must expose the complete evidence-backed classification groups. The page must not relabel event type, company, source, geography, importance, opportunity, or quality-gate state as a technical Tag.

First-Line Viewpoints is visually part of the same frontstage, but its data build is independent. Raw / Pool / Card failures in Business Signals must not block the builders page from refreshing or preserving its previous good data. The builders JSON may be persisted only after `assert-follow-builders-data.mjs` confirms freshness, minimum counts, original URLs, complete Chinese translations, formal tags, and fallback safety.

The V4 First-Line Viewpoints entry is `data-center.html?view=viewpoints`. It uses one public viewpoint feed, one people index, and one person timeline detail view. Its merged projection is `01-SiteV2/site/data/first-line-viewpoints-v4.json`, and it must preserve both production lanes: the morning RSS/X lane owns Chinese translation and public-page admission; the afternoon follow-builders Skill lane independently preserves discovery intake and Obsidian person/date timelines. The two lanes deduplicate by original URL, but neither may replace or silently suppress the other. Afternoon-only intake may enter the public feed only after it independently satisfies the Chinese translation, original-source, formal-tag, and AI-relevance gates. When no verified portrait is present in source data, the page uses a neutral initials avatar and must not invent or scrape one during rendering.

The morning lane may validate and publish while the afternoon lane is temporarily absent; its relaxed V4 assertion records zero afternoon intake instead of blocking the morning page. The afternoon publisher and the full V4 acceptance gate must require a matching afternoon file, date, and declared item count before reporting the dual-lane projection as complete.

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
