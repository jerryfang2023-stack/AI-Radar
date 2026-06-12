# Good Skill Update Example

```yaml
change_reason: repeated_top10_missing
updated:
  - evals/business-signals-monitor-evals.md
  - examples/bad-top10-missing.md
  - MEMORY.md
  - SKILL.md required reads
validation:
  - validate-guanlan-skills
  - diff-skill-store
version_change: patch
```

Why it passes: the recurring failure becomes an eval, example, and short memory, then the runtime skill is synced.
