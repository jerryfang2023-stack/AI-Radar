# Codex Model Routing Eval - Latest

Generated: 2026-09-11T15:48:22.086Z

Protocol: `agent-workflow/model-evals/model-routing-v1.md`

| Profile | Model | Effort | Status | Score | Decisions | Evidence | Duration |
|---|---|---|---|---:|---:|---:|---:|
| astra-high | gpt-6-astra | high | evaluation_failed | 45/46 | 22/23 | 23/23 | 319.9s |

## Mismatches

- `astra-high` / `funding-insight`: expected `pass`, got `fail`; exact citation valid: true.

## Routing Decision

- Primary agent: `gpt-6-astra/high`
- Quality reviewer: `gpt-6-astra/high`
- Experience reviewer: `gpt-6-astra/medium`
- Evidence explorer / default subagent: `gpt-5.6-terra/medium`

Configured migration targets, not an automatic winner selection. This suite validates boundary decisions and exact quotations, not production quality or cost equivalence.
