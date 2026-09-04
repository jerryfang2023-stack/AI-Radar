# OPS V3.6.0 community lifecycle release

Scope: add community lifecycle and second-season scheduling to the existing authenticated Membership & Entitlements workspace.

- `#membership-approval` emphasizes approve, reject and waitlist decisions, assigns approved applicants to a cohort without treating approval as group entry, and returns to the complete list after completion.
- `#membership-community` manages cohort, actual group entry and elimination, and shows verified Mini Program account availability without exposing identity tokens.
- `#membership-users` retains protected Mini Program account operations for entitlement and available points.
- `#membership-schedule` keeps the completed first season as a 15-session summary and provides audited, idempotent second-season schedule maintenance.
- Community lifecycle state excludes eliminated members from active community, claim and entitlement eligibility while preserving history.

Validation: complete community and payment-service pytest suites, OPS unified and telemetry regression suites, version consistency, desktop browser checks, exact-commit deployment, service health, authentication boundaries and read-only production API smoke checks.
