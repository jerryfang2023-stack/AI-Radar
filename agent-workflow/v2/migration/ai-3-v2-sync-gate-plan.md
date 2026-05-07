# ai-3 V2 Sync Gate Plan

Status: isolation plan. Do not modify production `ai-3`.

## Goal

Prepare a future sync gate that can validate V2 content before any website data output changes.

## Required Checks

- V2 source directories exist and are readable.
- HeatEvidence items trace back to source assets.
- AIBriefIssue evidence summaries trace to Signals, Points, Opportunities, Trends, or HeatEvidence.
- Point is calibration, not fact evidence.
- Legacy V1 fallback remains available.
- Failed V2 output does not overwrite V1 data.

## Suggested Future Gate Steps

1. Create a backup of current site data.
2. Parse V2 content into an isolated output object.
3. Validate HeatEvidence and AIBriefIssue relationships.
4. Write V2 data to `04-Site/data/v2/` only after validation.
5. Keep V1 `radar-data.*` unchanged until user-approved cutover.
6. On failure, leave previous data untouched and write a failure report.

## Blocking Failures

- Missing source traces.
- HeatEvidence relation breaks.
- AIBriefIssue without evidence summary.
- V2 output attempts to overwrite V1 data during isolation.

