# Guanlan Skill GPT-5.6 Full Audit — 2026-08-01

## Outcome

All 23 active governed Skills now satisfy `GPT-5.6-SKILL-V1.0`. The contract applies the Skill-relevant parts of OpenAI's current [Model guidance](https://developers.openai.com/api/docs/guides/latest-model): lean trigger metadata, explicit domain context and constraints, one clear autonomy boundary, observable success criteria, and representative validation. API-only settings such as reasoning effort, Pro mode, persisted reasoning, prompt caching, and Programmatic Tool Calling were deliberately not copied into ordinary domain Skills.

Skill Store version: `v2.0.1`.

## Contract

Every active governed Skill must now provide:

1. `description` beginning with `Use when` and containing a concrete `Do not use` neighbor;
2. scoped inputs or required reads;
3. an imperative workflow;
4. non-inference, ask/stop, and action/approval boundaries;
5. explicit output and observable completion/validation;
6. evals and examples;
7. valid `agents/openai.yaml` whose default prompt mentions `$skill-name`;
8. one trigger-evaluation record covering direct, indirect, incomplete, negative, and edge prompts;
9. no stale Raw/V3 authority, generic scheduler onboarding, Unicode replacement text, or known mojibake signatures.

## Per-Skill Audit Matrix

| Skill | Main issue before | Applied change |
|---|---|---|
| `guanlan-data-center-supervisor` | Missing explicit input/output/completion and duplicated step numbers | Added full execution/authorization contract and corrected stage order |
| `guanlan-source-ingestion` | Domain rules without workflow/output/stop contract | Added scoped workflow, quarantine stop rules, output and completion |
| `guanlan-event-normalizer` | Compact rules without explicit QA/identity decision boundary | Added inputs, workflow, non-inference/QA stops, output and completion |
| `guanlan-data-integrity-gate` | One-paragraph gate prompt | Added evidence inputs, earliest-owner workflow, fail-closed boundary and done criteria |
| `guanlan-daily-monitor` | Negative scope not discoverable as `Do not use` | Tightened metadata and completion so capture cannot masquerade as publication |
| `guanlan-monitor-quality-gate` | Trigger metadata and autonomy boundary incomplete | Front-loaded trigger, separated diagnostics, repair ownership and completion |
| `guanlan-daily-monitor-qc` | Audit scope lacked an imperative workflow | Added bounded audit sequence, targeted repair output and completion |
| `guanlan-taxonomy-governor` | Rules lacked change/ambiguity/output contract | Added taxonomy decision boundary, explicit assertion output and completion |
| `guanlan-fde-data-projection` | Projection rules lacked stop/output contract | Added missing-field stop behavior, output and evidence-based completion |
| `guanlan-ai-hardware-data-projection` | Projection rules lacked input/output completion | Added schema inputs, workflow, non-inference boundary and done criteria |
| `guanlan-first-line-viewpoints-monitor` | Long lane prompt lacked one action boundary and final completion | Added local-vs-publication authorization and route-level done criteria |
| `guanlan-community-intelligence-monitor` | Dated incident narrative repeated current rules | Removed historical prompt debt, normalized workflow, added action and completion boundary |
| `follow-builders` | Good lean rewrite but missing UI metadata/output heading | Added explicit output/done contract and governed UI metadata |
| `guanlan-weekly-business-change-radar` | Report rules lacked one end-to-end workflow and boundary | Added manifest-to-content workflow, separation boundary and done criteria |
| `guanlan-monthly-business-structure-report` | Pre-1.0 contract with implicit completion | Promoted to 1.0 and made evidence/verification completion explicit |
| `guanlan-trend-radar-updater` | Factual rules lacked output/completion | Added projection output and reconciliation-based done criteria |
| `guanlan-opportunity-radar-updater` | Oversized trigger metadata and implicit external/human actions | Shortened description; separated local, model, review and publication boundaries |
| `guanlan-funding-insight-generator` | External search/model cost and completion boundary implicit | Added external-usage authorization, explicit outputs and fail-closed completion |
| `guanlan-weekly-report-page-generator` | Stale content-path instruction and implicit release boundary | Removed stale path, added local-vs-release authorization and done criteria |
| `guanlan-monthly-report-page-generator` | Release authorization and final acceptance implicit | Added action boundary and full responsive/render completion |
| `guanlan-typography-qc` | Trigger did not distinguish audit from redesign/data work | Rewrote metadata and added position-based audit workflow |
| `guanlan-skill-editor` | Did not encode the full current OpenAI Skill/prompt contract | Added GPT-5.6 reference, audit workflow, action/API exclusions and certification criteria |
| `guanlan-code-rule-auditor` | Strong read-only contract but no explicit completion | Added evidence-sufficiency and no-mutation done criteria |

## Governance Changes

- `evaluateSkillPromptContract` checks all active governed Skills, including downstream applications previously skipped by the current/supporting/governance status regex.
- `skill-trigger-evals.json` provides 115 representative activation cases: five categories for each of the 23 Skills.
- Skill Ops now rejects incomplete trigger-evaluation inventory and reports prompt-contract, trigger-eval inventory, implicit-discovery, and UI-metadata coverage. Inventory completeness is not presented as an automated model-routing score.
- All 23 Skills have valid `agents/openai.yaml`; previously eight were absent and five contained corrupted Chinese UI strings.
- All 23 Skills allow semantic implicit discovery. This only loads the applicable Skill; external writes, publication, deployment, and model-cost decisions remain controlled by each Skill's explicit authorization boundary.
- The Skill Pattern gate no longer requires ceremony for simple one-step work; patterns remain required when a complex/high-risk dispatch relies on them.
- The earlier `v1.9.0` audit report now identifies its limited scope instead of claiming full GPT-5.6 normalization.

## Independent Forward-Test Repairs

Two read-only blind reviews tested trigger routing and executable contracts without using this report. Their findings produced these additional fixes:

- separated source capture, executable intake gate, and semantic QC so commands cannot silently recollect healthy evidence;
- made the public body-free RawDocument / private evidence-store boundary explicit and required Claim spans to resolve through `body_ref`;
- reran the Data Center integrity gate after model-assisted rebuild, made external model use conditional on authorization, and split Data Center-only sync from broader application rebuilds;
- removed the homepage/directory factual exception that contradicted the zero-Core hard gate;
- replaced duplicated monitor limits and invalid flags with current configuration ownership;
- added real build/assert/render commands and output locations to FDE, hardware, taxonomy, monthly content, and weekly/monthly page Skills;
- removed mandatory out-of-scope Skill self-editing and compatibility-store writes;
- replaced Typography QC's copied numeric table and unsupported `/10` scoring with current-token lookup and evidence-based verdicts;
- corrected the stale weekly page site version and all trigger-eval ownership/neighbor collisions.

## Validation Required

- OpenAI Skill `quick_validate.py` for all 23 folders;
- complete direct/indirect/incomplete/negative/edge trigger-evaluation inventory for all 23 Skills;
- `npm run test:skill-ops`;
- `npm run sync:repo-skills` and `npm run sync:skill-store`;
- `npm run build:skill-store-dashboard`;
- `npm run validate:guanlan-skills` and `npm run check:skill-ops`;
- version consistency, current-rule hygiene, and Pages/frontstage regression before release.

## Validation Result

- OpenAI `quick_validate.py`: 23/23 Skills valid.
- Skill Ops: 25/25 tests passed after the corrective release and review hardening; prompt contract, trigger-eval inventory, implicit discovery, examples, evals, and OpenAI metadata all report 100% coverage. Semantic routing and boundary behavior were separately checked by the read-only blind forward tests above.
- Runtime mirrors: 23/23 repo Skills and 23/23 compatibility-store Skills synchronized with zero drift.
- Operations/runtime regression: 10/10 tests passed; custom-agent preflight passed for three configs; 22/22 model-routing cases validated.
- Data Center and site core: 60/60 tests passed; the deployment `frontstage-regression-gate` passed with zero issues.
- The optional browser smoke found one existing mobile filter-width mismatch after the legacy `v3-data-observation` redirect. No HTML, CSS, or frontstage logic changed in this audit, so it is recorded as unrelated follow-up rather than mixed into the Skill patch.

## Full Re-audit and Corrective Release

The user-requested re-audit pinned `main` at `99a5bec46de0701ef9ca56826e0fd22a6dce22ab` and checked three surfaces: 23 governed project Skills end to end, all 163 Skill Store dashboard contracts, and all 231 locally discovered Skill manifests. Static gates initially passed, but an independent read-only forward audit still found five actionable contract defects. This distinction is intentional: inventory completeness and lint coverage do not replace representative execution-path review.

The corrective release fixes:

1. `follow-builders` now owns the afternoon `07-points/<date>-builders-viewpoints.md`, V4 projection, and exact-date publish report; it is forbidden from writing or validating the morning-owned `follow-builders-daily.json`.
2. Funding Insights now matches the executable bounded exception for explicitly undisclosed investors: empty investor list, `investor_disclosure_status=not_disclosed`, and retained `investors_missing` risk marker.
3. Data Center historical reprojection now forbids legacy page JSON, compatibility Cards, mappings, and interfaces, with explicit retirement-gate coverage.
4. First-Line Viewpoints now points to the current `build-guanlan-vault.mjs` implementation instead of a deleted timeline-sync script.
5. Read-only Skill defect discovery belongs to `guanlan-code-rule-auditor`; requested Skill creation or repair belongs to `guanlan-skill-editor`. Cross-Skill boundary evals specify the split without presenting inventory coverage as a model-routing score.

Post-repair evidence: 23/23 governed Skills pass with 25/25 Skill Ops tests, including a real afternoon-only gate fixture that fails under the combined morning requirement and passes under the owning afternoon route. Funding Insights 36/36, Operations 10/10, Data Center/site core 60/60, compatibility retirement and no-active-V3 gates passed, all 23 repository and compatibility mirrors have zero drift, all 23 official `quick_validate.py` checks pass, the 163-Skill dashboard contract passes, and local discovery reports 231 manifests with zero invalid or duplicate enabled names.
