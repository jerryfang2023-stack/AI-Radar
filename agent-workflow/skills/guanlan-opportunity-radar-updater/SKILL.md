---
name: guanlan-opportunity-radar-updater
description: "Use when updating, rebuilding, auditing, or explaining the unlisted OMAP-V2.0.0 Opportunity Map, including source-backed Entry Point/Product Pain maps and human-reviewed Direction Cards. Do not use for weekly/monthly report prose, Guanlan Research pages, canonical-data mutation, trend candidates, Signal Card adapters, public navigation, or old formal_tags aggregation."
metadata:
  guanlan:
    version: "1.5.0"
    lane: "Opportunity Map"
    status: "downstream application"
    order: 92
    responsibility: "Own the unlisted source-backed Opportunity Map internal lab: Entry Point Map, Product Pain Map, and reviewed Direction Cards."
    upstream: "Accepted V4 CanonicalEvents, Claims, SourceArtifacts, Entities, FacetAssertions"
    downstream: "opportunity-map.html, opportunity-evidence-v2.json, opportunity-direction-cards.json, Claim-bound application assertions, evidence modal behavior, weekly opportunity radar notes"
    gates: "OMAP version boundary, accepted Claim/Source refs, reviewed direction definitions, no Signal Card fallback, no old formal_tags aggregation, map-specific evidence thresholds, noindex/nofollow internal-lab page, absent from public sidebar, no Relation Paths, evidence modal smoke, frontstage regression"
    recent_learning: "DeepSeek V4 Pro may write Direction Card titles and content, but generated candidates stay pending until evidence, unsupported numbers, judgment depth, and falsifiability pass gates plus human review."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Opportunity Radar Updater

This is a downstream decision-support/page-compatibility skill. Opportunity maps and scores cannot enter Data Center V4.

## Scope

Use this skill to update the unlisted `01-SiteV2/site/opportunity-map.html` internal lab's source-backed maps and reviewed Direction Cards:

- `Entry Point Map`: buyer or user x specific task.
- `Product Pain Map`: pain or constraint x product form / delivery model.
- `Direction Cards`: a small set of DeepSeek V4 Pro-drafted, human-reviewed startup hypotheses linked to accepted V4 Events, Claims, and SourceArtifacts.

Do not write weekly/monthly report prose with this skill. The map evidence comes from Claim-bound downstream application assertions; retired relation-path and Signal Card adapters must not return to the page.

## Required Reads

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/12-data-center-v4.md`
4. `context/frontstage-page-contracts.md`
5. `agent-workflow/product/opportunity-signal-taxonomy.json`
6. `references/update-rules.md`
7. `agent-workflow/product/opportunity-direction-cards.json`
8. `01-SiteV2/site/data/opportunity-evidence-v2.json` and the accepted V4 bundle rows referenced by it.

## Cadence

Run as part of the consolidated weekly report task every Monday at 10:30 Asia/Shanghai. The window is the previous complete Monday through Sunday.

Default window:

- Primary update window: latest 30 days of accepted V4 evidence, with weekly editorial review of Direction Cards.
- Baseline comparison: previous 30 days.
- Context check: 90 days only when deciding whether a cell is persistent, newly warming, or a one-off spike.

The deterministic V4 evidence projection may rebuild daily. Direction Card interpretation should be reviewed weekly so it reflects accumulated evidence rather than news noise.

This skill does not own an independent scheduled task. Its refresh completes before weekly report content generation so Opportunity Map and downstream reports may read the same accepted projection without sharing page ownership or version metadata.

## Workflow

1. Confirm the week window and active data source.
2. Rebuild or audit application assertions from exact accepted Claims and their SourceArtifact references.
3. Keep only source-near fields that the source supports:
   - buyer/user;
   - team/function;
   - specific task;
   - business action;
   - product form;
   - delivery model;
   - pain/constraint;
   - adoption evidence;
   - source evidence type.
4. Generate the two maps from those fields:
   - `Entry Point Map`: buyer/team rows x specific-task columns.
   - `Product Pain Map`: pain rows x product-form or delivery-model columns.
5. Compare 7-day cells against the 30-day baseline.
6. Leave unsupported cells blank. A blank cell is better than a vague cell.
7. Send only accepted 30-day Event IDs, Claim refs, Source refs, source excerpts, original URLs, actors, and downstream assertions to `deepseek-v4-pro`; require 2–3 candidate directions with judgmental titles, a structural judgment, a falsifiable hypothesis, a counter-signal, unknowns, and a first validation action.
8. Keep generated candidates in `opportunity-direction-card-candidates.json` with `pending_human_review`; DeepSeek output cannot publish or replace `opportunity-direction-cards.json` automatically.
9. Human-review a maximum of a few Direction Cards. Reject unsupported numbers, absolute or promotional language, weak actor diversity, evidence mismatches, and category-name titles before promotion.
10. Keep the two maps as separate sections on `opportunity-map.html`; Direction Cards are a third full-width section, not a new top-level navigation item and not a replacement for either map.
11. Keep `<meta name="robots" content="noindex, nofollow">` and keep Opportunity Map absent from the six-entry public sidebar.
12. Put cell and Direction Card evidence behind click-to-open detail, not in a permanent right-side "Cell Evidence" panel.
13. Run syntax, Direction Card generation tests, and frontstage regression checks after data or page generation.

External model calls and human-review promotion run only when the user or owning weekly workflow authorizes them. Local evidence inspection, deterministic projection, and read-only gates are safe within an authorized update/audit task. Publishing, navigation changes, or automatic candidate promotion are outside this skill.

## Evidence Rules

Allowed evidence:

- accepted V4 CanonicalEvents and exact Claims;
- source URL and original source excerpt;
- Claim-bound downstream application assertions;
- first-party announcement, case study, customer deployment, funding news, procurement, pricing, product launch, technical release, or credible business media.

Disallowed as direct map evidence:

- old `formal_tags`;
- broad AI topic labels;
- trend prose;
- First-Line Viewpoints;
- Community Intelligence posts unless the same underlying fact is separately captured from an original source and accepted through the V4 Claim/Event chain;
- internal ROI assumptions, private customer outcomes, or imagined implementation results.

If a source does not name a buyer, task, product form, pain, or adoption evidence, record the missing field instead of inventing one.

Direction Cards may state downstream hypotheses and validation questions, but they must be explicitly labeled as hypotheses rather than facts or recommendations. They must not contain unsupported market size, revenue projections, opaque opportunity scores, claims that a direction is "worth doing", or factual numbers absent from the cited source excerpts.

## Heat Meaning

A hot cell should answer: "Where is there repeated source-backed movement that could guide an AI-native startup decision?"

Rank cells by:

- evidence count in the 7-day window;
- diversity of companies or actors;
- presence of customer deployment, procurement, pricing, adoption, or funding action;
- original-evidence strength;
- change versus the 30-day baseline.

Do not rank by:

- generic AI popularity;
- tag volume alone;
- number of repeated articles about the same event;
- model-generated label frequency.

## Output Rules

The weekly output should support these decisions:

- which buyer/task combinations deserve founder interviews;
- which product forms are being pulled by concrete pain;
- which cells are noisy supply-side launches;
- which cells have adoption or budget evidence;
- which cells should stay empty because source evidence is weak.
- which few reviewed directions have enough evidence for founder interviews, and what remains unknown.

When a cell is highlighted, include at least one Event ID, Claim ref, Source ref, and source title in the supporting notes or report. When no support exists, do not highlight it.

Direction Cards require at least two accepted Events with explicit Claim and Source references and should prefer multiple actors or evidence forms. A single funding event, product launch, broad topic label, or model-generated aggregation cannot publish a Direction Card.

## Output

Produce Claim-bound application assertions, the two evidence-backed map projections, pending Direction Card candidates, explicitly reviewed Direction Cards, and click-to-open evidence details. Report blank/unsupported cells and review rejections rather than filling them.

## Validation

Before finishing:

1. Verify both maps and reviewed Direction Cards render only in `01-SiteV2/site/opportunity-map.html`, under `OMAP-V2.0.0-v4-evidence`.
2. Verify Guanlan Research contains no opportunity matrices or OMAP metadata.
3. Verify Opportunity Map has `noindex,nofollow` and is absent from every public sidebar.
4. Verify no `Relation Paths`, `Signal Candidates`, old time-clustering, or old tag-aggregation module returns.
5. Verify the old map toggle buttons and persistent right-side evidence panel do not return.
6. Verify retired relation-path or Signal Card data did not return and was not converted into application assertions.
7. Verify every Direction Card resolves to at least two accepted Events with accepted Claim refs and original-source URLs, and that no Direction Card was generated from tag frequency alone.
8. Verify candidate provenance is `deepseek-v4-pro`, generated candidates did not auto-publish, and reviewed cards expose both `judgment` and `counter_signal`.
9. Run the most relevant syntax check for edited scripts.
10. Run `node agent-workflow/tools/frontstage-regression-gate.mjs` after page/data changes.

## Done When

Finish when both maps resolve to accepted Claim/source evidence, unsupported cells stay blank, candidates remain pending until explicit review, reviewed cards meet provenance/falsifiability gates, the route remains unlisted/noindex, and the applicable syntax and frontstage checks pass.
