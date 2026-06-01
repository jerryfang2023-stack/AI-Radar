---
name: guanlan-daily-monitor
description: "Use when running, updating, auditing, or repairing WaveSight AI daily monitoring. It handles source discovery, Raw capture, Pool candidates, monitor logs, evidence gaps, and QC handoff. It does not write articles or generate full cards."
---

# Guanlan Daily Monitor

## Use For

- Running daily monitoring.
- Updating monitoring source rules.
- Auditing Raw / Pool quality.
- Repairing monitor runs.
- Preparing downstream QC handoff.

Do not use this skill to write 今日观察, generate cards, write trend reports, publish the site, deploy, or push GitHub.

## Required Reads

Daily startup reads only:

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `context/07-card-asset-stage-model.md`
4. `skills/guanlan-monitor-quality-gate/SKILL.md`
5. `skills/guanlan-daily-monitor-qc/SKILL.md`

Open these only when changing rules or debugging a specific failure:

- `agent-workflow/product/daily-monitoring-playbook.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/evidence-and-routing-rules.md`
- `01-SiteV2/content/11-databases/keyword-monitoring-v2.json`
- `01-SiteV2/content/11-databases/source-registry-v2.json`
- `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`

## Execution

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=<YYYY-MM-DD> --pass-score=80 --max-cycles=3 --search-limit=70 --search-path-query-limit=2 --gdelt-query-limit=8 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000
```

Use Asia/Shanghai date unless the user gives another date.

## Source Rules

`S/A/B/C/D/M` only identifies source type. It is not a value score and not a core-evidence hard gate.

- S: overseas first-party event source.
- A: high-quality reporting or research.
- B: vertical, funding, ecosystem, startup, marketplace or industry source.
- C: community, opinion, feedback or discussion.
- D: noise, SEO or non-event page.
- M: acquisition entrance.

Do not add value because a source is S/A/B, and do not require S/A/B for core evidence. Value comes from six WaveSight importance types: important cases, important funding events, important technical trends, important products or services, important vertical industry solutions, and important viewpoints / articles.

Procurement, budget, revenue, regulation, lawsuits, compliance and risk are supporting signals only. They must not promote an item by themselves.

## Curated Entrances

AI HOT daily:

- full retention in Raw candidate and Pool index;
- higher capture priority;
- not automatic `core_pool`;
- must be checked against original text, page type and usable evidence object.

follow-builders:

- full daily scan;
- higher capture priority;
- default output is frontier opinion;
- proves who said what, not company facts.

## Search Rules

Keyword search must emphasize:

- important cases;
- important funding events;
- important technical trends;
- important product or service launches;
- important vertical industry solutions;
- important industry-shaping viewpoints, speeches or articles;
- selective procurement / regulation / counter-evidence only when it supports an important case, technical trend, vertical solution or market-shaping article.

HN / Reddit / X are community feedback only. They must not dominate keyword-search results.

Search paths describe intent only. The fetched page still needs page-type and evidence checks.

## Layered Search And Lane Governance

Daily monitoring uses six importance lanes, not one random shared search pool:

- `important_case`: customer cases, deployments and repeatable workflow changes.
- `important_funding`: funding events, investors, rounds, valuation and market direction.
- `important_technical_trend`: model, benchmark, paper, open-source, infrastructure and cost-structure changes.
- `important_product_or_service`: product launches, APIs, platforms and commercialized capabilities.
- `important_vertical_solution`: named industry plus deliverable solution, workflow or customer scene.
- `important_viewpoint_or_article`: industry-shaping speeches, essays, interviews or research opinions.

Raw must try to cover all six lanes. Core Pool must not force quota filling: each lane may contribute up to 2-3 strong items, but a lane with no qualified item remains empty and is reported as a coverage gap.

Search priority:

1. AI HOT, follow-builders, registered RSS and official source registry.
2. Whitelisted official / high-signal domains.
3. Vertical APIs or structured databases when configured.
4. GDELT / A-media verification.
5. Semantic or agent search providers such as Anysearch / Tavily / Exa when configured.
6. Bing or generic web search only as fallback discovery.

Anysearch, Tavily, Exa, Bing, DuckDuckGo or any generic search result is discovery only. It must resolve to original evidence, pass Raw QC, pass page-type checks and match a six-lane importance type before `core_pool`.

Active provider order:

- Semantic keyword discovery: Anysearch -> Tavily -> Exa -> DuckDuckGo -> Bing fallback.
- A-media / news verification: GDELT -> Anysearch -> Tavily / Exa -> DuckDuckGo / Bing fallback.
- NewsAPI is retired from the current path; do not require or document `NEWSAPI_KEY`.

Freshness and dedupe:

- Tavily / Exa / Anysearch / GDELT must normalize provider date fields into `published_at` before freshness comparison.
- Invalid dates, isolated years, tracking ids and social activity ids must stay blank rather than being treated as publication dates.
- Search results must dedupe across provider entrances by canonical URL and by source-family title/date fingerprint, especially Reuters, financing-wire posts, product pages and company announcements.

Keyword-search result pre-gate must reject dictionary, translation, pronunciation, HTML tag reference, tutorial, search result, directory, SEO and tool-navigation pages before Raw capture.

## Hard Downgrades

Default to `index_only` unless the same page contains a dated concrete action:

- official homepage;
- product / demo page;
- product directory;
- docs / API / SDK directory;
- pricing navigation page;
- GitHub README / repo index;
- Hugging Face / npm / PyPI package or model page;
- marketplace listing;
- console / login page;
- search-result page;
- AI tool directory;
- Chinese SEO page;
- Baidu / Alibaba Cloud / Tencent Cloud / Huawei Cloud / Volcengine homepage.

## Raw Targets

Raw is a range, not a fixed count.

- Normal: 80-150.
- Degraded: 50-80 with written reason.
- Below 50: downstream blocked unless QC explicitly allows degradation.

Do not cap normal days at 100 just for stability.

## B Source Rule

B sources with original text can be used as evidence. They do not need mandatory S/A backfill.

They still need concrete event or change evidence. A page existing is not enough.

## Raw-to-Pool Routing

Source Layer Governance includes Raw-to-Pool routing governance.

Run Raw-to-Pool as an evidence gate before any content use:

1. Normalize `source_level` and `acquisition_source_level`; do not use S/A/B/C/D/M as value bonuses or core-evidence hard gates.
2. Hard-downgrade homepage, directory, README, package, model, pricing-navigation, login, marketplace listing, search-result and SEO pages to `index_only` unless the same page proves a dated concrete action.
3. Allow `core_pool` only when the Raw item has original URL, readable full text, `extraction_method`, `readability_score >= 24`, high/medium extraction quality, non-index evidence object, content hash, full text hash, key excerpts, `raw_qc_decision=allow`, `importance_score >= 4`, and `importance_type` is one of the six core importance types.
4. Route non-core items explicitly: `watchlist` for trackable but incomplete leads, `index_only` for homepage/directory/package/model/search/SEO or entrance-only records, and `discard` for blocked or unusable records. `discard` means excluded from downstream use, not file deletion.
5. Route HN / Reddit / X / forum / issue feedback labels must not prove company facts alone.
6. Keep AI HOT daily and follow-builders selected items as higher-priority candidates, but evidence-gate them before `core_pool`.
7. After routing, check six `importance_type` coverage. Fill gaps by refetching or searching, not by promoting weak pages.

Detailed rules live in `agent-workflow/product/evidence-and-routing-rules.md`.

`importance_score` rubric:

- 1-2: archive, index or supporting context only.
- 3: plausible but not core-ready.
- 4: concrete important change in one of the six importance types.
- 5: major platform, frontier lab, large customer, known investor, industry-shaping technical shift or high-impact market judgment.

Degradation caps:

- missing full text / snapshot: max `watchlist` or `index_only`.
- missing extraction method / low readability score: max `watchlist` or `index_only`.
- missing hash / excerpt: max `watchlist`.
- index-only or directory page: max `index_only`.
- discovery / feedback boundary: max `user_feedback_pool` for community material, otherwise `index_only` until origin evidence is captured.
- Raw QC block: `discard`, except AI HOT daily selected may remain `index_only`.

## Output Paths

Write monitoring outputs only:

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
01-SiteV2/content/05-frontier-opinions/
01-SiteV2/knowledge/02-Opinion-Cards/
agent-workflow/reports/
```

`05-frontier-opinions/` is the front-stage opinion stream index. `knowledge/02-Opinion-Cards/` is the long-term opinion asset library. Daily monitoring may prepare opinion entries, but it must not convert opinion claims into company facts.

## Downstream Boundary

Daily monitoring does not publish cards or decide frontstage display. After Raw / Pool QC is allowed:

- Pool-to-Card must run its own semantic gate, event-cluster dedupe and frontstage manifest generation.
- Frontstage cards are selected by `agent-workflow/reports/<YYYY-MM-DD>-frontstage-manifest.json`, not by scanning every generated file.
- Opinion entries with weak titles, social noise, broken translation or non-AI relevance remain `opinion_intake`; they must not be promoted to `opinion_card` only because a source was collected.
- Public card copy must not contain Raw / Pool / core_pool,入库, 证据链, 强证据, usable_for, pool_routes, gate, “押注 xxx”, “材料显示它”, “材料把资金用途指向”, or similar internal / mechanical phrasing.

## Required Log Fields

- `source_distribution`
- `raw_count_by_channel`
- `raw_count_by_source_type`
- `source_level_distribution`
- `keyword_search_path_distribution`
- `keyword_search_non_community_count`
- `theme_distribution`
- `theme_concentration_warning`
- `pool_route_distribution`
- `pool_index_route_distribution`
- `pool_index_count`
- `routed_pool_count`
- `non_core_pool_count`
- `index_only_pool_count`
- `aihot_index_only_count`
- `aihot_core_count`
- `importance_coverage_gaps`
- `pool_importance_coverage_gaps`
- `failed_sources`
- `fallback_used`
- `evidence_gaps`

## Verification

At minimum run:

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
```

If any check cannot run, state why and whether it blocks downstream use.

## Lane Volume Backfill

Six-lane monitoring must keep enough Raw candidates for Pool selection:

- Raw minimum per required importance type: 3.
- Raw target per required importance type: 5.
- Pool minimum per required importance type: 1.
- Core Pool maximum per required importance type: 3.
- Core Pool must not be force-filled.

When a lane is below 3 Raw candidates, expand only that lane with provider/search backfill. Do not relax evidence, page-type, Raw QC or Core Pool gates.
