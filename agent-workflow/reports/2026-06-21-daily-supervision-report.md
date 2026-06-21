# WaveSight Daily Supervision - 2026-06-21

- generated_at: 2026-06-21T04:59:38.718Z
- status: failed
- github_mode: auto
- scheduled_task_mode: auto

| Lane | Timeline | Status | Problems | Warnings |
|---|---|---|---:|---:|
| Skill Ops Governance | daily supervision preflight | manual_required | 2 | 0 |
| Community Intelligence | 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30 | manual_required | 3 | 1 |
| Business Signals / Intelligence Map / Dashboard | 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55 | failed | 1 | 2 |
| First-Line Viewpoints | 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Hermes RSS handoff 09:30 | manual_required | 2 | 1 |
| First-Line Viewpoints Skill | 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45 | passed | 0 | 0 |

## Skill Ops Governance

- status: manual_required
- schedule: daily supervision preflight

### Problems

- guanlan-raw-pool-card: .skill-store sync state is drift
- guanlan-skill-editor: .skill-store sync state is drift

### Warnings

- none

### Actions

- repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
- run `npm run audit:skills` after the repair
- run `npm run sync:skill-store` after confirming the project copy is the source of truth

### Repair Request

```text
lane: skill_ops
failed_gate: skill_ops daily supervision
report_path: agent-workflow/reports/2026-06-21-daily-supervision-report.md
data_generated: not_applicable
needed_action: repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
```
## Community Intelligence

- status: manual_required
- schedule: 08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30

### Problems

- community data date is 2026-06-20, expected 2026-06-21
- community scheduled task last result is 267009
- Community Intelligence publish workflow conclusion is failure

### Warnings

- missing community gate report: agent-workflow/reports/2026-06-21-community-intelligence-gate.md

### Actions

- rerun `agent-workflow/tools/run-community-intelligence.ps1` locally
- send Codex a community_intelligence repair request with log and gate report path

### Repair Request

```text
lane: community_intelligence
failed_gate: missing
report_path: agent-workflow/reports/2026-06-21-daily-supervision-report.md
data_generated: no_or_stale
needed_action: rerun gate
```
## Business Signals / Intelligence Map / Dashboard

- status: failed
- schedule: 08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55

### Problems

- Business Signals workflow conclusion is failure

### Warnings

- latest same-date GitHub Pages workflow conclusion is skipped
- local Obsidian sync may be blocked by 55 dirty file(s)

### Actions

- send Codex a business_signals repair request with failed gate and report path

### Repair Request

```text
lane: business_signals
failed_gate: passed
report_path: agent-workflow/reports/2026-06-21-daily-supervision-report.md
data_generated: yes
needed_action: send Codex a business_signals repair request with failed gate and report path
```
## First-Line Viewpoints

- status: manual_required
- schedule: 08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Hermes RSS handoff 09:30

### Problems

- first-line data date is 2026-06-20, expected 2026-06-21
- no same-date First-Line Viewpoints RSS run after 09:30 Hermes handoff

### Warnings

- missing follow-builders gate report: agent-workflow/reports/2026-06-21-follow-builders-data-gate.md

### Actions

- run `npm run hermes:early-handoff -- --date=<YYYY-MM-DD>` or dispatch `.github/workflows/daily-first-line-viewpoints-pr.yml` for the production date
- send Codex a first_line_viewpoints repair request with gate report path

### Repair Request

```text
lane: first_line_viewpoints
failed_gate: missing
report_path: agent-workflow/reports/2026-06-21-daily-supervision-report.md
data_generated: no_or_stale
needed_action: run `npm run hermes:early-handoff -- --date=<YYYY-MM-DD>` or dispatch `.github/workflows/daily-first-line-viewpoints-pr.yml` for the production date
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
