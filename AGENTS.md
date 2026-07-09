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

- Current stage: SITE-V3.4.5.
- Current frontstage: `01-SiteV2/site/v3-data-observation.html`, `01-SiteV2/site/intelligence-map.html`, `01-SiteV2/site/weekly-ai-business-change-radar.html`, `01-SiteV2/site/follow-builders.html`, and `01-SiteV2/site/community-intelligence.html`.
- Current dashboard: `01-SiteV2/site/operations-console.html`.
- Current Business Signals column version: BSIG-V2.1.4-raw-card-rule-cleanout.
- Current First-Line Viewpoints column version: FLV-V1.0.2-supervision-idempotency.
- Current Community Intelligence column version: CINT-V1.0.2-publication-waiting-gate.
- Current Enterprise AI / FDE lens version: EAI-V1.2.0-raw-card-ingestion-boundary.
- Current Reports Center / Intelligence Map column version: IMAP-V2.0.0-report-center-opportunity-system.
- Current Business Signals data contract: V3.3.6.3 business source artifact aggregation.
- Current tag taxonomy version: TAG-V1.1.0-v34-layered-taxonomy.
- Current core rule source: `context/07-v3-intelligence-generation-rules.md`.
- V2 website pages and old four-column output rules are retired.

## Current Product Goal

SITE-V3.4.5 is an AI business intelligence asset system.

Daily production should preserve and display all qualified Raw / Pool AI business signals that can become Cards across:

- product / service;
- funding;
- case / vertical deployment.

The system should then use those business-signal Cards to build:

- knowledge-base assets;
- relationship graph inputs;
- trend candidates.

First-line viewpoints are a separate builders column. They are useful for reading public operator / builder viewpoints, but they are not business-signal facts.

## Current Frontstage Navigation

| Entry | File | Role |
|---|---|---|
| Business Signals / 商业信号 | `01-SiteV2/site/v3-data-observation.html` | daily Cards, relationship graph, trend candidates |
| Reports Center / 报告中心 | `01-SiteV2/site/intelligence-map.html` | monthly / weekly reports, source-backed opportunity maps, and relation paths |
| Weekly AI Business Change Radar / 周报 | `01-SiteV2/site/weekly-ai-business-change-radar.html` | weekly report detail page, entered from Intelligence Map |
| First-Line Viewpoints / 一线观点 | `01-SiteV2/site/follow-builders.html` | independent builders viewpoints |
| Community Intelligence / 社群情报 | `01-SiteV2/site/community-intelligence.html` | community-sourced cases, tool tactics, opportunities, and document links |
| Dashboard / 仪表盘 | `01-SiteV2/site/operations-console.html` | operations backend |

Business Signals, Reports Center, First-Line Viewpoints, and Community Intelligence must share the same topbar structure and height.

## Retired Routes

Legacy content-output routes, legacy publication templates, and legacy copy gates are not current SITE-V3.4.5 required outputs and must not be used as execution sources.

Follow-builders / builders viewpoints are active only as the independent First-Line Viewpoints column. They must not be used as business-signal facts, relationship-graph evidence, or trend-candidate evidence.

If an old rule conflicts with SITE-V3.4.5, delete or rebuild it instead of preserving compatibility.

## Current Context

| Document | Use |
|---|---|
| `context/project-memory.md` | stable project memory and non-negotiable long-term rules |
| `context/00-current-state.md` | current project state |
| `context/version-ledger.md` | version baseline and freeze points |
| `context/frontstage-page-contracts.md` | frontstage page contracts |
| `context/01-product-map.md` | SITE-V3.4.5 product structure and data flow |
| `context/02-vi-style.md` | VI, typography, visual rules |
| `context/04-qc-rules.md` | general quality gates |
| `context/05-daily-monitoring.md` | V3 Raw / Pool monitoring context |
| `context/06-execution-harness.md` | high-risk execution harness |
| `context/07-v3-intelligence-generation-rules.md` | Raw / Pool / Card / relation / trend-candidate truth source |
| `context/08-v3-3-automation.md` | SITE-V3.4.5 GitHub / site / Obsidian sync automation loop |
| `context/09-v3-3-current-action-index.md` | SITE-V3.4.5 current action registry |
| `context/10-v3-3-experience-automation.md` | action logging and retrospective automation |
| `context/11-hermes-daily-supervision-instructions.md` | Hermes daily supervision and Codex repair handoff |
| `context/context-index.md` | context router |

## Current Task Routes

### Raw / Pool / Card Generation

Read:

1. `context/07-v3-intelligence-generation-rules.md`
2. `context/05-daily-monitoring.md`
3. `context/06-execution-harness.md`
4. relevant script or data file

Rules:

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
