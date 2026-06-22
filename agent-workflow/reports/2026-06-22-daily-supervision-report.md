# WaveSight Daily Supervision - 2026-06-22

- generated_at: 2026-06-22T03:58:02.371Z
- status: failed
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Warnings |
|---|---|---|---:|---:|
| Skill Ops Governance | daily supervision preflight | manual_required | 8 | 0 |
| Community Intelligence | 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30 | warning | 0 | 2 |
| Business Signals / Intelligence Map / Dashboard | 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55 | failed | 1 | 1 |
| First-Line Viewpoints | 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Hermes RSS handoff 09:30 | passed | 0 | 0 |
| First-Line Viewpoints Skill | 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45 | passed | 0 | 0 |

## Skill Ops Governance

- status: manual_required
- schedule: daily supervision preflight

### Problems

- guanlan-business-signals-monitor: .skill-store sync state is drift
- guanlan-enterprise-ai-fde-monitor: .skill-store sync state is drift
- guanlan-first-line-viewpoints-monitor: .skill-store sync state is drift
- guanlan-community-intelligence-monitor: .skill-store sync state is drift
- guanlan-monitor-quality-gate: .skill-store sync state is drift
- guanlan-daily-monitor-qc: .skill-store sync state is drift
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
report_path: agent-workflow/reports/2026-06-22-daily-supervision-report.md
data_generated: not_applicable
needed_action: repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
```
## Community Intelligence

- status: warning
- schedule: 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30

### Problems

- none

### Warnings

- community scheduled task last result is 1, but same-date data and gate are healthy
- same-date Community Intelligence automation PR already merged: https://github.com/jerryfang2023-stack/AI-Radar/pull/119

### Actions

- none

### Repair Request

```text
none
```
## Business Signals / Intelligence Map / Dashboard

- status: failed
- schedule: 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55

### Problems

- Business Signals publication workflow conclusion is failure after healthy same-date data; repair branch / PR / publication only

### Warnings

- local Obsidian sync may be blocked by 63 dirty file(s)

### Actions

- send Codex a business_signals repair request with failed gate and report path

### Repair Request

```text
lane: business_signals
failed_gate: passed
report_path: agent-workflow/reports/2026-06-22-daily-supervision-report.md
data_generated: yes
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
