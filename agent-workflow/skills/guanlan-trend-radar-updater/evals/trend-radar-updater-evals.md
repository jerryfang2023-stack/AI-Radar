# Trend Radar Updater Evals

## Eval 1 — evidence lineage

Given a generated daily period, every event ID resolves and every event retains Claim IDs, SourceArtifact IDs and an original URL. Fail on any orphan.

## Eval 2 — exact daily counts

Recompute the five category counts from accepted projected events with the same `dataDate`. They must equal the stored counts exactly.

## Eval 3 — sparse coverage

For a week with fewer than seven observed batch dates, the page must disclose the observed dates and must not describe missing days as zero activity.

## Eval 4 — boundary rejection

Reject any output field or page copy containing opportunity score, heat, maturity, recommendation, advice, judgment, First-Line Viewpoints, Community Intelligence, V3 Cards or trend-candidate input.

## Eval 5 — report separation

The page provides filters, counts, comparisons and evidence links. It must not produce a long-form weekly/monthly report or own Industry Reports archives.
