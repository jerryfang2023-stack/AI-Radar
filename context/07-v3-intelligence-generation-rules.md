---
status: current
scope: v3-raw-pool-card-trend-rules
version: V3.3.6.3-business-source-artifact-aggregation
last_updated: 2026-06-15
priority: current
---

# V3 Raw / Pool / Card / Trend Rules

This is the only active rule source for V3 business-signal production.

Historical site rules, legacy content-output routes, legacy publication templates, legacy copy gates, and broad "Guanlan judgment" rules are not active execution sources for V3.

V3 now has one core goal: preserve and display high-value AI business evidence as Cards, then use those Cards as knowledge-base material for relationship graph and trend-candidate analysis.

## 1. Current Outputs

V3 produces and preserves:

- Raw candidates;
- Pool evidence;
- signal cards;
- optional opinion cards only when a separate opinion-column rule is rebuilt;
- relationship graph inputs;
- trend candidates.

V3 does not require legacy content-output routes.

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
- if search-provider quota or temporary outage prevents the Raw floor from being filled, Raw shortfall is diagnostic rather than blocking once Pool, routed Pool, usable `core_pool`, non-large `core_pool`, and downstream Card gates are sufficient;
- source artifact Raw selection treats GDELT, keyword search, RSS, and AI HOT as peer discovery channels. There is no fixed priority order among them; any peer channel can satisfy Raw supply as long as it produces source-backed Raw artifacts and the downstream Pool / Core Pool / Card gates are healthy;
- keyword-only floors, AI-relevant title ratio, off-topic raw-title count, failed source-channel count, and Anysearch / provider quota notes are Raw-channel diagnostics under the same Pool / Core Pool / Card release rule; they must stay visible in reports but must not force a full rerun or block publication by themselves;
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

`important_technical_trend` is context evidence for trend candidates or product/service source repair. It is not a formal Signal Card importance type unless the same original source also proves a dated product/service launch, financing event, customer deployment, procurement event, partnership, or production rollout.

Pool does not write frontstage copy and does not replace source text with generated interpretation.

Pool quantity and balance:

- automation gate: keep at least 75 Pool items, with at least 60 routed Pool items and at least 30 usable `core_pool` items;
- required business-signal lanes must cover funding, product/service, customer/case, and vertical deployment; technical trend remains Pool / trend-candidate context and must not fill formal Signal Card quantity;
- each required importance lane should keep at least 5 Pool candidates before downstream release;
- large-company items may enter Pool as evidence, but `core_pool` must not be dominated by large-company news;
- default hard boundary: large-company `core_pool` items should be no more than 10 items and no more than 35% of usable `core_pool`;
- non-large-company `core_pool` depth should be at least 20 items so the frontstage Top 10 does not depend on repeated large-company news;
- extra large-company items should stay as watchlist / index / supporting evidence unless they remain inside the frontstage large-company quota.
- When routed Pool, `core_pool`, or non-large core supply is short, fix source supply with targeted searches for recent concrete actions. Valid refill targets include launches, releases, funding, acquisitions, partnerships, customer deployments, production rollouts, procurement, pricing, regulatory, and vertical workflow cases.
- Refill must not promote marketplace listings, directories, docs indexes, repo roots, package/model pages, generic guides, broad startup/funding lists, funding roundups, generic funding commentary, interviews, old evergreen technical posts, or search snippets into `core_pool` just to satisfy counts.
- `source_level` and `acquisition_source_level` are still traceability-only during refill; they cannot be used as value scores, core gates, ranking inputs, or automatic downgrade reasons.

## 4. Card Rules

Frontstage formal cards are:

- `signal_card`;
- `opinion_card` only after the opinion column is rebuilt separately.

Current V3 business-signal `signal_card` types are only:

- `product_service`;
- `funding`;
- `case`.

Enterprise AI transformation / 企业AI化 is a monitoring and frontstage interpretation lens, not a fourth `signal_card` type. It can help identify consulting-relevant evidence about FDE-style implementation, workflow change, governance, procurement, pilots, production rollout, and customer engineering capacity.

FDE / Applied AI / Technical Deployment role pages are organization-capability signals only. They must stay in Raw / Pool diagnostics or supporting context unless a separate original source proves a product / service action, financing event, customer deployment, procurement event, or production rollout that passes the six Signal Card gates below.

Generic FDE / applied-AI implementation pages are not Core Pool evidence by default. Job posts, role explainers, consulting/service landing pages, and "what is FDE" articles cannot be used to fill routed Pool, `core_pool`, or Card quantity gaps unless the same original source has a concrete dated customer deployment, product/service launch, financing event, procurement event, partnership, or production rollout.

Signal Card entry gate is expressed as six required gates. Do not re-expand these into scattered top-level field blockers:

1. `source_auditability`
   - Must have an original source URL and a resolved original-source role rather than a discovery/search entrance.
   - `source_level` / `acquisition_source_level` (`S` / `A` / `B` / `C` / `M`) are traceability labels only; they must not be used as Card eligibility gates, core_pool gates, ranking boosts, ranking penalties, or automatic downgrade reasons.
   - Cannot be deleted because downstream facts, frontstage Cards, relationship graph, and trend candidates must be traceable to an auditable source.

2. `evidence_quality`
   - Must be usable `core_pool` evidence with Raw QC `allow`, readable body text, extraction method, acceptable readability, high/medium extraction quality, usable excerpts / evidence object, and non-blocking degradation reasons.
   - Cannot be deleted because Card details must be rebuilt from original source text, not from search snippets, backend summaries, or old frontstage fields.

3. `business_signal_scope`
   - Must map to a current business-signal path that can become `product_service`, `funding`, or `case`.
   - Cannot be deleted because V3 Business Signals no longer publishes generic opinion, policy, ethics, article-summary, or retired content outputs as formal Cards.

4. `valid_page_type`
   - Must be a dated concrete event page, not a homepage, directory, docs index, catalog, package/model listing, marketplace listing, search result, generic report, or broad list unless that page itself contains a concrete dated event.
   - GitHub repo root / tree / blob pages, package or model pages, marketplace listings, and broad funding / startup list pages must not become formal Cards; resolve them to a dated release, announcement, funding, or customer page first.
   - Cannot be deleted because index-like pages repeatedly generated duplicate and generalized Cards instead of source-backed event Cards.

5. `commercial_importance`
   - Must meet the current importance threshold and preserve a clear commercial action, customer/deployment, financing, product/service, procurement, pricing, or operational signal.
   - Cannot be deleted because Pool can keep context, but Signal Cards should preserve scarce frontstage attention for commercially meaningful evidence.

6. `fact_type_constraints`
   - Funding must be a single-company financing round or equivalent clearly dated financing event; community feedback, comments, pure viewpoints, non-commercial policy/ethics material, and user feedback cannot be direct Card evidence unless separately recaptured through Raw / Pool from a source-backed business event.
   - LinkedIn, X / Twitter, Reddit, Hacker News, and other social/community posts are discovery or feedback evidence by default. They cannot be direct Business Signal Card evidence even when they mention an amount, launch, repo, or customer.
   - Cannot be deleted because these are the boundaries that prevent duplicated posts, opinion material, and broad commentary from becoming business-signal facts.

Daily business-signal target:

- frontstage presentation publishes every active-date qualified Core Pool business signal that can become a Card;
- the public page has one Card set, not a Top10 set plus a candidate pool;
- former candidate-pool items that pass Card display requirements must be normalized into frontstage Cards instead of remaining in a separate public candidate section;
- Card ordering is importance / impact descending. The page should not display sorting reasons as user-facing copy;
- include vertical-industry cases and emerging-company financing when qualified evidence exists;
- do not let large-company product news crowd out funding and cases in Pool/Core supply repair, but do not use a public Top10 or large-company-cap rule as a release gate.

Relationship graph and trend-candidate generation use the full eligible Card set.

Card title rules:

- keep the event nature of the original title;
- prefer original title or direct event title;
- public `title`, `displayTitle`, and Top10-compatible `generatedTitle` must be source-title translations only. If a source-title translation cannot be produced, the item is not ready for active-date frontstage display.
- do not mechanically rewrite into abstract judgment;
- do not use phrases like "materials show", "worth watching", "points to", or internal production wording.
- do not use placeholder phrases such as "original AI event", "use case seen in original", "purpose see original", or source-domain subjects such as "linkedin financing" / "github original title";
- do not fall back from source-title translation to model-generated title, old card title, source-domain subject, or fact-derived headline;
- active-date public payloads must not expose `modelGeneratedTitle`;
- if the title cannot name the actual company, product, funding round, customer, or release, the item is not ready for Top10 display.

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

Candidate pool display rules:

- public candidate pool entries must be event-deduped, not only URL-deduped;
- multiple pages about the same event, such as the same model release or the same funding round, should keep the highest-quality source-backed item and treat the rest as supporting evidence;
- social/community, repo/catalog, and generic list sources remain available in backend Pool evidence but should not fill the public candidate list as repeated near-duplicates.

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

Trend candidate is an internal candidate object, not a long-form publication route.

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
