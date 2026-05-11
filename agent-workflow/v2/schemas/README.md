---
title: V2 Schemas Index
date: 2026-05-07
status: active-v2-schema-index
owner: Intelligence Data Agent / Dev Agent / QA Agent
encoding: UTF-8
---

# V2 Schemas Index

This directory defines the minimum V2 content asset schemas used by the production content library under `01-SiteV2/content/`.

## Current Schemas

| Schema | Role | Production Use |
|---|---|---|
| `raw-candidate.schema.md` | Raw candidate source capture | Required for daily 30-50 source candidates |
| `structured-signal.schema.md` | Structured Signal | Required before a Signal can become one of the daily 3 front Signals |
| `heat-evidence.schema.md` | HeatEvidence | Required before evidence can affect heat calculation |
| `heat-card.schema.md` | HeatCard | Required for AI Brief and heatmap modules |
| `ai-brief-issue.schema.md` | AI Brief Issue | Required for weekly / monthly business brief issues |
| `source-registry.schema.md` | Source Registry | Required for source level governance |

## Active Path

V2 production content assets default to:

```text
01-SiteV2/content/
```

The older `06-content/v2/` wording in early planning files is historical. Do not use it as the active V2 production content path.

## Blocking Rules

- Raw candidates must keep source traces.
- Front Signals need at least 3 S/A/B sources or a written evidence gap.
- Point / Builder material can calibrate judgment, but cannot be used as fact evidence by itself.
- Tags must stay split into seed / formal / candidate layers.
- HeatEvidence must trace back to a source asset.
