# WaveSight V4 Code and Rule Audit Checklist

## 1. Source of truth and reachability

- Pin the current version and task route.
- Inspect commands named `audit`, `check`, or `validate` for hidden writes before running them.
- Confirm workflow/script paths and imports exist with exact casing.
- Trace CLI arguments to the owning child stage.
- Require one producer and at least one current consumer for every generated artifact.
- Separate active contradictions from historical descriptions.

## 2. Correctness

- Compare observable behavior with current V4 context and contracts.
- Check empty, partial, stale, duplicate, malformed, conflict, and same-date rerun states.
- Ensure fallbacks do not hide missing evidence or leak backend-only fields.
- Confirm gates read the exact artifact and version produced upstream.
- Confirm tests validate behavior and lineage, not only syntax or existence.

## 3. Architecture and ownership

- Keep deterministic work in scripts, judgment boundaries in Skills, release decisions in gates, and project truth in context.
- Keep SourceArtifact, RawDocument, Claim, Entity, CanonicalEvent, FDE, hardware, facets, tags, and relationships within their contracts.
- Keep Opportunity Map, Trend Radar, Funding Insights, and Reports downstream from accepted V4 evidence.
- Keep First-Line Viewpoints, Community Intelligence, and OPS out of canonical fact tables.
- Prefer deleting unreachable compatibility code over adding another branch.

## 4. V3 retirement integrity

- No active workflow, package command, Skill, agent instruction, page, deployable JSON, or current contract may require V3 Card, Pool files, desk, old graph, legacy mappings, or `compatibility_cards`.
- No current source may claim that retired payloads live in the working tree or archive.
- Historical reports and immutable published HTML may describe prior V3 behavior.
- Old route redirects may remain only when they load no V3 content or data.
- `RAW-V3.0` is a current RawDocument contract version and is not itself a compatibility interface.

## 5. Security and integrity

- Check secrets, tokens, webhooks, credentials, and personal paths are not committed or logged.
- Check external input is not passed unsafely to shells, templates, paths, or generated JavaScript.
- Check workflow permissions are minimal and untrusted pull requests cannot access production credentials.
- Check generated-data writes preserve source lineage.
- Check repair automation cannot silently commit, push, close incidents, or deploy outside its declared mode.

## 6. Performance and reliability

- Find repeated full scans, duplicate builds, repeated collection, and serial network work.
- Confirm retries do not convert permanent contract failures into endless reruns.
- Confirm same-date generation, synchronization, and publication are idempotent.
- Confirm diagnostics cannot trigger source recollection after an accepted V4 batch.

## 7. GitHub workflow necessity

- Map each trigger, permission, artifact, PR writer, merge step, Pages owner, and deployment target.
- Flag duplicate schedules, duplicate Pages deployments, recursive triggers, and jobs rebuilding unchanged artifacts.
- Confirm generated files have one controlled writer.
- Keep advisory audits non-blocking until their false-positive behavior is understood.

## 8. Finding quality

- Cite a current reachable path and tight evidence.
- Name the violated contract and earliest owner.
- Explain actual impact without speculation.
- Propose the smallest repair and concrete validation.
- Label unresolved reachability as `needs-runtime-proof`.
