status: open
priority: normal
created_at: 2026-08-09T08:45:47.140Z
lane: business_signals
category: recurring_automation_issue
fingerprint: 05f820ce67869f02
occurrences: 4
occurrence_dates: 2026-08-03, 2026-08-06, 2026-08-08, 2026-08-09
report_path: runtime://daily-supervision/2026-08-09
failed_gate: repeated daily supervision signal
data_generated: inspect linked daily reports
needed_action: repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only
validation_required: rerun the owning lane and daily final closure
prevention_required: gate|eval|memory|context

# Recurring warning: business_signals

- normalized_signal: local main sync and Guanlan Vault refresh may be blocked by <n> dirty file(s)
- occurrences: 4
- dates: 2026-08-03, 2026-08-06, 2026-08-08, 2026-08-09

## Required closeout

- Record the causal fix commit.
- Record the validation command and result.
- Record the prevention artifact before resolving the incident.
