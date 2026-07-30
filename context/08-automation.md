---
status: current
scope: site-v4-automation
last_updated: 2026-07-29
priority: current
---

# WaveSight V4 Automation Loop

## Daily production

`.github/workflows/daily-persistent-assets-pr.yml` owns the current commercial
event chain:

```text
independent source discovery
-> unified immutable snapshots + SOURCE-INTAKE-V1
-> V4 build / integrity / materialization
-> FDE and Hardware projections
-> Trend Radar / Funding Insights / Opportunity Map
-> COLLECTION-TELEMETRY-V1.0 / OPS synchronization
-> V4-only pre-commit readiness
-> PR / merge / Pages
```

`.github/workflows/daily-production-chain-dry-run.yml` tests the same ownership
without publishing.

Card generation, Pool-to-Card, Card editorial, V3 desk, old graph, compatibility
frontstage, legacy mapping, and their staging steps are disabled. Raw and Pool
candidate Markdown are no longer written. Immutable original snapshots remain.

## Lane independence

- First-Line Viewpoints (`O`) and Community Intelligence (`C`) keep independent
  collection, gate, and publication lanes.
- Commercial events (`E`) use accepted V4 Claims and sources only.
- Operations output (`OPS`) stays in telemetry/reports and cannot become public
  evidence.
- Report generation remains independent from Opportunity Map generation.
- FDE/Hardware sync depends on V4 integrity/materialization, never V3 gates.

## Recovery

Health dispatch reads the V4 manifest and `COLLECTION-TELEMETRY-V1.0`. An
accepted V4 batch must not trigger source recollection because an archived V3
asset is absent.

## Local Windows schedule

The supported local schedule contains exactly seven tasks:

| Time | Task |
|---|---|
| 08:10 | WaveSight Morning Production Dispatch |
| 08:30 | WaveSight Community Intelligence Daily |
| 09:15 | WaveSight Daily Recovery Controller |
| 09:50 | WaveSight Daily Automation Closure |
| 10:20 | WaveSight Hermes Control Plane Watchdog |
| 16:10 | WaveSight Follow-Builders Skill Daily |
| 16:45 | WaveSight Daily Final Closure |

The 10:20 task runs the watchdog and then publishes the sanitized heartbeat
even when the watchdog reports `manual_required`. Daily self-repair, Codex
self-repair handoff, the expired agent-review trial, the separate heartbeat
publisher, and the three local periodic duplicates must be absent. GitHub
Actions owns weekly and monthly schedules.

Final Closure also rebuilds and gates the local V4 JSONL/DuckDB serving layer.
This refresh is part of the existing task and must not be installed as a
separate scheduled task or Startup loop.

Install or repair the complete local contract with
`npm run install:windows-automation`. Audit it without changing task state with
`npm run assert:windows-automation`.

## Archive and Pages

V3 payload archives and `compatibility_cards` are absent from the working tree.
Production cannot discover them; explicit historical recovery uses Git history
in an isolated temporary worktree.

Required policy gates:

```powershell
npm run assert:no-active-v3
npm run assert:pipeline-policy
npm run assert:compatibility-retirement
```
