# Community Intelligence Monitor Evals

Use these as pass/fail checks after production, repair, or rule changes.

## Required

- PASS if `WaveSight Community Intelligence Daily` exists and has a future next run; FAIL if the task is missing or disabled.
- PASS if the last task result is `0` after the latest run; FAIL if errors are ignored because local data exists.
- PASS if `assert-community-intelligence-data.mjs --date=<YYYY-MM-DD>` passes; FAIL if stale data is published.
- PASS if archive, index, and category views are generated; FAIL if only site JSON is updated.
- PASS if staged files are limited to community data, archive files, gate reports, and collector fixes; FAIL if Business Signals or First-Line Viewpoints files are staged.
- PASS if publication uses `.github/workflows/daily-community-intelligence-pr.yml` and `automation/community-intelligence-<date>` after a passing gate; FAIL if local collection success is reported as published before PR / merge / Pages.

## Self-Improvement

- PASS if repeated selector or login-state failures lead to a targeted eval or collector guard.
- PASS if task scheduling failures record exact task state and next run.
- FAIL if a one-off local browser interruption expands the skill with broad new policy.
