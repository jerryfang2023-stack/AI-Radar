# OPS V3.4.1 community approval release

Scope: restore the authenticated `/ops/` entry and bring community-member application approval into the unified membership panel.

- Nginx serves `/ops/operations-console.html` from an exact authenticated `/ops/` location, preventing the post-login directory-index 403.
- The OPS backend proxies protected community application list, detail and review requests server-to-server; the browser never receives the community service token.
- Review writes require the OPS CSRF value and a unique operation ID. The member service validates bounded status, dates and scores, then stores an idempotent before/after audit.
- The separate `members.zkdlj.vip/admin` link is removed from the console. The legacy page remains available as a temporary fallback during migration.

Validation: focused member-service and payment-service tests, OPS JavaScript contract tests, Nginx syntax check, repository version gates, and production smoke checks.
