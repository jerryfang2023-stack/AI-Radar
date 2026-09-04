# Unified Operations Console

Release: OPS-V3.6.1-member-editor-collapse / Skill Store v2.2.0

Production URL: `https://www.zkdlj.vip/ops/`

The whole console is published through an atomic VPS release and protected by an allowlisted email challenge. Verification sets an HttpOnly `SameSite=Strict` session cookie plus a separate CSRF cookie scoped to `/ops`. Nginx checks the session before serving the console, scripts or operational snapshots. The public login page is the only anonymous OPS surface. GitHub Pages excludes the console application, Skill Store embed and OPS data artifacts.

## Membership operations (OPS V3.6.1)

`https://www.zkdlj.vip/ops/#membership` is the membership overview. Community and application sources load independently on opening it, with 7/30/90-day windows and refresh. A failed, incomplete or non-production response is unavailable, never zero. Four persistent second-level entries sit beneath Membership & Entitlements in the left navigation: `#membership-approval` for community applications, `#membership-community` for community-member lifecycle management, `#membership-users` for Mini Program member operations, and `#membership-schedule` for activity scheduling. Each management view loads its own protected data only when opened.

The page is metric-first: card-level methodology notes and repeated boundary explanations stay out of the interface. Detailed definitions remain in this operational reference; the UI keeps only live values, source status, controls and the necessary authentication/privacy boundary.

- Community: `https://members.zkdlj.vip/api/v1/operations/membership-summary`. Formal members require approval and a valid past/present joined date. Participation and speakers resolve only unique member identities from dated issue evidence; unmatched activity aliases are counted separately. One person per issue is one participation; the highest issue activity score plus manual adjustments produces the OPS points distribution. Opt-outs are excluded from points/activity, not membership stock.
- Application: `https://www.zkdlj.vip/ops/application-membership-summary` (requires the whole-console session). Current accounts exclude merged-away and future-created rows. Effective entitlement includes paid and points-granted membership; trials are separate. First and repeat purchases use server-confirmed non-refunded orders, never client events. Repeat purchases are not auto-renewal. Active behavior means recorded growth-task actions, not all visitors.
- Periods use Asia/Shanghai calendar dates including today; stock and point distributions are current totals. Expiring means the next seven elapsed days. Existing historical records are included; this is not limited to the traffic analytics launch date.
- Membership package distribution is the latest non-refunded paid package among currently entitled accounts, with an other/redemption bucket; it does not reconstruct mixed entitlement sources.
- Do not add the two sources' members or points: cross-platform identity resolution is not implemented here. Community expiry/renewals and offline benefit claims are explicitly unavailable. No claim/renewal rate is inferred.
- Both sources accept GET/OPTIONS only, return an explicit allowlist under `MEMBER-OPS-V1.0`, use query-only SQLite transactions and no-store responses. The application source is reached through the authenticated same-origin OPS proxy; the community aggregate remains an independently managed read-only source. Admin/member/write routes keep their original authentication.
- The membership aggregate remains schema-compatible with 1.6.13 and 1.8.x. Production release 1.8.2 assigns cohort 1 only to uniquely matched completed first-season speakers, defaults all other users to cohort 2, and provides an audited repair path for verified duplicate applications. Deploy only from an exact tested release and never transplant this module onto an older production baseline or overwrite runtime data. Back up code and SQLite before restart; roll back code without replacing a database that may contain newer activity.

Validation: both service pytest suites; `npm run test:ops-unified`; existing analytics tests, OPS/Skill/version gates; Nginx configuration check; desktop/mobile browser checks. The OPS page and application aggregates are protected by the VPS session boundary.

### Mini Program user management

The dedicated `#membership-users` subpanel provides protected Mini Program account search through `GET /api/v1/admin/analytics/membership/users` and audited changes through `POST /api/v1/admin/analytics/membership/users/<id>/adjustments`, contract `MEMBER-ADMIN-V1.0`. After a successful entitlement or points adjustment, the user editor closes and the current filtered list remains visible; failed saves keep the editor and entered values available for correction. The operator verifies once at the console login page. The server session is held in an HttpOnly cookie; JavaScript receives only the scoped CSRF value. There is no terminal-token field or membership-specific login.

Community-member applications are reviewed in the dedicated `#membership-approval` subpanel through the payment service's authenticated server-side proxy. Operators can search applicants, open each complete internal application and choose a prominent approve, reject or waitlist action. Approval assigns a cohort without treating approval as formal entry; after a successful write the view returns to the complete user list. List/detail/review calls use `COMMUNITY-APPROVAL-V1.0`; the browser never receives the community service token. Review writes require the OPS CSRF value, a unique operation ID, bounded scores and a server-derived administrator hash. The community service stores before/after audit records and safely replays duplicate operation IDs. The legacy `members.zkdlj.vip/admin` remains available only as a temporary operational fallback and is no longer linked from the unified console.

The dedicated `#membership-community` subpanel lists approved community members by cohort and lifecycle state. Operators can mark actual entry, move a member between cohorts or record elimination with a reason through `COMMUNITY-MEMBER-ADMIN-V1.0`; records also show verified Mini Program account availability without exposing an OpenID. Eliminated members retain their history but are excluded from active community, claim and entitlement eligibility.

The dedicated `#membership-schedule` subpanel keeps the completed first season as a 15-session summary and manages second-season sessions through `COMMUNITY-SCHEDULE-V1.0`. Create and update operations are idempotent and audited. Confirmed or completed sessions require a date; pending sessions can remain open.

Allowed identities are server-only `OPERATIONS_ADMIN_EMAILS` values. The database stores email HMAC/masking, verification-code HMAC, session-token HMAC and CSRF HMAC, never the raw email, code or session token. A challenge lasts ten minutes, permits five attempts and is limited to three sends per email per ten minutes. Reads require the session bearer; writes additionally require its CSRF value. Logout revokes the server session.

The list includes only non-merged accounts with a verified WeChat OpenID identity, but never returns the OpenID or identity hash. It exposes display name, masked phone, community link status, entitlement dates, available/lifetime/community points, non-refunded paid-order count/value, and last recorded behavior. Search supports display name, masked phone, community name and numeric user ID; filters support member/trial/expired.

Supported writes are deliberately narrow: extend entitlement by 7/30/90/180/365 days or adjust available points by ±1—100000. A 2—120 character reason and a unique operation ID are mandatory, so a retried request cannot apply twice. Entitlement changes append `membership_ledger`; point changes append `point_ledger` without changing lifetime points; both append `operations_admin_audits` with administrator identity fingerprint, before/after values and timestamp. Negative available balances are rejected. Account deletion, identity edit/merge, order mutation, arbitrary expiry replacement and lifetime-point rewriting are not exposed.

## Scope and boundaries

Seven primary modules: Overview, Analytics, Membership & Entitlements, Data Quality, Version Governance, Skill Store, System Settings. Membership & Entitlements owns four second-level routes: Community Application Review, Community Member Management, Mini Program Member Management, and Activity Scheduling.
Issue-center and task-chain panels are retired. Incident records, daily supervision, collection telemetry and batch history remain owned by their existing workflows.

The production console, scripts and snapshots require the VPS session. Public aggregate APIs remain identity-free and may still be used by other products; their existence is not treated as console authorization. Member identities, payment/admin actions and protected community pages retain their own server-side boundaries.

## Version ownership

- Data Center and OPS: current section of context/version-ledger.md.
- Mini Program: 02-Miniprogram/package.json; source baseline, not WeChat approval or online-release evidence.
- Financing H5: 03-H5/package.json; source baseline only.
- Financing site/data: allowlisted public /version.json.
- Community service and application H5/PC: public /healthz; distinct from financing H5.
- Public receipts include last successful verification and latest attempt. Failed refreshes preserve the last value but mark it unavailable. Old receipts are marked stale using the browser's local threshold.

## Refresh and release

1. Run npm run sync:ops-platforms. Only whitelisted version fields are saved; never raw responses or private service config.
2. Run npm run build:skill-store-dashboard on the owning local machine. It scans .skill-store, AIP, latest plugin cache and configured project directories. Missing optional directories are unconnected; disappearance of a previously available directory fails closed and preserves the old snapshot.
3. Run npm run build:ops-console, npm run test:ops-unified, npm run test:ops-v2, npm run test:skill-ops and npm run assert:versions. Complete normal repository gates before publishing.
4. Commit scoped files, tag the OPS release, push main, publish the protected OPS artifact to `/var/www/wavesight-ops`, and verify unauthenticated redirects plus authenticated access. GitHub Pages must pass while excluding OPS artifacts.

CI consumes committed catalog snapshots without access to local project repositories. Local-source refresh is neither a browser action nor an unattended cross-device sync service.

Daily Windows controllers and safe self-checks use a separate runtime snapshot.
To inspect the same snapshot manually, pass `--dashboard=<runtime>/local-skill-store-data.js`
to `check-skill-ops.mjs`. Runtime refresh calls `build-skill-store-dashboard.mjs`
directly with `--output=<runtime>/local-skill-store-data.js`; the release npm
wrapper above also updates the tracked registry and is not a scheduled repair
command. Supervision with `--output-dir=<runtime>` reads that runtime snapshot
when present. Source or registry defects remain visible and require a scoped
repository fix; they must not be hidden by refreshing only the runtime file.

## Skill ownership and configuration

agent-workflow/skills/skill-catalog-sources.json defines platform bindings and optional independent directories. Shared-rule counts express declared applicability, not installation or observed invocation. One Skill may serve several platforms; do not sum platform counts as unique Skills.
Add a platform source there, optionally overriding its path with the named environment variable. Rule bodies stay in the owning repository. Certified Skills and external-content cleanup protection are unchanged.

## System Settings

Integration inventory, freshness semantics and device-local preferences only: landing module, compact spacing, and 24/48/72-hour stale threshold.
Saving affects this browser only; reload reads the published snapshot, not local directories or servers.

## Typography / Copy Spec

| Position | Scale | Copy purpose |
| --- | --- | --- |
| Page title | 30/42, 600 | Compact internal dashboard; Guanlan column-title scale |
| Card title | 20/30, 600 | Platform or module name |
| Body / data | 14/24, 400 | Source and operational meaning |
| Label / evidence | 12/18, 500 | Status and timestamp; unknown state stays visible |
| Version | Mono 18/28, 500 | Wrap long identifiers |

Paper #FFFDF8, navy #0D355C, champagne #C8A766. Source/live wording and missing-source states are acceptance requirements, not decorative copy.
