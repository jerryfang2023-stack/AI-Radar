# WaveSight / 观澜 AI System Audit — 2026-08-01

## Outcome

The recurring daily-monitoring failure was not one defect. It was a chain of four conditions: a now-fixed month-boundary private-evidence fixture broke the cloud V4 gate; 09:50 Closure treated an active same-date run as missing data; Closure executed the self-check twice; and local runtime reports dirtied the checkout, preventing Codex repair. Current `origin/main` already contains the evidence-fixture repair. This audit removes the three remaining recurrence paths and adds regression gates.

## Daily automation

- Keep exactly seven Windows tasks at 08:10, 08:30, 09:15, 09:50, 10:20, 16:10, and 16:45.
- Write controller, supervision, self-check, watchdog, community log, and Codex handoff state to `%LOCALAPPDATA%\WaveSight\runtime`.
- Run Closure self-check once and reuse its report for Codex handoff.
- Treat an active same-date cloud run as `waiting`; projection absence is not a failed closure until production is no longer active.
- Create Codex repairs in a clean isolated worktree based on `origin/main`; never relax dirty-worktree protection in a developer checkout.
- Preserve lane independence. Community collection still depends on the logged-in local Chrome session and remains the one expected manual environmental dependency.

## Skill audit

All 23 governed skills were checked for trigger scope, current contract alignment, ownership overlap, eval/example coverage, mirror consistency, and semantic prompt debt.

- `follow-builders`: replaced a 520-line generic OpenClaw/Telegram/email/cron onboarding prompt with a repository-specific First-Line Viewpoints procedure. Scheduling and delivery remain owned by WaveSight scripts.
- `guanlan-source-ingestion`: moved active responsibility and eval wording from the retired raw label to the current `RAW-V4.0` / RawDocument contract.
- `guanlan-event-normalizer`: moved upstream wording to current RawDocument records.
- `guanlan-code-rule-auditor`: removed the claim that a pre-V4 raw label is current authority.
- `guanlan-skill-editor`: current V4 and automation context now precede retired-history context.
- The other 18 skills were semantically aligned and retained without speculative rewrites.

Skill Store is now `v1.9.0`. The gate additionally rejects stale raw contracts, Unicode replacement characters, and generic Follow Builders scheduler onboarding. Prompt length remains a review signal rather than an arbitrary blocking quota. These changes follow OpenAI's GPT-5.6 prompting guidance: state rules once, keep success and autonomy boundaries explicit, reduce over-prescription, and encode recurring failures in evals. Source: [OpenAI latest model guide](https://developers.openai.com/api/docs/guides/latest-model).

## Tags and facets

- Contract remains `TAG-V4.0`: 24 technical tags, five structured facets, and 44 facet values.
- Matching is accepted-Claim-only and now evaluates includes/excludes within the same evidence sentence. An unrelated exclusion sentence can no longer suppress valid evidence.
- Historical reprojection covered 71 batches, 6,104 Claims, 1,871 event rows, and 1,772 unique CanonicalEvent IDs. It produced 1,287 technical-tag assertions and 1,399 facet assertions. One pre-existing `product_form=model` assertion was removed because the model mention appeared in a different sentence from the partnership object; retrieval-query metadata was also regression-tested so it cannot create facet evidence.
- Unique-event coverage is 34.8% for technical tags, 37.7% for facets, and 56.3% for either classification. Coverage is descriptive and is not an admission, ranking, default-tag, or release quota.
- `memory_system` and four facet values remain unused in this corpus. They are review candidates, not automatic deletion findings; absence of observations is not proof that a valid controlled definition is obsolete.

## Workspace and release

- Audit work ran in `agent/guanlan-system-audit-20260801` from current `origin/main`.
- Existing dirty work was not reset, stashed, overwritten, or folded into this change.
- Repository runtime reports are separated from durable audit and production artifacts.
- Required release checks: complete V4/data-lake/frontstage tests, Skill Ops, Windows task assertion after installation, GitHub PR checks, Pages deployment, and live verification.
