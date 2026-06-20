# WaveSight Daily Supervision - 2026-06-20

- generated_at: 2026-06-20T07:39:24.414Z
- status: failed
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Warnings |
|---|---|---|---:|---:|
| Skill Ops Governance | daily supervision preflight | manual_required | 3 | 0 |
| Community Intelligence | 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30 | failed | 2 | 1 |
| Business Signals / Intelligence Map / Dashboard | 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55 | failed | 4 | 4 |
| First-Line Viewpoints | 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Hermes RSS handoff 09:30 | passed | 0 | 0 |
| First-Line Viewpoints Skill | 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45 | passed | 0 | 0 |

## Skill Ops Governance

- status: manual_required
- schedule: daily supervision preflight

### Problems

- guanlan-business-signals-monitor: .skill-store sync state is drift
- guanlan-raw-pool-card: .skill-store sync state is drift
- guanlan-skill-editor: .skill-store sync state is drift

### Warnings

- none

### Actions

- repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
- run `npm run audit:skills` after the repair
- run `npm run sync:skill-store` after confirming the project copy is the source of truth

### Repair Request

```text
lane: skill_ops
failed_gate: skill_ops daily supervision
report_path: agent-workflow/reports/2026-06-20-daily-supervision-report.md
data_generated: not_applicable
needed_action: repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
```
## Community Intelligence

- status: failed
- schedule: 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30

### Problems

- community data date is 2026-06-19, expected 2026-06-20
- Community Intelligence publish workflow conclusion is failure

### Warnings

- missing community gate report: agent-workflow/reports/2026-06-20-community-intelligence-gate.md

### Actions

- rerun `agent-workflow/tools/run-community-intelligence.ps1` locally
- send Codex a community_intelligence repair request with log and gate report path

### Repair Request

```text
lane: community_intelligence
failed_gate: missing
report_path: agent-workflow/reports/2026-06-20-daily-supervision-report.md
data_generated: no_or_stale
needed_action: rerun gate
```
## Business Signals / Intelligence Map / Dashboard

- status: failed
- schedule: 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55

### Problems

- business-signal activeDate is 2026-06-19, expected 2026-06-20
- Top10 selected count is 0, expected 10
- signal card files 0 below 10
- Business Signals workflow conclusion is failure

### Warnings

- missing same-date persistent asset manifest: agent-workflow/reports/2026-06-20-persistent-asset-manifest.json
- missing quality gate report: agent-workflow/reports/2026-06-20-guanlan-monitor-quality-gate.md
- missing readiness report: agent-workflow/reports/2026-06-20-daily-production-chain-readiness.md
- latest same-date GitHub Pages workflow conclusion is skipped

### Actions

- send Codex a business_signals repair request with failed gate and report path

### Repair Request

```text
lane: business_signals
failed_gate: missing
report_path: agent-workflow/reports/2026-06-20-daily-supervision-report.md
data_generated: no_or_stale
needed_action: send Codex a business_signals repair request with failed gate and report path
```
## First-Line Viewpoints

- status: passed
- schedule: 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Hermes RSS handoff 09:30

### Problems

- none

### Warnings

- none

### Actions

- none

### Repair Request

```text
none
```
## First-Line Viewpoints Skill

- status: passed
- schedule: 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45

### Problems

- none

### Warnings

- none

### Actions

- none

### Repair Request

```text
none
```
