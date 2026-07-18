# Weekly Report Page Iteration Lessons

This file keeps only presentation lessons that remain compatible with `REPORTS-V1.0.0-periodic-report-center`. Earlier Intelligence Map and relationship-network placement rules are retired.

## Preserve

- Use the accepted evidence-bounded headline unchanged in the H1, browser title, and Industry Reports card.
- Keep time-window selection on the Industry Reports entry and report detail page.
- Use compact tags instead of boxed KPI cards.
- Render evidence and report sections as readable editorial modules rather than raw Markdown tables.
- Keep data scope and method details in a restrained evidence appendix.
- Keep responsive layouts free of horizontal overflow.
- Keep the report read action attached to its card.

## Do Not Restore

- Opportunity Map matrices, Relation Paths, relationship networks, Trend Candidates, or History blocks on `intelligence-map.html`.
- Shared IMAP metadata or `OMAP-V1.0.0-independent-column` on report pages.
- V3 top navigation, retired return buttons, backend method/version footers, duplicate numbered headings, or long hero decks.
- DeepSeek editing HTML, navigation, CSS, or version metadata.

## Release Boundary

- Main site metadata remains `SITE-V4.2.0-entity-history`.
- Industry Reports and report details use `REPORTS-V1.0.0-periodic-report-center`.
- Opportunity Map is independent and uses `OMAP-V1.0.0-independent-column` only on `opportunity-map.html`.
- After project Skill changes, sync `.skill-store`, rebuild the Skill Registry/dashboard, and run the frontstage regression gate.
