---
name: guanlan-taxonomy-governor
description: Use when creating, assigning, auditing, migrating, aliasing, or deprecating TAG-V4 technical semantic tags, structured Facets, TagAssertions, and FacetAssertions. Do not use technical tags for event type, source, company, geography, industry, product form, use case, deployment, audience, evidence type, eligibility, ranking, relationship direction, opportunity, or trend judgment.
metadata:
  guanlan:
    version: "2.4.0"
    lane: "Data Center Taxonomy"
    status: "current sub-skill"
    order: 60
    responsibility: "Govern TAG-V4 technical definitions, structured Facets, and evidence-backed Claim-level assertions."
    upstream: "accepted Claims and taxonomy change requests"
    downstream: "tag_definitions, facet_definitions, Claim assertions, reviewed event classifications, entity aggregation, and application-center projections"
    gates: "known active definitions, evidence refs, exact spans, target-entity scope, cross-library consistency, alias/parent/exclusion consistency, dimension separation"
    recent_learning: "A classification belongs only to the target entity proven by its evidence. Founder biography, investor background, and other secondary-party context cannot classify the company; every Application Center consumer must project the same governed taxonomy version."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Taxonomy Governor

## Inputs

Read `agent-workflow/product/tag-taxonomy-v4.json`.

## Workflow

1. Assign tags only to accepted Claims with exact evidence spans.
2. Keep event type, source, entity, geography, industry, use case, product form, deployment model, target user, function, workflow, deployment stage, and evidence type as structured fields or Facets.
3. Store all supported assertions; UI truncation is not a data rule.
4. Assign product form, use case, industry, deployment model, and target user through `FacetAssertion`, never by adding them to technical Tags.
5. Keep AI market hierarchy separate from product form. For Funding Insights, use the adopted CB Insights AI 100 2026 hierarchy: Infrastructure & compute, Enterprise applications, Industry applications, or Physical AI; then use the framework's governed subcategory and infrastructure application where applicable. Product form remains an independent descriptor.
6. Reject unknown, deprecated, default, unsupported, conflicting, excluded, or over-broad assignments.
7. Tags and Facets cannot admit, rank, score, relate, or validate events.
8. Scope every classification to the entity explicitly identified by the supporting evidence. Never copy an event classification to every company, investor, founder, product, or location participating in the event.
9. Reject founder biography, former-employer history, investor thesis, investor portfolio, and other secondary-party context as evidence for the target company's business classification.
10. When a manually reviewed Funding Insight classification has exact research evidence but no accepted Claim span, store it as a separate `ReviewedEventClassification`; do not fabricate a Claim or weaken the Claim-bound assertion contract.
11. Project the governed dimensions and taxonomy version consistently to Data Center, Funding Insights, Trend Radar, Opportunity Evidence, and entity profiles.

## Execution

Use the governed commands instead of editing generated assertions by hand:

```powershell
npm run assert:tag-taxonomy
npm run audit:tag-taxonomy
npm run project:funding-taxonomy-events
npm run assert:taxonomy-consistency
```

Review the read-only assertion and audit results first. `npm run reproject:tag-taxonomy` writes every dated bundle and has no dry-run mode; run it only when the taxonomy change and historical reprojection are explicitly authorized, then rerun `assert:tag-taxonomy` and `audit:tag-taxonomy`.

## Boundaries

- Ask for a taxonomy decision only when a proposed definition, alias, parent, exclusion, or deprecation would change the controlled vocabulary and current evidence cannot resolve it.
- Do not create an assignment from full-page themes, entity identity, query metadata, or UI needs.
- Keep unsupported candidates unassigned; do not invent a nearest tag or facet.

## Output

Produce validated definition changes and Claim-bound TagAssertions or FacetAssertions with exact evidence and explicit rejection reasons.

## Done When

Finish when every Claim assertion resolves to an active definition and exact Claim span; every reviewed event classification resolves to exact research evidence and one target entity; namespaces remain separated; all Application Center consumers use the current taxonomy version; and assertion, audit, reprojection, entity aggregation, and cross-library consistency gates pass.
