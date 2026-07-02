# Raw / Pool / Card Evals

Run these pass/fail checks after changing or running the WaveSight AI Raw -> Pool audit -> Card -> frontstage chain.

Do not use numeric scores. Each check must be `pass` or `fail` with the file or field that proves it.

## Required Checks

1. `raw_pool_counts`
   - Pass when the active date has at least 150 active Raw candidates, at least 75 Pool items, at least 60 routed Pool items, and enough raw-to-card Card supply unless the run is explicitly marked blocked.
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
   - Pass when a funding Card without a registered source-title translation may use a factual company + amount / round title only if the original source title itself confirms the financing event; fail if the same fallback is used for rumors, broad lists, trackers, or commentary.
   - Pass when funding Card facts preserve source-backed investor, use-of-proceeds, product direction, or deployment context when available; fail if a rich source is reduced to a bare "X raised Y" sentence.
   - Pass when generic startup / funding list blockers inspect source identity fields only and do not reject a real single-company financing item because a source excerpt or captured query tail contains phrases such as `startup funding`.
   - Pass when `important_technical_trend`, builder/opinion posts, newsletters, workforce retraining / public-funding programs, technical guides, architecture articles, docs pages, and generic lists stay out of formal Signal Cards unless the same original source proves a dated formal business event.
   - Pass when missing named customers, adoption metrics, ROI, or before/after workflow details are treated as evidence-boundary notes rather than hard blockers for concrete funding, product/service, acquisition, partnership, procurement, pricing, regulatory, lawsuit/settlement, infrastructure, or other AI commercial market-structure events.
   - Pass when consumer entertainment, mobile games, creator/influencer protection features, platform enforcement notices, minor policy/compliance updates, monthly update roundups, explainer/why-we-built technical articles, analyst commentary, and unclosed VC-fund formation items stay out of public Cards unless the same source proves enterprise deployment, procurement, paid product adoption, financing, acquisition, or a material market-structure change.
   - Fail when a context-only technical trend or article is promoted to Card quantity just to inflate the public Card count.

8. `source_first_details`
   - Pass when Card detail fields come from original source text, Raw evidence, or Pool excerpts, not from tags, `why_selected`, `business_elements`, old summaries, or frontstage fallback fields.

9. `no_detail_duplication`
   - Pass when `news fact`, `original points`, `value`, and `visible source excerpt` do not simply repeat the same sentence.

10. `no_title_subject_leak`
   - Pass when `subject` is a company, organization, product, customer, or institution, not a truncated title or headline phrase.

11. `translated_frontstage_titles`
   - Pass when frontstage titles are complete and Chinese-facing unless the original product/company name must remain English.

12. `internal_language_block`
   - Pass when frontstage and Hermes JSON do not expose internal production phrases such as `index_only`, `not_fact_signal`, `auto_signal_spec_null`, `fallback`, `backend field`, or stale V2 module names.

13. `builders_isolated`
   - Pass when follow-builders viewpoints are not used as business-signal facts, relationship graph evidence, or trend-candidate evidence.

14. `trend_candidate_boundary`
   - Pass when no trend candidate is created from a single article, single opinion, index page, or isolated funding event.

15. `hermes_contract`
   - Pass when `site/data/intelligence-graph-index.json` is valid JSON and states that the public Card set uses all qualified raw-to-card Cards.

## Repair Loop

When a check fails:

1. Identify whether the defect belongs to Raw collection, Pool routing, Card generation, frontstage build, or site display.
2. Fix the earliest responsible stage.
3. Rerun the narrowest relevant generator.
4. Rerun these checks.
5. Update `MEMORY.md` only if the failure teaches a durable lesson not already covered here.
