---
name: guanlan-source-ingestion
description: Use when collecting or repairing Data Center V4 SourceArtifact and RawDocument records, including targeted-backfill candidate capture, body cleaning, provenance, snapshots, hashes, dates, language, and capture diagnostics. Do not use for event interpretation, commercial scoring, page copy, or recommendations.
metadata:
  guanlan:
    version: "1.3.0"
    lane: "Data Center"
    status: "current sub-skill"
    order: 10
    responsibility: "Produce immutable SourceArtifact and judgment-free RAW-V4 documents."
    upstream: "external sources and source discovery artifacts"
    downstream: "RawDocument, Claim and Entity extraction"
    gates: "source provenance, snapshot traceability, body cleanliness, capture integrity"
    recent_learning: "Raw owns source-title localization: preserve title_original, require approved title_zh, and record translation method, model, and source hash before publication."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Source Ingestion

## Inputs

Read `context/12-data-center-v4.md` and the current RawDocument contract.

## Workflow

1. Preserve source URL, original text, snapshots, timestamps, hashes, and extraction diagnostics in the configured `PRIVATE-EVIDENCE-STORE-V2.0`.
2. Remove navigation, recommendations, footer, search snippets, and template text from the private normalized body while retaining the private original body.
3. Quarantine missing-source, unreadable, contaminated, or corrupted documents.
4. Never write importance, opportunity, trend, value, routing, recommendation, or inferred business fields.
5. Pass accepted and partial RawDocuments to Claim extraction; keep quarantined records in QA.
6. For `BACKFILL-V1.0`, record every attempted query and candidate URL, then capture the original page as a new SourceArtifact and RawDocument. Never promote a result snippet or no-findings run into a fact.
7. Preserve `title_original` exactly. For an English title, generate `title_zh` through DeepSeek Flash, retry failed quality checks with Pro, and record method, model, and source hash. Do not use generic public MT or an event summary as a fallback.
8. Missing `DEEPSEEK_API_KEY`, request failure, changed factual tokens, or unresolved translation is a hard ingestion/publication failure. Do not silently publish the English title as Chinese.

## Boundaries

- Complete `body_original` and `body_clean` content belongs only in `PRIVATE-EVIDENCE-STORE-V2.0`. Public RawDocuments are body-free metadata records containing `body_length`, content hash, and an `evidence://<content_hash>` `body_ref`; never copy full bodies into the public repository, data lake, Vault, or site bundle.
- Ask for clarification only when the requested date, source, or repair target cannot be resolved from current artifacts and choosing one would change the result.
- Stop the affected item on missing provenance, unreadable bodies, ambiguous source identity, or failed translation; do not weaken the contract or invent replacement text.
- Do not publish, mutate canonical events, or clean unrelated files from this sub-skill.

## Output

Produce or repair private evidence objects plus public SourceArtifact/RawDocument metadata and explicit quarantine diagnostics, preserving provenance without exposing complete bodies.

## Done When

Finish when every accepted or partial record has a resolvable source, immutable private evidence object, public `evidence://` body locator, valid dates and language fields, approved title handling, no complete body in public artifacts, and a clear next-stage or quarantine state.
