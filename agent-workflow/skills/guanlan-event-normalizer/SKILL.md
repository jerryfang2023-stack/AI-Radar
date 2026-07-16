---
name: guanlan-event-normalizer
description: Use when extracting exact-span Claims and candidate Entities, classifying EVENT-V1 event type and disclosed status, clustering duplicate events, or recording source conflicts. Do not use for trend, opportunity, importance, advice, page ranking, or tag inference from full pages.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Data Center"
    status: "current sub-skill"
    order: 20
    responsibility: "Convert auditable RawDocuments into source-linked Claims, Entities and CanonicalEvents."
    upstream: "accepted and partial RAW-V3 documents"
    downstream: "CanonicalEvent, relationships, tags and domain projections"
    gates: "exact source spans, event enum, disclosed status, dedupe, conflict preservation"
    recent_learning: "A source channel labeled AI does not make an event AI-industry data; eligibility must be proved by the title or accepted Claims."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Event Normalizer

Read `context/12-data-center-v4.md` and the EVENT-V1 schema.

1. Extract Claims only from `body_clean` and preserve exact character spans.
2. Link candidate entities without silently resolving ambiguous identities.
3. Normalize supported event types and statuses from source-bounded action language.
4. Cluster duplicate sources and retain source/claim links and revision history.
5. Record conflicts as data. Do not choose a commercially preferred version.
6. Send absent, ambiguous, or contaminated evidence to QA rather than inventing an event.
7. Require source-bounded AI-industry scope. Publisher, feed, query, discovery channel, navigation, or incidental AI mentions do not qualify an event.
8. Route generic vertical “智慧 / 大模型” publicity without an identifiable AI-industry actor, product identity, market action, or reusable technical release to QA as `event_outside_ai_industry_scope`.
