# WaveSight Daily Supervision - 2026-06-29

- generated_at: 2026-06-29T08:40:24.798Z
- status: failed
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Warnings |
|---|---|---|---:|---:|
| Skill Ops Governance | daily supervision preflight | passed | 0 | 0 |
| Community Intelligence | 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30 | warning | 0 | 1 |
| Business Signals / Intelligence Map / Dashboard | 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55 | warning | 0 | 3 |
| First-Line Viewpoints | 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Hermes RSS handoff 09:30 | passed | 0 | 0 |
| First-Line Viewpoints Skill | 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45 | failed | 2 | 0 |

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

- missing same-date persistent asset manifest: agent-workflow/reports/2026-06-29-persistent-asset-manifest.json
- local Obsidian sync may be blocked by 52 dirty file(s)
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

- status: failed
- schedule: 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45

### Problems

- missing follow-builders skill output file: 01-SiteV2/content/07-points/2026-06-29-builders-viewpoints.md
- follow-builders skill output item count 0 below 1

### Warnings

- none

### Actions

- send Codex a follow_builders_skill repair request with publish report path

### Repair Request

```text
lane: follow_builders_skill
failed_gate: follow_builders_skill daily supervision
report_path: agent-workflow/reports/2026-06-29-daily-supervision-report.md
data_generated: yes
needed_action: send Codex a follow_builders_skill repair request with publish report path
```
