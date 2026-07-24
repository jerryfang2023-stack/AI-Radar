# WaveSight Daily Supervision - 2026-07-23

- generated_at: 2026-07-24T08:57:54.503Z
- status: failed
- github_mode: off
- scheduled_task_mode: off
- hermes_write: disabled

| Lane | Timeline | Status | Problems | Waiting | Warnings |
|---|---|---|---:|---:|---:|
| Skill Ops Governance | daily supervision preflight | passed | 0 | 0 | 0 |
| Community Intelligence | 08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication closure | failed | 1 | 0 | 2 |
| Business Signals / Intelligence Map / Dashboard | 08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback | warning | 0 | 0 | 2 |
| First-Line Viewpoints | 08:30 local RSS collection + page build + Obsidian sync; 09:15 conditional fallback; 09:50 consolidated closure | warning | 0 | 0 | 1 |
| First-Line Viewpoints Skill | 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45 | manual_required | 3 | 0 | 1 |

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

- status: failed
- schedule: 08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication closure

### Problems

- community data date is 2026-07-24, expected 2026-07-23

### Waiting

- none

### Warnings

- Scheduled task check skipped by flag
- GitHub check skipped by flag

### Actions

- rerun `agent-workflow/tools/run-community-intelligence.ps1` locally
- send Codex a community_intelligence repair request with log and gate report path

### Repair Request

```text
lane: community_intelligence
failed_gate: agent-workflow/reports/2026-07-23-community-intelligence-gate.md
report_path: agent-workflow/reports/2026-07-23-daily-supervision-report.md
data_generated: no_or_stale
needed_action: rerun gate
```
## Business Signals / Intelligence Map / Dashboard

- status: warning
- schedule: 08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback

### Problems

- none

### Waiting

- none

### Warnings

- local Obsidian sync may be blocked by 97 dirty file(s)
- GitHub check skipped by flag

### Actions

- none

### Repair Request

```text
none
```
## First-Line Viewpoints

- status: warning
- schedule: 08:30 local RSS collection + page build + Obsidian sync; 09:15 conditional fallback; 09:50 consolidated closure

### Problems

- none

### Waiting

- none

### Warnings

- GitHub check skipped by flag

### Actions

- none

### Repair Request

```text
none
```
## First-Line Viewpoints Skill

- status: manual_required
- schedule: 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45

### Problems

- missing follow-builders skill output file: 01-SiteV2/content/07-points/2026-07-23-builders-viewpoints.md
- follow-builders skill output item count 0 below 1
- no same-date follow-builders skill publish report after 16:30 watchdog

### Waiting

- none

### Warnings

- follow-builders skill publish report is missing before Hermes record time

### Actions

- run `powershell -NoProfile -ExecutionPolicy Bypass -File agent-workflow/tools/run-follow-builders-skill.ps1` locally
- send Codex a follow_builders_skill repair request with publish report path

### Repair Request

```text
lane: follow_builders_skill
failed_gate: follow_builders_skill daily supervision
report_path: agent-workflow/reports/2026-07-23-daily-supervision-report.md
data_generated: no
needed_action: run the local follow-builders skill publisher and inspect the generated publish report
```
