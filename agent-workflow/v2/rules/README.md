---
title: V2 Rules Index
date: 2026-05-07
status: active-v2-rules-index
owner: Workflow Agent / Intelligence Data Agent / QA Agent
encoding: UTF-8
---

# V2 Rules Index

This directory contains V2 production rules for intake, source levels, tags, counter-evidence, frontstage boundaries, and daily radar prompting.

## Current Rules

| Rule File | Role |
|---|---|
| `v2-ingestion-rules.md` | Raw -> Pool -> Structured -> Front Signal -> Deep Dive -> HeatEvidence intake rules |
| `v2-source-level-rules.md` | S / A / B / C source level definitions |
| `v2-tag-mapping-rules.md` | Seed, formal, and candidate tag governance |
| `v2-counter-evidence-rules.md` | Counter-evidence and evidence-gap requirements |
| `v2-frontstage-backstage-boundary.md` | Public page vs Admin / production-process boundary |
| `ai-2-v2-daily-radar-prompt.md` | V2 daily radar prompt draft |

## Active Production Line

V2 production work uses:

```text
01-SiteV2/content/
01-SiteV2/site/
```

V1 content and the old `04-Site` are read-only historical references under `10-Archive/v1.0/`.

## Non-Negotiables

- Do not publish Raw, Pool, Structured, sync status, JSON, fields, or recovery language to the public frontstage.
- Do not turn The Point back into a standalone V2 channel.
- Do not turn Trends back into a standalone short-term V2 channel.
- Do not use company names as Opportunity titles.
- Do not report a daily production run complete if the Raw / Pool / Structured / Front Signal counts fail the V2 gate.
