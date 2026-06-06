---
name: guanlan-daily-monitor
description: Use when running, updating, auditing, or repairing V3 WaveSight daily monitoring. It collects Raw candidates, routes Pool evidence, records monitor logs, and prepares QC handoff. It does not write articles, briefs, trend reports, recommendations, or Cards.
---

# Guanlan Daily Monitor

## Required Reads

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `context/07-v3-intelligence-generation-rules.md`
4. `skills/guanlan-monitor-quality-gate/SKILL.md`
5. `skills/guanlan-daily-monitor-qc/SKILL.md`

## Scope

Daily monitoring only collects and preserves evidence.

It writes:

- Raw candidates;
- Pool evidence;
- monitor logs;
- QC handoff.

It does not write daily observation, business brief, trend report, frontstage copy, recommendations, or Guanlan-style judgments.

## Coverage

Monitoring must search for:

- product / service launches;
- financing events, especially emerging companies;
- cases, customer deployments, vertical-industry examples.

Large-company signals can be included, but they must not dominate the day.

## Evidence Boundary

Search providers are discovery entrances only. Usable records must resolve to original source pages.

Homepage, directory, login, docs-index, tool-list, product catalog, package/model listing, marketplace listing, search result, SEO, and navigation pages are `index_only` unless the same page contains a dated concrete event.

## Output Paths

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
agent-workflow/reports/
```

## Paused

Opinion / follow-builders is paused for current business-signal monitoring.

