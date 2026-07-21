# Monthly Report Page Generator Evals

## Pass Cases

1. Source discipline
   - Pass when the page is generated from a monthly Markdown file under `01-SiteV2/content/08-report/monthly/`.
   - Pass when the monthly content-writing skill remains responsible for report judgment.

2. Full report rendering
   - Pass when the detail page contains the complete report body: structure judgment, structure map, trend adjudication, trend-chain judgment, opportunity map, contradictions, verification list, conclusion, and appendix.
   - Pass when the page does not collapse the report into a brief overview.

3. Visual reading experience
   - Pass when longform sections have visible hierarchy, section labels, heading ornaments, and readable paragraph rhythm.
   - Pass when charts, matrices, cards, and lists are used where they clarify the report.
   - Pass when the monthly hero is clean: no unnecessary helper subtitle, no explanatory deck copy, and the desktop title uses enough width to stay on one line when practical.

4. Table readability
   - Pass when all monthly tables have designed styling, emphasized first column, restrained row bands, and readable cell spacing.
   - Pass when tables become card-like blocks on mobile and have no horizontal overflow at 390px.

5. Appendix handling
   - Pass when data boundary, method boundary, and evidence limitations appear in a compressed final appendix unless explicitly requested in the hero.

6. Report-center wiring
   - Pass when `reports.html` redirects to `intelligence-map.html`.
   - Pass when `intelligence-map.html` presents weekly and monthly reports as subcolumns in the Industry Reports entry.
   - Pass when the latest monthly feature title, reporting window, and route are derived from the newest published canonical monthly source on every weekly or monthly renderer run.
   - Pass when monthly detail pages use the V4 sidebar and do not reference retired V3 column routes or assets.
   - Pass when the Reports Center landing page and monthly detail page use `REPORTS-V1.0.0-periodic-report-center`, and neither page emits the Opportunity Map version.

7. Validation
   - Pass when Playwright smoke confirms page load, no console errors, and no mobile overflow.
   - Pass when `node agent-workflow/tools/frontstage-regression-gate.mjs` passes.

8. Content gate prerequisite
   - Pass when `assert-periodic-report-content.mjs` has accepted the previous calendar month's report before page generation starts.
   - Pass when a failed content gate leaves monthly frontstage files unchanged.

## Fail Cases

1. Fail if the monthly detail page is a Markdown dump or summary-only page.
2. Fail if tables use raw unstyled grid presentation.
3. Fail if method/data-boundary blocks dominate the first viewport without user request.
4. Fail if visible backend fields, version cards, route/debug fields, unnecessary helper copy, or user-deleted hero helper subtitles appear in the frontstage.
5. Fail if user-deleted elements return without explicit instruction.
6. Fail if Industry Reports actions duplicate each other or fight with the time-window selector.
7. Fail if the page has horizontal overflow at 390px mobile width.
8. Fail if a skill update is made but `.skill-store` sync and registry rebuild are skipped.
9. Fail if page generation runs before the content acceptance gate.
10. Fail if a monthly report page restores shared `IMAP-V2.1.0` metadata or emits `OMAP-V1.0.0-independent-column`.
11. Fail if a newly published monthly source leaves the Reports Center first-screen card on an older month or requires a manual HTML edit.
