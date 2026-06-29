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
   - Pass when Business Signals has one primary production window at 08:57 Asia/Shanghai and one 09:27 conditional health-dispatch window that waits when same-date data is healthy or a same-date run is queued / in progress / successful.
   - Pass when Hermes three-lane early handoff runs at 09:45 / 09:55 to dispatch the lane if primary production / health dispatch failed, or if no healthy same-date assets are visible and no run is active.
   - Pass when the scheduled early handoff entry is `.github/workflows/hermes-three-lane-early-handoff.yml`, while the older Business-only handoff workflow remains manual compatibility only.
   - Fail when the lane relies on repeated 10:07 / 12:07 / 13:07 / 14:07 schedule loops instead of producing a Hermes report, recovery action, and Codex handoff before 10:00.
   - Fail when a queued / in-progress same-date workflow is reported as `manual_required` instead of `waiting`.

10. `six_gate_card_entry_contract`
    - Pass when Core Pool -> Signal Card eligibility is expressed through exactly these grouped gates: `source_auditability`, `evidence_quality`, `business_signal_scope`, `valid_page_type`, `commercial_importance`, and `fact_type_constraints`.
    - Pass when detailed diagnostics such as missing full text, extraction method, source URL, source level, stale date, page type, evidence object, funding round shape, or user feedback are reported under one of those gates.
    - Fail when scattered field checks are treated as independent top-level Card policy, or when a repair lowers source-first evidence requirements to fill Top10.

11. `technical_trend_context_boundary`
    - Pass when `important_technical_trend` is monitored only as context for source repair, relationship analysis, and trend-candidate work.
    - Pass when the four formal Business Signals lanes are `important_case`, `important_funding`, `important_product_or_service`, and `important_vertical_solution`, and only those can enter `core_pool` / formal Signal Card quantity.
    - Fail when targeted refill, Core Pool routing, or Card generation uses technical articles, builder/opinion posts, newsletters, workforce retraining / public-funding programs, docs, or generic guides as formal cards without a same-source dated funding, product/service, customer deployment, procurement, partnership, vertical rollout, or production implementation event.

12. `top10_title_source_boundary`
    - Pass when Top10 titles name the actual company, product, funding round, release, customer, or workflow event and do not contain placeholder wording such as "original AI event", "purpose see original", or source-domain subjects like "linkedin financing" / "github original title".
    - Pass when LinkedIn/X/Reddit/Hacker News posts, GitHub repo root/tree/blob pages, package/model pages, marketplace listings, and generic funding/startup lists are excluded from formal Signal Cards unless recaptured through a dated source-backed event page.
    - Pass when the public Core Pool candidate list is event-deduped so repeated pages about the same model release or financing round do not fill the candidate area.

13. `top10_large_company_preselection`
    - Pass when any Top10 fill or supply-repair path still respects the same large-company cap as the primary selector.
    - Fail when a weekend / low-supply fallback bypasses the selector cap, or when the source-first gate is relaxed to accept more than 3 total large-company cards or more than 1 card from the same large company.

14. `morning_failure_fast_path`
    - Pass when Business Signals builds and validates the Business frontstage JSON before operations dashboard / topic-center data, so Top10, translation, source-first, and large-company-cap failures stop early with a categorized report.
    - Fail when source-first and frontstage regression run as separate late-stage checks after unrelated operations data has already been generated.

15. `failure_category_router`
    - Pass when every failed or warning morning check is classified as one of: `supervision_observability`, `no_run_or_stale_assets`, `raw_volume_shortfall`, `pool_mix_shortfall`, `core_supply_shortfall`, `top10_contract`, `translation_title`, `large_company_cap`, or `publication`.
    - Pass when the repair targets the earliest responsible category and reruns the smallest relevant validation.
    - Fail when the same category causes more than one blind full-chain rerun without targeted repair.

16. `weekend_supply_policy`
    - Pass when weekend monitor-stage quantity floors are explicit and reported, while source-first, six-gate Card entry, Top10 count, and large-company caps remain strict.
    - Pass when weekend Top10 backfill comes only from non-large Core Pool items that pass the same Card gates.
    - Fail when weekend recovery relaxes the large-company cap, accepts social/community/builder material as direct Business Signal facts, or treats a lower monitor floor as permission to weaken frontstage quality.

17. `supply_preflight_before_cards`
    - Pass when Raw / Pool output is checked for active Raw count, Pool/routed Pool count, Core Pool count, non-large Core Pool count, lane coverage, and predicted Top10 eligibility before Card generation and dashboard/topic-center work.
    - Fail when Top10 shortage, Core Pool shortage, or large-company-cap pressure is discovered only after public frontstage data has already been built.

18. `publication_closure_checkpoint`
    - Pass when the 10:50 supervision checkpoint records merged Business Signals PR state, GitHub Pages state, same-date Business data, Top10 count, and local sync cleanliness / fast-forward status.
    - Fail when publication is called complete without checking both PR / Pages state and same-date frontstage data.

19. `provider_outage_pool_refill`
    - Pass when search-provider gateway/auth/domain failures are treated as provider unavailability and the monitor continues through source-backed fallback discovery instead of lowering coverage gates.
    - Pass when post-fetch Pool importance gaps trigger targeted refill for the missing importance types before Card generation.
    - Fail when an Exa `site:` domain restriction, Tavily 401, or Anysearch gateway outage can leave `importance_coverage_gaps_must_be_none` / `pool_importance_coverage_gaps_must_be_none` failing without a targeted refill attempt.

20. `case_title_source_precedence`
    - Pass when case Signal Card generation prefers the original/source event title over generated scenario templates.
    - Pass when fallback title cleaning rejects public titles such as `案例：AI 进入...` or `信号：AI 进入...` and derives a traceable title from the source title or URL instead.
    - Fail when a generated case scenario title overwrites the source event title and later trips the source-first/title gate.

21. `frontstage_display_field_hygiene`
    - Pass when frontstage subjects name the company, product, customer, workflow, or policy actor rather than generic media/source labels such as `Arstechnica`, `Techcrunch`, or `Cfodive`.
    - Pass when page navigation text such as `Back Start free trial`, `Contact Sales`, or language switcher blocks is rejected as public `translatedFact` and replaced by a source-title-derived fact.
    - Pass when a partially translated English source title that still trips the translation heuristic is discarded in favor of the already generated Chinese card title, not forced into public display.
    - Pass when a Chinese subject prefix plus Chinese colon does not exempt the remaining English title from translation, for example `Vendor：Introducing ...` or `Source：Applied AI Case Studies ...`.
   - Pass when public titles are source-title translations only: translate the original/source title into Chinese without adding interpretation, extra commercial framing, inferred funding purpose, or a rewritten event summary.
   - Fail when `title`, `displayTitle`, or Top10-compatible `generatedTitle` falls back to model-generated Chinese wording because the English source title has no literal translation mapping.
   - Fail when active-date Signal Cards exist but Top10 is empty because their English source titles have no approved entries in `source-title-translations.json`; repair the translation database or upstream title-translation step, not the source-first gate.
    - Pass when public facts reject template filler such as `original source says`, `original AI event`, `specific AI business event`, `signal value is to observe`, or `need to continue verifying customer/product/business outcome`; cards cleaned down to no source-facing fact must be removed from the frontstage JSON before Top10 selection.
    - Fail when the unified Business frontstage gate blocks on generic source subjects, untranslated display titles, or navigation fragments after Raw / Pool / Card gates already passed.

22. `enterprise_ai_fde_lens_precision`
    - Pass when `enterpriseAiTransformation` prioritizes source-backed FDE / customer-embedded delivery / production deployment / workflow rollout / procurement / pilot / technical-scoping evidence over broad governance or geopolitical AI-access stories.
    - Pass when each Enterprise AI / FDE lens item title is the original/source title translated directly into Chinese, using the same source-title boundary as Top10 and Core Pool candidate display.
    - Pass when explicit FDE field notes with usable production-rollout evidence, such as a Claude-first healthcare FDE pod operating in a regulated payer workflow, can enter the Enterprise AI lens without becoming a fourth formal Signal Card type.
    - Pass when every `enterpriseAiTransformation.cardId` resolves to a detail object in `cards`, `corePoolCandidates`, or Enterprise AI lens-only candidates, so the frontstage `详情` action never opens an empty state.
    - Pass when Enterprise AI lens subjects prefer real company/source subjects such as `Genzeon Platforms` or `GoGloby` over extracted title fragments such as `World Success Stories` or `Field Note`.
    - Fail when a broad governance item outranks concrete FDE / implementation evidence only because it contains words such as enterprise, security, governance, or compliance.
    - Fail when an FDE lens title is rewritten into a boss-facing summary instead of a literal source-title translation.
    - Fail when a lens-only item is displayed but omitted from the public payload used by the detail modal.

23. `supervision_data_publication_precedence`
    - Pass when daily supervision first checks same-date Business data health: activeDate matches the production date, public Top10 count is exactly 10, signal Card files are at least 10, `intelligence-graph-index.json` exists, and Business frontstage / monitor gates pass.
    - Pass when `frontstageSelection.supplyConstrained=true` is downgraded to a warning if Top10 count is 10 and gates pass.
    - Pass when a failed latest Business Signals workflow after healthy same-date data is classified as publication / branch / PR repair only.
    - Pass when local dirty workspace / Obsidian sync warnings are kept separate from Business data-generation status.
    - Fail when supervision asks for a blind Raw / Pool / Card rerun only because the latest workflow run is red, while same-date data and gates are already healthy.

24. `targeted_repair_before_full_rerun`
    - Pass when a Business repair records the pre-rerun checklist before starting a full chain: activeDate, Top10 count, signal Card count, Raw count, Pool/routed/Core/non-large Core counts, source-artifact freshness by source/channel, missing source-title translations, PR/Pages state, and local dirty / fast-forward state.
    - Pass when a deficient source lane triggers only the relevant source-artifact refill or retry refresh, and a translation-title shortage triggers only translation registry / frontstage rebuild work.
    - Fail when Raw / Pool / Card generation is rerun before ruling out stale local checkout, healthy remote assets, source-title translation starvation, publication failure, or local sync blockage.
    - Fail when a report says "raw shortage" without naming which source/channel or downstream eligibility bucket is actually short.

25. `weekly_repeated_failure_review`
    - Pass when two or more Business Hermes items with the same category in a seven-day window produce a weekly failure review report and a durable skill memory/eval update.
    - Pass when the review distinguishes true Business data failures from supervision observability, publication, and local-sync warnings.
    - Fail when repeated `business_signals_top10_missing` incidents are closed as same-day data fixes without identifying whether the root was stale assets, source-artifact retry, translation-title starvation, publication, or supervision classification.

26. `hermes_inbox_resolution_quality`
    - Pass when a resolved Business Hermes inbox item records the final fix commit or PR, exact validation command, and prevention artifact.
    - Pass when `pending-local-change` is used only before commit / PR publication and is updated after merge if the item is marked resolved.
    - Fail when a resolved item keeps `fix_commit=pending`, mixes contradictory resolution records, or omits the gate/eval/memory/context prevention artifact for a recurring failure.

## Repair Loop

When a check fails, repair the earliest responsible stage and rerun the exact failed gate. If the same category repeats in weekly health, add or tighten an eval and then add a short MEMORY entry if the lesson is durable.
