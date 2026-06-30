---
status: current
scope: context-index
last_updated: 2026-06-23
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
| `context/01-product-map.md` | V3.3 product structure and data flow | Product, navigation, data structure changes |
| `context/02-vi-style.md` | VI, typography, visual style | UI, layout, brand assets |
| `context/04-qc-rules.md` | General quality gates | Acceptance, release, closeout |
| `context/05-daily-monitoring.md` | Daily monitoring minimum context | Raw / Pool / monitoring QC |
| `context/06-execution-harness.md` | High-risk execution harness | Monitoring, Raw / Pool / Card, page changes |
| `context/07-v3-intelligence-generation-rules.md` | V3 Raw / Pool / Card / graph / trend rule source | Any generation rule or monitoring-chain change |
| `context/08-v3-3-automation.md` | V3.3 GitHub / site / local Obsidian automation loop | GitHub Actions, site data sync, local sync |
| `context/09-v3-3-current-action-index.md` | SITE-V3.3.8.6 current action registry | Action dispatch, current automation recovery, replacing historical action lists |
| `context/10-v3-3-experience-automation.md` | Action logging and retrospective automation | Record meaningful actions, summarize mistakes and lessons |
| `context/11-hermes-daily-supervision-instructions.md` | Hermes daily supervision instructions | Daily monitoring supervision, Codex repair handoff |
| `context/08-card-asset-qc-checklist.md` | Card asset QC checklist | Before Card acceptance or frontstage sync |

## Current Inboxes

| Path | Purpose |
|---|---|
| `agent-workflow/inbox/hermes-to-codex/` | File-based Hermes repair requests for Codex |

## Current Skills

| Skill | Purpose |
|---|---|
| `agent-workflow/skills/guanlan-daily-monitor/SKILL.md` | Raw monitoring and candidate collection |
| `agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md` | Monitoring pre-gate |
| `agent-workflow/skills/guanlan-daily-monitor-qc/SKILL.md` | Raw / Pool quality release |
| `agent-workflow/skills/guanlan-trend-candidate-writer/SKILL.md` | Trend candidate judgment, not trend-report writing |
| `agent-workflow/skills/guanlan-business-signals-monitor/SKILL.md` | Business Signals lane supervision and repair |
| `agent-workflow/skills/guanlan-first-line-viewpoints-monitor/SKILL.md` | First-Line Viewpoints lane supervision and repair |
| `agent-workflow/skills/guanlan-community-intelligence-monitor/SKILL.md` | Community Intelligence lane supervision and repair |
| `agent-workflow/skills/guanlan-opportunity-radar-updater/SKILL.md` | Intelligence Map opportunity radar weekly update and evidence-boundary repair |

## Active Frontstage

- `01-SiteV2/site/v3-data-observation.html`: business signals.
- `01-SiteV2/site/intelligence-map.html`: intelligence map and weekly report entry.
- `01-SiteV2/site/weekly-ai-business-change-radar.html`: weekly AI business change radar detail page.
- `01-SiteV2/site/follow-builders.html`: first-line viewpoints / builders.
- `01-SiteV2/site/community-intelligence.html`: community intelligence.
- `01-SiteV2/site/operations-console.html`: dashboard / operations backend.

## Paused Or Retired

- Legacy content-output routes are not V3.3 required outputs.
- Legacy copy gates are not publication blockers.
- Follow-builders / builders viewpoints are active only as the independent first-line viewpoints column. They must not be used as business-signal facts, relationship-graph evidence, or trend-candidate evidence.

If task context is insufficient, say what is missing before widening the reading scope.
