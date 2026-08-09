# WaveSight Weekly Health - 2026-08-03 to 2026-08-09

- generated_at: 2026-08-09T10:29:35.372Z
- status: review
- days: 7

## Daily Supervision Coverage

| Date | Status | Lane statuses |
|---|---|---|
| 2026-08-03 | missing | none |
| 2026-08-04 | missing | none |
| 2026-08-05 | missing | none |
| 2026-08-06 | missing | none |
| 2026-08-07 | missing | none |
| 2026-08-08 | missing | none |
| 2026-08-09 | missing | none |

## Lane Status Totals

- none

## Recurring Problems

- none

## Recurring Warnings

- none

## Production Incident Loop

- incidents_in_window: 9
- unresolved_incidents: 5

| Date | Lane | Status | Failed Gate | Categories | File |
|---|---|---|---|---|---|
| 2026-08-04 | business_signals | resolved | repeated daily supervision signal | monitor_or_gate_failure<br>guanlan_vault_projection | `agent-workflow/inbox/production-incidents/2026-08-04-business-signals-recurring-05f820ce67869f02.md` |
| 2026-08-05 | business_signals | resolved | repeated daily supervision signal | monitor_or_gate_failure<br>guanlan_vault_projection | `agent-workflow/inbox/production-incidents/2026-08-05-business-signals-recurring-05f820ce67869f02.md` |
| 2026-08-05 | skill_ops | resolved | repeated daily supervision signal | monitor_or_gate_failure | `agent-workflow/inbox/production-incidents/2026-08-05-skill-ops-recurring-042a16c9ca245da3.md` |
| 2026-08-05 | skill_ops | resolved | repeated daily supervision signal | monitor_or_gate_failure | `agent-workflow/inbox/production-incidents/2026-08-05-skill-ops-recurring-779272b982471f71.md` |
| 2026-08-09 | business_signals | open | repeated daily supervision signal | monitor_or_gate_failure<br>guanlan_vault_projection | `agent-workflow/inbox/production-incidents/2026-08-09-business-signals-recurring-05f820ce67869f02.md` |
| 2026-08-09 | first_line_viewpoints | open | repeated daily supervision signal | monitor_or_gate_failure | `agent-workflow/inbox/production-incidents/2026-08-09-first-line-viewpoints-recurring-38b0aa2aca98027e.md` |
| 2026-08-09 | first_line_viewpoints | open | repeated daily supervision signal | monitor_or_gate_failure | `agent-workflow/inbox/production-incidents/2026-08-09-first-line-viewpoints-recurring-960303398b491ab3.md` |
| 2026-08-09 | skill_ops | open | repeated daily supervision signal | monitor_or_gate_failure | `agent-workflow/inbox/production-incidents/2026-08-09-skill-ops-recurring-042a16c9ca245da3.md` |
| 2026-08-09 | skill_ops | open | repeated daily supervision signal | monitor_or_gate_failure | `agent-workflow/inbox/production-incidents/2026-08-09-skill-ops-recurring-779272b982471f71.md` |

## Repeated Incident Categories

- skill_ops: monitor_or_gate_failure: 4
- business_signals: guanlan_vault_projection: 3
- business_signals: monitor_or_gate_failure: 3
- first_line_viewpoints: monitor_or_gate_failure: 2

## Action Log Loop

- action_records_in_window: 10
- failed_or_partial_records: 2
- unregistered_records: 9

| Date | Action | Status | Summary |
|---|---|---|---|
| 2026-08-03 | daily-persistent-assets-pr | partial | Normalized spaced dash variants in source-title translation keys so resumed 2026-08-03 intake reuses an approved translation and passes source-title integrity. |
| 2026-08-03 | weekly-report | partial | Raised the periodic report DeepSeek timeout from 180 to 300 seconds after two cloud runs failed at the timeout boundary while the exact local request completed in 80 seconds; added failed child diagnostics to controller output. |

## Repeated Action Log Issues

- none

## Learning Loop Escalations

- Production incident category repeated (3x): business_signals: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.
- Production incident category repeated (3x): business_signals: guanlan_vault_projection. Add a regression eval and durable MEMORY entry if not already present.
- Production incident category repeated (4x): skill_ops: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.
- Production incident category repeated (2x): first_line_viewpoints: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.
- Unresolved production incident: agent-workflow/inbox/production-incidents/2026-08-09-business-signals-recurring-05f820ce67869f02.md. Repair and rerun the failed gate before closing.
- Unresolved production incident: agent-workflow/inbox/production-incidents/2026-08-09-first-line-viewpoints-recurring-38b0aa2aca98027e.md. Repair and rerun the failed gate before closing.
- Unresolved production incident: agent-workflow/inbox/production-incidents/2026-08-09-first-line-viewpoints-recurring-960303398b491ab3.md. Repair and rerun the failed gate before closing.
- Unresolved production incident: agent-workflow/inbox/production-incidents/2026-08-09-skill-ops-recurring-042a16c9ca245da3.md. Repair and rerun the failed gate before closing.
- Unresolved production incident: agent-workflow/inbox/production-incidents/2026-08-09-skill-ops-recurring-779272b982471f71.md. Repair and rerun the failed gate before closing.

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

- Backfill or intentionally skip missing daily supervision reports: 2026-08-03, 2026-08-04, 2026-08-05, 2026-08-06, 2026-08-07, 2026-08-08, 2026-08-09
- Review Learning Loop Escalations and convert repeated incidents into gate / eval / MEMORY changes.
