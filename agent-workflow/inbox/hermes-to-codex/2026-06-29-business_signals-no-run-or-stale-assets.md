status: resolved
priority: urgent
lane: business_signals
category: no_run_or_stale_assets
failed_gate: missing
report_path: agent-workflow/reports/2026-06-29-daily-supervision-report.md
data_generated: no_or_stale
needed_action: sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow
created_at: 2026-06-29T13:06:03+08:00
updated_at: 2026-06-29T13:34:44+08:00
resolved_at: 2026-06-29T13:34:44+08:00
resolver: codex
fix_commit: pending-local-change
validation: assert-business-signals-frontstage 2026-06-29; assert-daily-production-chain pre-commit block-stale; assert-pool-to-card-dedupe
prevention_added: gate
source: hermes-auto

# Hermes Repair Request: Business Signals / Intelligence Map / Dashboard

## Evidence

- problem: business-signal activeDate is 2026-06-28, expected 2026-06-29
- problem: public Top10 count is 0, expected 10
- problem: signal card files 0 below 10
- problem: Business Signals workflow conclusion is failure
- warning: missing same-date persistent asset manifest: agent-workflow/reports/2026-06-29-persistent-asset-manifest.json
- warning: missing quality gate report: agent-workflow/reports/2026-06-29-guanlan-monitor-quality-gate.md
- warning: missing readiness report: agent-workflow/reports/2026-06-29-daily-production-chain-readiness.md
- warning: latest same-date GitHub Pages workflow conclusion is skipped
- supervision_report: `agent-workflow/reports/2026-06-29-daily-supervision-report.md`
- categories: no_run_or_stale_assets, monitor_or_gate_failure

## Expected Codex Action

- send Codex a business_signals repair request with failed gate and report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.

## Resolution - 2026-06-29T13:34:44+08:00

- fix_commit: pending-local-change
- validation: assert-business-signals-frontstage 2026-06-29; assert-daily-production-chain pre-commit block-stale; assert-pool-to-card-dedupe
- prevention_added: gate
