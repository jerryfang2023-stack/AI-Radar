# Guanlan Funding Mini Program

This is the native WeChat Mini Program frontstage for Funding Insights.

Current source target: 0.9.5 adds a global native-share baseline, fixes related-company entity deep links and first-time phone binding, and grants verified approved community members one idempotent 90-day Mini Program access window while synchronizing their community identity. Members without a recorded phone may create a nickname candidate, but only an administrator-confirmed server-side claim can grant identity or access; later confirmations require no Mini Program release. The last immutable uploaded release remains 0.9.4 until the 0.9.5 upload receipt is recorded. Upload is not review submission, approval, or production publication; those remain the owner's responsibility. See `docs/releases/0.9.4/README.md` for the preceding immutable source and receipt.

## Boundaries

- Source truth remains `../01-SiteV2/site/data/funding-insights-v1.json`.
- Weekly/monthly report source truth remains `../01-SiteV2/content/12-applications/industry-reports/`.
- Run `npm run build:data` after the source projection changes. Do not hand-edit generated files under `miniprogram/data/`.
- Bundled projections are the offline fallback. Runtime funding and report refreshes may read only the gated public contracts under `https://www.zkdlj.vip/data/`; reject date/version/count regressions and retain the fallback on any request or validation failure.
- Public UI may expose application-level funding facts, analysis, and source links only. It must not expose Data Center/Application Center navigation, operational fields, model provenance, internal gates, or private evidence locators.
- Missing values remain explicit. Do not infer undisclosed amounts, investors, customers, regions, or outcomes.
- The project may use `touristappid`, a WeChat test AppID, or the production AppID. Never store AppSecret or other account credentials in the repository.

## Frontstage UI contract

- 0.9.5 installs native friend/timeline sharing on every registered page. Existing detail/invitation handlers keep their specialized titles and deep links; community program, bounty, points and graph pages allowlist only their stable routing fields. Private/edit/settings pages must share a public front door and must never leak account state or authorization parameters. Related-company links from protected people/investor profiles resolve the visible company name through the Mini Program company key rather than trusting a server-side canonical relation ID, and retain a server-backed company reference when the protected profile is newer than the bundled index. A first phone binding without a local token must reuse that same one-time phone code for login. An approved existing community member linked by verified phone receives synced community identity/points and one non-renewing, idempotent 90-day access window; ordinary new users keep the seven-day rule.
- A nickname match is never proof of membership. It may create a pending claim only when the member service finds an exact normalized candidate; the existing operations admin must confirm the member mapping. The account service polls this server-side state on membership refresh, so a confirmed claim syncs identity, points, permission and the one-time 90-day window without another client release or application form.

- 0.9.4 fixes home archive/member detail navigation. Bind record IDs in WXML and build encoded query parameters in JavaScript; never put HTML-escaped query separators in navigation attributes. Regression tests must pass actual template datasets through tap handlers and target page loading. Missing detail IDs must not trigger API requests. Keep existing styles, membership gates and server data unchanged; no backend redeployment is needed for this client-only fix.

- 0.9.3 evolves from 0.9.2: ecosystem revalidates funding/report manifests on every onShow and native pull-down refresh; retain content during background requests and after failures. Do not add date/status modules or redesign its WXML/WXSS. Source check dates and disclosure dates are distinct internal fields, not user-facing hints. Weekly/monthly bodies are projected only into the server's protected content bundle; reject empty bodies in the reader and re-fetch after explicit registration.

- Mini Program 0.9.2 was uploaded on 2026-08-30 from commit `e52824573ce2bd0473e28a4e68593bc497eb654c`, evolved from online 0.8.3; upload is not review approval or production publication. Bottom tabs are 融资、生态、社群、我的; industry observation (reports/community highlights) is inside 生态. Community home shows one featured archive and up to four distinct archive rows, then a published bounty if available and member-map previews; no schedule or points strip on home.
- Production community pages use the authenticated account gateway and existing member service 1.7.0, never bundled private sharing content or demo fallback. Profile edits use revision conflict checks; editorial sharing evidence is separate and not member-editable. See `docs/REVIEW-0.9.3-COMBINED.md` for release behavior. Preserve uploaded snapshots; use the recorded exact source commit rather than an unverified working tree, and never overwrite newer remote changes with an older checkout.
- Community home uses a five-minute public-only local snapshot plus background refresh. Common protected lists use identity-scoped memory snapshots (30 seconds fresh, at most 60 seconds stale while revalidating), never persistent storage. Writes and authentication/permission failures invalidate these snapshots; full archives, personal profile forms and drafts always request the server. Repeated refreshes must not flash global loading text. Role categories sort by real visible-member counts, and supply groups use names rather than array positions.
- Management-account `admin_grant` points must not affect the community leaderboard or its point details; the separate wallet, growth level and management privileges remain unchanged.
- Treat `../03-H5/` as the historical visual baseline, not the current navigation contract. The first three bottom tabs are 融资、生态、社群. Keep the native Mini Program interaction model and capsule safe area.
- Those three tab pages use one shared branded header in the top safe area: the H5 horizontal logo at left, one concise four-character title centered on screen, and a fine divider below. Do not repeat English headings, dates, explanatory subtitles, or internal validation language above the primary content.
- Do not show collection controls or selection checkboxes in the financing list. Collection and selection belong to detail or dedicated management pages.
- Financing discovery is search-led: search company, institution, product, or sector; do not add industry/category chip rails, category filter buttons, or industry badges to financing-list rows.
- 生态 uses a signal-led overview: current capital signals, sector ranking, a six-month heat trend, and public sector detail with the complete company list and active investors. Its bottom-tab label is 生态. Keep 收藏 and 关注 management under 我的 rather than on the ecology overview.
- Home, financing, ecology, observation, and all list pages remain readable before registration. An unregistered visitor receives one complete distinct detail sample across financing, entity, sector, and report details. A second distinct detail keeps its title, summary, and basic facts visible, then shows an inline registration choice for the remaining paid content. Never open a registration overlay merely because a user enters a page or follows an internal detail link; only the visitor's explicit “注册并继续” or account action may open it, and cancelling must leave the current preview available.
- Keep the 我的 tab independent from the first-three-tab visual sync unless a task explicitly includes it.
- The profile page has one settings entry only: keep the control beside the avatar and label it “设置”; do not duplicate it in the page header.
- Bottom navigation is text-only and reads as four connected buttons: use short, vertically centered warm-gray separators rather than full-height rules; the active cell uses a subtle champagne surface, deep-navy text, a short gold top marker, and a slightly larger/heavier label.
- Financing-list identity marks use deep navy cards with white initials and a restrained gold edge. Keep the feed compact on real phones with warm-white continuous rows and light gold-beige dividers rather than pale-gray avatar blocks or separate gray cards.
- Present the financing summary as an inset rounded navy card, consistent with the rounded overview cards used by the other columns; do not stretch it edge-to-edge as a square strip.
- The company comparison screen must let users cancel an individual company in place. Preserve remaining selections, explain when one more company is needed, and offer a direct return to financing when the comparison set is empty or incomplete.
- Do not place collection controls in the financing list header or financing-detail title bar. Keep collection as a secondary action below the detail facts, beside company comparison. The favorite growth task opens the saved-items list; do not show a follow-topic growth task without a clear follow surface.
- Financing and entity detail pages must support native WeChat forwarding and timeline sharing. A report opened directly from a shared card must show the four-column navigation and use a reliable tab fallback when no back stack exists.
- Daily check-in is a once-per-day growth task worth 5 points. Repeated taps on the same day must not award points again.
- Membership is priced at CNY 30/month, CNY 168/six months, or CNY 300/year and grants full browsing across all columns. New users receive a seven-day trial. Cash purchases use WeChat Mini Program virtual payment in direct-goods mode, never auto-renew, and support a full refund within 15 days. Community activity points can redeem seven-day or thirty-day membership extensions; never present a successful purchase before a verified virtual-payment callback or verified order query confirms it.
- A valid first-time registration attributed to an invite rewards the inviter with 300 activity points; award it only after backend registration attribution confirms the event, and count each new user once.
- Community history points enter the unified wallet and lifetime growth total 1:1. The level thresholds are L1 0–299, L2 300–999, L3 1,000–2,499, L4 2,500–4,999, L5 5,000–9,999, L6 10,000–19,999, L7 20,000–49,999, and L8 50,000+.
- Existing community members are linked only by a verified phone number (or an existing WeChat union identity at login); never merge accounts by display name alone.
- Community applications remain native Mini Program forms and enter the existing member-management review queue. Community essays are editorial rewrites, not raw group-message synchronization.
- Shared invitation pages must distinguish inviter and invitee views, keep registration visible, provide a tab fallback for direct-entry users, and show server-confirmed visit, registration, and reward totals to the inviter.
- Phone authorization must exchange the one-time WeChat code through the account service immediately and return only a masked number to the Mini Program. Never persist or expose raw phone numbers, authorization codes, pending-backend copy, WeChat-ID limitations, preview/production notes, or internal privacy implementation language in the public profile UI.

## Validation

Run:

```text
npm run verify
```

The project must remain directly importable by WeChat DevTools from this directory.
