status: resolved
priority: urgent
lane: business_signals
category: business_signals_top10_missing
failed_gate: missing
report_path: agent-workflow/reports/2026-06-25-daily-supervision-report.md
data_generated: no_or_stale
needed_action: send Codex a business_signals repair request with failed gate and report path
created_at: 2026-06-25T12:46:24+08:00
updated_at: 2026-06-25T13:13:50+08:00
resolved_at: 2026-06-25T13:13:50+08:00
resolver: codex
fix_commit: pending
validation: npm run supervise:daily -- --date=2026-06-25; npm run assert:business-frontstage -- --date=2026-06-25; node agent-workflow/tools/assert-daily-production-chain.mjs --date=2026-06-25 --stage=pre-commit --raw-min=150 --pool-min=75 --block-stale=true
prevention_added: gate
source: hermes-auto

# Hermes Repair Request: Business Signals / Intelligence Map / Dashboard

## Evidence

- problem: business-signal activeDate is 2026-06-24, expected 2026-06-25
- problem: Top10 selected count is 0, expected 10
- problem: signal card files 0 below 10
- problem: Business Signals workflow conclusion is failure
- warning: missing same-date persistent asset manifest: agent-workflow/reports/2026-06-25-persistent-asset-manifest.json
- warning: missing quality gate report: agent-workflow/reports/2026-06-25-guanlan-monitor-quality-gate.md
- warning: missing readiness report: agent-workflow/reports/2026-06-25-daily-production-chain-readiness.md
- warning: local Obsidian sync may be blocked by 7 dirty file(s)
- supervision_report: `agent-workflow/reports/2026-06-25-daily-supervision-report.md`
- categories: business_signals_top10_missing, monitor_or_gate_failure, obsidian_sync

## Expected Codex Action

- send Codex a business_signals repair request with failed gate and report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.

## Resolution - 2026-06-25T13:13:50+08:00

- fix_commit: pending
- validation: npm run supervise:daily -- --date=2026-06-25; npm run assert:business-frontstage -- --date=2026-06-25; node agent-workflow/tools/assert-daily-production-chain.mjs --date=2026-06-25 --stage=pre-commit --raw-min=150 --pool-min=75 --block-stale=true
- prevention_added: gate
