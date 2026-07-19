# WaveSight Daily Supervision - 2026-07-19

- generated_at: 2026-07-19T06:42:42.795Z
- status: warning
- github_mode: auto
- scheduled_task_mode: auto
- hermes_write: enabled

| Lane | Timeline | Status | Problems | Waiting | Warnings |
|---|---|---|---:|---:|---:|
| Skill Ops Governance | daily supervision preflight | passed | 0 | 0 | 0 |
| Community Intelligence | 08:30 local collection; 08:45 / 09:35 GitHub publish windows; Daily Problem Watchdog records failures to Hermes inbox | warning | 0 | 0 | 1 |
| Business Signals / Intelligence Map / Dashboard | 08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox | warning | 0 | 0 | 3 |
| First-Line Viewpoints | 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Daily Problem Watchdog records failures to Hermes inbox | passed | 0 | 0 | 0 |
| First-Line Viewpoints Skill | 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45 | passed | 0 | 0 | 0 |

## Skill Ops Governance

- status: passed
- schedule: daily supervision preflight

### Problems

- none

### Waiting

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

- status: warning
- schedule: 08:30 local collection; 08:45 / 09:35 GitHub publish windows; Daily Problem Watchdog records failures to Hermes inbox

### Problems

- none

### Waiting

- none

### Warnings

- same-date Community Intelligence automation PR already merged: https://github.com/jerryfang2023-stack/AI-Radar/pull/352

### Actions

- none

### Repair Request

```text
none
```
## Business Signals / Intelligence Map / Dashboard

- status: warning
- schedule: 08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox

### Problems

- none

### Waiting

- none

### Warnings

- latest same-date GitHub Pages workflow conclusion is skipped
- local Obsidian sync may be blocked by 1438 dirty file(s)
- latest Business Signals workflow conclusion is failure, but same-date data and gates are healthy; repair branch / PR / publication only

### Actions

- none

### Repair Request

```text
none
```
## First-Line Viewpoints

- status: passed
- schedule: 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Daily Problem Watchdog records failures to Hermes inbox

### Problems

- none

### Waiting

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

### Waiting

- none

### Warnings

- none

### Actions

- none

### Repair Request

```text
none
```
