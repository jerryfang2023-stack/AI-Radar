# Trend Radar V1 Contract

Version: `TRADAR-V1.0.0-factual-change-explorer`

Trend Radar is a downstream application projection of accepted Data Center V4 facts. It organizes factual changes by accepted batch date (`dataDate`) and never writes back to canonical data.

## Inputs

- `data-center-v4-frontstage.json` accepted canonical events, verified entities, classifications, Claims, sources and factual relationships.
- Accepted publication states: `verified` and `partial` only.
- Community Intelligence, First-Line Viewpoints, V3 Cards, trend candidates and opportunity signals are forbidden inputs.

## Periods

- Day: five factual groups — financing, deployment, partnership, product/service and hardware — plus a disclosed count of accepted events outside those groups.
- Week: calendar Monday through Sunday. It may show entities with at least two tracked changes, new deployments, products first observed in a verified `serves` customer relationship, and first-observed classification links.
- Month: factual event/category counts, equal-day comparison with the previous calendar month only when every comparison-window batch day is observed, new verified company/product entities with first-event IDs, financing disclosure coverage, classification distributions and a deployment index.

Every computed record must carry resolvable event IDs. Every projected event must retain Claim IDs, SourceArtifact IDs and a source URL.

## Boundaries

- `dataDate` means the date the data center accepted the record, not necessarily the occurrence date.
- Sparse periods must expose observed data days; missing days are not zero-activity evidence.
- No importance, value, opportunity, score, recommendation, maturity, heat, direction, ranking or representative-case judgment.
- No currency aggregation across currencies. Financing amount disclosure is reported only as a coverage count.
- The page links to event/entity details and original sources; it does not publish a narrative report.

## Ownership

- Generator: `01-SiteV2/site/scripts/build-trend-radar-frontstage.mjs`
- Frontstage data: `01-SiteV2/site/data/trend-radar-v1.json`
- Page: `01-SiteV2/site/trend-radar.html`
- Gate: `agent-workflow/tools/assert-trend-radar-v1.mjs`
- Skill: `agent-workflow/skills/guanlan-trend-radar-updater/`
