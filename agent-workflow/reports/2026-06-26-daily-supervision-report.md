# WaveSight Daily Supervision - 2026-06-26

- generated_at: 2026-06-26T03:39:23.727Z
- status: manual_required
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Warnings |
|---|---|---|---:|---:|
| Skill Ops Governance | daily supervision preflight | passed | 0 | 0 |
| Community Intelligence | 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30 | manual_required | 3 | 1 |
| Business Signals / Intelligence Map / Dashboard | 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55 | warning | 0 | 3 |
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

- community data date is 2026-06-25, expected 2026-06-26
- community scheduled task last result is 1
- Community Intelligence publication PR is open: https://github.com/jerryfang2023-stack/AI-Radar/pull/140

### Warnings

- missing community gate report: agent-workflow/reports/2026-06-26-community-intelligence-gate.md

### Actions

- wait for Community Intelligence PR merge before declaring publication missing
- rerun `agent-workflow/tools/run-community-intelligence.ps1` locally
- send Codex a community_intelligence repair request with log and gate report path

### Repair Request

```text
lane: community_intelligence
failed_gate: missing
report_path: agent-workflow/reports/2026-06-26-daily-supervision-report.md
data_generated: no_or_stale
needed_action: wait and rerun supervision
```
## Business Signals / Intelligence Map / Dashboard

- status: warning
- schedule: 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55

### Problems

- none

### Warnings

- latest same-date GitHub Pages workflow conclusion is skipped
- local Obsidian sync may be blocked by 59 dirty file(s)
- latest Business Signals workflow conclusion is failure, but same-date data and gates are healthy; repair branch / PR / publication only

### Actions

- none

### Repair Request

```text
none
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
