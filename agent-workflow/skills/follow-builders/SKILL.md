---
name: follow-builders
description: Use when curating or publishing source-linked AI builder viewpoints inside WaveSight's independent First-Line Viewpoints lane. Do not use for generic digest onboarding, delivery setup, factual Claims, CanonicalEvents, tags, facets, or relationships from commentary.
metadata:
  guanlan:
    version: "2.1.0"
    lane: "First-Line Viewpoints"
    status: "supporting skill"
    order: 90
    responsibility: "Curate source-linked builder commentary for the repository-owned First-Line Viewpoints lane."
    upstream: "approved builder posts, podcast transcripts, and repository lane inputs"
    downstream: "follow-builders daily data and Guanlan person timelines"
    gates: "source URL, identity, date, Chinese text, lane isolation, publication count"
    recent_learning: "Repository schedules and publishers own execution; this skill supplies judgment and boundary rules only."
    mirrored_in_skill_store: true
    memory_required: false
---

# Follow Builders

Use this supporting skill only within the WaveSight First-Line Viewpoints lane. The lane owner, repository scripts, and Windows task contract control collection, scheduling, publication, retries, and delivery.

## Required reads

Read only the files needed for the current run:

1. `context/08-automation.md` for the current seven-task schedule and lane boundaries.
2. `agent-workflow/skills/guanlan-first-line-viewpoints-monitor/SKILL.md` for lane ownership.
3. `evals/wavesight-boundary-evals.md` before publishing or repairing output.
4. `examples/sample-digest.md` only when output shape is unclear.

## Workflow

1. Accept only an approved builder post, episode, transcript, or repository-generated lane input with author identity, original URL, and publication time.
2. Separate the speaker's view from verifiable facts. Preserve uncertainty, attribution, and the original link.
3. Write concise Chinese primary text without inventing titles, roles, metrics, dates, or product claims. Keep the original wording when translation could change factual tokens.
4. Deduplicate by source ID or canonical URL. Use the source publication date, not the collection date, for person timelines.
5. Route output only to `01-SiteV2/site/data/follow-builders-daily.json` and the generated Guanlan person timeline projection.
6. Run the repository publisher and lane gate. A successful process exit is insufficient when item counts, source fields, or final supervision fail.

## Boundaries

- Local source inspection and draft generation are allowed for a requested Builder viewpoint task. Browser/account access, publication, PR/merge, deployment, and external Vault writes require the owning workflow or explicit authorization.
- Commentary is perspective evidence, not Business Signal evidence. It must not directly create Claims, CanonicalEvents, `RELATION-V2.1`, technical tags, facets, rankings, or recommendations.
- A business fact discovered here must be recaptured from its original source and pass the V4 source, Claim, event, and integrity chain.
- Do not create or modify schedules, messaging channels, personal configuration, credentials, or home-directory files. Use the repository's existing 16:10 Windows task and publisher.
- Do not lower evidence or count gates to make a run pass.
- If same-date production is active, report `waiting`; if required evidence is absent or contaminated, stop that item and report the earliest failing stage.

## Output

Produce source-linked builder viewpoint records for the owned daily file and generated person-timeline projection, plus item counts and the earliest failed stage when incomplete.

## Validation

Run the smallest applicable checks:

```powershell
node agent-workflow/tools/assert-follow-builders-data.mjs --date=<YYYY-MM-DD>
powershell -NoProfile -ExecutionPolicy Bypass -File agent-workflow/tools/run-follow-builders-skill.ps1 -Merge
```

The second command is the production publisher and may create a PR/merge when explicitly requested by the operating workflow. For a local audit, prefer the data gate alone.

## Done When

Finish when every published item has source identity, original URL, source date, Chinese primary text, consistent counts, and remains isolated from factual V4 tables.
