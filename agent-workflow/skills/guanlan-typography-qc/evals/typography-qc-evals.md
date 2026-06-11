# Typography QC Evals

Run these pass/fail checks when auditing WaveSight AI / Guanlan V3.3.1 typography.

## Required Checks

1. `current_pages_only`
   - Pass when the audit targets current V3.3.1 pages: `v3-data-observation.html`, `follow-builders.html`, and `operations-console.html`.

2. `shared_topbar`
   - Pass when Business Signals and First-Line Viewpoints use the same topbar structure, height, and navigation typography.

3. `no_retired_page_basis`
   - Pass when retired V2 pages or daily-observation / brief / trend-report modules are not used as current typography baselines.

4. `hierarchy_tokens`
   - Pass when headings, cards, sidebars, labels, and footer text follow the current VI position hierarchy or explicit project tokens.

5. `css_risk_scan`
   - Pass when `font-size`, `font-weight`, `line-height`, `letter-spacing`, `clamp(`, and `vw` risks are checked in the relevant CSS.

6. `visual_evidence`
   - Pass when visible page work includes desktop screenshot or browser-rendered evidence for hierarchy and overlap.

## Repair Loop

When a check fails, fix the smallest selector or page contract mismatch and rerun the relevant syntax / visual / regression check.
