# WaveSight Project Skills

This directory is the authoritative, versioned source for WaveSight-specific Skills.

## Runtime scope

Codex discovers project Skills from:

```text
.agents/skills/
```

That runtime directory is generated from this folder:

```text
npm run sync:repo-skills
```

Check for drift without writing:

```text
npm run diff:repo-skills
```

Do not edit `.agents/skills/` directly.

## Compatibility mirror

Selected rule assets are also mirrored to the private user Skill Store:

```text
C:\Users\86186\.skill-store
```

The private store is retained for Skill Ops compatibility, backup and dashboard workflows. It is not the runtime source or a default validation dependency for this repository. Project-specific global entries are disabled in Codex configuration so the repo-scoped copy wins deterministically.

Use:

```text
npm run sync:skill-store
npm run diff:skill-store
```

The default `check:skill-ops` gate requires the repo-scoped `.agents/skills` runtime and reports private mirror drift as informational. Use `npm run check:skill-ops -- --require-skill-store` or `npm run diff:skill-store` when the compatibility mirror itself must be exact.

Audit effective local discovery after changing global Skill configuration:

```text
npm run audit:skill-discovery
```

The audit rejects invalid manifests and duplicate enabled names. Global cleanup uses reversible `enabled = false` entries; it does not delete source folders.

`check:skill-ops` runs the same discovery audit and compares its effective counts with the generated Skill Store dashboard when the local Codex config and private store are available. Daily supervision already consumes this check; no second discovery scan is scheduled.

## Mirrored assets

- `SKILL.md`
- `MEMORY.md`
- `agents/`
- `evals/`
- `examples/`
- `references/`

Do not mirror runtime caches, package installs, generated feeds, `node_modules`, personal delivery configuration or secrets.

## Governance

- `skill-registry.md` is generated from Skill metadata.
- Change the source Skill here, run its evals, regenerate the registry when metadata changes, then sync both runtime and compatibility mirrors.
- Never delete or merge a Skill automatically during cleanup. Disable ambiguous or duplicate discovery paths first, validate routing, and remove only with explicit approval.
- Skills handle bounded judgment and project rules; deterministic scripts handle repeatable transformations; gates block unsafe outputs.
