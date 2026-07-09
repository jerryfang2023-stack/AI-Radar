# Business Signals Monitor Evals

Use these as pass/fail checks after production, repair, or rule changes.

## Required

- PASS if the lane uses `.github/workflows/daily-persistent-assets-pr.yml`; FAIL if it relies on the First-Line Viewpoints or Community Intelligence workflow.
- PASS if `business-signals-gate-v3.json` is the default release config; FAIL if the active gate defaults to `monitor-quality-gate-v2.json` or a Top10-era config.
- PASS if Raw count, channel breadth, AI title ratio, importance-lane coverage, and diagnostic score remain visible as diagnostics; FAIL if they block release after `raw_to_card_supply_release=true` and downstream Card/frontstage gates pass.
- PASS if Pool, routed Pool, Core Pool, and usable Core evidence have minimal release floors and higher diagnostic targets; FAIL if a fixed 75-Pool or 30-Core target blocks otherwise valid Cards.
- PASS if `frontstageSelection` for the active date contains every display-ready public Card and may be any positive count; FAIL if the gate requires exactly 10 Cards or a `top10` array.
- PASS if large-vendor concentration is reported as a diagnostic/ranking risk; FAIL if the gate pads, drops, or blocks Cards solely to satisfy an old Top10 large-company cap.
- PASS if source-first and frontstage regression gates pass; FAIL if backend-only fields or old summaries are used as frontstage facts.
- PASS if the commit excludes `follow-builders-daily.json` and `community-intelligence.json`; FAIL if another lane's data is staged by this skill.
- PASS if the monitor checks the current 09:07 / 09:37 Asia/Shanghai primary windows and uses Hermes three-lane handoff at 09:45 / 09:55 before any manual dispatch; FAIL if it restores the retired 08:00 or 10:07 schedule as current truth.
- PASS if auto-merge skip is reported as PR / publication state; FAIL if the fix pushes generated data directly to `main`.
- PASS if a downstream topic or dashboard task waits for an `in_progress` business-signal workflow; FAIL if it reports missing data before the upstream run finishes.
- PASS if a `raw_count_min`-only recovery rebuilds Cards and site data locally before commit; FAIL if stale artifact `site-content.json` is copied as final site data.
- PASS if high-score watchlist aggregate data is used only to repair or reroute source-backed Pool entries; FAIL if watchlist entries directly generate Cards.
- PASS if English frontstage titles or title-like subjects are rebuilt and gated; FAIL if untranslated titles or `subject=title` reach the frontstage.
- PASS if root/homepage URLs are kept as index-only or watchlist evidence; FAIL if a news-site homepage or generic directory URL generates a Signal Card or reaches frontstage.
- PASS if RSS HTTP 415 / 429 / 5xx, Anysearch quota exhaustion, or search-provider temporary unavailable notes are treated as recovered after peer source artifacts satisfy V3 Card supply; FAIL if provider fallback hides a true Pool/Core shortage or blocks Card/frontstage generation after supply gates pass.
- PASS if `raw_count_min` shortfall remains visible as `raw_count_release_override=raw_to_card_supply` when V3 Card supply is sufficient; FAIL if Raw-only shortage blocks release after Card/frontstage gates pass.
- PASS if source-artifact Raw selection rotates across GDELT, keyword search, RSS, and AI HOT as peer channels; FAIL if a fixed priority channel can starve another available source artifact channel.

## Self-Improvement

- PASS if a recurring failure adds or tightens an eval before adding long prose.
- PASS if a repeated Hermes incident category appears in weekly health and the owning skill receives either a gate, eval, or durable memory update; FAIL if the same incident is only fixed by same-day data edits.
- PASS if `MEMORY.md` records only durable production lessons.
- FAIL if the skill is changed merely to explain a one-off operational outage.
