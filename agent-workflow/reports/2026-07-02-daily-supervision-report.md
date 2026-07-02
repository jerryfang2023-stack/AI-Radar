# WaveSight Daily Supervision - 2026-07-02

- generated_at: 2026-07-02T03:20:31.647Z
- status: manual_required
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Waiting | Warnings |
|---|---|---|---:|---:|---:|
| Skill Ops Governance | daily supervision preflight | manual_required | 1 | 0 | 0 |
| Community Intelligence | 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Daily Problem Watchdog records failures to Hermes inbox | warning | 0 | 0 | 1 |
| Business Signals / Intelligence Map / Dashboard | 08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox | warning | 0 | 0 | 4 |
| First-Line Viewpoints | 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Daily Problem Watchdog records failures to Hermes inbox | passed | 0 | 0 | 0 |
| First-Line Viewpoints Skill | 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45 | passed | 0 | 0 | 0 |

## Skill Ops Governance

- status: manual_required
- schedule: daily supervision preflight

### Problems

- skill-registry.md is stale; run npm run build:skill-registry

### Waiting

- none

### Warnings

- none

### Actions

- repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
- run `npm run audit:skills` after the repair

### Repair Request

```text
lane: skill_ops
failed_gate: skill_ops daily supervision
report_path: agent-workflow/reports/2026-07-02-daily-supervision-report.md
data_generated: not_applicable
needed_action: repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
```
## Community Intelligence

- status: warning
- schedule: 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Daily Problem Watchdog records failures to Hermes inbox

### Problems

- none

### Waiting

- none

### Warnings

- same-date Community Intelligence automation PR already merged: https://github.com/jerryfang2023-stack/AI-Radar/pull/189

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

- signal card files 8 below 10, but source-backed Core Pool Top10 fallback is healthy
- latest same-date GitHub Pages workflow conclusion is skipped
- local Obsidian sync may be blocked by 3 dirty file(s)
- latest Business Signals workflow conclusion is cancelled, but same-date data and gates are healthy; repair branch / PR / publication only

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
