status: resolved
priority: normal
lane: follow_builders_skill
category: first_line_viewpoints
failed_gate: follow_builders_skill daily supervision
report_path: agent-workflow/reports/2026-06-13-daily-supervision-report.md
data_generated: yes
needed_action: send Codex a follow_builders_skill repair request with publish report path
created_at: 2026-06-13T19:07:08+08:00
updated_at: 2026-06-13T19:11:39+08:00
resolved_at: 2026-06-13T19:11:39+08:00
resolver: codex
fix_commit: pending-local-change
validation: npm run supervise:daily -- --date=2026-06-13
prevention_added: memory
source: hermes-auto

# Hermes Repair Request: First-Line Viewpoints Skill

## Evidence

- problem: missing follow-builders skill output file: 01-SiteV2/content/07-points/2026-06-13-builders-viewpoints.md
- problem: follow-builders skill output item count 0 below 1
- problem: no same-date follow-builders skill publish report after 16:30 watchdog
- warning: follow-builders skill publish report is missing before Hermes record time
- supervision_report: `agent-workflow/reports/2026-06-13-daily-supervision-report.md`
- categories: first_line_viewpoints

## Expected Codex Action

- run `powershell -NoProfile -ExecutionPolicy Bypass -File agent-workflow/tools/run-follow-builders-skill.ps1` locally
- send Codex a follow_builders_skill repair request with publish report path
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.

## Resolution - 2026-06-13T19:11:39+08:00

- fix_commit: pending-local-change
- validation: npm run supervise:daily -- --date=2026-06-13
- prevention_added: memory
- notes: Fixed agent-workflow/tools/run-follow-builders-skill.ps1 invocation, regenerated 2026-06-13 builders viewpoints, and wrote the same-date local publish report.
