status: resolved
resolved_at: 2026-06-15T19:30:00+08:00
resolver: codex
fix_commit: c9594c10
validation: verified all 4 items on current HEAD
prevention_added: memory
priority: medium
lane: site_version
category: site_v337_weekly_report_integration
failed_gate: n/a
report_path: n/a
data_generated: n/a
needed_action: update version-ledger.md + AGENTS.md to SITE-V3.3.7, create weekly report infrastructure, add Intelligence Map navigation entry
created_at: 2026-06-15T16:30:00+08:00
updated_at: 2026-06-15T16:30:00+08:00
resolved_at:
resolver:
fix_commit:
validation:
prevention_added:
source: hermes-manual

# Hermes Repair Request: SITE-V3.3.7 Weekly Report Integration

## Problem Summary

Website version has been upgraded to **SITE-V3.3.7-weekly-report-intelligence-map**, but several files have not been updated to reflect the new version:

1. **context/version-ledger.md** still says V3.3.6.3
2. **AGENTS.md** still says V3.3.6.3
3. **Weekly report files do not exist**: `01-SiteV2/content/08-report/` directory and `01-SiteV2/site/weekly-ai-business-change-radar.html` detail page are missing from both local and remote
4. **Intelligence Map navigation** (`01-SiteV2/site/intelligence-map.html`) has no Weekly Report sub-section entry yet

## Required Changes

### 1. Version Documentation Updates

| File | Current Value | Required Value |
|:-----|:--------------|:---------------|
| `context/version-ledger.md` | V3.3.6.3-business-source-artifact-aggregation | SITE-V3.3.7-weekly-report-intelligence-map |
| `AGENTS.md` (Current Version section) | V3.3.6.3 | SITE-V3.3.7 |

In `context/version-ledger.md`, update the version table and add the new Weekly Report page to the Current Pages table.

### 2. Weekly Report Infrastructure

Create the following new files:

**`01-SiteV2/content/08-report/` directory** — contains weekly report data sources and markdown content. Structure TBD, but at minimum should include the first weekly report.

**`01-SiteV2/site/weekly-ai-business-change-radar.html`** — the detail page for the weekly report. A standalone HTML page similar to the existing frontstage pages, showing:
- Weekly AI business change radar report
- Trends and signals summary
- Links to related Business Signals cards

### 3. Intelligence Map Navigation Update

Add a Weekly Report sub-section entry in `01-SiteV2/site/intelligence-map.html`. The Intelligence Map page should link to the weekly report detail page.

## Context from SITE-V3.3.7 Release

- Business Signals data contract remains at V3.3.6.3 (Business Source Artifact Aggregation)
- Daily supervision continues with 3 main pipelines: Business Signals, First-Line Viewpoints, Community Intelligence
- Old outputs must NOT be restored: daily observation, business brief, long-form trend report, publiccopy/cardcopy gates, Guanlan copy-style gate
- The weekly report is a sub-section within the existing Intelligence Map, not a standalone navigation entry

## Location of Key Files

| File | Purpose |
|:-----|:--------|
| `context/version-ledger.md` | Version baseline and freeze points |
| `AGENTS.md` | Current entry router |
| `01-SiteV2/site/intelligence-map.html` | Intelligence Map page (needs Weekly Report entry) |
| `01-SiteV2/content/08-report/` | New weekly report content directory |
| `01-SiteV2/site/weekly-ai-business-change-radar.html` | New weekly report detail page |

## Related Inbox History

- 2026-06-15 V3.3.6.3 artifact aggregation release (source artifact pipeline)

## User Escalation

- The release is already declared active. Files need to catch up to match the declared version.
- Weekly report content structure TBD — may need user input on format.
