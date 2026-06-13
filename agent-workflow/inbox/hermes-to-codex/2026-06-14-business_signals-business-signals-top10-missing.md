status: resolved
priority: urgent
lane: business_signals
category: business_signals_top10_missing
failed_gate: missing
report_path: agent-workflow/reports/2026-06-14-daily-supervision-report.md
data_generated: no_or_stale
needed_action: send Codex a business_signals repair request with failed gate and report path
created_at: 2026-06-14T03:17:19+08:00
updated_at: 2026-06-14T03:20:11+08:00
resolved_at: 2026-06-14T03:20:11+08:00
resolver: codex
fix_commit: pending-local-change
validation: npm run supervise:daily -- --date=2026-06-14
prevention_added: gate
source: hermes-auto

# Hermes Repair Request: Business Signals / Intelligence Map / Dashboard

## Evidence

- problem: business-signal activeDate is 2026-06-13, expected 2026-06-14
- problem: Top10 selected count is 0, expected 10
- problem: signal card files 0 below 10
- warning: missing same-date persistent asset manifest: agent-workflow/reports/2026-06-14-persistent-asset-manifest.json
- warning: missing quality gate report: agent-workflow/reports/2026-06-14-guanlan-monitor-quality-gate.md
- warning: missing readiness report: agent-workflow/reports/2026-06-14-daily-production-chain-readiness.md
- supervision_report: `agent-workflow/reports/2026-06-14-daily-supervision-report.md`
- categories: business_signals_top10_missing, monitor_or_gate_failure

## Expected Codex Action

- send Codex a business_signals repair request with failed gate and report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.

## Resolution - 2026-06-14T03:20:11+08:00

- fix_commit: pending-local-change
- validation: npm run supervise:daily -- --date=2026-06-14
- prevention_added: gate
- notes: Resolved after gating Business Signals supervision to the 09:55 handoff window; rerun no longer reports a same-date failure at 03:19 Asia/Shanghai.
