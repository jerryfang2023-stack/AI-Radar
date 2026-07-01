# V3.4 Tag System Audit

Generated at: 2026-07-01T09:26:17.843Z

## Result

- Taxonomy tags: 74
- Signal Cards audited: 669
- Multi-track Signal Cards: 0
- Signal Cards carrying stage tags: 0
- Track cleanup dry-run rows: 0
- Opportunity rows with overly broad fields: 0

## High Coverage Tags

| tag | count | coverage |
| --- | --- | --- |
| customer-enterprise | 513 | 77% |
| track-enterprise-workflow | 480 | 72% |
| source-industry-data | 440 | 66% |
| evidence-customer-adoption | 324 | 48% |
| track-ai-infra | 301 | 45% |
| evidence-product-launch | 266 | 40% |
| function-engineering | 219 | 33% |
| customer-developer-team | 218 | 33% |
| track-ai-coding | 217 | 32% |

## Signal Card Missing Required Tag Groups

| group | count |
| --- | --- |
| track | 0 |
| evidence | 0 |
| source | 0 |

## Multi-Track Samples

None.

## Stage Tags On Signal Cards

None.

## Track Cleanup Dry Run

None.

## Opportunity Missing Fields

| key | count |
| --- | --- |
| delivery_model | 513 |
| product_form | 408 |
| adoption_evidence | 322 |
| specific_task | 215 |
| buyer_or_user | 17 |

## Opportunity Broad Rows

None.

## Current Site Aggregation

- File: 01-SiteV2/site/data/v3-data-observation-desk.json
- Active date: 2026-07-01
- Cards: 214
- Top10: 10
- Allowed tag count: 69

### Current Tag Associations

| tag | label | todayCount | last30Count |
| --- | --- | --- | --- |
| evidence-product-launch | 产品发布 | 3 | 121 |
| customer-developer-team | 开发团队 | 2 | 92 |
| evidence-customer-adoption | 客户采用 | 2 | 73 |
| function-engineering | 工程研发 | 2 | 92 |
| scenario-agent-governance | Agent 权限治理 | 2 | 43 |
| scenario-knowledge-base | 知识库问答 | 2 | 49 |
| track-ai-coding | AI Coding | 2 | 92 |
| track-ai-governance | AI 治理 | 2 | 42 |

### Current Trend Links

| window | tag | label | cardCount |
| --- | --- | --- | --- |
| 7 天 | evidence-product-launch | 产品发布 | 22 |
| 7 天 | track-enterprise-workflow | 企业工作流 | 17 |
| 7 天 | track-ai-infra | AI 基础设施 | 15 |
| 7 天 | customer-developer-team | 开发团队 | 13 |
| 7 天 | function-engineering | 工程研发 | 13 |
| 7 天 | track-ai-coding | AI Coding | 13 |
| 7 天 | evidence-customer-adoption | 客户采用 | 10 |
| 7 天 | scenario-knowledge-base | 知识库问答 | 7 |
| 30 天 | evidence-product-launch | 产品发布 | 121 |
| 30 天 | track-ai-infra | AI 基础设施 | 114 |
| 30 天 | track-enterprise-workflow | 企业工作流 | 104 |
| 30 天 | customer-developer-team | 开发团队 | 92 |
| 30 天 | function-engineering | 工程研发 | 92 |
| 30 天 | track-ai-coding | AI Coding | 92 |
| 30 天 | evidence-customer-adoption | 客户采用 | 73 |
| 30 天 | scenario-knowledge-base | 知识库问答 | 49 |

## First-Line Viewpoints Tags

| key | count |
| --- | --- |
| opinion-product-strategy | 35 |
| track-enterprise-workflow | 35 |
| source-social | 25 |
| source-blog | 18 |
| opinion-agent-workflow | 4 |
| track-ai-agent | 4 |
| opinion-ai-coding | 2 |
| opinion-model-infra | 2 |
| track-ai-coding | 2 |
| track-ai-infra | 2 |

## Community Placeholder Values

| key | count |
| --- | --- |
| monetization:待确认 | 11 |
| industry:未识别行业 | 6 |

## Recommended Cleanup Policy

- Treat track-ai-agent as domain background when it appears with a more specific track.
- Keep no more than 3 track tags per Signal Card; prefer the most specific vertical or workflow track.
- Keep stage tags out of ordinary Signal Card frontstage display and aggregation.
- Keep Reports Center opportunity maps on source-backed opportunity_signals, not formal_tags.
- Review opportunity rows with more than 3 values in any field before using them for map cells.
