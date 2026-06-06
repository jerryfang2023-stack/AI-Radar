---
status: current
scope: v3-raw-pool-card-trend-rules
version: V3.3.0-unified-intelligence-frontstage
last_updated: 2026-06-06
priority: current
---

# V3 Raw / Pool / Card / Trend Rules

This is the only active rule source for V3 business-signal production.

Historical V2 site rules, daily-observation writing rules, business-brief rules, trend-report writing rules, public-copy gates, cardcopy gates, and broad "Guanlan judgment" rules are not active execution sources for V3.

V3 now has one core goal: preserve and display high-value AI business evidence as Cards, then use those Cards as knowledge-base material for relationship graph and trend-candidate analysis.

## 1. Current Outputs

V3 produces and preserves:

- Raw candidates;
- Pool evidence;
- signal cards;
- optional opinion cards only when a separate opinion-column rule is rebuilt;
- relationship graph inputs;
- trend candidates.

V3 does not require daily observation, trend report, or business brief output.

## 2. Raw Rules

Raw is the daily monitoring candidate layer. It only collects external material.

Search tools are discovery entrances only. Every usable item must resolve to the original source page.

Raw should preserve:

- original URL;
- source name and source type;
- publication date when available;
- readable full text or clean text;
- key excerpts;
- source snapshot path or archive path when available;
- content hash and full-text hash;
- extraction method and readability score;
- page type / evidence object type;
- missing information.

The following pages are not formal evidence and must be downgraded to `index_only` unless the same page itself contains a dated concrete event:

- homepage;
- directory page;
- tool list;
- login page;
- documentation index;
- product catalog;
- package / model listing;
- marketplace listing;
- search-result page;
- SEO page;
- generic navigation page.

Raw does not make content judgments, give recommendations, or write market conclusions.

## 3. Pool Rules

Pool is the screened evidence pool.

`core_pool` must have:

- original source link;
- readable body text;
- source summary or usable article lead;
- evidence excerpts;
- content hash and full-text hash;
- Raw QC allow;
- a clear importance reason.

Pool type is not Card type. A Pool item can be useful evidence without becoming a product, funding, or case Card.

Pool does not write frontstage copy and does not replace source text with generated interpretation.

## 4. Card Rules

Frontstage formal cards are:

- `signal_card`;
- `opinion_card` only after the opinion column is rebuilt separately.

Current V3 business-signal `signal_card` types are only:

- `product_service`;
- `funding`;
- `case`.

Daily business-signal target:

- default 10 signal cards;
- include large-company signals;
- include vertical-industry cases;
- include emerging-company financing;
- do not let large-company product news crowd out funding and cases.

Recommended target mix:

| Type | Minimum | Target |
|---|---:|---:|
| Funding | 2 | 3 |
| Case / vertical deployment | 2 | 3 |
| Product / service | 2 | 3 |
| Best remaining qualified item | 0 | 1 |

Card title rules:

- keep the event nature of the original title;
- prefer original title or direct event title;
- do not mechanically rewrite into abstract judgment;
- do not use phrases like "materials show", "worth watching", "points to", or internal production wording.

Card detail rules:

- `news fact`: what happened, with subject, action, amount/product/customer/workflow when available;
- `original points`: source-derived facts from full text, key excerpts, or evidence seed;
- `brief value`: short commercial relevance derived from source facts;
- `visible source excerpt`: one traceable source fragment.

Hard stops:

- do not summarize a summary;
- do not generate "original key numbers include..." from naked numbers;
- do not use tags, `business_elements`, `why_selected`, `business_meaning`, search snippets, or old frontstage copy as source;
- do not show backend fields when frontstage copy is missing;
- do not include follow-builders or opinion material in business-signal cards.

## 5. Knowledge Base Rules

Accepted Cards are knowledge-base assets.

Each Card must preserve enough data for later analysis:

- card id;
- date;
- card type;
- subject / company;
- source URL;
- Raw and Pool refs;
- source-derived points;
- missing information;
- formal tags when available.

The knowledge base is for later relationship and trend analysis. It should preserve evidence, not conclusions.

## 6. Relationship Graph Rules

The relationship graph uses Cards as source nodes.

The graph should derive:

- nodes: company, product, investor, customer, industry, workflow, function, business action;
- edges: funds, launches, deploys, adopts, targets, integrates, supports, competes, expands;
- evidence: linked Card id and source URL.

The frontstage relationship module should present a visual dynamic graph, not long prose blocks.

Opinion content is not part of the current V3 business-signal relationship graph.

## 7. Trend Candidate Rules

Trend candidate is not trend report.

Do not create a trend candidate from:

- a single news item;
- one opinion;
- a trend article that only claims there is a trend;
- a funding event without broader repeated market evidence.

A trend candidate needs:

- multiple same-direction signal cards;
- multiple source types or evidence contexts;
- a clear commercial variable, such as product adoption, funding concentration, customer workflow, vertical deployment, infrastructure cost, procurement path, or governance requirement;
- evidence boundary.

The page must explain:

- what the trend is;
- where it appears;
- what evidence supports it;
- what boundary remains.

Do not use internal status labels or generic wording as the trend description.
