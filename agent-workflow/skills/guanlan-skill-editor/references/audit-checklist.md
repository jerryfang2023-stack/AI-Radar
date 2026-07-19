# Guanlan Skill Audit Checklist

Use this checklist for full audits. Each item is pass/fail.

## Trigger Boundary

- The description names the concrete tasks that should trigger the skill.
- The description names important exclusions when adjacent skills exist.
- The body does not rely on a "when to use" section that is absent from metadata.

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
- `agents/openai.yaml` matches the current skill purpose if present.
