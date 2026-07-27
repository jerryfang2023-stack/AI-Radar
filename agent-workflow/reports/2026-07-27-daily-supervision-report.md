# WaveSight Daily Supervision - 2026-07-27

- generated_at: 2026-07-27T06:15:20.825Z
- status: waiting
- github_mode: auto
- scheduled_task_mode: auto
- hermes_write: disabled

| Lane | Timeline | Status | Problems | Waiting | Warnings |
|---|---|---|---:|---:|---:|
| Skill Ops Governance | daily supervision preflight | passed | 0 | 0 | 0 |
| Community Intelligence | 08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication check; 16:45 final closure | warning | 0 | 0 | 1 |
| Business Signals compatibility / Operations | 08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback | warning | 0 | 0 | 2 |
| First-Line Viewpoints | 08:30 local RSS collection + page build + Obsidian sync; 09:15 conditional fallback; 09:50 consolidated closure | passed | 0 | 0 | 0 |
| First-Line Viewpoints Skill | 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45 | waiting | 0 | 1 | 0 |

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
- schedule: 08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication check; 16:45 final closure

### Problems

- none

### Waiting

- none

### Warnings

- GitHub CLI unavailable or unauthenticated: spawnSync gh ETIMEDOUT

### Actions

- none

### Repair Request

```text
none
```
## Business Signals compatibility / Operations

- status: warning
- schedule: 08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback

### Problems

- none

### Waiting

- none

### Warnings

- latest same-date GitHub Pages workflow conclusion is skipped
- local Obsidian sync may be blocked by 76 dirty file(s)

### Actions

- none

### Repair Request

```text
none
```
## First-Line Viewpoints

- status: passed
- schedule: 08:30 local RSS collection + page build + Obsidian sync; 09:15 conditional fallback; 09:50 consolidated closure

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

- status: waiting
- schedule: 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45

### Problems

- none

### Waiting

- awaiting the 16:10 follow-builders skill publish and 16:30 Hermes record window

### Warnings

- none

### Actions

- none

### Repair Request

```text
none
```
