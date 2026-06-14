status: resolved
priority: normal
lane: skill_ops
category: monitor_or_gate_failure
failed_gate: skill_ops daily supervision
report_path: agent-workflow/reports/2026-06-14-daily-supervision-report.md
data_generated: not_applicable
needed_action: repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
created_at: 2026-06-14T03:17:19+08:00
updated_at: 2026-06-14T16:08:07+08:00
resolved_at: 2026-06-14T16:08:07+08:00
resolver: codex
fix_commit: pending-local-change
validation: npm run audit:skills && npm run check:skill-ops
prevention_added: context
source: hermes-auto

# Hermes Repair Request: Skill Ops Governance

## Evidence

- problem: guanlan-business-signals-monitor: .skill-store sync state is drift
- problem: guanlan-first-line-viewpoints-monitor: .skill-store sync state is drift
- problem: guanlan-community-intelligence-monitor: .skill-store sync state is drift
- supervision_report: `agent-workflow/reports/2026-06-14-daily-supervision-report.md`
- categories: monitor_or_gate_failure, obsidian_sync, community_intelligence, first_line_viewpoints, skill_ops

## Expected Codex Action

- repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
- run `npm run audit:skills` after the repair
- run `npm run sync:skill-store` after confirming the project copy is the source of truth
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.

## Resolution - 2026-06-14T16:08:07+08:00

- fix_commit: pending-local-change
- validation: npm run audit:skills && npm run check:skill-ops
- prevention_added: context
