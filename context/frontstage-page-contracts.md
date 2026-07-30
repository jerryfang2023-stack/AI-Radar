---
status: current
scope: frontstage-page-contracts
last_updated: 2026-07-29
use_when:
  - page change
  - navigation change
  - copy change
  - data sync
  - release check
priority: current
---

# Frontstage Page Contracts

SITE-V4.3.0 is the only current public page system; ENTITY-V1.0 and RELATION-V2.1 remain its factual entity-history contracts. `data-center.html`, `trend-radar.html`, `funding-insights.html`, `intelligence-map.html`, `opportunity-map.html`, and current report routes use the V4 logo header and shared sidebar. Legacy V3 column URLs are redirects only. These page contracts do not define V4 canonical data truth.

Read `context/version-ledger.md` first. This file defines what each current frontstage page must keep and what must not contaminate it.

## Current Pages

| Page | Current Role | Must Keep | Must Not Contain | Gates |
|---|---|---|---|---|
| Data Center | `01-SiteV2/site/data-center.html` | Commercial Events, FDE, AI Hardware, Community Intelligence, First-Line Viewpoints, Industry Dossiers (`产业档案`), and the entity-centered one-hop Relationship Map (`关系图谱`) under one V4 shell; Commercial Events default to the latest daily batch; FDE presents implementation dossiers, lifecycle, and factual completeness; AI Hardware presents product/spec facts, capacity/supply state, and a snapshot-difference timeline | Importance/opportunity/recommendation fields in factual views; V3 Card page modules; V3 top navigation; backend gates or thresholds | syntax + V4 data tests + integrity gate + frontstage regression |
| Trend Radar | `01-SiteV2/site/trend-radar.html` | Independent Application Center entry; daily five-category accepted changes, weekly evidence-backed structure changes, monthly factual snapshots, observed-data-day coverage, and event/entity/source links | Report prose; opportunity/trend scores; heat, maturity, rankings or recommendations; First-Line Viewpoints, Community Intelligence, V3 Cards, trend candidates or opportunity signals as factual inputs; canonical-data mutation | projection gate + exact-count test + evidence-lineage test + interaction/visual smoke + version consistency |
| Funding Insights | `01-SiteV2/site/funding-insights.html` | Independent Application Center entry; verified daily funding events trigger evidence-backed research with normalized round labels, explicitly current-round investors, separated historical investors, company-round aggregation, structured investment thesis, customer research status, funding history, and governed entity links | Free-text round variants; historical or round-ambiguous investors presented as current; duplicate company-round cards; silent customer/entity-link gaps; model-only claims without captured-source exact quotes; automatic mutation of V4 canonical entities or relationships; cards that fail the deterministic auto-publication gate | 63-bundle schema + current-investor separation + company-round aggregation + entity-review queue + exact-quote evidence gate + automatic-publication test + frontstage regression + desktop/mobile visual smoke |
| Industry Reports | `01-SiteV2/site/intelligence-map.html` | V4 compact title and subtitle; latest Monthly / Weekly report entries; separate Monthly / Weekly archives; accepted reports sourced from `01-SiteV2/content/12-applications/industry-reports/` | Opportunity-map matrices or evidence modal returning to the report landing page; retired `报告中心` / `Reports Center` naming; Relation Paths / 关联路径; retired V3 top navigation; separate sidebar entries for Weekly Report or Monthly Report; orphaned relationship demo navigation; V2 graph prose cards; detached page style; Trend Candidates / History blocks returning; weekly reports generated only from `agent-workflow/reports/`; monthly report detail pages reduced to summary-only cards or raw unstyled tables | syntax + visual smoke + frontstage regression |
| Opportunity Map | `01-SiteV2/site/opportunity-map.html` | Independent Application Center sidebar entry; source-backed Entry Point Map and Product Pain Map as separate full-width maps; a small set of DeepSeek V4 Pro-drafted and human-reviewed Direction Cards with structural judgment and counter-signal; map cells and Direction Cards open evidence in a modal; `opportunity-evidence-v2.json` as the dedicated V4 downstream application projection | Signal Card or V3 desk evidence; unreviewed model output; unsupported factual numbers or promotional conclusions; Monthly / Weekly report cards; map toggle buttons replacing the two standalone maps; persistent right-side Cell Evidence panel; auto-generated recommendations or opaque scores; Relation Paths; Signal Candidates / 时间聚集 / Tag 聚合 modules | syntax + V4 Event/Claim/Source reference gate + DeepSeek candidate gate + human-review boundary + data projection + interaction smoke + desktop/mobile visual smoke + frontstage regression |
| Weekly / Monthly Details | `weekly-ai-business-change-radar*.html`, `monthly-business-structure*.html` | Complete accepted reports using the V4 logo header, shared sidebar, responsive editorial layouts, and Industry Reports return path | V3 topbar/assets/routes; raw Markdown dumps; detached report navigation; public V3 JSON fetches | syntax + content-source gate + desktop/mobile visual smoke + frontstage regression |
| Legacy Redirects | `v3-data-observation.html`, `follow-builders.html`, `community-intelligence.html`, `reports.html`, `pipeline-dashboard.html` | Canonical redirect to the matching V4 route while preserving query parameters and hash | Page content, V3 CSS/JS, V3 navigation, independent report-center or V3 pipeline content | redirect test + public dependency scan |
| Dashboard | `01-SiteV2/site/operations-console.html` | Data Observation operations governance backend; issue center; task chain; data quality; version governance; independent Skill Store; settings; generated ops data from daily supervision, production incidents, legacy Hermes history, production funnel, and version ledger | Accidental deletion; Skill Store deletion or merge into version governance; frontstage restyling that breaks operations UI; V2 public navigation takeover; content-production workspace modules returning to the operations backend | syntax + generated ops data build + manual smoke |

The legacy Business Signals Card set and `compatibility_cards` projection are removed. No current page, projection, relationship, gate, operations task, schema, data-lake table, or Guanlan Vault projection may recreate or consume them.

## Current Frontstage Versions

| Scope | Version | Meaning |
|---|---|---|
| Main website | `SITE-V4.3.0-compatibility-retired` | Keeps the unified V4 shell and stable entity history after removing V3 compatibility interfaces, payloads, producers, and public pipeline surfaces. |
| Business Signals factual lane | `EVENT-V1.1` | SourceArtifact / RawDocument / Claim / CanonicalEvent production only; archived Cards and trend candidates are not daily inputs or public pages. |
| First-Line Viewpoints column | `FLV-V1.1.0-history-backfill` | Adds accepted committed morning history to the V4 projection while keeping current morning RSS and afternoon follow-builders production independent; original-URL dedupe, approved Chinese translation provenance, AI relevance, and opinion tags remain release gates. |
| Community Intelligence column | `CINT-V1.0.2-publication-waiting-gate` | Keeps local logged-in collection separate from GitHub publication and treats open PR / queued workflow states after healthy same-date data as Waiting, not Problems. |
| Enterprise AI / FDE lens | `EAI-V1.2.0-raw-card-ingestion-boundary` | Boss-facing implementation lens backed by the independent FDE Lens Pool; title translation and fact extraction belong to Raw/Card/FDE asset generation, not generic frontstage blocking; not a fourth Card type. |
| Reports Center column | `REPORTS-V1.1.0-lane-independent` | Owns latest Monthly / Weekly reports, archives, accepted content sources, deterministic page rendering, and the monthly/weekly page-generator Skills; its publication gate is independent from Opportunity Map generation. |
| Opportunity Map column | `OMAP-V2.0.0-v4-evidence` | Owns the dedicated V4 evidence projection, two source-backed matrices, and human-reviewed Direction Cards with click-to-open Event, Claim, and Source evidence. |
| Trend Radar column | `TRADAR-V1.0.0-factual-change-explorer` | Owns the accepted-event daily/weekly/monthly change projection, period controls, coverage disclosure, and evidence links without report prose or judgment. |
| Funding Insights column | `FUNDING-INSIGHT-V1.1.0-card-integrity` | Owns normalized funding rounds, current-round investor separation, company-and-round aggregation, structured investment theses, explicit customer research status, evidence-bounded application judgments, automatic fail-closed publication, and governed entity-review candidates without mutating canonical facts. |
| Person-account review | `PERSON-REVIEW-V1.0` | Admits only reviewed natural people to the Entity Index while preserving viewpoints from quarantined non-natural accounts without a person entity link. |

## Navigation

The approved SITE-V4.0 navigation has two sidebar groups:

- Data Center: Commercial Events, FDE, AI Hardware, Community Intelligence, First-Line Viewpoints, Industry Dossiers, Relationship Map.
- Application Center: Trend Radar, Funding Insights, Opportunity Map, Industry Reports.

Industry Dossiers (`产业档案`, internal contract name: Entity Index) is the single list entrance for companies, organizations, models, products, services, people, AI technologies, use cases, and industries. Companies, products/models/services, and people open stable `EN-*` profiles; technology, use case, and industry open `TX-*` classification pages. It must appear after First-Line Viewpoints; Company and Product must not return as separate sidebar entries.

Entity pages show only source-backed histories and relationships. Relationship Map (`关系图谱`) may render only an entity-centered one-hop view whose edges resolve to accepted events, exact Claims, and source artifacts. The frontstage must not render an unbounded global relationship graph, infer edges from Tag co-occurrence, or turn viewpoints into canonical business facts. List and detail payloads load from the split `data/data-center-v4/` service.

`data-center.html`, `trend-radar.html`, `funding-insights.html`, `intelligence-map.html`, `opportunity-map.html`, and every weekly/monthly detail page must use `assets/data-center-v4.css`, the official logo header, and the same sidebar structure. Trend Radar, Funding Insights, Opportunity Map and Industry Reports are the four Application Center entries. Weekly and Monthly reports remain report content and must not return as separate sidebar entries. Relation Paths has been removed and must not return.

The retired `assets/wavesight-nav.css` and V3 page-specific CSS/JS files have been deleted and must not return. No public content page may load `data/v3-data-observation-desk.json`. The dashboard remains an operations backend page and is not exposed in frontstage navigation.

Commercial Events uses the TAG-V4 classification system. Its primary classification filter combines technical Tags with product form, application scenario, industry, deployment model, and target-user Facets, while the underlying data keeps those namespaces separate. List rows may show a compact subset, but event details must expose the complete evidence-backed classification groups. The page must not relabel event type, company, source, geography, importance, opportunity, or quality-gate state as a technical Tag.

First-Line Viewpoints is visually part of the same frontstage, but its data build is independent. V4 factual-lane failures must not block the builders page from refreshing or preserving its previous good data. The builders JSON may be persisted only after `assert-follow-builders-data.mjs` confirms freshness, minimum counts, original URLs, complete Chinese translations, formal tags, and fallback safety.

The V4 First-Line Viewpoints entry is `data-center.html?view=viewpoints`. It uses one public viewpoint feed, one people index, and one person timeline detail view. Its merged projection is `01-SiteV2/site/data/first-line-viewpoints-v4.json`, and accepted historical morning snapshots are materialized separately in `01-SiteV2/site/data/first-line-viewpoints-history.json`. The projection must preserve both production lanes: the morning RSS/X lane owns Chinese translation and public-page admission; the afternoon follow-builders Skill lane independently preserves discovery intake. Current, historical, and afternoon records deduplicate by original URL, but no source lane may replace or silently suppress another. Historical or afternoon-only intake may enter the public feed only after it independently satisfies approved Chinese translation provenance, original-source, formal-tag, and AI-relevance gates. Deduplicated person timelines are a one-way local projection into the external Guanlan AI Vault after accepted data reaches `main`; they are not a publication gate. When no verified portrait is present in source data, the page uses a neutral initials avatar and must not invent or scrape one during rendering.

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
