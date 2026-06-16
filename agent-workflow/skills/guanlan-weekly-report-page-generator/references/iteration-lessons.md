# 2026-06-15 Weekly Page Iteration Lessons

## Good Changes To Preserve

- Weekly report belongs under the relationship network on Intelligence Map, not in the first viewport.
- The time window should be a selector on both Intelligence Map and detail page.
- Counts should be tags under the judgment summary, not three KPI boxes.
- The detail title should be content-derived: `AI 从工具试用转向业务流程重构`, not generic.
- The detail page should start with fast read and action judgment modules.
- Data scope works better as an evidence appendix near the end.
- Trend heatmap works better as ranked cards.
- Trend chains work better as chain cards with five nodes.
- Impact heatmap works better as impact cards plus a process strip.
- Opportunity cards work better as profile cards plus score bars.
- Watchlist works better as categorized cards with tags.
- Section labels should be small inline chapter marks paired with headings.
- The Intelligence Map read button should be vertically centered as the card action.

## Bad Patterns To Avoid

- Do not place weekly report in the first viewport of Intelligence Map.
- Do not show static time text when future switching is needed.
- Do not expose `日期 / 范围 / 版本` cards on the detail hero.
- Do not keep “返回情报地图” or “查看行动结论” buttons unless the user asks.
- Do not keep “返回周报列表” inside the fast-read module.
- Do not use a long hero deck if the page already has fast-read modules.
- Do not duplicate numbering as `01` plus `1. 标题`.
- Do not render Markdown tables directly on the frontstage page.
- Do not make all weekly sections fixed. Section 7 can stay stable; other modules should follow the issue content.
- Do not keep Trend Candidates or History blocks in Intelligence Map after weekly report adoption.
- Do not leave backend method/version strings in the visible page footer.
- Do not leave section labels as isolated full-width rows; pair them visually with the title.
- Do not detach the Intelligence Map weekly read action from the card's main action position.

## User-Deleted Elements

These items were removed through direct user feedback and should not return by default:

- Intelligence Map weekly report description sentence under `每周周报`.
- Three boxed count KPI cards; use inline tags instead.
- Detail page hero deck paragraph under the H1.
- Detail page right-side `日期 / 范围 / 版本` metadata blocks.
- Detail page buttons `返回情报地图`, `查看行动结论`, and `返回周报列表`.
- Visible backend report version / method / next-issue footer.
- Raw tables for trend heatmap, impact heatmap, opportunity fields, and scoring detail.
- Trend Candidates and History modules on Intelligence Map.

## User Presentation Preferences

- Prefer content-derived titles over generic report labels.
- Prefer compact tags over KPI boxes.
- Prefer selectors over static time-window text.
- Prefer editorial cards, chains, watchlist tags, profile blocks, and score bars over tables.
- Prefer flexible weekly modules; section 7 can remain stable, but the rest should follow the week's content.
- Prefer small inline chapter marks paired with headings.

## Release Lessons

- Define both main site version and Intelligence Map column version.
- Use:
  - `SITE-V3.3.7-weekly-report-intelligence-map`
  - `IMAP-V1.1.0-weekly-report`
- Add `weekly-report-source` meta pointing to `01-SiteV2/content/08-report/`.
- Cache-bust CSS when visual iteration is being reviewed in browser.
- After updating project skills, sync `.skill-store` and rebuild `agent-workflow/skills/skill-registry.md`.
