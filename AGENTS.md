# Codex Working Principles

These rules apply to every task in this repository unless the user explicitly overrides them.

## 1. Think Before Coding

- Identify the user's real goal before editing.
- State important assumptions and trade-offs when the task is ambiguous or risky.
- Do not guess silently.
- Ask only when work is blocked by missing information.

## 2. Simplicity First

- Make the smallest change that solves the actual problem.
- Do not add speculative features, dependencies, or abstractions.
- Prefer existing project patterns.
- Remove complexity when it does not serve the current goal.

## 3. Surgical Changes

- Change only files needed for the current task.
- Do not do unrelated refactors.
- Do not revert user changes unless explicitly asked.
- Keep cleanup separate unless it directly blocks the task.

## 4. Goal-Driven Execution

For every non-trivial task:

1. understand the goal;
2. inspect relevant files;
3. make the smallest correct change;
4. run relevant validation;
5. fix failures caused by the change;
6. report what changed, what was tested, and what risk remains.

# WaveSight AI Current Entry

This file is the default routing entry. It is a router, not a full wiki.

Do not scan all Markdown at task start. Read only this file, the required `context/` files, and directly relevant task files.

## Current Version

- Current stage: SITE-V4.2.0 entity history; the SITE-V4.1 unified shell remains, while stable entities, factual timelines, and evidence-backed relations are first-class data services. V3 Card/trend data remains an internal compatibility and downstream-application input only.
- Current frontstage: `01-SiteV2/site/data-center.html`, `01-SiteV2/site/intelligence-map.html`, and their V4 report detail pages.
- Current dashboard: `01-SiteV2/site/operations-console.html`.
- Current Business Signals column version: BSIG-V2.2.0-pipeline-stage-ownership.
- Current First-Line Viewpoints column version: FLV-V1.1.0-history-backfill.
- Current Community Intelligence column version: CINT-V1.0.2-publication-waiting-gate.
- Current Enterprise AI / FDE data version: FDE-V2.0.
- Current AI Hardware data version: HARDWARE-V1.0.
- Current Industry Reports column version: IMAP-V2.1.0-v4-unified-frontstage.
- Current Raw contract: RAW-V3.0.
- Current canonical event contract: EVENT-V1.1.
- Current entity history contract: ENTITY-V1.0.
- Current factual relationship contract: RELATION-V2.0.
- Current targeted historical collection contract: BACKFILL-V1.0.
- Current tag taxonomy version: TAG-V4.0.
- Current data-center rule source: `context/12-data-center-v4.md`.
- `context/07-v3-intelligence-generation-rules.md` governs frozen V3 page compatibility only.
- V2 website pages and old four-column output rules are retired.

## Current Product Goal

SITE-V4.0 is an AI industry data center and structured factual data foundation for AIP products, industry research, and startup decision-support applications.

Daily core production must preserve source artifacts and build exact-span Claims, Entities, CanonicalEvents, FDE records, hardware records, evidence-backed TagAssertions, and queryable exports.

- product / service;
- funding;
- case / vertical deployment.

The core does not make decisions, judge value or opportunity, recommend actions, or educate readers. Card, trend, opportunity, and report objects are downstream or frozen-page compatibility outputs and cannot enter V4 canonical tables.

First-line viewpoints are a separate builders column. They are useful for reading public operator / builder viewpoints, but they are not business-signal facts.

## Current Frontstage Navigation

| Entry | File | Role |
|---|---|---|
| Commercial Events / 商业事件 | `01-SiteV2/site/data-center.html?view=events` | source-traceable canonical commercial events |
| Industry Reports / 行业报告 | `01-SiteV2/site/intelligence-map.html` | monthly / weekly reports and source-backed opportunity maps |
| Weekly AI Business Change Radar / 周报 | `01-SiteV2/site/weekly-ai-business-change-radar.html` | weekly report detail page, entered from Intelligence Map |
| First-Line Viewpoints / 一线观点 | `01-SiteV2/site/data-center.html?view=viewpoints` | independent builders viewpoints |
| Community Intelligence / 社群情报 | `01-SiteV2/site/data-center.html?view=community` | community-sourced cases, tool tactics, opportunities, and document links |
| Dashboard / 仪表盘 | `01-SiteV2/site/operations-console.html` | operations backend |

All public pages and report details use the V4 logo header and shared Data Center / Application Center sidebar.

## Retired Routes

`v3-data-observation.html`, `follow-builders.html`, `community-intelligence.html`, and `reports.html` are compatibility redirects only and must not regain page content or the V3 topbar.

Follow-builders / builders viewpoints are active only as the independent First-Line Viewpoints column. They must not be used as business-signal facts, relationship-graph evidence, or trend-candidate evidence.

If an old page rule conflicts with SITE-V4.2.0, delete or rebuild it instead of preserving V3 public compatibility.

## Current Context

| Document | Use |
|---|---|
| `context/project-memory.md` | stable project memory and non-negotiable long-term rules |
| `context/00-current-state.md` | current project state |
| `context/version-ledger.md` | version baseline and freeze points |
| `context/frontstage-page-contracts.md` | frontstage page contracts |
| `context/01-product-map.md` | SITE-V4.2 product structure and data flow |
| `context/02-vi-style.md` | VI, typography, visual rules |
| `context/04-qc-rules.md` | general quality gates |
| `context/05-daily-monitoring.md` | V3 Raw / Pool monitoring context |
| `context/06-execution-harness.md` | high-risk execution harness |
| `context/07-v3-intelligence-generation-rules.md` | Raw / Pool / Card / relation / trend-candidate truth source |
| `context/08-v3-3-automation.md` | SITE-V4.1 GitHub / site / Obsidian sync automation loop |
| `context/09-v3-3-current-action-index.md` | current V4 and compatibility action registry |
| `context/10-v3-3-experience-automation.md` | action logging and retrospective automation |
| `context/11-hermes-daily-supervision-instructions.md` | Hermes daily supervision and Codex repair handoff |
| `context/12-data-center-v4.md` | SITE-V4.0 factual data contract, boundaries, and daily execution |
| `context/context-index.md` | context router |

## Current Task Routes

### Data Center V4

Read:

1. `context/12-data-center-v4.md`
2. `agent-workflow/product/data-center-v4-contract.md`
3. `agent-workflow/product/data-center-v4.schema.json`
4. relevant generator, projection, gate, or data bundle

Rules:

- Every Claim quotes an exact RawDocument span.
- Every formal event resolves to Claim and SourceArtifact references.
- FDE, hardware, and tags are projections/assertions from accepted evidence only.
- Missing and conflicting fields remain explicit.
- Importance, value, opportunity, trend maturity, recommendation, advice, `why_watch`, and `business_meaning` are forbidden in V4 canonical outputs.
- The V4 sidebar and Data Center / Industry Reports page plan are the only current public page contract.
- Targeted company, product, funding, and deployment backfill is an operational discovery queue. Search results remain leads until original-source capture, exact-span Claim extraction, and the responsible V4 gate pass.

### Raw / Pool / Card Generation

Read:

1. `context/07-v3-intelligence-generation-rules.md`
2. `context/05-daily-monitoring.md`
3. `context/06-execution-harness.md`
4. relevant script or data file

Compatibility rules:

- Raw only collects external materials.
- Pool screens evidence.
- Card types are only `product_service`, `funding`, and `case`.
- Card details must come from original source text, not old summaries or backend fields.
- Missing frontstage fields must not fallback to backend fields.

### Relationship Graph / Trend Candidate

Read:

1. `context/07-v3-intelligence-generation-rules.md`
2. current Card files
3. related relation / trend script

Rules:

- Relationship graph uses Card nodes and source-backed edges.
- Trend candidate is an internal candidate object, not a long-form publication route.
- A single article, opinion, or funding event cannot form a trend.
- Builders viewpoints must not be used as evidence.

### Enterprise AI / FDE Lens

Read:

1. `agent-workflow/skills/guanlan-enterprise-ai-fde-monitor/SKILL.md`
2. `context/07-v3-intelligence-generation-rules.md`
3. `context/05-daily-monitoring.md`
4. `01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs`
5. `agent-workflow/tools/sync-enterprise-ai-fde-to-obsidian.mjs`

Rules:

- FDE is an independent implementation lens, not a fourth Business Signal Card type.
- Every public FDE item must include source-bounded demand / service / result analysis.
- FDE follows the Raw/Card ingestion boundary: English title translation and source-backed fact extraction are recorded in Raw, Signal Card, or FDE Lens Pool assets before frontstage rendering.
- Missing FDE title/fact fields are repaired in the Raw/Card/FDE asset generator, not by blocking an already generated formal Business Signal Card in the generic frontstage selector.
- If the source does not disclose implementation results, state that explicitly instead of inventing ROI or production outcome.
- FDE detail openability and `content/09-fde` sync are owned by the FDE skill, not by generic Business Signals Card repair.

### UI / Page Work

Read:

1. `context/00-current-state.md`
2. `context/02-vi-style.md`
3. `context/frontstage-page-contracts.md`
4. target page or script

Field discipline:

- Do not expose a frontstage page field unless it is necessary for user understanding or decision-making.
- Keep auxiliary, diagnostic, operational, routing, threshold, gate, and backend-only fields in the backend unless the user confirms that the field has high commercial value for the frontstage.
- Before adding a new visible field, first consider whether the same content can be presented by merging, renaming, tightening, or improving an existing field.
- A new visible field should have clear commercial judgment value, source-backed content, and a distinct role that existing fields cannot cover.

### Hermes Inbox / Repair Work

Read:

1. `context/11-hermes-daily-supervision-instructions.md`
2. `context/10-v3-3-experience-automation.md`
3. open Hermes inbox items with `npm run inbox:hermes -- --status=open --latest=false`
4. the linked `report_path` and failed gate or lane script

Rules:

- Treat Hermes inbox items as the active repair queue for repeated monitoring, publishing, and data-quality failures.
- Repair the smallest script, rule, gate, eval, memory, or data build path that caused the incident.
- Do not close a recurring issue by only editing same-day data.
- Do not mark a Hermes inbox item resolved until validation and a prevention artifact are recorded.
- Close resolved items with `npm run resolve:hermes -- --file=<inbox-file> --fix-commit=<commit-or-pending> --validation=<check> --prevention=<gate|eval|memory|context|not-needed>`.

## Conflict Order

1. Current user instruction.
2. Current `context/` file.
3. Current task-specific skill.
4. Current code and data.
5. Historical reports and closeouts.

Historical reports prove what happened; they are not current execution truth.

## Delivery

After completing work, report:

- changed files;
- what changed;
- validation performed;
- remaining risk or follow-up.
