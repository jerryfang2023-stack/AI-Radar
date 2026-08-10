# WaveSight AI Current Entry

This file is the default routing entry. It is a router, not a full wiki.

Do not scan all Markdown at task start. Read only this file, the required `context/` files, and directly relevant task files.

## Current Version

- Current release: WaveSight `V4.8.0-research-homepage`; the public shell is `SITE-V4.6.0-research-homepage`.
- Current Data Center Git baseline: `GUANLAN-DATA-CENTER-V4.8.1-internal-foundation`, tagged independently as `data-center-v4.8.1-internal-foundation`.
- Funding Insights remains independently versioned as `FUNDING-INSIGHT-V1.4.0-financing-fields`; Data Center tags must not be reused for the application website.
- Current local knowledge base: the physically independent Guanlan AI Vault (`GUANLAN-VAULT-V1.2-private-evidence-linked`). It is the local operations and human-readable knowledge front door; the repository-local `vault/` path is retired.
- Current local automation: exactly seven Windows tasks; Final Closure owns the strict 24-table `DATA-LAKE-V4.1` refresh, and Hermes watchdog/heartbeat is one control-plane cycle.
- Current evidence archive: `PRIVATE-EVIDENCE-STORE-V2.0` is the authoritative content-addressed original-body store outside the public repository and Vault. The public repository and Vault store locators and links, never complete original bodies.
- Current public product: Funding Insights is an independent application website backed by Data Center data. Data Center, Application Center, reports, and operations pages are internal supporting surfaces rather than public columns.
- Current dashboard: `01-SiteV2/site/operations-console.html`.
- Current Business Signals column version: BSIG-V2.2.0-pipeline-stage-ownership.
- Current First-Line Viewpoints column version: FLV-V1.1.0-history-backfill.
- Current Community Intelligence column version: CINT-V1.0.2-publication-waiting-gate.
- Current Enterprise AI / FDE data version: FDE-V2.0.
- Current Enterprise AI / FDE observation version: FDE-OBSERVATION-V1.0.
- Current AI Hardware data version: HARDWARE-V1.0.
- Current AI Hardware fact/snapshot versions: HARDWARE-FACT-V1.0 / HARDWARE-SNAPSHOT-V1.0.
- Current Guanlan Research column version: REPORTS-V1.2.0-research-hub.
- Current Opportunity Map column version: OMAP-V2.0.0-v4-evidence.
- Current Trend Radar column version: TRADAR-V1.1.0-tag-v4-1.
- Current Raw contract: RAW-V4.0. Full original bodies live only in the configured private evidence repository; public bundles retain `evidence://<content_hash>` locators and body-free metadata.
- Current structured source-intake contract: SOURCE-INTAKE-V1.1.
- Current canonical event contract: EVENT-V1.1.
- Current entity history contract: ENTITY-V1.0.
- Current person review contract: PERSON-REVIEW-V1.1.
- Current factual relationship contract: RELATION-V2.1.
- Current targeted historical collection contract: BACKFILL-V1.0.
- Current tag taxonomy version: TAG-V4.1.
- Current Skill Store version: `v2.0.1`; all 23 active governed Skills follow `GPT-5.6-SKILL-V1.0`, include `agents/openai.yaml`, and have five-case trigger-eval inventory coverage.
- Current data-center rule source: `context/12-data-center-v4.md`.
- `context/07-v3-intelligence-generation-rules.md` documents frozen V3 history only; it is not a production route.
- V2 website pages and old four-column output rules are retired.

## Current Product Goal

SITE-V4.0 is an AI industry data center and structured factual data foundation for AIP products, industry research, and startup decision-support applications.

Daily core production must preserve source artifacts and build exact-span Claims, Entities, CanonicalEvents, FDE records, hardware records, evidence-backed TagAssertions, and queryable exports.

- product / service;
- funding;
- case / vertical deployment.

The core does not make decisions, judge value or opportunity, recommend actions, or educate readers. Trend, opportunity, funding-insight, and report objects are downstream application outputs and cannot enter V4 canonical tables.

First-line viewpoints are a separate builders column. They are useful for reading public operator / builder viewpoints, but they are not business-signal facts.

## Current Product Surfaces

| Entry | File | Role |
|---|---|---|
| Funding Insights / 融资情报 | `01-SiteV2/site/funding-insights.html` | independent public application website backed by evidence-linked Data Center and investment-institution projections |
| Data Center / 数据中心 | `01-SiteV2/site/data-center.html` | internal factual-data serving and review surface |
| Application Center / 应用中心 | `trend-radar.html`, `intelligence-map.html`, report routes | internal downstream analysis and research surfaces |
| Dashboard / 仪表盘 | `01-SiteV2/site/operations-console.html` | internal operations backend |

The public website must not expose Data Center or Application Center as primary columns. Funding Insights owns its public navigation and may consume their governed data projections without exposing the internal information architecture.

## Retired Routes

`v3-data-observation.html`, `follow-builders.html`, `community-intelligence.html`, `reports.html`, and `pipeline-dashboard.html` are compatibility redirects only and must not regain page content or the V3 topbar.

Follow-builders / builders viewpoints are active only as the independent First-Line Viewpoints column. They must not be used as business-signal facts, relationship-graph evidence, or trend-candidate evidence.

If an old page rule conflicts with SITE-V4.4.0, delete or rebuild it instead of preserving V3 public compatibility.

## Current Context

| Document | Use |
|---|---|
| `context/project-memory.md` | stable project memory and non-negotiable long-term rules |
| `context/00-current-state.md` | current project state |
| `context/version-ledger.md` | version baseline and freeze points |
| `context/frontstage-page-contracts.md` | frontstage page contracts |
| `context/01-product-map.md` | SITE-V4.4 product structure and data flow |
| `context/02-vi-style.md` | VI, typography, visual rules |
| `context/04-qc-rules.md` | general quality gates |
| `context/05-daily-monitoring.md` | retired V3 monitoring archive notice |
| `context/06-execution-harness.md` | high-risk execution harness |
| `context/07-v3-intelligence-generation-rules.md` | retired V3 archive notice |
| `context/08-automation.md` | SITE-V4.4 GitHub / site / Guanlan Vault sync automation loop |
| `context/09-current-action-index.md` | current V4 action registry |
| `context/10-experience-automation.md` | action logging and retrospective automation |
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
- Data Center and Application Center remain internal data/research surfaces; independent public applications must not expose their raw column navigation.
- Targeted company, product, funding, and deployment backfill is an operational discovery queue. Search results remain leads until original-source capture, exact-span Claim extraction, and the responsible V4 gate pass.
- Same-date accepted collection is immutable reusable input: when source collection and the monitor quality gate have succeeded, any downstream retry must restore that artifact and must not recollect.
- Recollection is allowed only when the accepted artifact is missing or expired, the monitor quality gate did not pass, or the user explicitly requests recollection. The workflow/report must record the applicable reason.
- **Stepwise recovery is mandatory:** never restart the complete collection-and-production pipeline merely because a downstream stage failed. Restore the latest accepted intake/raw artifact, identify the first failed stage, repair or rerun only that stage and its dependent stages, and preserve successful upstream outputs. Each retry must state the reused artifact/run and the stage being resumed; a full recollection requires an explicit, recorded exception under the rule above.

### Historical V3 Recovery

Read:

1. `context/07-v3-intelligence-generation-rules.md`
2. `context/05-daily-monitoring.md`
3. `context/06-execution-harness.md`
4. the explicit historical Git commit or tag requested by the user

Archive rules:

- Do not create new Raw candidate Markdown, Pool candidate Markdown, Signal Cards, V3 desk JSON, graph JSON, or legacy mappings.
- Historical V3 payloads are not present in the working tree. Recovery must use an explicit Git ref in an isolated temporary worktree.
- Current production uses immutable original snapshots plus `SOURCE-INTAKE-V1`.
- Historical recovery must never restore files into current production paths or make them discoverable by automation.

### Relationship Graph / Historical Trend Candidate Audit

Read:

1. `context/07-v3-intelligence-generation-rules.md`
2. the explicit Git ref containing the historical Cards
3. related historical tool only when the user explicitly requests a historical/manual review

Rules:

- Archived relationship graphs use historical Card nodes and must never be promoted into RELATION-V2.1.
- Trend candidates and explicit no-decision shells are historical/manual research artifacts, not daily production outputs or publication gates.
- A single article, opinion, or funding event cannot form a trend.
- Builders viewpoints must not be used as evidence.

### Enterprise AI / FDE Lens

Read:

1. `agent-workflow/skills/guanlan-fde-data-projection/SKILL.md`
2. `context/12-data-center-v4.md`
3. current V4 FDE generator and integrity gate
4. `agent-workflow/tools/build-guanlan-vault.mjs`

Rules:

- FDE is an independent V4 implementation projection.
- Every public FDE item must include source-bounded demand / service / result analysis.
- FDE follows the V4 evidence boundary: English title translation and source-backed fact extraction resolve through SourceArtifact, RawDocument, accepted Claims, and the FDE projection.
- Missing FDE title/fact fields are repaired in V4 intake/extraction/projection, not through archived Cards.
- If the source does not disclose implementation results, state that explicitly instead of inventing ROI or production outcome.
- FDE detail openability is owned by the FDE skill. Its readable knowledge projection is rebuilt into `60-知识资产/企业 AI 案例` by the Guanlan Vault builder, not by generic Business Signals Card repair.

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
2. `context/10-experience-automation.md`
3. open production incidents with `npm run inbox:incidents -- --status=open --latest=false`
4. the linked `report_path` and failed gate or lane script

Rules:

- Treat production incident items as the active repair queue for repeated monitoring, publishing, and data-quality failures. Retired Hermes inbox items and old run reports are recovered from Git history only.
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
