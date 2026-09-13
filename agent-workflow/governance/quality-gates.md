# Current Quality Gates

Status: current
Updated: 2026-09-13

Resolve the current release from [the version ledger](../../context/version-ledger.md). V3 compatibility writers, consumers, assets, and gates are absent. Module-specific applicability is indexed in [Guanlan Harness](../harness/README.md).

## General Completion Rule

Before closing a task, report:

- changed files;
- checks run;
- checks not run and why;
- whether the change affects automation, data, website, or publication;
- remaining risk or required user confirmation.

For source intake, V4 facts, application projections, page, copy, or typography work, state whether `context/06-execution-harness.md` was relevant.

## Current Common Checks

Select checks for the changed behavior. `run-quality-gates` can write reports
and invoke build stages; these commands are not a read-only inventory API.
For reference integrity alone use `npm run assert:harness`.

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

## V4 Source-Intake Release Rule

Source-channel diagnostics must not block release when the configured minimum structured evidence supply is healthy. GDELT, keyword search, RSS, AI HOT, and quota-backed provider notes are peer source diagnostics, not priority lanes or standalone hard gates.

Production runs one monitor attempt and at most one targeted refill for a failed hard evidence-supply bucket. Do not rerun the full monitor chain to satisfy a volume-only diagnostic. Repair the failing source-intake, Claim/Event, application, frontstage, or publication stage and rerun only its validation.

## Publication Checks

Accepted changes reach `main` through the authorized repository workflow.
GitHub Pages publishes the internal frontstage. Public financing additionally
requires the independent Funding Portal VPS release and live website/Mini Program
data-contract checks. OPS publishes only to the authenticated VPS route and
requires committed asset hashes, authentication and health checks. Vault is a
local downstream projection. Mini Program upload, review and client publication
are separate states. See [current automation ownership](../../context/08-automation.md)
and the affected service release contract. Netlify and retired V2 homepage routes
are not current deployment or fallback services.
