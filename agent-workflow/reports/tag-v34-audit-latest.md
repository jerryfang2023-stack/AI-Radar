# V3.4 Tag System Audit

Generated at: 2026-07-02T04:05:02.239Z

## Result

- Taxonomy tags: 74
- Taxonomy version: TAG-V1.1.0-v34-layered-taxonomy
- Signal Cards audited: 677
- Multi-track Signal Cards: 0
- Signal Cards carrying stage tags: 0
- Track cleanup dry-run rows: 8
- Opportunity rows with overly broad fields: 1
- Frontstage display tag violations: 0
- Frontstage aggregation boundary violations: 0
- Frontstage opportunity field over-limit rows: 0
- First-Line private tag violations: 0
- Community private tag boundary violations: 0

## High Coverage Tags

| tag | count | coverage |
| --- | --- | --- |
| customer-enterprise | 518 | 77% |
| track-enterprise-workflow | 485 | 72% |
| evidence-customer-adoption | 328 | 48% |
| track-ai-infra | 304 | 45% |
| evidence-product-launch | 270 | 40% |
| function-engineering | 221 | 33% |
| customer-developer-team | 220 | 33% |
| track-ai-coding | 219 | 32% |

## Signal Card Missing Required Tag Groups

| group | count |
| --- | --- |
| track | 0 |
| evidence | 0 |

## Multi-Track Samples

None.

## Stage Tags On Signal Cards

None.

## Track Cleanup Dry Run

| file | id | title | current | suggested |
| --- | --- | --- | --- | --- |
| 01-SiteV2/knowledge/01-Signal-Cards/case/2026-07-02--signal--adk-2-0-auto-signal-p-007.md | SIG-20260702-A03 | 我们为何构建ADK 2.0 | track-ai-agent, track-ai-coding | track-ai-coding |
| 01-SiteV2/knowledge/01-Signal-Cards/case/2026-07-02--signal--cloudflare-auto-signal-p-040.md | SIG-20260702-A01 | Cloudflare 推出全新AI流量管理选项：区分搜索、智能体与训练爬虫，保护广告页面 | track-ai-agent, track-enterprise-workflow | track-enterprise-workflow |
| 01-SiteV2/knowledge/01-Signal-Cards/case/2026-07-02--signal--genkit-auto-signal-p-010.md | SIG-20260702-A07 | 用 Genkit 构建智能体全栈应用 | track-ai-agent, track-ai-coding, track-enterprise-workflow | track-ai-coding, track-enterprise-workflow |
| 01-SiteV2/knowledge/01-Signal-Cards/case/2026-07-02--signal--google-2026-6-ai-auto-signal-p-003.md | SIG-20260702-A02 | Google 2026年6月AI更新汇总 | track-ai-agent, track-ai-customer-service | track-ai-customer-service |
| 01-SiteV2/knowledge/01-Signal-Cards/product-service/2026-07-02--signal--cloudflare-auto-signal-p-041.md | SIG-20260702-A04 | Cloudflare 推出两项新举措，让 AI 搜索更智能 | track-ai-agent, track-enterprise-workflow | track-enterprise-workflow |
| 01-SiteV2/knowledge/01-Signal-Cards/product-service/2026-07-02--signal--gemini-spark-google-mac-auto-signal-p-008.md | SIG-20260702-A06 | Gemini Spark，Google 智能体助手，现已登陆 Mac | track-ai-agent, track-enterprise-workflow | track-enterprise-workflow |
| 01-SiteV2/knowledge/01-Signal-Cards/product-service/2026-07-02--signal--ithome-auto-signal-p-061.md | SIG-20260702-A08 | 瑞银：约六成企业收紧 AI 开支，DeepSeek 等开源大模型有望受益 | track-ai-agent, track-enterprise-workflow, track-ai-infra | track-ai-infra, track-enterprise-workflow |
| 01-SiteV2/knowledge/01-Signal-Cards/product-service/2026-07-02--signal--techcrunch-auto-signal-p-001.md | SIG-20260702-A05 | Ashton Kutcher离开Sound Ventures，与Morgan Beller共同创办新VC基金 | track-ai-agent, track-ai-infra | track-ai-infra |

## Opportunity Missing Fields

| key | count |
| --- | --- |
| delivery_model | 519 |
| product_form | 414 |
| adoption_evidence | 326 |
| specific_task | 217 |
| buyer_or_user | 19 |

## Opportunity Broad Rows

| file | id | title | fields |
| --- | --- | --- | --- |
| 01-SiteV2/knowledge/01-Signal-Cards/product-service/2026-07-02--signal--ithome-auto-signal-p-061.md | SIG-20260702-A08 | 瑞银：约六成企业收紧 AI 开支，DeepSeek 等开源大模型有望受益 | business_action:4 |

## Current Site Aggregation

- File: 01-SiteV2/site/data/v3-data-observation-desk.json
- Active date: 2026-07-02
- Cards: 220
- Frontstage Cards: 220
- Allowed tag count: 69
- Formal tags layer: Backend search, filtering, relationship graph assistance, and trend candidate context. Frontstage display is bounded and high-signal only.
- Opportunity signals layer: Reports Center / Opportunity System source-near fields. These replace old formal_tags aggregation for opportunity maps.

### Current Tag Associations

| tag | label | todayCount | last30Count |
| --- | --- | --- | --- |
| track-enterprise-workflow | 企业工作流 | 5 | 103 |
| evidence-customer-adoption | 客户采用 | 4 | 74 |
| evidence-product-launch | 产品发布 | 4 | 119 |
| customer-developer-team | 开发团队 | 2 | 91 |
| evidence-partnership-integration | 合作集成 | 2 | 33 |
| function-engineering | 工程研发 | 2 | 91 |
| track-ai-coding | AI Coding | 2 | 91 |
| track-ai-infra | AI 基础设施 | 2 | 114 |

### Current Trend Links

| window | tag | label | cardCount |
| --- | --- | --- | --- |
| 7 天 | track-enterprise-workflow | 企业工作流 | 10 |
| 7 天 | evidence-customer-adoption | 客户采用 | 9 |
| 7 天 | evidence-product-launch | 产品发布 | 9 |
| 7 天 | track-ai-infra | AI 基础设施 | 7 |
| 7 天 | customer-developer-team | 开发团队 | 4 |
| 7 天 | function-engineering | 工程研发 | 4 |
| 7 天 | scenario-agent-governance | Agent 权限治理 | 4 |
| 7 天 | track-ai-coding | AI Coding | 4 |
| 30 天 | evidence-product-launch | 产品发布 | 119 |
| 30 天 | track-ai-infra | AI 基础设施 | 114 |
| 30 天 | track-enterprise-workflow | 企业工作流 | 103 |
| 30 天 | customer-developer-team | 开发团队 | 91 |
| 30 天 | function-engineering | 工程研发 | 91 |
| 30 天 | track-ai-coding | AI Coding | 91 |
| 30 天 | evidence-customer-adoption | 客户采用 | 74 |
| 30 天 | track-enterprise-data | 企业数据智能 | 48 |

### Frontstage Display Tag Violations

None.

### Frontstage Aggregation Boundary Violations

None.

### Frontstage Opportunity Field Over-Limit Rows

None.

## First-Line Viewpoints Tags

| key | count |
| --- | --- |
| opinion-product-strategy | 36 |
| track-enterprise-workflow | 36 |
| source-social | 32 |
| source-blog | 16 |
| opinion-ai-coding | 8 |
| track-ai-coding | 8 |
| opinion-agent-workflow | 2 |
| opinion-model-infra | 2 |
| track-ai-agent | 2 |
| track-ai-infra | 2 |

### First-Line Invalid Tag Groups

None.

### First-Line Missing Required Groups

None.

## Community Placeholder Values

| key | count |
| --- | --- |
| monetization:待确认 | 12 |
| industry:未识别行业 | 6 |

### Community Missing Private Fields

None.

### Community Business Tag Leaks

None.

## Recommended Cleanup Policy

- Treat track-ai-agent as domain background when it appears with a more specific track.
- Keep no more than 3 track tags per Signal Card; prefer the most specific vertical or workflow track.
- Keep stage tags out of ordinary Signal Card frontstage display and aggregation.
- Keep Reports Center opportunity maps on source-backed opportunity_signals, not formal_tags.
- Keep First-Line Viewpoints on private opinion / track / source tags.
- Keep Community Intelligence on private scene / industry / tools / monetization labels.
- Review opportunity rows with more than 3 values in any field before using them for map cells.
