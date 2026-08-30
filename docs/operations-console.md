# Unified Operations Console

Release: OPS-V3.0.0-unified-platform / Skill Store v2.2.0

## Scope and boundaries

Six modules: Overview, Analytics, Data Quality, Version Governance, Skill Store, System Settings.
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
