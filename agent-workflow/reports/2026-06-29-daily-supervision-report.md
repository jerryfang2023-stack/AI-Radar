# WaveSight Daily Supervision - 2026-06-29

- generated_at: 2026-06-29T05:36:22.453Z
- status: manual_required
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Warnings |
|---|---|---|---:|---:|
| Skill Ops Governance | daily supervision preflight | passed | 0 | 0 |
| Community Intelligence | 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30 | manual_required | 2 | 1 |
| Business Signals / Intelligence Map / Dashboard | 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55 | waiting | 1 | 1 |
| First-Line Viewpoints | 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Hermes RSS handoff 09:30 | passed | 0 | 0 |
| First-Line Viewpoints Skill | 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45 | passed | 0 | 0 |

## Skill Ops Governance

- status: passed
- schedule: daily supervision preflight

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
## Community Intelligence

- status: manual_required
- schedule: 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30

### Problems

- community data date is 2026-06-28, expected 2026-06-29
- community scheduled task last result is 1

### Warnings

- missing community gate report: agent-workflow/reports/2026-06-29-community-intelligence-gate.md

### Actions

- rerun `agent-workflow/tools/run-community-intelligence.ps1` locally
- send Codex a community_intelligence repair request with log and gate report path

### Repair Request

```text
lane: community_intelligence
failed_gate: missing
report_path: agent-workflow/reports/2026-06-29-daily-supervision-report.md
data_generated: no_or_stale
needed_action: rerun gate
```
## Business Signals / Intelligence Map / Dashboard

- status: waiting
- schedule: 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55

### Problems

- Business Signals workflow is in_progress; downstream tasks should wait

### Warnings

- local Obsidian sync may be blocked by 62 dirty file(s)

### Actions

- wait for Business Signals workflow completion before declaring data missing
- send Codex a business_signals repair request with failed gate and report path

### Repair Request

```text
lane: business_signals
failed_gate: passed
report_path: agent-workflow/reports/2026-06-29-daily-supervision-report.md
data_generated: yes
needed_action: repair publication/local sync closure only; do not rerun Raw/Pool/Card generation
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
