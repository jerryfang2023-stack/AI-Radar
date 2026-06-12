# WaveSight Daily Supervision - 2026-06-12

- generated_at: 2026-06-12T03:35:06.002Z
- status: failed
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Warnings |
|---|---|---|---:|---:|
| Community Intelligence | 08:30 local task; watchdog 08:45; publish watchdog 08:55 | manual_required | 1 | 0 |
| Business Signals / Intelligence Map / Dashboard | 09:07 / 09:37 / 10:07 Asia/Shanghai; watchdog 10:20 | failed | 4 | 3 |
| First-Line Viewpoints | 09:17 / 09:47 / 10:17 Asia/Shanghai; watchdog 10:30 | failed | 1 | 1 |

## Community Intelligence

- status: manual_required
- schedule: 08:30 local task; watchdog 08:45; publish watchdog 08:55

### Problems

- no same-date Community Intelligence publish workflow after 08:55 watchdog

### Warnings

- none

### Actions

- manual dispatch `.github/workflows/daily-community-intelligence-pr.yml` after local collection and archive pass
- send Codex a community_intelligence repair request with log and gate report path

### Repair Request

```text
lane: community_intelligence
failed_gate: agent-workflow/reports/2026-06-12-community-intelligence-gate.md
data_generated: yes
needed_action: manual dispatch `.github/workflows/daily-community-intelligence-pr.yml` after local collection and archive pass
```
## Business Signals / Intelligence Map / Dashboard

- status: failed
- schedule: 09:07 / 09:37 / 10:07 Asia/Shanghai; watchdog 10:20

### Problems

- business-signal activeDate is 2026-06-11, expected 2026-06-12
- Top10 selected count is 0, expected 10
- signal card files 0 below 10
- Business Signals workflow conclusion is failure

### Warnings

- missing same-date persistent asset manifest: agent-workflow/reports/2026-06-12-persistent-asset-manifest.json
- missing quality gate report: agent-workflow/reports/2026-06-12-guanlan-monitor-quality-gate.md
- missing readiness report: agent-workflow/reports/2026-06-12-daily-production-chain-readiness.md

### Actions

- send Codex a business_signals repair request with failed gate and report path

### Repair Request

```text
lane: business_signals
failed_gate: missing
data_generated: yes
needed_action: send Codex a business_signals repair request with failed gate and report path
```
## First-Line Viewpoints

- status: failed
- schedule: 09:17 / 09:47 / 10:17 Asia/Shanghai; watchdog 10:30

### Problems

- first-line data date is 2026-06-11, expected 2026-06-12

### Warnings

- missing follow-builders gate report: agent-workflow/reports/2026-06-12-follow-builders-data-gate.md

### Actions

- send Codex a first_line_viewpoints repair request with gate report path

### Repair Request

```text
lane: first_line_viewpoints
failed_gate: missing
data_generated: no_or_stale
needed_action: send Codex a first_line_viewpoints repair request with gate report path
```
