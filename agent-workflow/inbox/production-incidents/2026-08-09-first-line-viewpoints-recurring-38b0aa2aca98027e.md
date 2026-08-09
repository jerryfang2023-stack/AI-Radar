status: open
priority: normal
created_at: 2026-08-09T08:45:47.143Z
lane: first_line_viewpoints
category: recurring_automation_issue
fingerprint: 38b0aa2aca98027e
occurrences: 2
occurrence_dates: 2026-08-04, 2026-08-08
report_path: runtime://daily-supervision/2026-08-08
failed_gate: repeated daily supervision signal
data_generated: inspect linked daily reports
needed_action: repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only
validation_required: rerun the owning lane and daily final closure
prevention_required: gate|eval|memory|context

# Recurring problem: first_line_viewpoints

- normalized_signal: no same-date First-Line Viewpoints RSS run after the morning production window
- occurrences: 2
- dates: 2026-08-04, 2026-08-08

## Required closeout

- Record the causal fix commit.
- Record the validation command and result.
- Record the prevention artifact before resolving the incident.
