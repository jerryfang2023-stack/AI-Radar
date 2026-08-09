---
status: current
scope: frontstage-page-contracts
last_updated: 2026-08-09
use_when:
  - page change
  - navigation change
  - copy change
  - data sync
  - release check
priority: current
---

# Frontstage Page Contracts

Funding Insights is the independent public application website; ENTITY-V1.0 and RELATION-V2.1 remain internal factual entity-history contracts. Data Center and Application Center pages are supporting data/research surfaces rather than public columns. The site root is a redirect-only alias for Funding Insights and must not recreate a multi-column portal. Legacy V3 column URLs are redirects only. These page contracts do not define V4 canonical data truth.

Read `context/version-ledger.md` first. This file defines what each current frontstage page must keep and what must not contaminate it.

## Current Pages

| Page | Current Role | Must Keep | Must Not Contain | Gates |
|---|---|---|---|---|
| Public Root | `01-SiteV2/site/index.html` | Redirect directly to `funding-insights.html` | A total portal; Data Center / Application Center entrances; homepage metrics or projection data; parallel navigation or content | redirect test + desktop/mobile smoke |
| Data Center | `01-SiteV2/site/data-center.html` | Internal factual-data serving and review surface. Event, entity, investment-institution, FDE, hardware, and relationship projections remain available to internal workflows and downstream applications. | Public primary-column positioning; importance/opportunity/recommendation fields in factual views; V3 modules | syntax + V4 data tests + institution schema/evidence gate + integrity gate + regression |
| Trend Radar | `01-SiteV2/site/trend-radar.html` | Internal downstream factual-change projection with evidence lineage | Public primary-column positioning; canonical-data mutation; unsupported rankings or recommendations | projection gate + exact-count test + evidence-lineage test + interaction smoke + version consistency |
| Funding Insights | `01-SiteV2/site/funding-insights.html` | Independent public application website backed by governed financing and investment-institution projections. Every card exposes normalized and original round/amount, financing date, disclosure status, investor roles, cumulative amount basis, and stable historical rounds. | Data Center / Application Center raw-column navigation; free-text round variants; historical or round-ambiguous investors presented as current; duplicate company-round cards; silent evidence gaps; automatic mutation of V4 canonical entities or relationships | schema + amount normalization + current-investor separation + company-round/history aggregation + exact-quote evidence gate + automatic-publication test + frontstage regression |
| Guanlan Research | `01-SiteV2/site/intelligence-map.html` | Internal research surface for accepted periodic reports and topic projections | Public primary-column positioning; Funding Insights ownership; V3 navigation or graph modules | syntax + visual smoke + frontstage regression |
| Opportunity Map | `01-SiteV2/site/opportunity-map.html` | Unlisted internal lab route with `noindex,nofollow`; source-backed maps, human-reviewed Direction Cards, and evidence modals remain available for evaluation | A primary Application Center sidebar entry; Signal Card or V3 desk evidence; unreviewed model output; unsupported factual numbers; report cards; opaque scores; Relation Paths | syntax + V4 evidence gate + human-review boundary + data projection + interaction smoke + frontstage regression |
| Weekly / Monthly Details | `weekly-ai-business-change-radar*.html`, `monthly-business-structure*.html` | Complete accepted reports using the V4 logo header, focused shared sidebar, responsive editorial layouts, and Guanlan Research return path | V3 topbar/assets/routes; raw Markdown dumps; detached report navigation; public V3 JSON fetches | syntax + content-source gate + desktop/mobile visual smoke + frontstage regression |
| Legacy Redirects | `v3-data-observation.html`, `follow-builders.html`, `community-intelligence.html`, `reports.html`, `pipeline-dashboard.html` | Canonical redirect to the matching V4 route while preserving query parameters and hash | Page content, V3 CSS/JS, V3 navigation, independent report-center or V3 pipeline content | redirect test + public dependency scan |
| Dashboard | `01-SiteV2/site/operations-console.html` | Data Observation operations governance backend; issue center; task chain; data quality; version governance; independent Skill Store; settings; generated ops data from daily supervision, production incidents, legacy Hermes history, production funnel, and version ledger | Accidental deletion; Skill Store deletion or merge into version governance; frontstage restyling that breaks operations UI; V2 public navigation takeover; content-production workspace modules returning to the operations backend | syntax + generated ops data build + manual smoke |

The legacy Business Signals Card set and `compatibility_cards` projection are removed. No current page, projection, relationship, gate, operations task, schema, data-lake table, or Guanlan Vault projection may recreate or consume them.

Event Library, Entity Library, and Trend Radar expose the same evidence-backed China-market scope. The scope uses controlled factual bases and Claim/source references only; it must not add navigation entries, source weights, ranking bonuses, or procurement/tender records. Unmatched records omit the optional scope field.

## Current Frontstage Versions

| Scope | Version | Meaning |
|---|---|---|
| Main website | `SITE-V4.6.0-research-homepage` | Historical release identifier retained until the next coordinated version bump; the research homepage is retired and the root now redirects to the independent Funding Insights application. |
| Business Signals factual lane | `EVENT-V1.1` | SourceArtifact / RawDocument / Claim / CanonicalEvent production only; archived Cards and trend candidates are not daily inputs or public pages. |
| First-Line Viewpoints column | `FLV-V1.1.0-history-backfill` | Adds accepted committed morning history to the V4 projection while keeping current morning RSS and afternoon follow-builders production independent; original-URL dedupe, approved Chinese translation provenance, AI relevance, and opinion tags remain release gates. |
| Community Intelligence column | `CINT-V1.0.2-publication-waiting-gate` | Keeps local logged-in collection separate from GitHub publication and treats open PR / queued workflow states after healthy same-date data as Waiting, not Problems. |
| Enterprise AI / FDE lens | `EAI-V1.2.0-raw-card-ingestion-boundary` | Boss-facing implementation lens backed by the independent FDE Lens Pool; title translation and fact extraction belong to Raw/Card/FDE asset generation, not generic frontstage blocking; not a fourth Card type. |
| Guanlan Research column | `REPORTS-V1.2.0-research-hub` | Owns periodic reports and archives plus capital/funding and enterprise AI deployment topic entrances; its publication gate remains independent from Opportunity Map generation. |
| Opportunity Map column | `OMAP-V2.0.0-v4-evidence` | Owns the dedicated V4 evidence projection, two source-backed matrices, and human-reviewed Direction Cards with click-to-open Event, Claim, and Source evidence. |
| Trend Radar column | `TRADAR-V1.1.0-tag-v4-1` | Adds TAG-V4.1 classification distributions and China-market scope filtering to the accepted-event daily/weekly/monthly projection while preserving evidence links and factual-only boundaries. |
| Funding Insights column | `FUNDING-INSIGHT-V1.4.0-financing-fields` | Owns normalized funding rounds and amounts with source text retained, financing/disclosure dates and status, investor roles, reviewed company-and-round/history aggregation, cumulative amount basis, a CB Insights-aligned market hierarchy, structured investment theses, evidence-bounded application judgments, automatic fail-closed publication, and the `INVESTMENT-INSTITUTION-V1.0` evidence projection without mutating canonical facts. |
| Person review | `PERSON-REVIEW-V1.1` | Admits reviewed natural people from canonical events, First-Line Viewpoints, or the accepted funding-founder ledger. Funding-only profiles expose funding cards and exact source locators but cannot create `RELATION-V2.1`; quarantined accounts and unreviewed funding candidates remain outside the public person index. |

## Navigation

Funding Insights owns the public application navigation. Data Center and Application Center groupings are internal information architecture and must not appear as public columns.

Entity Library (`实体库`, internal contract name: Entity Index) is the single list entrance for companies, organizations, investment institutions, models, products, services, people, AI technologies, use cases, and industries. Investment institutions are an evidence-backed application projection with explicit subject types; they do not become canonical V4 entities automatically. Entity Library must appear after First-Line Viewpoints; Company, Product, and Investment Institution must not return as separate sidebar entries.

The root page is redirect-only and must not render metrics, research modules, or internal-column entrances. Public financing views may link to purpose-built application details, but must not expose raw Data Center / Application Center navigation.

Entity pages show only source-backed histories and relationships. The relationship deep route may remain for direct access, but it is not primary navigation. It may render only an entity-centered one-hop view whose edges resolve to accepted events, exact Claims, and source artifacts.

`data-center.html`, `trend-radar.html`, `funding-insights.html`, `intelligence-map.html`, `opportunity-map.html`, and every weekly/monthly detail page must use `assets/data-center-v4.css`, the official logo header, and the same six-entry sidebar. Funding Insights is subordinate to Guanlan Research. Opportunity Map is unlisted and `noindex,nofollow`. FDE, AI Hardware, relationships, funding, weekly reports, and monthly reports must not return as primary sidebar entries.

The retired `assets/wavesight-nav.css` and V3 page-specific CSS/JS files have been deleted and must not return. No public content page may load `data/v3-data-observation-desk.json`. The dashboard remains an operations backend page and is not exposed in frontstage navigation.

Event Library uses the TAG-V4 classification system. Its primary classification filter combines technical Tags with product form, application scenario, industry, deployment model, and target-user Facets, while the underlying data keeps those namespaces separate. List rows may show a compact subset, but event details must expose the complete evidence-backed classification groups. The page must not relabel event type, company, source, geography, importance, opportunity, or quality-gate state as a technical Tag.

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
