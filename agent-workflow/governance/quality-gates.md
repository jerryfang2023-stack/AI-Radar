# Current Quality Gates

Status: current
Updated: 2026-07-02

This governance note lists active SITE-V3.4.0 checks only. Retired V1/V2 daily observation, business brief, publiccopy, cardcopy, writer-style, V2 typography, V2 raw evidence, and V2 source gates are not active release gates.

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
node --check 01-SiteV2/site/assets/v3-data-observation-desk.js
```

## Daily Monitor Checks

Daily monitoring is a high-risk production flow. Read `context/06-execution-harness.md` when changing the execution path, then validate the narrowest relevant stage.

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node --check agent-workflow/tools/assert-guanlan-automation-readiness.mjs
node agent-workflow/tools/assert-guanlan-automation-readiness.mjs --command=assets --date=YYYY-MM-DD
```

## Business Signals Release Rule

Raw channel diagnostics must not block release when Pool, routed Pool, Core Pool, non-large Core Pool, and Top10/Card supply are healthy. GDELT, keyword search, RSS, AI HOT, and quota-backed provider notes are peer source diagnostics, not priority lanes.

Do not rerun the full monitor chain to satisfy a Raw-only diagnostic. Repair the failing stage and publish after the smallest relevant validation passes.

## Publication Checks

Publication path is automation branch -> PR -> `main` -> GitHub Pages. Netlify and retired V2 homepage routes are not current deployment or fallback services.
