---
name: guanlan-event-normalizer
description: Use when extracting exact-span Claims and candidate Entities, classifying EVENT-V1 event type and disclosed status, clustering duplicate events, or recording source conflicts. Do not use for trend, opportunity, importance, advice, page ranking, or tag inference from full pages.
metadata:
  guanlan:
    version: "1.2.0"
    lane: "Data Center"
    status: "current sub-skill"
    order: 20
    responsibility: "Convert auditable RawDocuments into source-linked Claims, Entities and CanonicalEvents."
    upstream: "accepted and partial RawDocument records"
    downstream: "CanonicalEvent, relationships, tags and domain projections"
    gates: "exact source spans, event enum, disclosed status, dedupe, conflict preservation"
    recent_learning: "A registered organization alias found only in a headline remains a candidate; verified entity status requires the same canonical organization to have an exact alias in accepted Claim evidence."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Event Normalizer

## Inputs

Read `context/12-data-center-v4.md`, `agent-workflow/product/data-center-v4-contract.md`, and the EVENT-V1 schema. Resolve public RawDocument `body_ref` values through the configured private evidence store; public RawDocuments are intentionally body-free.

## Workflow

1. Resolve each accepted RawDocument's `evidence://<content_hash>` locator with `privateEvidenceBodyForRaw` / `loadPrivateEvidenceEntries`, normalize that private body, and extract Claims only from exact spans in it.
2. Link candidate entities without silently resolving ambiguous identities.
3. Normalize supported event types and statuses from source-bounded action language.
4. Cluster duplicate sources and retain source/claim links and revision history.
5. Record conflicts as data. Do not choose a commercially preferred version.
6. Send absent, ambiguous, or contaminated evidence to QA rather than inventing an event.
7. Require source-bounded AI-industry scope. Publisher, feed, query, discovery channel, navigation, or incidental AI mentions do not qualify an event.
8. Route generic vertical “智慧 / 大模型” publicity without an identifiable AI-industry actor, product identity, market action, or reusable technical release to QA as `event_outside_ai_industry_scope`.
9. Preserve registered organization aliases found only in `title_original` as candidate mentions; promote them to verified only when an accepted Claim contains an exact alias for the same canonical organization.

## Boundaries

- Do not infer a missing actor, action, status, relationship, date, or commercial meaning.
- Stop the affected record if its private evidence object or body hash cannot be resolved; never fall back to snippets, public metadata, or reconstructed prose.
- Ask only when an unresolved identity or event boundary would materially change normalization and current source evidence cannot decide it.
- Stop the affected record at QA when evidence is absent, contaminated, conflicting, or out of scope; continue independent records.
- Local normalization and gates are allowed within the requested build or repair. External model calls, publication, deployment, and unrelated data writes require their owning workflow or explicit authorization.

## Output

Produce exact-span Claims, unresolved or resolved candidate Entities, deduplicated CanonicalEvents, and explicit QA/conflict records with complete source lineage.

## Done When

Finish when every produced Claim span resolves through its RawDocument `body_ref` to the normalized private body and matching content hash, every event uses supported enums and source-bounded action language, duplicates retain provenance, conflicts remain visible, and all rejected records carry an owning QA reason.
