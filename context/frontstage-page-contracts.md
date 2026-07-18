---
status: current
scope: frontstage-page-contracts
last_updated: 2026-07-18
use_when:
  - page change
  - navigation change
  - copy change
  - data sync
  - release check
priority: current
---

# Frontstage Page Contracts

SITE-V4.2.0 is the only current public page and entity-history system. `data-center.html`, `intelligence-map.html`, `opportunity-map.html`, and all weekly/monthly report details use the V4 logo header and shared sidebar. Legacy V3 column URLs are compatibility redirects only. These page contracts do not define V4 canonical data truth.

Read `context/version-ledger.md` first. This file defines what each current frontstage page must keep and what must not contaminate it.

## Current Pages

| Page | Current Role | Must Keep | Must Not Contain | Gates |
|---|---|---|---|---|
| Data Center | `01-SiteV2/site/data-center.html` | Commercial Events, FDE, AI Hardware, Community Intelligence, First-Line Viewpoints, and Entity Index under one V4 shell | Importance/opportunity/recommendation fields in factual views; V3 Card page modules; V3 top navigation; backend gates or thresholds | syntax + V4 data tests + integrity gate + frontstage regression |
| Industry Reports | `01-SiteV2/site/intelligence-map.html` | V4 compact title and subtitle; latest Monthly / Weekly report entries; separate Monthly / Weekly archives; weekly reports sourced from `01-SiteV2/content/08-report/`; monthly reports sourced from `01-SiteV2/content/08-report/monthly/` | Opportunity-map matrices or evidence modal returning to the report landing page; retired `报告中心` / `Reports Center` naming; Relation Paths / 关联路径; retired V3 top navigation; separate sidebar entries for Weekly Report or Monthly Report; orphaned relationship demo navigation; V2 graph prose cards; detached page style; Trend Candidates / History blocks returning; weekly reports generated only from `agent-workflow/reports/`; monthly report detail pages reduced to summary-only cards or raw unstyled tables | syntax + visual smoke + frontstage regression |
| Opportunity Map | `01-SiteV2/site/opportunity-map.html` | Independent Application Center sidebar entry; source-backed Entry Point Map and Product Pain Map as separate full-width maps; existing state legend and map-cell style; map cells open evidence in a modal instead of a persistent right-side evidence panel; `industry-reports-frontstage.json` as the dedicated downstream application projection | Monthly / Weekly report cards; map toggle buttons replacing the two standalone maps; persistent right-side Cell Evidence panel; public V3 desk fetch; Relation Paths; Signal Candidates / 时间聚集 / Tag 聚合 modules | syntax + data projection + interaction smoke + desktop/mobile visual smoke + frontstage regression |
| Weekly / Monthly Details | `weekly-ai-business-change-radar*.html`, `monthly-business-structure*.html` | Complete accepted reports using the V4 logo header, shared sidebar, responsive editorial layouts, and Industry Reports return path | V3 topbar/assets/routes; raw Markdown dumps; detached report navigation; public V3 JSON fetches | syntax + content-source gate + desktop/mobile visual smoke + frontstage regression |
| Legacy Redirects | `v3-data-observation.html`, `follow-builders.html`, `community-intelligence.html`, `reports.html` | Canonical redirect to the matching V4 route while preserving query parameters and hash | Page content, V3 CSS/JS, V3 navigation, independent report-center content | redirect test + public dependency scan |
| Dashboard | `01-SiteV2/site/operations-console.html` | Data Observation operations governance backend; issue center; task chain; data quality; version governance; independent Skill Store; settings; generated ops data from daily supervision, Hermes inbox, production funnel, and version ledger | Accidental deletion; Skill Store deletion or merge into version governance; frontstage restyling that breaks operations UI; V2 public navigation takeover; content-production workspace modules returning to the operations backend | syntax + generated ops data build + manual smoke |

The legacy Business Signals Card set remains an internal compatibility dataset for downstream analytics and Opportunity Map projection. It is not a public V4 page and cannot define V4 facts.

## Current Frontstage Versions

| Scope | Version | Meaning |
|---|---|---|
| Main website | `SITE-V4.2.0-entity-history` | Keeps the unified V4 shell and adds stable entity profiles, cross-day timelines, typed factual relationships, and split frontstage data loading. |
| Business Signals compatibility lane | `BSIG-V2.2.0-pipeline-stage-ownership` | Internal Card/graph/trend compatibility data only; not a public page. |
| First-Line Viewpoints column | `FLV-V1.1.0-history-backfill` | Adds accepted committed morning history to the V4 projection while keeping current morning RSS and afternoon follow-builders production independent; original-URL dedupe, approved Chinese translation provenance, AI relevance, opinion tags, and Obsidian timeline idempotency remain release gates. |
| Community Intelligence column | `CINT-V1.0.2-publication-waiting-gate` | Keeps local logged-in collection separate from GitHub publication and treats open PR / queued workflow states after healthy same-date data as Waiting, not Problems. |
| Enterprise AI / FDE lens | `EAI-V1.2.0-raw-card-ingestion-boundary` | Boss-facing implementation lens backed by the independent FDE Lens Pool; title translation and fact extraction belong to Raw/Card/FDE asset generation, not generic frontstage blocking; not a fourth Card type. |
| Reports Center column | `REPORTS-V1.0.0-periodic-report-center` | Owns latest Monthly / Weekly reports, archives, accepted content sources, deterministic page rendering, and the monthly/weekly page-generator Skills. |
| Opportunity Map column | `OMAP-V1.0.0-independent-column` | Owns the dedicated application projection, two source-backed matrices, and click-to-open map-cell evidence. |

## Navigation

The approved SITE-V4.0 navigation has two sidebar groups:

- Data Center: Commercial Events, FDE, AI Hardware, Community Intelligence, First-Line Viewpoints, Entity Index.
- Application Center: Industry Reports, Opportunity Map.

Entity Index is the single list entrance for companies, organizations, models, products, services, people, AI technologies, use cases, and industries. Companies, products/models/services, and people open stable `EN-*` profiles; technology, use case, and industry open `TX-*` classification pages. It must appear after First-Line Viewpoints; Company and Product must not return as separate sidebar entries.

Entity pages show only source-backed histories and relationships. The frontstage must not render a global relationship graph, infer edges from Tag co-occurrence, or turn viewpoints into canonical business facts. List and detail payloads load from the split `data/data-center-v4/` service; the full compatibility payload remains a transition artifact, not the preferred page fetch.

`data-center.html`, `intelligence-map.html`, `opportunity-map.html`, and every weekly/monthly detail page must use `assets/data-center-v4.css`, the official logo header, and the same sidebar structure. Industry Reports and Opportunity Map are the two Application Center entries. Weekly and Monthly reports remain report content and must not return as separate sidebar entries. Relation Paths has been removed and must not return.

The retired `assets/wavesight-nav.css` and V3 page-specific CSS/JS files have been deleted and must not return. No public content page may load `data/v3-data-observation-desk.json`. The dashboard remains an operations backend page and is not exposed in frontstage navigation.

Commercial Events uses the TAG-V4 classification system. Its primary classification filter combines technical Tags with product form, application scenario, industry, deployment model, and target-user Facets, while the underlying data keeps those namespaces separate. List rows may show a compact subset, but event details must expose the complete evidence-backed classification groups. The page must not relabel event type, company, source, geography, importance, opportunity, or quality-gate state as a technical Tag.

First-Line Viewpoints is visually part of the same frontstage, but its data build is independent. Raw / Pool / Card failures in Business Signals must not block the builders page from refreshing or preserving its previous good data. The builders JSON may be persisted only after `assert-follow-builders-data.mjs` confirms freshness, minimum counts, original URLs, complete Chinese translations, formal tags, and fallback safety.

The V4 First-Line Viewpoints entry is `data-center.html?view=viewpoints`. It uses one public viewpoint feed, one people index, and one person timeline detail view. Its merged projection is `01-SiteV2/site/data/first-line-viewpoints-v4.json`, and accepted historical morning snapshots are materialized separately in `01-SiteV2/site/data/first-line-viewpoints-history.json`. The projection must preserve both production lanes: the morning RSS/X lane owns Chinese translation and public-page admission; the afternoon follow-builders Skill lane independently preserves discovery intake and Obsidian person/date timelines. Current, historical, and afternoon records deduplicate by original URL, but no source lane may replace or silently suppress another. Historical or afternoon-only intake may enter the public feed only after it independently satisfies approved Chinese translation provenance, original-source, formal-tag, and AI-relevance gates. When no verified portrait is present in source data, the page uses a neutral initials avatar and must not invent or scrape one during rendering.

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
