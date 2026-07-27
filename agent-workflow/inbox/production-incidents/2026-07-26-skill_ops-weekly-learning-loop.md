status: resolved
priority: medium
lane: skill_ops
failed_gate: weekly_learning_loop
report_path: agent-workflow/reports/2026-07-26-weekly-health.md
data_generated: not_applicable
needed_action: add or tighten gate / eval / MEMORY prevention
created_at: 2026-07-26T11:16:52.426Z
updated_at: 2026-07-27T14:13:06+08:00
resolved_at: 2026-07-27T14:13:06+08:00
resolver: codex
fix_commit: f3ea9554c
validation: node --test agent-workflow/tools/tests/daily-supervision-follow-builders.test.mjs agent-workflow/tools/tests/recurring-production-incidents.test.mjs
prevention_added: eval

# Weekly Learning Loop - 2026-07-26

## Repeated Problems

- Daily supervision recurring warning (2x): community_intelligence: community scheduled task last result is <n>, but same-date data and gate are healthy. Decide whether it should stay warning or become a gate.
- Production incident category repeated (2x): business_signals: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.

## Completion Rule

Codex must implement the smallest durable gate, eval, or MEMORY prevention, rerun the failed check, and record validation before resolving this item.

## Resolution - 2026-07-27T14:13:06+08:00

- fix_commit: f3ea9554c
- validation: node --test agent-workflow/tools/tests/daily-supervision-follow-builders.test.mjs agent-workflow/tools/tests/recurring-production-incidents.test.mjs
- prevention_added: eval
