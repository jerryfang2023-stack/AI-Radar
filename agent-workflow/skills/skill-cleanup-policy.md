# Skill Cleanup Policy

Version: v1.3.0
Updated: 2026-06-13

This policy defines how Skill Store cleanup suggestions are generated and handled. It does not authorize automatic deletion.

## Protected Skills

Never auto-clean:

- `current` skills;
- lane owners;
- `supporting` skills;
- `governance` skills;
- skills required by the Daily Loop or Skill Evolution Audit.

Default action: `keep`.

## Review Actions

| Action | Meaning | Default Owner | Rule |
|---|---|---|---|
| `keep` | Keep or protect | Skill Ops | Current, supporting, governance, or no cleanup signal. |
| `cleanup` | Suggest cleanup | Skill Ops | Manually recommended, or no observed usage after the 30-day observation window. |

## Required Fields

Every generated skill record must include:

- `cleanup_action`;
- `cleanup_owner`;
- `cleanup_reason`;
- `replacement_skill`;
- `cleanup_observation_start`;
- `last_used`;
- `usage_count`.

## Human Review Rules

- New skills should be observed for 30 days before automatic cleanup suggestion.
- A human can manually add a normal skill to the cleanup list from the skill detail panel.
- A human can mark a mistakenly listed skill as common from the cleanup list.
- Moving to cleanup is not deletion.
- Deletion is two-step: move to `.skill-store-trash`, then permanently delete from the trash staging area.
- Guanlan lane owner, current, supporting, and governance skills require explicit human approval before retirement.
- Daily Loop failures should create or update evals, examples, or MEMORY before cleanup is considered.
