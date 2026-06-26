# WaveSight Daily Supervision - 2026-06-25

- generated_at: 2026-06-25T03:28:39.903Z
- status: warning
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Warnings |
|---|---|---|---:|---:|
| Skill Ops Governance | daily supervision preflight | passed | 0 | 0 |
| Community Intelligence | 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30 | warning | 0 | 1 |
| Business Signals / Intelligence Map / Dashboard | 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55 | warning | 0 | 4 |
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

- status: warning
- schedule: 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30

### Problems

- none

### Warnings

- community scheduled task last result is 1, but same-date data and gate are healthy

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

- missing same-date persistent asset manifest: agent-workflow/reports/2026-06-25-persistent-asset-manifest.json
- latest same-date GitHub Pages workflow conclusion is skipped
- local Obsidian sync may be blocked by 56 dirty file(s)
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
