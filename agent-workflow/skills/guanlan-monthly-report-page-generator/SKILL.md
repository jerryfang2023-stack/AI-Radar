---
name: guanlan-monthly-report-page-generator
description: Use when publishing, updating, or repairing an accepted WaveSight monthly report after `guanlan-monthly-business-structure-report`. Generates the stable WaveSight compatibility redirect and verifies complete publication to the independent AI financing site. Do not use for writing the monthly judgment, recreating Guanlan Research, or generating duplicate monthly HTML.
metadata:
  guanlan:
    version: "1.3.0"
    column_version: "REPORTS-V1.3.0-funding-portal"
    lane: "AI financing-site reports"
    status: "current sub-skill"
    order: 96
    responsibility: "Publish complete accepted monthly report Markdown to the AI financing site while retaining a stable WaveSight redirect."
    upstream: "accepted monthly report Markdown and evidence manifest"
    downstream: "funding-portal reports.json/report-bodies.json and WaveSight compatibility redirect"
    gates: "content acceptance, stable report ID, full body completeness, report-count and date non-regression, redirect regression, live readback"
    recent_learning: "Since 2026-08-10, complete monthly reports live on the AI financing site; WaveSight retains canonical Markdown, evidence, generation records, and redirects only."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Monthly Report Page Generator

## Purpose

Publish a complete accepted monthly report through the independent AI financing site. WaveSight owns the Markdown source, evidence, and generation records; it must not keep a second monthly reading surface.

The periodic controller invokes this Skill only after the monthly content gate passes. DeepSeek generates bounded Markdown only and must not edit portal data, redirects, navigation, or canonical facts.

## Required Reads

1. `context/version-ledger.md`
2. `context/frontstage-page-contracts.md`
3. Accepted source under `01-SiteV2/content/12-applications/industry-reports/monthly/`
4. `agent-workflow/tools/render-periodic-report-pages.mjs`
5. `context/08-automation.md`
6. `MEMORY.md`

## Workflow

1. Confirm the canonical source is named `YYYY-MM-DD--monthly-report--ai-business-structure-and-opportunity.md`, has `content_type: monthly-report`, a valid `month`, `date`, `title`, `window`, and `status: published` after acceptance.
2. Run the monthly content gate before any publication write.
3. Run `node agent-workflow/tools/render-periodic-report-pages.mjs --kind=monthly --date=YYYY-MM-DD`. The writer must map the route to `https://www.zkdlj.vip/#report/monthly-YYYY-MM` and keep the archive compatibility redirect at `#reports`.
4. Preserve the full report argument in Markdown. Final Closure dynamically scans published reports and generates portal metadata plus complete bodies; never shorten the body to a local summary or hand-maintain report inventory.
5. Verify duplicate IDs, date regression, report removal, invalid title/summary, missing body, and metadata/body mismatch fail closed.
6. Verify live newest ID, report count, and body count after atomic VPS deployment. Restore the prior release if readback fails.
7. Run the monthly content tests, periodic redirect tests, frontstage regression, version consistency, and portal publisher dry run.

## Hard Rules

- `REPORTS-V1.3.0-funding-portal` is the only current report-publication version.
- Do not recreate Guanlan Research, monthly feature cards, archives, selectors, V4 report shells, styled local tables, or duplicate report bodies.
- Preserve the complete monthly Markdown and stable ID derived from `month`.
- Do not expose internal evidence IDs in portal prose.
- Opportunity Map and Direction Card failures cannot block accepted monthly publication.
- Commit, push, and deployment require the authorized release workflow.

## Output

Report the source file, stable report ID and redirect, complete portal-body status, validation performed, and remaining live-publication risk.

## Done When

The complete accepted monthly Markdown remains canonical, the WaveSight route redirects to the correct stable hash, portal metadata and body match, non-regression gates pass, and live readback confirms the published inventory.
