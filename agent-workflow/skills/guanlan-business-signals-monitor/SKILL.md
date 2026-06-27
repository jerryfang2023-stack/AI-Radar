---
name: guanlan-business-signals-monitor
description: Use when supervising, running, repairing, or improving the WaveSight AI V3.3.6 Business Signals lane. Covers daily Raw / Pool / Signal Card / Top10 / Intelligence Map / trend-candidate inputs, source-first gates, PR publication, Hermes repair closure, and lane-specific self-improvement. Do not use for First-Line Viewpoints, Community Intelligence, direct deployment, or retired daily observation / brief / trend-report outputs.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Business Signals"
    status: "current lane owner"
    order: 10
    responsibility: "Own Business Signals daily supervision and repair: Raw, Pool, Signal Cards, public Top10, Intelligence Map inputs, and trend-candidate inputs."
    upstream: "external source capture, daily persistent assets workflow, Hermes inbox"
    downstream: "Signal Cards, public Top10, graph inputs, trend candidates, PR publication"
    gates: "monitor QC, post-monitor Raw / Pool gate, six-gate Card entry, Card generation, source-first, frontstage Top10"
    recent_learning: "Repeated Top10-missing incidents must be split into stale assets, source-artifact retry, translation-title, publication/local-sync, and supervision-observability categories before any full rerun."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Business Signals Monitor

This skill owns the Business Signals production lane. It coordinates source capture, evidence screening, Signal Cards, public Top10, relationship / intelligence map inputs, trend-candidate inputs, and lane repair.

It is the lane owner. It may call narrower skills such as `guanlan-daily-monitor`, `guanlan-monitor-quality-gate`, `guanlan-daily-monitor-qc`, `guanlan-raw-pool-card`, and `guanlan-trend-candidate-writer`.

Enterprise AI / FDE is now owned by `guanlan-enterprise-ai-fde-monitor`. Business Signals may supply Raw / Pool evidence and keep the public lens embedded on the Business page, but FDE precision, demand/service/result analysis, detail openability, and `content/09-fde` sync route through the FDE skill.

## Current Timing

- GitHub primary production window: 08:57 Asia/Shanghai.
- Conditional health dispatch: 09:27 Asia/Shanghai. It checks same-date Business Signals data and active/successful runs, then dispatches the primary workflow only when no healthy output and no active/successful same-date run exists.
- Hermes three-lane early handoff: 09:45 and 09:55 Asia/Shanghai.
- The old Business-only Hermes handoff workflow is manual compatibility only and must not be scheduled in parallel.

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

For regression prevention, read `evals/business-signals-monitor-evals.md`. When repairing Top10, frontstage selection, or title-derived public fields, also read `examples/good-top10-contract.md` and `examples/bad-top10-missing.md`. When repairing Card eligibility or Core Pool promotion, also read `examples/good-six-gate-card-entry.md`. When repairing morning schedule / recovery delays, also read `examples/good-morning-handoff.md`. Read `MEMORY.md` only when a failure resembles a previous incident or when updating this skill.
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
   - Top10 selection;
   - source-first gate;
   - frontstage regression;
   - PR / merge / Pages publication.
5. Classify the failure before rerunning:
   - `supervision_observability`: GitHub lookup/report visibility warning only;
   - `no_run_or_stale_assets`: no active same-date run or public activeDate is stale;
   - `raw_volume_shortfall`: Raw count below minimum;
   - `pool_mix_shortfall`: importance lane coverage gap;
   - `core_supply_shortfall`: Core Pool or non-large Core Pool below minimum;
   - `top10_contract`: public `top10` missing, stale, or not exactly 10;
   - `translation_title`: English/mixed/placeholder title or title-like subject;
   - `large_company_cap`: Top10 cap failure;
   - `publication`: PR, merge, or Pages failure after valid assets.
6. Before any full-chain rerun, record the pre-rerun checklist: activeDate, Top10 count, Card count, Raw / Pool / routed / Core / non-large Core counts, source-artifact freshness by source/channel, missing source-title translations, PR / Pages state, and local dirty / fast-forward state.
7. Repair the smallest script, rule, gate, or skill path needed for the failing category.
8. Rerun the exact failed gate or the smallest relevant validation.
9. Add or tighten an eval before adding long prose when the failure is recurring.
10. Close the Hermes inbox item only after validation, final commit or PR, and prevention are recorded.

## Morning Fast Path

The lane targets a healthy Top10 before 10:00 Asia/Shanghai by failing early and avoiding blind full-chain reruns. Treat 10:00 as a target checkpoint, not as permission to lower gates.

Use this order:

1. Run the scheduled primary production lane at 08:57.
2. Run the 09:27 health dispatch. If same-date data is healthy, or a same-date run is queued / in progress / successful, wait instead of dispatching another full chain.
3. After Raw / Pool, verify supply before Card/frontstage work:
   - active Raw count;
   - Pool and routed Pool count;
   - Core Pool count;
   - non-large Core Pool count;
   - funding / case / product coverage;
   - predicted Top10 eligibility after the large-company cap.
4. If supply is thin, repair the missing source lane first. Do not continue into dashboard, topic-center, or publication work.
5. Generate Signal Cards from all eligible Core Pool items.
6. Apply Top10 preselection with strict large-company caps before public JSON build.
7. Build Business frontstage JSON.
8. Run the unified Business frontstage gate immediately.
9. Only after that gate passes, build operations dashboard, topic center, manifest, PR, merge, and Pages.
10. At 09:45 / 09:55, Hermes should dispatch or hand off one categorized repair path rather than triggering overlapping full-chain reruns.
11. At 10:50, supervision should check the publication closure: merged PR, GitHub Pages success, same-date Business data, Top10 count, and whether local sync is blocked.

## Weekend Policy

Weekend monitor quantity floors may be lighter because source volume is lower, but evidence quality and frontstage product promises do not weaken.

- Keep Top10 at exactly 10.
- Keep the frontstage large-company cap strict: at most 3 large-company cards total and at most 1 per large company.
- If caps leave fewer than 10 eligible cards, trigger non-large-company source refill before Top10 publication.
- Weekend backfill can only promote non-large Core Pool evidence that passes the same six Card entry gates.
- Do not use community feedback, builders viewpoints, social posts, repo roots, package pages, marketplace listings, or generic lists as direct Business Signal Cards.
- Do not treat a supervision warning or GitHub lookup timeout as a data failure unless active-date assets are actually stale or unhealthy.

## Lane Boundaries

- Do not write First-Line Viewpoints or Community Intelligence data.
- Do not use builders viewpoints, opinion cards, or community posts as business-signal facts unless separately verified through Raw / Pool.
- Do not repair Enterprise AI / FDE precision, detail, or Obsidian sync as a generic Top10 issue; route it to `guanlan-enterprise-ai-fde-monitor`.
- Do not restore daily observation, business brief, trend report, publiccopy, cardcopy, or copy-style blockers.
- Do not lower Raw / Pool / Core Pool / Top10 quality gates to make a day look complete.
- Do not relax the large-company cap to solve weekend low supply; repair non-large Core Pool supply instead.
- If routed Pool, Core Pool, or non-large Core Pool is short, repair with targeted recent-event refill: launches, funding, customer deployments, production rollouts, procurement, pricing, regulatory, or vertical workflow cases.
- If Raw is reported short, identify the deficient source/channel or downstream eligibility bucket before rerunning. Do not call a translation-title, stale local checkout, publication, or local-sync issue a Raw shortage.
- Do not satisfy quantity gaps by promoting marketplace listings, directories, repo roots, package/model pages, generic guides, broad lists, funding roundups, generic funding commentary, interviews, old evergreen technical posts, or search snippets into Core Pool.
- Do not satisfy quantity gaps with generic FDE / applied-AI implementation pages. Job posts, role explainers, consulting/service landing pages, and "what is FDE" articles stay non-core unless the same original source has a concrete dated customer deployment, launch, financing, procurement, partnership, or production rollout.
- Treat `source_level` / `acquisition_source_level` as traceability-only labels. They must not be value scores, core gates, ranking inputs, or automatic downgrade reasons.
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
