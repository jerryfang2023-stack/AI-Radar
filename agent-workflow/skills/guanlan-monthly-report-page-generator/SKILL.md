---
name: guanlan-monthly-report-page-generator
description: Use when creating, updating, or repairing WaveSight AI monthly report frontstage pages from `01-SiteV2/content/08-report/monthly/`. Applies to monthly report detail pages, Industry Reports monthly entries and wiring, Guanlan VI page styling, longform report layout, charts/tables/visual modules, and responsive local validation. Do not use for writing the monthly report judgment itself; use `guanlan-monthly-business-structure-report` first.
metadata:
  guanlan:
    version: "1.0.1"
    lane: "Industry Reports"
    status: "current sub-skill"
    order: 96
    responsibility: "Generate and maintain monthly report frontstage pages from accepted monthly report Markdown."
    upstream: "monthly report Markdown, Industry Reports page, Guanlan VI rules"
    downstream: "monthly report detail page, Industry Reports monthly entry, page styles, version metadata"
    gates: "content-source discipline, full-report rendering, Guanlan VI fit, table readability, responsive visual smoke, frontstage regression, skill self-iteration"
    recent_learning: "Monthly detail pages must show the full report with rich visual reading structure; nonessential data-boundary fields should be compressed into the appendix, hero helper copy should be removed when the title and core statement already explain the page, and all tables need editorial styling rather than raw grid rendering."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Monthly Report Page Generator

## Purpose

Turn an accepted monthly report Markdown file into a WaveSight frontstage reading experience. This skill handles page structure, Industry Reports wiring, visual modules, table treatment, responsive validation, and iterative skill hygiene. It does not decide the monthly business judgment.

## Required Reads

Read only what the task needs:

1. `context/version-ledger.md`
2. `context/frontstage-page-contracts.md`
3. `context/02-vi-style.md`
4. Source report under `01-SiteV2/content/08-report/monthly/`
5. Target files:
   - `01-SiteV2/site/intelligence-map.html`
   - `01-SiteV2/site/monthly-*.html`
   - `01-SiteV2/site/assets/reports.css`
   - `01-SiteV2/site/assets/data-center-v4.css`
   - `01-SiteV2/site/assets/v4-report-shell.js`

For detailed rules, load:

- `references/page-generation-standards.md` before page work.
- `MEMORY.md` before changing visible layout, tables, hero, Industry Reports entries, or appendix handling.
- `evals/monthly-report-page-generator-evals.md` before final validation.

## Workflow

1. Confirm source.
   - Use the monthly report Markdown under `01-SiteV2/content/08-report/monthly/`.
   - If no accepted monthly report exists, stop and use `guanlan-monthly-business-structure-report` first.

2. Extract page fields.
   - Use the report title, date, month window, core judgment, section headings, tables, opportunity cards, and verification list.
   - Preserve the report's full argument structure. Do not reduce the page to a summary or landing page.

3. Build or update Industry Reports wiring.
   - Use `intelligence-map.html` as the only Industry Reports entrance; `reports.html` remains a compatibility redirect.
   - Show monthly and weekly reports as subcolumns in its report-first area.
   - Keep Industry Reports links compact; avoid duplicate standalone buttons when the time selector already occupies the action area.

4. Build the monthly detail page.
   - Use the same V4 logo header, Data Center / Application Center sidebar, and mobile sidebar behavior as the Data Center and Industry Reports pages.
   - Use Guanlan VI: paper background, serif editorial headings, mono labels, blue/gold accents, restrained borders, and stable reading width.
   - Render the complete report with multiple formats: longform blocks, trend chains, charts, radar/bar visuals, opportunity matrices, designed tables, lists, and appendix.
   - Keep nonessential data-boundary and method notes compressed in the appendix.
   - Make page typography comfortable: visible hierarchy, heading ornaments, numbered longform blocks, readable paragraphs, and no cramped tables.
   - Keep the hero clean: do not add report-type helper subtitles, explanatory deck copy, or meta notes when the title and core statement already carry the page context.
   - On desktop, give the monthly title enough width and tune typography so the accepted title can stay on one line when practical; allow natural wrapping on mobile.

5. Treat tables as editorial modules.
   - Style every table for reading: clear header weight, emphasized first column, light row bands, restrained borders, status color where useful, and mobile card conversion.
   - Do not leave raw Markdown-table styling on monthly detail pages.

6. Validate locally.
   - Run syntax checks for touched JS if any.
   - Use Playwright visual smoke on desktop and mobile for the detail page and Industry Reports entry.
   - Run `node agent-workflow/tools/frontstage-regression-gate.mjs`.
   - Confirm no mobile horizontal overflow and no console errors.

7. Self-iterate the skill.
   - If a user corrects a repeated monthly-page failure, update `MEMORY.md`, `evals/`, or `examples/` before adding long prose.
   - After skill edits, run skill validation, sync `.skill-store`, and rebuild `agent-workflow/skills/skill-registry.md`.

## Hard Rules

- The monthly page is a complete report-reading surface, not a summary card or Markdown dump.
- Do not expose backend-only fields unless they help reader judgment; compress method/data boundary notes into an appendix.
- Do not use raw table grids without editorial styling.
- Do not re-add user-deleted fields, helper copy, report-type subtitles, return buttons, hero stat cards, or unnecessary navigation unless explicitly requested.
- Do not create a second report navigation or restore retired V3 navigation above the Industry Reports content.
- Do not restore `wavesight-nav.css`, `wavesight-topbar`, or links to the retired V3 column pages.

## Output

When finished, report:

- source monthly report file used;
- pages and styles changed;
- Industry Reports wiring changed;
- validation performed;
- skill memory/eval/example updates, if any;
- remaining page-generation risk.
