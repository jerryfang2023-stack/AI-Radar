# Unified Operations Console

Release: OPS-V3.1.0-membership / Skill Store v2.2.0

## Membership operations (OPS V3.1.0)

`operations-console.html#membership` is the seventh panel. Community and application sources load independently on opening the panel, with 7/30/90-day windows and refresh. A failed, incomplete or non-production response is unavailable, never zero. No identity data is fetched or rendered.

- Community: `https://members.zkdlj.vip/api/v1/operations/membership-summary`. Formal members require approval and a valid past/present joined date. Participation and speakers resolve only unique member identities from dated issue evidence; unmatched activity aliases are counted separately. One person per issue is one participation; the highest issue activity score plus manual adjustments produces the OPS points distribution. Opt-outs are excluded from points/activity, not membership stock.
- Application: `https://www.zkdlj.vip/api/v1/analytics/membership/summary`. Current accounts exclude merged-away and future-created rows. Effective entitlement includes paid and points-granted membership; trials are separate. First and repeat purchases use server-confirmed non-refunded orders, never client events. Repeat purchases are not auto-renewal. Active behavior means recorded growth-task actions, not all visitors.
- Periods use Asia/Shanghai calendar dates including today; stock and point distributions are current totals. Expiring means the next seven elapsed days. Existing historical records are included; this is not limited to the traffic analytics launch date.
- Membership package distribution is the latest non-refunded paid package among currently entitled accounts, with an other/redemption bucket; it does not reconstruct mixed entitlement sources.
- Do not add the two sources' members or points: cross-platform identity resolution is not implemented here. Community expiry/renewals and offline benefit claims are explicitly unavailable. No claim/renewal rate is inferred.
- Both endpoints accept GET/OPTIONS only, return an explicit allowlist under `MEMBER-OPS-V1.0`, use query-only SQLite transactions and no-store responses. The page sends no credentials. Admin/member/write routes keep their original authentication.
- The membership aggregate remains schema-compatible with 1.6.13 and 1.7.x. Production currently runs member service 1.7.3; deploy only from an exact tested release and never transplant this module onto an older production baseline or overwrite runtime data. Back up code and SQLite before restart; roll back code without replacing a database that may contain newer activity.

Validation: both service pytest suites; `npm run test:ops-unified`; existing analytics tests, OPS/Skill/version gates; desktop/mobile browser checks. Public aggregates are intentionally public, not protected by hidden navigation.

## Scope and boundaries

Seven modules: Overview, Analytics, Membership & Entitlements, Data Quality, Version Governance, Skill Store, System Settings.
Issue-center and task-chain panels are retired. Incident records, daily supervision, collection telemetry and batch history remain owned by their existing workflows.

The passwordless page displays sanitized aggregate analytics and public version metadata only. Member identities, payment/admin actions and protected community pages keep authentication. Hidden navigation and noindex are not authentication.

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
4. Commit scoped files, tag the OPS release, push main, and verify GitHub Pages plus the live page.

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
