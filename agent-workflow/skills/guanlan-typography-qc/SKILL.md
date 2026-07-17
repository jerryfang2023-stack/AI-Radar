---
name: guanlan-typography-qc
description: Audit WaveSight AI / Guanlan current V4 frontstage typography against the current VI and position-level rules. Use when reviewing or fixing font size, weight, line-height, title hierarchy, V4 sidebar/header typography, Data Center, Industry Reports, report details, Dashboard, cards, tables, sidebars, footer text, CSS clamp/vw risks, or closeout typography evidence.
metadata:
  guanlan:
    version: "1.0.1"
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

Use this skill to review whether a WaveSight AI page follows the project typography system. This skill does not redesign the page and does not rewrite copy. It finds typography, hierarchy, and position problems, then gives concrete fixes.

## Required Sources

Read these files before judging a page:

1. `context/02-vi-style.md`
2. `context/frontstage-page-contracts.md`
3. `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
4. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
5. `docs/brand/wavesight-ai-vi/brand-tokens.css`

If reviewing visible pages, also inspect:

- `01-SiteV2/site/assets/data-center-v4.css`
- `01-SiteV2/site/assets/data-center-v4.js`
- `01-SiteV2/site/assets/reports.css`
- `01-SiteV2/site/assets/v4-report-shell.js`
- Desktop screenshots or browser-rendered pages

For regression prevention, read `evals/typography-qc-evals.md` when auditing, repairing, or updating this skill. When checking visible regressions, also read `examples/good-typography-check.md` and `examples/bad-vw-clamp.md`.

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

Homepage / shell entry:

- Only Hero H1 may use the largest type.
- Section titles must not become Hero titles.
- Data Center and Application Center entries must keep their own hierarchy.
- Main card may be stronger than list cards, but must remain below page Hero.

Current frontstage pages:

- Data Center uses `01-SiteV2/site/data-center.html` for events, viewpoints, community, and index views.
- Industry Reports uses `01-SiteV2/site/intelligence-map.html` and V4 weekly / monthly detail pages.
- Dashboard uses `01-SiteV2/site/operations-console.html`.
- All public Data Center and report pages must share the V4 logo header and Data Center / Application Center sidebar hierarchy.
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
