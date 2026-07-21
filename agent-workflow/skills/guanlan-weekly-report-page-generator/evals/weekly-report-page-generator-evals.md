# Weekly Report Page Generator Evals

## Pass Cases

1. Source discipline
   - Pass when the page is generated from a file under `01-SiteV2/content/08-report/`.
   - Pass when the operational archive under `agent-workflow/reports/` is not the only source.

2. Reports Center placement
   - Pass when the latest weekly report and weekly archive appear in the report-first `intelligence-map.html` surface.
   - Pass when the latest weekly feature title, reporting window, and route are derived from the newest published canonical weekly source on every renderer run.
   - Pass when Opportunity Map, relationship network, Trend Candidates, and History are absent from `intelligence-map.html`.

3. Detail page rendering
   - Pass when trend heatmaps, opportunity cards, scoring, impact heatmaps, and watchlists are rendered as editorial modules instead of raw tables.
   - Pass when the two latest accepted issues have independent dated detail pages and the undated alias resolves only to the newest issue.
   - Pass when the weekly detail page has no `<table>` elements unless the user explicitly requests an appendix.
   - Pass when section labels are visually paired with headings and do not create isolated full-width label rows.

4. Flexible weekly structure
   - Pass when section 7 remains a stable categorized watchlist.
   - Pass when other sections can change layout based on issue content instead of being forced into one fixed template.

5. Version metadata
   - Pass when release pages include main site version metadata.
   - Pass when Reports Center and weekly detail pages include `REPORTS-V1.0.0-periodic-report-center` plus weekly source metadata, and do not emit the Opportunity Map version.

6. User preference memory
   - Pass when user-deleted elements are absent unless the current user request explicitly reintroduces them.
   - Pass when time windows are selectors, not static text, on review-facing pages.

7. Content gate prerequisite
   - Pass when `assert-periodic-report-content.mjs` has accepted the exact previous Monday-Sunday report before page generation starts.
   - Pass when a failed content gate leaves weekly frontstage files unchanged.

## Fail Cases

1. Fail if the weekly page is a Markdown dump with dense table borders.
2. Fail if the page exposes `日期 / 范围 / 版本` hero cards or backend method/version footers.
3. Fail if weekly report switching is represented only by static date text.
4. Fail if section headings repeat numbers, such as `01` plus `1. 本周一句话结论`.
5. Fail if the Industry Reports read button is visually detached from the weekly card action area.
6. Fail if the detail page has horizontal overflow at 390px mobile width.
7. Fail if `返回周报列表`, `返回情报地图`, or `查看行动结论` is present without explicit user request.
8. Fail if the detail hero has a long deck paragraph after the user has asked to remove it.
9. Fail if the Industry Reports weekly entry shows three boxed KPI count cards instead of compact tags.
10. Fail if page generation runs before the content acceptance gate.
11. Fail if a weekly report page restores shared `IMAP-V2.1.0` metadata or emits `OMAP-V1.0.0-independent-column`.
12. Fail if a newly published weekly source updates the archive but leaves the Reports Center first-screen card on an older issue.
13. Fail if a recent weekly issue is rendered as paragraph/list-only HTML despite having structured trend, chain, impact, opportunity, watchlist, and action sections.
