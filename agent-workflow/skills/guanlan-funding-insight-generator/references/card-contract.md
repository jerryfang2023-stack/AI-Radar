# Funding Insight card contract

## Evidence boundary

- Start from a verified Data Center V4 funding event.
- Use Tavily and Exa only to discover candidate pages.
- Capture readable source body text before citing it.
- Require each `evidence_ref.quote` to be an exact continuous substring of the captured `body_clean`.
- Bind every persisted evidence reference to the captured source `content_hash` and a SHA-256 `quote_hash`; the full gate rejects either hash drifting from the card source metadata or quote.
- Keep at least two cited research sources per published card.
- Never cite a search snippet, provider answer, model memory, or another card.

## Required publication content

- Company identity, Chinese summary, and evidence.
- Normalized financing round code and Chinese label, original round text, amount, announced date when disclosed, all explicitly named current-round investors, and evidence.
- At least one source-backed product or service.
- Chinese application-layer analysis: sector, capital judgment, validated signals, and at least one risk.
- DeepSeek provider/model/prompt provenance.
- A structured investment thesis and explicit customer-research status on every card.
- A passed `FUNDING-INSIGHT-AUTO-PUBLISH-GATE-V1.1`.

Customers, comparisons, metrics, founder details, investor public rationale, funding history, and Direction Card links remain optional unless a captured source supports them. Missing customer evidence is represented as `no_verified_customer_found`; it is never filled with a guess.

## Fail-closed cases

Block the card when:

- the subject company cannot be resolved from the triggering event;
- the investor list is empty or contains an unnamed item;
- no investor is explicitly tied to the current round, or historical/ambiguous investors remain in the current-round list;
- required facts lack exact source quotes;
- fewer than two cited captured sources survive sanitation;
- required reader-facing narrative is not Chinese;
- a Direction Card identifier does not exist;
- JSON, schema, or automatic-publication validation fails.

Blocked queue entries remain operational diagnostics and never enter `funding-insights-v1.json`.

## Historical ownership

Automatic historical admission covers verified financing sources published within the preceding three calendar months. Older financing remains in QA unless an explicit targeted-backfill instruction enables it. Before research, the generator checks every persisted Funding Insight bundle and skips financing already covered by a valid card's event ID or canonical company-plus-normalized-round key.

The same CanonicalEvent can appear in multiple daily bundles. Assign it once for historical generation:

1. prefer more `source_refs`;
2. then prefer more `claim_refs`;
3. then prefer fewer `missing_fields`;
4. then prefer the newer data bundle.

The combined frontstage projection first deduplicates by `triggered_by_event_id`, then aggregates every repeated disclosure by canonical company and normalized round code, including undisclosed, multi-round, and other categories. Every merged card preserves all source event IDs and disclosure rows.

## Entity-link boundary

- Product and founder links use canonical exact matching only.
- Missing exact matches remain `null` and must enter `entity-review-queue.json` with source evidence.
- Reviewed non-exact aliases may be accepted only through `entity-link-decisions.json`; every accepted target must already exist as the same canonical V4 entity type and the full gate must confirm the decision was applied.
- The Funding Insights application never creates or mutates canonical V4 entities automatically.
