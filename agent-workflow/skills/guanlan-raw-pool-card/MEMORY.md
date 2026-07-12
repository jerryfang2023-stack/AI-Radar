# Guanlan Raw Pool Card Memory

Keep this file short. Add only durable lessons that improve the skill itself. Do not copy command output, daily counts, or one-off production details.

## 2026-07-12 Card Input Snapshot Boundary

- A Raw replay result is not a production Card input until the same Raw originals and Pool file are persisted in the publishing worktree. Manual Card regeneration must verify the persisted Raw count before asset cleanup or generation.
- The Card handoff and manifest must record Raw / Pool input counts, and manual backfills should use the expected-count guard so stale same-date Raw cannot silently produce a valid-looking Card release.

## 2026-07-11 Editorial Quality Boundary

- Daily Card freshness follows the actual source event, not the inferred Card type: product lifecycle events use a 14-day window; funding and customer cases use 30 days; undated sources stay backend-only until repaired.
- Formal Cards require readable source bodies and Chinese-facing fact material. A launch-like title or `traceable_summary` cannot compensate for failed extraction, and title/fact/value/excerpt fields must remain substantively distinct.
- Event blockers must inspect source identity narrowly. Do not let unrelated evidence text, query tails, or excerpt labels such as `opinion` suppress confirmed IPOs, lawsuits, shutdowns, or customer deployments.

## 2026-07-02

- `not_promoted_candidates`, `notPromotedReason`, and non-empty `notPromotedIssues` are hard blockers for public Cards. They may stay as backend Pool evidence, but must not be normalized into frontstage Cards, relationship graph inputs, or public Enterprise AI lens entries.
- Low-value AI-adjacent items are backend context unless the same original source proves a dated enterprise product/service, funding, customer deployment, procurement, acquisition, paid adoption, or material market event. This includes consumer entertainment/mobile games, creator or influencer protection features, minor platform enforcement/policy notices, monthly update roundups, explainer posts, analyst commentary, and unclosed VC-fund formation items.
- Do not lower Card quality to satisfy a desired count. If only a few same-date Raw / Pool items pass the formal Card gate, publish those and repair Raw/Pool supply separately.
- Historical public Top10, public candidate-pool display, and large-company caps are retired for BSIG-V1.2.0+. Current Business Signals publishes one active-date Card set with all qualified Raw / Pool items that pass formal Card gates.

## 2026-06-29

- `important_technical_trend` is context evidence, not a formal Signal Card lane. Technical articles, builder posts, newsletters, docs, and generic guides must not fill Card quantity unless the same original source proves a dated funding, product/service, customer deployment, procurement, partnership, vertical rollout, production implementation, acquisition, pricing, regulatory, or other commercial market-structure event.
- Workforce retraining / public-funding programs and newsletter roundups are context leads by default. Re-capture the original event source before they can become funding, product/service, case, or vertical-solution Cards.
- Public facts must not use scenario templates such as `source material shows ... involving ... workflow` or `the original text also mentions ...`. Use original-source facts, direct source-title facts, or remove the item before public Card release.

## 2026-06-07

- Raw / Pool candidates can be valid context evidence without becoming formal Signal Cards. Candidate-only items must still carry a not-promoted reason, repair suggestion, and priority so Hermes can analyze them with lower confidence.
- Handoff reports must include pre-spec filtering reasons. A `skipped_count: 0` report is misleading if candidates were filtered before formal Card specs were created.
- Frontstage and Hermes JSON must not expose internal issue codes. Keep machine/debug codes in reports or manifests, and convert user-facing fields to readable Chinese labels.
