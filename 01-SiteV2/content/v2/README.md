---
title: V2 Content Library
status: active-skeleton
owner: workflow / data / dev / qa
encoding: UTF-8
---

# V2 Content Library

This directory is an earlier V2 skeleton created during isolation planning. The active V2 production content library for WaveSight AI is now the parent `01-SiteV2/content/` structure.

V1 content is frozen from 2026-05-07. New V2 content should not be written into `01-Signals/`, `02-Scoring/`, `03-Trends/`, `05-point/`, or `07-Opportunities/` unless a later production cutover task explicitly approves it.

The existing dated production-line files are in `01-SiteV2/content/01-raw/`, `02-pool/`, `03-structured-signals/`, `04-selected-signals/`, and downstream directories. This `content/v2/` skeleton remains as a schema-era reference and should not become a second active content root.

These directories do not automatically enter website sync. V2 site work starts from `01-SiteV2/site/`; the old `04-Site` is now archived under `10-Archive/v1.0/site/04-Site/`.

## Directory Map

| Directory | Role | Visibility |
|---|---|---|
| `00-raw/` | Raw source candidates and archived originals | Admin / Data only |
| `01-pool/` | Daily candidate pool and rejection reasons | Admin / Data only |
| `02-structured/` | Structured signals before frontstage selection | Admin / Data only |
| `03-front-signals/` | Daily selected frontstage signals | Future frontstage source |
| `04-deep-dives/` | Evidence-heavy opportunity or signal deep dives | Member / editorial source |
| `05-trends/` | Trend updates, candidates, and legacy trend mapping | Future opportunity context |
| `06-heat-evidence/` | Unified evidence objects for heat calculation | Backstage / member evidence summary |
| `07-heat-cards/` | Industry, job, workflow, and triple heat cards | AI Brief core module |
| `08-ai-brief/` | Weekly and monthly AI brief issues | Member / premium product |
| `09-opportunity-maps/` | Opportunity analysis and observation variables | Opportunity report source |
| `10-counter-evidence/` | Commercial, technical, regulatory, transfer, and point counter-evidence | Backstage / member summary |
| `11-source-registry/` | Source levels, watchlists, blocked sources, source notes | Admin / Data only |
| `12-legacy-index/` | V1 read-only content indexes and V2 mapping suggestions | Migration / audit |

## Ingestion Rule

V2 ingestion is staged:

```text
Raw -> Pool -> Structured -> Front Signal -> Deep Dive / Trend -> HeatEvidence -> HeatCard -> AIBriefIssue
```

Each stage should preserve source paths, source levels, evidence gaps, counter-evidence, and mapping decisions. Point / Builder material may calibrate judgment, but it must not become a fact source by itself.
