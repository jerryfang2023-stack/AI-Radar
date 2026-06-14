status: open
priority: normal
lane: business_signals
category: business_signals_top10_missing
failed_gate: missing
report_path: agent-workflow/reports/2026-06-13-daily-supervision-report.md
data_generated: no_or_stale
needed_action: manual dispatch
created_at: 2026-06-13T10:45:49+08:00
updated_at: 2026-06-13T10:45:49+08:00
source: hermes-auto

# Hermes Repair Request: Business Signals / Intelligence Map / Dashboard

## Evidence

- problem: business-signal activeDate is 2026-06-12, expected 2026-06-13
- problem: Top10 selected count is 0, expected 10
- problem: signal card files 0 below 10
- problem: no same-date Business Signals GitHub run after 10:20 watchdog
- warning: missing same-date persistent asset manifest: agent-workflow/reports/2026-06-13-persistent-asset-manifest.json
- warning: missing quality gate report: agent-workflow/reports/2026-06-13-guanlan-monitor-quality-gate.md
- warning: missing readiness report: agent-workflow/reports/2026-06-13-daily-production-chain-readiness.md
- supervision_report: `agent-workflow/reports/2026-06-13-daily-supervision-report.md`
- categories: business_signals_top10_missing, monitor_or_gate_failure

## Expected Codex Action

- manual dispatch `.github/workflows/daily-persistent-assets-pr.yml` for the production date
- send Codex a business_signals repair request with failed gate and report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.
