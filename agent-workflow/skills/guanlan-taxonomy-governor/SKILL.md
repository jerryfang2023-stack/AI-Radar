---
name: guanlan-taxonomy-governor
description: Use when creating, assigning, auditing, migrating, aliasing, or deprecating TAG-V4 technical semantic tags, structured Facets, TagAssertions, and FacetAssertions. Do not use technical tags for event type, source, company, geography, industry, product form, use case, deployment, audience, evidence type, eligibility, ranking, relationship direction, opportunity, or trend judgment.
metadata:
  guanlan:
    version: "2.3.0"
    lane: "Data Center Taxonomy"
    status: "current sub-skill"
    order: 60
    responsibility: "Govern TAG-V4 technical definitions, structured Facets, and evidence-backed Claim-level assertions."
    upstream: "accepted Claims and taxonomy change requests"
    downstream: "tag_definitions, facet_definitions, tag_assertions and facet_assertions serving tables"
    gates: "known active definitions, evidence refs, exact spans, alias/parent/exclusion consistency, dimension separation"
    recent_learning: "Market layer, product form, industry, use case, and technology are separate dimensions. External market frameworks may govern a Facet, but must not collapse those dimensions into one flat category."
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

## Execution

Use the governed commands instead of editing generated assertions by hand:

```powershell
npm run assert:tag-taxonomy
npm run audit:tag-taxonomy
```

Review the read-only assertion and audit results first. `npm run reproject:tag-taxonomy` writes every dated bundle and has no dry-run mode; run it only when the taxonomy change and historical reprojection are explicitly authorized, then rerun `assert:tag-taxonomy` and `audit:tag-taxonomy`.

## Boundaries

- Ask for a taxonomy decision only when a proposed definition, alias, parent, exclusion, or deprecation would change the controlled vocabulary and current evidence cannot resolve it.
- Do not create an assignment from full-page themes, entity identity, query metadata, or UI needs.
- Keep unsupported candidates unassigned; do not invent a nearest tag or facet.

## Output

Produce validated definition changes and Claim-bound TagAssertions or FacetAssertions with exact evidence and explicit rejection reasons.

## Done When

Finish when every accepted assertion resolves to an active definition and exact Claim span, namespaces remain separated, conflicts/exclusions are enforced, read-only audit results are reviewed, and any authorized taxonomy change passes assertion, audit, and reprojection gates.
