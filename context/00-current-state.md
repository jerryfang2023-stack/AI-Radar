---
status: current
scope: project-state
last_updated: 2026-09-03
use_when:
  - large task startup
  - dispatch planning
  - state recovery
priority: current
---

# 00 Current State - WaveSight AI

WaveSight AI is on the `V4.8.1-research-retirement` repository release. Compatibility routes use `SITE-V4.6.1-research-retirement`; the existing V4 data-service baseline is unchanged.

The Data Center now has an independent Git baseline: `GUANLAN-DATA-CENTER-V4.8.1-internal-foundation` / `data-center-v4.8.1-internal-foundation`. Funding Insights keeps its separate `FUNDING-INSIGHT-V1.5.0-china-market` application version and release line.

## Current Positioning

- WaveSight AI is an AI industry data center and structured factual data foundation for downstream AIP, industry research, and startup decision-support products.
- The data center does not make decisions, judge commercial value, recommend actions, or educate readers toward a conclusion.
- Funding Insights is the independent public application website. The Data Center / Application Center shell is an internal supporting surface and is not public navigation.
- The current backend is OPS-V3.6.0-community-lifecycle at `https://www.zkdlj.vip/ops/`: one authenticated operations entry for the Data Center, Funding Portal, Mini Program, financing H5 and community membership. The login uses an allowlisted email challenge and an HttpOnly, SameSite=Strict VPS session. Membership & Entitlements owns separate persistent navigation for community application review, community-member lifecycle, Mini Program user operations and activity scheduling; each loads only its protected data when opened. GitHub Pages excludes the console and its operational assets.
- Membership operations reuses the whole-console session and has no separate login. Community application review separates approval from actual group entry and returns to the complete list after a decision. Community Member Management owns cohort, entry, elimination and verified Mini Program-account indicators; Mini Program Member Management retains audited entitlement/available-point adjustments; Activity Scheduling keeps the completed first season read-only and manages second-season sessions. Raw WeChat identities, account deletion, merging and order mutation remain unavailable. Community/application aggregates fail independently, and source counts or points must not be added across systems.
- The production core turns external sources into SourceArtifacts, RawDocuments, Claims, Entities, CanonicalEvents, domain projections, and queryable exports.
- The current collection lane writes ephemeral source snapshots, copies complete bodies into the authoritative private evidence store, converts public V4 records to `evidence://<content_hash>` locators, and then removes the ephemeral public copies. `SOURCE-INTAKE-V1` remains the structured handoff.
- Current column versions: First-Line Viewpoints `FLV-V1.1.0-history-backfill`, Community Intelligence `CINT-V1.0.2-publication-waiting-gate`, Trend Radar `TRADAR-V1.1.0-tag-v4-1`, Funding Insights `FUNDING-INSIGHT-V1.5.0-china-market`, financing portal `FUNDING-PORTAL-V2.8.4`, report publication `REPORTS-V1.3.0-funding-portal`, Opportunity Map `OMAP-V2.0.0-v4-evidence`.
- China-market coverage runs inside the existing commercial-event intake and scheduler. It distinguishes registered source types without source weights, excludes procurement/tender lanes, and writes evidence-backed `market_scope` only when an accepted Raw/Event match has an explicit controlled basis. China AI hardware financing and vertical-agent financing use dedicated localized search paths with separate query limits; these paths improve discovery coverage but never add ranking bonuses.
- Current person review contract: `PERSON-REVIEW-V1.1`; the original 37 person/account candidates remain fully reviewed (31 natural people public, 6 non-natural accounts quarantined), and 30 additional funding founders are public only after explicit source-backed review. The remaining funding person candidates stay outside the public Entity Index.
- Current data versions: `SOURCE-INTAKE-V1.1`, `RAW-V4.0`, `EVENT-V1.1`, `ENTITY-V1.0`, `RELATION-V2.1`, `BACKFILL-V1.0`, `FDE-V2.0`, `FDE-OBSERVATION-V1.0`, `HARDWARE-V1.0`, `HARDWARE-FACT-V1.0`, `HARDWARE-SNAPSHOT-V1.0`, `LENS-FUNNEL-V1.0`, `TAG-V4.1`.
- Current local knowledge-base version: `GUANLAN-VAULT-V1.2-private-evidence-linked`. The Guanlan AI Vault is physically independent from the repository and stores citation cards and traceable links only.
- Current data-lake contract: `DATA-LAKE-V4.1-24-table`; JSONL and DuckDB must expose exactly the same 24-table V4 allowlist, including reviewed event classifications.
- Current private evidence store: `PRIVATE-EVIDENCE-STORE-V2.0`; it is the sole complete-original store, deduplicates bodies by `content_hash`, and is physically outside the public repository and Vault. Public V4 data, the Vault, and the website never retain complete bodies.
- Current Funding Insights inventory: 288 public financing-event cards checked through 2026-09-03, including 34 China-market cards; the latest qualifying financing disclosure is dated 2026-09-02. The 2026-09-03 bundle publishes four evidence-complete cards: 上海以太之心科技有限公司（数千万人民币种子轮）、小鹏机器人业务（9 亿美元战略融资）、HiddenLayer（1 亿美元）和 Wonderful（5.5 亿美元 C 轮），并去重一条重复披露。The projection exposes original and normalized amount, round, financing date, disclosure status, investor roles, cumulative basis, and stable history. It builds 1,353 evidence-backed investor subjects; unresolved product/person names remain in the evidence-backed entity review queue. The PC portal and Mini Program live contract must publish the same 288-card inventory.
- Current Data Center frontstage inventory: 2,614 events, 219 companies, 343 products, 61 people, 1,353 investors, 370 relationships, 137 FDE records, and 96 hardware records through 2026-09-03.
- The 2026-09-03 daily bundle contains 45 canonical events; accepted-event entity coverage is 100%, and relationship, trend, opportunity, FDE, hardware, and funding projections pass their release gates. The release chain asserts current-date projection coverage in both the persistent-asset path and GitHub Pages before deployment. Collection retained two non-blocking diagnostics after recovery: one TLDR RSS HTTP 429 and one procurement fallback query with no usable result.
- Current private-evidence inventory is owned by the latest private-evidence gate rather than a copied count in this state document.
- Current Windows automation contract: seven tasks. Final Closure owns data-lake refresh; Hermes watchdog and heartbeat publication run as one control-plane task. Missed scheduled morning, recovery, and closure phases that start after their useful window write an observable `superseded` report, while manual recovery and final closure remain executable. The watchdog allows a short report grace period during Task Scheduler catch-up.

## Current Entries

| Entry | File | Role |
|---|---|---|
| Public Root | `01-SiteV2/site/index.html` | Redirect-only entry into the independent Funding Insights application; it must not render a Data Center / Application Center portal |
| AI Financing Site | `https://www.zkdlj.vip/` | Independent public application backed by evidence-linked financing data and the canonical weekly/monthly report archive |
| Data Center | `01-SiteV2/site/data-center.html` | Internal factual-data serving and review surface, including the investment-institution projection |
| Trend Radar | `01-SiteV2/site/trend-radar.html` | Internal downstream factual-change projection |
| Application Analytics | `https://www.zkdlj.vip/ops/#analytics` | Authenticated operations view for Mini Program and PC aggregate analytics; old application-analytics route redirects here |
| Retired Guanlan Research | `01-SiteV2/site/intelligence-map.html` | Compatibility redirect to `https://www.zkdlj.vip/#reports` |
| Opportunity Map | `01-SiteV2/site/opportunity-map.html` | Unlisted `noindex,nofollow` internal lab route retained for evidence-backed map experiments |
| First-Line Viewpoints | `01-SiteV2/site/data-center.html?view=viewpoints` | Independent builders viewpoint feed, people index, and person timeline |
| Community Intelligence | `01-SiteV2/site/data-center.html?view=community` | Community-sourced cases, AI tool tactics, commercial opportunities, and document links |
| Dashboard | `https://www.zkdlj.vip/ops/` | VPS-authenticated platform overview, analytics, source quality, categorized versions, cross-platform Skill Store and integration/local settings; issue/task UI retired, records retained |

## Current Data Chain

```text
External sources
-> SourceArtifact
-> RawDocument
-> Claim / Entity
-> CanonicalEvent
-> ENTITY-V1.0 registry / profiles / RELATION-V2.1
-> event-backed FDERecord / HardwareRecord publication projections
-> Claim-native FDEObservation / HardwareFact and HardwareSnapshot
-> JSON / JSONL / DuckDB data service
-> downstream applications
-> downstream application projections, including Trend Radar, financing cards, and reports
-> GitHub PR / merge
-> GitHub Pages
-> local Guanlan AI Vault refresh
```

First-line viewpoints use two independent builders monitoring lanes: the morning RSS/X lane produces translated, gated public remarks, while the afternoon follow-builders Skill lane preserves separate discovery intake. Accepted historical morning snapshots are materialized in `01-SiteV2/site/data/first-line-viewpoints-history.json`; V4 merges current and historical morning data plus the afternoon lane by original URL into `01-SiteV2/site/data/first-line-viewpoints-v4.json`. The external Guanlan AI Vault projects a deduplicated person timeline after local `main` sync. Historical or afternoon-only intake remains outside the public feed until it passes the same approved-Chinese-translation provenance, source, formal-tag, and AI-relevance gates. Viewpoints are not evidence for Claims, CanonicalEvents, or RELATION-V2.1. Their daily data build is independent from the commercial-event chain.

Community Intelligence uses the logged-in scys.com / aipoju.com collection route as a separate frontstage column. Its materials are community-sourced leads and must not be treated as facts unless the original source is separately captured, exact-span Claims are accepted, and the responsible V4 event gate passes.

## Paused / Retired

The V3 column pages, Guanlan Research, old Funding Insights page, and duplicate report HTML are retired as content surfaces. Report Markdown remains the source of truth; compatibility routes redirect to the AI financing site.

Old V2 and V3 public page rules are retired. If they conflict with SITE-V4.4.0, remove or rebuild them.

## Current Hard Rules

- Raw only collects external materials. Search tools are discovery entrances and accepted facts must resolve to original sources.
- Claims require exact RawDocument source spans. Events require Claim and SourceArtifact references.
- Pool/Card files and compatibility payloads are absent from the working tree; Git history is the only explicit recovery route.
- Missing and conflicting fields remain explicit; no source-bounded field may be invented.
- Technical Tags and structured Facets require Claim evidence and do not rank or admit events. Product form, use case, industry, deployment model, and target user remain Facets rather than technical Tags.
- Missing frontstage fields must not fallback to backend fields.
- V4 canonical outputs cannot contain importance, value, opportunity, pain, trend maturity, recommendation, advice, or interview-priority fields.
- Builders viewpoints are independent first-line viewpoints only.
- Git-tracked daily V4 bundles are the canonical normalized dataset. DuckDB and JSONL are rebuildable serving tables.
- Current and future V4 bundles persist source-backed `product_candidate` entities; the public Entity Index reads those persisted entities and does not infer products with a frontstage whitelist.
- Companies, products/models/services, and people use stable `EN-*` IDs. Technology, use case, and industry remain TAG-V4 taxonomy nodes with `TX-*` IDs rather than factual entities.
- RELATION-V2.1 permits only typed endpoints backed by an accepted event, Claim references, and SourceArtifact references. It adds evidence-bounded `joins`, `leaves`, and `founds` person-to-organization relations; Tag co-occurrence still cannot create a relationship.
- `npm run backfill:entity-history` reprojects all accepted canonical history and records explicit source-coverage gaps; it must never invent missing historical events.
- `npm run build:targeted-backfill` maintains the cross-day company, product, funding-detail, and deployment-case discovery queue. Its queries and candidates are operational metadata, not facts; only original-source capture and exact-span Claims may repair the canonical gap.
- Historical bundles without product entities remain unchanged. `npm run backfill:data-center` rebuilds the full canonical bundle and must not be used for a product-only migration; historical product migration requires a dedicated, dry-run-validated projection migrator.

## Current Automation Goal

1. Run source capture and the V4 Raw / Claim / Event integrity chain.
2. Run First-Line Viewpoints through its own builders data lane.
3. Run Community Intelligence through its local logged-in collection lane and independent GitHub publish PR lane.
4. Keep Trend Radar as the internal Application Center entry and Dashboard as the backend. Publish financing cards and accepted weekly/monthly reports to the independent AI financing site; Opportunity Map remains an internal lab. Do not write derived structures or judgments into V4 canonical data.
   - Trend Radar rebuilds after the V4 frontstage bundle, uses accepted `dataDate` facts only, exposes collection coverage, and links every structure back to events, entities, Claims, SourceArtifacts, and original sources.
   - Funding Insights runs after verified, completed funding events. Daily collection may automatically admit source-backed financing disclosed within the preceding three calendar months; older financing stays in QA unless an explicit targeted-backfill instruction enables it. Targeted source capture can merge accepted records directly into the existing same-date `SOURCE-INTAKE-V1.1` bundle while retaining extraction diagnostics, China-market scope fields, and private-evidence locators. Before DeepSeek research, generation deduplicates against all persisted Funding Insight event IDs and canonical company-plus-normalized-round keys, excluding its own current output from historical deduplication. Every reused or generated card must cite its canonical V4 event source; canonical amount, date, and round override contradictory same-name search results. Secondary source capture and DeepSeek V4 Pro may enrich the application card, but every company, financing, investor, product, customer, comparison, and metric fact must quote a captured source exactly. `FUNDING-INSIGHT-V1.3` preserves amount and total-raised source text beside deterministic currency/base-value normalization, records financing date and disclosure status, separates current-round investors and roles from historical/ambiguous investors, aggregates repeated company-and-confident-round disclosures, and records structured investment-thesis, customer-research status, one primary product form, and reviewed market taxonomy on every new card. The `FUNDING-INSIGHT-V1.5.0-china-market` public projection adds stable historical-round rows, a cumulative-amount basis, and evidence-derived global/China market scope. Planned and partial transactions remain in the Data Center and cannot publish as financing cards. Named investor evidence also produces the separate `INVESTMENT-INSTITUTION-V1.0` Entity Library projection; it includes institutional, corporate, government, and individual investor subjects with explicit type labels and never mutates canonical `ENTITY-V1.0` or `RELATION-V2.1`. Primary product form is selected from what customers buy or users directly use; reviewed historical decisions override the legacy keyword fallback. Missing current-round investors block the card unless captured evidence confirms the financing while disclosing investors only by generic category; that bounded exception requires an empty investor list, `investor_disclosure_status=not_disclosed`, and the `investors_missing` risk marker, and the generic category must never become an institution. Exact entity matches link immediately; unresolved products and founders enter an evidence-backed review queue, and unreviewed company/product candidates stay outside the public Entity Index. `PERSON-REVIEW-V1.1` may admit a manually reviewed founder profile with funding-card and source locators, but application evidence never creates a canonical event or `RELATION-V2.1`.
   - Opportunity Map updates from `opportunity-evidence-v2.json`, generated only from accepted V4 CanonicalEvents, Claims, SourceArtifacts, Entities, and FacetAssertions, and publishes under `OMAP-V2.0.0-v4-evidence`; downstream application assertions bind accepted Claims and never enter V4 canonical tables. DeepSeek V4 Pro writes evidence-bounded Direction Card candidates, but only human-reviewed candidates may enter the public direction configuration.
   - Weekly/monthly report generation remains lane-independent under `REPORTS-V1.3.0-funding-portal`: Opportunity Map or direction-candidate failure is a warning and cannot block report content acceptance or financing-site publication.
   - Accepted report Markdown comes from `01-SiteV2/content/12-applications/industry-reports/`. Final Closure dynamically scans published reports, applies non-regression and body-completeness gates, and updates `reports.json` plus `report-bodies.json` in the AI financing site. WaveSight report HTML remains redirect-only.
   - `.github/workflows/periodic-reports-pr.yml` invokes DeepSeek Pro for report Markdown and, on weekly runs, separate Direction Card candidates. Report content passes its acceptance gate; Direction Card candidates remain review-only. HTML/navigation/version writing stays deterministic.
5. Persist each producing lane through its own commit / PR boundary.
6. Publish the site only after merged changes reach `main` and GitHub Pages runs.
7. Refresh human-readable projections into the independent Guanlan AI Vault when the local machine is online; do not expose the repository root as an Obsidian Vault.
8. Materialize V4 JSONL tables in GitHub and rebuild DuckDB locally for queries, cross-day statistics, contamination audits, and source-linkage checks.
