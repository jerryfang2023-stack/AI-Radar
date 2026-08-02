# WaveSight Weekly Health - 2026-07-27 to 2026-08-02

- generated_at: 2026-08-02T11:13:59.967Z
- status: review
- days: 7

## Daily Supervision Coverage

| Date | Status | Lane statuses |
|---|---|---|
| 2026-07-27 | waiting | skill_ops:passed<br>community_intelligence:warning<br>business_signals:warning<br>first_line_viewpoints:passed<br>follow_builders_skill:waiting |
| 2026-07-28 | manual_required | skill_ops:manual_required<br>community_intelligence:passed<br>business_signals:passed<br>first_line_viewpoints:passed<br>follow_builders_skill:waiting |
| 2026-07-29 | passed | skill_ops:passed<br>community_intelligence:passed<br>business_signals:passed<br>first_line_viewpoints:passed<br>follow_builders_skill:passed |
| 2026-07-30 | passed | skill_ops:passed<br>community_intelligence:passed<br>business_signals:passed<br>first_line_viewpoints:passed<br>follow_builders_skill:passed |
| 2026-07-31 | missing | none |
| 2026-08-01 | missing | none |
| 2026-08-02 | missing | none |

## Lane Status Totals

- first_line_viewpoints:passed: 4
- business_signals:passed: 3
- community_intelligence:passed: 3
- skill_ops:passed: 3
- follow_builders_skill:passed: 2
- follow_builders_skill:waiting: 2
- business_signals:warning: 1
- community_intelligence:warning: 1
- skill_ops:manual_required: 1

## Recurring Problems

- none

## Recurring Warnings

- none

## Production Incident Loop

- incidents_in_window: 2
- unresolved_incidents: 0

| Date | Lane | Status | Failed Gate | Categories | File |
|---|---|---|---|---|---|
| 2026-07-30 | business_signals | resolved | repeated daily supervision signal | monitor_or_gate_failure | `agent-workflow/inbox/production-incidents/2026-07-30-business-signals-recurring-fef63b1d095e1eec.md` |
| 2026-07-30 | community_intelligence | resolved | repeated daily supervision signal | monitor_or_gate_failure | `agent-workflow/inbox/production-incidents/2026-07-30-community-intelligence-recurring-73a400f41c5af405.md` |

## Repeated Incident Categories

- none

## Action Log Loop

- action_records_in_window: 21
- failed_or_partial_records: 0
- unregistered_records: 12

- none

## Repeated Action Log Issues

- none

## Learning Loop Escalations

- none

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

- Backfill or intentionally skip missing daily supervision reports: 2026-07-31, 2026-08-01, 2026-08-02
