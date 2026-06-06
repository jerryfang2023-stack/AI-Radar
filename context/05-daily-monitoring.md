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

## Output Paths

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
agent-workflow/reports/
```

## Paused

Opinion / follow-builders is not part of current business-signal monitoring.

