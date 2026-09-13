---
status: current
scope: site-v4-automation
last_updated: 2026-09-13
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
`run-daily-automation-controller.mjs --phase=morning` dispatches
`.github/workflows/daily-persistent-assets-pr.yml` through its health router:

- Overseas/general commercial discovery includes dedicated funding sources,
  AI HOT, keyword search, GDELT and source RSS. Financing news is part of this intake.
- Its independent `china-funding` job dispatches `china-funding-pr.yml`, whose
  collector uses `--source-only=china-funding`. Domestic discovery runs alongside
  overseas discovery, with separate results; shared factual/application publication
  is serialized. A domestic failure does not invalidate overseas completion.
- Builder RSS uses `daily-first-line-viewpoints-pr.yml` as a separate viewpoints
  lane. This is distinct from source RSS used to discover financing/commercial news.

Each lane must be inspected separately. A controller exit code of zero or a
successful dispatch is not proof that domestic and overseas financing were both
collected, accepted or published. Reuse accepted same-date input; repair the earliest
failed downstream stage rather than blindly recollecting or duplicating active runs.
Historical domestic backfills remain explicit tasks, not automatic daily full-history scans.

For financing publication, require original-source evidence, event deduplication,
funding-card validation, accepted merge, and the production publication receipt.
16:45 Final Closure synchronizes accepted output to the independent Funding Portal,
Mini Program data contracts, protected OPS and local knowledge projection. Verify the
live date/data and application gates; collecting news alone is not publication completion.

## Lane independence

- First-Line Viewpoints (`O`) and Community Intelligence (`C`) keep independent
  collection, gate, and publication lanes.
- Commercial events (`E`) use accepted V4 Claims and sources only.
- Operations output (`OPS`) stays in telemetry/reports and cannot become public
  evidence.
- Report generation remains independent from Opportunity Map generation.
- FDE/Hardware sync depends on V4 integrity/materialization, never V3 gates.

Funding Insights additionally requires a disclosed round amount. A valuation-only
object, including a pre-money or post-money valuation, is not financing proceeds
and remains in the Data Center unless the event title separately discloses the
round amount. When a source card is withdrawn, write-mode taxonomy maintenance
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

## Local Windows schedule

The supported local schedule contains exactly four tasks (`WINDOWS-AUTOMATION-V1.1-four-task-manual-supervision`, effective 2026-09-13):

| Time | Task |
|---|---|
| 08:10 | WaveSight Morning Production Dispatch (domestic/overseas financing + other Business Signals + independent Builder RSS) |
| 08:30 | WaveSight Community Intelligence Daily |
| 16:10 | WaveSight Follow-Builders Skill Daily |
| 16:45 | WaveSight Daily Final Closure |

The operator checks production and repairs problems daily. The 09:15 Recovery,
09:50 Closure and 10:20 Hermes timers are retired. Their source tools and previous
receipts remain available for manual diagnosis. The paused Codex
`builder-observation-daily-sync` automation is removed.

Morning now owns the conditional First-Line Viewpoints RSS lane as well as
Business Signals. Accepted same-date RSS data and queued/running workflows prevent
duplicate dispatch. A successful workflow with missing accepted output records
`publication_repair_required`; the operator resumes the failed publication stage.
One production lane's failure does not suppress the other lane.

Late scheduled Morning runs remain eligible until 16:45, rather than being skipped
at the retired 09:15 recovery window. At 16:45 and later they record `superseded`
to avoid colliding with Final Closure; any remaining missing production needs an
explicit manual recovery. Manual invocations are not superseded.

The Morning Production controller treats `agent-workflow/skills/` as the
authoritative Skill source. Before its Skill Ops preflight, it deterministically
synchronizes the derived `.agents/skills/` runtime from that source; direct
runtime edits are overwritten and must never become an alternative source of
truth.

Hermes watchdog and heartbeat publication are manual tools only. No daily heartbeat
is expected; its absence is not a production failure. Optional manual morning
checks require only the Morning receipt and mark Recovery/Closure as not scheduled.
GitHub keeps the 10:30 commercial-production fallback, failure artifacts and the
weekly/monthly report schedules.

Controller, supervision, self-check, and Codex handoff reports from Windows tasks
are runtime state, not repository assets. The installer passes
`--runtime-dir=%LOCALAPPDATA%\WaveSight\runtime`; local task execution must not
dirty `agent-workflow/reports`. When explicitly invoked, manual Closure runs the self-check once and hands that
same report to Codex. When repair is necessary, Codex receives a clean isolated
worktree based on `origin/main`, so unrelated local edits are preserved and never
treated as repair input.

Every Windows automation entry also normalizes its process network environment
before invoking GitHub, Codex, collection, or publication commands. Loopback
hosts remain in `NO_PROXY`; when a configured loopback proxy is not listening,
that run removes only the unavailable proxy variables and continues in bounded
direct-fallback mode. The user or machine proxy configuration is never rewritten.
This prevents a stopped local proxy from turning every independent daily lane
into the same false infrastructure failure.

The daily controller must propagate its resolved runtime report directory to
every child health or gate command. Business Signals health dispatch,
First-Line Viewpoints recovery, Community Intelligence recovery, and Data Center
projection coverage therefore all receive `--reports-dir=<runtime>`. A child
command must honor that argument instead of defaulting to
`agent-workflow/reports`; the runtime regression test fails if this boundary is
removed.

Skill discovery refreshes invoked by the morning controller or Final Closure
write `local-skill-store-data.js` into the resolved runtime directory. The
checked-in dashboard remains a release artifact; controller-only usage counters
and timestamps must not dirty the primary worktree or block the final local
fast-forward.

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

The 16:10 Follow-Builders task follows the same isolation boundary. Generation,
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

## 国内融资独立链路（2026-09-12）

08:10 同次生产调度并行启动国内专项与海外监测；共享库发布串行。国内单独重试，复用私有原文检查点。16:45 Final Closure 同步融资门户、小程序和受保护 OPS 质量面板。详见 docs/china-funding-monitor.md。
