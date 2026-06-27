status: resolved
priority: normal
lane: skill_ops
category: monitor_or_gate_failure
failed_gate: skill_ops daily supervision
report_path: agent-workflow/reports/2026-06-27-daily-supervision-report.md
data_generated: not_applicable
needed_action: repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
created_at: 2026-06-27T14:24:06+08:00
updated_at: 2026-06-27T14:50:46+08:00
resolved_at: 2026-06-27T14:50:46+08:00
resolver: codex
fix_commit: 69ddf292
validation: npm run audit:skills
prevention_added: gate
source: hermes-auto

# Hermes Repair Request: Skill Ops Governance

## Evidence

- problem: guanlan-business-signals-monitor: .skill-store sync state is drift
- problem: skill-registry.md is stale; run npm run build:skill-registry
- supervision_report: `agent-workflow/reports/2026-06-27-daily-supervision-report.md`
- categories: monitor_or_gate_failure, obsidian_sync, skill_ops

## Expected Codex Action

- repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
- run `npm run audit:skills` after the repair
- run `npm run sync:skill-store` after confirming the project copy is the source of truth
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.

## Resolution - 2026-06-27T14:34:34+08:00

- fix_commit: pending
- validation: npm run audit:skills; npm run supervise:daily -- --date=2026-06-27
- prevention_added: gate

## Resolution - 2026-06-27T14:50:46+08:00

- fix_commit: 69ddf292
- validation: npm run audit:skills
- prevention_added: gate
