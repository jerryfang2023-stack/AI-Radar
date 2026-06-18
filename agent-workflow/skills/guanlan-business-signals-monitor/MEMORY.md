# Guanlan Business Signals Monitor Memory

Keep this file short. Add only durable lane-level lessons from repeated production failures.

## 2026-06-18 Title Correction

- Business Signals public titles must be the original/source title translated into Chinese only. Do not rewrite titles into commercial summaries, add inferred framing, prepend source/domain names, or inject details that are not part of the source title.
- `title`, `displayTitle`, and Top10-compatible `generatedTitle` must use the same source-title translation. If an English source title has no approved literal translation mapping, block it from Top10 and candidate-pool display instead of falling back to generated titles, URL slugs, or generated Chinese summaries.
- If an English source title has no approved literal translation mapping, block it from Top10 and candidate-pool display instead of falling back to generated titles, URL slugs, or `subject：English title` hybrids.
- Recurring English / mixed-title leaks in Business Signals are frontstage generation and gate bugs, not same-day data bugs. A Chinese subject prefix plus `：` must not exempt the remaining English title from translation, and checks must cover both `top10` and `corePoolCandidates`.
- Template filler facts such as `original source says`, `original AI event`, `specific AI business event`, `signal value is to observe`, or `need to continue verifying customer/product/business outcome` are not valid frontstage details. If cleanup leaves a card with no source-facing fact, remove it before Top10 and candidate-pool selection instead of publishing an incomplete detail.
- When repairing this class, update the generator, source-first gate, and eval together; then rebuild locally, scan both Top10 and candidate pool for English/template/empty detail leaks, run the unified Business frontstage gate, and publish through the Business Signals automation PR.
- The Enterprise AI / FDE lens must prioritize source-backed implementation evidence such as FDE, customer-embedded delivery, production deployment, workflow rollout, procurement, pilot, or technical scoping. Broad AI governance or geopolitical access stories must not outrank concrete implementation materials just because they mention enterprise AI, security, or governance.
- FDE lens titles follow the same title rule as Top10: display the original/source title translated directly into Chinese. Field notes such as Genzeon's Claude-First Healthcare FDE pod page should show the literal translated source title, not a generated boss-facing interpretation.

## 2026-06-12

- The public/Hermes Top10 contract is lane-level, not only a Raw / Pool / Card detail. A healthy `frontstageSelection` or `frontstageCards` set is insufficient unless the public `top10` array exists and contains exactly 10 active-date items.
- Repeated Business Signals failures should land first in this lane monitor, then delegate to narrower skills such as `guanlan-raw-pool-card` for the specific repair.

## 2026-06-13

- Business Signals should not depend on repeated late schedule loops. Keep the morning path bounded, then hand off to Hermes at 09:45 / 09:55 so failures are dispatched, reported, and routed to Codex before 10:00.
- Core Pool -> Signal Card entry should use six grouped gates: source auditability, evidence quality, business-signal scope, valid page type, commercial importance, and fact-type constraints. Keep field-level details as diagnostics under those gates; do not expose scattered field checks as separate Card policy or weaken source-first requirements to fill Top10.

## 2026-06-14

- Public title normalization must apply URL-specific title mappings before accepting mixed English/Chinese generated titles. A title that already contains some Chinese can still leak an English source-title subject into the frontstage.
- RSS sources should distinguish automation-safe feeds from manual/browser-assisted feeds. If a feed repeatedly returns 410/403/timeout in Node/GitHub, replace the endpoint when a current feed exists, or disable it by default and keep it as a lead-only fallback.
- Weekly review of 2026-06-08 through 2026-06-14 showed four distinct failure classes: supervision observability warnings, Raw/Pool supply shortages, public Top10 contract/source-first failures, and weekend large-company-cap pressure. Do not collapse them into repeated full-chain reruns.
- Weekend mode may lower monitor-stage quantity floors, but it must not relax source-first, six-gate Card entry, Top10 count, or large-company caps. If the strict cap leaves fewer than 10 cards, refill non-large Core Pool supply before publication.
- A GitHub lookup timeout or missing local report is a supervision evidence gap, not proof that Business Signals data failed. Check same-date run status and activeDate/top10/card counts before dispatching or rerunning.
- The morning path should fail before expensive downstream work: Raw/Pool supply preflight, Card generation, Top10 preselection, Business frontstage JSON, unified Business frontstage gate, then dashboard/topic-center/publication.
- Morning scheduling was optimized to 08:57 primary production plus 09:27 conditional health dispatch. The health dispatch must wait when same-date data is healthy or a same-date run is queued, in progress, or successful; do not restore blind second full-chain cron runs.

## 2026-06-16

- Recurring `source_first` / title failures from case Cards are a generator bug, not a rerun problem. Case Card generation must prefer source event titles and reject `案例：AI 进入...` scenario templates as public titles.
