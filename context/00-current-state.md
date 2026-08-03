---
status: current
scope: project-state
last_updated: 2026-08-03
use_when:
  - large task startup
  - dispatch planning
  - state recovery
priority: current
---

# 00 Current State - WaveSight AI

WaveSight AI is on the `V4.6.1-china-market-scope` repository release. The public website uses the `SITE-V4.4.1-china-market-scope` shell and keeps the existing V4 data-service baseline.

## Current Positioning

- WaveSight AI is an AI industry data center and structured factual data foundation for downstream AIP, industry research, and startup decision-support products.
- The data center does not make decisions, judge commercial value, recommend actions, or educate readers toward a conclusion.
- The public frontstage uses the V4 Data Center / Application Center shell. V3 page routes are redirects only.
- The current backend entry is the operations dashboard.
- The production core turns external sources into SourceArtifacts, RawDocuments, Claims, Entities, CanonicalEvents, domain projections, and queryable exports.
- The current collection lane writes ephemeral source snapshots, copies complete bodies into the authoritative private evidence store, converts public V4 records to `evidence://<content_hash>` locators, and then removes the ephemeral public copies. `SOURCE-INTAKE-V1` remains the structured handoff.
- Current column versions: First-Line Viewpoints `FLV-V1.1.0-history-backfill`, Community Intelligence `CINT-V1.0.2-publication-waiting-gate`, Trend Radar `TRADAR-V1.1.0-tag-v4-1`, Funding Insights `FUNDING-INSIGHT-V1.2.0-market-category`, Guanlan Research `REPORTS-V1.2.0-research-hub`, Opportunity Map `OMAP-V2.0.0-v4-evidence`.
- China-market coverage runs inside the existing commercial-event intake and scheduler. It distinguishes registered source types without source weights, excludes procurement/tender lanes, and writes evidence-backed `market_scope` only when an accepted Raw/Event match has an explicit controlled basis.
- Current person review contract: `PERSON-REVIEW-V1.1`; the original 37 person/account candidates remain fully reviewed (31 natural people public, 6 non-natural accounts quarantined), and 30 additional funding founders are public only after explicit source-backed review. The remaining funding person candidates stay outside the public Entity Index.
- Current data versions: `SOURCE-INTAKE-V1.1`, `RAW-V4.0`, `EVENT-V1.1`, `ENTITY-V1.0`, `RELATION-V2.1`, `BACKFILL-V1.0`, `FDE-V2.0`, `FDE-OBSERVATION-V1.0`, `HARDWARE-V1.0`, `HARDWARE-FACT-V1.0`, `HARDWARE-SNAPSHOT-V1.0`, `LENS-FUNNEL-V1.0`, `TAG-V4.1`.
- Current local knowledge-base version: `GUANLAN-VAULT-V1.2-private-evidence-linked`. The Guanlan AI Vault is physically independent from the repository and stores citation cards and traceable links only.
- Current data-lake contract: `DATA-LAKE-V4.1-24-table`; JSONL and DuckDB must expose exactly the same 24-table V4 allowlist, including reviewed event classifications.
- Current private evidence store: `PRIVATE-EVIDENCE-STORE-V2.0`; it is the sole complete-original store, deduplicates bodies by `content_hash`, and is physically outside the public repository and Vault. Public V4 data, the Vault, and the website never retain complete bodies.
- Current Funding Insights inventory: 248 accepted application cards aggregate to 229 public company-round cards. The `2026-08-03` bundle contains 18 auto-published cards plus one deduplicated event; all 241 published funding events have reviewed `TAG-V4.1` decisions, and unresolved product/person names remain in the evidence-backed entity review queue.
- Current private evidence inventory: 12,064 snapshots, 11,345 unique bodies, and zero missing bodies.
- Current Windows automation contract: seven tasks. Final Closure owns data-lake refresh; Hermes watchdog and heartbeat publication run as one control-plane task.

## Current Entries

| Entry | File | Role |
|---|---|---|
| Data Center | `01-SiteV2/site/data-center.html` | Four-entry public data layer: Event Library, unchanged Community Intelligence, unchanged First-Line Viewpoints, and Entity Library. FDE and AI Hardware remain event themes; factual relationships remain embedded in entity details. |
| Trend Radar | `01-SiteV2/site/trend-radar.html` | Application-center factual explorer for accepted daily changes, weekly structure changes, monthly snapshots, and event/entity/source evidence links |
| Guanlan Research | `01-SiteV2/site/intelligence-map.html` | Application-center research hub for latest Monthly / Weekly reports, capital and funding research, enterprise AI deployment topics, and archives |
| Funding Insights | `01-SiteV2/site/funding-insights.html` | Guanlan Research capital topic subroute; retains the existing evidence-backed funding research product |
| Opportunity Map | `01-SiteV2/site/opportunity-map.html` | Unlisted `noindex,nofollow` internal lab route retained for evidence-backed map experiments |
| First-Line Viewpoints | `01-SiteV2/site/data-center.html?view=viewpoints` | Independent builders viewpoint feed, people index, and person timeline |
| Community Intelligence | `01-SiteV2/site/data-center.html?view=community` | Community-sourced cases, AI tool tactics, commercial opportunities, and document links |
| Dashboard | `01-SiteV2/site/operations-console.html` | Operations backend and production-chain dashboard |

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
-> downstream application projections, including Trend Radar and Guanlan Research
-> GitHub PR / merge
-> GitHub Pages
-> local Guanlan AI Vault refresh
```

First-line viewpoints use two independent builders monitoring lanes: the morning RSS/X lane produces translated, gated public remarks, while the afternoon follow-builders Skill lane preserves separate discovery intake. Accepted historical morning snapshots are materialized in `01-SiteV2/site/data/first-line-viewpoints-history.json`; V4 merges current and historical morning data plus the afternoon lane by original URL into `01-SiteV2/site/data/first-line-viewpoints-v4.json`. The external Guanlan AI Vault projects a deduplicated person timeline after local `main` sync. Historical or afternoon-only intake remains outside the public feed until it passes the same approved-Chinese-translation provenance, source, formal-tag, and AI-relevance gates. Viewpoints are not evidence for Claims, CanonicalEvents, or RELATION-V2.1. Their daily data build is independent from the commercial-event chain.

Community Intelligence uses the logged-in scys.com / aipoju.com collection route as a separate frontstage column. Its materials are community-sourced leads and must not be treated as facts unless the original source is separately captured, exact-span Claims are accepted, and the responsible V4 event gate passes.

## Paused / Retired

The V3 column pages and old Reports page are retired as content surfaces and remain only as redirects into V4.

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
4. Keep Trend Radar and Guanlan Research as the two public downstream V4 application entries and Dashboard as an independent backend. Funding Insights remains a research subroute; Opportunity Map remains an internal lab. Do not write any derived structures or judgments into V4 canonical data.
   - Trend Radar rebuilds after the V4 frontstage bundle, uses accepted `dataDate` facts only, exposes collection coverage, and links every structure back to events, entities, Claims, SourceArtifacts, and original sources.
   - Funding Insights runs after verified funding events. Daily collection may automatically admit source-backed financing disclosed within the preceding three calendar months; older financing stays in QA unless an explicit targeted-backfill instruction enables it. Targeted source capture can merge accepted records directly into the existing same-date `SOURCE-INTAKE-V1.1` bundle while retaining extraction diagnostics, China-market scope fields, and private-evidence locators. Before DeepSeek research, generation deduplicates against all persisted Funding Insight event IDs and canonical company-plus-normalized-round keys, and the frontstage continues to aggregate by the same company-round key. Secondary source capture and DeepSeek V4 Pro may enrich the application card, but every company, financing, investor, product, customer, comparison, and metric fact must quote a captured source exactly. `FUNDING-INSIGHT-V1.2` normalizes round labels, separates current-round investors from historical/ambiguous investors, aggregates repeated company-and-confident-round disclosures, and records structured investment-thesis, customer-research status, one primary product form, and reviewed market taxonomy on every new card. Primary product form is selected from what customers buy or users directly use; reviewed historical decisions override the legacy keyword fallback. Missing current-round investors block the card unless captured evidence confirms the financing while disclosing investors only by generic category; that bounded exception requires an empty investor list, `investor_disclosure_status=not_disclosed`, and the `investors_missing` risk marker, and the generic category must never become an institution. Exact entity matches link immediately; unresolved products and founders enter an evidence-backed review queue. `PERSON-REVIEW-V1.1` may admit a manually reviewed founder profile with funding-card and source locators, but application evidence never creates a canonical event or `RELATION-V2.1`.
   - Opportunity Map updates from `opportunity-evidence-v2.json`, generated only from accepted V4 CanonicalEvents, Claims, SourceArtifacts, Entities, and FacetAssertions, and publishes under `OMAP-V2.0.0-v4-evidence`; downstream application assertions bind accepted Claims and never enter V4 canonical tables. DeepSeek V4 Pro writes evidence-bounded Direction Card candidates, but only human-reviewed candidates may enter the public direction configuration.
   - Weekly report generation remains lane-independent under `REPORTS-V1.2.0-research-hub`: Opportunity Map or direction-candidate failure is recorded as a warning and cannot block report content acceptance or page publication.
   - Guanlan Research publishes under `REPORTS-V1.2.0-research-hub`. Weekly and monthly accepted report Markdown comes from `01-SiteV2/content/12-applications/industry-reports/`; capital research links to Funding Insights, and the external Guanlan AI Vault receives a readable copy after local sync.
   - `.github/workflows/periodic-reports-pr.yml` invokes DeepSeek Pro for report Markdown and, on weekly runs, separate Direction Card candidates. Report content passes its acceptance gate; Direction Card candidates remain review-only. HTML/navigation/version writing stays deterministic.
5. Persist each producing lane through its own commit / PR boundary.
6. Publish the site only after merged changes reach `main` and GitHub Pages runs.
7. Refresh human-readable projections into the independent Guanlan AI Vault when the local machine is online; do not expose the repository root as an Obsidian Vault.
8. Materialize V4 JSONL tables in GitHub and rebuild DuckDB locally for queries, cross-day statistics, contamination audits, and source-linkage checks.
