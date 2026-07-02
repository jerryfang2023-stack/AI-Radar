# Raw / Pool / Card Evals

Run these pass/fail checks after changing or running the WaveSight AI Raw -> Pool -> Core Pool -> Card -> frontstage chain.

Do not use numeric scores. Each check must be `pass` or `fail` with the file or field that proves it.

## Required Checks

1. `raw_pool_counts`
   - Pass when the active date has at least 150 active Raw candidates, at least 75 Pool items, at least 60 routed Pool items, and at least 30 usable `core_pool` items unless the run is explicitly marked blocked.

2. `frontstage_unified_cards`
   - Pass when the Business Signals default presentation publishes active-date public Cards from qualified Core Pool business signals.
   - Pass only when `01-SiteV2/site/data/v3-data-observation-desk.json.frontstageCards` exists, active-date cards are sorted by importance / impact descending, and no public `top10` / `corePoolCandidates` split is emitted.

3. `no_public_candidate_pool`
   - Pass when the page has no visible Top10 / candidate-pool mode switch and no candidate-only status label.

4. `core_pool_cards_visible`
   - Pass when every display-ready Core Pool business signal is normalized into a public Card.

5. `backend_pool_only_for_non_cards`
   - Pass when Core Pool items that cannot satisfy Card display requirements remain backend evidence and do not appear as public candidates or public Cards.
   - Fail when any active-date public Card has `notPromotedIssues`, `notPromotedReason`, or a `core_pool_not_promoted` handoff row.

6. `no_sort_reason_display`
   - Pass when frontstage Cards do not display ranking reasons, selection tiers, or internal priority labels.

7. `formal_card_event_boundary`
   - Pass when formal Signal Cards come only from concrete funding, product/service, customer deployment, procurement, partnership, vertical rollout, or production implementation events.
   - Pass when `important_technical_trend`, builder/opinion posts, newsletters, workforce retraining / public-funding programs, technical guides, architecture articles, docs pages, generic lists, and items marked with missing concrete customer/event evidence stay out of formal Signal Cards unless the same original source proves a dated formal event.
   - Pass when consumer entertainment, mobile games, creator/influencer protection features, platform enforcement notices, minor policy/compliance updates, monthly update roundups, explainer/why-we-built technical articles, analyst commentary, and unclosed VC-fund formation items stay out of public Cards unless the same source proves enterprise deployment, procurement, paid product adoption, financing, acquisition, or a material market-structure change.
   - Fail when a context-only technical trend or article is promoted to `core_pool` or Card quantity just to inflate the public Card count.

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
   - Pass when `site/data/intelligence-graph-index.json` is valid JSON and states that the public Card set uses all qualified Core Pool Cards.

## Repair Loop

When a check fails:

1. Identify whether the defect belongs to Raw collection, Pool routing, Card generation, frontstage build, or site display.
2. Fix the earliest responsible stage.
3. Rerun the narrowest relevant generator.
4. Rerun these checks.
5. Update `MEMORY.md` only if the failure teaches a durable lesson not already covered here.
