---
name: guanlan-enterprise-ai-fde-monitor
description: Use when supervising, running, repairing, or improving the WaveSight AI Enterprise AI / FDE lane. Covers FDE source discovery, independent Lens Pool selection, demand/service/result analysis, frontstage detail rendering, Obsidian 09-fde sync, and FDE-specific quality gates. Do not use for formal Business Signal Top10 selection, First-Line Viewpoints, Community Intelligence, or retired daily-observation outputs.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Enterprise AI / FDE"
    status: "current lane owner"
    order: 15
    responsibility: "Own the Enterprise AI / FDE lens: source-backed implementation evidence, independent FDE Lens Pool, demand/service/result analysis, public details, and Obsidian 09-fde sync."
    upstream: "Business Signals Raw / Pool evidence, FDE source-only discovery, Hermes inbox"
    downstream: "enterprise-ai-fde.json, Business Signals enterpriseAiTransformation lens, content/09-fde Obsidian archive, FDE quality gates"
    gates: "FDE precision, source-title translation, detail-openability, demand/service/result completeness, Obsidian sync"
    recent_learning: "FDE is an independent implementation lens, not a fourth Signal Card type; every public FDE item must explain demand, concrete service, and implementation result or explicitly state that the result is undisclosed."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Enterprise AI / FDE Monitor

This skill owns the Enterprise AI / FDE lens. It keeps implementation evidence separate from the formal Business Signals Top10 while still using source-backed Raw / Pool material.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/version-ledger.md`
4. `context/05-daily-monitoring.md`
5. `context/07-v3-intelligence-generation-rules.md`
6. `context/frontstage-page-contracts.md`
7. Relevant FDE report, Hermes inbox item, or failed gate output.

For implementation work, inspect:

- `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
- `01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs`
- `01-SiteV2/site/assets/v3-data-observation-desk.js`
- `agent-workflow/tools/sync-enterprise-ai-fde-to-obsidian.mjs`
- `agent-workflow/tools/frontstage-regression-gate.mjs`

For regression prevention, read `evals/enterprise-ai-fde-monitor-evals.md`. When repairing FDE detail quality, also read `examples/good-fde-detail.md` and `examples/bad-generic-enterprise-ai.md`. Read `MEMORY.md` when the failure resembles a previous FDE incident or when updating this skill.

## Workflow

1. Resolve the Asia/Shanghai production date unless the user gives another date.
2. Check whether `01-SiteV2/site/data/enterprise-ai-fde.json` is same-date and whether `meta.fdePoolCount` and `meta.itemCount` are non-zero when source supply exists.
3. Confirm the FDE Lens Pool uses source-backed implementation evidence: FDE, forward-deployed work, customer-embedded delivery, technical scoping, procurement, pilot, production deployment, workflow rollout, or vertical customer workflow.
4. For every public FDE item, require:
   - original/source title translated directly into Chinese;
   - a detail target that opens from the frontstage;
   - implementation analysis with `demand`, `services`, and `result`;
   - source-backed text in `sourceBasis` or the linked detail item.
5. If result evidence is not in the source, state that the final implementation result is not disclosed; do not invent ROI, adoption, deployment success, or production metrics.
6. Sync valid public items into `01-SiteV2/content/09-fde/` after the frontstage data gate passes.
7. Repair the smallest responsible layer: source discovery, pool precision, analysis generation, frontstage detail rendering, gate, or Obsidian sync.
8. Rerun the smallest relevant validation before publication.

## Boundaries

- FDE is not a fourth formal Signal Card type.
- Do not weaken Business Signals `product_service`, `funding`, or `case` card gates to make FDE display richer.
- Do not use broad governance, research, benchmark, consumer app, platform-only, or generic enterprise AI articles unless they contain concrete implementation evidence.
- Do not turn title or source-domain fragments into a subject.
- Do not rewrite titles into boss-facing summaries; translate the original/source title only.
- Do not publish an FDE item with empty detail, missing demand/service/result analysis, or a broken `详情` action.

## Reporting

When finishing, report:

- FDE data status;
- failed gate or report path inspected;
- files changed;
- validation run;
- Obsidian `09-fde` sync status;
- prevention artifact added or not needed;
- commit / PR / deployment status when relevant.
