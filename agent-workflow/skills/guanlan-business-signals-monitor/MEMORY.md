# Guanlan Business Signals Monitor Memory

Keep this file short. Add only durable lane-level lessons from repeated production failures.

## 2026-06-12

- The public/Hermes Top10 contract is lane-level, not only a Raw / Pool / Card detail. A healthy `frontstageSelection` or `frontstageCards` set is insufficient unless the public `top10` array exists and contains exactly 10 active-date items.
- Repeated Business Signals failures should land first in this lane monitor, then delegate to narrower skills such as `guanlan-raw-pool-card` for the specific repair.

## 2026-06-13

- Business Signals should not depend on repeated late schedule loops. Keep 09:07 / 09:37 as the primary windows, then hand off to Hermes at 09:45 / 09:55 so failures are dispatched, reported, and routed to Codex before 10:00.
- Core Pool -> Signal Card entry should use six grouped gates: source auditability, evidence quality, business-signal scope, valid page type, commercial importance, and fact-type constraints. Keep field-level details as diagnostics under those gates; do not expose scattered field checks as separate Card policy or weaken source-first requirements to fill Top10.

## 2026-06-14

- Public title normalization must apply URL-specific title mappings before accepting mixed English/Chinese generated titles. A title that already contains some Chinese can still leak an English source-title subject into the frontstage.
- RSS sources should distinguish automation-safe feeds from manual/browser-assisted feeds. If a feed repeatedly returns 410/403/timeout in Node/GitHub, replace the endpoint when a current feed exists, or disable it by default and keep it as a lead-only fallback.
- Weekly review of 2026-06-08 through 2026-06-14 showed four distinct failure classes: supervision observability warnings, Raw/Pool supply shortages, public Top10 contract/source-first failures, and weekend large-company-cap pressure. Do not collapse them into repeated full-chain reruns.
- Weekend mode may lower monitor-stage quantity floors, but it must not relax source-first, six-gate Card entry, Top10 count, or large-company caps. If the strict cap leaves fewer than 10 cards, refill non-large Core Pool supply before publication.
- A GitHub lookup timeout or missing local report is a supervision evidence gap, not proof that Business Signals data failed. Check same-date run status and activeDate/top10/card counts before dispatching or rerunning.
- The morning path should fail before expensive downstream work: Raw/Pool supply preflight, Card generation, Top10 preselection, Business frontstage JSON, unified Business frontstage gate, then dashboard/topic-center/publication.
