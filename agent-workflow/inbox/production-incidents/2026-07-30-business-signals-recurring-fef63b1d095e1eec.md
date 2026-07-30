status: open
priority: normal
created_at: 2026-07-30T08:45:26.579Z
lane: business_signals
category: recurring_automation_issue
fingerprint: fef63b1d095e1eec
occurrences: 2
occurrence_dates: 2026-07-26, 2026-07-27
report_path: agent-workflow/reports/2026-07-27-daily-supervision-report.json
failed_gate: repeated daily supervision signal
data_generated: inspect linked daily reports
needed_action: repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only
validation_required: rerun the owning lane and daily final closure
prevention_required: gate|eval|memory|context

# Recurring warning: business_signals

- normalized_signal: local Obsidian sync may be blocked by <n> dirty file(s)
- occurrences: 2
- dates: 2026-07-26, 2026-07-27

## Required closeout

- Record the causal fix commit.
- Record the validation command and result.
- Record the prevention artifact before resolving the incident.
