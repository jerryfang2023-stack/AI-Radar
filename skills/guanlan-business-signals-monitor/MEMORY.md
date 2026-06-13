# Business Signals Monitor Memory

Durable production lessons only. Add entries when a failure is likely to recur.

## 2026-06-09

Core Pool scarcity can break Top10 even when Raw / Pool totals look healthy. Keep the non-large-company Core Pool floor and large-company caps together: repair source coverage and Pool routing instead of weakening Top10 caps.

The 2026-06-09 morning incident happened before the V3.3.3 lane split was recorded. Historical 08:00 schedule failures should now be interpreted through the current 09:07 / 09:37 Asia/Shanghai primary workflow windows plus Hermes three-lane handoff at 09:45 / 09:55, not a return to exact-hour cron or the retired 10:07 backup loop.

Auto-merge skip means the generated PR may be ready while publication is blocked. Keep the automation-branch to PR to `main` route; direct `main` pushes remain forbidden.

When `raw_count_min` blocks a high-quality run, artifact recovery must rebuild Cards and site data after restoring Raw / Pool. Pre-card `site-content.json` artifacts are stale and must not be copied as final output.

## 2026-06-12

News-site homepages and generic root URLs can contain unrelated article/sidebar fragments that look like concrete AI events. Treat root/homepage URLs as index-only evidence unless they resolve to a dated article or first-party event before Card generation.

The 2026-06-11 and 2026-06-12 Business Signals incidents showed that `frontstageSelection` can look healthy while the public `top10` contract is missing or empty. Treat `frontstageSelection=10` without `top10.length=10` as a production failure, not a display quirk. Weekly health must read Hermes inbox incidents and action logs so repeated categories such as `business_signals_top10_missing` become gate / eval / MEMORY updates instead of another same-day patch.
