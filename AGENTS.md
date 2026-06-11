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

- Current stage: V3.3.5 builder Obsidian date timelines.
- Current frontstage: `01-SiteV2/site/v3-data-observation.html`, `01-SiteV2/site/intelligence-map.html`, `01-SiteV2/site/follow-builders.html`, and `01-SiteV2/site/community-intelligence.html`.
- Current dashboard: `01-SiteV2/site/operations-console.html`.
- Current core rule source: `context/07-v3-intelligence-generation-rules.md`.
- V2 website pages and old four-column output rules are retired.

## Current Product Goal

V3.3 is an AI business intelligence asset system.

Daily production should preserve and display the 10 most important AI business signals across:

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
| Intelligence Map / 情报地图 | `01-SiteV2/site/intelligence-map.html` | relationship graph and intelligence map |
| First-Line Viewpoints / 一线观点 | `01-SiteV2/site/follow-builders.html` | independent builders viewpoints |
| Community Intelligence / 社群情报 | `01-SiteV2/site/community-intelligence.html` | community-sourced cases, tool tactics, opportunities, and document links |
| Dashboard / 仪表盘 | `01-SiteV2/site/operations-console.html` | operations backend |

Business Signals, Intelligence Map, First-Line Viewpoints, and Community Intelligence must share the same topbar structure and height.

## Stopped Outputs

The following are not current V3.3 required outputs and must not be used as execution sources:

- daily observation;
- business brief;
- trend report;
- publiccopy / cardcopy gates;
- Guanlan copy-style gate.

Follow-builders / builders viewpoints are active only as the independent First-Line Viewpoints column. They must not be used as business-signal facts, relationship-graph evidence, or trend-candidate evidence.

If an old rule conflicts with V3.3, delete or rebuild it instead of preserving compatibility.

## Current Context

| Document | Use |
|---|---|
| `context/00-current-state.md` | current project state |
| `context/version-ledger.md` | version baseline and freeze points |
| `context/frontstage-page-contracts.md` | frontstage page contracts |
| `context/01-product-map.md` | V3.3 product structure and data flow |
| `context/02-vi-style.md` | VI, typography, visual rules |
| `context/04-qc-rules.md` | general quality gates |
| `context/05-daily-monitoring.md` | V3 Raw / Pool monitoring context |
| `context/06-execution-harness.md` | high-risk execution harness |
| `context/07-v3-intelligence-generation-rules.md` | Raw / Pool / Card / relation / trend-candidate truth source |
| `context/08-v3-3-automation.md` | V3.3 GitHub / site / Obsidian sync automation loop |
| `context/09-v3-3-current-action-index.md` | V3.3.5 current action registry |
| `context/10-v3-3-experience-automation.md` | action logging and retrospective automation |
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
- Trend candidate is not trend report.
- A single article, opinion, or funding event cannot form a trend.
- Builders viewpoints must not be used as evidence.

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
