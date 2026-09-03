# OPS V3.5.0 membership management release

Scope: separate community application review and Mini Program member operations into persistent second-level navigation under Membership & Entitlements.

- `#membership-approval` lists community applications, opens the complete internal profile and retains status, joined date, five scores, review notes and company-visibility approval controls.
- `#membership-users` lists Mini Program users, opens the protected user profile and retains audited entitlement extension and available-point adjustment.
- Each route loads only its own protected data after the shared OPS session is authenticated.
- The aggregate membership overview remains independent and no identity, account deletion, identity merge/edit, order mutation or lifetime-point rewrite is added.

Validation: OPS unified and telemetry regression suites, Mini Program member-operation service tests, version consistency, desktop/mobile browser checks and authenticated production smoke checks.
