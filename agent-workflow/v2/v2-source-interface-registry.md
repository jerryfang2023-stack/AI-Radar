---
title: V2 Source Interface Registry
date: 2026-05-08
type: v2-source-registry
status: active
task_id: WSD-20260508-10-v2-source-interface-upgrade-autopilot
owner: v2-source-intelligence / data / workflow
---

# V2 Source Interface Registry

## 1. 定位

本文件是观澜 AI V2 每日内容生产线的来源与接口登记册。

它解决三个问题：

1. 每天从哪里抓 Raw Candidate。
2. 哪些来源可以作为事实主证据，哪些只能作为线索。
3. 接口失败时如何降级，避免把单一搜索结果包装成多源结果。

机器可读版本：

```text
01-SiteV2/content/10-databases/source-registry-v2.json
```

## 2. 分层规则：采集通道与事实来源分离

| 等级 | 含义 | 可承担角色 |
|---|---|---|
| S | 一手事实来源 | fact-main |
| A | 高质量商业媒体 / 通讯社 / 权威研究 | fact-support |
| B | 产业、生态、开发者、融资、市场来源 | fact-support / lead-only |
| C | 社群、社媒、聚合和 Builder 线索 | lead-only / point-only / counter-evidence |
| D | 噪音或低可信来源 | 默认不启用 |
| M | 混合采集通道 | source-router |

硬规则：

- S/A/B/C/D 评价的是“解析后的原始来源”，不是获取方式本身。
- AI HOT、follow-builders、搜索引擎、HN 聚合页这类能力是 acquisition channel，不应被粗暴固定为 C 级来源。
- M 级代表 mixed acquisition channel：只负责发现候选、保留原始 URL、路由到二次搜索。
- C 级原始来源不能作为事实主证据。
- 聚合通道、社交通道和社区通道只能触发二次搜索；最终证据等级要落到原文 URL、官方公告、媒体报道、GitHub repo、论文或市场页面上。
- 每条 Front Signal 至少需要 3 个 S/A/B 来源。
- AI HOT 新源默认作为中文 AI 采集通道启用，但必须回看每条原始 URL。
- follow-builders 作为 Builder 采集通道，主要进入 Point / 观点校准或触发 S/A/B 补证。
- X / LinkedIn / Reddit 需要平台授权或用户明确许可时，默认不启用。

一句话：采集通道解决“从哪里发现更多候选”，来源等级解决“这条事实能不能被相信”。

## 3. 默认启用来源

| source_id | 来源 | 等级 | 接口 | 角色 | 用途 |
|---|---|---|---|---|---|
| `gdelt-doc-ai-commercial` | GDELT DOC 2.0 | A | official-api | fact-support | 全球新闻广覆盖 |
| `aihot-virxact-selected` | AI HOT selected items | M | official-api | source-router | 中文 AI 精选采集通道 |
| `follow-builders-monitor` | follow-builders | M | manual-review | source-router | Builder 观点与早期线索 |
| `hacker-news-algolia-ai` | HN Algolia | C | official-api | lead-only | 开发者讨论线索 |
| `hacker-news-firebase-top` | HN Firebase | C | official-api | lead-only | 开发者热门线索 |
| `github-search-ai-agent` | GitHub Search API | B | official-api | fact-support | 开源与开发者生态 |
| `arxiv-api-ai-agent` | arXiv API | B | official-api | fact-support | 研究与技术早期信号 |
| `openai-news-docs-changelog` | OpenAI official | S | rss/public-web | fact-main | 官方产品与 API |
| `anthropic-news-research` | Anthropic official | S | rss/public-web | fact-main | Claude / research / safety |
| `google-deepmind-blog` | Google AI / DeepMind | S | public-web | fact-main | Gemini / research |
| `microsoft-ai-blog` | Microsoft AI / Azure AI | S | rss/public-web | fact-main | Copilot / enterprise AI |
| `github-blog-ai` | GitHub Blog AI | S | rss | fact-main | AI coding / agent workflow |
| `nvidia-ai-blog` | NVIDIA AI Blog | S | rss | fact-main | AI infrastructure |
| `techcrunch-ai` | TechCrunch AI | A | rss | fact-support | startups / funding |
| `reuters-ai-search` | Reuters AI search | A | search-only | fact-support | regulation / corporate news |
| `venturebeat-ai` | VentureBeat AI | A | rss | fact-support | enterprise AI |
| `yc-companies-public` | YC Companies | B | public-web | lead-only | early startup clusters |
| `a16z-ai-blog` | a16z AI | B | rss/public-web | fact-support | investment thesis |
| `sequoia-ai-posts` | Sequoia AI posts | B | public-web | fact-support | investment thesis |
| `aws-marketplace-ai` | AWS Marketplace | B | public-web | fact-support | procurement-ready listings |
| `azure-marketplace-ai` | Azure Marketplace | B | public-web | fact-support | procurement-ready listings |
| `huggingface-papers-models` | Hugging Face | B | public-web | lead-only | open model ecosystem |

## 4. 默认禁用但登记来源

| source_id | 来源 | 禁用原因 | 后续条件 |
|---|---|---|---|
| `product-hunt-api-v2` | Product Hunt API v2 | requires-key | 用户提供 token 或改用 public-web 手动复核 |
| `reddit-api-ai` | Reddit API | requires-consent | 平台授权和用户确认 |
| `x-builder-public` | X / Twitter | requires-consent | 只允许官方 API 或已批准 Builder 管线 |
| `linkedin-company-posts` | LinkedIn | requires-consent | 官方审批 / 用户确认 |
| `crunchbase-api` | Crunchbase API | requires-key | 付费 / 审批后启用 |

## 5. AI HOT / follow-builders 新口径

用户要求安装新的新闻源 `KKKKhazix/khazix-skills` 中的 `aihot`。

已完成静态审查：

- 安装路径：`C:\Users\86186\.skill-store\aihot\SKILL.md`
- 来源 API：`https://aihot.virxact.com/api/public/items`
- 鉴权：无。
- 主要字段：title / url / source / publishedAt / summary / category。
- 风险：聚合摘要不是原文，不得作为事实主证据。

AI HOT 使用方式：

```text
AI HOT selected items
-> 发现中文 AI 圈高频线索
-> 回看原始 URL
-> 用官方来源 / A 级媒体 / GitHub / arXiv / GDELT 二次搜索补证
-> 满足 3 个 S/A/B 来源后才可进入 Front Signal
```

follow-builders 使用方式：

```text
follow-builders monitored feed
-> 发现 Builder 原始观点 / demo / 实践反馈
-> 保留原始 post / video / blog URL
-> 观点进入 Point / 观点校准
-> 事实性主张必须再回找官方来源、产品页、GitHub、论文或 A 级媒体
-> 补齐 S/A/B 后才可进入 Signal / Trend / Opportunity 事实层
```

因此，AI HOT 和 follow-builders 不再被当作普通来源等级分类；它们是获取方式。每条 item 的原始 URL 才进入 S/A/B/C 证据分级。

## 6. Probe 与质量闸门

本任务新增：

```text
agent-workflow/tools/v2-source-probe.mjs
agent-workflow/tools/v2-source-quality-gate.mjs
```

最小 probe 覆盖：

- GDELT DOC 2.0。
- AI HOT selected items。
- Hacker News Algolia。
- GitHub Search API。
- arXiv API。

质量闸门检查：

- registry JSON 可解析。
- enabled source 字段完整。
- enabled source 至少覆盖 4 类来源。
- S/A/B 来源均存在。
- requires-key / requires-consent 默认禁用。
- C 级来源不允许 fact-main。

## 7. 扩大采集后的生产口径

用户确认从原始 `Raw 30-50` 扩大为更宽的采集漏斗。

正式口径：

```text
Raw 80-150
-> Pool 20-30
-> Structured 8-15
-> Front Signal 3-5
-> Deep Dive 1-2
-> Trend Updates 3-5
```

三档执行：

| 场景 | Raw | Pool | Structured | Front | Deep Dive | Trend |
|---|---:|---:|---:|---:|---:|---:|
| 日常默认 | 80-120 | 20-25 | 8-12 | 3 | 1 | 3 |
| 高信号日 | 120-150 | 25-30 | 12-15 | 4-5 | 1-2 | 4-5 |
| 降级日 | 50-80 | 12-20 | 5-8 | 2-3 | 0-1 | 1-3 |

扩大采集只扩大候选池，不降低发布阈值。前台展示和深挖仍由证据质量决定，不能为了填满数量硬凑。
