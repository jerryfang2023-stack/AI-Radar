status: open
priority: normal
created_at: 2026-08-24T03:15:02.454Z
lane: business_signals
category: recurring_automation_issue
fingerprint: 9b3705b9af766a92
occurrences: 2
occurrence_dates: 2026-08-23, 2026-08-24
report_path: runtime://daily-supervision/2026-08-24
failed_gate: repeated daily supervision signal
data_generated: inspect linked daily reports
needed_action: repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only
validation_required: rerun the owning lane and daily final closure
prevention_required: gate|eval|memory|context

# Recurring warning: business_signals

- normalized_signal: local main sync is blocked by <n> dirty file(s); Guanlan Vault refresh remains isolated from the workspace
- occurrences: 2
- dates: 2026-08-23, 2026-08-24

## Required closeout

- Record the causal fix commit.
- Record the validation command and result.
- Record the prevention artifact before resolving the incident.
