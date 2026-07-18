---
name: guanlan-weekly-report-page-generator
description: Use when creating, updating, or repairing WaveSight AI weekly report frontstage pages from `01-SiteV2/content/08-report/`. Applies to Industry Reports weekly entries, weekly report detail pages, time-window selectors, report archive wiring, Guanlan VI page styling, and converting weekly report Markdown into editorial page modules. Do not use for writing the weekly report judgment itself; use `guanlan-weekly-business-change-radar` first.
metadata:
  guanlan:
    version: "1.1.1"
    column_version: "REPORTS-V1.0.0-periodic-report-center"
    lane: "Reports Center"
    status: "current sub-skill"
    order: 91
    responsibility: "Generate and maintain weekly report frontstage pages from accepted content under the independent Reports Center version."
    upstream: "accepted weekly report Markdown, Reports Center page, Guanlan VI rules"
    downstream: "weekly report detail page, Reports Center weekly entry, page styles, REPORTS version metadata"
    gates: "content acceptance, content-source discipline, REPORTS version boundary, user preference memory, Guanlan VI fit, no table-heavy rendering, responsive visual smoke, frontstage regression"
    recent_learning: "Use the accepted evidence-bounded headline unchanged across the H1, browser title, and Reports Center card; the content gate must pass before the deterministic renderer writes HTML; generated report pages use REPORTS-V1.0.0 while Opportunity Map remains an independent OMAP application."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Weekly Report Page Generator

## Purpose

Turn accepted weekly report Markdown into a WaveSight Reports Center experience. This skill handles page structure, visual modules, report-center wiring, version metadata, and validation. It does not decide the weekly business judgment or own Opportunity Map.

The periodic controller may invoke this skill only after the weekly content acceptance gate passes. Page generation and page regression are the second gate; a failed content gate must leave the frontstage unchanged.

In unattended GitHub production, `render-periodic-report-pages.mjs` is the sole page writer. DeepSeek generates Markdown content only and must never edit HTML, navigation, CSS, or canonical data.

## Required Reads

Read only what the task needs:

1. `context/version-ledger.md`
2. `context/frontstage-page-contracts.md`
3. `context/02-vi-style.md`
4. Source report in `01-SiteV2/content/08-report/`
5. Target files:
   - `01-SiteV2/site/intelligence-map.html`
   - `01-SiteV2/site/weekly-ai-business-change-radar.html` or the new weekly detail page
   - `01-SiteV2/site/assets/weekly-report.css`
   - `01-SiteV2/site/assets/data-center-v4.css`
   - `01-SiteV2/site/assets/v4-report-shell.js`

For detailed rules, load:

- `references/page-generation-standards.md` before page work.
- `references/iteration-lessons.md` when deciding what to preserve or avoid from the 2026-06-15 page iteration.
- `MEMORY.md` before changing page layout, visible controls, or module rendering.

## Workflow

1. Confirm source.
   - Use `01-SiteV2/content/08-report/` as the weekly report content source.
   - Do not generate future pages directly from `agent-workflow/reports/` unless also writing the content copy into `content/08-report/`.

2. Extract page fields.
   - Use frontmatter `title`, `date`, `week`, `window`, `slug`, and `content_type`.
   - Generate the visible title from the report content, not from a generic label such as “本周 AI 商业变化判断”.
   - Preserve the time window as a selector on both the Industry Reports entry (`intelligence-map.html`) and detail page.

3. Build the Industry Reports entry.
   - Keep weekly reports in the Industry Reports area of `intelligence-map.html`.
   - `reports.html` is a compatibility redirect only and must not become a second report center.
   - Do not push relation paths or decorative graph modules above the report-first entry.
   - Do not restore Trend Candidates or History modules on the Industry Reports page.
   - Show report counts as compact tags, not boxed KPI cards.

4. Build the detail page.
   - Use the same V4 logo header, Data Center / Application Center sidebar, and mobile sidebar behavior as `data-center.html` and `intelligence-map.html`.
   - Use Guanlan VI: restrained paper background, serif editorial headings, mono labels, blue/gold accents, square or low-radius panels.
   - Convert Markdown tables into designed modules: cards, tag groups, chains, score bars, callouts, or lists.
   - Keep section 7 as a stable watchlist structure. Let other sections flex with the issue content.
   - Avoid visible instructions, backend fields, version cards, or unnecessary navigation buttons.
   - Treat user-deleted elements as blocked unless the user explicitly reintroduces them.

5. Update version metadata when releasing.
   - Main site version lives in `meta[name="wavesight-version"]` and must match the current public website version in `context/version-ledger.md` (`SITE-V4.2.0-entity-history` for this release).
   - Reports Center column version lives in `meta[name="wavesight-column-version"]` and must be `REPORTS-V1.0.0-periodic-report-center` for this release.
   - Weekly source path lives in `meta[name="weekly-report-source"]`.
   - Update `context/version-ledger.md` only for accepted release changes.
   - Never emit `OMAP-V1.0.0-independent-column` from weekly report pages; that version belongs only to Opportunity Map.

6. Validate.
   - Run syntax checks for touched JS if any.
   - Run `node agent-workflow/tools/frontstage-regression-gate.mjs`.
   - Use Playwright visual smoke on desktop and mobile for the Industry Reports entry and weekly detail page.
   - Check there are no `<table>` elements on the weekly detail page unless the user explicitly asks for a raw data appendix.

## Hard Rules

- The weekly report page is a frontstage product surface, not a Markdown dump.
- The page should support future weekly switching through selectors.
- Do not expose backend-only fields such as version, method, range, thresholds, raw gate results, or internal scores unless explicitly needed for reader judgment.
- Do not make every week fit the same fixed module template. Keep the rendering flexible except for the watchlist anchor.
- Do not use table grids as the default rendering for trend heatmaps, opportunity cards, scoring, or watchlists.
- Do not re-add previously deleted helper copy, return buttons, action-jump buttons, hero deck paragraphs, or static date text without explicit user approval.
- Do not restore `wavesight-nav.css`, `wavesight-topbar`, or links to the retired V3 column pages.
- Do not restore the shared `IMAP-V2.1.0` metadata or write the Opportunity Map version into report pages.

## Output

When finished, report:

- source report file used;
- pages and styles changed;
- version metadata changed, if any;
- validation performed;
- remaining page-generation risk.
