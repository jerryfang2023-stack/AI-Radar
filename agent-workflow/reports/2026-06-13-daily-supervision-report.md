# WaveSight Daily Supervision - 2026-06-13

- generated_at: 2026-06-13T02:45:49.861Z
- status: manual_required
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Warnings |
|---|---|---|---:|---:|
| Community Intelligence | 08:30 local task; watchdog 08:45; publish watchdog 08:55 | manual_required | 2 | 2 |
| Business Signals / Intelligence Map / Dashboard | 09:07 / 09:37 / 10:07 Asia/Shanghai; watchdog 10:20 | manual_required | 4 | 3 |
| First-Line Viewpoints | 09:17 / 09:47 / 10:17 Asia/Shanghai; watchdog 10:30 | manual_required | 2 | 1 |

## Community Intelligence

- status: manual_required
- schedule: 08:30 local task; watchdog 08:45; publish watchdog 08:55

### Problems

- community data date is 2026-06-12, expected 2026-06-13
- no same-date Community Intelligence publish workflow after 08:55 watchdog

### Warnings

- missing community gate report: agent-workflow/reports/2026-06-13-community-intelligence-gate.md
- Scheduled task check is Windows-only

### Actions

- manual dispatch `.github/workflows/daily-community-intelligence-pr.yml` after local collection and archive pass
- rerun `agent-workflow/tools/run-community-intelligence.ps1` locally
- send Codex a community_intelligence repair request with log and gate report path

### Repair Request

```text
lane: community_intelligence
failed_gate: missing
report_path: agent-workflow/reports/2026-06-13-daily-supervision-report.md
data_generated: no_or_stale
needed_action: manual dispatch
```
## Business Signals / Intelligence Map / Dashboard

- status: manual_required
- schedule: 09:07 / 09:37 / 10:07 Asia/Shanghai; watchdog 10:20

### Problems

- business-signal activeDate is 2026-06-12, expected 2026-06-13
- Top10 selected count is 0, expected 10
- signal card files 0 below 10
- no same-date Business Signals GitHub run after 10:20 watchdog

### Warnings

- missing same-date persistent asset manifest: agent-workflow/reports/2026-06-13-persistent-asset-manifest.json
- missing quality gate report: agent-workflow/reports/2026-06-13-guanlan-monitor-quality-gate.md
- missing readiness report: agent-workflow/reports/2026-06-13-daily-production-chain-readiness.md

### Actions

- manual dispatch `.github/workflows/daily-persistent-assets-pr.yml` for the production date
- send Codex a business_signals repair request with failed gate and report path

### Repair Request

```text
lane: business_signals
failed_gate: missing
report_path: agent-workflow/reports/2026-06-13-daily-supervision-report.md
data_generated: no_or_stale
needed_action: manual dispatch
```
## First-Line Viewpoints

- status: manual_required
- schedule: 09:17 / 09:47 / 10:17 Asia/Shanghai; watchdog 10:30

### Problems

- first-line data date is 2026-06-12, expected 2026-06-13
- no same-date First-Line Viewpoints GitHub run after 10:30 watchdog

### Warnings

- missing follow-builders gate report: agent-workflow/reports/2026-06-13-follow-builders-data-gate.md

### Actions

- manual dispatch `.github/workflows/daily-first-line-viewpoints-pr.yml` for the production date
- send Codex a first_line_viewpoints repair request with gate report path

### Repair Request

```text
lane: first_line_viewpoints
failed_gate: missing
report_path: agent-workflow/reports/2026-06-13-daily-supervision-report.md
data_generated: no_or_stale
needed_action: manual dispatch
```
