---
status: current
scope: v3-daily-monitoring
last_updated: 2026-06-06
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

- daily observation;
- business brief;
- trend report;
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

## Coverage

Monitoring must cover:

- product / service launches;
- financing events, especially emerging-company financing;
- cases, customer deployments, vertical-industry examples.

Large-company items are allowed, but they cannot dominate the day.

Current quantity gates:

- daily production chain expects at least 150 active Raw candidates;
- daily Pool gate expects at least 75 Pool items, at least 60 routed Pool items, and at least 30 usable `core_pool` items;
- each required importance lane should keep at least 5 Pool candidates before downstream release;
- frontstage Card presentation must publish exactly 10 business signals per active date.
- Signal Card assets should cover all qualified Core Pool items so relationship graph and trend-candidate modules can use non-displayed evidence.

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
