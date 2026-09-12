---
name: guanlan-china-funding-monitor
description: Use when running, repairing or checking the independent domestic AI financing lane, publisher coverage, accepted evidence and company/product/institution synchronization. Do not use for overseas monitoring, unrelated company enrichment or a news-reading UI proposal.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "China Funding"
    status: "current"
    order: 41
    responsibility: "Monitor domestic financing independently and synchronize governed factual and application projections."
    upstream: "domestic publishers and original announcements"
    downstream: "private evidence, V4 facts, entities, funding cards and OPS quality"
    gates: "publisher execution coverage, original evidence, V4 integrity, entity and funding publication"
    recent_learning: "A registered domestic query can be truncated by the global first-five limit; execute and measure each publisher independently."
    mirrored_in_skill_store: false
    memory_required: false
---

# Guanlan China Funding Monitor

## Inputs

Read `AGENTS.md`, `context/12-data-center-v4.md`, `context/08-automation.md`, and `01-SiteV2/content/11-databases/china-funding-monitor-v1.json`. Resolve the date in Asia/Shanghai when omitted. Inspect the same-date `agent-workflow/reports/china-funding/<date>/` checkpoint and latest main before mutation. Use `guanlan-source-ingestion` for original-body capture rules and `guanlan-funding-insight-generator` for application acceptance.

## Workflow

1. The morning Business Signals workflow starts `.github/workflows/china-funding-pr.yml` alongside overseas production. Domestic collection has its own publisher budgets and discovery artifact. No extra evening schedule is needed.
2. For an authorized fresh collection run `node agent-workflow/tools/run-guanlan-daily-monitor.mjs --source-only=china-funding --date=<date> --source-artifact-dir=agent-workflow/reports/china-funding/<date>`. Record each publisher's attempted pages, queries, usable candidates and request failures, including empty results.
3. Execute `node agent-workflow/tools/run-china-funding-pipeline.mjs --date=<date>` in the owning workflow's isolated checkout, after acquiring the shared publication slot and reading latest main. It preserves originals privately, accepts exact-span Claims and Events, and rebuilds company/product history, investment institutions and funding projections through existing gates.
4. A failed downstream stage reuses the accepted private-evidence checkpoint. Use the workflow's `resume_run_id` to restore a failed run. Never recollect accepted inputs because generation, projection, merge or deployment failed. Source failures may be retried only as a named source-stage repair.
5. Inspect `china-funding-health-v1.json` and the protected OPS quality panel. Confirm unavailable, partial, failed and stale batches are distinct. Deduplicate events and cards across publishers by accepted IDs; candidate URLs are a different metric.
6. On authorized publication, merge the domestic PR synchronously before releasing the shared writer slot, deploy Pages, then use Final Closure's Funding Portal/Mini Program and OPS publication. Verify receipts and refresh the external Vault after accepted main synchronization.

## Boundaries

The owning scheduled workflow or explicit user request authorizes network collection, source capture, repository publication and deployment. For read-only checks, report without mutating. Stop the affected stage on missing credentials, unreadable originals, failed evidence gates or merge conflicts; leave last-good shared data intact and expose the failure in OPS.

Never infer China company geography from a Chinese publisher. Never treat fundraising plans, margin financing, LP fundraising, valuation or cumulative multi-round totals as a completed single financing round. Search snippets and lists are leads. Company, product and investor facts require captured evidence; unresolved products and aliases stay in the existing review queue, without fabricated entities or institutional names. Do not weaken funding-card gates to increase counts. Do not put full original bodies or credentials in the public repo, artifacts, Vault or OPS.

## Output

- Per-publisher discovery and reusable body-free intake/checkpoint under `agent-workflow/reports/china-funding/<date>/`.
- Existing governed V4, entity history, institution and funding projections, with source lineage.
- `01-SiteV2/site/data/china-funding-health-v1.json`, rendered inside protected OPS data quality.
- Release report distinguishing collected, accepted, synchronized, merged, deployed and blocked stages.

## Done When

Each enabled publisher has an execution result. Original evidence resolves privately; accepted events and entity projections pass their owning gates. Retries preserve accepted source input and latest main data. OPS shows the actual batch and failures. A publication request completes only after Git, Pages, Funding Portal/Mini Program and protected OPS verification; source capture alone is not completion.
