status: open
priority: medium
lane: skill_ops
created_at: 2026-08-09T10:29:35.382Z
failed_gate: weekly_learning_loop
report_path: agent-workflow/reports/2026-08-09-weekly-health.md
data_generated: not_applicable
needed_action: add or tighten gate / eval / MEMORY prevention

# Weekly Learning Loop - 2026-08-09

## Repeated Problems

- Production incident category repeated (3x): business_signals: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.
- Production incident category repeated (3x): business_signals: guanlan_vault_projection. Add a regression eval and durable MEMORY entry if not already present.
- Production incident category repeated (4x): skill_ops: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.
- Production incident category repeated (2x): first_line_viewpoints: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.
- Unresolved production incident: agent-workflow/inbox/production-incidents/2026-08-09-business-signals-recurring-05f820ce67869f02.md. Repair and rerun the failed gate before closing.
- Unresolved production incident: agent-workflow/inbox/production-incidents/2026-08-09-first-line-viewpoints-recurring-38b0aa2aca98027e.md. Repair and rerun the failed gate before closing.
- Unresolved production incident: agent-workflow/inbox/production-incidents/2026-08-09-first-line-viewpoints-recurring-960303398b491ab3.md. Repair and rerun the failed gate before closing.
- Unresolved production incident: agent-workflow/inbox/production-incidents/2026-08-09-skill-ops-recurring-042a16c9ca245da3.md. Repair and rerun the failed gate before closing.
- Unresolved production incident: agent-workflow/inbox/production-incidents/2026-08-09-skill-ops-recurring-779272b982471f71.md. Repair and rerun the failed gate before closing.

## Completion Rule

Codex must implement the smallest durable gate, eval, or MEMORY prevention, rerun the failed check, and record validation before resolving this item.
