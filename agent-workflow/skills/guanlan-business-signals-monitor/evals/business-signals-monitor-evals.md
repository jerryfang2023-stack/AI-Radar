# Business Signals Monitor Evals

Run these pass/fail checks when supervising, repairing, or updating the Business Signals lane.

## Required Checks

1. `lane_owner_loaded`
   - Pass when Business Signals work routes through this skill before narrower Raw / Pool / Card skills.

2. `daily_monitor_thresholds`
   - Pass when active Raw is at least 150, Pool at least 75, routed Pool at least 60, and usable `core_pool` at least 30 unless the lane is explicitly blocked.

3. `public_top10_contract`
   - Pass when `01-SiteV2/site/data/v3-data-observation-desk.json.top10` exists for the active date and contains exactly 10 active-date business-signal items.
   - Pass when the Top10 selector applies the large-company cap before publication: at most 3 large-company cards total and at most 1 card per large company. A later gate may verify this, but must not be the first place that removes or relaxes large-company overage.

4. `source_first_gate`
   - Pass when frontstage facts, titles, details, and source excerpts are traceable to original source text or accepted Raw / Pool evidence.
   - Pass when the production workflow uses the unified Business frontstage gate immediately after building Business Signals frontstage data and before dashboard / topic-center generation.

5. `lane_isolation`
   - Pass when the Business Signals PR stages no First-Line Viewpoints or Community Intelligence data.

6. `builders_and_community_boundary`
   - Pass when builders viewpoints and community leads are not used as facts, graph evidence, or trend-candidate evidence unless recaptured through Raw / Pool.

7. `hermes_repair_closure`
   - Pass when any related Hermes inbox item is closed only after validation and a prevention artifact is recorded.

8. `publication_boundary`
   - Pass when publication uses automation branch -> PR -> `main` -> GitHub Pages, not direct deployment or direct generated-data push to `main`.

9. `before_10_hermes_handoff`
   - Pass when Business Signals has only two primary schedule windows, 09:07 and 09:37 Asia/Shanghai, and Hermes three-lane early handoff runs at 09:45 / 09:55 to dispatch the lane if primary attempts fail or if no healthy same-date assets are visible and no run is active.
   - Pass when the scheduled early handoff entry is `.github/workflows/hermes-three-lane-early-handoff.yml`, while the older Business-only handoff workflow remains manual compatibility only.
   - Fail when the lane relies on repeated 10:07 / 12:07 / 13:07 / 14:07 schedule loops instead of producing a Hermes report, recovery action, and Codex handoff before 10:00.

10. `six_gate_card_entry_contract`
    - Pass when Core Pool -> Signal Card eligibility is expressed through exactly these grouped gates: `source_auditability`, `evidence_quality`, `business_signal_scope`, `valid_page_type`, `commercial_importance`, and `fact_type_constraints`.
    - Pass when detailed diagnostics such as missing full text, extraction method, source URL, source level, stale date, page type, evidence object, funding round shape, or user feedback are reported under one of those gates.
    - Fail when scattered field checks are treated as independent top-level Card policy, or when a repair lowers source-first evidence requirements to fill Top10.

11. `top10_title_source_boundary`
    - Pass when Top10 titles name the actual company, product, funding round, release, customer, or workflow event and do not contain placeholder wording such as "original AI event", "purpose see original", or source-domain subjects like "linkedin financing" / "github original title".
    - Pass when LinkedIn/X/Reddit/Hacker News posts, GitHub repo root/tree/blob pages, package/model pages, marketplace listings, and generic funding/startup lists are excluded from formal Signal Cards unless recaptured through a dated source-backed event page.
    - Pass when the public Core Pool candidate list is event-deduped so repeated pages about the same model release or financing round do not fill the candidate area.

12. `top10_large_company_preselection`
    - Pass when any Top10 fill or supply-repair path still respects the same large-company cap as the primary selector.
    - Fail when a weekend / low-supply fallback bypasses the selector cap, or when the source-first gate is relaxed to accept more than 3 total large-company cards or more than 1 card from the same large company.

13. `morning_failure_fast_path`
    - Pass when Business Signals builds and validates the Business frontstage JSON before operations dashboard / topic-center data, so Top10, translation, source-first, and large-company-cap failures stop early with a categorized report.
    - Fail when source-first and frontstage regression run as separate late-stage checks after unrelated operations data has already been generated.

## Repair Loop

When a check fails, repair the earliest responsible stage and rerun the exact failed gate. If the same category repeats in weekly health, add or tighten an eval and then add a short MEMORY entry if the lesson is durable.
