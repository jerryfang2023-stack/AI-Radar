---
name: guanlan-monthly-report-page-generator
description: Use when creating, updating, or repairing WaveSight AI monthly report frontstage pages from `01-SiteV2/content/12-applications/industry-reports/monthly/`. Applies to monthly report detail pages, Guanlan Research monthly entries and wiring, Guanlan VI page styling, longform report layout, charts/tables/visual modules, and responsive local validation. Do not use for writing the monthly report judgment itself; use `guanlan-monthly-business-structure-report` first.
metadata:
  guanlan:
    version: "1.2.0"
    column_version: "REPORTS-V1.2.0-research-hub"
    lane: "Guanlan Research"
    status: "current sub-skill"
    order: 96
    responsibility: "Generate and maintain monthly report frontstage pages from accepted monthly report Markdown under Guanlan Research."
    upstream: "accepted monthly report Markdown, Guanlan Research page, Guanlan VI rules"
    downstream: "monthly report detail page, Guanlan Research monthly entry, page styles, REPORTS version metadata"
    gates: "content acceptance, content-source discipline, REPORTS version boundary, full-report rendering, Guanlan VI fit, table readability, responsive visual smoke, frontstage regression, skill self-iteration"
    recent_learning: "Monthly detail pages must show the full report with rich visual reading structure; the content gate must pass before the deterministic renderer writes HTML; generated pages and research-hub wiring use REPORTS-V1.2.0, while Opportunity Map remains an unlisted internal lab."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Monthly Report Page Generator

## Purpose

Turn an accepted monthly report Markdown file into a WaveSight Guanlan Research reading experience. This skill handles page structure, research-hub wiring, visual modules, table treatment, responsive validation, and iterative skill hygiene. It does not decide the monthly business judgment or own Opportunity Map.

The periodic controller may invoke this skill only after the monthly content acceptance gate passes. Page generation and page regression are the second gate; a failed content gate must leave the frontstage unchanged.

In unattended GitHub production, `render-periodic-report-pages.mjs` is the sole page writer. DeepSeek generates Markdown content only and must never edit HTML, navigation, CSS, or canonical data.

## Required Reads

Read only what the task needs:

1. `context/version-ledger.md`
2. `context/frontstage-page-contracts.md`
3. `context/02-vi-style.md`
4. Source report under `01-SiteV2/content/12-applications/industry-reports/monthly/`
5. Target files:
   - `01-SiteV2/site/intelligence-map.html`
   - `01-SiteV2/site/monthly-*.html`
   - `01-SiteV2/site/assets/reports.css`
   - `01-SiteV2/site/assets/data-center-v4.css`
   - `01-SiteV2/site/assets/v4-report-shell.js`

For detailed rules, load:

- `references/page-generation-standards.md` before page work.
- `MEMORY.md` before changing visible layout, tables, hero, Guanlan Research entries, or appendix handling.
- `evals/monthly-report-page-generator-evals.md` before final validation.

## Workflow

1. Confirm source.
   - Use the monthly report Markdown under `01-SiteV2/content/12-applications/industry-reports/monthly/`.
   - If no accepted monthly report exists, stop and use `guanlan-monthly-business-structure-report` first.

2. Run the content gate and deterministic writer.
   - Run `node agent-workflow/tools/assert-periodic-report-content.mjs --kind=monthly --date=YYYY-MM-DD --window-start=YYYY-MM-DD --window-end=YYYY-MM-DD`.
   - Only after it passes, run `node agent-workflow/tools/render-periodic-report-pages.mjs --kind=monthly --date=YYYY-MM-DD`.
   - Inspect and adjust the renderer or shared styles when repair is needed; do not hand-maintain generated report HTML.

3. Verify extracted page fields.
   - Use the report title, date, month window, core judgment, section headings, tables, opportunity cards, and verification list.
   - Preserve the report's full argument structure. Do not reduce the page to a summary or landing page.

4. Verify the generated Guanlan Research wiring.
   - Use `intelligence-map.html` as the only Guanlan Research entrance; `reports.html` remains a compatibility redirect.
   - Show monthly and weekly reports as subcolumns in its report-first area.
   - Keep Guanlan Research links compact; avoid duplicate standalone buttons when the time selector already occupies the action area.
   - Write `REPORTS-V1.2.0-research-hub` into the landing page and monthly detail metadata. Never emit the Opportunity Map column version from this Skill.

5. Verify the generated monthly detail page.
   - Use the same V4 logo header, Data Center / Application Center sidebar, and mobile sidebar behavior as the Data Center and Guanlan Research pages.
   - Use Guanlan VI: paper background, serif editorial headings, mono labels, blue/gold accents, restrained borders, and stable reading width.
   - Render the complete report with multiple formats: longform blocks, trend chains, charts, radar/bar visuals, opportunity matrices, designed tables, lists, and appendix.
   - Keep nonessential data-boundary and method notes compressed in the appendix.
   - Make page typography comfortable: visible hierarchy, heading ornaments, numbered longform blocks, readable paragraphs, and no cramped tables.
   - Keep the hero clean: do not add report-type helper subtitles, explanatory deck copy, or meta notes when the title and core statement already carry the page context.
   - On desktop, give the monthly title enough width and tune typography so the accepted title can stay on one line when practical; allow natural wrapping on mobile.

6. Treat tables as editorial modules.
   - Style every table for reading: clear header weight, emphasized first column, light row bands, restrained borders, status color where useful, and mobile card conversion.
   - Do not leave raw Markdown-table styling on monthly detail pages.

7. Validate locally.
   - Run syntax checks for touched JS if any.
   - Use Playwright visual smoke on desktop and mobile for the detail page and Guanlan Research entry.
   - Run `node agent-workflow/tools/frontstage-regression-gate.mjs`.
   - Confirm no mobile horizontal overflow and no console errors.
   - Confirm the Guanlan Research landing page and every generated monthly detail use the current REPORTS version from `context/version-ledger.md`.

8. Encode repeated failures only when Skill maintenance is in scope.
   - If a user corrects a repeated monthly-page failure and requests durable prevention, update the smallest relevant `MEMORY.md`, eval, or example.
   - Do not expand a page task into Skill or compatibility-store edits without that authorization.

## Hard Rules

- The monthly page is a complete report-reading surface, not a summary card or Markdown dump.
- Do not expose backend-only fields unless they help reader judgment; compress method/data boundary notes into an appendix.
- Do not use raw table grids without editorial styling.
- Do not re-add user-deleted fields, helper copy, report-type subtitles, return buttons, hero stat cards, or unnecessary navigation unless explicitly requested.
- Do not create a second report navigation or restore retired V3 navigation above the Guanlan Research content.
- Do not restore `wavesight-nav.css`, `wavesight-topbar`, or links to the retired V3 column pages.
- Do not restore the shared `IMAP-V2.1.0` metadata or write the Opportunity Map version into report pages.
- Local rendering and visual checks are safe within an authorized page task. Commit, PR, merge, deployment, or reintroducing user-deleted UI requires the requested release workflow or explicit approval.

## Output

When finished, report:

- source monthly report file used;
- pages and styles changed;
- Guanlan Research wiring changed;
- validation performed;
- skill memory/eval/example updates, if any;
- remaining page-generation risk.

## Done When

Finish when the full accepted monthly argument is rendered through the deterministic writer, Research wiring/version metadata are current, tables and longform modules remain readable on desktop/mobile, no retired UI returns, and content, syntax, visual, and frontstage checks pass.
