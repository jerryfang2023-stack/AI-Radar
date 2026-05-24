# Guanlan Daily Monitor QC Report

## 1. Summary

- Date: 2026-05-23
- Result: passed_after_manual_backfill
- Score: 88
- Downstream decision: allow_with_degradation
- Biggest issue repaired: `important_vertical_solution` coverage was previously misclassified into funding/case lanes. After classifier repair and a full rerun, Raw and Pool importance coverage both report `none`.

## 2. Metrics

| Metric | Value | Required | Result |
|---|---:|---:|---|
| Raw count | 120 | 80-150, or 50-80 with reason | passed |
| Pool count | 43 | 20-40 target | note: high, includes index-only audit material |
| Core pool count | 11 | baseline >=5 | passed |
| Routed pool count | 15 | excludes index-only/discard, baseline >=15 | passed |
| Index-only pool count | 28 | audit only | note |
| AI HOT index-only / core | 28 / 0 | separated | passed |
| Usable original-evidence core items | 11 | >= core_pool baseline | passed |
| Homepage / directory core items | 0 | 0 | passed |
| Discovery-entrance-only core items | 0 | 0 | passed |
| Missing full_text core items | 0 | 0 | passed |
| Raw-QC blocked / degraded core items | 0 | 0 | passed |
| Six importance types covered | yes | yes | passed |
| Pool importance types covered | yes | yes | passed |

## 3. Hard Gates

| Gate | Triggered | Evidence | Decision |
|---|---|---|---|
| Raw importance coverage | no | `importance_coverage_gaps: none` | passed |
| Pool importance coverage | no | `pool_importance_coverage_gaps: none` | passed |
| Provider output as discovery only | no | Anysearch is configured, reachable, and used as discovery; core evidence still points to original source URLs and local Raw archives. | passed |
| Core evidence completeness | no | 11 usable core items; no missing full text, no low readability, no Raw-QC block/degraded in core. | passed |

## 4. Repair Finding

The blocker was not a source outage. The monitor had enough industry and workflow candidates, but classification tie-breaking favored `important_funding` or `important_case` when a candidate also carried a funding or customer-case signal.

The repaired rule now promotes `important_vertical_solution` only when both conditions are met:

- named industry or vertical context, such as public procurement, architecture/AEC, utilities/grid, insurance, logistics, manufacturing, supply chain, healthcare, or legal workflows;
- deployable solution/workflow/product evidence, such as agent, automation, workspace, platform, interface, virtual workforce, operational complexity, procurement process, design engine, or adoption.

This preserves weak/index-only items as non-core and does not weaken evidence gates.

## 5. Source And Page-Type Audit

| Area | Finding | Decision |
|---|---|---|
| Core pool set | S/A/B mix, original source URLs, readable text, hashes and excerpts present | usable with lower claim strength |
| AI HOT selected items | Mostly retained as index-only | no factual downstream use unless original evidence exists |
| follow-builders | Opinion/builder entrance | usable only for who-said-what viewpoints, not company facts |
| failed source fallbacks | 8 failures/noise notes remain | soft risk; cite only successfully archived original evidence |

## 6. Downstream Permission

- Daily observation: allow_with_degradation
- Business signal: allow_with_degradation
- Trend tracking: allow_with_degradation
- Business brief: allow_with_degradation
- Asset chain: allowed with degradation

Degradation scope: use eligible core Pool evidence only. Do not cite AI HOT summaries, search result snippets, job/salary pages, directories, community threads, or follow-builders as company-fact evidence.
