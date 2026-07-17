---
name: guanlan-code-rule-auditor
description: Use when auditing WaveSight AI / Guanlan code, rules, skills, scripts, GitHub Actions, gates, or data-flow logic for bugs, contradictions, dead paths, migration failures, and unnecessary complexity. Covers the V4 factual core plus V3 internal Card, relationship-graph, and trend-candidate compatibility chain. Do not use it to run daily production, edit same-day production data, auto-fix findings, push, or deploy.
metadata:
  guanlan:
    version: "1.0.1"
    lane: "Code and rule audit"
    status: "governance"
    order: 115
    responsibility: "Audit code, rules, skills, workflows, gates, and GitHub flow for evidence-backed defects and conflicts."
    upstream: "current context, incident evidence, target diff or execution chain"
    downstream: "prioritized findings, owning-stage diagnosis, minimal repair and validation plan"
    gates: "source-of-truth alignment, reachability, stage ownership, GitHub necessity, evidence completeness"
    recent_learning: "Audit mechanically first and trace each failure to the earliest owning stage before proposing repairs."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Code and Rule Auditor

Audit the active WaveSight execution chain without mutating it. Separate confirmed defects from design risks and trace every finding to observable evidence.

## Required Reads

Read only the sources needed for the target:

1. Repository `AGENTS.md` and the current task route it names.
2. `context/00-current-state.md`, `context/07-v3-intelligence-generation-rules.md`, and the target lane context.
3. `context/06-execution-harness.md` for high-risk commands or automation.
4. `context/08-v3-3-automation.md` for GitHub, Pages, scheduling, or deployment audits.
5. `context/10-v3-3-experience-automation.md` for Skill Ops, action logging, or retrospective automation audits.
6. Target skills, workflows, scripts, data contracts, gates, and directly linked incident evidence.
7. [references/audit-checklist.md](references/audit-checklist.md) for a full audit.
8. [evals/code-rule-auditor-evals.md](evals/code-rule-auditor-evals.md) before finalizing findings.

Treat current context as truth. Historical reports establish symptoms and prior events; they do not override current rules.

## Audit Boundary

Trace the smallest relevant chain:

```text
user intent -> AGENTS/context -> Skill -> entry command/workflow -> script
-> Raw/Pool/Card data -> quality gate -> frontstage -> GitHub/deployment
```

For Business Signals, verify all three core analytical outputs independently:

- qualified Signal Cards;
- Card-backed relationship graph;
- multi-signal trend candidates.

Keep First-Line Viewpoints, Community Intelligence, AI Hardware, and Enterprise AI / FDE within their documented ownership boundaries.

## Workflow

1. **Pin the baseline.** Record current version, branch, fixed point or failing run, active entry command, and expected output. If auditing a diff, use the installed `$code-review` Skill for separate Standards and Spec reports; do not merge those axes.
2. **Classify commands before execution.** Inspect an audit/check command and its children for writes, sync, generation, repair, incident closure, Git, or deployment behavior. Prefer direct read-only children or a proven dry-run mode. Never infer safety from a command name.
3. **Build the active execution map.** Follow only reachable commands, workflow steps, imports, arguments, outputs, and gates. Mark retired or unreachable paths separately.
4. **Run mechanical checks first.** Confirm files and commands exist, arguments are consumed, outputs feed the next stage, workflow conditions are reachable, generated files have one owner, and gates inspect the fields they claim to inspect.
5. **Run semantic review.** Apply the five axes in the checklist: correctness, simplicity/readability, architecture/stage ownership, security/integrity, and performance/reliability. Then apply Guanlan-specific V4 source-of-truth and V3 internal compatibility boundaries.
6. **Trace symptoms upstream.** Identify the earliest stage that creates the bad state. Do not repair an ingestion defect in a frontstage filter or close a recurring incident by editing only same-day data.
7. **Challenge necessity.** For every rule, gate, workflow, fallback, compatibility branch, and generated artifact, state its owner and consumer. Flag items with no current consumer, duplicate ownership, contradictory thresholds, or no failure-prevention value.
8. **Report before repair.** Produce prioritized, evidence-backed findings and a minimal repair/validation plan. Change files only when the user explicitly requests the repair phase.

## Finding Contract

Every confirmed finding must include:

- severity: `P0` production/security loss, `P1` repeated lane failure or wrong public data, `P2` latent defect or material complexity, `P3` cleanup;
- evidence: exact file and tight line range, command/run evidence when relevant;
- violated source of truth or expected contract;
- actual execution impact and affected downstream stages;
- earliest owning stage;
- smallest safe repair;
- validation that would prove the repair.

Use `confirmed`, `likely`, or `needs-runtime-proof`. Do not present search hits, stale prose, or code smells alone as confirmed bugs.

## Stop Rules

- Stay read-only during audit mode.
- Do not run daily production, publish data, close Hermes items, push, or deploy.
- Do not lower evidence, Card, or release gates merely to make a workflow green.
- Do not preserve retired V2/V3 page behavior when it conflicts with current V4 rules.
- Do not treat provider quota, Raw coverage, or lane-balance diagnostics as release blockers unless current context explicitly does.
- Do not recommend a new abstraction, workflow, dependency, or gate without naming the duplicate or failure it replaces.

## Output

Return:

1. baseline and audited chain;
2. findings ordered by severity, with confidence and evidence;
3. contradictions and unnecessary components;
4. GitHub workflow ownership/necessity assessment;
5. minimal repair sequence by earliest owning stage;
6. validation plan and unresolved runtime evidence.
