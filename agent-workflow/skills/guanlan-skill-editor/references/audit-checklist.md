# Guanlan Skill Audit Checklist

Use this checklist for full audits. Each item is pass/fail.

## Trigger Boundary

- The description front-loads `Use when` so truncated discovery metadata retains the user goal.
- The description names the concrete tasks that should trigger the skill.
- The description names at least one important `Do not use` exclusion.
- The body does not rely on a "when to use" section that is absent from metadata.

## GPT-5.6 Execution Contract

- Inputs or required supporting reads are explicit and scoped.
- The workflow is imperative and preserves appropriate degrees of freedom.
- Facts that must not be inferred and item/workflow stop conditions are explicit.
- Safe authorized local actions are distinguished once from external, destructive, costly, credential, publication, or scope-expanding actions.
- Output and observable completion criteria are explicit; a successful command alone is insufficient.
- API-only model controls are absent unless this Skill owns that API surface.

## Current Rule Alignment

- Data Center V4 is the current factual source of truth; V3 business-signal rules are current only inside their documented compatibility boundary.
- Retired daily-observation, business-brief, trend-report, publiccopy, cardcopy, and old copy-style gates are not active execution sources.
- Builders viewpoints are isolated from business-signal facts.

## Progressive Disclosure

- `SKILL.md` contains the core workflow only.
- Detailed policies live in `references/`.
- Good and bad artifacts live in `examples/`.
- Repeated pass/fail checks live in `evals/`.
- No duplicate copies of the same rule exist in multiple files unless one is a short pointer.

## Eval Coverage

- The skill has pass/fail checks for its most common failure modes.
- Representative coverage includes direct, indirect, incomplete, negative-trigger, and edge-case requests.
- Evals check observable artifacts, not vibes or numeric self-scores.
- Evals include recent production failures where relevant.
- The repair loop says what to rerun after a failure.

## Memory Hygiene

- `MEMORY.md` exists only when the skill benefits from durable lessons.
- Entries are reverse chronological.
- Each entry is dated and brief.
- Memory does not duplicate evals, command logs, or daily run counts.

## Examples

- At least one good example shows the target shape.
- At least one bad example shows known failure signatures.
- Examples are short enough to load selectively.

## Conflict Scan

- Neighbor skills do not claim the same responsibility without a boundary.
- The skill does not call retired outputs current.
- The skill does not instruct agents to lower quality gates to hit quantity.

## Validation

- YAML frontmatter has `name` and `description`; governed Guanlan skills also keep the validator-approved `metadata.guanlan` version, lane, responsibility, boundary, gate, and mirror fields.
- The skill folder validates with `quick_validate.py`.
- `agents/openai.yaml` exists, matches the current Skill purpose, contains no encoding damage, and its default prompt mentions `$skill-name`.
- The repository GPT-5.6 Skill prompt-contract gate passes for every active governed Skill.
