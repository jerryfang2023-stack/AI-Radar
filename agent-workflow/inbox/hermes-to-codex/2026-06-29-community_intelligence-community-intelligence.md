status: open
priority: normal
lane: community_intelligence
category: community_intelligence
failed_gate: missing
report_path: agent-workflow/reports/2026-06-29-daily-supervision-report.md
data_generated: no_or_stale
needed_action: rerun gate
created_at: 2026-06-29T13:06:03+08:00
updated_at: 2026-06-29T13:36:22+08:00
source: hermes-auto

# Hermes Repair Request: Community Intelligence

## Evidence

- problem: community data date is 2026-06-28, expected 2026-06-29
- problem: community scheduled task last result is 1
- warning: missing community gate report: agent-workflow/reports/2026-06-29-community-intelligence-gate.md
- supervision_report: `agent-workflow/reports/2026-06-29-daily-supervision-report.md`
- categories: community_intelligence

## Expected Codex Action

- rerun `agent-workflow/tools/run-community-intelligence.ps1` locally
- send Codex a community_intelligence repair request with log and gate report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.
