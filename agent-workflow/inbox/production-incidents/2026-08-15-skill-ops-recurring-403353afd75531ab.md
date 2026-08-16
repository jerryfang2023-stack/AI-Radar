status: open
priority: normal
created_at: 2026-08-15T08:48:11.268Z
lane: skill_ops
category: recurring_automation_issue
fingerprint: 403353afd75531ab
occurrences: 3
occurrence_dates: 2026-08-13, 2026-08-14, 2026-08-15
report_path: runtime://daily-supervision/2026-08-15
failed_gate: repeated daily supervision signal
data_generated: inspect linked daily reports
needed_action: repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only
validation_required: rerun the owning lane and daily final closure
prevention_required: gate|eval|memory|context

# Recurring problem: skill_ops

- normalized_signal: Skill discovery summary is stale; run npm run build:skill-store-dashboard
- occurrences: 3
- dates: 2026-08-13, 2026-08-14, 2026-08-15

## Required closeout

- Record the causal fix commit.
- Record the validation command and result.
- Record the prevention artifact before resolving the incident.
