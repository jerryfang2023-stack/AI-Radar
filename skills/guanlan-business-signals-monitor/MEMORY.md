# Business Signals Monitor Memory

Durable production lessons only. Add entries when a failure is likely to recur.

## 2026-06-09

Core Pool scarcity can break Top10 even when Raw / Pool totals look healthy. Keep the non-large-company Core Pool floor and large-company caps together: repair source coverage and Pool routing instead of weakening Top10 caps.

The 2026-06-09 morning incident happened before the V3.3.3 lane split was recorded. Historical 08:00 schedule failures should now be interpreted through the current 09:07 / 09:37 / 10:07 Asia/Shanghai workflow windows: use a 10:20 watchdog/manual dispatch after the current backup windows, not a return to exact-hour cron.

Auto-merge skip means the generated PR may be ready while publication is blocked. Keep the automation-branch to PR to `main` route; direct `main` pushes remain forbidden.

When `raw_count_min` blocks a high-quality run, artifact recovery must rebuild Cards and site data after restoring Raw / Pool. Pre-card `site-content.json` artifacts are stale and must not be copied as final output.
