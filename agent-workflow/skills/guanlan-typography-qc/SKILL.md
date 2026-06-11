---
name: guanlan-typography-qc
description: Audit WaveSight AI / Guanlan V3.3.1 frontstage typography against the current VI and position-level rules. Use when reviewing or fixing font size, weight, line-height, title hierarchy, shared navigation typography, Business Signals, First-Line Viewpoints, Dashboard, cards, graph/trend modules, sidebars, footer text, CSS clamp/vw risks, or closeout typography evidence.
---

# Guanlan Typography QC

Use this skill to review whether a WaveSight AI page follows the project typography system. This skill does not redesign the page and does not rewrite copy. It finds typography, hierarchy, and position problems, then gives concrete fixes.

## Required Sources

Read these files before judging a page:

1. `context/02-vi-style.md`
2. `context/frontstage-page-contracts.md`
3. `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
4. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
5. `docs/brand/wavesight-ai-vi/brand-tokens.css`
6. `agent-workflow/product/DESIGN.md`

If reviewing visible pages, also inspect:

- `01-SiteV2/site/assets/styles.css`
- `01-SiteV2/site/assets/app.js`
- Desktop screenshots or browser-rendered pages

For regression prevention, read `evals/typography-qc-evals.md` when auditing, repairing, or updating this skill.

## What To Check

### 1. Position-Level Hierarchy

Check that each page position uses the correct tier:

| Position | Desktop Target |
|---|---:|
| Navigation text | `14px / 20px`, weight `500` |
| Homepage Hero H1 | `56px / 72px`, weight `600` |
| Homepage module title | max `36px / 48px`, weight `600` |
| Column page H1 | `44px / 58px`, weight `600` |
| Detail page H1 | `40px / 56px`, weight `600` |
| Detail deck | `18px / 32px`, weight `400` |
| Body text | `16px / 30px`, weight `400` |
| Body H2 | `26px / 38px`, weight `600` |
| Card title | default `18-20px`, max `24px / 34px`, weight `600` |
| Caption / summary | `14px / 24px`, weight `400` |
| Label / date | `12px / 18px`, weight `500-600` |
| Sidebar title | `16px / 24px`, weight `600` |
| Sidebar body | `13px / 22px`, weight `400` |
| Footer text | `12px / 20px` or `14px / 22px` for brand |

Fail the page if:

- A column page uses Hero-scale text.
- A detail page H1 exceeds `40px / 56px`.
- A card title visually competes with the page H1.
- Sidebar or related cards compete with the main article.
- Navigation changes size or weight between pages.

### 2. CSS Risk Scan

Search CSS for:

```text
font-size
font-weight
line-height
letter-spacing
clamp(
vw
```

Flag these as high risk unless clearly limited to homepage Hero:

- `font-size` using `vw`
- `clamp()` with max above `56px` outside Hero
- detail or column title above project tokens
- `font-weight: 700+` on navigation, card titles, labels, or body
- `font-weight: 760` / `780`
- negative letter-spacing on Chinese text
- `line-height` below `1.25` on multi-line Chinese headings
- body line-height below `1.7`

### 3. Page-Specific Checks

Homepage:

- Only Hero H1 may use the largest type.
- Section titles must not become Hero titles.
- Business signal, relationship graph, trend candidate, and first-line viewpoint modules must keep their own hierarchy.
- Main card may be stronger than list cards, but must remain below page Hero.

Current frontstage pages:

- Business Signals uses `01-SiteV2/site/v3-data-observation.html`.
- First-Line Viewpoints uses `01-SiteV2/site/follow-builders.html`.
- Dashboard uses `01-SiteV2/site/operations-console.html`.
- Business Signals and First-Line Viewpoints must share the same topbar structure and height.
- Filters and tags must remain visually secondary.
- List cards must be scannable and not look like full article pages.

Detail pages:

- H1 must read as article title, not poster text.
- Body width and line-height must support long reading.
- Module H2 and related-card titles must not compete with H1.
- Source links and metadata must align neatly and use small stable type.

Navigation:

- Must be consistent across all public pages.
- No border or shadow unless explicitly required by current VI.
- Current nav item uses subtle state, not oversized or over-bold text.

Footer:

- Footer text stays quiet.
- Filing / ICP / legal text uses small readable sans text.
- Footer never uses Hero or module-title typography.

## Output Format

Return the audit in this exact structure:

```md
## Typography QC Verdict

- Result: pass / needs-fix / fail
- Biggest issue:
- Scope reviewed:

## Score

| Area | Score | Reason |
|---|---:|---|
| Navigation | /10 | |
| Homepage modules | /10 | |
| Column pages | /10 | |
| Detail pages | /10 | |
| Cards and sidebars | /10 | |
| CSS token discipline | /10 | |

## Blocking Issues

1. ...

## Fix List

| File / selector | Problem | Required fix |
|---|---|---|

## Token Mapping

List which selectors should use which `--gl-type-*` and `--gl-weight-*` tokens.

## Closeout Evidence Required

- Desktop screenshots needed:
- Commands to run:
- Remaining risks:
```

## Pass Criteria

Mark `pass` only when:

- No ordinary page uses Hero-scale type outside homepage Hero.
- Navigation is consistent across public pages.
- Column page H1 and detail page H1 follow fixed tiers.
- Cards, sidebars, labels, and footer are visually subordinate.
- CSS uses project tokens or values that exactly match the position guidelines.
- Screenshots show a clear hierarchy at a glance.

Mark `needs-fix` when issues are local and concrete.

Mark `fail` when the page hierarchy is structurally wrong, typography is dominated by arbitrary `clamp()` / `vw`, or multiple page positions compete for the same visual level.

## Constraints

- Do not invent a new typography system.
- Do not change brand fonts.
- Do not use mobile-specific rules as desktop justification.
- Do not approve a page just because it looks visually attractive; it must follow the position hierarchy.
- Do not require mobile screenshots unless the task explicitly makes mobile a hard gate.
