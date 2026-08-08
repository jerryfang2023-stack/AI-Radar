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
- Normalized financing round code and Chinese label, original round text, amount source text plus deterministic normalized currency/base values, announced date when disclosed, financing disclosure status, all explicitly named current-round investors with roles, and evidence.
- At least one source-backed product or service.
- Chinese application-layer analysis: sector, capital judgment, validated signals, and at least one risk.
- One explicit `analysis.product_form_id` chosen from active `product_form` Facets by the product or service customers buy or users directly use, not by an enabling technology, feature, industry, or future application.
- `analysis.taxonomy_version=TAG-V4.1` plus one explicit market category from CB Insights AI 100 2026: Infrastructure & compute, Enterprise applications, Industry applications, or Physical AI.
- One explicit governed market subcategory except for Physical AI, and one explicit infrastructure application for Infrastructure & compute. Product form remains independent from this hierarchy.
- Supported `use_case_ids`, `industry_ids`, and at least one `target_user_id`; never add a technology/software industry default.
- DeepSeek provider/model/prompt provenance.
- A structured investment thesis and explicit customer-research status on every card.
- A passed `FUNDING-INSIGHT-AUTO-PUBLISH-GATE-V1.1`.

Customers, comparisons, metrics, founder details, investor public rationale, funding history, and Direction Card links remain optional unless a captured source supports them. Missing customer evidence is represented as `no_verified_customer_found`; it is never filled with a guess.

The combined public projection derives stable `historical_rounds` from accepted company-round cards and records `financing.cumulative_amount.basis`. A reported total takes precedence; otherwise the builder sums only parseable known rounds in the same currency and labels the result as an incomplete known-round total when coverage is partial.

Named investor evidence may feed `INVESTMENT-INSTITUTION-V1.0`. Each activity must retain its exact quote, source URL, financing card, company, round, date, role, and original/normalized amount. Corporate, government, and individual investors remain explicit subject types; this projection never creates canonical V4 entities or relationships.

## Fail-closed cases

Block the card when:

- the subject company cannot be resolved from the triggering event;
- the investor list is empty or contains an unnamed item;
- no investor is explicitly tied to the current round, or historical/ambiguous investors remain in the current-round list;
- required facts lack exact source quotes;
- fewer than two cited captured sources survive sanitation;
- required reader-facing narrative is not Chinese;
- a Direction Card identifier does not exist;
- a newly generated card omits `analysis.product_form_id` or uses an unknown product form;
- a newly generated card omits `analysis.market_category_id` or uses an unknown market category;
- a newly generated card omits the governed market subcategory/application required by its category, or its hierarchy is inconsistent;
- the source card omits its taxonomy version, supported use cases, industries, or target users;
- JSON, schema, or automatic-publication validation fails.

Blocked queue entries remain operational diagnostics and never enter `funding-insights-v1.json`.

## Primary product form

- Use one primary product form per card.
- Prefer the card's explicit `analysis.product_form_id`.
- Historical migration decisions live in `taxonomy-decisions-v4-1.json`; after migration every source card must hold the explicit value.
- The public builder must fail closed when a source card lacks a governed classification. Keyword and product-form fallback classifiers are forbidden.
- `compute_cloud_service` means hosted GPU, training, or inference capacity; `ai_compute_system` means physical servers, racks, clusters, data centers, or network systems; `ai_infrastructure_software` means the software layer for training, inference, memory, routing, compression, evaluation, or data delivery.

## AI market category

- Adopt CB Insights AI 100 2026: `infrastructure_compute`, `enterprise_applications`, `industry_applications`, and `physical_ai`.
- Use `infrastructure_compute` when the company supplies data, models, development/deployment, hardware/compute, observability/evaluation, or security infrastructure to builders of other AI products.
- Use `enterprise_applications` when the product serves a reusable cross-industry business function.
- Use `industry_applications` when the product is built around one industry's professional data, workflow, or regulation.
- Use `physical_ai` only when the current product is a robot, vehicle, or autonomous machine that senses, decides, and acts in the physical world. A world model or future embodiment plan is not enough.
- Never infer the market category from B2B/B2C, SaaS/API, software/hardware, or the word “platform”. Those are different dimensions.

## Historical ownership

Automatic historical admission covers verified financing sources published within the preceding three calendar months. Older financing remains in QA unless an explicit targeted-backfill instruction enables it. Before research, the generator checks every persisted Funding Insight bundle and skips financing already covered by a valid card's event ID or canonical company-plus-normalized-round key.

The same CanonicalEvent can appear in multiple daily bundles. Assign it once for historical generation:

1. prefer more `source_refs`;
2. then prefer more `claim_refs`;
3. then prefer fewer `missing_fields`;
4. then prefer the newer data bundle.

The combined frontstage projection first deduplicates by `triggered_by_event_id`, then aggregates every repeated disclosure by canonical company and normalized round code, including undisclosed, multi-round, and other categories. Every merged card preserves all source event IDs and disclosure rows.
Apply accepted organization corrections and merges from `company-identity-decisions.json` before computing the company-and-round key. The application decision preserves canonical event IDs and does not rewrite Data Center V4.

## Entity-link boundary

- Product and founder links use canonical exact matching only.
- Missing exact matches remain `null` and must enter `entity-review-queue.json` with source evidence.
- Reviewed non-exact aliases may be accepted only through `entity-link-decisions.json`; every accepted target must already exist as the same canonical V4 entity type and the full gate must confirm the decision was applied.
- The Funding Insights application never creates or mutates canonical V4 entities automatically.
