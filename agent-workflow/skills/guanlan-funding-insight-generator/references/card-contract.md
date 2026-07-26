# Funding Insight card contract

## Evidence boundary

- Start from a verified Data Center V4 funding event.
- Use Tavily and Exa only to discover candidate pages.
- Capture readable source body text before citing it.
- Require each `evidence_ref.quote` to be an exact continuous substring of the captured `body_clean`.
- Keep at least two cited research sources per published card.
- Never cite a search snippet, provider answer, model memory, or another card.

## Required publication content

- Company identity, Chinese summary, and evidence.
- Financing round, amount, announced date when disclosed, all explicitly named investors, and evidence.
- At least one source-backed product or service.
- Chinese application-layer analysis: sector, capital judgment, validated signals, and at least one risk.
- DeepSeek provider/model/prompt provenance.
- A passed `FUNDING-INSIGHT-AUTO-PUBLISH-GATE-V1.0`.

Customers, comparisons, metrics, founder details, investor public rationale, funding history, and Direction Card links remain optional unless a captured source supports them.

## Fail-closed cases

Block the card when:

- the subject company cannot be resolved from the triggering event;
- the investor list is empty or contains an unnamed item;
- required facts lack exact source quotes;
- fewer than two cited captured sources survive sanitation;
- required reader-facing narrative is not Chinese;
- a Direction Card identifier does not exist;
- JSON, schema, or automatic-publication validation fails.

Blocked queue entries remain operational diagnostics and never enter `funding-insights-v1.json`.

## Historical ownership

The same CanonicalEvent can appear in multiple daily bundles. Assign it once for historical generation:

1. prefer more `source_refs`;
2. then prefer more `claim_refs`;
3. then prefer fewer `missing_fields`;
4. then prefer the newer data bundle.

The combined frontstage projection also deduplicates by `triggered_by_event_id`.
