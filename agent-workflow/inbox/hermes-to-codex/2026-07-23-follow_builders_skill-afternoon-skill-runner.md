status: resolved
priority: high
lane: follow_builders_skill
category: afternoon_skill_runner
failed_gate: agent-workflow/reports/2026-07-23-daily-supervision-report.md
report_path: agent-workflow/reports/2026-07-23-daily-supervision-report.md
data_generated: no
needed_action: repair the existing 16:10 task wake/retry settings and force a post-run Hermes supervision refresh; do not fabricate a historical archive from a later feed
created_at: 2026-07-24T16:55:00+08:00
updated_at: 2026-07-24T16:55:19+08:00
resolved_at: 2026-07-24T16:55:19+08:00
resolver: codex
fix_commit: pending
validation: node --test agent-workflow/tools/tests/daily-supervision-follow-builders.test.mjs; npm run test:data-center-site:core; forced 2026-07-21..24 supervision replay
prevention_added: eval
source: codex-diagnosis

# Hermes Repair Request: First-Line Viewpoints Skill

## Evidence

- problem: `agent-workflow/reports/2026-07-23-follow-builders-skill-local-publish.md` is absent from both the working tree and `origin/main`.
- problem: `01-SiteV2/content/07-points/2026-07-23-builders-viewpoints.md` is absent from both the working tree and `origin/main`.
- good_example: the 2026-07-23 morning First-Line manifest and data gate both passed.
- bad_example: the 16:10 scheduled task had `WakeToRun=false`, and the 09:50 supervisor marked the not-yet-due afternoon lane as passed.

## Expected Codex Action

- Make the existing task wake the machine and retry bounded execution failures.
- Force a same-date Hermes supervision refresh after the publisher exits.
- Treat pre-window absence as Waiting and use exact-date `origin/main` artifacts when the working tree is stale.
- Add a regression test and a monitor-skill eval.

## Resolution - 2026-07-24T16:55:19+08:00

- fix_commit: pending
- validation: node --test agent-workflow/tools/tests/daily-supervision-follow-builders.test.mjs; npm run test:data-center-site:core; forced 2026-07-21..24 supervision replay
- prevention_added: eval
