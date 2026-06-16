# WaveSight Daily Supervision - 2026-06-16

- generated_at: 2026-06-16T03:24:20.642Z
- status: manual_required
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Warnings |
|---|---|---|---:|---:|
| Skill Ops Governance | daily supervision preflight | manual_required | 9 | 0 |
| Community Intelligence | 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30 | passed | 0 | 0 |
| Business Signals / Intelligence Map / Dashboard | 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55 | warning | 0 | 1 |
| First-Line Viewpoints | 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Hermes RSS handoff 09:30 | warning | 0 | 1 |
| First-Line Viewpoints Skill | 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45 | passed | 0 | 0 |

## Skill Ops Governance

- status: manual_required
- schedule: daily supervision preflight

### Problems

- guanlan-community-intelligence-monitor: .skill-store sync state is drift
- guanlan-monitor-quality-gate: .skill-store sync state is drift
- guanlan-daily-monitor-qc: .skill-store sync state is drift
- guanlan-raw-pool-card: .skill-store sync state is drift
- guanlan-trend-candidate-writer: .skill-store sync state is drift
- follow-builders: .skill-store sync state is drift
- guanlan-weekly-business-change-radar: .skill-store sync state is drift
- guanlan-typography-qc: .skill-store sync state is drift
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
report_path: agent-workflow/reports/2026-06-16-daily-supervision-report.md
data_generated: not_applicable
needed_action: repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
```
## Community Intelligence

- status: passed
- schedule: 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30

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
## Business Signals / Intelligence Map / Dashboard

- status: warning
- schedule: 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55

### Problems

- none

### Warnings

- local Obsidian sync may be blocked by 16 dirty file(s)

### Actions

- none

### Repair Request

```text
none
```
## First-Line Viewpoints

- status: warning
- schedule: 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Hermes RSS handoff 09:30

### Problems

- none

### Warnings

- GitHub workflow state unavailable

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
