# WaveSight Daily Supervision - 2026-07-25

- generated_at: 2026-07-25T02:03:54.974Z
- status: failed
- github_mode: auto
- scheduled_task_mode: auto
- hermes_write: enabled

| Lane | Timeline | Status | Problems | Waiting | Warnings |
|---|---|---|---:|---:|---:|
| Skill Ops Governance | daily supervision preflight | passed | 0 | 0 | 0 |
| Community Intelligence | 08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication closure | manual_required | 1 | 0 | 1 |
| Business Signals / Intelligence Map / Dashboard | 08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback | failed | 4 | 0 | 4 |
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

- status: manual_required
- schedule: 08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication closure

### Problems

- no same-date Community Intelligence publish workflow after the morning publication window

### Waiting

- none

### Warnings

- community scheduled task last result is 3221225786, but same-date data and gate are healthy

### Actions

- inspect the Daily Problem Watchdog inbox report, then dispatch `.github/workflows/daily-community-intelligence-pr.yml` only after local collection and archive pass
- send Codex a community_intelligence repair request with log and gate report path

### Repair Request

```text
lane: community_intelligence
failed_gate: agent-workflow/reports/2026-07-25-community-intelligence-gate.md
report_path: agent-workflow/reports/2026-07-25-daily-supervision-report.md
data_generated: yes
needed_action: inspect the Daily Problem Watchdog inbox report, then dispatch `.github/workflows/daily-community-intelligence-pr.yml` only after local collection and archive pass
```
## Business Signals / Intelligence Map / Dashboard

- status: failed
- schedule: 08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback

### Problems

- business-signal activeDate is 2026-07-24, expected 2026-07-25
- public Card count is 0 for 2026-07-25
- no same-date signal Card files or frontstage Core Signal Cards
- Business Signals workflow conclusion is failure

### Waiting

- none

### Warnings

- missing same-date persistent asset manifest: agent-workflow/reports/2026-07-25-persistent-asset-manifest.json
- missing quality gate report: agent-workflow/reports/2026-07-25-guanlan-monitor-quality-gate.md
- missing readiness report: agent-workflow/reports/2026-07-25-daily-production-chain-readiness.md
- latest same-date GitHub Pages workflow conclusion is skipped

### Actions

- send Codex a business_signals repair request with failed gate and report path

### Repair Request

```text
lane: business_signals
failed_gate: missing
report_path: agent-workflow/reports/2026-07-25-daily-supervision-report.md
data_generated: no_or_stale
needed_action: sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow
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
