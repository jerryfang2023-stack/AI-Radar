# WaveSight Entity History V1 Contract

Status: current
Product version: `SITE-V4.2.0-entity-history`
Entity version: `ENTITY-V1.0`
Relationship version: `RELATION-V2.0`

## Purpose

Entity History is a rebuildable serving projection over accepted Data Center V4 facts and the independent First-Line Viewpoints dataset. It gives stable, cross-day entrances for organizations, products, and people without replacing CanonicalEvent, Claim, SourceArtifact, TAG-V4, or FacetAssertions as sources of truth.

## Object boundary

- Organizations, products/models/services, and people use stable `EN-*` entity identifiers.
- AI technology uses TAG-V4 technology nodes.
- Use cases and industries use TAG-V4 facet nodes.
- Viewpoint-only people remain scoped to `viewpoints`; their remarks cannot become CanonicalEvents or business-event evidence.
- Historical V4 bundles remain immutable. The entity service aggregates them and records first/last seen dates.

## Relationship boundary

Every public `RELATION-V2.0` row must have:

- stable subject and object references;
- an allowed factual predicate;
- one accepted CanonicalEvent;
- one or more Claim references;
- one or more SourceArtifact references;
- the event data date.

Allowed predicates are `publishes`, `partners_with`, `acquires`, `serves`, `deployed_in`, and `supplies_hardware_to`. Tags and facet co-occurrence cannot independently create a relationship.

## Frontstage boundary

- The sidebar remains unchanged.
- Entity Index covers organizations, products/models/services, people, technology, use cases, and industries.
- Entity pages lead with dated event timelines and factual related-data groups.
- Missing facts stay absent or disclosed as missing. Pages do not add overview prose, recommendations, rankings, opportunity scores, or inferred ownership.
- Default list routes load compact per-column indexes. Entity and taxonomy details load their own files on demand.

## History boundary

The first release aggregates all accepted repository history and reports its event-time and data-batch coverage. Missing pre-V4 dates are recorded as coverage gaps; they cannot be filled from legacy page copy or Cards. Additional backfill must start from archived Raw/source material and pass the V4 Claim and event gates.
