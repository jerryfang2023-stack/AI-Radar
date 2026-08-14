# Guanlan Funding Mini Program

This is the native WeChat Mini Program frontstage for Funding Insights.

## Boundaries

- Source truth remains `../01-SiteV2/site/data/funding-insights-v1.json`.
- Weekly/monthly report source truth remains `../01-SiteV2/content/12-applications/industry-reports/`.
- Run `npm run build:data` after the source projection changes. Do not hand-edit generated files under `miniprogram/data/`.
- Bundled projections are the offline fallback. Runtime funding and report refreshes may read only the gated public contracts under `https://www.zkdlj.vip/data/`; reject date/version/count regressions and retain the fallback on any request or validation failure.
- Public UI may expose application-level funding facts, analysis, and source links only. It must not expose Data Center/Application Center navigation, operational fields, model provenance, internal gates, or private evidence locators.
- Missing values remain explicit. Do not infer undisclosed amounts, investors, customers, regions, or outcomes.
- The project may use `touristappid`, a WeChat test AppID, or the production AppID. Never store AppSecret or other account credentials in the repository.

## Frontstage UI contract

- Treat `../03-H5/` as the visual baseline for the first three tabs: 融资情报、生态图谱、商业观察. Keep the native Mini Program interaction model and capsule safe area.
- Those three tab pages use one shared branded header in the top safe area: the H5 horizontal logo at left, one concise four-character title centered on screen, and a fine divider below. Do not repeat English headings, dates, explanatory subtitles, or internal validation language above the primary content.
- Do not show collection controls or selection checkboxes in the financing list. Collection and selection belong to detail or dedicated management pages.
- Financing discovery is search-led: search company, institution, product, or sector; do not add industry/category chip rails, category filter buttons, or industry badges to financing-list rows.
- 生态图谱 integrates company, investor, and core-person libraries. Its bottom-tab label is 生态. Preserve the PC portal search scopes: 企业 / 产品 / 赛道, 机构 / 已投公司 / 赛道, and 人物 / 企业 / 职务. Every entity card opens its own entity profile before any financing record.
- Keep the 我的 tab independent from the first-three-tab visual sync unless a task explicitly includes it.
- The profile page has one settings entry only: keep the control beside the avatar and label it “设置”; do not duplicate it in the page header.
- Bottom navigation is text-only and reads as four connected buttons: use short, vertically centered warm-gray separators rather than full-height rules; the active cell uses a subtle champagne surface, deep-navy text, a short gold top marker, and a slightly larger/heavier label.
- Financing-list identity marks use deep navy cards with white initials and a restrained gold edge. Keep the feed compact on real phones with warm-white continuous rows and light gold-beige dividers rather than pale-gray avatar blocks or separate gray cards.
- Present the financing summary as an inset rounded navy card, consistent with the rounded overview cards used by the other columns; do not stretch it edge-to-edge as a square strip.
- The company comparison screen must let users cancel an individual company in place. Preserve remaining selections, explain when one more company is needed, and offer a direct return to financing when the comparison set is empty or incomplete.
- Do not place collection controls in the financing list header or financing-detail title bar. Keep collection as a secondary action below the detail facts, beside company comparison. The favorite growth task opens the saved-items list; do not show a follow-topic growth task without a clear follow surface.
- Financing and entity detail pages must support native WeChat forwarding and timeline sharing. A report opened directly from a shared card must show the four-column navigation and use a reliable tab fallback when no back stack exists.
- Daily check-in is a once-per-day growth task worth 5 points. Repeated taps on the same day must not award points again.
- Membership is priced at CNY 30/month, CNY 168/six months, or CNY 300/year and grants full browsing across all columns. New users receive a seven-day trial. Community activity points can redeem seven-day or thirty-day membership extensions; never present a successful payment before the WeChat Pay and account service confirm it.
- A valid first-time registration attributed to an invite rewards the inviter with 300 activity points; award it only after backend registration attribution confirms the event, and count each new user once.
- Shared invitation pages must distinguish inviter and invitee views, keep registration visible, provide a tab fallback for direct-entry users, and show server-confirmed visit, registration, and reward totals to the inviter.
- Phone authorization must exchange the one-time WeChat code through the account service immediately and return only a masked number to the Mini Program. Never persist or expose raw phone numbers, authorization codes, pending-backend copy, WeChat-ID limitations, preview/production notes, or internal privacy implementation language in the public profile UI.

## Validation

Run:

```text
npm run verify
```

The project must remain directly importable by WeChat DevTools from this directory.
