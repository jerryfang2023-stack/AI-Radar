# WSD-20260511 Builder Perspective System Closeout

## Scope

- Pages:
  - `01-SiteV2/site/builders.html`
  - `01-SiteV2/site/builder-detail.html`
- Code:
  - `01-SiteV2/site/assets/app.js`
  - `01-SiteV2/site/assets/styles.css`

## Completed

- Reworked Builders entry page into 4 core sections:
  1. Perspective Header
  2. Featured Perspectives
  3. Perspective Grid
  4. Calibration Snapshot
- Reworked Builder detail page into 5 core sections:
  1. Profile Header
  2. Current View
  3. View Timeline
  4. Shift Analysis
  5. Related Links
- Added a dedicated featured perspectives area so the entry page no longer reads like a flat card list.
- Reframed the detail page as a profile dossier and view-change timeline, not a social profile or long post list.
- Added status, relationship, topic, 7D / 30D / 90D and source-boundary language to reinforce that opinions are calibration inputs, not fact evidence.
- Shortened card summaries and capped the detail timeline for a tighter reading path.
- Added responsive layout behavior for mobile views.

## Verification

- `node --check 01-SiteV2/site/assets/app.js`: passed.
- `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed, with known child-process spawn limitations noted by the gate output.
- Browser render targets:
  - `http://127.0.0.1:4173/builders.html`
  - `http://127.0.0.1:4173/builder-detail.html`
- Screenshot directory:
  - `agent-workflow/reports/v2-builder-perspective-system-2026-05-11/`
- Desktop metrics:
  - Builders entry height: `2354px`
  - Builder detail height: `3402px`
  - Horizontal overflow: `false`
  - Rendered blocked-term scan: no matches
- Mobile metrics:
  - Builders entry height: `5910px`
  - Builder detail height: `6436px`
  - Mobile H1 size: `34px`
  - Horizontal overflow: `false`

## Notes

- Current Builder identity still depends on existing source URL / mock data quality. Some entries display source domains such as `x.com` when richer person metadata is unavailable.
- The page now communicates the intended rule: viewpoints are used to adjust judgment, not to replace company announcements, customer evidence, financial reports, regulatory files, or first-party material.
