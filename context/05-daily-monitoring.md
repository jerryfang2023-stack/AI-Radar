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

## Pool Boundary

Pool is screened evidence.

`core_pool` requires:

- original source link;
- readable body text;
- source summary or usable article lead;
- evidence excerpts;
- content hash and full-text hash;
- Raw QC allow;
- clear importance reason.

Pool type is not Card type.

`important_technical_trend` is monitored as context for source repair, relationship analysis, and trend-candidate work. It must not be used to fill formal Signal Card quantity unless the same source also proves a dated product/service launch, funding event, customer deployment, procurement, partnership, or production rollout.

Signal Card promotion from Core Pool must use the six entry gates in `context/07-v3-intelligence-generation-rules.md`:

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

This lens does not create a fourth Signal Card type. FDE / Applied AI / Technical Deployment role pages may indicate organization capability or delivery model, but they cannot become formal business-signal facts unless separately supported by source-backed product / service, funding, customer deployment, procurement, or production rollout evidence.

Generic FDE / applied-AI implementation pages are non-core by default. Job posts, role explainers, consulting/service landing pages, and "what is FDE" articles may remain in Raw / Pool diagnostics, but they must not satisfy `core_pool`, routed Pool, or Card quantity gates unless the same original source contains a concrete dated customer deployment, product/service launch, funding, procurement, partnership, or production rollout.

Large-company items are allowed, but they cannot dominate the day.

Current quantity gates:

- daily production chain expects at least 150 active Raw candidates;
- daily Pool gate expects at least 75 Pool items, at least 60 routed Pool items, and at least 30 usable `core_pool` items;
- each required importance lane should keep at least 5 Pool candidates before downstream release;
- frontstage Card presentation must publish exactly 10 business signals per active date.
- Signal Card assets should cover all qualified Core Pool items so relationship graph and trend-candidate modules can use non-displayed evidence.
- If `core_pool`, routed Pool, or non-large core supply is thin, targeted refill must search for recent concrete events: customer deployment, production rollout, product launch, funding, procurement, pricing, regulatory, or vertical workflow evidence. Do not repair supply by promoting marketplace listings, directories, generic guides, interviews, old technical posts, broad lists, funding roundups, or generic funding commentary into `core_pool`.
- `source_level` and `acquisition_source_level` remain traceability-only labels during refill. They must not boost, penalize, gate, or auto-downgrade Raw / Pool / Core Pool eligibility.

Large-company boundary:

- Raw can collect large-company evidence for coverage, but should not be used to fill quantity by repeating platform/lab product news;
- Pool can keep large-company evidence, but usable `core_pool` should stay below 10 large-company items and below 35% of core evidence by default;
- usable `core_pool` should include at least 20 non-large-company items by default;
- frontstage Card presentation is stricter: no more than 1 Card for the same large company per date, and no more than 3 large-company Cards in total per date;
- frontstage Card order must be the daily top 10 by importance, not category order;
- if frontstage Top 10 cannot be filled after these caps, increase Raw coverage and repair Pool/Core Pool balance instead of padding with repeated large-company news;
- relationship graph and trend candidates still use the full eligible Core Pool / Card asset set, not only the frontstage Top 10;
- when the limit is reached, prefer emerging-company financing, real customer deployment, vertical workflow case, pricing/procurement/regulatory signal, or non-platform infrastructure evidence.

## Output Paths

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
agent-workflow/reports/
```

## Paused

Opinion / follow-builders is not part of current business-signal monitoring.
