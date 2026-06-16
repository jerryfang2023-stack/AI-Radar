# Weekly Report Page Generation Standards

## Source Contract

- Source weekly report content from `01-SiteV2/content/08-report/`.
- Each issue should have frontmatter:
  - `title`
  - `date`
  - `week`
  - `window`
  - `content_type: weekly-report`
  - `slug: ai-business-change-radar`
  - `status`
- `agent-workflow/reports/` may remain an operational archive, but future page generation must not depend on it as the only source.

## Intelligence Map Entry

- Keep weekly reports below the relationship network.
- Keep the relationship network as the first Intelligence Map value.
- Include a time-window selector, even if only one issue exists.
- Use count tags such as `Signals 101 张`, `Opinions 44 条`, `Community 约 44 条`.
- Keep the read button as the card action, vertically centered on desktop and stacked only on narrow screens.
- Do not restore Trend Candidates or History blocks to `intelligence-map.html`.

## Detail Page Structure

- Use the report title as the H1.
- Put the time-window selector on the H1 row when space allows.
- Start with fast-scan editorial modules, not a methodology or data-scope section.
- Put data scope and evidence boundaries near the end unless the user asks otherwise.
- Keep section numbers visually paired with headings; avoid duplicate `01` plus `1.` numbering.

## Flexible Module Mapping

Use the content shape to choose modules:

| Source section | Preferred rendering |
|---|---|
| one-sentence conclusion | editorial prose + evidence bullets |
| trend heatmap | ranked cards |
| trend chains | chain cards with 5 nodes |
| impact heatmap | impact cards + process strip |
| opportunity cards | opportunity profile cards + score bars |
| contrarian view | callout / quote block |
| next week watchlist | categorized cards + tags |
| actionable conclusions | role-based list or cards |
| data scope | compact evidence appendix |

## Visual Rules

- Follow `context/02-vi-style.md`.
- Prefer full-width sections and restrained panels over nested cards.
- Use blue/gold accents sparingly.
- Avoid large gradient decorations, orbs, marketing hero layouts, and visible “how to use this page” text.
- Avoid dense table borders; use spacing, labels, tags, and hierarchy.
- Preserve responsive behavior: no horizontal page overflow on desktop or mobile.

## Required Validation

- `git diff --check`
- `node agent-workflow/tools/assert-v3-source-first-frontstage.mjs`
- `node agent-workflow/tools/frontstage-regression-gate.mjs`
- Playwright smoke:
  - Intelligence Map desktop
  - weekly detail desktop
  - weekly detail mobile
- Page assertions:
  - weekly detail has no `<table>` unless explicitly requested;
  - time-window selector exists;
  - version/source meta exists after release;
  - no Trend Candidates / History blocks on Intelligence Map.
