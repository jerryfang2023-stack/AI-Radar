---
status: current
scope: v3-raw-pool-card-trend-rules
version: V3.3.5-builder-obsidian-date-timelines
last_updated: 2026-06-13
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

Raw quantity is for evidence coverage, not frontstage balance:

- automation target / gate: keep at least 150 active Raw candidates in the daily production chain;
- Raw may contain large-company material, but monitor logs must expose over-concentration by vendor/theme;
- Raw must not be padded with repeated large-company product announcements when funding, customer, vertical, regulation, pricing, procurement, or emerging-company evidence is available.

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

Pool quantity and balance:

- automation gate: keep at least 75 Pool items, with at least 60 routed Pool items and at least 30 usable `core_pool` items;
- required lanes must cover funding, product/service, customer/case, vertical deployment, technical trend, and viewpoint/article context when available;
- each required importance lane should keep at least 5 Pool candidates before downstream release;
- large-company items may enter Pool as evidence, but `core_pool` must not be dominated by large-company news;
- default hard boundary: large-company `core_pool` items should be no more than 10 items and no more than 35% of usable `core_pool`;
- non-large-company `core_pool` depth should be at least 20 items so the frontstage Top 10 does not depend on repeated large-company news;
- extra large-company items should stay as watchlist / index / supporting evidence unless they remain inside the frontstage large-company quota.

## 4. Card Rules

Frontstage formal cards are:

- `signal_card`;
- `opinion_card` only after the opinion column is rebuilt separately.

Current V3 business-signal `signal_card` types are only:

- `product_service`;
- `funding`;
- `case`.

Signal Card entry gate is expressed as six required gates. Do not re-expand these into scattered top-level field blockers:

1. `source_auditability`
   - Must have an original source URL, a resolved original-source role rather than a discovery/search entrance, and source level `S` / `A` / `B`.
   - Cannot be deleted because downstream facts, Top 10, relationship graph, and trend candidates must be traceable to an auditable source.

2. `evidence_quality`
   - Must be usable `core_pool` evidence with Raw QC `allow`, readable body text, extraction method, acceptable readability, high/medium extraction quality, usable excerpts / evidence object, and non-blocking degradation reasons.
   - Cannot be deleted because Card details must be rebuilt from original source text, not from search snippets, backend summaries, or old frontstage fields.

3. `business_signal_scope`
   - Must map to a current business-signal path that can become `product_service`, `funding`, or `case`.
   - Cannot be deleted because V3 Business Signals no longer publishes generic opinion, policy, ethics, article-summary, or retired daily-observation outputs as formal Cards.

4. `valid_page_type`
   - Must be a dated concrete event page, not a homepage, directory, docs index, catalog, package/model listing, marketplace listing, search result, generic report, or broad list unless that page itself contains a concrete dated event.
   - Cannot be deleted because index-like pages repeatedly generated duplicate and generalized Cards instead of source-backed event Cards.

5. `commercial_importance`
   - Must meet the current importance threshold and preserve a clear commercial action, customer/deployment, financing, product/service, procurement, pricing, or operational signal.
   - Cannot be deleted because Pool can keep context, but Signal Cards should preserve scarce frontstage attention for commercially meaningful evidence.

6. `fact_type_constraints`
   - Funding must be a single-company financing round or equivalent clearly dated financing event; community feedback, comments, pure viewpoints, non-commercial policy/ethics material, and user feedback cannot be direct Card evidence unless separately recaptured through Raw / Pool from a source-backed business event.
   - Cannot be deleted because these are the boundaries that prevent duplicated posts, opinion material, and broad commentary from becoming business-signal facts.

Daily business-signal target:

- frontstage presentation publishes exactly 10 signal cards per date;
- Signal Card assets should cover all qualified Core Pool items, including cards not displayed in the frontstage Top 10;
- include at most 1 signal per large company in the frontstage Card set per date;
- include at most 3 large-company signals in total in the frontstage Card set per date;
- frontstage presentation must still publish exactly 10 items per date; if the large-company caps leave fewer than 10 eligible items, expand Raw collection and repair Pool/Core Pool selection instead of weakening the caps or padding with repeated large-company news;
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

This mix is a monitoring and candidate-pool coverage target, not a frontstage ordering rule. Frontstage presentation must rank the day by importance and publish exactly the 10 most important business signals after applying the same-company and total large-company caps. Relationship graph and trend-candidate generation still use the full eligible Core Pool / Card asset set, including non-displayed Pool-backed Cards.

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
