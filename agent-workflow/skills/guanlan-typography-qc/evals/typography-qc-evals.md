# Typography QC Evals

Run these pass/fail checks when auditing WaveSight AI / Guanlan current V4 typography.

## Required Checks

1. `current_pages_only`
   - Pass when the audit targets current V4 pages: `data-center.html`, `intelligence-map.html`, weekly / monthly report details, and `operations-console.html`. Compatibility redirect files are not typography baselines.

2. `shared_v4_shell`
   - Pass when Data Center, Industry Reports, and report details use the same V4 logo header and sidebar typography.

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
