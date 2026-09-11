# GPT-6 Astra Skill Execution Contract

Contract: `GPT-6-ASTRA-SKILL-V1.0`. Checked 2026-09-11 against [OpenAI Docs](https://developers.openai.com/api/docs/guides/latest-model).

## Execution

1. Name the user goal, inputs, evidence, output and observable completion. Resolve current versions through `AGENTS.md` and the owning context; do not pin a moving project version inside role prompts.
2. For an authorized change, inspect, edit, validate and finish the requested result. Resolve routine gaps from context. Ask only when missing information materially changes scope, authority or the result; continue independent work while it is unresolved. A planning-only request remains read-only.
3. Respect instruction priority: user instructions override Skill guidance. Consolidate action boundaries in the owning Skill. Existing authorization persists; do not ask for it again. If a real boundary blocks work, identify the exact instruction and the remaining dependency.
4. Keep deterministic computation in scripts: manifest coverage, schema shape, deduplication, source paths, exact quotations and result aggregation. Keep semantic support, contradiction resolution and release decisions explicit; a matching quote is not proof that a conclusion follows.
5. Reuse accepted upstream artifacts. Resume at the first failed stage and its dependents; do not restart successful collection because a downstream step failed.
6. Validate the changed behavior with proportional tests and inspect the resulting artifact. Stop repeating successful checks unless new changes or evidence justify them. Distinguish static contract checks, model-run results and production acceptance.
7. Keep Chinese output concise and source-bounded. Preserve unknowns and contradictions. Use parallel agents only for independently useful work within the authorized task, with final semantic judgment retained by the owner.

## Evaluation and cleanup

- Every active governed Skill has direct, indirect, incomplete, negative and edge trigger cases; routing cases cover the live registry rather than a hard-coded count.
- Reject missing, duplicate, unknown and malformed model results. Require source-bounded exact quotations. Timeouts, parsing failures and incorrect decisions fail evaluation.
- Regressions become executable tests or concrete eval cases before more prompt prose.
- Remove outdated version pins, contradictory sync instructions and obsolete examples when their replacement is validated. Preserve original evidence, historical baselines and intentionally independent provider roles.
- Sync the repo runtime after edits. Sync personal compatibility stores only when that destination is in scope. Report remaining mirror drift without treating it as deployment authorization.

## API ownership

Ordinary domain Skills do not carry model IDs, reasoning settings, cache parameters or endpoint schemas. Codex configuration owns execution-model selection. API compatibility changes belong to the specific provider adapter when that adapter is in scope. A GPT migration does not by itself replace DeepSeek translation/report contracts or change the V4 factual schema.
