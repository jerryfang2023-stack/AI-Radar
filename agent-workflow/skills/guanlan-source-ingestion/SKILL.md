---
name: guanlan-source-ingestion
description: Use when collecting or repairing Data Center V4 SourceArtifact and RawDocument records, body cleaning, provenance, snapshots, hashes, dates, language, and capture diagnostics. Do not use for event interpretation, commercial scoring, page copy, or recommendations.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Data Center"
    status: "current sub-skill"
    order: 10
    responsibility: "Produce immutable SourceArtifact and judgment-free RAW-V3 documents."
    upstream: "external sources and source discovery artifacts"
    downstream: "RawDocument, Claim and Entity extraction"
    gates: "source provenance, snapshot traceability, body cleanliness, capture integrity"
    recent_learning: "Discovery metadata is provenance, not event evidence."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Source Ingestion

Read `context/12-data-center-v4.md` and the RAW-V3 schema.

1. Preserve source URL, original text, snapshots, timestamps, hashes, and extraction diagnostics.
2. Remove navigation, recommendations, footer, search snippets, and template text from `body_clean` while preserving `body_original`.
3. Quarantine missing-source, unreadable, contaminated, or corrupted documents.
4. Never write importance, opportunity, trend, value, routing, recommendation, or inferred business fields.
5. Pass accepted and partial RawDocuments to Claim extraction; keep quarantined records in QA.
