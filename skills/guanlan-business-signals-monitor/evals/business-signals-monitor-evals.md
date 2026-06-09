# Business Signals Monitor Evals

Use these as pass/fail checks after production, repair, or rule changes.

## Required

- PASS if the lane uses `.github/workflows/daily-persistent-assets-pr.yml`; FAIL if it relies on the First-Line Viewpoints or Community Intelligence workflow.
- PASS if Raw count >= 150 and Pool count >= 75; FAIL if missing monitor logs are ignored.
- PASS if Core Pool target is >= 30 and non-large-company Core Pool target is >= 20 when supply exists; FAIL if Top10 is padded with repeated large-company news.
- PASS if `frontstageSelection` for the active date selects exactly 10 cards and `supplyConstrained=false`; FAIL if selected count is below 10 without a repair plan.
- PASS if large-company Top10 caps are enforced; FAIL if the same large company appears more than once or large-company total exceeds 3.
- PASS if source-first and frontstage regression gates pass; FAIL if backend-only fields or old summaries are used as frontstage facts.
- PASS if the commit excludes `follow-builders-daily.json` and `community-intelligence.json`; FAIL if another lane's data is staged by this skill.

## Self-Improvement

- PASS if a recurring failure adds or tightens an eval before adding long prose.
- PASS if `MEMORY.md` records only durable production lessons.
- FAIL if the skill is changed merely to explain a one-off operational outage.
