# WaveSight Daily Supervision - 2026-06-26

- generated_at: 2026-06-26T04:57:34.488Z
- status: failed
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Warnings |
|---|---|---|---:|---:|
| Skill Ops Governance | daily supervision preflight | passed | 0 | 0 |
| Community Intelligence | 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30 | waiting | 1 | 1 |
| Business Signals / Intelligence Map / Dashboard | 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55 | failed | 4 | 4 |
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

- status: waiting
- schedule: 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30

### Problems

- Community Intelligence publication PR is open: https://github.com/jerryfang2023-stack/AI-Radar/pull/140

### Warnings

- community scheduled task last result is 1, but same-date data and gate are healthy

### Actions

- wait for Community Intelligence PR merge before declaring publication missing
- send Codex a community_intelligence repair request with log and gate report path

### Repair Request

```text
lane: community_intelligence
failed_gate: agent-workflow/reports/2026-06-26-community-intelligence-gate.md
report_path: agent-workflow/reports/2026-06-26-daily-supervision-report.md
data_generated: yes
needed_action: wait and rerun supervision
```
## Business Signals / Intelligence Map / Dashboard

- status: failed
- schedule: 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55

### Problems

- business-signal activeDate is 2026-06-25, expected 2026-06-26
- Top10 selected count is 0, expected 10
- signal card files 0 below 10
- Business Signals workflow conclusion is failure

### Warnings

- missing same-date persistent asset manifest: agent-workflow/reports/2026-06-26-persistent-asset-manifest.json
- missing quality gate report: agent-workflow/reports/2026-06-26-guanlan-monitor-quality-gate.md
- missing readiness report: agent-workflow/reports/2026-06-26-daily-production-chain-readiness.md
- local Obsidian sync may be blocked by 47 dirty file(s)

### Actions

- send Codex a business_signals repair request with failed gate and report path

### Repair Request

```text
lane: business_signals
failed_gate: missing
report_path: agent-workflow/reports/2026-06-26-daily-supervision-report.md
data_generated: no_or_stale
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
