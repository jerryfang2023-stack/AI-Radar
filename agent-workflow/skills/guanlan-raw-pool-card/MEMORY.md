# Guanlan Raw Pool Card Memory

Keep this file short. Add only durable lessons that improve the skill itself. Do not copy command output, daily counts, or one-off production details.

## 2026-06-12

- `frontstageCards` is not a substitute for the public/Hermes Top10 contract. The site data must emit an explicit active-date `top10` array with exactly 10 items, and gates must fail when it is missing.
- Keep internal Chinese signal titles separate from source-facing titles. Use generated titles for ranking/translation gates, but expose `displayTitle`/`sourceTitle` and `top10[].title` from the original/source title.

## 2026-06-07

- Core Pool candidates can be valid context evidence without becoming formal Signal Cards. Candidate-only items must still carry a not-promoted reason, repair suggestion, and priority so Hermes can analyze them with lower confidence.
- Handoff reports must include pre-spec filtering reasons. A `skipped_count: 0` report is misleading if Core Pool candidates were filtered before formal Card specs were created.
- Frontstage and Hermes JSON must not expose internal issue codes. Keep machine/debug codes in reports or manifests, and convert user-facing fields to readable Chinese labels.

## 2026-06-06

- Top10 is a presentation layer, not the full intelligence universe. Relationship graph and trend-candidate work must use the full eligible Core Pool/Card asset set.
- Large-company caps apply to Top10. The secondary Core Pool view should not hide evidence just because large companies exceed Top10 caps.
