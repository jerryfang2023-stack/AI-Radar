---
name: guanlan-daily-monitor-qc
description: Audit WaveSight AI current V3 daily-monitor Raw / Pool quality before downstream business-signal production. Use for Raw evidence completeness, Pool routing, source quality, discovery-channel separation, large-company concentration, full-text integrity, monitor logs, and Markdown allow / allow_with_degradation / block decisions. Do not generate Cards, daily observations, trend reports, business briefs, or first-line builders viewpoints.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Business Signals"
    status: "current sub-skill"
    order: 60
    responsibility: "Audit Raw / Pool quality release and prevent noisy or stale monitor output."
    upstream: "monitor reports and Raw / Pool data"
    downstream: "QC decision, repair route"
    gates: "Raw quality, Pool quality, release readiness"
    recent_learning: "QC should protect source-backed judgment, not merely count items."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Daily Monitor QC

This skill audits the quality of a `guanlan-daily-monitor` run before downstream asset generation.

Use it after the daily monitor finishes and before Raw / Pool feeds business-signal Cards, relationship graph inputs, trend candidates, or frontstage data.

## Scope

Audit only monitoring quality:

- Raw evidence completeness.
- Pool routing correctness.
- Full-text and snapshot integrity.
- Source level and discovery-channel separation.
- S/A overseas first-line source coverage.
- Keyword monitoring path coverage.
- Whether downstream tasks may proceed, downgrade, or pause.

Do not write articles, generate cards, rewrite Raw evidence, or polish frontend copy. Raw text, source quotes, URLs, metadata, screenshots, snapshots, and `key_excerpts.text` are evidence and must not be style-rewritten.

## Required Reads

For each audit, read:

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. `context/07-v3-intelligence-generation-rules.md`
4. `context/05-daily-monitoring.md`
5. The target date's Raw / Pool files and monitor logs.

If script-level score output exists, also read:

- `agent-workflow/reports/<YYYY-MM-DD>-guanlan-monitor-quality-gate.md`
- `agent-workflow/reports/<YYYY-MM-DD>-guanlan-daily-monitor-quality-loop.md`

For self-improvement and regression prevention, read `evals/daily-monitor-qc-evals.md` when auditing, repairing, or updating this skill. When deciding whether a run is truly releasable, also read `examples/good-qc-release.md` and `examples/bad-count-only-qc.md`.

Read these only when a finding depends on the detail:

- `agent-workflow/product/source-intelligence.md` for source level, source pool, or S/A/B judgment when current context does not settle the question.
- `agent-workflow/product/raw-evidence-schema.md` for Raw field, full text, snapshot, or hash judgment when schema details are needed.
- `agent-workflow/product/pool-routing-rules.md` for route, downgrade, `core_pool`, or `index_only` judgment only when it does not conflict with current V3 context.
- `01-SiteV2/content/README.md` for directory or write-path judgment.
- `source-registry-v2.json`, `keyword-monitoring-v2.json`, and `monitor-quality-gate-v2.json` for executable configuration conflicts.

This skill is stricter than a numeric pass alone. A run can have a high score and still be blocked if it uses low-value pages as core evidence or lacks S/A source coverage for its main topics.

## Inputs To Inspect

For date `<DATE>`, inspect available files under:

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
01-SiteV2/knowledge/03-Opinion-Cards/
agent-workflow/reports/
```

Do not open source / keyword / quality JSON by default. Inspect those files only when the run shows a configuration-level conflict, such as missing keyword paths, wrong source downgrade behavior, or unexpected script thresholds.

## Core Principle

Daily monitor quality is not measured by quantity alone.

The run is useful only when it captures real evidence that can support business judgment:

- Raw must preserve readable full text or a clearly marked fallback.
- Pool must not replace Raw.
- M-level discovery channels must be traced back to original sources.
- Core materials must show an actual change, action, adoption, funding, release, policy, customer movement, pricing change, workflow impact, or market signal.
- Homepages, directory pages, login pages, generic product pages and search-result pages are indexes, not business signals.

## Hard Gates

If any P0 item is triggered, mark the run `blocked` and stop downstream card/article generation until repaired.

### P0 Blockers

1. Active Raw count is below 150 unless the run is explicitly marked blocked.
2. Pool has fewer than 75 items, fewer than 60 routed items, or fewer than 30 usable `core_pool` items unless the run is explicitly marked blocked.
3. More than 20% of `core_pool` candidates lack usable `full_text`, readable snapshot, or `full_text_hash`.
4. Any frontstage candidate lacks `source_url`, Raw archive path, Raw JSON path, `source_level`, `has_full_text`, `extraction_quality`, or `usable_for`.
5. A company homepage, open-platform homepage, product directory, docs directory, console/login page, tool navigation page, search-result page, app-store listing, Baidu official page, or generic tool vendor page is routed as `core_pool` without a concrete new event.
6. AI HOT, follow-builders, HN, X, Reddit, newsletter, RSS or search aggregation text is used as fact主证据 without original-source capture.
7. The day's leading themes have no S/A overseas first-line source coverage.
8. Keyword monitoring path is missing, empty, or only contains community/aggregator results when the day has enough public material.
9. `source_distribution`, `failed_sources`, `fallback_used`, `evidence_gaps`, `raw_count_by_source_type`, or `source_level_distribution` is missing from the monitor log.
10. The run reports success while downstream-worthy Raw is mostly Chinese official homepages, tool homepages, product indexes, SEO pages, or low-information summaries.

### P1 Repair Required

The run may continue only after repair or with explicit downgrade notes:

- S/A/B source ratio is weak for core topics.
- `core_pool` contains items with vague titles and no business action.
- `index_only` materials are over-promoted to Pool.
- AI HOT source items are present but original URLs were not fetched.
- follow-builders items lack original post text, timestamp, author identity, or capture boundary.
- Important keyword groups have no coverage and no explanation.
- Raw duplicates inflate count.
- `clean_text` exists but `full_text` is missing without fallback status.
- Business elements are generic and do not identify customer, workflow, budget, regulation, competition, pricing, or adoption.

## Source Quality Rules

Treat channels separately from facts:

| Type | Examples | QC Rule |
|---|---|---|
| S | Official release/blog/docs with a specific update, SEC/regulatory filing, first-party research, company earnings, primary source transcript | Can be core evidence if it contains a concrete change and full text is saved |
| A | Reuters, Bloomberg, FT, WSJ, The Information, TechCrunch, VentureBeat, CNBC, Axios, Sifted, top analyst/research sources | Strong supporting or core evidence after full text / snapshot capture |
| B | VC post, funding database, Product Hunt, GitHub repo, vertical newsletter, ecosystem report | Useful supporting evidence; frontstage core claims often need S/A support |
| C/D | Low-signal media, SEO page, repost, forum rumor, tool directory, weak blog | Watchlist or supporting only |
| M | AI HOT, follow-builders, HN, X, Reddit, RSS, search aggregator | Discovery only; must回源 before factual use |

Important: `M` belongs in `acquisition_source_level`, not `source_level`. A discovery channel cannot become a fact source by being popular.

## Page-Type Routing Rules

These pages are not core evidence unless they explicitly contain a dated concrete new action:

- Company homepage.
- Baidu official site or generic vendor homepage.
- Product landing page.
- Open platform homepage.
- Product/tool directory.
- API docs directory.
- Pricing navigation page without dated pricing change.
- Console/login/auth page.
- Search result page.
- App store/plugin marketplace listing with no new adoption signal.
- Generic "AI tools" list, SEO article, or comparison page.

Default routing:

```yaml
usable_for:
  - index
pool_routes:
  - index_only
frontstage_eligible: false
frontstage_block_reason: homepage_or_directory_observation
```

Only override this when the page itself proves a specific change, for example: a dated release note, new product launch, new enterprise customer page, pricing change, policy update, funding announcement, benchmark release, integration launch, partnership, or regulatory action.

## Full-Text Integrity Rules

For each Raw item, verify:

- `full_text` exists and is not just navigation, cookie text, footer text, title-only text, or AI HOT summary.
- `clean_text` is derived from available evidence, not invented.
- Markdown snapshot and JSON evidence object exist when the item is used downstream.
- `full_text_hash` or equivalent content hash exists for downstream-worthy items.
- `key_excerpts` point to evidence inside `full_text` or captured visible text.
- If extraction failed, `capture_scope`, `fallback_used`, and `missing_information` explain the limitation.

Downstream core use requires:

```text
has_full_text = true
extraction_quality = high | medium
source_level = S | A | B
clear business change
```

## Coverage Rules

Check whether the day used the three monitoring lanes:

1. AI HOT recent 24h / all-mode as discovery.
2. follow-builders full daily scan as viewpoint/frontier signal intake.
3. Keyword monitoring and web search for S/A/B evidence and topic coverage.

Do not force equal proportions. follow-builders may only provide around 15 useful items per day because the builder set is limited. The QC target is coverage quality, not a fixed percentage.

The audit must identify:

- Missing high-value overseas S/A sources.
- Missing official product/release sources.
- Missing A-grade media or analyst/research sources.
- Missing developer/research ecosystem sources when the day's topic is technical.
- Missing financing/VC/customer/regulation sources when relevant.
- Over-concentration in one theme, vendor, country, or keyword family.

## Scorecard

Use a 100-point score. Passing requires score `>= 85` and no P0 blockers.

| Dimension | Points |
|---|---:|
| Raw count and acquisition completeness | 10 |
| Full-text / snapshot / hash integrity | 20 |
| S/A/B source quality and overseas first-line coverage | 20 |
| Relevance and business-signal density | 15 |
| Discovery-channel separation and回源 compliance | 10 |
| Keyword path and source diversity coverage | 10 |
| Pool routing correctness | 10 |
| Monitor log traceability | 5 |

Result policy:

| Score | Result | Downstream Decision |
|---:|---|---|
| 90-100 | passed | Allow downstream tasks |
| 85-89 | passed_with_notes | Allow, but list repair notes |
| 75-84 | repair_required | Repair before assets/articles |
| 60-74 | blocked | Rerun or补采 |
| <60 | blocked | Manual intervention |

Any P0 makes the result `blocked` regardless of score.

## Audit Procedure

1. Count Raw, Pool, source types, source levels, and routes.
2. Sample all `core_pool` and all frontstage candidates; if too many, inspect at least the highest-priority 20 plus all suspicious homepage/tool/directory items.
3. Check `full_text`, snapshot, JSON evidence, hash, source URL, origin URL, extraction quality, source level and usable routes.
4. Identify materials that should be downgraded to `index_only`, `watchlist`, `discovery_only`, or `discard`.
5. Verify AI HOT / follow-builders / HN / X / Reddit items回源 to original sources before factual use.
6. Verify overseas S/A first-line coverage for the day's main themes.
7. Verify keyword-monitoring coverage and any fallback reasons.
8. Decide downstream permission.
9. Output a Markdown QC report.

## Markdown QC Output

Write the report to:

```text
agent-workflow/reports/<YYYY-MM-DD>-guanlan-daily-monitor-qc.md
```

Use this structure:

```md
# Guanlan Daily Monitor QC Report

## 1. Summary

- Date:
- Result: passed / passed_with_notes / repair_required / blocked
- Score:
- Downstream decision: allow / allow_with_degradation / block
- Biggest issue:

## 2. Metrics

| Metric | Value | Required | Result |
|---|---:|---:|---|
| Raw count |  | >=150 active candidates |  |
| Pool count |  | >=75 total / >=60 routed |  |
| Core pool count |  | >=30 usable `core_pool` |  |
| Raw with full_text |  | >= 80% overall, >= 90% core |  |
| Core S/A/B count |  | sufficient for main themes |  |
| S/A overseas first-line coverage |  | required for main themes |  |
| M-source-only core items |  | 0 |  |
| Homepage/directory core items |  | 0 |  |

## 3. Hard Gates

| Gate | Triggered | Evidence | Required Fix |
|---|---|---|---|

## 4. Raw Quality Findings

| Raw ID / File | Problem | Current Route | Correct Route | Fix |
|---|---|---|---|---|

## 5. Full-Text And Snapshot Audit

| Item | full_text | snapshot | hash | extraction_quality | Fix |
|---|---|---|---|---|---|

## 6. Source Coverage

| Theme | Current Sources | Missing S/A Sources | Search / Refetch Needed |
|---|---|---|---|

## 7. Misclassified Core Materials

List homepage, tool-page, directory, SEO, search-result or discovery-only items that were promoted incorrectly.

## 8. Channel Balance And Keyword Path

- AI HOT:
- follow-builders:
- keyword search:
- external search:
- failed sources:
- fallback used:
- evidence gaps:

## 9. Downstream Permission

- `guanlan-raw-pool-card`:
- Signal Card generation:
- Relationship graph inputs:
- Trend candidate generation:
- Business Signals frontstage data:

## 10. Required Repair Prompt

Write a direct prompt for the next agent or automation rerun. Include exact files, Raw IDs, source gaps, refetch targets, downgrade actions and rerun checks.
```

## Repair Rules

When blocked, require one or more actions:

- Refetch original URL and save `full_text`.
- Replace AI HOT/follow-builders summary with original source Raw.
- Downgrade homepage/tool/directory/search-result materials to `index_only`.
- Delete or quarantine duplicate/noise Raw entries.
- Add S/A overseas first-line sources for the main theme.
- Add official release/blog/docs when available.
- Add A-grade media or research sources when official sources are insufficient.
- Rerun keyword monitoring for missing groups.
- Rewrite monitor log with `failed_sources`, `fallback_used`, `evidence_gaps`, source distribution and downstream risk.

Never repair by inventing evidence, rewriting raw text, or promoting weak materials just to pass quantity targets.

## Downstream Blocking Language

Use precise decisions:

```text
allow: Raw / Pool quality is sufficient for downstream tasks.
allow_with_degradation: downstream may proceed only using listed S/A/B items; blocked items must be ignored.
block: downstream Signal Cards, relationship graph inputs, trend candidates, and Business Signals frontstage data must pause until repair.
```

If the monitor is blocked, do not say the daily monitoring task is complete.
