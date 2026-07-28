# WaveSight Daily Supervision - 2026-07-28

- generated_at: 2026-07-28T06:37:58.075Z
- status: manual_required
- github_mode: auto
- scheduled_task_mode: auto
- hermes_write: disabled

| Lane | Timeline | Status | Problems | Waiting | Warnings |
|---|---|---|---:|---:|---:|
| Skill Ops Governance | daily supervision preflight | manual_required | 28 | 0 | 0 |
| Community Intelligence | 08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication check; 16:45 final closure | passed | 0 | 0 | 0 |
| Data Center V4 / Business Signals Operations | 08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback | passed | 0 | 0 | 0 |
| First-Line Viewpoints | 08:30 local RSS collection + page build + Obsidian sync; 09:15 conditional fallback; 09:50 consolidated closure | passed | 0 | 0 | 0 |
| First-Line Viewpoints Skill | 16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45 | waiting | 0 | 1 | 0 |

## Skill Ops Governance

- status: manual_required
- schedule: daily supervision preflight

### Problems

- guanlan-data-center-supervisor: repo Skill runtime sync state is project-only
- guanlan-business-signals-monitor: repo Skill runtime sync state is project-only
- guanlan-source-ingestion: repo Skill runtime sync state is project-only
- guanlan-enterprise-ai-fde-monitor: repo Skill runtime sync state is project-only
- guanlan-event-normalizer: repo Skill runtime sync state is project-only
- guanlan-first-line-viewpoints-monitor: repo Skill runtime sync state is project-only
- guanlan-community-intelligence-monitor: repo Skill runtime sync state is project-only
- guanlan-data-integrity-gate: repo Skill runtime sync state is project-only
- guanlan-daily-monitor: repo Skill runtime sync state is project-only
- guanlan-fde-data-projection: repo Skill runtime sync state is project-only
- guanlan-ai-hardware-data-projection: repo Skill runtime sync state is project-only
- guanlan-monitor-quality-gate: repo Skill runtime sync state is project-only
- guanlan-daily-monitor-qc: repo Skill runtime sync state is project-only
- guanlan-taxonomy-governor: repo Skill runtime sync state is project-only
- guanlan-raw-pool-card: repo Skill runtime sync state is project-only
- guanlan-trend-candidate-writer: repo Skill runtime sync state is project-only
- follow-builders: repo Skill runtime sync state is project-only
- guanlan-weekly-business-change-radar: repo Skill runtime sync state is project-only
- guanlan-funding-insight-generator: repo Skill runtime sync state is project-only
- guanlan-trend-radar-updater: repo Skill runtime sync state is project-only
- guanlan-weekly-report-page-generator: repo Skill runtime sync state is project-only
- guanlan-opportunity-radar-updater: repo Skill runtime sync state is project-only
- guanlan-monthly-business-structure-report: repo Skill runtime sync state is project-only
- guanlan-monthly-report-page-generator: repo Skill runtime sync state is project-only
- guanlan-typography-qc: repo Skill runtime sync state is project-only
- guanlan-skill-editor: repo Skill runtime sync state is project-only
- guanlan-code-rule-auditor: repo Skill runtime sync state is project-only
- Skill discovery summary is stale; run npm run build:skill-store-dashboard

### Waiting

- none

### Warnings

- none

### Actions

- repair the owning Guanlan skill metadata, evals, examples, registry, repo runtime, discovery config, or compatibility mirror
- run `npm run repair:skills` after confirming the project copy is the source of truth

### Repair Request

```text
lane: skill_ops
failed_gate: skill_ops daily supervision
report_path: agent-workflow/reports/2026-07-28-daily-supervision-report.md
data_generated: not_applicable
needed_action: repair the owning Guanlan skill metadata, evals, examples, registry, repo runtime, discovery config, or compatibility mirror
```
## Community Intelligence

- status: passed
- schedule: 08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication check; 16:45 final closure

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
## Data Center V4 / Business Signals Operations

- status: passed
- schedule: 08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback

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
