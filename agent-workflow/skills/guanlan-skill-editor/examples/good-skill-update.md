# Good Skill Update Example

```yaml
change_reason: unauthorized_compatibility_sync_required_by_eval
updated:
  - evals/skill-editor-evals.md
  - references/gpt-6-astra-prompt-contract.md
  - examples/good-skill-update.md
validation:
  - validate-guanlan-skills
  - diff-repo-skills
  - test:model-routing
version_change: patch
```

Why it passes: the conflicting requirement is corrected in the owning eval and example, then the repo runtime is synced. The external compatibility mirror is updated only if explicitly included in the task. No memory is added for a lesson already captured by the regression.
