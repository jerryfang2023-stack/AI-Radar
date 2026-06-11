# Raw / Pool / Card Evals

Run these pass/fail checks after changing or running the WaveSight AI Raw -> Pool -> Core Pool -> Card -> frontstage chain.

Do not use numeric scores. Each check must be `pass` or `fail` with the file or field that proves it.

## Required Checks

1. `raw_pool_counts`
   - Pass when the active date has at least 150 active Raw candidates, at least 75 Pool items, at least 60 routed Pool items, and at least 30 usable `core_pool` items unless the run is explicitly marked blocked.

2. `frontstage_exact_top10`
   - Pass when the Business Signals default presentation publishes exactly 10 items for the active date.

3. `large_company_caps`
   - Pass when Top10 has at most one item for the same large company and at most three large-company items total.

4. `full_core_pool_visible`
   - Pass when the secondary Core Pool view includes the complete same-date Core Pool candidate set, not just Top10.

5. `candidate_promotion_status`
   - Pass when every Core Pool candidate is marked either `promoted_to_signal_card` or `candidate_only`.

6. `candidate_only_reason`
   - Pass when every `candidate_only` Core Pool item has a human-readable not-promoted reason, repair suggestion, and priority.

7. `source_first_details`
   - Pass when Card detail fields come from original source text, Raw evidence, or Pool excerpts, not from tags, `why_selected`, `business_elements`, old summaries, or frontstage fallback fields.

8. `no_detail_duplication`
   - Pass when `news fact`, `original points`, `value`, and `visible source excerpt` do not simply repeat the same sentence.

9. `no_title_subject_leak`
   - Pass when `subject` is a company, organization, product, customer, or institution, not a truncated title or headline phrase.

10. `translated_frontstage_titles`
    - Pass when frontstage titles are complete and Chinese-facing unless the original product/company name must remain English.

11. `internal_language_block`
    - Pass when frontstage and Hermes JSON do not expose internal production phrases such as `index_only`, `not_fact_signal`, `auto_signal_spec_null`, `fallback`, `backend field`, or stale V2 module names.

12. `builders_isolated`
    - Pass when follow-builders viewpoints are not used as business-signal facts, relationship graph evidence, or trend-candidate evidence.

13. `trend_candidate_boundary`
    - Pass when no trend candidate is created from a single article, single opinion, index page, or isolated funding event.

14. `hermes_contract`
    - Pass when `site/data/intelligence-graph-index.json` is valid JSON and states that Top10 is presentation-only while all Core Pool candidates are available for analysis.

## Repair Loop

When a check fails:

1. Identify whether the defect belongs to Raw collection, Pool routing, Card generation, frontstage build, or site display.
2. Fix the earliest responsible stage.
3. Rerun the narrowest relevant generator.
4. Rerun these checks.
5. Update `MEMORY.md` only if the failure teaches a durable lesson not already covered here.
