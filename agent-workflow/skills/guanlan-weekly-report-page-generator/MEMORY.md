# Weekly Report Page Generator Memory

## 2026-07-17

- Weekly detail pages are part of the unified V4 frontstage. They use `data-center-v4.css`, the shared Data Center / Application Center sidebar, and `v4-report-shell.js`; the retired V3 topbar and column links must not return.
- `intelligence-map.html` is the only Industry Reports entrance. `reports.html` is a compatibility redirect.

## 2026-06-16

- User preference: weekly report pages should feel like edited business newsletters, not backend reports or Markdown exports. Use modular editorial layouts, scan-friendly cards, tags, chains, score bars, and concise callouts.
- User-deleted elements must stay deleted unless explicitly requested again: explanatory subtitle under Reports Center weekly report, detail-page hero deck paragraph, `返回周报列表`, `返回情报地图`, `查看行动结论`, visible `日期 / 范围 / 版本` cards, backend version/method/footer text, Trend Candidates, and History blocks.
- User does not want raw table presentation, duplicate heading numbers, static time-window text, or fixed weekly templates. Preserve a time-window selector, keep section 7 as the stable watchlist anchor, and let other weekly modules flex with the issue.
