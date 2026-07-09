---
name: guanlan-business-signals-monitor
description: Use when supervising, running, repairing, or improving the WaveSight AI current SITE-V3.4.5 / BSIG-V2.1.4-raw-card-rule-cleanout Business Signals lane. Covers daily Raw / Pool audit / unified frontstage Signal Cards / separate AI Hardware lens / Reports Center map inputs / trend-candidate inputs, source-first gates, raw-to-card release behavior, PR publication, Hermes repair closure, and lane-specific self-improvement. Do not use for First-Line Viewpoints, Community Intelligence, direct deployment, or retired daily observation / brief / trend-report outputs.
metadata:
  guanlan:
    version: "1.0.5"
    lane: "Business Signals"
    status: "current lane owner"
    order: 10
    responsibility: "Own Business Signals daily supervision and repair: Raw, Pool, unified frontstage Signal Cards, separate AI Hardware lens, V3 release gate cleanup, Reports Center map inputs, and trend-candidate inputs."
    upstream: "external source capture, daily persistent assets workflow, Hermes inbox"
    downstream: "Signal Cards, graph inputs, trend candidates, PR publication"
    gates: "monitor QC, post-monitor Raw / Pool gate, six-gate Card entry, Card generation, source-first, frontstage Card contract"
    recent_learning: "The public Business Signals page no longer has Top10 versus candidate-pool modes. Repeated frontstage Card incidents must be split into stale assets, source-artifact retry, raw/card title-fact ingestion, publication/local-sync, and supervision-observability categories before any full rerun. Provider-caused Raw shortfall is diagnostic when Pool audit supply and Card supply are already sufficient. Blind full-chain reruns are forbidden when same-date artifacts can support a targeted repair and publication."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Business Signals Monitor

This skill owns the Business Signals production lane. It coordinates source capture, evidence screening, unified frontstage Signal Cards, relationship / intelligence map inputs, trend-candidate inputs, and lane repair.

It is the lane owner. It may call narrower skills such as `guanlan-daily-monitor`, `guanlan-monitor-quality-gate`, `guanlan-daily-monitor-qc`, `guanlan-raw-pool-card`, and `guanlan-trend-candidate-writer`.

Enterprise AI / FDE is now owned by `guanlan-enterprise-ai-fde-monitor`. Business Signals may supply Raw / Pool evidence and keep the public lens embedded on the Business page, but FDE precision, demand/service/result analysis, detail openability, and `content/09-fde` sync route through the FDE skill.

## Current Timing

- GitHub primary production window: 08:57 Asia/Shanghai.
- Conditional health dispatch: 09:27 Asia/Shanghai. It checks same-date Business Signals data and active/successful runs, then dispatches the primary workflow only when no healthy output and no active/successful same-date run exists.
- No-Hermes local self-check: 09:40 Asia/Shanghai. It runs after the 09:27 health dispatch has had time to start, applies only safe deterministic repairs, and writes `agent-workflow/reports/<date>-daily-self-check.*`.
- No-Hermes Codex handoff: 09:50 Asia/Shanghai. It reads `codex_repair_tasks`, writes `agent-workflow/reports/<date>-codex-self-repair.*`, and may invoke `codex exec` only when explicitly enabled.
- Daily Problem Watchdog: records failed production runs to Hermes inbox. It must not dispatch recovery or start a full-chain rerun.
- Hermes morning recovery and early handoff workflows are retired and must not be recreated or used.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/version-ledger.md`
4. `context/05-daily-monitoring.md`
5. `context/07-v3-intelligence-generation-rules.md`
6. `context/08-v3-3-automation.md`
7. `context/09-v3-3-current-action-index.md`
8. Relevant Business Signals report, Hermes inbox item, or failed gate output.

For detailed chain work, load the narrower skill:

- `agent-workflow/skills/guanlan-daily-monitor/SKILL.md`
- `agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md`
- `agent-workflow/skills/guanlan-daily-monitor-qc/SKILL.md`
- `agent-workflow/skills/guanlan-raw-pool-card/SKILL.md`
- `agent-workflow/skills/guanlan-trend-candidate-writer/SKILL.md`

For regression prevention, read `evals/business-signals-monitor-evals.md`. When repairing frontstage Card selection, title-derived public fields, or Card eligibility, also read `examples/good-six-gate-card-entry.md`. Read `MEMORY.md` only when a failure resembles a previous incident or when updating this skill.
When repairing repeated morning failures, also read `examples/good-failure-router.md` and the latest weekly failure review report.

## Workflow

1. Resolve the Asia/Shanghai production date unless the user gives another date.
2. Check daily supervision and Hermes inbox for the Business Signals lane.
3. If production has not run, use the GitHub workflow / current automation route rather than pushing generated assets directly to `main`.
4. If production failed, start from the failed gate report and determine the earliest responsible stage:
   - Raw capture;
   - Pool routing;
   - monitor QC;
   - Card generation;
   - frontstage Card contract;
   - source-first gate;
   - frontstage regression;
   - PR / merge / Pages publication.
5. Classify the failure before rerunning:
   - `supervision_observability`: GitHub lookup/report visibility warning only;
   - `no_run_or_stale_assets`: no active same-date run or public activeDate is stale;
   - `raw_volume_shortfall`: Raw count below minimum;
   - `pool_mix_shortfall`: importance lane coverage gap;
   - `card_supply_shortfall`: cardable Raw / Pool candidates or generated Cards below the frontstage contract;
   - `frontstage_card_contract`: public active-date Cards missing, stale, or not sorted by importance;
   - `raw_card_ingestion_fields`: English/mixed/placeholder title, title-like subject, or missing raw-to-card title/fact extraction fields;
   - `publication`: PR, merge, or Pages failure after valid assets.
6. Before any full-chain rerun, record the pre-rerun checklist: activeDate, public Card count, Raw / Pool / routed Pool counts, cardable candidate count, source-artifact freshness by source/channel, raw/Card title-translation and fact-extraction status, PR / Pages state, and local dirty / fast-forward state. If the checklist shows same-date Pool audit supply and Card supply are sufficient, do not rerun Raw just because the Raw floor is short; use the existing artifacts and repair the downstream blocker.
7. Repair the smallest script, rule, gate, or skill path needed for the failing category.
8. Rerun the exact failed gate or the smallest relevant validation.
9. Add or tighten an eval before adding long prose when the failure is recurring.
10. Close the Hermes inbox item only after validation, final commit or PR, and prevention are recorded.

## Hard Stop: No Blind Full-Chain Reruns

This is a hard requirement, not a preference.

- Do not rerun the whole Business Signals workflow as the default response to a failure.
- Start from the failed gate, report, run step, or published-data mismatch, then repair that specific stage.
- If same-date Raw, Pool, Card, or frontstage artifacts already exist, reuse those artifacts for downstream repair and publication unless the failed stage proves they are corrupt or insufficient.
- Do not regenerate Raw or rerun the full monitor when the defect belongs to Pool routing, Card eligibility, raw/Card title or fact extraction, frontstage export, publication, or sync. Repair that stage and rerun only the smallest affected generator / gate.
- If Pool audit supply and Card supply are already sufficient, do not restart source raw collection just because one provider, peer channel, or quota-dependent source is short.
- If `raw_to_card_supply_release=true`, GDELT / keyword / RSS / AI HOT / Anysearch source-channel failures, `unrecovered_failed_sources_max`, keyword-only floors, AI-title ratio, off-topic raw-title counts, and Raw volume shortfall are diagnostic supply-risk notes, not release blockers, unless a real Pool coverage / Card gate is also failing.
- After a targeted repair passes the smallest relevant validation, proceed to PR / merge / Pages publication from the repaired artifacts. Do not dispatch another full-chain run to "be safe".
- If a full-chain rerun is still necessary, first write the checklist result and the specific missing or corrupt artifact that makes artifact reuse impossible.

## Morning Fast Path

The lane targets healthy same-date public Cards before 10:00 Asia/Shanghai by failing early and avoiding blind full-chain reruns. Treat 10:00 as a target checkpoint, not as permission to lower gates.

Use this order:

1. Run the scheduled primary production lane at 08:57.
2. Run the 09:27 health dispatch. If same-date data is healthy, or a same-date run is queued / in progress / successful, wait instead of dispatching another full chain.
3. After Raw / Pool, verify supply before Card/frontstage work:
   - active Raw count;
   - Pool and routed Pool count;
   - cardable Raw / Pool candidate count;
   - large-company concentration in cardable candidates;
   - funding / case / product coverage;
   - public Card readiness.
4. If Raw is below floor because of provider quota or temporary outage, but Pool audit supply and public Card readiness are sufficient, keep the Raw shortfall visible as a diagnostic and continue with Card / frontstage / PR work from the same artifact set.
   - Treat GDELT, keyword search, RSS, and AI HOT as peer source-artifact channels. Do not block release because one peer channel is empty, quota-limited, noisy, or below a keyword-specific floor when the combined peer artifacts already produce healthy Pool audit supply and Card supply.
5. If Pool audit supply, cardable candidate supply, or Card readiness is thin, repair the missing source lane first. Do not continue into dashboard or publication work.
6. Generate frontstage Signal Cards from all cardable Raw / Pool business signals. Do not use a fixed Pool selection cap after Raw collection; Pool should preserve all non-discard screened evidence so repairable high-value items remain visible.
7. Build one public Card set sorted by importance / impact. Do not split public data into Top10 and candidate-pool modes. Do not expose sorting reasons on the page.
8. Build Business frontstage JSON.
9. Run the unified Business frontstage gate immediately.
10. Only after that gate passes, build operations dashboard, manifest, PR, merge, and Pages.
11. After failed production runs, Daily Problem Watchdog should write one categorized inbox item for targeted repair. It must not dispatch another full-chain run.
12. At 09:40, no-Hermes self-check should verify same-date data / active-run state and run safe repairs only. If the 09:27 health dispatch is queued or in progress, classify the lane as waiting rather than failed.
13. At 09:50, no-Hermes Codex handoff should turn unresolved `codex_repair_tasks` into a task-specific prompt or explicit `codex exec` run.
14. Before 10:00, report a human-readable repair status whenever production state is observable. Publication checks after this point should focus on PR, Pages, same-date Business data, public Card count, and local sync blockage.

## Weekend Policy

Weekend monitor quantity floors may be lighter because source volume is lower, but evidence quality and frontstage product promises do not weaken.

- Keep the same source-first and six-gate Card entry rules.
- Weekend public Cards should include every qualified Raw / Pool business signal that can become a Card.
- Do not use community feedback, builders viewpoints, social posts, repo roots, package pages, marketplace listings, or generic lists as direct Business Signal Cards.
- Do not treat a supervision warning or GitHub lookup timeout as a data failure unless active-date assets are actually stale or unhealthy.

## Lane Boundaries

- Do not write First-Line Viewpoints or Community Intelligence data.
- Do not use builders viewpoints, opinion cards, or community posts as business-signal facts unless separately verified through Raw / Pool.
- Do not repair Enterprise AI / FDE precision, detail, or Obsidian sync as a generic frontstage Card issue; route it to `guanlan-enterprise-ai-fde-monitor`.
- Do not restore daily observation, business brief, trend report, publiccopy, cardcopy, or copy-style blockers.
- Do not lower Raw / Pool / Card gates to make a day look complete.
- If routed Pool or cardable candidate supply is short, repair with targeted recent-event refill: launches, funding, customer deployments, production rollouts, procurement, pricing, regulatory, or vertical workflow cases.
- If Raw is reported short, identify the deficient source/channel or downstream eligibility bucket before rerunning. Do not call a title/fact ingestion, stale local checkout, publication, or local-sync issue a Raw shortage. If Pool audit supply and Card supply are already enough, proceed downstream from the existing artifacts instead of starting another full Raw run.
- Do not convert a downstream gate failure, publication failure, stale local checkout, or version mismatch into a full Raw / Pool / Card rerun. Fix the failing downstream stage and publish after validation.
- Do not satisfy quantity gaps by promoting marketplace listings, directories, repo roots, package/model pages, generic guides, broad lists, funding roundups, generic funding commentary, interviews, old evergreen technical posts, or search snippets into Cards.
- Funding title generation is allowed only in Raw/Card ingestion for confirmed single-company financing events where the original source title itself proves amount / round wording such as `raises <amount>`, `announcing our <amount> <round>`, `launches with <amount>`, or `emerged from stealth with <amount>`. The generated Chinese title must be stored before publication; generic funding/list blockers should inspect source identity fields, not source-backed fact text or captured query tails.
- Funding Card facts should preserve source-backed investor, use-of-proceeds, product direction, or deployment context when available; do not reduce rich financing sources to a bare "X raised Y" sentence.
- Do not satisfy quantity gaps with generic FDE / applied-AI implementation pages. Job posts, role explainers, consulting/service landing pages, and "what is FDE" articles stay backend context unless the same original source has a concrete dated customer deployment, launch, financing, procurement, partnership, or production rollout.
- Treat acquisitions / mergers, material partnerships, procurement / tenders / contracts, pricing or billing changes, regulatory approvals / antitrust actions, and material lawsuits / settlements as high-value Business Signals only when they are concrete, dated, source-backed AI commercial events. Normalize them into existing `case` or `product_service` Cards; do not create a fourth public Card type.
- Treat `source_level` / `acquisition_source_level` as traceability-only labels. They must not be value scores, Card gates, ranking inputs, or automatic downgrade reasons.
- Do not rerun the full chain repeatedly for the same failure category without a targeted repair.
- Do not deploy directly from automation branches.

## Reporting

When finishing, report:

- lane status;
- failed gate or report path inspected;
- files changed;
- validation run;
- prevention artifact added or not needed;
- Hermes inbox item status;
- commit / PR / deployment status when relevant.
