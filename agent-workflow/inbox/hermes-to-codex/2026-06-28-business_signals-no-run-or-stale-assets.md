status: resolved
priority: urgent
lane: business_signals
category: no_run_or_stale_assets
failed_gate: missing
report_path: agent-workflow/reports/2026-06-28-daily-supervision-report.md
data_generated: no_or_stale
needed_action: sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow
created_at: 2026-06-28T11:18:49+08:00
updated_at: 2026-06-28T11:43:28+08:00
resolved_at: 2026-06-28T11:43:28+08:00
resolver: codex
fix_commit: pending-local-change
validation: node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=2026-06-28 --pass-score=85 --max-cycles=1 --search-limit=200 --search-path-query-limit=5 --gdelt-query-limit=12 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000 --use-source-artifacts=true --source-artifact-dir=.tmp-gh-run-28309791224/wavesight-business-signals-pr-2026-06-28/agent-workflow/reports/source-runs/2026-06-28 --monitor-timeout-ms=840000
prevention_added: gate
source: hermes-auto

# Hermes Repair Request: Business Signals / Intelligence Map / Dashboard

## Evidence

- problem: business-signal activeDate is 2026-06-27, expected 2026-06-28
- problem: public Top10 count is 0, expected 10
- problem: signal card files 0 below 10
- problem: Business Signals workflow is in_progress; downstream tasks should wait
- warning: missing same-date persistent asset manifest: agent-workflow/reports/2026-06-28-persistent-asset-manifest.json
- warning: missing quality gate report: agent-workflow/reports/2026-06-28-guanlan-monitor-quality-gate.md
- warning: missing readiness report: agent-workflow/reports/2026-06-28-daily-production-chain-readiness.md
- warning: latest same-date GitHub Pages workflow conclusion is skipped
- supervision_report: `agent-workflow/reports/2026-06-28-daily-supervision-report.md`
- categories: no_run_or_stale_assets, monitor_or_gate_failure

## Expected Codex Action

- wait for Business Signals workflow completion before declaring data missing
- send Codex a business_signals repair request with failed gate and report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.

## Resolution - 2026-06-28T11:43:28+08:00

- fix_commit: pending-local-change
- validation: node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=2026-06-28 --pass-score=85 --max-cycles=1 --search-limit=200 --search-path-query-limit=5 --gdelt-query-limit=12 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000 --use-source-artifacts=true --source-artifact-dir=.tmp-gh-run-28309791224/wavesight-business-signals-pr-2026-06-28/agent-workflow/reports/source-runs/2026-06-28 --monitor-timeout-ms=840000
- prevention_added: gate
