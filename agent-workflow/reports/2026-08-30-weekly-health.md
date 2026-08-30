# WaveSight Weekly Health - 2026-08-24 to 2026-08-30

- generated_at: 2026-08-30T14:39:33.059Z
- status: review
- days: 7

## Daily Supervision Coverage

| Date | Status | Lane statuses |
|---|---|---|
| 2026-08-24 | missing | none |
| 2026-08-25 | passed | skill_ops:passed<br>community_intelligence:passed<br>business_signals:passed<br>first_line_viewpoints:passed<br>follow_builders_skill:passed |
| 2026-08-26 | missing | none |
| 2026-08-27 | passed | skill_ops:passed<br>community_intelligence:passed<br>business_signals:passed<br>first_line_viewpoints:passed<br>follow_builders_skill:passed |
| 2026-08-28 | missing | none |
| 2026-08-29 | missing | none |
| 2026-08-30 | missing | none |

## Lane Status Totals

- business_signals:passed: 2
- community_intelligence:passed: 2
- first_line_viewpoints:passed: 2
- follow_builders_skill:passed: 2
- skill_ops:passed: 2

## Recurring Problems

- none

## Recurring Warnings

- none

## Production Incident Loop

- incidents_in_window: 3
- unresolved_incidents: 0

| Date | Lane | Status | Failed Gate | Categories | File |
|---|---|---|---|---|---|
| 2026-08-24 | business_signals | resolved | repeated daily supervision signal | monitor_or_gate_failure<br>guanlan_vault_projection | `agent-workflow/inbox/production-incidents/2026-08-24-business-signals-recurring-9b3705b9af766a92.md` |
| 2026-08-26 | automation | resolved | hermes_control_plane_watchdog | monitor_or_gate_failure | `agent-workflow/inbox/production-incidents/2026-08-26-automation-control-plane-liveness.md` |
| 2026-08-27 | automation | resolved | hermes_control_plane_watchdog | monitor_or_gate_failure | `agent-workflow/inbox/production-incidents/2026-08-27-automation-control-plane-liveness.md` |

## Repeated Incident Categories

- automation: monitor_or_gate_failure: 2

## Action Log Loop

- action_records_in_window: 1
- failed_or_partial_records: 0
- unregistered_records: 0

- none

## Repeated Action Log Issues

- none

## Learning Loop Escalations

- Production incident category repeated (2x): automation: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.

## GitHub Workflow Health

| Workflow | Available | Runs | Failures | In progress |
|---|---:|---:|---:|---:|
| daily-persistent-assets-pr.yml | yes | 0 | 0 | 0 |
| daily-first-line-viewpoints-pr.yml | yes | 0 | 0 | 0 |
| github-pages.yml | yes | 0 | 0 | 0 |

## Historical / Conflict Signals To Review

- suspicious_match_count: 0

- none

## Recommended Actions

- Backfill or intentionally skip missing daily supervision reports: 2026-08-24, 2026-08-26, 2026-08-28, 2026-08-29, 2026-08-30
- Review Learning Loop Escalations and convert repeated incidents into gate / eval / MEMORY changes.
