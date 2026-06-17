status: open
priority: normal
lane: community_intelligence
category: community_intelligence
failed_gate: agent-workflow/reports/2026-06-17-community-intelligence-gate.md
report_path: agent-workflow/reports/2026-06-17-daily-supervision-report.md
data_generated: yes
needed_action: run `npm run hermes:early-handoff -- --date=<YYYY-MM-DD>` or dispatch `.github/workflows/daily-community-intelligence-pr.yml` after local collection and archive pass
created_at: 2026-06-17T11:19:15+08:00
updated_at: 2026-06-17T11:19:15+08:00
source: hermes-auto

# Hermes Repair Request: Community Intelligence

## Evidence

- problem: no same-date Community Intelligence publish workflow after 09:30 Hermes handoff
- supervision_report: `agent-workflow/reports/2026-06-17-daily-supervision-report.md`
- categories: community_intelligence

## Expected Codex Action

- run `npm run hermes:early-handoff -- --date=<YYYY-MM-DD>` or dispatch `.github/workflows/daily-community-intelligence-pr.yml` after local collection and archive pass
- send Codex a community_intelligence repair request with log and gate report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.
