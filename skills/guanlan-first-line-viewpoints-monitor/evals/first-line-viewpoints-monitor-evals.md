# First-Line Viewpoints Monitor Evals

Use these as pass/fail checks after production, repair, or rule changes.

## Required

- PASS if the lane uses `.github/workflows/daily-first-line-viewpoints-pr.yml`; FAIL if it depends on the Business Signals workflow.
- PASS if `assert-follow-builders-data.mjs` passes; FAIL if untranslated or pending translation remarks enter `follow-builders-daily.json`.
- PASS if every remark has original URL and formal tags; FAIL if a visible remark has missing URL, duplicate URL, or incomplete tags.
- PASS if fallback data records `fallbackUsed` and `fallbackReason`; FAIL if stale fallback silently passes.
- PASS if staged files are limited to first-line data, feed files, manifests, and gate reports; FAIL if Raw / Pool / Card or Community Intelligence files are staged.
- PASS if success is judged from `01-SiteV2/site/data/follow-builders-daily.json`; FAIL if the retired `01-SiteV2/content/05-frontier-opinions/*` path is treated as the current source.
- PASS if the lane syncs same-date Builder viewpoints into `01-SiteV2/knowledge/02-Opinion-Timelines/people/<person>/<YYYY-MM-DD>.md` and a second same-date sync adds `0`; FAIL if only old `YYYY-MM.md` month files exist or duplicate timeline entries are introduced.
- PASS if the lane uses 08:30 local RSS collection, 09:17 / 09:47 GitHub fallback, and 09:55 Hermes RSS handoff; FAIL if it waits for the retired 10:17 / 10:30 path before reporting or repairing stale data.
- PASS if the afternoon `follow-builders` skill route is recorded at 16:30 with a publish report and `07-points/<YYYY-MM-DD>-builders-viewpoints.md`; FAIL if the afternoon route is treated as covered by morning RSS data only.

## Self-Improvement

- PASS if recurring translation failures lead to a generator filter or eval.
- PASS if the skill memory names a durable failure signature.
- FAIL if a one-off feed outage expands the skill with broad new rules.
