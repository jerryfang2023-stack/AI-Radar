---
name: guanlan-daily-monitor-qc
description: Use when auditing suspicious V4 source pages, provenance, full-text integrity, intake routing, or coverage on demand. Do not use as a mandatory daily release gate, numeric threshold owner, or full-chain rerun controller.
metadata:
  guanlan:
    version: "1.3.0"
    lane: "Data Center Source Ingestion"
    status: "current diagnostic sub-skill"
    order: 60
    responsibility: "Perform on-demand semantic audit of SourceArtifact / RawDocument intake evidence."
    upstream: "monitor reports and structured source intake"
    downstream: "diagnostic findings and targeted repair route"
    gates: "none; findings map to source-intake and V4 integrity gates"
    recent_learning: "Do not duplicate numeric release gates or make report freshness a publication condition."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Daily Monitor QC

This skill is an on-demand semantic audit. Use it when the automated evidence-supply report shows suspicious Core routing, source contamination, main-theme evidence gaps, or when a human requests a deeper quality review.

## Required Reads

1. `AGENTS.md`
2. `context/12-data-center-v4.md`
3. `context/05-daily-monitoring.md`
4. Target-date SourceArtifact / RawDocument intake and monitor reports.
5. `evals/daily-monitor-qc-evals.md` when changing this skill.

## Audit Scope

- original-source traceability;
- readable full text, snapshot/hash and excerpt integrity;
- index/homepage/directory misrouting;
- discovery-channel separation;
- duplicate/noise inflation;
- large-company or theme concentration;
- missing high-value source-backed evidence.

Raw text and evidence excerpts must not be rewritten for style.

## Workflow

1. Resolve the requested date and suspicious intake slice.
2. Inspect original-source lineage, snapshot/hash, readable body, excerpts, routing, duplicates, and coverage concentration.
3. Classify each finding by severity and earliest owning stage.
4. Recommend the smallest targeted repair and validation command without running unrelated production stages.

## Policy

- Resolve the target date and suspicious slice from the active run; ask when they cannot be determined without changing the audit result. Stop and report missing evidence instead of substituting another date or dataset.
- Source count 150, selected evidence 75, routed evidence 60 and core evidence 30 are diagnostic coverage targets, not P0 rules in this audit.
- Do not duplicate hard thresholds already enforced by `source-intake-gate-v1.json`.
- A provider/channel failure is diagnostic unless the executable evidence-supply gate also fails.
- Missing or stale QC Markdown is not a release blocker.
- Findings must map to one owning stage: source capture, evidence supply, Claim/Event build, application projection, frontstage contract, or publication.
- Never request a full-chain rerun for an application, frontstage, PR, Pages, or local-sync problem.
- Local inspection and the diagnostic report are allowed for a requested audit. Production mutation, external calls, publication, and deployment require their owning workflow or explicit authorization.

## Findings

Use three severities:

- `blocker`: an executable hard-gate violation, with the exact gate and evidence.
- `repair_required`: a semantic defect that should be fixed before the affected item is used.
- `diagnostic`: coverage, provider or concentration risk that does not block healthy downstream assets.

The audit may recommend targeted refetch, discovery-only routing, duplicate removal, or additional original-source coverage. It may not invent evidence or promote weak material to satisfy a count.

## Output

Write `agent-workflow/reports/<date>-guanlan-daily-monitor-qc.md` only when this audit actually runs. State:

- evidence inspected;
- findings by owning stage;
- affected SourceArtifact / RawDocument IDs;
- exact repair;
- smallest validation command;
- whether the executable pipeline is blocked.

## Verification

```powershell
node agent-workflow/tools/assert-business-signals-pipeline-policy.mjs
```

## Done When

Finish when inspected evidence and affected IDs are listed, every finding maps to one owner and severity, the executable pipeline impact is explicit, and the repair route does not broaden into an unnecessary rerun.
