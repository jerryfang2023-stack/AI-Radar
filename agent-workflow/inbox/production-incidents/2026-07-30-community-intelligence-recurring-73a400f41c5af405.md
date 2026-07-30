status: open
priority: normal
created_at: 2026-07-30T08:45:26.578Z
lane: community_intelligence
category: recurring_automation_issue
fingerprint: 73a400f41c5af405
occurrences: 2
occurrence_dates: 2026-07-25, 2026-07-26
report_path: agent-workflow/reports/2026-07-26-daily-supervision-report.json
failed_gate: repeated daily supervision signal
data_generated: inspect linked daily reports
needed_action: repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only
validation_required: rerun the owning lane and daily final closure
prevention_required: gate|eval|memory|context

# Recurring warning: community_intelligence

- normalized_signal: community scheduled task last result is <n>, but same-date data and gate are healthy
- occurrences: 2
- dates: 2026-07-25, 2026-07-26

## Required closeout

- Record the causal fix commit.
- Record the validation command and result.
- Record the prevention artifact before resolving the incident.
