status: open
priority: normal
lane: first_line_viewpoints
category: monitor_or_gate_failure
failed_gate: missing
report_path: agent-workflow/reports/2026-06-13-daily-supervision-report.md
data_generated: no_or_stale
needed_action: manual dispatch
created_at: 2026-06-13T10:45:49+08:00
updated_at: 2026-06-13T10:45:49+08:00
source: hermes-auto

# Hermes Repair Request: First-Line Viewpoints

## Evidence

- problem: first-line data date is 2026-06-12, expected 2026-06-13
- problem: no same-date First-Line Viewpoints GitHub run after 10:30 watchdog
- warning: missing follow-builders gate report: agent-workflow/reports/2026-06-13-follow-builders-data-gate.md
- supervision_report: `agent-workflow/reports/2026-06-13-daily-supervision-report.md`
- categories: monitor_or_gate_failure, first_line_viewpoints

## Expected Codex Action

- manual dispatch `.github/workflows/daily-first-line-viewpoints-pr.yml` for the production date
- send Codex a first_line_viewpoints repair request with gate report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.
