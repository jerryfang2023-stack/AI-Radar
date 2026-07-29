# WaveSight AI Current Entry

This file is the default routing entry. It is a router, not a full wiki.

Do not scan all Markdown at task start. Read only this file, the required `context/` files, and directly relevant task files.

## Current Version

- Current stage: SITE-V4.3.0 compatibility write disabled; the unified V4 shell, stable entities, factual timelines, and evidence-backed relations remain first-class data services. V3 Card/desk/graph assets are read-only history under `archive/v3-compat/` and have no active consumers.
- Current frontstage: `01-SiteV2/site/data-center.html`, `01-SiteV2/site/intelligence-map.html`, `01-SiteV2/site/opportunity-map.html`, and the V4 report detail pages.
- Current dashboard: `01-SiteV2/site/operations-console.html`.
- Current Business Signals column version: BSIG-V2.2.0-pipeline-stage-ownership.
- Current First-Line Viewpoints column version: FLV-V1.1.0-history-backfill.
- Current Community Intelligence column version: CINT-V1.0.2-publication-waiting-gate.
- Current Enterprise AI / FDE data version: FDE-V2.0.
- Current AI Hardware data version: HARDWARE-V1.0.
- Current Reports Center column version: REPORTS-V1.1.0-lane-independent.
- Current Opportunity Map column version: OMAP-V2.0.0-v4-evidence.
- Current Trend Radar column version: TRADAR-V1.0.0-factual-change-explorer.
- Current Raw contract: RAW-V3.0.
- Current canonical event contract: EVENT-V1.1.
- Current entity history contract: ENTITY-V1.0.
- Current person-account review contract: PERSON-REVIEW-V1.0.
- Current factual relationship contract: RELATION-V2.1.
- Current targeted historical collection contract: BACKFILL-V1.0.
- Current tag taxonomy version: TAG-V4.0.
- Current data-center rule source: `context/12-data-center-v4.md`.
- `context/07-v3-intelligence-generation-rules.md` documents frozen V3 history only; it is not a production route.
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
| Industry Reports / 行业报告 | `01-SiteV2/site/intelligence-map.html` | monthly / weekly reports and report archives |
| Opportunity Map / 机会地图 | `01-SiteV2/site/opportunity-map.html` | source-backed Entry Point Map, Product Pain Map, and human-reviewed Direction Cards with evidence modals |
| Trend Radar / 变化雷达 | `01-SiteV2/site/trend-radar.html` | evidence-backed daily, weekly, and monthly factual change explorer |
| Weekly AI Business Change Radar / 周报 | `01-SiteV2/site/weekly-ai-business-change-radar.html` | weekly report detail page, entered from Intelligence Map |
| First-Line Viewpoints / 一线观点 | `01-SiteV2/site/data-center.html?view=viewpoints` | independent builders viewpoints |
| Community Intelligence / 社群情报 | `01-SiteV2/site/data-center.html?view=community` | community-sourced cases, tool tactics, opportunities, and document links |
| Dashboard / 仪表盘 | `01-SiteV2/site/operations-console.html` | operations backend |

All public pages and report details use the V4 logo header and shared Data Center / Application Center sidebar.

## Retired Routes

`v3-data-observation.html`, `follow-builders.html`, `community-intelligence.html`, `reports.html`, and `pipeline-dashboard.html` are compatibility redirects only and must not regain page content or the V3 topbar.

Follow-builders / builders viewpoints are active only as the independent First-Line Viewpoints column. They must not be used as business-signal facts, relationship-graph evidence, or trend-candidate evidence.

If an old page rule conflicts with SITE-V4.3.0, delete or rebuild it instead of preserving V3 public compatibility.

## Current Context

| Document | Use |
|---|---|
| `context/project-memory.md` | stable project memory and non-negotiable long-term rules |
| `context/00-current-state.md` | current project state |
| `context/version-ledger.md` | version baseline and freeze points |
| `context/frontstage-page-contracts.md` | frontstage page contracts |
| `context/01-product-map.md` | SITE-V4.3 product structure and data flow |
| `context/02-vi-style.md` | VI, typography, visual rules |
| `context/04-qc-rules.md` | general quality gates |
| `context/05-daily-monitoring.md` | retired V3 monitoring archive notice |
| `context/06-execution-harness.md` | high-risk execution harness |
| `context/07-v3-intelligence-generation-rules.md` | retired V3 archive notice |
| `context/08-v3-3-automation.md` | SITE-V4.3 GitHub / site / Obsidian sync automation loop |
| `context/09-v3-3-current-action-index.md` | current V4 action registry |
| `context/10-v3-3-experience-automation.md` | action logging and retrospective automation |
| `context/11-hermes-daily-supervision-instructions.md` | Hermes control-plane liveness watchdog |
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
- The V4 sidebar and Data Center / Application Center page plan are the only current public page contract.
- Targeted company, product, funding, and deployment backfill is an operational discovery queue. Search results remain leads until original-source capture, exact-span Claim extraction, and the responsible V4 gate pass.

### Historical V3 Archive Tools

Read:

1. `context/07-v3-intelligence-generation-rules.md`
2. `context/05-daily-monitoring.md`
3. `context/06-execution-harness.md`
4. relevant script or data file

Archive rules:

- Do not create new Raw candidate Markdown, Pool candidate Markdown, Signal Cards, V3 desk JSON, graph JSON, or legacy mappings.
- Historical V3 assets are read-only under `archive/v3-compat/`.
- Current production uses immutable original snapshots plus `SOURCE-INTAKE-V1`.
- Explicit historical tools must use archive paths and cannot be discovered by production.

### Relationship Graph / Historical Trend Candidate Audit

Read:

1. `context/07-v3-intelligence-generation-rules.md`
2. archived Card files under `archive/v3-compat/`
3. related trend script only when the user explicitly requests a historical/manual trend review

Rules:

- Archived relationship graphs use historical Card nodes and must never be promoted into RELATION-V2.1.
- Trend candidates and explicit no-decision shells are historical/manual research artifacts, not daily production outputs or publication gates.
- A single article, opinion, or funding event cannot form a trend.
- Builders viewpoints must not be used as evidence.

### Enterprise AI / FDE Lens

Read:

1. `agent-workflow/skills/guanlan-enterprise-ai-fde-monitor/SKILL.md`
2. `context/07-v3-intelligence-generation-rules.md`
3. `context/05-daily-monitoring.md`
4. current V4 FDE generator and integrity gate
5. `agent-workflow/tools/sync-enterprise-ai-fde-to-obsidian.mjs`

Rules:

- FDE is an independent V4 implementation projection.
- Every public FDE item must include source-bounded demand / service / result analysis.
- FDE follows the V4 evidence boundary: English title translation and source-backed fact extraction resolve through SourceArtifact, RawDocument, accepted Claims, and the FDE projection.
- Missing FDE title/fact fields are repaired in V4 intake/extraction/projection, not through archived Cards.
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
3. open production incidents with `npm run inbox:incidents -- --status=open --latest=false`
4. the linked `report_path` and failed gate or lane script

Rules:

- Treat production incident items as the active repair queue for repeated monitoring, publishing, and data-quality failures. Legacy Hermes inbox items remain readable history.
- Repair the smallest script, rule, gate, eval, memory, or data build path that caused the incident.
- Do not close a recurring issue by only editing same-day data.
- Do not mark a production incident resolved until validation and a prevention artifact are recorded.
- Close resolved items with `npm run resolve:incident -- --file=<inbox-file> --fix-commit=<commit-or-pending> --validation=<check> --prevention=<gate|eval|memory|context|not-needed>`.

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
