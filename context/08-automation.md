---
status: current
scope: site-v4-automation
last_updated: 2026-10-01
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

## Morning financing scope and acceptance

08:10 is the dispatch time, not the completion deadline. When production is needed,
`run-daily-automation-controller.mjs --phase=daily` resumes or dispatches
`.github/workflows/daily-persistent-assets-pr.yml` through its health router:

- Overseas/general commercial discovery includes dedicated funding sources,
  AI HOT, keyword search, GDELT and source RSS. Financing news is part of this intake.
- Its independent `china-funding` job dispatches `china-funding-pr.yml`, whose
  collector uses `--source-only=china-funding`. Domestic discovery runs alongside
  overseas discovery, with separate results; shared factual/application publication
  is serialized. A domestic failure does not invalidate overseas completion.
- First-Line Viewpoints / Builders does not run in the daily financing controller.
  Its independent weekly workflow is described under Lane independence.

Each lane must be inspected separately. A controller exit code of zero or a
successful dispatch is not proof that domestic and overseas financing were both
collected, accepted or published. Reuse accepted same-date input; repair the earliest
failed downstream stage rather than blindly recollecting or duplicating active runs.
Historical domestic backfills remain explicit tasks, not automatic daily full-history scans.

For financing publication, require original-source evidence, event deduplication,
funding-card validation, accepted merge, and the production publication receipt.
The same daily task immediately synchronizes accepted output to the independent Funding Portal,
Mini Program data contracts, protected OPS and local knowledge projection. Verify the
live date/data and application gates; collecting news alone is not publication completion.

## Lane independence

- First-Line Viewpoints / Builders (`O`) and Community Intelligence (`C`) each
  update once weekly in independent lanes; neither is dispatched or required by
  the daily financing controller.
- Commercial events (`E`) use accepted V4 Claims and sources only.
- Operations output (`OPS`) stays in telemetry/reports and cannot become public
  evidence.
- Report generation remains independent from Opportunity Map generation.
- FDE/Hardware sync depends on V4 integrity/materialization, never V3 gates.

Funding Insights uses the disclosed round amount or an explicitly evidenced undisclosed-amount status. A valuation, cumulative amount or tranche cap cannot substitute for round proceeds; unresolved amounts remain pending under the existing evidence gate. When a source card is withdrawn, write-mode taxonomy maintenance
must also prune its stale derived decision before rebuilding projections.

## Recovery

Health dispatch reads the V4 manifest and `COLLECTION-TELEMETRY-V1.0`. An
accepted V4 batch must not trigger source recollection because an archived V3
asset is absent.

Daily supervision treats each published lane bundle, its quality gate, and its
manifest as one atomic evidence snapshot. When the primary worktree is behind
and supervision reads a same-date bundle from `origin/main`, it must read the
matching gate and manifest from that same published ref; mixing published data
with stale local gate files is forbidden because it can create a false repair.

## Unified daily schedule

Effective 2026-10-01, Codex automation `ai` runs daily at 08:10 Asia/Shanghai.
It owns funding discovery, six consumer AI hardware categories in both markets,
secondary research, accepted publication and local closure. The GitHub 10:30
health-dispatch fallback reuses the same accepted input and active-run state.
See `docs/unified-daily-monitoring.md` for the executable entry and completion rules.

The only active Windows schedules are Community Intelligence Monday 08:30 and
Follow-Builders Monday 16:10. The separate Builders RSS GitHub workflow remains
Monday 09:00. Weekly results do not become daily financing prerequisites.

The old morning, recovery, closure, final-closure and Hermes daily timers are
retired. Their saved task definitions may remain disabled for rollback. The
Windows migration script disables them and never registers new daily triggers.
A legacy `--scheduled=true` phase records `retired_schedule` without dispatching.
Manual compatibility phases are available, but use the unified `daily` entry;
there is no 16:45 cutoff and no automatic Codex self-repair child process.

Stage receipts are private runtime state, keyed by date, accepted source and
executing code/configuration. Downstream failures do not recollect sources.
Closure creates an isolated accepted-main checkout; dirty local factual data
cannot enter the data lake, Vault, portal or protected OPS publication.

Every Windows automation entry also normalizes its process network environment
before invoking GitHub, Codex, collection, or publication commands. Loopback
hosts remain in `NO_PROXY`; when a configured loopback proxy is not listening,
that run removes only the unavailable proxy variables and continues in bounded
direct-fallback mode. The user or machine proxy configuration is never rewritten.
This prevents a stopped local proxy from turning every independent daily lane
into the same false infrastructure failure.

The controller propagates its runtime directory to child reports. Skill discovery
writes `local-skill-store-data.js` there; runtime counters do not dirty the release
artifact. Health/dispatch success is a running or waiting state, never proof of
financing-card or portal completion. Successful stages are resumed by receipt;
supervision and live verification must remain current.

Skill preflight, supervision, and safe self-check repair read the same runtime
dashboard via `--dashboard`. Manual self-check calls the direct dashboard
producer with `--output`, not the release npm wrapper that also rewrites the
tracked registry. Missing runtime snapshots may fall back to the published
snapshot for diagnosis; a repaired snapshot is validated and re-read in runtime.
Registry or source-contract defects remain explicit repair findings rather than
being hidden by a runtime refresh.

The four-task installer does not provision or update Codex CLI. For operator-approved
manual repair, provide a runnable native executable using `--codex-command=<path>`;
the existing managed CLI is under `%LOCALAPPDATA%\WaveSight\codex-cli`.
Do not use a WindowsApps execution alias or shell-only shim.

The Monday 16:10 Follow-Builders task follows the same isolation boundary. Generation,
validation, PR publication, and forced lane supervision run from a temporary
worktree under `%LOCALAPPDATA%\WaveSight\runtime\worktrees`; the detailed local
publish report is copied into runtime before that worktree and its local branch
are removed. The primary `main` worktree is fast-forwarded only after publication
and only when it was already clean. The task must never generate its owned
viewpoint, frontstage, or report files in the primary worktree before the accepted
PR reaches `main`.

The Community Intelligence publisher follows the same repository/runtime
boundary. Collection and quality reports are written under the resolved runtime
report directory; only the lane-owned daily content, manifest, and frontstage
outputs may be staged into its publication PR. A retry must not dirty the primary
worktree with gate or publish diagnostics.

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
Closure and must not become a fifth Windows task.

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

Commentary, response, rebuttal, and criticism headlines that discuss financing
without announcing a completed round are not funding events and cannot produce
Funding Insight cards. Protected-money validation treats hyphenated English
amounts such as `45-billion-dollar` as the same fact as their normalized numeric
form.

If a same-date Business Signals run has already accepted source collection but a
downstream gate fails, recovery restores the immutable workflow artifact and
skips both collection steps. Required source-title repair is date-bounded and
runs before the V4 integrity gate, then rebuilds the deterministic V4 outputs so
the repaired title reaches the gated publication set; approved cached
translations and equivalent
numeric expressions such as `double` / `翻倍` must pass the same protected-fact
validator. Opportunity Map gates compare the emitted direction-card count with
the artifact metadata. A day may validly emit an empty direction-card array when
no evidence cluster clears the quality threshold; the count must still match and
every emitted card must pass the complete evidence and validation-boundary gates.

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

Current-rule hygiene distinguishes governance vocabulary from faithful source
text. Retired route/schema terms remain forbidden in active rules, structured
keys, and exact structured enum values. Source titles, RawDocument text, Claims,
and the translation registry may preserve the same natural-language phrase when
it is part of the captured evidence; those source-derived values are still
checked for text corruption but must not be rewritten or block Pages merely
because they contain a retired Chinese column label.

Scheduled Codex repair uses `--ask-for-approval never` as a global CLI option
before the `exec` subcommand. Keep that ordering covered by the Windows runtime
tests; placing the flag after `exec` makes the handoff fail before repair starts.

Controller child output is streamed to per-command files under the external
runtime directory, with bounded tails in JSON reports. The controller handoff
budget must exceed the 30-minute Codex budget and report finalization. Reused
repair worktrees must be clean, on the expected branch, and fast-forwardable to
fresh `origin/main`; unique commits or dirty work are preserved, never reset.
Runtime self-check telemetry consumes the same runtime gate it repaired and
does not rewrite the tracked public snapshot. Recurring incident drafts also
stay under runtime until reviewed for the canonical incident registry.

Public entity coverage uses the same accepted, attributed catalog decisions
and merge resolution as the frontstage builder. Pending catalog review is a
counted warning, not automatic approval or a missing-publication error. Missing
approved entities, unresolved event/mention references and absent evidence
remain hard failures. `docs/daily-production-recovery.md` owns the recovery
procedure and the separate website/Mini Program completion checks.

First-Line Viewpoints supervision is weekly and date-strict on Mondays. The daily
funding controller never checks or dispatches Builders. Monday supervision may
treat the RSS lane as healthy only when `follow-builders-daily.json` was generated
for the weekly production date and its gate passes; a missing same-week bundle
must fail that weekly lane without blocking daily financing.

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

## 国内融资独立链路（2026-09-12）

08:10 同次生产调度并行启动国内专项与海外监测；共享库发布串行。国内单独重试，复用私有原文检查点。16:45 Final Closure 同步融资门户、小程序和受保护 OPS 质量面板。详见 docs/china-funding-monitor.md。
