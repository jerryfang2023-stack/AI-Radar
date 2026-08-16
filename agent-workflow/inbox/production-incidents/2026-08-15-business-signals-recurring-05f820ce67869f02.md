status: resolved
priority: normal
lane: business_signals
category: recurring_automation_issue
failed_gate: repeated daily supervision signal
report_path: runtime://daily-supervision/2026-08-13
data_generated: inspect linked daily reports
needed_action: repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only
created_at: 2026-08-15T08:48:11.267Z
updated_at: 2026-08-16T13:28:54+08:00
resolved_at: 2026-08-16T13:28:54+08:00
resolver: codex
fix_commit: edbd922ff
validation: projection coverage 100%; daily-supervision-business tests passed
prevention_added: gate
fingerprint: 05f820ce67869f02
occurrences: 2
occurrence_dates: 2026-08-12, 2026-08-13
validation_required: rerun the owning lane and daily final closure
prevention_required: gate|eval|memory|context

# Recurring warning: business_signals

- normalized_signal: local main sync and Guanlan Vault refresh may be blocked by <n> dirty file(s)
- occurrences: 2
- dates: 2026-08-12, 2026-08-13

## Required closeout

- Record the causal fix commit.
- Record the validation command and result.
- Record the prevention artifact before resolving the incident.

## Resolution - 2026-08-16T13:28:54+08:00

- fix_commit: edbd922ff
- validation: projection coverage 100%; daily-supervision-business tests passed
- prevention_added: gate
