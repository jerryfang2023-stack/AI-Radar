# Guanlan Skill Registry

Last updated: 2026-06-13

Skill Store version: v1.3.2 (2026-06-13)

Generated from `SKILL.md` metadata by `npm run build:skill-registry`. Do not edit the table by hand; edit the target skill metadata, evals, examples, or MEMORY instead, then regenerate.

## Current Skills

| Skill | Current responsibility | Lane | Status | Upstream | Downstream | Main gates | Eval coverage | Recent failure learning | Mirrored in `.skill-store` |
|---|---|---|---|---|---|---|---|---|---|
| `guanlan-business-signals-monitor` | Own Business Signals daily supervision and repair: Raw, Pool, Signal Cards, public Top10, Intelligence Map inputs, and trend-candidate inputs. | Business Signals | current lane owner | external source capture, daily persistent assets workflow, Hermes inbox | Signal Cards, public Top10, graph inputs, trend candidates, PR publication | monitor QC, post-monitor Raw / Pool gate, Card generation, source-first, frontstage Top10 | evals 1; examples 3; memory yes; references yes | Top10 is not complete unless the public top10 contract is present and current, even when Cards and selection data exist. | yes |
| `guanlan-first-line-viewpoints-monitor` | Own First-Line Viewpoints supervision and repair: builders data, Chinese translation, formal tags, and Obsidian person/date timelines. | First-Line Viewpoints | current lane owner | follow-builders source data, builders workflow, Hermes inbox | follow-builders-daily.json, frontstage page data, Obsidian opinion timelines, PR publication | builders data assertion, translation gate, URL/tag checks, sync idempotency | evals 1; examples 2; memory yes; references yes | V3.3.5 sync success means same-date person/date timeline files, not old month files. | yes |
| `guanlan-community-intelligence-monitor` | Own Community Intelligence supervision and repair: local logged-in collection, archive outputs, community data gate, and publication handoff. | Community Intelligence | current lane owner | local Windows collection, community publish workflow, Hermes inbox | community frontstage data, archive snapshots, community PR publication | local collection availability, community data assertion, archive presence, publication completeness | evals 1; examples 2; memory yes; references yes | GitHub can publish validated community files but cannot replace logged-in local collection. | yes |
| `guanlan-daily-monitor` | Run and repair the narrow Business Signals Raw / Pool monitoring chain. | Business Signals | current sub-skill | external monitoring sources | Raw / Pool outputs and daily reports | source capture, pool thresholds, quality gating | evals 1; examples 2; memory no; references no | Keep V3.3.5 thresholds aligned with current context; do not revive old Raw 80-150 / Pool 20-40 targets. | yes |
| `guanlan-monitor-quality-gate` | Gate monitor output before downstream Card and asset generation. | Business Signals | current sub-skill | Raw / Pool output | monitor pass/fail reports | eligibility, evidence quality, source-first fields | evals 1; examples 2; memory no; references yes | A pass should block weak source summaries before they become public Cards. | yes |
| `guanlan-daily-monitor-qc` | Audit Raw / Pool quality release and prevent noisy or stale monitor output. | Business Signals | current sub-skill | monitor reports and Raw / Pool data | QC decision, repair route | Raw quality, Pool quality, release readiness | evals 1; examples 2; memory no; references no | QC should protect source-backed judgment, not merely count items. | yes |
| `guanlan-raw-pool-card` | Convert eligible Raw / Pool evidence into source-backed Business Signal Cards. | Business Signals | current sub-skill | eligible Raw / Pool items | Signal Cards and card examples | source-backed details, type contract, field discipline | evals 1; examples 2; memory yes; references yes | Card frontstage details must come from original source text, not old summaries or backend fallbacks. | yes |
| `guanlan-trend-candidate-writer` | Judge and write lightweight trend candidates or no-candidate decisions from multiple source-backed business signals. | Business Signals | current sub-skill | Signal Cards, eligible Pool, recent source-backed history | trend candidate files or no-candidate reports | multi-signal threshold, source-type diversity, boundary notes | evals 1; examples 2; memory no; references no | A single article, opinion, funding event, or trend title is not a trend candidate. | yes |
| `follow-builders` | Generic builder digest behavior used by the First-Line Viewpoints lane owner. | First-Line Viewpoints | supporting skill | builder sources | digest entries used by lane scripts | source and digest boundary | evals 1; examples 1; memory no; references no | It can support First-Line Viewpoints, but it is not the lane owner. | yes |
| `guanlan-typography-qc` | Check WaveSight typography and layout copy issues when page work changes. | Cross-lane UI | supporting skill | frontstage pages | UI QC notes | typography and UI consistency | evals 1; examples 2; memory no; references no | Use only for page or typography work, not data truth. | yes |
| `guanlan-skill-editor` | Audit, create, update, and clean Guanlan skills. | Skill system | governance | current context, target skills, incidents | skill edits, evals, examples, memory | trigger clarity, stale rule removal, eval coverage, memory hygiene | evals 1; examples 2; memory no; references yes | Recurring failures should become evals or concise memory before long prose. | yes |

## Routing Rules

- Start with a lane owner when supervising or repairing a lane.
- Use sub-skills only after the lane owner identifies the failing stage.
- Do not let First-Line Viewpoints or Community Intelligence evidence enter Business Signal Cards, relationship graph evidence, or trend candidates without separate Raw / Pool verification.
- Prefer examples and evals for recurring mistakes; add long rule text only when examples and evals are insufficient.
- Keep workflow thin: scripts handle deterministic work, skills handle judgment and boundaries, gates block unsafe outputs, context stores project-level truth.
