status: resolved
priority: urgent
lane: business_signals
category: core_supply_shortfall
failed_gate: passed
report_path: agent-workflow/reports/2026-07-02-daily-supervision-report.md
data_generated: yes
needed_action: diagnose Raw/Pool/Core/non-large Core counts and refill only the deficient source/channel
created_at: 2026-07-02T11:18:08+08:00
updated_at: 2026-07-02T11:20:57+08:00
resolved_at: 2026-07-02T11:20:57+08:00
resolver: codex
fix_commit: pending-local-change
validation: npm run supervise:daily -- --date=2026-07-02
prevention_added: gate
source: hermes-auto

# Hermes Repair Request: Business Signals / Intelligence Map / Dashboard

## Evidence

- problem: signal card files 8 below 10
- problem: Business Signals workflow conclusion is cancelled
- warning: latest same-date GitHub Pages workflow conclusion is skipped
- supervision_report: `agent-workflow/reports/2026-07-02-daily-supervision-report.md`
- categories: core_supply_shortfall, monitor_or_gate_failure

## Expected Codex Action

- send Codex a business_signals repair request with failed gate and report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.

## Resolution - 2026-07-02T11:20:57+08:00

- fix_commit: pending-local-change
- validation: npm run supervise:daily -- --date=2026-07-02
- prevention_added: gate
