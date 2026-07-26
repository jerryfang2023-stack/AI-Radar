status: open
priority: medium
lane: skill_ops
created_at: 2026-07-26T11:16:52.426Z
failed_gate: weekly_learning_loop
report_path: agent-workflow/reports/2026-07-26-weekly-health.md
data_generated: not_applicable
needed_action: add or tighten gate / eval / MEMORY prevention

# Weekly Learning Loop - 2026-07-26

## Repeated Problems

- Daily supervision recurring warning (2x): community_intelligence: community scheduled task last result is <n>, but same-date data and gate are healthy. Decide whether it should stay warning or become a gate.
- Production incident category repeated (2x): business_signals: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.

## Completion Rule

Codex must implement the smallest durable gate, eval, or MEMORY prevention, rerun the failed check, and record validation before resolving this item.
