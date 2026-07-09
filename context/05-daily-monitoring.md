---
status: current
scope: v3-daily-monitoring
last_updated: 2026-06-13
priority: current
---

# V3 Daily Monitoring Context

Daily monitoring follows:

```text
context/07-v3-intelligence-generation-rules.md
```

This file only keeps the daily-monitoring execution boundary.

## Purpose

Daily monitoring collects and preserves external AI business material for V3.

It produces:

- Raw candidates;
- Pool evidence;
- monitor logs;
- QC handoff.

It does not produce:

- legacy content outputs;
- frontstage copy;
- recommendations or Guanlan-style judgments.

## Raw Boundary

Raw is the candidate layer.

Search providers are discovery entrances only. Usable items must resolve to original sources.

Raw keeps source evidence:

- original URL;
- source name and type;
- publication date when available;
- readable full text / clean text;
- key excerpts;
- source archive / snapshot path when available;
- content hash and full-text hash;
- extraction method and readability score;
- evidence object type;
- missing information.

Homepage, directory, login, docs-index, tool-list, product catalog, package/model listing, marketplace listing, search result, SEO, and navigation pages are `index_only` unless the same page contains a dated concrete event.

## Raw-To-Card Boundary

Current Business Signals production uses this path:

```text
Raw -> dedupe / evidence quality check -> cardability judgment -> draft Card -> validation / publish
```

Pool remains the audit index and repair surface. It is not a required selection layer before a source-backed Raw item can become a Card.

Missing named customers, adoption metrics, ROI, or before/after workflow details should be recorded as evidence boundaries. They must not automatically suppress concrete funding, product/service, acquisition, partnership, procurement, pricing, regulatory, lawsuit/settlement, infrastructure, or other AI commercial market-structure events.

## Pool Boundary

Pool is screened evidence for audit and repair.

Any Pool item that is used as Card evidence requires:

- original source link;
- readable body text;
- source summary or usable article lead;
- evidence excerpts;
- content hash and full-text hash;
- Raw QC allow;
- clear importance reason.

Pool type is not Card type. Cardability is judged from source-backed Raw evidence first, with Pool as an audit index rather than a mandatory publication gate.

`important_technical_trend` is monitored as context for source repair, relationship analysis, and trend-candidate work. It must not be used to fill formal Signal Card quantity unless the same source also proves a dated product/service launch, funding event, customer deployment, procurement, partnership, or production rollout.

Signal Card promotion must use the six entry gates in `context/07-v3-intelligence-generation-rules.md`:

- `source_auditability`;
- `evidence_quality`;
- `business_signal_scope`;
- `valid_page_type`;
- `commercial_importance`;
- `fact_type_constraints`.

Raw / Pool diagnostics may keep detailed fields such as full text, extraction method, source level, page type, freshness, and evidence object. Those details should be reported under the six gates, not as independent top-level Card policy.

## Coverage

Monitoring must cover:

- product / service launches;
- financing events, especially emerging-company financing;
- cases, customer deployments, vertical-industry examples.

Enterprise AI transformation / 企业AI化 is an added monitoring lens for FDE-style implementation signals. It should capture evidence around discovery, technical scoping, system design, build, governance, procurement, pilots, production rollout, demonstrated value, and customer engineering capacity.

Enterprise AI / FDE follows the Raw/Card ingestion boundary. English title translation and source-backed fact extraction should be recorded in Raw records, Signal Cards, or FDE Lens Pool assets before frontstage rendering. Missing title/fact fields are asset-generation repair items, not generic frontstage blockers.

This lens does not create a fourth Signal Card type. FDE / Applied AI / Technical Deployment role pages may indicate organization capability or delivery model, but they cannot become formal business-signal facts unless separately supported by source-backed product / service, funding, customer deployment, procurement, or production rollout evidence.

Generic FDE / applied-AI implementation pages are backend context by default. Job posts, role explainers, consulting/service landing pages, and "what is FDE" articles may remain in Raw / Pool diagnostics, but they must not satisfy routed Pool or Card quantity gates unless the same original source contains a concrete dated customer deployment, product/service launch, funding, procurement, partnership, or production rollout.

Large-company items are allowed, but they cannot dominate the day.

Current quantity gates:

- daily production chain expects at least 150 active Raw candidates;
- Raw shortfall caused by search-provider quota or temporary outage must not block release by itself when Pool audit supply and the downstream frontstage Card contract are sufficient; keep the shortfall visible as a diagnostic.
- GDELT, keyword search, RSS, and AI HOT are peer source-artifact entrances for Raw. Raw selection should use balanced rotation across available peer channels, not a fixed priority order.
- AI HOT, RSS, keyword search, GDELT, Anysearch, Tavily, Exa, or any other discovery label is not a Core Pool decision. Every candidate must be resolved to the original source, then judged by the original page's evidence quality, page type, freshness, commercial importance, and formal Card gates.
- daily Pool audit gate expects at least 75 Pool items and at least 60 routed Pool items; Card release is decided by raw-to-card cardability, not by a separate core-pool quota;
- Pool generation must not cap the selected Pool at a fixed top-N / buffer count. After Raw collection, preserve all non-discard screened evidence in the Pool file so repairable high-value items remain visible for Card processing and audit.
- each required importance lane should keep at least 5 Pool candidates before downstream release;
- frontstage Card presentation publishes all active-date qualified Raw / Pool business signals that pass the formal Card gate and public display requirements.
- Signal Card assets should cover all cardable Raw / Pool business signals so relationship graph and trend-candidate modules can use the same eligible evidence set.
- If routed Pool or cardable supply is thin, targeted refill must search for recent concrete events: customer deployment, production rollout, product launch, funding, procurement, pricing, regulatory, or vertical workflow evidence. Do not repair supply by using marketplace listings, directories, generic guides, interviews, old technical posts, broad lists, funding roundups, or generic funding commentary as Card evidence.
- Concrete acquisitions / mergers, material partnerships, procurement / tenders / contracts, pricing or billing changes, regulatory approvals / antitrust actions, and material lawsuits / settlements are high-value Business Signals when they are source-backed AI commercial events. They must be normalized into existing `case` or `product_service` Cards rather than creating a fourth public Card type.
- `source_level` and `acquisition_source_level` remain traceability-only labels during refill. They must not boost, penalize, gate, or auto-downgrade Raw / Pool / Card eligibility.

Large-company boundary:

- Raw can collect large-company evidence for coverage, but should not be used to fill quantity by repeating platform/lab product news;
- Pool can keep large-company evidence, but the public Card set should not be dominated by repeated large-company product announcements;
- cardable supply should include enough emerging-company funding, customer deployment, vertical workflow, pricing/procurement/regulatory, and non-platform infrastructure evidence to avoid a platform-news-only day;
- frontstage Card order must be importance / impact descending, not category order;
- if too few items pass the formal Card gate, increase Raw coverage and repair source / Pool balance instead of padding with repeated large-company news or low-value AI-adjacent items;
- relationship graph and trend candidates use the full eligible Card asset set plus backend audit evidence when needed;
- when cardable supply is abundant and ordering or repair priority is needed, prefer emerging-company financing, real customer deployment, vertical workflow case, pricing/procurement/regulatory signal, or non-platform infrastructure evidence.

## Output Paths

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
agent-workflow/reports/
```

## Paused

Opinion / follow-builders is not part of current business-signal monitoring.
