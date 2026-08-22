---
status: current
scope: site-v4-automation
last_updated: 2026-08-22
priority: current
---

# WaveSight V4 Automation Loop

## Daily production

`.github/workflows/daily-persistent-assets-pr.yml` owns the current commercial
event chain:

```text
independent source discovery
-> unified immutable snapshots + SOURCE-INTAKE-V1
-> V4 build / integrity / materialization
-> FDE and Hardware projections
-> Trend Radar / Funding Insights / Opportunity Map
-> COLLECTION-TELEMETRY-V1.0 / OPS synchronization
-> V4-only pre-commit readiness
-> PR / merge / Pages
```

`.github/workflows/daily-production-chain-dry-run.yml` tests the same ownership
without publishing.

Card generation, Pool-to-Card, Card editorial, V3 desk, old graph, compatibility
frontstage, legacy mapping, and their staging steps are disabled. Raw and Pool
candidate Markdown are no longer written. Immutable original snapshots remain.

## Lane independence

- First-Line Viewpoints (`O`) and Community Intelligence (`C`) keep independent
  collection, gate, and publication lanes.
- Commercial events (`E`) use accepted V4 Claims and sources only.
- Operations output (`OPS`) stays in telemetry/reports and cannot become public
  evidence.
- Report generation remains independent from Opportunity Map generation.
- FDE/Hardware sync depends on V4 integrity/materialization, never V3 gates.

## Recovery

Health dispatch reads the V4 manifest and `COLLECTION-TELEMETRY-V1.0`. An
accepted V4 batch must not trigger source recollection because an archived V3
asset is absent.

Daily supervision treats each published lane bundle, its quality gate, and its
manifest as one atomic evidence snapshot. When the primary worktree is behind
and supervision reads a same-date bundle from `origin/main`, it must read the
matching gate and manifest from that same published ref; mixing published data
with stale local gate files is forbidden because it can create a false repair.

## Local Windows schedule

The supported local schedule contains exactly seven tasks:

| Time | Task |
|---|---|
| 08:10 | WaveSight Morning Production Dispatch |
| 08:30 | WaveSight Community Intelligence Daily |
| 09:15 | WaveSight Daily Recovery Controller |
| 09:50 | WaveSight Daily Automation Closure |
| 10:20 | WaveSight Hermes Control Plane Watchdog |
| 16:10 | WaveSight Follow-Builders Skill Daily |
| 16:45 | WaveSight Daily Final Closure |

The Morning Production controller treats `agent-workflow/skills/` as the
authoritative Skill source. Before its Skill Ops preflight, it deterministically
synchronizes the derived `.agents/skills/` runtime from that source; direct
runtime edits are overwritten and must never become an alternative source of
truth.

The 10:20 task runs the watchdog and then publishes the sanitized heartbeat
even when the watchdog reports `manual_required`. Daily self-repair, Codex
self-repair handoff, the expired agent-review trial, the separate heartbeat
publisher, and the three local periodic duplicates must be absent. GitHub
Actions owns weekly and monthly schedules.

Controller, supervision, self-check, and Codex handoff reports from Windows tasks
are runtime state, not repository assets. The installer passes
`--runtime-dir=%LOCALAPPDATA%\WaveSight\runtime`; local task execution must not
dirty `agent-workflow/reports`. Closure runs the self-check once and hands that
same report to Codex. When repair is necessary, Codex receives a clean isolated
worktree based on `origin/main`, so unrelated local edits are preserved and never
treated as repair input.

The installer also resolves a runnable native `codex.exe` for scheduled repair.
An explicit `-CodexExecutable` wins; otherwise it reuses the managed installation
under `%LOCALAPPDATA%\WaveSight\codex-cli` or a runnable PATH command, and
bootstraps official `@openai/codex` into that managed directory when neither is
available. Scheduled tasks must not depend on a WindowsApps execution alias or a
shell-only shim. Re-run `npm run install:windows-automation` after repairing the
CLI so every controller receives the resolved executable path.

The 16:10 Follow-Builders task follows the same isolation boundary. Generation,
validation, PR publication, and forced lane supervision run from a temporary
worktree under `%LOCALAPPDATA%\WaveSight\runtime\worktrees`; the detailed local
publish report is copied into runtime before that worktree and its local branch
are removed. The primary `main` worktree is fast-forwarded only after publication
and only when it was already clean. The task must never generate its owned
viewpoint, frontstage, or report files in the primary worktree before the accepted
PR reaches `main`.

Final Closure also rebuilds and gates the local V4 JSONL/DuckDB serving layer.
This refresh is part of the existing task and must not be installed as a
separate scheduled task or Startup loop. It also refreshes the external Guanlan
Vault from an isolated `origin/main` worktree and records the source commit in
runtime, so unrelated primary-worktree edits neither enter nor block the Vault
projection. This isolated action owns only the Vault build, evidence-index sync,
and Vault assertion; private evidence backup keeps its separate fail-closed
contract and is not silently folded into the projection step.

Final Closure also owns the independent AI financing-site publication bridge.
It reads the accepted `funding-insights-v1.json` and every `status: published`
weekly/monthly report Markdown from WaveSight `origin/main`. The sibling
`Guanlan-Funding-Portal` repository dynamically generates financing data,
`reports.json`, and `report-bodies.json`; there is no hand-maintained report
list. Automatic publication is fail-closed on date regression, missing cards or
reports, incomplete report title/summary/body, unsupported Funding Insight
versions, a dirty or diverged portal worktree, a failed push, or a failed live
readback. Accepted changes are committed and pushed to portal `main`, deployed
as a new immutable VPS release, and switched through the `current` symlink; a
failed live check restores the previous release. This remains part of Final
Closure and must not become an eighth Windows task.

The native WeChat Mini Program consumes those same gated VPS contracts at
runtime and keeps its generated `miniprogram/data/` projection as an offline
fallback. Consequently, an accepted financing, weekly-report, or monthly-report
publication becomes visible in the Mini Program without a new client upload.
The client rejects invalid, duplicate, older-date, or older-version funding
payloads and continues serving the bundled fallback. `www.zkdlj.vip` must remain
configured as a WeChat request legal domain.

Before diagnosing a local private-evidence coverage gap, run the remote boundary
gate. It requires the configured private-evidence checkout and authenticated
remote HEAD to match, so a stale local clone is synchronized instead of being
misreported as missing source bodies. Targeted recovery may ingest only bodies
whose recomputed content hash matches the immutable RawDocument hash; it keeps
the intake unchanged, persists every exact match it can recover, and fails
closed on the remaining mismatches.

The retired sibling `AI热点` root must contain no files and must not remain
registered in Obsidian. A locked empty directory shell is tolerated until its
owning desktop process releases the handle; it is not treated as a second Vault.

Funding recovery is downstream-only when the same-date V4 batch already passes
the integrity gate. A retry must hydrate the configured private evidence store,
exclude the current output file from historical deduplication, cite the
canonical event source, and preserve canonical amount/date/round. Contract or
procurement values cannot become funding merely because the article body
mentions hardware financing. Newly discovered company/product entities remain
outside the public Entity Index until an accepted catalog-review decision
exists.

Funding publication must persist taxonomy decisions with
`classify:funding-taxonomy-v4.1 -- --write=true`. Both the Business Signals
workflow and the dedicated Funding Insights recovery workflow own the same
atomic publication set: funding cards, taxonomy decisions and reviewed event
classifications, institution/activity registry, Data Center monolith and split
service, Trend Radar, and Opportunity Map. Their release order is initial card
build, institution projection and Data Center build for translation discovery,
translation, taxonomy classification/projection, V4 table refresh, final funding
and institution gates, final Data Center/Trend/Opportunity builds, taxonomy
consistency, and the frontstage regression gate. The commit must stage the whole
set; changing that order or staging only the card file can leave public cards
with dangling investor links or stale taxonomy targets. Amount normalization must retain explicit `K`/`thousand` units and may
repair a source-backed truncated display such as `$800` only when the canonical
evidence proves the complete value (for example `$800,000`).

Data Center integrity rejects search, topic, and tag index pages as canonical
event sources. Release validation includes the current-date projection coverage
gate and the frontstage regression gate, so a successful collector/build command
alone is not publication evidence.

Scheduled Codex repair uses `--ask-for-approval never` as a global CLI option
before the `exec` subcommand. Keep that ordering covered by the Windows runtime
tests; placing the flag after `exec` makes the handoff fail before repair starts.

First-Line Viewpoints recovery is date-strict. The 09:15 controller may treat
the morning RSS lane as healthy only when `follow-builders-daily.json` was
generated on the requested Asia/Shanghai date; a prior-day
bundle must fail the gate and trigger the bounded recovery workflow.

Install or repair the complete local contract with
`npm run install:windows-automation`. Audit it without changing task state with
`npm run assert:windows-automation`.

## Archive and Pages

V3 payload archives and `compatibility_cards` are absent from the working tree.
Production cannot discover them; explicit historical recovery uses Git history
in an isolated temporary worktree.

Required policy gates:

```powershell
npm run assert:no-active-v3
npm run assert:pipeline-policy
npm run assert:compatibility-retirement
```
