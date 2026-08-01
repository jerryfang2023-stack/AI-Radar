---
name: guanlan-skill-editor
description: Use when the user requests creating, updating, repairing, or cleaning WaveSight/Guanlan Skills, trigger metadata, workflows, evals, examples, references, memory, UI metadata, or conflicts. Do not use for an audit-only request with no mutation authorization; route read-only defect discovery to guanlan-code-rule-auditor.
metadata:
  guanlan:
    version: "2.0.1"
    lane: "Skill system"
    status: "governance"
    order: 110
    responsibility: "Create, update, repair, and clean Guanlan Skills after mutation is requested."
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
4. `references/gpt-5p6-prompt-contract.md` when creating, substantially revising, or certifying a Skill.
5. `references/memory-policy.md` when editing memory.
6. `examples/good-skill-update.md` and `examples/bad-long-prose-rule.md` when deciding whether to add evals, examples, memory, or long prose.

For Guanlan system truth, prefer the project context files over old reports:

- `context/12-data-center-v4.md`
- `context/08-automation.md`
- `context/frontstage-page-contracts.md`
- `context/05-daily-monitoring.md`

## Workflow

1. Identify the target user goal, concrete direct/indirect trigger examples, incomplete-input behavior, neighboring skills, and unsupported actions.
2. Check the description first. Front-load `Use when`, state one concise `Do not use` boundary, and keep detailed procedure out of metadata.
3. Define explicit inputs/supporting reads, an imperative workflow, facts that must not be inferred, when to ask/stop, output, and observable completion criteria.
4. Keep autonomy proportional: allow safe in-scope local inspection/edits/tests for change requests; require the owning workflow or explicit authorization for external, destructive, costly, credential, publication, or scope-expanding actions. State this policy once.
5. Remove stale V2/V3 execution rules unless the skill is explicitly about bounded retirement history.
6. Keep the core workflow lean and use progressive disclosure:
   - keep stable procedure in `SKILL.md`;
   - move detailed rules to `references/`;
   - move examples to `examples/`;
   - move pass/fail checks to `evals/`.
7. Add or update representative direct, indirect, incomplete, negative-trigger, and edge-case evals before adding long prose.
8. Add memory only for durable lessons from real failures.
9. Create or refresh `agents/openai.yaml`; its default prompt must mention `$skill-name`, and implicit invocation must reflect side-effect risk.
10. Validate and sync the repository runtime mirror, then rebuild the registry/dashboard. Sync the user-level compatibility `.skill-store` only when the request or owning repair workflow explicitly includes that external mirror. Record changed versus intentionally unchanged behavior.

## Editing Rules

- Keep `SKILL.md` concise and procedural.
- Do not duplicate full project context inside skills.
- Do not add README, changelog, or user-facing docs inside a skill folder.
- Do not preserve retired V2 or V3 public-page rules when they conflict with current V4 truth or an explicitly documented V3 compatibility boundary.
- Prefer concrete pass/fail checks over vague quality scores.
- Keep machine/debug labels out of user-facing frontstage guidance.

## Boundaries

- Preserve project-required `metadata.guanlan` even though the portable Skill minimum is `name` plus `description`; it is the source for WaveSight registry and governance tooling.
- Do not add GPT-5.6 model names, reasoning effort, Pro mode, caching, or API request fields to ordinary domain Skills unless the Skill actually owns that API surface and a measured failure requires it.
- Do not rewrite a working domain contract wholesale merely to standardize headings. Make each edit traceable to trigger accuracy, current truth, autonomy, output, completion, or a tested failure.
- Editing and local validation are allowed when the user requests Skill changes. Publication, deployment, destructive cleanup, credentials, or unrelated production repair remain separately owned.
- Writing outside the repository, including the compatibility `.skill-store`, requires explicit scope even when the contents are a mirror.

## Output

When finished, report:

- target skill changed;
- trigger description changes;
- evals added or updated;
- examples or references added;
- memory entries added, updated, or skipped;
- remaining conflicts or follow-up risks.

## Done When

Finish when every in-scope Skill has accurate trigger metadata, focused inputs/workflow/boundaries/output/completion, representative eval coverage, valid UI metadata, no stale or duplicated rule debt, all authorized runtime mirrors synchronized, and passing governance checks. A prose review without executable gates or artifact evidence is incomplete.
