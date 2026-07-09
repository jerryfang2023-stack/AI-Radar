# Business Signals Monitor Evals

Run these pass/fail checks when supervising, repairing, or updating the Business Signals lane.

## Required Checks

1. `lane_owner_loaded`
   - Pass when Business Signals work routes through this skill before narrower Raw / Pool / Card skills.

2. `daily_monitor_thresholds`
   - Pass when Raw / Pool / routed Pool / Core supply targets remain visible as diagnostics, while V3 release blockers are limited to minimal Card supply, evidence integrity, source recovery, and downstream Card/frontstage gates.
   - Fail when Raw >=150, Pool >=75, routed Pool >=60, or any old Top10 supply rule is required after `raw_to_card_supply_release=true`.

3. `public_frontstage_card_contract`
   - Pass when `01-SiteV2/site/data/v3-data-observation-desk.json.frontstageCards` contains active-date public Cards sorted by importance / impact from high to low.
   - Pass when the public payload does not split Business Signals into `top10` and `corePoolCandidates` public modes.
   - Pass when former candidate items that satisfy display requirements are normalized into Cards rather than left in a separate public candidate pool.

4. `source_first_gate`
   - Pass when frontstage facts, titles, details, and source excerpts are traceable to original source text or accepted Raw / Pool evidence.
   - Pass when the production workflow uses the unified Business frontstage gate immediately after building Business Signals frontstage data and before dashboard generation.

5. `lane_isolation`
   - Pass when the Business Signals PR stages no First-Line Viewpoints or Community Intelligence data.

6. `builders_and_community_boundary`
   - Pass when builders viewpoints and community leads are not used as facts, graph evidence, or trend-candidate evidence unless recaptured through Raw / Pool.

7. `hermes_repair_closure`
   - Pass when any related Hermes inbox item is closed only after validation and a prevention artifact is recorded.

8. `publication_boundary`
   - Pass when publication uses automation branch -> PR -> `main` -> GitHub Pages, not direct deployment or direct generated-data push to `main`.

9. `before_10_problem_watchdog`
   - Pass when Business Signals has one primary production window at 08:57 Asia/Shanghai, one 09:27 conditional health-dispatch window that waits when same-date data is healthy or a same-date run is queued / in progress / successful, a 09:40 no-Hermes self-check / safe-repair window, and a 09:50 no-Hermes Codex handoff window.
   - Pass when `WaveSight Daily Problem Watchdog` records failed production runs to a dated report and Hermes inbox item without dispatching a recovery workflow.
   - Pass when Hermes morning recovery and early handoff workflows, package scripts, and GitHub workflow files are absent.
   - Fail when the lane relies on repeated 10:07 / 12:07 / 13:07 / 14:07 schedule loops or a Hermes recovery/handoff workflow instead of producing a problem report and Codex inbox item.
   - Fail when a queued / in-progress same-date workflow is reported as `manual_required` instead of `waiting`.

10. `six_gate_card_entry_contract`
    - Pass when raw-to-card eligibility is expressed through exactly these grouped gates: `source_auditability`, `evidence_quality`, `business_signal_scope`, `valid_page_type`, `commercial_importance`, and `fact_type_constraints`.
    - Pass when detailed diagnostics such as missing full text, extraction method, source URL, source level, stale date, page type, evidence object, funding round shape, or user feedback are reported under one of those gates.
    - Fail when scattered field checks are treated as independent top-level Card policy, or when a repair lowers source-first evidence requirements to increase the public Card count.

11. `technical_trend_context_boundary`
   - Pass when `important_technical_trend` is monitored only as context for source repair, relationship analysis, and trend-candidate work.
   - Pass when formal public Card types are only `case`, `funding`, and `product_service`; vertical deployment material enters as `case` when it has a named customer, deployment, procurement, partnership, rollout, or production implementation event.
   - Fail when targeted refill, Pool routing, or Card generation uses technical articles, builder/opinion posts, newsletters, workforce retraining / public-funding programs, docs, or generic guides as formal cards without a same-source dated funding, product/service, customer deployment, procurement, partnership, vertical rollout, or production implementation event.

12. `frontstage_card_title_source_boundary`
    - Pass when frontstage Card titles name the actual company, product, funding round, release, customer, or workflow event and do not contain placeholder wording such as "original AI event", "purpose see original", or source-domain subjects like "linkedin financing" / "github original title".
    - Pass when LinkedIn/X/Reddit/Hacker News posts, GitHub repo root/tree/blob pages, package/model pages, marketplace listings, and generic funding/startup lists are excluded from formal Signal Cards unless recaptured through a dated source-backed event page.
    - Pass when backend candidates are event-deduped so repeated pages about the same model release or financing round do not fill the candidate area.

13. `single_frontstage_card_set`
    - Pass when the Business Signals page has one Card set for the active date and no visible Top10 / candidate-pool mode switch.
    - Fail when public data or UI restores Top10 as a separate primary set or labels backend candidates as public candidates instead of Cards.

14. `morning_failure_fast_path`
    - Pass when Business Signals builds and validates the Business frontstage JSON before operations dashboard data, so frontstage Card, translation, and source-first failures stop early with a categorized report.
    - Fail when source-first and frontstage regression run as separate late-stage checks after unrelated operations data has already been generated.

15. `failure_category_router`
    - Pass when every failed or warning morning check is classified as one of: `supervision_observability`, `no_run_or_stale_assets`, `raw_volume_shortfall`, `pool_mix_shortfall`, `core_supply_shortfall`, `frontstage_card_contract`, `raw_card_ingestion_fields`, or `publication`.
    - Pass when the repair targets the earliest responsible category and reruns the smallest relevant validation.
    - Fail when the same category causes more than one blind full-chain rerun without targeted repair.

16. `weekend_supply_policy`
    - Pass when weekend monitor-stage quantity floors are explicit and reported, while source-first and six-gate Card entry remain strict.
    - Pass when weekend public Cards come only from Raw / Pool items that pass the same Card display gates.
    - Fail when weekend recovery accepts social/community/builder material as direct Business Signal facts, or treats a lower monitor floor as permission to weaken frontstage quality.

17. `supply_preflight_before_cards`
    - Pass when Raw / Pool output is checked for active Raw count, Pool/routed Pool count, cardable candidate count, lane coverage, and public Card readiness before Card generation and dashboard work.
    - Fail when frontstage Card shortage or cardable-signal shortage is discovered only after public frontstage data has already been built.

18. `publication_closure_checkpoint`
    - Pass when the before-10:00 self-check / Codex handoff records same-date Business data or active-run waiting state, public Card count when available, unresolved repair tasks, and the smallest validation path; later publication checks may record merged Business Signals PR state, GitHub Pages state, and local sync cleanliness / fast-forward status.
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
   - Pass when English source-title translation is captured or marked during Raw / raw-to-card ingestion instead of being deferred to frontstage selection.
   - Pass when `title`, `displayTitle`, or generated public title uses the formal Signal Card title after raw-to-card generation; missing literal translation mappings should trigger Card/generator repair, not frontstage suppression.
   - Fail when active-date Signal Cards cannot enter the public Card set because their English source titles have no approved entries in `source-title-translations.json`; repair the Raw/Card translation field or upstream title-translation step, not the source-first gate.
    - Pass when public facts come from Raw / Card extraction and template filler is repaired in the Card asset or generator.
    - Fail when the unified Business frontstage gate blocks on generic source subjects, untranslated display titles, navigation fragments, weak fact support, or missing customer / ROI / before-after details after Raw / Pool / Card gates already passed.

22. `enterprise_ai_fde_lens_precision`
    - Pass when `enterpriseAiTransformation` prioritizes source-backed FDE / customer-embedded delivery / production deployment / workflow rollout / procurement / pilot / technical-scoping evidence over broad governance or geopolitical AI-access stories.
    - Pass when each Enterprise AI / FDE lens item title is Chinese-facing and produced or recorded during Raw / Card / FDE Lens Pool asset generation, using the same ingestion boundary as public Cards.
    - Pass when explicit FDE field notes with usable production-rollout evidence, such as a Claude-first healthcare FDE pod operating in a regulated payer workflow, can enter the Enterprise AI lens without becoming a fourth formal Signal Card type.
    - Pass when every `enterpriseAiTransformation.cardId` resolves to a detail object in `cards` or Enterprise AI lens-only pools, so the frontstage `详情` action never opens an empty state.
    - Pass when Enterprise AI lens subjects prefer real company/source subjects such as `Genzeon Platforms` or `GoGloby` over extracted title fragments such as `World Success Stories` or `Field Note`.
    - Fail when a broad governance item outranks concrete FDE / implementation evidence only because it contains words such as enterprise, security, governance, or compliance.
    - Fail when an FDE lens title is rewritten into a boss-facing summary or hidden by generic frontstage title-translation suppression instead of being repaired in the FDE asset path.
    - Fail when a lens-only item is displayed but omitted from the public payload used by the detail modal.

23. `supervision_data_publication_precedence`
    - Pass when daily supervision first checks same-date Business data health: activeDate matches the production date, public Cards exist, `intelligence-graph-index.json` exists, and Business frontstage / monitor gates pass.
    - Pass when `frontstageSelection.supplyConstrained=true` is downgraded to a warning if public Cards exist and gates pass.
    - Pass when a failed latest Business Signals workflow after healthy same-date data is classified as publication / branch / PR repair only.
    - Pass when local dirty workspace / Obsidian sync warnings are kept separate from Business data-generation status.
    - Fail when supervision asks for a blind Raw / Pool / Card rerun only because the latest workflow run is red, while same-date data and gates are already healthy.

24. `targeted_repair_before_full_rerun`
    - Pass when a Business repair records the pre-rerun checklist before starting a full chain: activeDate, public Card count, Raw count, Pool/routed Pool counts, cardable candidate count, source-artifact freshness by source/channel, Raw/Card title-translation and fact-extraction status, PR/Pages state, and local dirty / fast-forward state.
    - Pass when a deficient source lane triggers only the relevant source-artifact refill or retry refresh, and a title/fact ingestion shortage triggers only Raw/Card generator repair plus rebuild.
    - Fail when Raw / Pool / Card generation is rerun before ruling out stale local checkout, healthy remote assets, Raw/Card title or fact extraction gaps, publication failure, or local sync blockage.
    - Fail when a report says "raw shortage" without naming which source/channel or downstream eligibility bucket is actually short.

25. `weekly_repeated_failure_review`
    - Pass when two or more Business Hermes items with the same category in a seven-day window produce a weekly failure review report and a durable skill memory/eval update.
    - Pass when the review distinguishes true Business data failures from supervision observability, publication, and local-sync warnings.
    - Fail when repeated `business_signals_frontstage_cards_missing` incidents are closed as same-day data fixes without identifying whether the root was stale assets, source-artifact retry, Raw/Card title-fact ingestion, publication, or supervision classification.

26. `hermes_inbox_resolution_quality`
    - Pass when a resolved Business Hermes inbox item records the final fix commit or PR, exact validation command, and prevention artifact.
    - Pass when `pending-local-change` is used only before commit / PR publication and is updated after merge if the item is marked resolved.
    - Fail when a resolved item keeps `fix_commit=pending`, mixes contradictory resolution records, or omits the gate/eval/memory/context prevention artifact for a recurring failure.

27. `provider_fallback_does_not_mask_supply`
   - Pass when RSS HTTP 404 / 415 / 429 / 5xx, Anysearch quota exhaustion, or other search-provider temporary unavailable notes are classified as recovered after Pool audit, Card supply, and importance coverage gates are already satisfied.
    - Pass when `raw_count_min` shortfall remains visible as `raw_count_release_override=raw_to_card_supply` instead of blocking the lane by itself.
    - Pass when `unrecovered_failed_sources_max` does not block release under `raw_to_card_supply_release=true`, while the failed source-channel notes remain visible in the gate report for supply-risk review.
    - Pass when keyword-only floors, AI-relevant title ratio, and off-topic raw-title count are visible diagnostics but do not block release under `raw_to_card_supply_release=true`.
    - Pass when source-artifact Raw selection rotates across GDELT, keyword search, RSS, and AI HOT as peer channels instead of consuming one fixed priority channel first.
    - Fail when a transient provider note or Raw-only shortage blocks Card generation after Pool audit supply and the frontstage Card contract are sufficient, or when provider recovery hides a true Pool/Card shortage.

28. `hermes_business_signal_data_entry_contract`
    - Pass when Hermes / data-officer analysis counts active-date public Business Signal Cards from `v3-data-observation-desk.json.frontstageCards.filter(card.date === meta.activeDate)` or `intelligence-graph-index.json.todayFrontstageCards`.
    - Pass when `intelligence-graph-index.json.summary.todayFrontstageCards` matches the active-date public Card count and funding presence is computed only from those active-date public Cards.
    - Pass when `product-service` is normalized to `product_service` before category analytics.
    - Fail when Hermes treats `coreSignalCards`, `relationshipDirections`, `observationSeeds`, `dailyLens.categoryStats.last7/total`, historical `cards`, or stale reports as today's frontstage Card set.

29. `provider_recovery_and_card_quality_boundary`
    - Pass when AIHOT recovery checks direct daily/all endpoint failures, fallback-search use, `source_item_count`, and `raw_candidate_count`; `status=collected` alone is not enough.
    - Pass when Anysearch is considered usable if keyword source-only returns source items and raw candidates, while individual query fallback failures stay visible as diagnostics.
    - Pass when the daily monitor log reports all-AIHot `aihot_core_count` / `aihot_index_only_count` separately from `aihot_daily_*` diagnostics, because original-source eligibility is channel-neutral after discovery.
    - Pass when recovered provider failures are reported as `source_provider_recovery_status=recovered_by_fallback` plus recovered/unrecovered counts, and appear in recovered diagnostics rather than remaining risks when V3 Card supply gates pass.
    - Pass when Card eligibility ignores search query tails, search paths, before/after clue guesses, affected-role guesses, and provider fallback labels.
    - Pass when research benchmarks, OCR/model papers, generic FDE explainers, job posts, ESG/environment reports, broad startup/funding lists, and duplicate media copies of the same financing event do not displace named customer deployments, procurement/contract cases, concrete product launches, or single-company funding events.
    - Fail when weak technical/context pages enter public Cards while stronger same-date Signal Cards remain backend-only only because English source-title translations are missing.

30. `ai_hardware_lens_boundary`
    - Pass when AI hardware investment/funding, scenario/service, and trend/innovation news is rendered through the separate `aiHardwareSignals` lens rather than mixed into the main active-date Card list by default.
    - Pass when AI hardware source-only artifacts can appear only as `ai_hardware_lens_only` observation items unless they separately pass Raw / Pool / formal Card gates.
    - Pass when AI hardware searches reject LinkedIn/social/profile posts, broad company lists, market reports, forecasts, and generic rankings.
    - Pass when hardware track classification is based on source title/fact/URL, not query theme metadata, so demand/profit/supply-chain items do not become investment/funding just because they came from an investment query.
    - Fail when a fourth formal Card type is introduced for AI hardware, or when query-derived AI hardware items bypass source-first Card eligibility.

## Repair Loop

When a check fails, repair the earliest responsible stage and rerun the exact failed gate. If the same category repeats in weekly health, add or tighten an eval and then add a short MEMORY entry if the lesson is durable.
