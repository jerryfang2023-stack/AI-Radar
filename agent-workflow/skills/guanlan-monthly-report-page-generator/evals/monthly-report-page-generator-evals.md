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

4. Table readability
   - Pass when all monthly tables have designed styling, emphasized first column, restrained row bands, and readable cell spacing.
   - Pass when tables become card-like blocks on mobile and have no horizontal overflow at 390px.

5. Appendix handling
   - Pass when data boundary, method boundary, and evidence limitations appear in a compressed final appendix unless explicitly requested in the hero.

6. Report-center wiring
   - Pass when `reports.html` includes a monthly entry.
   - Pass when `intelligence-map.html` presents weekly and monthly reports as subcolumns under `Reports / 报告中心`.

7. Validation
   - Pass when Playwright smoke confirms page load, no console errors, and no mobile overflow.
   - Pass when `node agent-workflow/tools/frontstage-regression-gate.mjs` passes.

## Fail Cases

1. Fail if the monthly detail page is a Markdown dump or summary-only page.
2. Fail if tables use raw unstyled grid presentation.
3. Fail if method/data-boundary blocks dominate the first viewport without user request.
4. Fail if visible backend fields, version cards, route/debug fields, or unnecessary helper copy appear in the frontstage.
5. Fail if user-deleted elements return without explicit instruction.
6. Fail if report-center actions duplicate each other or fight with the time-window selector.
7. Fail if the page has horizontal overflow at 390px mobile width.
8. Fail if a skill update is made but `.skill-store` sync and registry rebuild are skipped.
