status: resolved
priority: normal
lane: skill_ops
category: monitor_or_gate_failure
failed_gate: skill_ops daily supervision
report_path: agent-workflow/reports/2026-07-19-daily-supervision-report.md
data_generated: not_applicable
needed_action: repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
created_at: 2026-07-19T14:41:47+08:00
updated_at: 2026-07-19T14:43:35+08:00
resolved_at: 2026-07-19T14:43:35+08:00
resolver: codex
fix_commit: pending
validation: check:skill-ops_passed_and_daily_supervision_healthy
prevention_added: eval
source: hermes-auto

# Hermes Repair Request: Skill Ops Governance

## Evidence

- problem: guanlan-business-signals-monitor: .skill-store sync state is drift
- problem: guanlan-raw-pool-card: .skill-store sync state is drift
- problem: guanlan-business-signals-monitor syncState expected drift, got synced
- problem: guanlan-raw-pool-card syncState expected drift, got synced
- supervision_report: `agent-workflow/reports/2026-07-19-daily-supervision-report.md`
- categories: monitor_or_gate_failure, obsidian_sync, skill_ops

## Expected Codex Action

- repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror
- run `npm run repair:skills` after confirming the project copy is the source of truth
- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.
- Rerun the failed gate or the smallest relevant validation.
- Record the repair with `npm run record:action`.

## User Escalation Needed

- no, unless Codex needs GitHub permission, login state, or business judgment.

## Resolution - 2026-07-19T14:43:35+08:00

- fix_commit: pending
- validation: check:skill-ops_passed_and_daily_supervision_healthy
- prevention_added: eval
