# WSD-20260511 Structured Signal Card Closeout

## Scope

- Page: `01-SiteV2/site/structured-signal.html`
- Code: `01-SiteV2/site/assets/app.js`
- Style: `01-SiteV2/site/assets/styles.css`

## Completed

- Reworked Structured Signal detail page into 5 compact sections:
  1. Signal Dossier
  2. Source Ledger
  3. Commercial Read
  4. Upgrade Watch
  5. Related Path
- Merged the old isolated main card and right-side judgment into a single signal dossier.
- Replaced the old source table with a source ledger style.
- Added a compact commercial read module with a small signal relationship map.
- Replaced repeated related cards with a compact related tracking list.
- Fixed the old wording direction by using `相关追踪` and avoiding the previous typo-prone phrasing.
- Tuned Structured Signal title size to stay below Front Signal report weight.
- Added responsive behavior for the new sections.

## Verification

- `node --check 01-SiteV2/site/assets/app.js`: passed.
- `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed, with known child-process spawn limitations noted by the gate output.
- Browser render target: `http://127.0.0.1:4173/structured-signal.html`.
- Desktop screenshot set:
  - `agent-workflow/reports/v2-structured-signal-card-2026-05-11/structured-signal-desktop-first-screen-final.png`
  - `agent-workflow/reports/v2-structured-signal-card-2026-05-11/structured-signal-desktop-full-final.png`
- Mobile screenshot set:
  - `agent-workflow/reports/v2-structured-signal-card-2026-05-11/structured-signal-mobile-first-screen-final.png`
  - `agent-workflow/reports/v2-structured-signal-card-2026-05-11/structured-signal-mobile-full-final.png`
- Metrics:
  - Desktop height: `2706px`
  - Mobile height: `5605px`
  - Desktop horizontal overflow: `false`
  - Mobile horizontal overflow: `false`
  - Desktop H1 size: `46.08px`
  - Mobile H1 size: `34px`
- Rendered text scan found no listed blocked terms for this page.

## Notes

- The page is now intentionally shorter and more structured than the Front Signal detail page.
- Public labels now emphasize signal status, source ledger, commercial read, upgrade watch, and related tracking.
- The content still uses existing mock/source data; richer source facts can be improved when the V2 content model provides more granular source fields.
