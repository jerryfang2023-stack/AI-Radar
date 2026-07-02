status: open
priority: normal
lane: skill_ops
category: skill_ops
failed_gate: skill_ops daily supervision
report_path: agent-workflow/reports/2026-07-02-daily-supervision-report.md
data_generated: not_applicable
needed_action: repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
created_at: 2026-07-02T11:18:08+08:00
updated_at: 2026-07-02T11:20:31+08:00
source: hermes-auto

# Hermes Repair Request: Skill Ops Governance

## Evidence

- problem: skill-registry.md is stale; run npm run build:skill-registry
- supervision_report: `agent-workflow/reports/2026-07-02-daily-supervision-report.md`
- categories: skill_ops

## Expected Codex Action

- repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
- run `npm run audit:skills` after the repair
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.
