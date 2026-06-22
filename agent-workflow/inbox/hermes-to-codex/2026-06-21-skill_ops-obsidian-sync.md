status: resolved
priority: normal
lane: skill_ops
category: obsidian_sync
failed_gate: skill_ops daily supervision
report_path: agent-workflow/reports/2026-06-21-daily-supervision-report.md
data_generated: not_applicable
needed_action: repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
created_at: 2026-06-21T12:54:37+08:00
updated_at: 2026-06-21T13:37:15+08:00
resolved_at: 2026-06-21T13:37:15+08:00
resolver: codex
fix_commit: pending
validation: npm run check:skill-ops
prevention_added: gate
source: hermes-auto

# Hermes Repair Request: Skill Ops Governance

## Evidence

- problem: guanlan-raw-pool-card: .skill-store sync state is drift
- problem: guanlan-skill-editor: .skill-store sync state is drift
- supervision_report: `agent-workflow/reports/2026-06-21-daily-supervision-report.md`
- categories: obsidian_sync, skill_ops

## Expected Codex Action

- repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
- run `npm run audit:skills` after the repair
- run `npm run sync:skill-store` after confirming the project copy is the source of truth
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.

## Resolution - 2026-06-21T13:37:15+08:00

- fix_commit: pending
- validation: npm run check:skill-ops
- prevention_added: gate
- notes: Current Skill Ops governance check passes with registry current, skill-store drift 0, eval/examples coverage 100%; closing stale drift inbox.
