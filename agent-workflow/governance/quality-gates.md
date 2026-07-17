# Current Quality Gates

Status: current
Updated: 2026-07-17

This governance note lists active SITE-V4.1 public checks and the remaining V3 internal compatibility checks. Retired V1/V2 outputs and retired V3 page CSS/JS are not active release gates.

## General Completion Rule

Before closing a task, report:

- changed files;
- checks run;
- checks not run and why;
- whether the change affects automation, data, website, or publication;
- remaining risk or required user confirmation.

For daily monitor, Raw / Pool / Card, page, copy, or typography work, state whether `context/06-execution-harness.md` was relevant.

## Current Common Checks

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
node agent-workflow/tools/run-quality-gates.mjs automation
node agent-workflow/tools/run-quality-gates.mjs business --date=YYYY-MM-DD
node agent-workflow/tools/run-quality-gates.mjs regression --date=YYYY-MM-DD
node --check 01-SiteV2/site/assets/data-center-v4.js
node --check 01-SiteV2/site/assets/v4-report-shell.js
```

## Daily Monitor Checks

Daily monitoring is a high-risk production flow. Read `context/06-execution-harness.md` when changing the execution path, then validate the narrowest relevant stage.

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node agent-workflow/tools/assert-business-signals-pipeline-policy.mjs
node agent-workflow/tools/assert-daily-production-chain.mjs --date=YYYY-MM-DD --stage=post-monitor
```

## Business Signals Release Rule

Raw channel diagnostics must not block release when the configured minimum Pool/routed/Core evidence supply is healthy. GDELT, keyword search, RSS, AI HOT, and quota-backed provider notes are peer source diagnostics, not priority lanes or standalone hard gates.

Production runs one monitor attempt and at most one targeted refill for a failed hard evidence-supply bucket. Do not rerun the full monitor chain to satisfy a Raw-only diagnostic. Repair the failing evidence, Card, frontstage, or publication stage and rerun only its validation.

## Publication Checks

Publication path is automation branch -> PR -> `main` -> GitHub Pages. Netlify and retired V2 homepage routes are not current deployment or fallback services.
