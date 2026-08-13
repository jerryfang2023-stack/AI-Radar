# Collection and Growth Task Design QA

- Source visual truth:
  - `browser://127.0.0.1:4176/?mobile=1#comment-financing-header-collection` — remove collection from the financing title bar.
  - `browser://127.0.0.1:4176/?mobile=1#comment-detail-header-collection` — move collection away from the detail title bar.
  - `browser://127.0.0.1:4176/?mobile=1#comment-profile-follow-task` — remove the follow task because there is no clear follow surface.
  - `browser://127.0.0.1:4176/?mobile=1#comment-profile-favorite-task` — make the favorite task open the saved-post list.
- Implementation screenshots:
  - `C:/Users/86186/.codex/visualizations/2026/08/10/019feb75-f812-75b0-938f-9d4b8dbe9e81/wavesight-mobile-qa/detail-actions-2026-08-13.png`
  - `C:/Users/86186/.codex/visualizations/2026/08/10/019feb75-f812-75b0-938f-9d4b8dbe9e81/wavesight-mobile-qa/profile-tasks-2026-08-13.png`
  - `C:/Users/86186/.codex/visualizations/2026/08/10/019feb75-f812-75b0-938f-9d4b8dbe9e81/wavesight-mobile-qa/saved-list-2026-08-13.png`
- Viewport/state: H5 forced-mobile layout at `848 x 791`; reviewed financing list, financing detail, profile tasks, and saved-list states.

## Findings

- No actionable P0/P1/P2 mismatch remains.
- Financing header: the redundant collection counter is removed, leaving the brand logo and centered four-character section title.
- Detail actions: collection is a secondary content action below the financing facts and sits beside company comparison. The warm-gold collection state and navy comparison action preserve clear visual hierarchy.
- Profile tasks: the unsupported follow task is removed. The completion count now derives from the two remaining tasks, so the progress summary cannot display an obsolete `/5` target.
- Saved-list path: tapping the favorite task opens “我的收藏”; collected financing posts are listed with a reversible remove action.
- Copy: public-facing text uses “收藏情报”, “已收藏”, and “我的收藏”; no internal verification language is exposed.

## Interaction and runtime checks

- Confirmed the financing list header contains no collection control.
- Opened Blacksmith detail; confirmed “收藏情报” is below the fact grid and changes to “已收藏” after tapping.
- Opened “我的”; confirmed only reading and favorite growth tasks remain and the summary is `1/2`.
- Tapped the favorite growth task; confirmed “我的收藏” opens and contains Blacksmith.
- Browser console errors checked: none (Vite debug and React development info only).
- H5 content tests: 12 passed; protected runtime check and production build passed.
- Mini Program tests: 36 passed; project validation passed.

## Comparison history

- Prior P1 issue: collection competed with the page title in the top navigation. Fixed by keeping title bars informational and relocating the detail action into content.
- Prior P1 issue: the follow reward had no discoverable action path. Fixed by removing that task rather than rewarding an unavailable behavior.
- Prior P1 issue: the favorite reward looked actionable but did not expose saved content. Fixed by making the task row open the saved-list screen in H5 and the Mini Program.

final result: passed
