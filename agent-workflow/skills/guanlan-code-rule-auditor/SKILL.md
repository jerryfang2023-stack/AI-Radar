---
name: guanlan-code-rule-auditor
description: Use when performing a read-only defect audit of WaveSight AI code, rules, skills, scripts, GitHub Actions, gates, or data-flow logic for contradictions, dead paths, migration failures, and unnecessary complexity. Covers the V4 factual core, downstream applications, operations, deployment, and the permanent V3-retirement boundary. Do not use when the request is to create, update, or repair a Skill; route that mutation to guanlan-skill-editor after findings are accepted.
metadata:
  guanlan:
    version: "1.2.1"
    lane: "Code and rule audit"
    status: "governance"
    order: 115
    responsibility: "Audit current V4 code, rules, workflows, gates, applications, and release ownership with evidence-backed findings."
    upstream: "current context, incident evidence, target diff or execution chain"
    downstream: "prioritized findings, owning-stage diagnosis, minimal repair and validation plan"
    gates: "source-of-truth alignment, reachability, stage ownership, retirement integrity, GitHub necessity, evidence completeness"
    recent_learning: "A green runtime gate is insufficient when current contracts, Skills, generated dashboards, or public data still direct agents to retired interfaces. Retirement audits must cover governance and deployed artifacts as well as executable imports."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Code and Rule Auditor

Audit the active WaveSight V4 execution chain without mutating it. Separate confirmed defects from design risks and trace every finding to observable evidence.

## Required Reads

Read only the sources needed for the target:

1. Repository `AGENTS.md` and the current task route it names.
2. `context/00-current-state.md` and the target lane context.
3. `context/06-execution-harness.md` for high-risk commands or automation.
4. `context/08-automation.md` for GitHub, Pages, scheduling, or deployment audits.
5. `context/10-experience-automation.md` for Skill Ops, action logging, or retrospective automation audits.
6. Target Skills, workflows, scripts, data contracts, gates, and directly linked incident evidence.
7. [references/audit-checklist.md](references/audit-checklist.md).
8. [evals/code-rule-auditor-evals.md](evals/code-rule-auditor-evals.md) before finalizing findings.

Read `context/07-v3-intelligence-generation-rules.md` only to verify retirement history. It is not a current production rule source.

## Audit Boundary

Trace the smallest relevant chain:

```text
user intent -> AGENTS/context -> Skill -> entry command/workflow -> script
-> SourceArtifact/RawDocument -> Claim/Entity/CanonicalEvent
-> factual projections / downstream applications / OPS
-> quality gate -> frontstage -> GitHub/Pages
```

Audit these outputs independently when they are in scope:

- V4 factual tables and lineage;
- FDE, hardware, entity history, and RELATION-V2.1 projections;
- Opportunity Map, Trend Radar, Funding Insights, and Reports;
- collection telemetry, supervision, Pages, and the external Guanlan Vault projection boundary.

First-Line Viewpoints and Community Intelligence remain independent namespaces. They cannot create Claims, CanonicalEvents, or RELATION-V2.1 rows.

## Workflow

1. **Pin the baseline.** Record version, branch, fixed point, entry command, and expected output.
2. **Classify commands before execution.** Inspect audit/check wrappers for writes, generation, sync, incident closure, Git, or deployment. Prefer direct read-only children or a proven dry run.
3. **Build the reachable map.** Follow current commands, workflows, imports, arguments, artifacts, and consumers. Classify historical mentions separately.
4. **Run mechanical checks.** Confirm paths exist, arguments are consumed, outputs reach one named consumer, and every generated artifact has one owner.
5. **Run semantic review.** Apply correctness, simplicity, stage ownership, security/integrity, reliability, and V4 source-of-truth boundaries.
6. **Audit retirement integrity.** Confirm V3 producers, payloads, compatibility schema fields, mappings, active governance instructions, and deployable artifacts are absent. Protective or historical mentions are not defects.
7. **Trace upstream.** Repair plans start at the earliest stage that creates the state.
8. **Challenge necessity.** Flag duplicate ownership, unreachable compatibility branches, dead artifacts, and rules with no failure-prevention value.
9. **Report before repair.** Provide prioritized findings and a minimal validation plan. Change files only when the user explicitly authorizes repairs.

## Finding Contract

Every confirmed finding includes:

- severity: `P0` production/security loss, `P1` repeated lane failure or wrong public data, `P2` latent defect or material complexity, `P3` cleanup;
- confidence: `confirmed`, `likely`, or `needs-runtime-proof`;
- exact file and tight line range;
- violated current contract;
- downstream impact and earliest owning stage;
- smallest safe repair;
- validation that proves the repair.

Search hits and historical prose alone are not confirmed bugs.

## Stop Rules

- Stay read-only during audit mode.
- Do not run production collection, publish data, close incidents, push, or deploy.
- Do not lower evidence or release gates to make a workflow green.
- Do not restore V2/V3 interfaces for compatibility.
- Do not treat provider quota, source-volume, or lane-balance diagnostics as release blockers unless current context says so.
- Do not add an abstraction, workflow, dependency, or gate without naming what it replaces or which repeated failure it prevents.

## Output

Return:

1. baseline and audited chain;
2. findings ordered by severity and confidence;
3. contradictions, dead paths, and unnecessary components;
4. GitHub workflow ownership assessment;
5. minimal repair sequence by earliest owner;
6. validation plan and unresolved runtime evidence.

## Done When

Finish when the pinned execution chain and evidence are sufficient to distinguish confirmed defects, design risks, historical mentions, and unknowns; every finding names its earliest owner and smallest validation; and no mutation or external action occurred unless the user separately authorized repair.
