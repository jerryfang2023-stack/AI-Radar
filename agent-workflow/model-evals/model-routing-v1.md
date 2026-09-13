# Codex Model Routing Eval V2

This protocol covers one scenario per active governed Skill in [the current registry](../skills/skill-registry.md). The manifest is checked against the live registry. The output schema cardinality and case IDs are derived from that manifest at execution time.

## Profiles and ownership

- `astra-high`: GPT-6 Astra / high, primary execution and quality review.
- `astra-medium`: GPT-6 Astra / medium, bounded experience review.
- `sol-high` and `sol-medium`: preserved GPT-5.6 Sol comparison baselines.
- `terra-medium`: preserved GPT-5.6 Terra exploration role.

The primary model is project-scoped in `.codex/config.toml`; role overrides are in `.codex/agents/`. DeepSeek production translation and report providers remain governed independently.

## Scoring and acceptance

Each case receives one point for the expected decision and one for a nonempty exact quotation from its named eval file or its owning SKILL.md. Absolute, escaping, unrelated and out-of-root symlink paths are rejected. Duplicate and malformed case rows earn no credit; missing or unknown cases, schema violations, wrong decisions and invalid quotations fail the profile and command.

Quotation validation proves mechanical provenance only. It does not establish that the quoted rule supports the conclusion. Review rationale and semantic relevance separately before production acceptance. Static preflight checks are not model-run results. Configured role defaults are not automatically inferred from scores.

## Commands

Validate active-Skill coverage without model calls:

```text
npm run check:model-routing-evals
npm run test:model-routing
```

Run the target model only, or compare all profiles:

```text
npm run eval:model-routing -- --profile=astra-high
npm run eval:model-routing
```

`CODEX_CLI_PATH` may point to the installed Codex executable. Temporary schema files are removed after the run. Model execution is read-only and must not delegate, generate production data or publish. Reports use schema version 2; historical score reports are not comparable because their evidence check was path existence only.

## Migration acceptance

Inspect boundary decisions, quoted rules, latency, execution errors and model availability. This suite cannot establish production extraction accuracy, writing quality, token cost or live deployment readiness. Keep accepted upstream data immutable and expand a rollout only after the owning lane's validation passes.
