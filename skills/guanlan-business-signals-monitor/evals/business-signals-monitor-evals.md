# Business Signals Monitor Evals

Use these as pass/fail checks after production, repair, or rule changes.

## Required

- PASS if the lane uses `.github/workflows/daily-persistent-assets-pr.yml`; FAIL if it relies on the First-Line Viewpoints or Community Intelligence workflow.
- PASS if Raw count >= 150 and Pool count >= 75; FAIL if missing monitor logs are ignored.
- PASS if Core Pool target is >= 30 and non-large-company Core Pool target is >= 20 when supply exists; FAIL if Top10 is padded with repeated large-company news.
- PASS if `frontstageSelection` for the active date selects exactly 10 cards and `supplyConstrained=false`; FAIL if selected count is below 10 without a repair plan.
- PASS if the public Business Signals JSON also exposes an active-date `top10` array with exactly 10 cards; FAIL if `frontstageSelection` has 10 cards but `top10` is missing, empty, stale, or not exactly 10.
- PASS if large-company Top10 caps are enforced; FAIL if the same large company appears more than once or large-company total exceeds 3.
- PASS if source-first and frontstage regression gates pass; FAIL if backend-only fields or old summaries are used as frontstage facts.
- PASS if the commit excludes `follow-builders-daily.json` and `community-intelligence.json`; FAIL if another lane's data is staged by this skill.
- PASS if the monitor checks the current 09:07 / 09:37 Asia/Shanghai primary windows and uses Hermes three-lane handoff at 09:45 / 09:55 before any manual dispatch; FAIL if it restores the retired 08:00 or 10:07 schedule as current truth.
- PASS if auto-merge skip is reported as PR / publication state; FAIL if the fix pushes generated data directly to `main`.
- PASS if a downstream topic or dashboard task waits for an `in_progress` business-signal workflow; FAIL if it reports missing data before the upstream run finishes.
- PASS if a `raw_count_min`-only recovery rebuilds Cards and site data locally before commit; FAIL if stale artifact `site-content.json` is copied as final site data.
- PASS if high-score watchlist aggregate data is used only to repair or reroute source-backed Pool entries; FAIL if watchlist entries directly generate Cards.
- PASS if English frontstage titles or title-like subjects are rebuilt and gated; FAIL if untranslated titles or `subject=title` reach the frontstage.
- PASS if root/homepage URLs are kept as index-only or watchlist evidence; FAIL if a news-site homepage or generic directory URL generates a Signal Card or reaches frontstage.

## Self-Improvement

- PASS if a recurring failure adds or tightens an eval before adding long prose.
- PASS if a repeated Hermes incident category appears in weekly health and the owning skill receives either a gate, eval, or durable memory update; FAIL if the same incident is only fixed by same-day data edits.
- PASS if `MEMORY.md` records only durable production lessons.
- FAIL if the skill is changed merely to explain a one-off operational outage.
