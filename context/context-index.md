---
status: current
scope: context-index
last_updated: 2026-07-31
use_when:
  - decide what to read
  - dispatch task
  - recover context
priority: router
---

# Context Index - WaveSight AI

This file is the reading router. Do not use old closeout files as current truth.

## Current Sources

| File | Purpose | Read When |
|---|---|---|
| `context/project-memory.md` | Stable project memory and non-negotiable long-term rules | Project startup, agent handoff, context recovery, recurring conflict check |
| `context/00-current-state.md` | Current product state and active / paused routes | Large task startup, context recovery |
| `context/version-ledger.md` | Current version baseline, freeze point, active version | Page change, release check, version confirmation |
| `context/frontstage-page-contracts.md` | Frontstage page contracts | Page, nav, copy, data sync, regression check |
| `context/01-product-map.md` | SITE-V4.0 data-center product structure and downstream applications | Product and data structure changes |
| `context/02-vi-style.md` | VI, typography, visual style | UI, layout, brand assets |
| `context/04-qc-rules.md` | General quality gates | Acceptance, release, closeout |
| `context/05-daily-monitoring.md` | Retired V3 daily-monitoring notice | Historical V3 audit only |
| `context/06-execution-harness.md` | High-risk execution harness | V4 source intake, fact build, application projections, page changes |
| `context/07-v3-intelligence-generation-rules.md` | V3 retirement notice and explicit Git-history recovery boundary | Historical V3 audit only |
| `context/08-automation.md` | SITE-V4.4 GitHub / site / external Guanlan Vault automation loop | GitHub Actions, data sync, local sync |
| `context/09-current-action-index.md` | Current V4 action registry | Action dispatch and automation recovery |
| `context/10-experience-automation.md` | Action logging and retrospective automation | Record meaningful actions, summarize mistakes and lessons |
| `context/11-hermes-daily-supervision-instructions.md` | Hermes control-plane watchdog instructions | Controller liveness only; no lane supervision or repair |
| `context/12-data-center-v4.md` | Current Data Center V4 contract and factual production boundary | Raw / Claim / Event / FDE / hardware / tags / database work |

## Current Inboxes

| Path | Purpose |
|---|---|
| `agent-workflow/inbox/production-incidents/` | Current neutral production and control-plane incident registry |

## Current Skills

| Skill | Purpose |
|---|---|
| `agent-workflow/skills/guanlan-data-center-supervisor/SKILL.md` | Data Center V4 lane supervision and repair |
| `agent-workflow/skills/guanlan-daily-monitor/SKILL.md` | Immutable snapshot capture and SOURCE-INTAKE-V1 production |
| `agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md` | Monitoring pre-gate |
| `agent-workflow/skills/guanlan-daily-monitor-qc/SKILL.md` | On-demand V4 source-intake semantic audit |
| `agent-workflow/skills/guanlan-data-center-supervisor/SKILL.md` | V4 commercial-event production supervision and repair |
| `agent-workflow/skills/guanlan-first-line-viewpoints-monitor/SKILL.md` | First-Line Viewpoints lane supervision and repair |
| `agent-workflow/skills/guanlan-community-intelligence-monitor/SKILL.md` | Community Intelligence lane supervision and repair |
| `agent-workflow/skills/guanlan-opportunity-radar-updater/SKILL.md` | Independent Opportunity Map weekly update and evidence-boundary repair |

## Active Frontstage

- `01-SiteV2/site/data-center.html`: Event Library, Community Intelligence, First-Line Viewpoints, and Entity Library; FDE / hardware remain thematic deep views and relationships remain available in entity details.
- `01-SiteV2/site/intelligence-map.html`: retired Guanlan Research compatibility redirect to `https://www.zkdlj.vip/#reports`.
- `01-SiteV2/site/funding-insights.html`: retired compatibility redirect to the independent AI financing site.
- `https://www.zkdlj.vip/`: public Financing Insights plus accepted weekly/monthly reports.
- `01-SiteV2/site/opportunity-map.html`: source-backed Opportunity Map.
- `01-SiteV2/site/weekly-ai-business-change-radar.html`: weekly AI business change radar detail page.
- `01-SiteV2/site/v3-data-observation.html`, `follow-builders.html`, `community-intelligence.html`, and `reports.html`: compatibility redirects only.
- `01-SiteV2/site/operations-console.html`: dashboard / operations backend.

## Paused Or Retired

- Legacy content-output routes are not SITE-V4.4 required outputs.
- Legacy copy gates are not publication blockers.
- Follow-builders / builders viewpoints are active only as the independent first-line viewpoints column. They must not be used as business-signal facts, relationship-graph evidence, or trend-candidate evidence.

If task context is insufficient, say what is missing before widening the reading scope.
