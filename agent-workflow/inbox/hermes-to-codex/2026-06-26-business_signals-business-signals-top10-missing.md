status: open
priority: urgent
lane: business_signals
category: business_signals_top10_missing
failed_gate: missing
report_path: agent-workflow/reports/2026-06-26-daily-supervision-report.md
data_generated: no_or_stale
needed_action: send Codex a business_signals repair request with failed gate and report path
created_at: 2026-06-26T12:52:35+08:00
updated_at: 2026-06-26T12:57:34+08:00
source: hermes-auto

# Hermes Repair Request: Business Signals / Intelligence Map / Dashboard

## Evidence

- problem: business-signal activeDate is 2026-06-25, expected 2026-06-26
- problem: Top10 selected count is 0, expected 10
- problem: signal card files 0 below 10
- problem: Business Signals workflow conclusion is failure
- warning: missing same-date persistent asset manifest: agent-workflow/reports/2026-06-26-persistent-asset-manifest.json
- warning: missing quality gate report: agent-workflow/reports/2026-06-26-guanlan-monitor-quality-gate.md
- warning: missing readiness report: agent-workflow/reports/2026-06-26-daily-production-chain-readiness.md
- warning: local Obsidian sync may be blocked by 47 dirty file(s)
- supervision_report: `agent-workflow/reports/2026-06-26-daily-supervision-report.md`
- categories: business_signals_top10_missing, monitor_or_gate_failure, obsidian_sync

## Expected Codex Action

- send Codex a business_signals repair request with failed gate and report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.
