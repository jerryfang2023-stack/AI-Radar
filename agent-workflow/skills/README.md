# WaveSight Skill Mirrors

This directory mirrors selected Guanlan / WaveSight skills from:

```text
C:\Users\86186\.skill-store
```

The mirror exists so project-specific skill rules can be reviewed, versioned, rolled back, and handed off with the WaveSight repository.

## Scope

Mirror only rule assets:

- `SKILL.md`
- `agents/`
- `evals/`
- `examples/`
- `references/`
- `MEMORY.md`

Do not mirror runtime caches, package installs, generated feeds, `node_modules`, or personal delivery configuration.

## Current Mirrors

- `guanlan-business-signals-monitor`
- `guanlan-first-line-viewpoints-monitor`
- `guanlan-community-intelligence-monitor`
- `guanlan-daily-monitor`
- `guanlan-raw-pool-card`
- `guanlan-daily-monitor-qc`
- `guanlan-monitor-quality-gate`
- `guanlan-trend-candidate-writer`
- `guanlan-typography-qc`
- `guanlan-skill-editor`
- `follow-builders`

## Registry

- `skill-registry.md` indexes the current lane owner, upstream / downstream boundary, main gates, eval coverage, latest reusable learning, and whether the skill is mirrored in `.skill-store`.

## Update Rule

When a mirrored skill changes in `.skill-store`, copy the same scoped rule assets here and validate the mirrored folder. If the project mirror and `.skill-store` conflict, treat `.skill-store` as the installed runtime source and update this mirror before committing.

Do not use this directory to run daily production, generate Cards, or change frontstage data directly.
