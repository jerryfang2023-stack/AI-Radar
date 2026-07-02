# asset-card-generator

You generate V3 WaveSight AI business-signal assets.

Use only the current rule source:

```text
context/07-v3-intelligence-generation-rules.md
```

Historical V2 pages, daily observation rules, business brief rules, trend report rules, publiccopy gates, cardcopy gates, copy-style rules, and old opinion / follow-builders rules are not active inputs.

## Current Scope

Generate and preserve:

- `signal_card`;
- relationship graph input fields;
- trend-candidate inputs.

Do not write daily observation, business brief, trend report, or frontstage judgment copy.

## Signal Card Types

Business-signal cards may only use:

- `product_service`;
- `funding`;
- `case`.

Opinion cards are out of scope until a separate opinion-column rule is rebuilt.

## Daily Target

Default output is every active-date item that passes raw-to-card cardability checks.

The generator should use this flow:

```text
Raw -> dedupe / evidence quality check -> cardability judgment -> draft Card -> validation / publish
```

Pool remains an audit index and repair surface. It is no longer a required intermediate selector, fixed quota, or Top-N buffer before Card generation.

Include both large-company signals and smaller / vertical-market signals. Do not allow large-company product news to crowd out source-backed funding, case, acquisition, partnership, procurement, pricing, regulatory, or infrastructure signals.

## Evidence Rules

Use only eligible Pool items with source-backed evidence:

- original source URL;
- readable body text;
- source-derived key excerpts;
- hash;
- Raw QC allow;
- non-index evidence object.

Do not generate a Card from:

- search snippets;
- AI HOT summaries;
- homepage / directory / login / docs-index / tool-list pages;
- tags or `business_elements`;
- old frontstage copy;
- social / follow-builders / opinion content.

## Frontstage Field Rules

Card title keeps the event nature of the original title. Prefer original article title or a direct event title.

Card body fields:

- news fact: concrete event from source;
- original points: 3-6 concrete source facts from full text, key excerpts, or evidence seed;
- brief value: short commercial relevance derived from those facts;
- visible source excerpt: one traceable source fragment.

Never write naked-number fallback text such as "original key numbers include 54%".

If source-derived frontstage content is missing, mark the evidence-quality gap and skip or repair extraction. Do not downgrade a concrete funding, product/service, acquisition, partnership, pricing, procurement, or regulatory event merely because it lacks a named customer, adoption metric, or before/after workflow.

## Relationship And Trend Inputs

Every accepted Card should preserve:

- subject / company;
- source URL;
- Raw and Pool refs;
- card type;
- formal tags when available;
- source-derived points;
- missing information.

Relationship graph and trend candidates read from Cards. They do not read old daily-observation, brief, trend-report, or opinion rules.
