# OPS V3.1.0 membership release

Scope: seventh OPS panel for independent community/application membership and entitlement aggregates. No changes to billing, entitlement grants, points ledgers, member identities, authentication or production schema. Skill Store remains v2.2.0.

## Validation

- Payment service: 57 tests passed in an isolated Linux staging directory with fake payment/community clients and temporary databases. Windows full-suite runs hit an intermittent SQLite concurrent-initialization lock; the individual concurrency test passed on both the untouched baseline and modified code. No unrelated schema change was made.
- Community: 54 tests passed after rebasing the concurrently published community-hub follow-up. Both 1.6.13 and 1.7.x schema fixtures, duplicate issue participation, opt-outs and ambiguous names are covered.
- `npm test`, `test:ops-unified` (7), `test:ops-v2` (24), `test:skill-ops` (28), existing analytics tests (7), version consistency, Skill Ops and frontstage regression passed.
- Real public aggregate endpoints returned HTTP 200 with no-store and the exact GitHub Pages CORS origin. Anonymous `/admin` redirects to login; member/me and admin analytics return 401. Endpoint tests compare complete database dumps before/after reads.
- Browser checks: lazy opening, 30-day data and switching to 7 days; separate unavailable-source states; current totals versus period metrics; visible missing-data notices. Desktop 1440×1000 and mobile 390×844 were inspected with real public aggregates through a local preview proxy. Direct in-app navigation to GitHub Pages timed out; the proxy changes only the two endpoint URLs in memory, not published assets or production CORS. Pages deployment is independently verified by its workflow and HTTP assets.

## Typography QC verdict

- Result: pass for the inspected local build.
- Scope: membership navigation, heading, controls, metric cards, point/package distributions and management boundary.
- Evidence: rendered desktop and mobile screenshots, DOM values, computed fonts and overflow checks in this task.
- Token/position mapping: compact OPS title 30/42, section title 20/30, metric 28/36 mono, body 14/24, secondary notes 12/18. Existing paper/navy/gold VI retained.
- Desktop scroll width 1425 ≤ 1440; mobile scroll width 375 ≤ 390. No blocking or local-fix typography findings.

## Deployment and limits

Server publication backed up both apps and SQLite databases, checked exact app hashes/release pointers, then installed only each module and its registration change. The already deployed community 1.7.0 and Mini Program community-service changes were preserved. No database restore or business-record mutation was performed; code-only rollback copies remain on the server.

Community renewal/expiry and offline claim records remain unavailable. Repeat purchase is not auto-renewal. Package breakdown uses the most recent non-refunded order among currently entitled accounts, not a mixed-source entitlement ledger. Unmatched activity aliases and opted-out scoring members are not silently included; cross-system totals are never added.

Release tags: `ops-v3.1.0-membership` (AI-Radar) and `member-ops-v1.0.0` (community repository).
