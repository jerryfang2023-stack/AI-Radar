---
name: guanlan-weekly-report-page-generator
description: Use when publishing, updating, or repairing an accepted WaveSight weekly report after `guanlan-weekly-business-change-radar`. Generates the stable WaveSight compatibility redirect and verifies publication to the independent AI financing site. Do not use to write the weekly judgment itself or to recreate Guanlan Research/report HTML.
metadata:
  guanlan:
    version: "1.3.0"
    column_version: "REPORTS-V1.3.0-funding-portal"
    lane: "AI financing-site reports"
    status: "current sub-skill"
    order: 91
    responsibility: "Publish accepted weekly report Markdown to the AI financing site while retaining a stable WaveSight redirect."
    upstream: "accepted weekly report Markdown and evidence manifest"
    downstream: "funding-portal reports.json/report-bodies.json and WaveSight compatibility redirect"
    gates: "content acceptance, stable report ID, title/summary/body completeness, report-count and date non-regression, redirect regression, live readback"
    recent_learning: "Since 2026-08-10, Guanlan Research and duplicate report HTML are retired; accepted weekly Markdown publishes to the AI financing site and WaveSight writes redirects only."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Weekly Report Page Generator

## Purpose

Publish accepted weekly report Markdown through the independent AI financing site. WaveSight remains the source/evidence repository and owns compatibility URLs only; this Skill must never recreate the Guanlan Research hub or a duplicate report body.

The periodic controller invokes this Skill only after the weekly content gate passes. DeepSeek may generate Markdown content but must not edit redirects, navigation, portal data, or canonical facts.

## Required Reads

1. `context/version-ledger.md`
2. `context/frontstage-page-contracts.md`
3. Accepted source under `01-SiteV2/content/12-applications/industry-reports/`
4. `agent-workflow/tools/render-periodic-report-pages.mjs`
5. `context/08-automation.md`
6. `MEMORY.md`

## Workflow

1. Confirm the canonical source is named `YYYY-MM-DD--weekly-report--ai-business-change-radar.md`, has `content_type: weekly-report`, a valid `week`, `date`, `title`, `window`, and `status: published` after acceptance.
2. Run the weekly content gate before any publication write.
3. Run `node agent-workflow/tools/render-periodic-report-pages.mjs --kind=weekly --date=YYYY-MM-DD`. The writer must produce:
   - dated compatibility route → `https://www.zkdlj.vip/#report/weekly-YYYY-wNN`;
   - latest undated weekly alias when applicable;
   - `intelligence-map.html` redirect → `https://www.zkdlj.vip/#reports`.
4. Never hand-maintain report metadata or a report list. Final Closure dynamically scans every `status: published` report from WaveSight `origin/main` and generates portal `reports.json` plus `report-bodies.json`.
5. Verify the publication gate blocks report removal, newest-date regression, duplicate IDs, invalid type/date, missing title/summary, missing body, and metadata/body ID mismatch.
6. Verify live report metadata, newest ID, report count, and body count after the portal deploy. A failed live check must restore the previous VPS release.
7. Run the periodic renderer tests, frontstage regression, version consistency, and the portal publisher dry run.

## Hard Rules

- WaveSight report Markdown is the content source; `agent-workflow/reports/` is not a public source.
- `REPORTS-V1.3.0-funding-portal` is the only current report-publication version.
- Do not recreate Guanlan Research navigation, feature cards, archives, report selectors, V4 report shells, or duplicate report bodies.
- Preserve stable report IDs derived from `week`; never derive identity from a generic slug.
- Do not expose internal evidence IDs in portal prose.
- Opportunity Map and Direction Card failures cannot block accepted weekly report publication.
- Commit, push, and deployment require the authorized release workflow.

## Output

Report the source file, stable report ID and redirect, portal publication status, validation performed, and any remaining live-publication risk.

## Done When

The accepted Markdown remains complete, the WaveSight routes redirect to the correct stable hash, the portal dynamically includes matching metadata and body, non-regression gates pass, and live readback confirms the new or unchanged report inventory.
