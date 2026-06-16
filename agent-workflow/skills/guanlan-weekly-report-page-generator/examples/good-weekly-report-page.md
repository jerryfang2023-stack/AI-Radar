# Good Weekly Report Page Pattern

User asks: “根据 `01-SiteV2/content/08-report/2026-06-15--weekly-report--ai-business-change-radar.md` 生成本周周报页面。”

Good output:

- `intelligence-map.html` keeps the relationship network first.
- The weekly report entry appears below the network with a time selector.
- The weekly card title is content-derived.
- Evidence counts are tags.
- The read button is the right-side centered card action.
- The detail page has:
  - H1 from report title;
  - time-window selector;
  - fast-read module;
  - action judgment module;
  - ranked trend cards;
  - trend-chain cards;
  - impact cards;
  - opportunity profile cards and score bars;
  - categorized watchlist cards;
  - data scope appendix.
- The detail page has no raw `<table>` elements.
- `meta[name="weekly-report-source"]` points to `01-SiteV2/content/08-report/`.

Why it passes: it converts the weekly report into a frontstage reading experience while preserving source path, version metadata, and Guanlan visual language.
