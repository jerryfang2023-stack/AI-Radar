# WaveSight Weekly Health - 2026-07-20 to 2026-07-26

- generated_at: 2026-07-26T11:16:52.402Z
- status: review
- days: 7

## Daily Supervision Coverage

| Date | Status | Lane statuses |
|---|---|---|
| 2026-07-20 | missing | none |
| 2026-07-21 | missing | none |
| 2026-07-22 | missing | none |
| 2026-07-23 | missing | none |
| 2026-07-24 | missing | none |
| 2026-07-25 | waiting | skill_ops:passed<br>community_intelligence:warning<br>business_signals:passed<br>first_line_viewpoints:passed<br>follow_builders_skill:waiting |
| 2026-07-26 | failed | skill_ops:passed<br>community_intelligence:warning<br>business_signals:failed<br>first_line_viewpoints:passed<br>follow_builders_skill:waiting |

## Lane Status Totals

- community_intelligence:warning: 2
- first_line_viewpoints:passed: 2
- follow_builders_skill:waiting: 2
- skill_ops:passed: 2
- business_signals:failed: 1
- business_signals:passed: 1

## Recurring Problems

- none

## Recurring Warnings

- community_intelligence: community scheduled task last result is <n>, but same-date data and gate are healthy: 2

## Production Incident Loop

- incidents_in_window: 4
- unresolved_incidents: 0

| Date | Lane | Status | Failed Gate | Categories | File |
|---|---|---|---|---|---|
| 2026-07-23 | follow_builders_skill | resolved | agent-workflow/reports/2026-07-23-daily-supervision-report.md | monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-07-23-follow_builders_skill-afternoon-skill-runner.md` |
| 2026-07-24 | business_signals | resolved | missing | monitor_or_gate_failure<br>obsidian_sync | `agent-workflow/inbox/hermes-to-codex/2026-07-24-business_signals-no-run-or-stale-assets.md` |
| 2026-07-25 | business_signals | manual_archive | missing | monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-07-25-business_signals-no-run-or-stale-assets.md` |
| 2026-07-25 | community_intelligence | manual_archive | agent-workflow/reports/2026-07-25-community-intelligence-gate.md | monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-07-25-community_intelligence-community-intelligence.md` |

## Repeated Incident Categories

- business_signals: monitor_or_gate_failure: 2

## Action Log Loop

- action_records_in_window: 14
- failed_or_partial_records: 0
- unregistered_records: 11

- none

## Repeated Action Log Issues

- none

## Learning Loop Escalations

- Daily supervision recurring warning (2x): community_intelligence: community scheduled task last result is <n>, but same-date data and gate are healthy. Decide whether it should stay warning or become a gate.
- Production incident category repeated (2x): business_signals: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.

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

- Backfill or intentionally skip missing daily supervision reports: 2026-07-20, 2026-07-21, 2026-07-22, 2026-07-23, 2026-07-24
- Review Learning Loop Escalations and convert repeated incidents into gate / eval / MEMORY changes.
