---
name: guanlan-typography-qc
description: Use when auditing WaveSight/Guanlan V4 typography or specifying fixes for font size, weight, line-height, hierarchy, navigation, reports, cards, tables, sidebars, CSS clamp/vw risks, or closeout evidence. Do not use to redesign pages, rewrite copy, change brand fonts, or judge data correctness.
metadata:
  guanlan:
    version: "1.1.0"
    lane: "Cross-lane UI"
    status: "supporting skill"
    order: 100
    responsibility: "Check WaveSight typography and layout copy issues when page work changes."
    upstream: "frontstage pages"
    downstream: "UI QC notes"
    gates: "typography and UI consistency"
    recent_learning: "Use only for page or typography work, not data truth."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Typography QC

## Inputs

Resolve the target pages, viewports, changed selectors, and requested evidence. Read the current authority instead of copying its numeric rules into this Skill:

1. `context/02-vi-style.md`
2. `context/frontstage-page-contracts.md`
3. `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
4. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
5. `docs/brand/wavesight-ai-vi/brand-tokens.css`
6. Only the relevant page/CSS files and desktop or mobile render evidence.

Read `evals/typography-qc-evals.md` before changing this Skill. Use the examples only when the failure resembles their `vw`/`clamp()` cases.

## Workflow

1. Identify each reviewed element by page position: navigation, hero, column title, detail title/deck/body, module heading, card, table, sidebar, label, or footer.
2. Compare the rendered hierarchy and computed CSS with the current position guideline and brand tokens.
3. Scan only relevant selectors for arbitrary `vw`, risky `clamp()`, excessive weight, compressed line height, negative Chinese letter spacing, and competing hierarchy.
4. Classify each issue as `blocking`, `local_fix`, or `residual_risk`, cite the rendered/CSS evidence, and map it to an existing token or position rule.
5. Propose the smallest selector-level fix. If implementation is requested, change only the owning styles and rerender the affected viewports.
6. Recheck navigation consistency, main-versus-secondary hierarchy, text wrapping/overflow, and any touched responsive state.

## Boundaries

- Resolve the target page and affected viewport from the request; ask when multiple candidates would produce different findings. Stop visual acceptance when required render evidence is unavailable.
- Current guideline and token files are the numeric authority; do not maintain a second size table in this Skill.
- Do not invent a scoring formula or use unsupported `/10` precision. A verdict must follow concrete pass/fail evidence.
- Do not redesign the page, rewrite copy, change brand fonts, or treat aesthetic preference as a defect.
- Do not audit data correctness, content evidence, product structure, or unrelated layout behavior.
- Source inspection alone cannot prove a visual issue fixed. Require rendered evidence for visible acceptance; request mobile evidence only when the task or affected responsive selector makes it material.
- Read-only inspection is allowed for an audit. CSS/page edits require a requested fix; commit, publication, deployment, browser-account actions, and unrelated design work require explicit authorization or their owning workflow.

## Output

Return:

```md
## Typography QC Verdict
- Result: pass / needs-fix / fail
- Scope reviewed:
- Evidence inspected:
- Biggest issue:

## Issues
| Severity | File / selector / position | Evidence | Required fix |
|---|---|---|---|

## Token Mapping
- selector -> existing token or position rule

## Closeout Evidence
- renders or screenshots:
- commands run:
- remaining risks:
```

Omit empty issue rows. Use `pass` only when no blocking or local-fix issue remains and the required rendered evidence exists.

## Validation

Run the smallest relevant syntax, local render, viewport, overflow, and console checks. For broad frontstage changes also run `node agent-workflow/tools/frontstage-regression-gate.mjs`.

## Done When

Finish when every finding names a page position and observable violation, every proposed change maps to the current VI authority, affected rendered states are rechecked, and no unsupported score, redesign, copy edit, or data judgment was introduced.
