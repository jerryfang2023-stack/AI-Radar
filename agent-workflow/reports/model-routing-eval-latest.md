# Codex Model Routing Eval - Latest

Generated: 2026-07-26T02:16:30.843Z

Protocol: `agent-workflow/model-evals/model-routing-v1.md`

| Profile | Model | Effort | Status | Score | Decisions | Evidence | Duration |
|---|---|---|---|---:|---:|---:|---:|
| sol-high | gpt-5.6-sol | high | completed | 52/52 | 26/26 | 26/26 | 191.2s |
| sol-medium | gpt-5.6-sol | medium | completed | 51/52 | 25/26 | 26/26 | 103.3s |
| terra-medium | gpt-5.6-terra | medium | completed | 52/52 | 26/26 | 26/26 | 103.6s |

## Mismatches

- `sol-medium` / `business-signals`: expected `fail`, got `pass`; evidence exists: true.

## Routing Decision

- Primary agent: `gpt-5.6-sol/high`
- Quality reviewer: `gpt-5.6-sol/high`
- Experience reviewer: `gpt-5.6-sol/medium`
- Evidence explorer / default subagent: `gpt-5.6-terra/medium`

Role-aware defaults remain conservative; this routing suite alone cannot justify lowering the global primary agent.
