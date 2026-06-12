# Business Signals Monitor Evals

Run these pass/fail checks when supervising, repairing, or updating the Business Signals lane.

## Required Checks

1. `lane_owner_loaded`
   - Pass when Business Signals work routes through this skill before narrower Raw / Pool / Card skills.

2. `daily_monitor_thresholds`
   - Pass when active Raw is at least 150, Pool at least 75, routed Pool at least 60, and usable `core_pool` at least 30 unless the lane is explicitly blocked.

3. `public_top10_contract`
   - Pass when `01-SiteV2/site/data/v3-data-observation-desk.json.top10` exists for the active date and contains exactly 10 active-date business-signal items.

4. `source_first_gate`
   - Pass when frontstage facts, titles, details, and source excerpts are traceable to original source text or accepted Raw / Pool evidence.

5. `lane_isolation`
   - Pass when the Business Signals PR stages no First-Line Viewpoints or Community Intelligence data.

6. `builders_and_community_boundary`
   - Pass when builders viewpoints and community leads are not used as facts, graph evidence, or trend-candidate evidence unless recaptured through Raw / Pool.

7. `hermes_repair_closure`
   - Pass when any related Hermes inbox item is closed only after validation and a prevention artifact is recorded.

8. `publication_boundary`
   - Pass when publication uses automation branch -> PR -> `main` -> GitHub Pages, not direct deployment or direct generated-data push to `main`.

## Repair Loop

When a check fails, repair the earliest responsible stage and rerun the exact failed gate. If the same category repeats in weekly health, add or tighten an eval and then add a short MEMORY entry if the lesson is durable.
