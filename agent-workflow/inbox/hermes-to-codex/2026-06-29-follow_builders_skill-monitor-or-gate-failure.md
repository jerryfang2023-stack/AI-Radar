status: open
priority: urgent
lane: follow_builders_skill
category: monitor_or_gate_failure
failed_gate: follow_builders_skill daily supervision
report_path: agent-workflow/reports/2026-06-29-daily-supervision-report.md
data_generated: yes
needed_action: send Codex a follow_builders_skill repair request with publish report path
created_at: 2026-06-29T16:40:24+08:00
updated_at: 2026-06-29T16:40:24+08:00
source: hermes-auto

# Hermes Repair Request: First-Line Viewpoints Skill

## Evidence

- problem: missing follow-builders skill output file: 01-SiteV2/content/07-points/2026-06-29-builders-viewpoints.md
- problem: follow-builders skill output item count 0 below 1
- supervision_report: `agent-workflow/reports/2026-06-29-daily-supervision-report.md`
- categories: monitor_or_gate_failure, first_line_viewpoints

## Expected Codex Action

- send Codex a follow_builders_skill repair request with publish report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.
