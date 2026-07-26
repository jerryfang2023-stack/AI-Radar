# Codex Model Routing Eval V1

This suite compares three role configurations against one scenario derived from each of the 26 governed WaveSight Skill eval files:

- `sol-high`: `gpt-5.6-sol`, high reasoning
- `sol-medium`: `gpt-5.6-sol`, medium reasoning
- `terra-medium`: `gpt-5.6-terra`, medium reasoning

The same 26 scenarios, prompt, output schema, repository state and read-only sandbox are used for every configuration.

## Scoring

Each case receives:

- 1 point for the expected `pass` / `fail` decision;
- 1 point for citing an existing repository file as evidence.

Missing, duplicate or malformed results receive zero. The report records exact-match accuracy, evidence validity, latency and execution errors.

## Decision rule

- Keep `gpt-5.6-sol` high for the primary agent and complex quality review unless a broader implementation suite proves a lower tier equivalent.
- Use `gpt-5.6-sol` medium for bounded frontstage review when it preserves full boundary accuracy.
- Use `gpt-5.6-terra` medium for read-heavy exploration when it preserves full boundary accuracy.
- Never lower the global primary-agent model solely because Terra wins latency on this routing-focused suite.

## Commands

Validate the 26-case manifest without model calls:

```text
npm run check:model-routing-evals
```

Run all three configurations:

```text
npm run eval:model-routing
```

`CODEX_CLI_PATH` may point to the installed Codex executable. Results are written to `agent-workflow/reports/model-routing-eval-latest.json`.
