---
name: guanlan-taxonomy-governor
description: Use when creating, assigning, auditing, migrating, aliasing, or deprecating TAG-V4 technical semantic tags, structured Facets, TagAssertions, and FacetAssertions. Do not use technical tags for event type, source, company, geography, industry, product form, use case, deployment, audience, evidence type, eligibility, ranking, relationship direction, opportunity, or trend judgment.
metadata:
  guanlan:
    version: "2.0.1"
    lane: "Data Center Taxonomy"
    status: "current sub-skill"
    order: 60
    responsibility: "Govern TAG-V4 technical definitions, structured Facets, and evidence-backed Claim-level assertions."
    upstream: "accepted Claims and taxonomy change requests"
    downstream: "tag_definitions, facet_definitions, tag_assertions and facet_assertions serving tables"
    gates: "known active definitions, evidence refs, exact spans, alias/parent/exclusion consistency, dimension separation"
    recent_learning: "Technical tags and structured Facets share evidence rules but must remain separate namespaces."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Taxonomy Governor

Read `agent-workflow/product/tag-taxonomy-v4.json`.

1. Assign tags only to accepted Claims with exact evidence spans.
2. Keep event type, source, entity, geography, industry, use case, product form, deployment model, target user, function, workflow, deployment stage, and evidence type as structured fields or Facets.
3. Store all supported assertions; UI truncation is not a data rule.
4. Assign product form, use case, industry, deployment model, and target user through `FacetAssertion`, never by adding them to technical Tags.
5. Reject unknown, deprecated, default, unsupported, conflicting, excluded, or over-broad assignments.
6. Tags and Facets cannot admit, rank, score, relate, or validate events.
