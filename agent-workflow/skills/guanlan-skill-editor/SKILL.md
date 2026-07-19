---
name: guanlan-skill-editor
description: Use when auditing, creating, updating, or cleaning WaveSight AI / Guanlan skills. Applies to Guanlan skill trigger descriptions, stale V2 rule removal, eval coverage, MEMORY.md hygiene, examples/references structure, conflicts between skills, and periodic skill self-improvement after real production incidents.
metadata:
  guanlan:
    version: "1.0.2"
    lane: "Skill system"
    status: "governance"
    order: 110
    responsibility: "Audit, create, update, and clean Guanlan skills."
    upstream: "current context, target skills, incidents"
    downstream: "skill edits, evals, examples, memory"
    gates: "trigger clarity, stale rule removal, eval coverage, memory hygiene"
    recent_learning: "Recurring failures should become evals or concise memory before long prose."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Skill Editor

Use this skill to keep Guanlan skills short, current, testable, and non-overlapping.

Do not use it to run daily monitoring, generate Cards, write builders viewpoints, or change frontstage data directly. For production data work, route to the domain skill first, then use this skill only to improve the skill system afterward.

## Required Reads

Read only what is needed:

1. Target skill `SKILL.md`.
2. Target skill `evals/`, `examples/`, `references/`, and `MEMORY.md` if present.
3. `references/audit-checklist.md` when doing a full audit.
4. `references/memory-policy.md` when editing memory.
5. `examples/good-skill-update.md` and `examples/bad-long-prose-rule.md` when deciding whether to add evals, examples, memory, or long prose.

For Guanlan system truth, prefer the project context files over old reports:

- `context/07-v3-intelligence-generation-rules.md`
- `context/frontstage-page-contracts.md`
- `context/05-daily-monitoring.md`

## Workflow

1. Identify the target skill and its neighbors.
2. Check the description first. It must say exactly when to trigger and when not to trigger.
3. Remove stale V2, daily-observation, business-brief, publiccopy, cardcopy, or copy-style execution rules unless the skill is explicitly about retired history.
4. Ensure the skill has a small core workflow and uses progressive disclosure:
   - keep stable procedure in `SKILL.md`;
   - move detailed rules to `references/`;
   - move examples to `examples/`;
   - move pass/fail checks to `evals/`.
5. Add or update pass/fail evals before adding long prose.
6. Add memory only for durable lessons from real failures.
7. Validate the skill folder.

## Editing Rules

- Keep `SKILL.md` concise and procedural.
- Do not duplicate full project context inside skills.
- Do not add README, changelog, or user-facing docs inside a skill folder.
- Do not preserve retired V2 or V3 public-page rules when they conflict with current V4 truth or an explicitly documented V3 compatibility boundary.
- Prefer concrete pass/fail checks over vague quality scores.
- Keep machine/debug labels out of user-facing frontstage guidance.

## Output

When finished, report:

- target skill changed;
- trigger description changes;
- evals added or updated;
- examples or references added;
- memory entries added, updated, or skipped;
- remaining conflicts or follow-up risks.
