# Good Monthly Report Page

A good monthly report page:

- uses `01-SiteV2/content/08-report/monthly/YYYY-MM-DD--monthly-report--...md` as the content source;
- shows the full monthly argument, not just a teaser;
- places the core monthly judgment in the hero;
- moves data/method boundary notes to a final appendix;
- renders structure maps and trend adjudication tables as designed report tables;
- uses charts, matrices, cards, and longform blocks to improve reading;
- includes a monthly entry in `reports.html`;
- keeps the Intelligence Map report area split into monthly and weekly subcolumns;
- validates desktop and mobile locally before handoff.

Example user request:

> 用最新月报生成详情页，并接入报告中心，本地确认。

Expected behavior:

1. Read the monthly report Markdown.
2. Read `context/02-vi-style.md` and `context/frontstage-page-contracts.md`.
3. Build or update the monthly detail HTML and `reports.css`.
4. Update report-center links.
5. Run Playwright smoke and frontstage regression.
