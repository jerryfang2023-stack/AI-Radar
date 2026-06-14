status: resolved
priority: normal
lane: community_intelligence
category: monitor_or_gate_failure
failed_gate: missing
report_path: agent-workflow/reports/2026-06-13-daily-supervision-report.md
data_generated: no_or_stale
needed_action: manual dispatch
created_at: 2026-06-13T10:45:49+08:00
updated_at: 2026-06-14T16:42:32+08:00
resolved_at: 2026-06-14T16:42:32+08:00
resolver: codex
fix_commit: 1bdabf15
validation: community daily snapshot 2026-06-13 exists with 61 items; 2026-06-13 local publish report exists; later active-date gate failure is historical-date supersession only
prevention_added: not-needed
source: hermes-auto

# Hermes Repair Request: Community Intelligence

## Evidence

- problem: community data date is 2026-06-12, expected 2026-06-13
- problem: no same-date Community Intelligence publish workflow after 08:55 watchdog
- warning: missing community gate report: agent-workflow/reports/2026-06-13-community-intelligence-gate.md
- warning: Scheduled task check is Windows-only
- supervision_report: `agent-workflow/reports/2026-06-13-daily-supervision-report.md`
- categories: monitor_or_gate_failure, community_intelligence

## Expected Codex Action

- manual dispatch `.github/workflows/daily-community-intelligence-pr.yml` after local collection and archive pass
- rerun `agent-workflow/tools/run-community-intelligence.ps1` locally
- send Codex a community_intelligence repair request with log and gate report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.

## Resolution - 2026-06-14T16:42:32+08:00

- fix_commit: 1bdabf15
- validation: community daily snapshot 2026-06-13 exists with 61 items; 2026-06-13 local publish report exists; later active-date gate failure is historical-date supersession only
- prevention_added: not-needed
