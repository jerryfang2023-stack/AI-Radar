# Raw / Pool / Card Evals

Run these pass/fail checks after changing or running the WaveSight AI Raw -> Pool audit -> Card -> frontstage chain.

Do not use numeric scores. Each check must be `pass` or `fail` with the file or field that proves it.

## Required Checks

1. `raw_pool_counts`
   - Pass when Raw 150, Pool 75 and routed Pool 60 remain visible coverage targets, while executable release uses the configured minimum evidence supply plus generated Card/editorial/frontstage gates.
   - Fail when a diagnostic quantity target blocks an otherwise healthy Card set or triggers weak-evidence padding.
   - Pass only when Pool generation preserves all non-discard screened Raw evidence instead of truncating to a fixed top-N / buffer cap.

2. `frontstage_unified_cards`
   - Pass when the Business Signals default presentation publishes active-date public Cards from qualified raw-to-card business signals.
   - Pass only when `01-SiteV2/site/data/v3-data-observation-desk.json.frontstageCards` exists, active-date cards are sorted by importance / impact descending, and no public `top10` / `corePoolCandidates` split is emitted.

3. `no_public_candidate_pool`
   - Pass when the page has no visible Top10 / candidate-pool mode switch and no candidate-only status label.

4. `raw_cardability_cards_visible`
   - Pass when every display-ready Raw business signal that passes cardability is normalized into a public Card.

5. `backend_pool_only_for_non_cards`
   - Pass when Raw / Pool items that cannot satisfy Card display requirements remain backend evidence and do not appear as public candidates or public Cards.
   - Fail when any active-date public Card has `notPromotedIssues`, `notPromotedReason`, or a `not_promoted_candidates` handoff row.

6. `no_sort_reason_display`
   - Pass when frontstage Cards do not display ranking reasons, selection tiers, or internal priority labels.

7. `formal_card_event_boundary`
   - Pass when formal Signal Cards come only from concrete funding, product/service, customer deployment, procurement, partnership, vertical rollout, or production implementation events.
   - Pass when high-value AI commercial market-structure events, including acquisitions / mergers, material partnerships, procurement / contracts, pricing or billing changes, regulatory approvals / antitrust actions, and material lawsuits / settlements, can enter Cards through the existing `case` or `product_service` Card types without adding a fourth public type.
   - Pass when funding recognition accepts confirmed English and Chinese single-company financing announcements, including `announcing our <amount> <round>`, `launches with <amount>`, `emerged from stealth with <amount>`, and `完成/获得/宣布 <amount> <round> 融资`, while rejecting rumors, future-tense funding claims, funding trackers, broad lists, and generic funding commentary.
   - Pass when company + amount + round clustering normalizes an optional trailing `AI` company suffix and blocks the whole funding event if any same-event source says the round is pending or not closed; fail if a more assertive secondary headline can still create a completed financing Card.
   - Pass when fundraise-process wording such as `help raise`, `ran its own fundraise`, `still coming together`, or `on track rather than closed` remains backend-only until the round is explicitly confirmed closed.
   - Pass when alternate-source articles for the same company + amount + round share one cross-date event identity and cannot create duplicate Cards.
   - Pass when the Raw/Card title translation generator stores a factual company + amount / round Chinese title for a confirmed single-company financing source title before publication; fail if the same fallback is used in the frontstage selector or for rumors, broad lists, trackers, or commentary.
   - Pass when funding Card facts preserve source-backed investor, use-of-proceeds, product direction, or deployment context when available; fail if a rich source is reduced to a bare "X raised Y" sentence.
   - Pass when confirmed single-company financing in AI hardware, chip, data-center, GPU, or infrastructure contexts is judged by original-source financing evidence, not blocked by those industry terms or by captured search-query tails such as `procurement`.
   - Pass when original-source confirmed strategic investments can enter the funding Card path without a disclosed amount, while rumors, future-tense funding claims, VC-fund formation, broad trackers, and generic funding commentary remain blocked.
   - Pass when strategic-investment Cards do not borrow amounts or rounds from page furniture such as `Also from this source`, adjacent old releases, related links, or historical recap sentences unless the current source title/event sentence itself confirms that amount or round.
   - Pass when customer or vertical case titles backed by the source can enter Cards through result verbs such as `uses`, `boosts`, `increased`, `reduced`, `saves`, or `improved`, even when the title does not use `launch` or `deploy`.
   - Pass when generic startup / funding list blockers inspect source identity fields only and do not reject a real single-company financing item because a source excerpt or captured query tail contains phrases such as `startup funding`.
   - Pass when `important_technical_trend`, builder/opinion posts, newsletters, workforce retraining / public-funding programs, technical guides, architecture articles, docs pages, and generic lists stay out of formal Signal Cards unless the same original source proves a dated formal business event.
   - Pass when missing named customers, adoption metrics, ROI, or before/after workflow details are treated as evidence-boundary notes rather than hard blockers for concrete funding, product/service, acquisition, partnership, procurement, pricing, regulatory, lawsuit/settlement, infrastructure, or other AI commercial market-structure events.
   - Pass when consumer entertainment, mobile games, creator/influencer protection features, platform enforcement notices, minor policy/compliance updates, monthly update roundups, explainer/why-we-built technical articles, analyst commentary, and unclosed VC-fund formation items stay out of public Cards unless the same source proves enterprise deployment, procurement, paid product adoption, financing, acquisition, or a material market-structure change.
   - Fail when a context-only technical trend or article is promoted to Card quantity just to inflate the public Card count.

8. `source_first_details`
   - Pass when Card detail fields come from original source text, Raw evidence, or Pool excerpts, not from tags, `why_selected`, `business_elements`, old summaries, or frontstage fallback fields.

9. `no_detail_duplication`
   - Pass when `news fact`, `original points`, `value`, and `visible source excerpt` do not simply repeat the same sentence.
   - Pass when the Card generator and unified Business gate compare normalized content, reject shared long prefixes, and block title-as-news-fact fallbacks.
   - Fail when a Card passes only because one duplicated field is truncated or prefixed with `原文称` / `原始来源标题显示`.

10. `no_title_subject_leak`
   - Pass when `subject` is a company, organization, product, customer, or institution, not a truncated title or headline phrase.

11. `translated_frontstage_titles`
   - Pass when frontstage titles are complete and Chinese-facing unless the original product/company name must remain English.
   - Pass when title-translation keys normalize repeated publisher/customer suffixes consistently across Card generation, frontstage build, and the source-first gate.
   - Pass when an English product proper name followed by an explicit Chinese event action such as `发布` remains a valid localized title without a redundant translation lookup.
   - Pass when production auto-translation uses a controlled business-news prompt or deterministic event rules, preserves protected names such as LLM, Anthropic, Cursor, Perplexity, and Fable, and blocks unresolved titles instead of persisting generic public machine-translation errors.
   - Fail when a legacy generic machine translation such as `LLM -> 法学硕士` can satisfy the exact-title translation gate.
   - Pass when a funding headline with a trailing factual clause still produces a source-bounded Chinese title that preserves company, amount, round, and protected AI-agent terminology.

12. `internal_language_block`
   - Pass when frontstage and Hermes JSON do not expose internal production phrases such as `index_only`, `not_fact_signal`, `auto_signal_spec_null`, `fallback`, `backend field`, or stale V2 module names.

13. `builders_isolated`
   - Pass when follow-builders viewpoints are not used as business-signal facts, relationship graph evidence, or trend-candidate evidence.

14. `trend_candidate_boundary`
   - Pass when no trend candidate is created from a single article, single opinion, index page, or isolated funding event.

15. `hermes_contract`
   - Pass when `site/data/intelligence-graph-index.json` is valid JSON and states that the public Card set uses all qualified raw-to-card Cards.

16. `daily_editorial_freshness_and_recall`
   - Pass when product lifecycle events are no older than 14 days and funding / customer cases are no older than 30 days, using Raw publication metadata, dated URLs, or source-backed page dates.
   - Pass when undated company profiles, explainers, and weak `traceable_summary` captures remain backend-only until dated original evidence and Chinese fact material are repaired.
   - Pass when confirmed IPOs, material AI lawsuits, product shutdowns, and `How X built/deployed Y` customer cases can produce Cards without being hidden by unrelated words or excerpt metadata labels.

17. `card_input_snapshot_contract`
   - Pass when every manual Card regeneration records `raw_input_count` and `pool_input_count` in the handoff / manifest and those values match the persisted same-date Raw originals and Pool sections.
   - Pass when a backfill or replay can use `--expected-raw-count=<count>` to stop before deleting or rewriting Cards if the persisted Raw input is stale or different from the audited count.
   - Fail when an isolated replay count is reported as production Raw but Card generation still consumes an older committed Raw file.
   - Pass when same-date regeneration stages deleted prior Card filenames, new Card files, the Pool-to-Card handoff, and the frontstage manifest as one publication unit.
   - Fail when the in-run workspace contains 14 current Cards but the merged repository retains additional stale same-date Card files from earlier Pool IDs.

18. `high_value_card_recall`
   - Pass when the production Core/high-value recall fixture promotes confirmed Chinese product launches, pricing changes, disclosed product events, and regional rollouts even if an earlier Pool route says `index_only` or the importance label is non-core.
   - Pass when a confirmed English-source event is not rejected solely because Raw lacks a redundant `fact_translation_zh` field, provided Card ingestion can normalize usable Chinese facts from the captured original-source excerpts.
   - Pass when fresh A/S-tier feature additions, product removals, and infrastructure launches are recalled from source-backed event text even if Pool labels them Watchlist/non-core; `primary_source` and `resolved_original_source` are both auditable after discovery acquisition.
   - Pass when AI relevance is tested against the event title and original-source body, excluding feed/source labels; fail if a non-AI article becomes a Card only because its RSS channel name contains `AI`.
   - Pass when confirmed formal events rejected only for repairable source resolution or Chinese-fact ingestion gaps are marked `priority=high` only if they have a fresh date, Core/Emerging routing, a core commercial importance type, and source-backed formal-event proof.
   - Pass when every eligibility-passing candidate either produces a Card spec or fails the editorial gate with a classified semantic reason; `auto_signal_spec_null` is never an acceptable unexplained terminal state.
   - Pass when jobs, viewpoints without a confirmed event, executive disputes, rumors/future plans, mathematical/research demonstrations, and internal benchmarks remain backend-only with explicit rejection reasons.
   - Pass when rumor markers are detected anywhere in a product title, not only at the title prefix, while source-backed `How X used Y to achieve Z` case titles remain eligible after title localization.
   - Fail when release checks validate only the quality of generated Cards and do not test whether known high-value candidates were silently omitted.

19. `frontstage_card_value_reuse`
   - Pass when the frontstage summary reuses the Card asset's source-backed `价值描述` before any category-level fallback.
   - Fail when multiple active-date Cards expose the same `这条产品/融资/案例信号可用于...` boilerplate while their Card assets already contain distinct source-backed value or evidence text.

20. `high_priority_recall_repair_boundary`
   - Pass when an undated YC launch, an unrelated policy RSS article, or an index-only social summary stays below high-priority recall even if a Chinese field is missing.
   - Pass when a voluntary privacy pledge without a separate commercial event remains backend context.
   - Pass when a funding Card keeps the current round amount distinct from valuation, related-story, rival-company, public-grant, and navigation-page figures; the source title's company and round amount control attribution.
   - Fail when page chrome such as `Total Shares`, a related-story excerpt, or a valuation number becomes the Card owner, news fact, source point, or value summary.
   - Pass when `usable_for: viewpoint` plus no event evidence is rejected before Card spec generation; also pass when an executive criticism, prediction, warning, or commentary title is rejected even if upstream labels the speech or post as `event_evidence: true` and adds broad commercial routes.

## Repair Loop

When a check fails:

1. Identify whether the defect belongs to Raw collection, Pool routing, Card generation, frontstage build, or site display.
2. Fix the earliest responsible stage.
3. Rerun the narrowest relevant generator.
4. Rerun these checks.
5. Update `MEMORY.md` only if the failure teaches a durable lesson not already covered here.
