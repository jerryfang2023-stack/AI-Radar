---
title: V2 homepage and page system editorial redesign closeout
date: 2026-05-08
owner: UI / UE Agent + Dev Agent
status: in-progress
---

# V2 Homepage And Page System Editorial Redesign Closeout

## Scope

This round rebuilt the V2 site page rhythm away from the previous block/card accumulation style. It updates the homepage, column pages, and detail pages in `01-SiteV2/site/` only.

## Completed

- Reworked homepage hero copy back to the VI-based line: `观 AI 之澜，识商业之势`.
- Kept the left hero primary button as a deep ink block and restored the original CTA set.
- Added page identity classes in `01-SiteV2/site/assets/app.js` for page-level layout control.
- Added an editorial layout reset in `01-SiteV2/site/assets/styles.css`:
  - continuous report-like sections instead of isolated card stacks;
  - line-based signal lists;
  - compact relation summaries instead of fully expanded relation panels on index pages;
  - detail pages with article body plus side rail;
  - mobile single-column rules with no horizontal overflow.
- Enforced the supplied typography spec:
  - `--gl-font-serif-cn` for hero, page, brief, and article titles;
  - `--gl-font-sans-cn` for body, UI, cards, and buttons;
  - `--gl-font-en` for English labels and navigation-like micro text;
  - `--gl-font-mono` for numbers and indexes.
- Restored VI color discipline:
  - ink `#071827`;
  - deep wave blue `#0D355C`;
  - muted blue gray `#6F7F8F`;
  - champagne gold `#C8A766`;
  - no new purple/blue gradients or unrelated AI motifs.

## Deferred

- The homepage right-side fused visual is structurally in place, but the image quality still needs a dedicated final pass. User explicitly asked to leave that as the final step after the page redesign.

## Verification

- `node --check 01-SiteV2/site/assets/app.js`: passed.
- `node --check 01-SiteV2/site/dev-server.mjs`: passed.
- `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
- Browser QA screenshots and metrics saved under:
  - `agent-workflow/reports/v2-redesign-editorial-reset-2026-05-08/`
- Browser QA covered:
  - `index.html`
  - `daily.html`
  - `signals.html`
  - `opportunities.html`
  - `brief.html`
  - `daily-detail.html`
  - `signal-detail.html`
  - `opportunity-detail.html`
- Desktop and mobile screenshot metrics report no horizontal overflow.

## Notes

- No content model changes.
- No membership logic changes.
- No Netlify deployment.
