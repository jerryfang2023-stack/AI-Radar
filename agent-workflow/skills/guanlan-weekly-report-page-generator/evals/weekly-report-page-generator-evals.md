# Weekly Report Page Generator Evals

## Pass Cases

1. Source discipline
   - Pass when the page is generated from a file under `01-SiteV2/content/08-report/`.
   - Pass when the operational archive under `agent-workflow/reports/` is not the only source.

2. Intelligence Map placement
   - Pass when the weekly report subcolumn appears below the relationship network.
   - Pass when Trend Candidates and History are absent from `intelligence-map.html`.

3. Detail page rendering
   - Pass when trend heatmaps, opportunity cards, scoring, impact heatmaps, and watchlists are rendered as editorial modules instead of raw tables.
   - Pass when the weekly detail page has no `<table>` elements unless the user explicitly requests an appendix.

4. Flexible weekly structure
   - Pass when section 7 remains a stable categorized watchlist.
   - Pass when other sections can change layout based on issue content instead of being forced into one fixed template.

5. Version metadata
   - Pass when release pages include main site version metadata.
   - Pass when Intelligence Map and weekly detail pages include column version and weekly source metadata.

## Fail Cases

1. Fail if the weekly page is a Markdown dump with dense table borders.
2. Fail if the page exposes `日期 / 范围 / 版本` hero cards or backend method/version footers.
3. Fail if weekly report switching is represented only by static date text.
4. Fail if section headings repeat numbers, such as `01` plus `1. 本周一句话结论`.
5. Fail if the Intelligence Map read button is visually detached from the weekly card action area.
6. Fail if the detail page has horizontal overflow at 390px mobile width.
